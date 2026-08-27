const pool = require('../db');

exports.getRecentActivity = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM (
        (SELECT 'sent' as type, to_email as email, c.name as campaign_name, sent_at as timestamp
          FROM email_logs el JOIN leads l ON el.to_email = l.email JOIN campaigns c ON l.campaign_id = c.id
          WHERE el.status = 'success' AND el.user_id = ?)
        UNION ALL
        (SELECT 'reply' as type, email, c.name as campaign_name, reply_detected_at as timestamp
          FROM leads l JOIN campaigns c ON l.campaign_id = c.id
          WHERE reply_detected_at IS NOT NULL AND reply_detected_at != '' AND l.user_id = ?)
        UNION ALL
        (SELECT 'failed' as type, to_email as email, c.name as campaign_name, sent_at as timestamp
          FROM email_logs el JOIN leads l ON el.to_email = l.email JOIN campaigns c ON l.campaign_id = c.id
          WHERE el.status = 'failed' AND el.user_id = ?)
      ) activity
      ORDER BY timestamp DESC LIMIT 10
    `, [req.user.id, req.user.id, req.user.id]);
    res.json({ success: true, data: rows || [] });
  } catch (err) {
    console.error('❌ getRecentActivity ERROR:', err);
    res.status(500).json({ success: false, data: [], message: err.message || 'Internal Server Error' });
  }
};
