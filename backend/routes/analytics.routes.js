const express = require('express');
const router = express.Router();
const pool = require('../db');
const { ensureEmailEventsTable } = require('../services/emailService');

// GET /api/analytics/summary
router.get('/api/analytics/summary', async (req, res) => {
  try {
    const [summaryResult, todayResult] = await Promise.all([
      pool.query(`
        SELECT
          (SELECT COUNT(*) FROM email_logs WHERE status IN ('sent', 'success')) AS total_sent,
          (SELECT COUNT(*) FROM leads WHERE reply_detected_at IS NOT NULL AND reply_detected_at != '') AS total_replies,
          (SELECT COALESCE(SUM(follow_up_count), 0) FROM leads) AS total_followups,
          (SELECT COUNT(*) FROM leads WHERE status = 'Replied') AS converted_leads
      `),
      pool.query(`
        SELECT
          (SELECT COUNT(*) FROM email_logs WHERE status IN ('sent', 'success') AND DATE(sent_at) = CURRENT_DATE) AS sent_today,
          (SELECT COUNT(*) FROM leads WHERE reply_detected_at IS NOT NULL AND reply_detected_at != '' AND DATE(reply_detected_at) = CURRENT_DATE) AS replies_today
      `)
    ]);

    const summary = summaryResult.rows[0];
    const today = todayResult.rows[0];

    const replyRate = summary.total_sent > 0
      ? parseFloat(((summary.total_replies / summary.total_sent) * 100).toFixed(1))
      : 0;

    res.json({
      total_sent: summary.total_sent,
      total_replies: summary.total_replies,
      total_followups: summary.total_followups,
      reply_rate: replyRate,
      converted_leads: summary.converted_leads,
      replies_today: today.replies_today,
      sent_today: today.sent_today
    });
  } catch (err) {
    console.error('❌ /api/analytics/summary ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/overview - Unified dashboard data
router.get('/api/analytics/overview', async (req, res) => {
  try {
    console.log('[API] GET /api/analytics/overview - Fetching metrics');
    const [statsRes, campaignsRes, activityRes, statusRes] = await Promise.all([
      // 1-5. Summary Stats
      pool.query(`
        SELECT
          (SELECT COUNT(*) FROM email_logs WHERE status IN ('sent','success') AND DATE(sent_at) = CURDATE()) as sent_today,
          (SELECT COUNT(*) FROM leads WHERE has_replied = 1 AND DATE(last_activity_at) = CURDATE()) as replies_today,
          (SELECT COUNT(*) FROM email_logs WHERE status = 'failed' AND DATE(sent_at) = CURDATE()) as failed_today,
          (SELECT COUNT(*) FROM email_logs WHERE type LIKE 'follow_up_%' AND status IN ('sent','success') AND DATE(sent_at) = CURDATE()) as followups_today,
          (SELECT COUNT(*) FROM leads WHERE has_replied = 0 AND is_bounced = 0 AND next_follow_up_at IS NOT NULL AND next_follow_up_at > NOW()) as pending_followups
      `),
      // 6. Top Campaigns
      pool.query(`
        SELECT
          c.id as campaign_id,
          c.name as campaign_name,
          COUNT(l.email) as sent,
          SUM(CASE WHEN l.has_replied = 1 THEN 1 ELSE 0 END) as replies,
          ROUND(SUM(CASE WHEN l.has_replied = 1 THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(l.email), 0), 2) as reply_rate
        FROM campaigns c
        JOIN leads l ON l.campaign_id = c.id
        GROUP BY c.id, c.name
        ORDER BY reply_rate DESC, sent DESC
        LIMIT 5
      `),
      // 7. Recent Activity
      pool.query(`
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
        ORDER BY timestamp DESC
        LIMIT 10
      `),
      // 8. Lead Status
      pool.query(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'Sent' THEN 1 ELSE 0 END) as sent,
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'Failed' THEN 1 ELSE 0 END) as failed,
          SUM(CASE WHEN has_replied = 1 THEN 1 ELSE 0 END) as replied
        FROM leads
      `)
    ]);

    const stats = statsRes.rows[0] || {};
    const leadStatus = statusRes.rows[0] || {};

    console.log('[API] Analytics overview data retrieved');

    res.json({
      success: true,
      totalSentToday: stats.sent_today || 0,
      totalRepliesToday: stats.replies_today || 0,
      totalFailedToday: stats.failed_today || 0,
      followupsSentToday: stats.followups_today || 0,
      pendingFollowups: stats.pending_followups || 0,
      topCampaigns: campaignsRes.rows || [],
      recentActivity: activityRes.rows || [],
      leadStatus: {
        total: leadStatus.total || 0,
        sent: leadStatus.sent || 0,
        pending: leadStatus.pending || 0,
        failed: leadStatus.failed || 0,
        replied: leadStatus.replied || 0
      }
    });

  } catch (err) {
    console.error('❌ /api/analytics/overview ERROR:', err);
    res.status(500).json({
      success: false,
      message: err.message,
      leadStatus: { total: 0, sent: 0, pending: 0, failed: 0, replied: 0 },
      topCampaigns: [],
      recentActivity: []
    });
  }
});

// GET /api/analytics/unsubscribes — unsubscribe clicks from link_clicks
router.get('/api/analytics/unsubscribes', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        lc.lead_email,
        lc.campaign_id,
        MAX(lc.clicked_at) AS clicked_at,
        ANY_VALUE(c.name) AS campaign_name
      FROM link_clicks lc
      LEFT JOIN campaigns c ON CAST(lc.campaign_id AS UNSIGNED) = c.id
      WHERE lc.type = 'unsubscribe' OR lc.url LIKE '%unsubscribe%'
      GROUP BY lc.lead_email, lc.campaign_id
      ORDER BY MAX(lc.clicked_at) DESC
      LIMIT 500
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/analytics/link-activity - Returns recent click events
router.get('/api/analytics/link-activity', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        lc.lead_email,
        lc.campaign_id,
        lc.sender_email,
        lc.url,
        lc.type,
        lc.clicked_at,
        c.name AS campaign_name
      FROM link_clicks lc
      LEFT JOIN campaigns c ON CAST(lc.campaign_id AS UNSIGNED) = c.id
      ORDER BY lc.clicked_at DESC
      LIMIT 500
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('❌ /api/analytics/link-activity ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/activity
router.get('/api/analytics/activity', async (req, res) => {
  try {
    const range = req.query.range || 'daily';

    // daily   = last 30 days,   each bar = 1 day   (DATE_FORMAT → '%Y-%m-%d' string)
    // monthly = last 12 months, each bar = 1 month  (DATE_FORMAT → '%Y-%m'    string)
    // yearly  = last 5 years,   each bar = 1 year   (DATE_FORMAT → '%Y'       string)
    // Using DATE_FORMAT (not DATE()) so mysql2 keeps the result as a plain string
    // instead of converting it to a JS Date object, which breaks object-key lookups.
    let days, intervalSql, dateFmt, replyDateFmt;
    if (range === 'yearly') {
      days         = 5;
      intervalSql  = '5 YEAR';
      dateFmt      = `DATE_FORMAT(sent_at, '%Y')`;
      replyDateFmt = `DATE_FORMAT(last_activity_at, '%Y')`;
    } else if (range === 'monthly') {
      days         = 12;
      intervalSql  = '12 MONTH';
      dateFmt      = `DATE_FORMAT(sent_at, '%Y-%m')`;
      replyDateFmt = `DATE_FORMAT(last_activity_at, '%Y-%m')`;
    } else {
      // daily (default)
      days         = 30;
      intervalSql  = '30 DAY';
      dateFmt      = `DATE_FORMAT(sent_at, '%Y-%m-%d')`;
      replyDateFmt = `DATE_FORMAT(last_activity_at, '%Y-%m-%d')`;
    }

    const [sentRows, followupRows, replyRows] = await Promise.all([
      // "Sent" = all outbound emails that are NOT follow-ups.
      // We deliberately avoid `type = 'initial'` because older email_queue rows
      // were inserted without a type column, leaving the field NULL — and
      // NULL = 'initial' is always FALSE in MySQL.
      pool.query(`
        SELECT ${dateFmt} AS date, COUNT(*) AS cnt
        FROM email_logs
        WHERE status IN ('sent', 'success')
          AND (type IS NULL OR type = 'initial'
               OR (type NOT LIKE 'follow_up_%' AND type != 'manual_followup'))
          AND sent_at >= NOW() - INTERVAL ${intervalSql}
        GROUP BY 1 ORDER BY 1
      `),
      pool.query(`
        SELECT ${dateFmt} AS date, COUNT(*) AS cnt
        FROM email_logs
        WHERE status IN ('sent', 'success')
          AND (type LIKE 'follow_up_%' OR type = 'manual_followup')
          AND sent_at >= NOW() - INTERVAL ${intervalSql}
        GROUP BY 1 ORDER BY 1
      `),
      // Replies: use has_replied flag + last_activity_at (proper DATETIME).
      // Avoids the reply_detected_at VARCHAR comparison that silently returns 0.
      pool.query(`
        SELECT ${replyDateFmt} AS date, COUNT(*) AS cnt
        FROM leads
        WHERE has_replied = 1
          AND last_activity_at IS NOT NULL
          AND last_activity_at >= NOW() - INTERVAL ${intervalSql}
        GROUP BY 1 ORDER BY 1
      `),
    ]);

    const toMap = (rows) => Object.fromEntries(rows.map(r => [r.date, parseInt(r.cnt)]));
    const sentMap     = toMap(sentRows.rows);
    const followupMap = toMap(followupRows.rows);
    const replyMap    = toMap(replyRows.rows);

    const pad = (n) => String(n).padStart(2, '0');
    const localDate  = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const localMonth = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

    const dateKeys = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      if (range === 'yearly') {
        d.setFullYear(d.getFullYear() - i);
        dateKeys.push(String(d.getFullYear()));
      } else if (range === 'monthly') {
        d.setMonth(d.getMonth() - i);
        dateKeys.push(localMonth(d));
      } else {
        d.setDate(d.getDate() - i);
        dateKeys.push(localDate(d));
      }
    }

    const result = dateKeys.map(date => ({
      date,
      sent:     sentMap[date]     || 0,
      followups: followupMap[date] || 0,
      replies:  replyMap[date]    || 0,
    }));

    res.json(result);
  } catch (err) {
    console.error('❌ /api/analytics/activity ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/debug-logs — temporary diagnostic, remove after confirming chart works
router.get('/api/analytics/debug-logs', async (req, res) => {
  try {
    const [counts, sample, replyCount] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*) AS total_rows,
          SUM(CASE WHEN status IN ('sent','success') THEN 1 ELSE 0 END) AS status_sent_success,
          SUM(CASE WHEN type IS NULL THEN 1 ELSE 0 END)  AS type_null,
          SUM(CASE WHEN type = 'initial' THEN 1 ELSE 0 END) AS type_initial,
          SUM(CASE WHEN type LIKE 'follow_up_%' THEN 1 ELSE 0 END) AS type_followup,
          MIN(sent_at) AS oldest_sent_at,
          MAX(sent_at) AS newest_sent_at
        FROM email_logs
      `),
      pool.query(`SELECT type, status, DATE(sent_at) AS day, COUNT(*) AS cnt FROM email_logs GROUP BY type, status, DATE(sent_at) ORDER BY day DESC LIMIT 30`),
      pool.query(`SELECT COUNT(*) AS replied_leads, MAX(last_activity_at) AS latest_reply FROM leads WHERE has_replied = 1`),
    ]);
    res.json({ summary: counts.rows[0], breakdown: sample.rows, replies: replyCount.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/recent
router.get('/api/analytics/recent', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      (
        SELECT
          email as lead_email,
          name as lead_name,
          'sent' as action,
          last_sent_date as created_at,
          sender_email,
          last_subject as subject
        FROM leads
        WHERE last_sent_date IS NOT NULL AND last_sent_date != ''
      )
      UNION ALL
      (
        SELECT
          email as lead_email,
          name as lead_name,
          'replied' as action,
          reply_detected_at as created_at,
          sender_email,
          last_subject as subject
        FROM leads
        WHERE reply_detected_at IS NOT NULL AND reply_detected_at != ''
      )
      ORDER BY created_at DESC
      LIMIT 15
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ /api/analytics/recent ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/email-analytics (alias: GET /email-analytics)
async function handleEmailAnalytics(req, res) {
  try {
    await ensureEmailEventsTable();
    const [totalsRes, statusesRes, pendingRes] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*) AS total_sent,
          SUM(CASE WHEN opened = 1 THEN 1 ELSE 0 END) AS opened_count,
          SUM(CASE WHEN clicked = 1 THEN 1 ELSE 0 END) AS clicked_count,
          SUM(CASE WHEN replied = 1 THEN 1 ELSE 0 END) AS replied_count,
          SUM(CASE WHEN email_type LIKE 'follow_up_%' OR email_type = 'follow_up_3d' THEN 1 ELSE 0 END) AS followups_sent
        FROM email_events
      `),
      pool.query(`SELECT status, COUNT(*) AS count FROM email_events GROUP BY status`),
      pool.query(`SELECT COUNT(*) AS pending_count FROM leads WHERE status = 'Pending'`),
    ]);

    const t = totalsRes.rows[0] || {};
    const total_sent    = parseInt(t.total_sent)    || 0;
    const opened_count  = parseInt(t.opened_count)  || 0;
    const clicked_count = parseInt(t.clicked_count) || 0;
    const replied_count = parseInt(t.replied_count) || 0;
    const followups_sent = parseInt(t.followups_sent) || 0;
    const pending = parseInt((pendingRes.rows[0] || {}).pending_count) || 0;
    const delivery_status = Object.fromEntries(statusesRes.rows.map(r => [r.status, parseInt(r.count)]));

    res.json({
      total_sent,
      opened_count,
      clicked_count,
      replied: replied_count,
      pending,
      followups_sent,
      open_rate:  total_sent ? parseFloat((opened_count  * 100.0 / total_sent).toFixed(1)) : 0,
      click_rate: total_sent ? parseFloat((clicked_count * 100.0 / total_sent).toFixed(1)) : 0,
      delivery_status,
    });
  } catch (err) {
    console.error('❌ /api/email-analytics ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
}
router.get('/api/email-analytics', handleEmailAnalytics);
router.get('/email-analytics', handleEmailAnalytics);

module.exports = router;
