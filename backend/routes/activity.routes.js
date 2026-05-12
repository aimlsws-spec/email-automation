const express = require('express');
const router = express.Router();
const pool = require('../db');
const { ensureEmailEventsTable } = require('../services/emailService');

// GET /api/recent-activity
// Returns recent outreach activity backed by PostgreSQL tables:
// - email_events (tracking/open/click/replied)
// - email_logs   (subject/provider)
// Shape is compatible with frontend `fetchRecentActivity()` normalizer.
router.get('/api/recent-activity', async (req, res) => {
  try {
    await ensureEmailEventsTable();

    const { rows } = await pool.query(
      `
        SELECT
          e.recipient_email AS email,
          COALESCE(NULLIF(l.subject, ''), e.email_type) AS subject,
          COALESCE(NULLIF(l.provider, ''), 'gmail') AS provider,
          e.email_type,
          e.replied,
          e.sent_at AS created_at,
          e.sender_email
        FROM email_events e
        LEFT JOIN email_logs l
          ON l.tracking_id = e.tracking_id
        ORDER BY e.sent_at DESC
        LIMIT 10
      `
    );

    const data = rows.map((r) => ({
      email: r.email,
      subject: r.subject,
      provider: r.provider,
      sender_email: r.sender_email,
      status: r.replied
        ? 'replied'
        : String(r.email_type || '').toLowerCase().startsWith('follow_up')
          ? 'followup'
          : 'sent',
      created_at: r.created_at,
    }));

    res.json({ data });
  } catch (err) {
    console.error('❌ /api/recent-activity ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leads/pending
router.get('/api/leads/pending', async (req, res) => {
  try {
    const { campaignId } = req.query;
    let query = `SELECT email, name, company FROM leads WHERE status = 'Pending'`;
    const params = [];
    if (campaignId) {
      query += ` AND campaign_id = ?`;
      params.push(campaignId);
    }
    const { rows } = await pool.query(query, params);
    console.log('Pending leads:', rows.length, campaignId ? `(campaign ${campaignId})` : '(global)');
    res.json({ count: rows.length, leads: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/recent-activity - fetch latest email log rows
router.get('/api/recent-activity', async (req, res) => {
  try {
    const tableCheck = await pool.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.tables
       WHERE table_schema = DATABASE() AND table_name = 'email_logs'`
    );
    if (!parseInt(tableCheck.rows[0].cnt)) {
      return res.json([]);
    }

    const { rows: columnRows } = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND table_name = 'email_logs'
    `);
    const columns = new Set(columnRows.map((row) => row.column_name));
    const has = (name) => columns.has(name);
    const value = (name, fallback = "''") => has(name) ? name : fallback;
    const coalesce = (names, fallback = "''") => {
      const available = names.filter(has);
      return available.length ? `COALESCE(${available.join(', ')}, ${fallback})` : fallback;
    };
    const activityTime = coalesce(['created_at', 'sent_at'], 'NOW()');

    const { rows } = await pool.query(
      `SELECT
         ${value('id', 'NULL')} AS id,
         ${coalesce(['email', 'lead_email', 'to_email'])} AS email,
         ${value('subject')} AS subject,
         CASE WHEN ${value('status')} = 'success' THEN 'sent' ELSE ${value('status')} END AS status,
         ${has('provider') ? 'COALESCE(provider, \'\')' : "''"} AS provider,
         ${has('sender_email') ? 'COALESCE(sender_email, \'\')' : "''"} AS sender_email,
         ${value('message_id')} AS message_id,
         ${activityTime} AS created_at
       FROM email_logs
       ORDER BY ${activityTime} DESC
       LIMIT 20`
    );

    return res.json(rows);
  } catch (err) {
    console.error('/api/recent-activity failed:', err.message);
    return res.json([]);
  }
});

module.exports = router;