const pool = require('../db');

exports.getRecentActivity = async (req, res) => {
  try {
    console.log('[API] GET /api/activity/recent - Fetching activity');
    const { rows } = await pool.query(`
      SELECT * FROM (
        (
          SELECT 'sent' as type, to_email as email, c.name as campaign_name, sent_at as timestamp
          FROM email_logs el
          JOIN leads l ON el.to_email = l.email
          JOIN campaigns c ON l.campaign_id = c.id
          WHERE el.status = 'success'
        )
        UNION ALL
        (
          SELECT 'reply' as type, email, c.name as campaign_name, reply_detected_at as timestamp
          FROM leads l
          JOIN campaigns c ON l.campaign_id = c.id
          WHERE reply_detected_at IS NOT NULL AND reply_detected_at != ''
        )
        UNION ALL
        (
          SELECT 'failed' as type, to_email as email, c.name as campaign_name, sent_at as timestamp
          FROM email_logs el
          JOIN leads l ON el.to_email = l.email
          JOIN campaigns c ON l.campaign_id = c.id
          WHERE el.status = 'failed'
        )
      ) activity
      ORDER BY timestamp DESC
      LIMIT 10
    `);

    const data = rows || [];
    console.log(`[API] Found ${data.length} recent activities`);
    res.json({ success: true, data });
  } catch (err) {
    console.error('❌ getRecentActivity ERROR:', err);
    res.status(500).json({ success: false, data: [], message: err.message || 'Internal Server Error' });
  }
};
