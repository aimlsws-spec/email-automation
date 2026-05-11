const pool = require('../db');

const DEFAULT_DAILY_CAP = 80;

async function getActiveSenders(domain) {
  const { rows } = await pool.query(
    `SELECT *
     FROM sender_accounts
     WHERE status = 'active'
       AND is_connected = 1
       AND LOWER(email) LIKE ?`,
    [`%@${domain.toLowerCase()}`]
  );
  return rows;
}

async function getAvailableSenders(domain) {
  const { rows } = await pool.query(
    `SELECT *
     FROM sender_accounts
     WHERE status = 'active'
       AND is_connected = 1
       AND daily_sent_count < COALESCE(daily_limit, ?)
       AND LOWER(email) LIKE ?
     ORDER BY daily_sent_count ASC`,
    [DEFAULT_DAILY_CAP, `%@${domain.toLowerCase()}`]
  );
  return rows;
}

async function selectSender(domain) {
  const available = await getAvailableSenders(domain);
  if (available.length === 0) return null;
  const poolSize = Math.max(1, Math.ceil(available.length / 3));
  const candidates = available.slice(0, poolSize);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

async function incrementSenderCount(email) {
  await pool.query(
    `UPDATE sender_accounts
     SET daily_sent_count = daily_sent_count + 1, last_sent_at = NOW(), updated_at = NOW()
     WHERE email = ?`,
    [email]
  );
}

async function resetSenderCounts() {
  const today = new Date().toISOString().split('T')[0];
  await pool.query(
    `UPDATE sender_accounts SET daily_sent_count = 0, last_reset_date = ?
     WHERE (last_reset_date IS NULL OR DATE(last_reset_date) != ?)`,
    [today, today]
  );
  console.log('[SENDER POOL] Daily counts reset.');
}

async function ensureSenderInPool(email, dailyCap = DEFAULT_DAILY_CAP) {
  await pool.query(
    `UPDATE sender_accounts
     SET daily_limit = COALESCE(NULLIF(daily_limit, 0), ?)
     WHERE email = ? AND (daily_limit IS NULL OR daily_limit = 0)`,
    [dailyCap, email]
  );
}

module.exports = {
  getActiveSenders,
  getAvailableSenders,
  selectSender,
  incrementSenderCount,
  resetSenderCounts,
  ensureSenderInPool,
  DEFAULT_DAILY_CAP,
};
