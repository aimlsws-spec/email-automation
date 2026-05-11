const express = require('express');
const router = express.Router();
const pool = require('../db');
const DashboardController = require('../controllers/dashboard.controller');

// GET /api/dashboard/automation-overview
router.get('/api/dashboard/automation-overview', async (req, res) => {
  try {
    const [logsResult, leadsResult] = await Promise.all([
      pool.query(`
        SELECT
          SUM(CASE WHEN status IN ('success', 'sent') AND DATE(sent_at) = CURRENT_DATE THEN 1 ELSE 0 END) AS emails_sent_today,
          SUM(CASE WHEN status IN ('success', 'sent') AND type LIKE 'follow_up_%' AND DATE(sent_at) = CURRENT_DATE THEN 1 ELSE 0 END) AS followups_sent_today,
          SUM(CASE WHEN status = 'failed' AND DATE(sent_at) = CURRENT_DATE THEN 1 ELSE 0 END) AS failed_today,
          SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) AS total_sent
        FROM email_logs
      `),
      pool.query(`
        SELECT
          SUM(CASE WHEN reply_detected_at IS NOT NULL AND reply_detected_at != '' AND DATE(reply_detected_at) = CURRENT_DATE THEN 1 ELSE 0 END) AS replies_today,
          SUM(CASE WHEN status IN ('Sent', 'Follow-up 1') AND next_follow_up_at IS NOT NULL AND next_follow_up_at > NOW() THEN 1 ELSE 0 END) AS pending_followups
        FROM leads
      `),
    ]);

    const l = logsResult.rows[0];
    const r = leadsResult.rows[0];

    res.json({
      emails_sent_today: l.emails_sent_today,
      replies_today: r.replies_today,
      followups_sent_today: l.followups_sent_today,
      pending_followups: r.pending_followups,
      failed_today: l.failed_today,
      total_sent: l.total_sent,
    });
  } catch (err) {
    console.error('❌ /api/dashboard/automation-overview ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/top-campaigns — ranked by reply rate per company
router.get('/api/dashboard/top-campaigns', async (req, res) => {
  try {
    // Step 1: per-company aggregates
    const { rows: companies } = await pool.query(`
      SELECT
        company,
        COUNT(*) AS total_leads,
        SUM(CASE WHEN status IN ('Sent','Follow-up 1','Follow-up 2','Replied') THEN 1 ELSE 0 END) AS total_sent,
        SUM(CASE WHEN reply_detected_at IS NOT NULL AND reply_detected_at != '' THEN 1 ELSE 0 END) AS total_replied,
        ROUND(
          SUM(CASE WHEN reply_detected_at IS NOT NULL AND reply_detected_at != '' THEN 1 ELSE 0 END)
          * 100.0
          / NULLIF(SUM(CASE WHEN status IN ('Sent','Follow-up 1','Follow-up 2','Replied') THEN 1 ELSE 0 END), 0),
          1
        ) AS reply_rate
      FROM leads
      WHERE company IS NOT NULL AND company != ''
      GROUP BY company
      ORDER BY reply_rate DESC, total_sent DESC
      LIMIT 5
    `);

    if (companies.length === 0) return res.json({ campaigns: [] });

    // Step 2: 7-day daily sent trend per company (for sparkline)
    const companyNames = companies.map((c) => c.company);
    const placeholders = companyNames.map(() => '?').join(', ');
    const { rows: trend } = await pool.query(
      `SELECT
        company,
        DATE(last_sent_date) AS day,
        COUNT(*) AS sent_count
      FROM leads
      WHERE company IN (${placeholders})
        AND last_sent_date IS NOT NULL
        AND last_sent_date != ''
        AND last_sent_date >= NOW() - INTERVAL 7 DAY
      GROUP BY company, DATE(last_sent_date)
      ORDER BY company, day`,
      companyNames
    );

    // Build sparkline map: company -> [counts for last 7 days]
    const trendMap = {};
    for (const c of companyNames) trendMap[c] = {};
    for (const row of trend) trendMap[row.company][row.day] = parseInt(row.sent_count);

    // Fill 7-day array (oldest → newest)
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });

    const avgRate = companies.reduce((s, c) => s + (parseFloat(c.reply_rate) || 0), 0) / companies.length;

    const campaigns = companies.map((c) => {
      const currRate = parseFloat(c.reply_rate) || 0;
      const trend7d = days.map((d) => trendMap[c.company][d] || 0);

      return {
        name: c.company,
        total_leads: parseInt(c.total_leads),
        total_sent: parseInt(c.total_sent),
        total_replied: parseInt(c.total_replied),
        reply_rate: currRate,
        // delta vs group average: positive = above average, negative = below
        trend_delta: parseFloat((currRate - avgRate).toFixed(1)),
        chart_data: trend7d,
      };
    });

    res.json({ campaigns });
  } catch (err) {
    console.error('❌ /api/dashboard/top-campaigns ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/advanced-stats — Reply Rate, Sent Rate, Converted Leads
router.get('/api/dashboard/advanced-stats', async (req, res) => {
  try {
    const [leadsRows, logRows] = await Promise.all([
      pool.query(`SELECT SUM(CASE WHEN has_replied = 1 THEN 1 ELSE 0 END) AS converted_leads FROM leads`),
      pool.query(`
        SELECT
          SUM(CASE WHEN status IN ('sent','success') THEN 1 ELSE 0 END) AS sent_count,
          COUNT(*) AS total_count
        FROM email_logs
      `),
    ]);

    const r    = leadsRows.rows[0] || {};
    const logs = logRows.rows[0]  || {};
    const sentCount    = parseInt(logs.sent_count)    || 0;
    const totalCount   = parseInt(logs.total_count)   || 0;
    const convertedLeads = parseInt(r.converted_leads) || 0;
    const replyRate    = sentCount > 0 ? parseFloat((convertedLeads / sentCount * 100).toFixed(1)) : 0;
    const sentRate     = totalCount > 0 ? parseFloat((sentCount / totalCount * 100).toFixed(1)) : 0;

    res.json({
      reply_rate:      replyRate,
      sent_rate:       sentRate,
      converted_leads: convertedLeads,
    });
  } catch (err) {
    console.error('❌ /api/dashboard/advanced-stats ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/email-activity?range=daily|monthly|yearly
router.get('/api/dashboard/email-activity', async (req, res) => {
  const range = (req.query.range || 'daily').toLowerCase();

  const truncMap = { daily: 'day', monthly: 'month', yearly: 'year' };
  const trunc = truncMap[range];
  if (!trunc) return res.status(400).json({ error: 'range must be daily, monthly, or yearly' });

  // Look-back window per range
  const windowMap = { day: '30 days', month: '12 months', year: '5 years' };
  const window = windowMap[trunc];

  try {
    const intervalMap = { day: '30 DAY', month: '12 MONTH', year: '5 YEAR' };
    const mysqlInterval = intervalMap[trunc];
    const fmtMap = { day: `DATE(sent_at)`, month: `DATE_FORMAT(sent_at, '%Y-%m')`, year: `DATE_FORMAT(sent_at, '%Y')` };
    const replyFmtMap = { day: `DATE(reply_detected_at)`, month: `DATE_FORMAT(reply_detected_at, '%Y-%m')`, year: `DATE_FORMAT(reply_detected_at, '%Y')` };

    const [sentRows, replyRows] = await Promise.all([
      pool.query(`
        SELECT ${fmtMap[trunc]} AS period, COUNT(*) AS sent_count
        FROM email_logs
        WHERE status IN ('success', 'sent') AND sent_at >= NOW() - INTERVAL ${mysqlInterval}
        GROUP BY 1 ORDER BY 1
      `),
      pool.query(`
        SELECT ${replyFmtMap[trunc]} AS period, COUNT(*) AS reply_count
        FROM leads
        WHERE reply_detected_at IS NOT NULL AND reply_detected_at != ''
          AND reply_detected_at >= NOW() - INTERVAL ${mysqlInterval}
        GROUP BY 1 ORDER BY 1
      `),
    ]);

    const sentMap = Object.fromEntries(sentRows.rows.map(r => [r.period, parseInt(r.sent_count)]));
    const replyMap = Object.fromEntries(replyRows.rows.map(r => [r.period, parseInt(r.reply_count)]));

    const countMap = { day: 30, month: 12, year: 5 };
    const periods = [];
    for (let i = countMap[trunc] - 1; i >= 0; i--) {
      const d = new Date();
      if (trunc === 'day')   { d.setDate(d.getDate() - i);       periods.push(d.toISOString().slice(0, 10)); }
      if (trunc === 'month') { d.setMonth(d.getMonth() - i);     periods.push(d.toISOString().slice(0, 7)); }
      if (trunc === 'year')  { d.setFullYear(d.getFullYear()-i); periods.push(String(d.getFullYear())); }
    }

    const data = periods.map(period => ({
      date: period,
      sent: sentMap[period] || 0,
      replies: replyMap[period] || 0,
    }));

    res.json({ data });
  } catch (err) {
    console.error('❌ /api/dashboard/email-activity ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/stats — top 4 metric cards
router.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [leadsResult, logsResult, campaignsResult] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*) AS leads_imported,
          SUM(CASE WHEN has_replied = 1 THEN 1 ELSE 0 END) AS replies_conversions
        FROM leads
      `),
      pool.query(`
        SELECT SUM(CASE WHEN status IN ('sent', 'success') THEN 1 ELSE 0 END) AS emails_sent
        FROM email_logs
      `),
      pool.query(`
        SELECT COUNT(*) AS active_campaigns
        FROM campaigns
        WHERE LOWER(status) = 'running'
      `)
    ]);

    const r        = leadsResult.rows[0];
    const sentLogs = logsResult.rows[0];
    const camps    = campaignsResult.rows[0];

    res.json({
      emails_sent:         parseInt(sentLogs.emails_sent)      || 0,
      leads_imported:      parseInt(r.leads_imported)          || 0,
      active_campaigns:    parseInt(camps.active_campaigns)    || 0,
      replies_conversions: parseInt(r.replies_conversions)     || 0,
    });
  } catch (err) {
    console.error('❌ /api/dashboard/stats ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard
router.get('/api/dashboard', DashboardController.getDashboard);

// GET /api/dashboard/recent-activity?company=<optional>
// Returns the same "events" shape expected by TeamActivity.jsx:
// { data: [{ lead_name, lead_email, action: 'sent'|'followup'|'replied', timestamp }] }
router.get('/api/dashboard/recent-activity', async (req, res) => {
  try {
    const company = (req.query.company || '').trim();

    let sql = `
      SELECT
        name AS lead_name,
        email AS lead_email,
        reply_detected_at,
        follow_up_count,
        last_sent_date
      FROM leads
      WHERE last_sent_date IS NOT NULL
        AND last_sent_date != ''
    `;
    const params = [];

    if (company) {
      sql += ` AND company = ?`;
      params.push(company);
    }

    sql += `
      ORDER BY last_sent_date DESC
      LIMIT 10
    `;

    const { rows } = await pool.query(sql, params);

    const events = rows.map((r) => ({
      lead_name: r.lead_name,
      lead_email: r.lead_email,
      action:
        r.reply_detected_at && r.reply_detected_at !== ''
          ? 'replied'
          : (parseInt(r.follow_up_count, 10) || 0) > 0
            ? 'followup'
            : 'sent',
      timestamp: r.last_sent_date,
    }));

    res.json({ data: events });
  } catch (err) {
    console.error('❌ /api/dashboard/recent-activity ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/summary - Unified dashboard data source
router.get('/api/dashboard/summary', async (req, res) => {
  try {
    const [statsResult, statusResult, activityResult, topCampaignResult, todayLogsResult, clicksResult] = await Promise.all([
      // 1. General stats — read from email_logs + leads (always populated)
      pool.query(`
        SELECT
          (SELECT COUNT(*) FROM email_logs WHERE status IN ('sent','success') AND DATE(sent_at) = CURDATE()) AS emails_sent_today,
          (SELECT COUNT(*) FROM campaigns WHERE LOWER(status) = 'running') AS active_campaigns,
          (SELECT COUNT(*) FROM email_logs WHERE status IN ('sent','success')) AS total_sent,
          COUNT(*) AS total_leads,
          SUM(CASE WHEN has_replied = 1 THEN 1 ELSE 0 END) AS reply_count
        FROM leads
      `),
      // 2. Lead status breakdown
      pool.query(`SELECT status, COUNT(*) AS count FROM leads GROUP BY status`),
      // 3. Recent activity from email_logs
      pool.query(`
        SELECT
          COALESCE(lead_email, email) AS email,
          subject,
          CASE
            WHEN status = 'failed' THEN 'failed'
            WHEN type LIKE 'follow_up_%' THEN 'followup'
            ELSE 'sent'
          END AS type,
          COALESCE(sent_at, created_at) AS timestamp
        FROM email_logs
        ORDER BY COALESCE(sent_at, created_at) DESC
        LIMIT 15
      `),
      // 4. Top campaign by reply count
      pool.query(`
        SELECT c.id, c.name,
          COUNT(l.email) AS sent,
          SUM(CASE WHEN l.has_replied = 1 THEN 1 ELSE 0 END) AS replies,
          ROUND(
            SUM(CASE WHEN l.has_replied = 1 THEN 1 ELSE 0 END) * 100.0
            / NULLIF(COUNT(l.email), 0), 1
          ) AS reply_rate
        FROM campaigns c
        LEFT JOIN leads l ON l.campaign_id = c.id
        GROUP BY c.id, c.name
        ORDER BY replies DESC, sent DESC
        LIMIT 1
      `),
      // 5. Today's email_logs breakdown
      pool.query(`
        SELECT
          SUM(CASE WHEN status IN ('sent','success') THEN 1 ELSE 0 END) AS sent_today,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed_today,
          SUM(CASE WHEN type LIKE 'follow_up_%' AND status IN ('sent','success') THEN 1 ELSE 0 END) AS followups_today
        FROM email_logs
        WHERE DATE(sent_at) = CURRENT_DATE
      `),
      // 6. Today's clicks and replies
      pool.query(`
        SELECT
          (SELECT COUNT(*) FROM link_clicks WHERE DATE(clicked_at) = CURDATE()) AS clicks_today,
          (SELECT COUNT(*) FROM leads WHERE has_replied = 1 AND DATE(last_activity_at) = CURDATE()) AS replies_today
      `)
    ]);

    const stats       = statsResult.rows[0] || {};
    const todayLogs   = todayLogsResult.rows[0] || {};
    const eventsToday = clicksResult.rows[0]    || {};

    const totalSent  = parseInt(stats.total_sent)  || 0;
    const replyCount = parseInt(stats.reply_count) || 0;
    const replyRate  = totalSent > 0 ? parseFloat((replyCount / totalSent * 100).toFixed(1)) : 0;

    const statusMap = { sent: 0, pending: 0, failed: 0, replied: 0, followup: 0 };
    statusResult.rows.forEach(r => {
      const s = (r.status || '').toLowerCase();
      if (s === 'sent')              statusMap.sent     += parseInt(r.count) || 0;
      else if (s === 'pending')      statusMap.pending  += parseInt(r.count) || 0;
      else if (s === 'failed')       statusMap.failed   += parseInt(r.count) || 0;
      else if (s === 'replied')      statusMap.replied  += parseInt(r.count) || 0;
      else if (s.includes('follow')) statusMap.followup += parseInt(r.count) || 0;
    });
    statusMap.replied = replyCount;

    const automationOverview = {
      emails_sent_today: parseInt(stats.emails_sent_today)  || 0,
      replies_today:     parseInt(eventsToday.replies_today) || 0,
      clicks_today:      parseInt(eventsToday.clicks_today)  || 0,
      followups_sent:    parseInt(todayLogs.followups_today) || 0,
      pending_followups: statusMap.pending,
      failed_today:      parseInt(todayLogs.failed_today)    || 0,
    };

    const tc = topCampaignResult.rows[0] || null;

    res.json({
      success: true,
      data: {
        emailsSentToday: parseInt(stats.emails_sent_today) || 0,
        activeCampaigns: parseInt(stats.active_campaigns)  || 0,
        totalLeads:      parseInt(stats.total_leads)       || 0,
        replyRate,
        replyCount,
        convertedLeads:  replyCount,
        leadStatus:      statusMap,
        recentActivity:  activityResult.rows,
        topCampaign:     tc ? { name: tc.name, reply_rate: parseFloat(tc.reply_rate) || 0, replies: parseInt(tc.replies) || 0, sent: parseInt(tc.sent) || 0 } : null,
        automationOverview,
      }
    });
  } catch (err) {
    console.error('❌ /api/dashboard/summary ERROR:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      data: {
        emailsSentToday: 0, activeCampaigns: 0, totalLeads: 0, replyRate: 0, convertedLeads: 0,
        leadStatus: { sent: 0, pending: 0, failed: 0, replied: 0, followup: 0 },
        recentActivity: [], topCampaign: null, automationOverview: {}
      }
    });
  }
});

module.exports = router;
