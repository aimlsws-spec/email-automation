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

  // Compute metrics from leads (ground truth) filtered to real sending domains only.
  // Excludes recipient domains like gmail.com by cross-referencing sender_accounts.
  // Uses a derived table to satisfy MySQL ONLY_FULL_GROUP_BY.
  const { rows } = await pool.query(`
    SELECT
      agg.domain,
      agg.total_leads,
      agg.total_sent,
      agg.total_bounced,
      agg.total_replied,
      COALESCE(ds.spam_reports, 0) AS spam_reports,
      COALESCE(ds.daily_sent,   0) AS daily_sent
    FROM (
      SELECT
        SUBSTRING_INDEX(l.sender_email, '@', -1)                                      AS domain,
        COUNT(*)                                                                       AS total_leads,
        SUM(CASE WHEN l.status NOT IN ('Pending','Failed') THEN 1 ELSE 0 END)        AS total_sent,
        SUM(CASE WHEN l.is_bounced = 1 THEN 1 ELSE 0 END)                            AS total_bounced,
        SUM(CASE WHEN l.has_replied = 1 OR l.replied = 1 THEN 1 ELSE 0 END)         AS total_replied
      FROM leads l
      WHERE l.sender_email IS NOT NULL
        AND l.sender_email <> ''
        AND SUBSTRING_INDEX(l.sender_email, '@', -1) IN (
          SELECT DISTINCT SUBSTRING_INDEX(email, '@', -1) FROM sender_accounts
        )
      GROUP BY SUBSTRING_INDEX(l.sender_email, '@', -1)
    ) AS agg
    LEFT JOIN domain_stats ds ON ds.domain = agg.domain
    ORDER BY agg.total_sent DESC
  `);

  return rows.map(r => {
    const total_sent    = parseInt(r.total_sent)    || 0;
    const total_bounced = parseInt(r.total_bounced) || 0;
    const total_replied = parseInt(r.total_replied) || 0;
    const spam_reports  = parseInt(r.spam_reports)  || 0;

    const bounce_rate = total_sent > 0 ? parseFloat((total_bounced / total_sent * 100).toFixed(1)) : null;
    const reply_rate  = total_sent > 0 ? parseFloat((total_replied / total_sent * 100).toFixed(1)) : null;
    const spam_rate   = total_sent > 0 ? parseFloat((spam_reports  / total_sent * 100).toFixed(1)) : null;
    const score       = calculateReputationScore({ total_sent, total_bounced, total_replied, spam_reports });

    return {
      domain:           r.domain,
      total_leads:      parseInt(r.total_leads) || 0,
      total_sent,
      total_bounced,
      total_replied,
      spam_reports,
      daily_sent:       parseInt(r.daily_sent) || 0,
      reputation_score: score,
      bounce_rate,
      reply_rate,
      spam_rate,
      status: domainHealthStatus(score),
    };
  });
}

module.exports = { trackEvent, incrementDomainStats, resetDailyDomainStats, getAllDomainStats, domainHealthStatus };
