const pool = require('../db');

const FIXED_DAILY_LIMIT = 1000;
const STAGE_DELAY_MAP = { 1: 8000, 2: 5000, 3: 3000, 4: 2000, 5: 1000 };

let migrationDone = false;

async function columnExists(table, column) {
  const { rows } = await pool.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  return (rows[0]?.cnt ?? 0) > 0;
}

async function ensureSenderColumns() {
  if (migrationDone) return;

  await pool.query(`ALTER TABLE sender_accounts MODIFY COLUMN refresh_token TEXT NULL`).catch(() => {});

  const additions = [
    { col: 'type',            def: "VARCHAR(50) DEFAULT 'gmail'" },
    { col: 'smtp_host',       def: 'VARCHAR(255)' },
    { col: 'smtp_port',       def: 'INT' },
    { col: 'smtp_user',       def: 'VARCHAR(255)' },
    { col: 'smtp_pass',       def: 'TEXT' },
    { col: 'last_sent_at',    def: 'DATETIME' },
    { col: 'warmup_stage',    def: 'INT DEFAULT 1' },
    { col: 'reply_count',     def: 'INT DEFAULT 0' },
    { col: 'bounce_count',    def: 'INT DEFAULT 0' },
  ];

  for (const { col, def } of additions) {
    const exists = await columnExists('sender_accounts', col);
    if (!exists) {
      await pool.query(`ALTER TABLE sender_accounts ADD COLUMN ${col} ${def}`).catch(e =>
        console.error(`[senderService] Failed to add column ${col}:`, e.message)
      );
    }
  }

  await pool.query(`UPDATE sender_accounts SET type = 'gmail' WHERE type IS NULL`).catch(() => {});
  // Immediately lift sender_accounts.daily_limit to 1000 for all accounts
  // that were previously set to a lower value (e.g. 500 from an earlier run today).
  // Uses today's date so it won't over-count sends already recorded.
  await pool.query(
    `UPDATE sender_accounts SET daily_limit = ? WHERE daily_limit < ?`,
    [FIXED_DAILY_LIMIT, FIXED_DAILY_LIMIT]
  ).catch(e => console.error('[senderService] daily_limit lift error:', e.message));
  console.log('[senderService] sender_accounts daily_limit lifted to', FIXED_DAILY_LIMIT);

  migrationDone = true;
}

async function checkGlobalLimit() {
  const { rows } = await pool.query('SELECT * FROM system_limits LIMIT 1');
  const limits = rows[0];
  if (!limits) return { allowed: true };

  // Auto-reset when the day rolls over — mirrors resetIfNewDay() for individual senders.
  // Without this, a stale counter from a missed midnight cron (e.g. server restart)
  // blocks all sends until the next midnight reset runs.
  const today = new Date().toISOString().split('T')[0];
  const lastReset = limits.last_reset_date
    ? new Date(limits.last_reset_date).toISOString().split('T')[0]
    : null;
  if (lastReset !== today) {
    await pool.query(`UPDATE system_limits SET daily_total_sent = 0, last_reset_date = ?`, [today]);
    console.log(`[GLOBAL LIMIT] New day detected — reset daily_total_sent to 0 (was ${limits.daily_total_sent})`);
    return { allowed: true };
  }

  if (limits.daily_total_sent >= limits.daily_global_limit) return { allowed: false, reason: 'GLOBAL LIMIT REACHED' };
  return { allowed: true };
}

async function resetIfNewDay(sender) {
  const today = new Date().toISOString().split('T')[0];
  const lastReset = sender.last_reset_date ? new Date(sender.last_reset_date).toISOString().split('T')[0] : null;
  if (lastReset !== today) {
    await pool.query(
      `UPDATE sender_accounts SET daily_sent_count = 0, last_reset_date = ?, daily_limit = ? WHERE email = ?`,
      [today, FIXED_DAILY_LIMIT, sender.email]
    );
    return { ...sender, daily_sent_count: 0, daily_limit: FIXED_DAILY_LIMIT };
  }
  return sender;
}

async function prepareSender(email) {
  if (!email) throw new Error('Sender email is required');
  await ensureSenderColumns();

  const globalCheck = await checkGlobalLimit();
  if (!globalCheck.allowed) return { allowed: false, reason: globalCheck.reason, isGlobal: true };

  const { rows } = await pool.query('SELECT * FROM sender_accounts WHERE email = ?', [email]);
  if (rows.length === 0) throw new Error(`Sender account not found: ${email}`);

  const sender = await resetIfNewDay(rows[0]);
  if (sender.status !== 'active') return { allowed: false, reason: `Account status is ${sender.status}` };

  console.log(`[LIMIT] ${email} - Usage: ${sender.daily_sent_count} / ${sender.daily_limit}`);
  if (sender.daily_sent_count >= sender.daily_limit) return { allowed: false, reason: 'ACCOUNT LIMIT REACHED' };

  const delayMs = STAGE_DELAY_MAP[sender.warmup_stage] || 2000;
  return { allowed: true, sender, delayMs };
}

async function recordSuccess(email) {
  await pool.query(
    `UPDATE sender_accounts SET daily_sent_count = daily_sent_count + 1, last_sent_at = NOW(), updated_at = NOW() WHERE email = ?`,
    [email]
  );
  await pool.query(`UPDATE system_limits SET daily_total_sent = daily_total_sent + 1`);
}

async function getNextSender(type = null) {
  await ensureSenderColumns();
  const today = new Date().toISOString().split('T')[0];
  await pool.query(
    `UPDATE sender_accounts SET daily_sent_count = 0, last_reset_date = ?, daily_limit = ?
     WHERE (last_reset_date IS NULL OR last_reset_date != ?)`,
    [today, FIXED_DAILY_LIMIT, today]
  );

  const { rows } = type
    ? await pool.query(
        `SELECT * FROM sender_accounts
         WHERE status = 'active' AND is_connected = 1
           AND daily_sent_count < daily_limit
           AND COALESCE(type, 'gmail') = ?
         ORDER BY daily_sent_count ASC LIMIT 1`,
        [type]
      )
    : await pool.query(
        `SELECT * FROM sender_accounts
         WHERE status = 'active' AND is_connected = 1
           AND daily_sent_count < daily_limit
         ORDER BY daily_sent_count ASC LIMIT 1`
      );

  if (rows[0]) console.log(`[SENDER] Selected: ${rows[0].email} (${rows[0].daily_sent_count}/${rows[0].daily_limit}) type=${rows[0].type}`);
  return rows[0] || null;
}

async function getSenderStats() {
  await ensureSenderColumns();
  const today = new Date().toISOString().split('T')[0];
  await pool.query(
    `UPDATE sender_accounts SET daily_sent_count = 0, last_reset_date = ?, daily_limit = ?
     WHERE (last_reset_date IS NULL OR last_reset_date != ?)`,
    [today, FIXED_DAILY_LIMIT, today]
  );
  const { rows } = await pool.query(`
    SELECT email, daily_sent_count, daily_limit, status, is_connected,
           COALESCE(type, 'gmail') AS type
    FROM sender_accounts ORDER BY type ASC, email ASC
  `);
  return rows;
}

async function getActiveSenders() {
  const { rows } = await pool.query(
    `SELECT email, warmup_stage, COALESCE(type, 'gmail') AS type
     FROM sender_accounts WHERE is_connected = 1 AND status = 'active'`
  );
  return rows;
}

async function resetAllLimits() {
  const today = new Date().toISOString().split('T')[0];
  console.log(`[CRON] Midnight Reset for ${today}`);
  await pool.query(`UPDATE system_limits SET daily_total_sent = 0, last_reset_date = ?`, [today]);
  await pool.query(`UPDATE sender_accounts SET daily_sent_count = 0, last_reset_date = ?`, [today]);
}

async function getGlobalStats() {
  const { rows } = await pool.query('SELECT daily_total_sent, daily_global_limit FROM system_limits LIMIT 1');
  return rows[0] || { daily_total_sent: 0, daily_global_limit: 500 };
}

ensureSenderColumns().catch(err => console.error('[senderService] Migration error:', err.message));

module.exports = {
  prepareSender,
  recordSuccess,
  getActiveSenders,
  resetAllLimits,
  getNextSender,
  getSenderStats,
  getGlobalStats,
  ensureSenderColumns,
};
