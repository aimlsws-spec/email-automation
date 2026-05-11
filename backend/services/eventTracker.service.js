const pool = require('../db');

let migrated = false;

async function colExistsIn(table, column) {
  const { rows } = await pool.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  return (rows[0]?.cnt ?? 0) > 0;
}

async function ensureTables() {
  if (migrated) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS domain_stats (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      domain           VARCHAR(255) NOT NULL UNIQUE,
      total_sent       INT NOT NULL DEFAULT 0,
      total_bounced    INT NOT NULL DEFAULT 0,
      total_replied    INT NOT NULL DEFAULT 0,
      total_opened     INT NOT NULL DEFAULT 0,
      spam_reports     INT NOT NULL DEFAULT 0,
      daily_sent       INT NOT NULL DEFAULT 0,
      last_sent_at     DATETIME,
      reputation_score FLOAT NOT NULL DEFAULT 100,
      created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Migrate existing domain_stats tables that may have been created with old schema
  const statsColumns = [
    { col: 'total_replied',    def: 'INT NOT NULL DEFAULT 0' },
    { col: 'total_opened',     def: 'INT NOT NULL DEFAULT 0' },
    { col: 'spam_reports',     def: 'INT NOT NULL DEFAULT 0' },
    { col: 'daily_sent',       def: 'INT NOT NULL DEFAULT 0' },
    { col: 'last_sent_at',     def: 'DATETIME' },
    { col: 'reputation_score', def: 'FLOAT NOT NULL DEFAULT 100' },
    { col: 'created_at',       def: 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP' },
    { col: 'updated_at',       def: 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
  ];
  for (const { col, def } of statsColumns) {
    const exists = await colExistsIn('domain_stats', col);
    if (!exists) {
      await pool.query(`ALTER TABLE domain_stats ADD COLUMN ${col} ${def}`).catch(e =>
        console.error(`[eventTracker] Failed to add domain_stats.${col}:`, e.message)
      );
    }
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS domain_events (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      lead_email  VARCHAR(255),
      campaign_id INT,
      domain      VARCHAR(255) NOT NULL,
      event_type  VARCHAR(100) NOT NULL,
      metadata    JSON,
      created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migrate existing domain_events tables (old schema had 'type' not 'event_type')
  const eventsColumns = [
    { col: 'event_type', def: "VARCHAR(100) NOT NULL DEFAULT ''" },
    { col: 'metadata',   def: 'JSON' },
  ];
  for (const { col, def } of eventsColumns) {
    const exists = await colExistsIn('domain_events', col);
    if (!exists) {
      await pool.query(`ALTER TABLE domain_events ADD COLUMN ${col} ${def}`).catch(e =>
        console.error(`[eventTracker] Failed to add domain_events.${col}:`, e.message)
      );
    }
  }

  await pool.query(`ALTER TABLE domain_events ADD INDEX idx_domain_events_domain (domain)`).catch(() => {});
  await pool.query(`ALTER TABLE domain_events ADD INDEX idx_domain_events_event_type (event_type)`).catch(() => {});
  await pool.query(`ALTER TABLE domain_events ADD INDEX idx_domain_events_created_at (created_at)`).catch(() => {});

  migrated = true;
}

ensureTables().catch(err => console.error('[eventTracker] Migration error:', err.message));

function calculateReputationScore({ total_sent, total_bounced, total_replied, spam_reports }) {
  if (!total_sent || total_sent === 0) return 100;
  const bounceRate = total_bounced / total_sent;
  const replyRate  = total_replied / total_sent;
  const spamRate   = spam_reports  / total_sent;
  const score = 100 - (bounceRate * 40) - (spamRate * 50) + (replyRate * 30);
  return Math.min(100, Math.max(0, parseFloat(score.toFixed(1))));
}

function domainHealthStatus(score) {
  if (score >= 80) return 'healthy';
  if (score >= 50) return 'warming';
  return 'risky';
}

async function incrementDomainStats(domain, eventType) {
  await ensureTables();
  const col = {
    sent:    'total_sent',
    bounced: 'total_bounced',
    replied: 'total_replied',
    opened:  'total_opened',
    spam:    'spam_reports',
  }[eventType];
  if (!col) return;

  if (eventType === 'sent') {
    await pool.query(
      `INSERT INTO domain_stats (domain, total_sent, daily_sent, last_sent_at, updated_at)
       VALUES (?, 1, 1, NOW(), NOW())
       ON DUPLICATE KEY UPDATE total_sent = total_sent + 1, daily_sent = daily_sent + 1, last_sent_at = NOW(), updated_at = NOW()`,
      [domain]
    );
  } else {
    await pool.query(
      `INSERT INTO domain_stats (domain, ${col}, updated_at) VALUES (?, 1, NOW())
       ON DUPLICATE KEY UPDATE ${col} = ${col} + 1, updated_at = NOW()`,
      [domain]
    );
  }

  const { rows } = await pool.query(
    `SELECT total_sent, total_bounced, total_replied, spam_reports FROM domain_stats WHERE domain = ?`,
    [domain]
  );
  if (rows[0]) {
    const score = calculateReputationScore(rows[0]);
    await pool.query(`UPDATE domain_stats SET reputation_score = ? WHERE domain = ?`, [score, domain]);
  }
}

async function trackEvent({ lead_email, campaign_id, domain, type, metadata = {} }) {
  if (!domain || !type) return;
  await ensureTables();
  try {
    await pool.query(
      `INSERT INTO domain_events (lead_email, campaign_id, domain, event_type, metadata) VALUES (?, ?, ?, ?, ?)`,
      [lead_email || null, campaign_id || null, domain, type, JSON.stringify(metadata)]
    );
    await incrementDomainStats(domain, type);
  } catch (err) {
    console.error(`[eventTracker] trackEvent failed for ${domain}/${type}:`, err.message);
  }
}

async function resetDailyDomainStats() {
  await ensureTables();
  await pool.query(`UPDATE domain_stats SET daily_sent = 0, updated_at = NOW()`);
  console.log('[eventTracker] Daily domain stats reset complete');
}

async function getAllDomainStats() {
  await ensureTables();
  const { rows } = await pool.query(`SELECT * FROM domain_stats ORDER BY total_sent DESC`);
  return rows.map(r => ({
    ...r,
    reply_rate:  r.total_sent > 0 ? parseFloat((r.total_replied / r.total_sent * 100).toFixed(1)) : 0,
    bounce_rate: r.total_sent > 0 ? parseFloat((r.total_bounced / r.total_sent * 100).toFixed(1)) : 0,
    spam_rate:   r.total_sent > 0 ? parseFloat((r.spam_reports  / r.total_sent * 100).toFixed(1)) : 0,
    status: domainHealthStatus(r.reputation_score || 100),
  }));
}

module.exports = { trackEvent, incrementDomainStats, resetDailyDomainStats, getAllDomainStats, domainHealthStatus };
