const pool = require('../db');
const { appendLeadToCampaignExcel } = require('./campaignExcel.service');

async function ensureReplyLeadsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reply_leads (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      sender_email  VARCHAR(255) NOT NULL,
      campaign_id   INT DEFAULT NULL,
      campaign_name VARCHAR(500),
      subject       VARCHAR(1000),
      reply_message LONGTEXT,
      reply_date    DATETIME,
      mailbox       VARCHAR(255),
      lead_status   VARCHAR(50) DEFAULT 'New',
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  await pool.query(
    `ALTER TABLE reply_leads ADD UNIQUE KEY uq_reply_lead (sender_email, campaign_id)`
  ).catch(() => {});
  // Widen column if table already exists with smaller TEXT type
  await pool.query(
    `ALTER TABLE reply_leads MODIFY COLUMN reply_message LONGTEXT`
  ).catch(() => {});
}

async function createLeadFromReply({ senderEmail, campaignId, campaignName, subject, replyMessage, replyDate, mailbox }) {
  const msg = (replyMessage || '').trim();
  const result = await pool.query(`
    INSERT INTO reply_leads
      (sender_email, campaign_id, campaign_name, subject, reply_message, reply_date, mailbox, lead_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'New')
    ON DUPLICATE KEY UPDATE
      reply_message = IF(reply_message IS NULL OR reply_message = '', VALUES(reply_message), reply_message),
      updated_at    = NOW()
  `, [
    senderEmail,
    campaignId || null,
    campaignName || null,
    (subject || '').slice(0, 1000) || null,
    msg || null,
    replyDate ? new Date(replyDate) : new Date(),
    mailbox || null,
  ]);
  const affected = result?.affectedRows ?? result?.rowCount ?? 0;

  // MySQL ON DUPLICATE KEY UPDATE: affectedRows === 1 → new insert, 2 → update, 0 → no change.
  // Only append to the campaign Excel file on a genuine new lead; updates don't add duplicate rows.
  if (affected === 1) {
    console.log(`[LEAD_CREATED] email=${senderEmail} campaign=${campaignId ?? '?'} msg_chars=${msg.length}`);
    appendLeadToCampaignExcel({
      sender_email:  senderEmail,
      campaign_id:   campaignId || null,
      campaign_name: campaignName || null,
      subject:       (subject || '').slice(0, 1000) || null,
      reply_message: msg || null,
      reply_date:    replyDate ? new Date(replyDate) : new Date(),
      mailbox:       mailbox || null,
      lead_status:   'New',
    });
  } else if (affected === 2) {
    console.log(`[LEAD_UPDATED] email=${senderEmail} campaign=${campaignId ?? '?'} — existing row refreshed`);
  }

  return affected > 0;
}

async function getReplyLeads({ campaign, search, status, page = 1, limit = 20 } = {}) {
  const safeLimit = Math.min(parseInt(limit, 10) || 20, 100);
  const safePage  = Math.max(1, parseInt(page, 10) || 1);
  const offset    = (safePage - 1) * safeLimit;

  const conditions = [];
  const params     = [];

  if (campaign && !isNaN(parseInt(campaign, 10))) {
    conditions.push('campaign_id = ?');
    params.push(parseInt(campaign, 10));
  }
  if (status) {
    conditions.push('lead_status = ?');
    params.push(status);
  }
  if (search) {
    conditions.push('(sender_email LIKE ? OR campaign_name LIKE ? OR subject LIKE ?)');
    const like = `%${search.slice(0, 100)}%`;
    params.push(like, like, like);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const { rows: countRows } = await pool.query(
    `SELECT COUNT(*) AS total FROM reply_leads ${where}`,
    params
  );
  const total = Number(countRows[0]?.total ?? 0);

  const { rows } = await pool.query(
    `SELECT * FROM reply_leads ${where} ORDER BY reply_date DESC LIMIT ? OFFSET ?`,
    [...params, safeLimit, offset]
  );

  return {
    rows,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.max(1, Math.ceil(total / safeLimit)),
  };
}

async function getLeadStats() {
  const [{ rows: totals }, { rows: byCampaign }, { rows: recent }, { rows: byStatus }] = await Promise.all([
    pool.query('SELECT COUNT(*) AS total FROM reply_leads'),
    pool.query(`
      SELECT campaign_name, COUNT(*) AS count
      FROM reply_leads
      GROUP BY campaign_name
      ORDER BY count DESC
      LIMIT 10
    `),
    pool.query(`
      SELECT sender_email, campaign_name, reply_date, lead_status
      FROM reply_leads
      ORDER BY reply_date DESC
      LIMIT 5
    `),
    pool.query(`
      SELECT lead_status, COUNT(*) AS count
      FROM reply_leads
      GROUP BY lead_status
    `),
  ]);

  return {
    total:      Number(totals[0]?.total ?? 0),
    byCampaign,
    recent,
    byStatus,
  };
}

const VALID_STATUSES = ['New', 'Contacted', 'Converted', 'Closed'];

async function updateLeadStatus(id, status) {
  if (!VALID_STATUSES.includes(status)) throw new Error(`Invalid status: ${status}`);
  const result = await pool.query(
    'UPDATE reply_leads SET lead_status = ? WHERE id = ?',
    [status, parseInt(id, 10)]
  );
  return (result?.affectedRows ?? result?.rowCount ?? 0) > 0;
}

async function exportLeadsData({ campaign, search, status } = {}) {
  const conditions = [];
  const params     = [];

  if (campaign && !isNaN(parseInt(campaign, 10))) {
    conditions.push('campaign_id = ?');
    params.push(parseInt(campaign, 10));
  }
  if (status) {
    conditions.push('lead_status = ?');
    params.push(status);
  }
  if (search) {
    conditions.push('(sender_email LIKE ? OR campaign_name LIKE ? OR subject LIKE ?)');
    const like = `%${search.slice(0, 100)}%`;
    params.push(like, like, like);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await pool.query(
    `SELECT sender_email, campaign_name, reply_date, subject, reply_message, mailbox, lead_status
     FROM reply_leads ${where} ORDER BY reply_date DESC`,
    params
  );
  return rows;
}

module.exports = {
  ensureReplyLeadsTable,
  createLeadFromReply,
  getReplyLeads,
  getLeadStats,
  updateLeadStatus,
  exportLeadsData,
};
