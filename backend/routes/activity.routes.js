const express = require('express');
const router = express.Router();
const pool = require('../db');
const { ensureEmailEventsTable } = require('../services/emailService');

const uid = (req) => req.user.id;

router.get('/api/recent-activity', async (req, res) => {
  try {
    const userId = uid(req);
    await ensureEmailEventsTable();
    const { rows } = await pool.query(`
      SELECT e.recipient_email AS email, COALESCE(NULLIF(l.subject, ''), e.email_type) AS subject,
        COALESCE(NULLIF(l.provider, ''), 'gmail') AS provider, e.email_type, e.replied, e.sent_at AS created_at, e.sender_email
      FROM email_events e LEFT JOIN email_logs l ON l.tracking_id = e.tracking_id
      WHERE e.user_id = ?
      ORDER BY e.sent_at DESC LIMIT 10
    `, [userId]);
    const data = rows.map((r) => ({
      email: r.email, subject: r.subject, provider: r.provider, sender_email: r.sender_email,
      status: r.replied ? 'replied' : String(r.email_type || '').toLowerCase().startsWith('follow_up') ? 'followup' : 'sent',
      created_at: r.created_at,
    }));
    res.json({ data });
  } catch (err) {
    console.error('❌ /api/recent-activity ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const activityController = require('../controllers/activity.controller');

router.get('/api/activity/recent', activityController.getRecentActivity);

module.exports = router;
