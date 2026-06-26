'use strict';

const pool = require('../db');

let tableReady = false;

async function ensureTable() {
  if (tableReady) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS unsubscribed_contacts (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      email           VARCHAR(255) NOT NULL UNIQUE,
      name            VARCHAR(255),
      campaign_id     INT,
      sender_email    VARCHAR(255),
      domain          VARCHAR(255),
      ip_address      VARCHAR(100),
      user_agent      TEXT,
      unsubscribed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      source          VARCHAR(50) NOT NULL DEFAULT 'email_link',
      reason          VARCHAR(500),
      INDEX idx_unsub_email    (email),
      INDEX idx_unsub_domain   (domain),
      INDEX idx_unsub_at       (unsubscribed_at),
      INDEX idx_unsub_campaign (campaign_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // One-time migration: pull any existing suppression_list rows so past
  // unsubscribes appear in the new dashboard immediately on first boot.
  await pool.query(`
    INSERT INTO unsubscribed_contacts (email, domain, source, unsubscribed_at)
    SELECT
      email,
      SUBSTRING_INDEX(email, '@', -1),
      'suppression_list',
      COALESCE(added_at, NOW())
    FROM suppression_list
    WHERE email IS NOT NULL AND email != ''
    ON DUPLICATE KEY UPDATE unsubscribed_at = unsubscribed_at
  `).catch(err => console.warn('[unsubscribe] suppression_list migration skipped:', err.message));

  tableReady = true;
}

// ─── Write ────────────────────────────────────────────────────────────────────

async function addUnsubscribe({
  email, name = null, campaignId = null, senderEmail = null,
  ipAddress = null, userAgent = null, source = 'email_link', reason = null,
}) {
  await ensureTable();

  // Double-decode then normalize — guards against %2540 from email clients
  let s = email || '';
  try { s = decodeURIComponent(s); } catch (_) {}
  try { s = decodeURIComponent(s); } catch (_) {}
  const normalEmail = s.toLowerCase().trim();

  console.log(`[UNSUBSCRIBE] addUnsubscribe raw="${email}" normalized="${normalEmail}" source=${source}`);

  if (!normalEmail || !normalEmail.includes('@')) {
    console.warn(`[UNSUBSCRIBE] addUnsubscribe REJECTED — invalid email: "${normalEmail}"`);
    return { created: false, rejected: true };
  }

  const domain = normalEmail.split('@')[1];

  const { rows: existing } = await pool.query(
    `SELECT id FROM unsubscribed_contacts WHERE email = ? LIMIT 1`, [normalEmail]
  );

  if (existing.length > 0) {
    await pool.query(
      `UPDATE unsubscribed_contacts SET unsubscribed_at = NOW() WHERE email = ?`, [normalEmail]
    );
    console.log(`[UNSUBSCRIBE] refreshed existing record: ${normalEmail}`);
    return { created: false };
  }

  await pool.query(
    `INSERT INTO unsubscribed_contacts
       (email, name, campaign_id, sender_email, domain, ip_address, user_agent, source, reason, unsubscribed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [normalEmail, name || null, campaignId || null, senderEmail || null,
     domain, ipAddress || null, userAgent || null, source, reason || null]
  );

  console.log(`[UNSUBSCRIBE] inserted new record: ${normalEmail} source=${source} campaign=${campaignId || 'none'}`);
  return { created: true };
}

async function importBulk(records) {
  await ensureTable();
  let added = 0; let skipped = 0;

  for (const { email, name, source, reason } of records) {
    if (!email || !email.includes('@')) { skipped++; continue; }
    const normalEmail = email.toLowerCase().trim();
    const domain = normalEmail.split('@')[1];
    try {
      await pool.query(
        `INSERT INTO unsubscribed_contacts (email, name, domain, source, reason, unsubscribed_at)
         VALUES (?, ?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE unsubscribed_at = NOW()`,
        [normalEmail, name || null, domain, source || 'import', reason || null]
      );
      added++;
    } catch { skipped++; }
  }

  console.log(`[UNSUBSCRIBE_ADDED] bulk: added=${added} skipped=${skipped}`);
  return { added, skipped };
}

async function removeById(id) {
  await ensureTable();
  const { rowCount } = await pool.query(
    `DELETE FROM unsubscribed_contacts WHERE id = ?`, [id]
  );
  if (rowCount > 0) console.log(`[UNSUBSCRIBE_REMOVED] id=${id}`);
  return rowCount > 0;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

async function isUnsubscribed(email) {
  await ensureTable();
  const normalEmail = email.toLowerCase().trim();
  // Check both new table and legacy suppression_list
  const { rows } = await pool.query(
    `SELECT 1 FROM unsubscribed_contacts WHERE email = ?
     UNION SELECT 1 FROM suppression_list WHERE email = ?
     LIMIT 1`,
    [normalEmail, normalEmail]
  );
  return rows.length > 0;
}

async function list({ page = 1, limit = 50, search = '', domain = '', startDate = '', endDate = '' } = {}) {
  await ensureTable();
  const offset = (Math.max(1, page) - 1) * limit;
  const conds = []; const params = [];

  if (search)    { conds.push('(email LIKE ? OR name LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
  if (domain)    { conds.push('domain = ?');                    params.push(domain); }
  if (startDate) { conds.push('unsubscribed_at >= ?');          params.push(startDate); }
  if (endDate)   { conds.push('unsubscribed_at <= ?');          params.push(`${endDate} 23:59:59`); }

  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';

  const { rows: countRows } = await pool.query(
    `SELECT COUNT(*) AS total FROM unsubscribed_contacts ${where}`, params
  );
  const total = parseInt(countRows[0]?.total || 0);

  const { rows } = await pool.query(
    `SELECT id, email, name, campaign_id, sender_email, domain, source, reason, unsubscribed_at
     FROM unsubscribed_contacts ${where}
     ORDER BY unsubscribed_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, total, page, limit, pages: Math.ceil(total / limit) };
}

async function getStats() {
  await ensureTable();

  const [[{ total }], [{ today }], [{ week }], [{ sent }]] = await Promise.all([
    pool.query(`SELECT COUNT(*) AS total FROM unsubscribed_contacts`),
    pool.query(`SELECT COUNT(*) AS today FROM unsubscribed_contacts WHERE DATE(unsubscribed_at) = CURDATE()`),
    pool.query(`SELECT COUNT(*) AS week FROM unsubscribed_contacts WHERE unsubscribed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`),
    pool.query(`SELECT COUNT(*) AS sent FROM leads WHERE status NOT IN ('Pending') AND status IS NOT NULL`),
  ].map(p => p.then(r => r.rows)));

  const totalN = parseInt(total || 0);
  const sentN  = parseInt(sent  || 0);
  return {
    total:   totalN,
    today:   parseInt(today || 0),
    week:    parseInt(week  || 0),
    rate:    sentN > 0 ? ((totalN / sentN) * 100).toFixed(2) : '0.00',
  };
}

async function getTrend(days = 30) {
  await ensureTable();
  const { rows } = await pool.query(
    `SELECT DATE(unsubscribed_at) AS date, COUNT(*) AS count
     FROM unsubscribed_contacts
     WHERE unsubscribed_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
     GROUP BY DATE(unsubscribed_at)
     ORDER BY date ASC`,
    [days]
  );
  return rows;
}

async function getByDomain() {
  await ensureTable();
  const { rows } = await pool.query(
    `SELECT domain, COUNT(*) AS count
     FROM unsubscribed_contacts WHERE domain IS NOT NULL
     GROUP BY domain ORDER BY count DESC LIMIT 10`
  );
  return rows;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

ensureTable().catch(err => console.error('[unsubscribe] Table init error:', err.message));

module.exports = {
  ensureTable, addUnsubscribe, importBulk, removeById,
  isUnsubscribed, list, getStats, getTrend, getByDomain,
};
