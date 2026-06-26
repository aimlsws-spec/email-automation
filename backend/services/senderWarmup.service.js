const pool = require('../db');

// Hard cap: no single sender may ever exceed this per calendar day.
const MAX_DAILY_SEND = 1000;

// Returns today's date string (YYYY-MM-DD) in IST (UTC+5:30).
function todayInIST() {
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  return new Date(Date.now() + istOffsetMs).toISOString().slice(0, 10);
}

function formatDate(d) {
  if (!d) return null;
  // MySQL DATE columns are returned as JS Dates at midnight local time (IST on this server).
  // Apply IST offset so the YYYY-MM-DD slice matches what was stored.
  const date = d instanceof Date ? d : new Date(d);
  const istOffsetMs = 5.5 * 60 * 60 * 1000;
  return new Date(date.getTime() + istOffsetMs).toISOString().slice(0, 10);
}

const WARMUP_PLAN = [
  { day:  1, min: 100, max: 150 },
  { day:  2, min: 150, max: 200 },
  { day:  3, min: 200, max: 250 },
  { day:  5, min: 250, max: 300 },
  { day:  7, min: 300, max: 400 },
  { day: 10, min: 400, max: 500 },
  { day: 14, min: 500, max: 600 },
  { day: 21, min: 700, max: 850 },
  { day: 30, min: 1000, max: 1000 }, // graduated senders always get the full daily cap
];

let tableMigrated = false;

async function colExists(column) {
  const { rows } = await pool.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'sender_warmup' AND COLUMN_NAME = ?`,
    [column]
  );
  return (rows[0]?.cnt ?? 0) > 0;
}

async function ensureTable() {
  if (tableMigrated) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sender_warmup (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      sender_email    VARCHAR(255) NOT NULL UNIQUE,
      start_date      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      current_day     INT NOT NULL DEFAULT 1,
      daily_min       INT NOT NULL DEFAULT 20,
      daily_max       INT NOT NULL DEFAULT 30,
      daily_limit     INT NOT NULL DEFAULT 20,
      current_sent    INT NOT NULL DEFAULT 0,
      status          VARCHAR(50) NOT NULL DEFAULT 'active',
      last_reset_date DATE DEFAULT NULL,
      last_updated    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Add columns that may be missing if table was created from an older schema
  const migrations = [
    { col: 'daily_min',       def: 'INT NOT NULL DEFAULT 20' },
    { col: 'daily_max',       def: 'INT NOT NULL DEFAULT 30' },
    { col: 'status',          def: "VARCHAR(50) NOT NULL DEFAULT 'active'" },
    { col: 'last_reset_date', def: 'DATE DEFAULT NULL' },
    { col: 'last_updated',    def: 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
  ];

  for (const { col, def } of migrations) {
    const exists = await colExists(col);
    if (!exists) {
      await pool.query(`ALTER TABLE sender_warmup ADD COLUMN ${col} ${def}`).catch(e =>
        console.error(`[senderWarmup] Failed to add column ${col}:`, e.message)
      );
    }
  }

  await pool.query(`ALTER TABLE sender_warmup ADD INDEX idx_sender_warmup_sender (sender_email)`).catch(() => {});

  // Lift all active senders to the full 1000/day ceiling immediately.
  // Only touches daily_limit / daily_min / daily_max / current_day — leaves
  // current_sent untouched so today's already-sent count is preserved.
  await pool.query(`
    UPDATE sender_warmup
    SET current_day = 30,
        daily_min   = 1000,
        daily_max   = 1000,
        daily_limit = 1000
    WHERE status = 'active' AND daily_limit < 1000
  `).catch(e => console.error('[senderWarmup] Limit-lift migration error:', e.message));
  console.log('[senderWarmup] Limit lift: all active senders set to 1000/day.');

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

function cappedLimit(limit) {
  return Math.min(limit, MAX_DAILY_SEND);
}

function domainFromEmail(email) {
  return email.split('@')[1]?.toLowerCase() || email.toLowerCase();
}

async function getOrCreateRecord(senderEmail) {
  await ensureTable();

  const { rows } = await pool.query('SELECT * FROM sender_warmup WHERE sender_email = ?', [senderEmail]);
  if (rows[0]) {
    const todayIST = todayInIST();
    const lastReset = formatDate(rows[0].last_reset_date);

    console.log(`[WARMUP DEBUG] ${senderEmail} — last_reset=${lastReset || 'never'} today_IST=${todayIST} current_sent=${rows[0].current_sent} daily_limit=${rows[0].daily_limit} status=${rows[0].status}`);

    // Self-healing calendar-day reset (IST). Runs automatically on the first
    // job attempt of the day, so the system recovers even if the midnight cron
    // was missed (server restart, timezone skew, etc.).
    if (!lastReset || lastReset < todayIST) {
      const day = calculateCurrentDay(rows[0].start_date);
      const range = getWarmupRange(day);
      const limit = cappedLimit(randomBetween(range.min, range.max));
      await pool.query(
        `UPDATE sender_warmup
         SET current_day = ?, daily_min = ?, daily_max = ?, daily_limit = ?, current_sent = 0, last_reset_date = ?, last_updated = NOW()
         WHERE sender_email = ?`,
        [day, range.min, range.max, limit, todayIST, senderEmail]
      );
      console.log(`[WARMUP RESET] Auto-reset ${senderEmail} — Day ${day}, new limit: ${limit} (${range.min}–${range.max}), IST date: ${todayIST}`);
      return { ...rows[0], current_day: day, daily_min: range.min, daily_max: range.max, daily_limit: limit, current_sent: 0, last_reset_date: todayIST };
    }

    // Legacy record with old low limit — bump and reset counter.
    if (rows[0].daily_limit <= 30) {
      const range = getWarmupRange(rows[0].current_day || 1);
      const newLimit = cappedLimit(randomBetween(range.min, range.max));
      await pool.query(
        `UPDATE sender_warmup SET daily_min = ?, daily_max = ?, daily_limit = ?, current_sent = 0, last_reset_date = ? WHERE sender_email = ?`,
        [range.min, range.max, newLimit, todayIST, senderEmail]
      );
      console.log(`[WARMUP] Migrated legacy record for ${senderEmail}: limit ${rows[0].daily_limit} → ${newLimit}, counter reset to 0`);
      return { ...rows[0], daily_limit: newLimit, daily_min: range.min, daily_max: range.max, current_sent: 0 };
    }
    // Stale counter guard: current_sent >= daily_limit but date is today — do NOT
    // auto-reset here (the limit is legitimately used up for today). Only reset if
    // current_sent somehow exceeds the limit (data corruption).
    if (rows[0].current_sent > rows[0].daily_limit) {
      console.warn(`[WARMUP] ${senderEmail} has stale counter: current_sent=${rows[0].current_sent} > daily_limit=${rows[0].daily_limit}. Resetting to 0.`);
      await pool.query(
        `UPDATE sender_warmup SET current_sent = 0 WHERE sender_email = ?`,
        [senderEmail]
      );
      return { ...rows[0], current_sent: 0 };
    }
    return rows[0];
  }

  const range = getWarmupRange(1);
  const limit = cappedLimit(randomBetween(range.min, range.max));
  const todayIST = todayInIST();
  await pool.query(
    `INSERT INTO sender_warmup (sender_email, start_date, current_day, daily_min, daily_max, daily_limit, current_sent, status, last_reset_date)
     VALUES (?, NOW(), 1, ?, ?, ?, 0, 'active', ?)
     ON DUPLICATE KEY UPDATE sender_email = sender_email`,
    [senderEmail, range.min, range.max, limit, todayIST]
  );
  const { rows: created } = await pool.query('SELECT * FROM sender_warmup WHERE sender_email = ?', [senderEmail]);
  console.log(`[WARMUP] Initialised new sender: ${senderEmail} — limit today: ${limit}`);
  return created[0];
}

async function getDailyLimit(senderEmail, healthStats = null) {
  const record = await getOrCreateRecord(senderEmail);
  const range = getWarmupRange(record.current_day);
  if (healthStats) {
    const { bounceRate = 0, openRate = 0 } = healthStats;
    return cappedLimit((bounceRate < 5 && openRate > 15) ? range.max : range.min);
  }
  return cappedLimit(record.daily_limit);
}

async function canSendEmail(senderEmail) {
  const record = await getOrCreateRecord(senderEmail);
  if (record.status === 'paused') {
    console.log(`[WARMUP] ${senderEmail} is PAUSED — blocking send`);
    return false;
  }
  if (record.current_sent >= record.daily_limit) {
    console.log(`[WARMUP] ${senderEmail} hit sender daily limit: ${record.current_sent}/${record.daily_limit}`);
    return false;
  }
  return true;
}

async function incrementSenderCount(senderEmail) {
  await pool.query(
    `UPDATE sender_warmup SET current_sent = current_sent + 1, last_updated = NOW() WHERE sender_email = ?`,
    [senderEmail]
  );
}

async function resetDailyCounters() {
  await ensureTable();
  const todayIST = todayInIST();
  const { rows } = await pool.query(`SELECT id, sender_email, start_date FROM sender_warmup WHERE status = 'active'`);

  for (const row of rows) {
    const day = calculateCurrentDay(row.start_date);
    const range = getWarmupRange(day);
    const limit = cappedLimit(randomBetween(range.min, range.max));
    await pool.query(
      `UPDATE sender_warmup
       SET current_day = ?, daily_min = ?, daily_max = ?, daily_limit = ?, current_sent = 0, last_reset_date = ?, last_updated = NOW()
       WHERE id = ?`,
      [day, range.min, range.max, limit, todayIST, row.id]
    );
    console.log(`[WARMUP RESET] ${row.sender_email} — Day ${day}, sender limit today: ${limit} (${range.min}–${range.max}), IST date: ${todayIST}`);
  }
  console.log(`[WARMUP RESET] Done. Reset ${rows.length} sender(s).`);
}

ensureTable().catch(err => console.error('[senderWarmup] Migration error:', err.message));

module.exports = {
  getWarmupRange,
  calculateCurrentDay,
  getDailyLimit,
  canSendEmail,
  incrementSenderCount,
  resetDailyCounters,
  domainFromEmail,
  getOrCreateRecord,
};