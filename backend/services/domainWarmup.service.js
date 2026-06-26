const pool = require('../db');

const WARMUP_PLAN = [
  { day:  1, min: 100, max: 150 },
  { day:  2, min: 150, max: 200 },
  { day:  3, min: 200, max: 250 },
  { day:  5, min: 250, max: 300 },
  { day:  7, min: 300, max: 400 },
  { day: 10, min: 400, max: 500 },
  { day: 14, min: 500, max: 600 },
];

let tableMigrated = false;

async function colExists(column) {
  const { rows } = await pool.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'domain_warmup' AND COLUMN_NAME = ?`,
    [column]
  );
  return (rows[0]?.cnt ?? 0) > 0;
}

async function ensureTable() {
  if (tableMigrated) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS domain_warmup (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      domain       VARCHAR(255) NOT NULL UNIQUE,
      start_date   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      current_day  INT NOT NULL DEFAULT 1,
      daily_min    INT NOT NULL DEFAULT 20,
      daily_max    INT NOT NULL DEFAULT 30,
      daily_limit  INT NOT NULL DEFAULT 20,
      current_sent INT NOT NULL DEFAULT 0,
      status       VARCHAR(50) NOT NULL DEFAULT 'active',
      last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Add columns that may be missing if table was created from an older schema
  const migrations = [
    { col: 'daily_min',    def: 'INT NOT NULL DEFAULT 20' },
    { col: 'daily_max',    def: 'INT NOT NULL DEFAULT 30' },
    { col: 'status',       def: "VARCHAR(50) NOT NULL DEFAULT 'active'" },
    { col: 'last_updated', def: 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
  ];

  for (const { col, def } of migrations) {
    const exists = await colExists(col);
    if (!exists) {
      await pool.query(`ALTER TABLE domain_warmup ADD COLUMN ${col} ${def}`).catch(e =>
        console.error(`[domainWarmup] Failed to add column ${col}:`, e.message)
      );
    }
  }

  await pool.query(`ALTER TABLE domain_warmup ADD INDEX idx_domain_warmup_domain (domain)`).catch(() => {});
  tableMigrated = true;
}

function getWarmupRange(day) {
  for (let i = WARMUP_PLAN.length - 1; i >= 0; i--) {
    if (day >= WARMUP_PLAN[i].day) return { min: WARMUP_PLAN[i].min, max: WARMUP_PLAN[i].max };
  }
  return { min: WARMUP_PLAN[0].min, max: WARMUP_PLAN[0].max };
}

function calculateCurrentDay(startDate) {
  const diff = Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function domainFromEmail(email) {
  return email.split('@')[1]?.toLowerCase() || email.toLowerCase();
}

async function getOrCreateRecord(domain) {
  await ensureTable();

  const { rows } = await pool.query('SELECT * FROM domain_warmup WHERE domain = ?', [domain]);
  if (rows[0]) {
    // If existing record still has the old low limit (<= 30), bump it up and reset the
    // accumulated counter — old counter reflected a different limit regime and would
    // immediately block sending under the new higher limit.
    if (rows[0].daily_limit <= 30) {
      const range = getWarmupRange(rows[0].current_day || 1);
      const newLimit = randomBetween(range.min, range.max);
      await pool.query(
        `UPDATE domain_warmup SET daily_min = ?, daily_max = ?, daily_limit = ?, current_sent = 0 WHERE domain = ?`,
        [range.min, range.max, newLimit, domain]
      );
      console.log(`[WARMUP] Migrated legacy record for ${domain}: limit ${rows[0].daily_limit} → ${newLimit}, counter reset to 0`);
      return { ...rows[0], daily_limit: newLimit, daily_min: range.min, daily_max: range.max, current_sent: 0 };
    }
    // Guard: current_sent should never exceed daily_limit by a large margin unless the
    // counter accumulated before the limit was lowered (e.g. limit recalculated by reset
    // cron but counter not cleared because server was down). Reset it so sends can resume.
    if (rows[0].current_sent > rows[0].daily_limit) {
      console.warn(`[WARMUP] ${domain} has stale counter: current_sent=${rows[0].current_sent} > daily_limit=${rows[0].daily_limit}. Resetting to 0.`);
      await pool.query(
        `UPDATE domain_warmup SET current_sent = 0 WHERE domain = ?`,
        [domain]
      );
      return { ...rows[0], current_sent: 0 };
    }
    return rows[0];
  }

  const range = getWarmupRange(1);
  const limit = randomBetween(range.min, range.max);
  await pool.query(
    `INSERT INTO domain_warmup (domain, start_date, current_day, daily_min, daily_max, daily_limit, current_sent, status)
     VALUES (?, NOW(), 1, ?, ?, ?, 0, 'active')
     ON DUPLICATE KEY UPDATE domain = domain`,
    [domain, range.min, range.max, limit]
  );
  const { rows: created } = await pool.query('SELECT * FROM domain_warmup WHERE domain = ?', [domain]);
  console.log(`[WARMUP] Initialised new domain: ${domain} — limit today: ${limit}`);
  return created[0];
}

async function getDailyLimit(domain, healthStats = null) {
  const record = await getOrCreateRecord(domain);
  const range = getWarmupRange(record.current_day);
  if (healthStats) {
    const { bounceRate = 0, openRate = 0 } = healthStats;
    return (bounceRate < 5 && openRate > 15) ? range.max : range.min;
  }
  return record.daily_limit;
}

async function canSendEmail(domain) {
  const record = await getOrCreateRecord(domain);
  if (record.status === 'paused') {
    console.log(`[WARMUP] ${domain} is PAUSED — blocking send`);
    return false;
  }
  if (record.current_sent >= record.daily_limit) {
    console.log(`[WARMUP] ${domain} hit daily limit: ${record.current_sent}/${record.daily_limit}`);
    return false;
  }
  return true;
}

async function incrementDomainCount(domain) {
  await pool.query(
    `UPDATE domain_warmup SET current_sent = current_sent + 1, last_updated = NOW() WHERE domain = ?`,
    [domain]
  );
}

async function resetDailyCounters() {
  await ensureTable();
  const { rows } = await pool.query(`SELECT id, domain, start_date FROM domain_warmup WHERE status = 'active'`);

  for (const row of rows) {
    const day = calculateCurrentDay(row.start_date);
    const range = getWarmupRange(day);
    const limit = randomBetween(range.min, range.max);
    await pool.query(
      `UPDATE domain_warmup
       SET current_day = ?, daily_min = ?, daily_max = ?, daily_limit = ?, current_sent = 0, last_updated = NOW()
       WHERE id = ?`,
      [day, range.min, range.max, limit, row.id]
    );
    console.log(`[WARMUP RESET] ${row.domain} — Day ${day}, limit today: ${limit} (${range.min}–${range.max})`);
  }
  console.log(`[WARMUP RESET] Done. Reset ${rows.length} domain(s).`);
}

ensureTable().catch(err => console.error('[domainWarmup] Migration error:', err.message));

module.exports = {
  getWarmupRange,
  calculateCurrentDay,
  getDailyLimit,
  canSendEmail,
  incrementDomainCount,
  resetDailyCounters,
  domainFromEmail,
  getOrCreateRecord,
};