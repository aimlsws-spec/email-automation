const pool = require('../db');
const { getOrCreateRecord, domainFromEmail } = require('../services/senderWarmup.service');
const { getActiveSenders } = require('../services/senderPool.service');
const { getFollowUpTemplate, getFollowUpSubject } = require('../services/followUp.service');
const { getAutomationEnabled } = require('../services/systemSettings.service');

exports.getTopCampaign = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        c.id, c.name,
        SUM(CASE WHEN l.thread_id != '' THEN 1 ELSE 0 END) AS sent,
        SUM(CASE WHEN l.has_replied = 1 THEN 1 ELSE 0 END) AS replies,
        ROUND(
          SUM(CASE WHEN l.has_replied = 1 THEN 1 ELSE 0 END) * 100.0
          / NULLIF(SUM(CASE WHEN l.thread_id != '' THEN 1 ELSE 0 END), 0)
        , 2) AS reply_rate
      FROM campaigns c
      LEFT JOIN leads l ON l.campaign_id = c.id
      GROUP BY c.id, c.name
      HAVING SUM(CASE WHEN l.thread_id != '' THEN 1 ELSE 0 END) > 0
      ORDER BY reply_rate DESC, sent DESC
      LIMIT 1
    `);
    const row = rows[0] || null;
    res.json({
      success: true,
      data: row ? {
        ...row,
        sent:       parseInt(row.sent)             || 0,
        replies:    parseInt(row.replies)          || 0,
        reply_rate: parseFloat(row.reply_rate)     || 0,
      } : null
    });
  } catch (err) {
    console.error('❌ getTopCampaign ERROR:', err);
    res.status(500).json({ success: false, data: null, message: err.message || 'Internal Server Error' });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        c.id, c.name,
        MAX(c.status) AS status,
        MAX(c.subject) AS subject,
        COALESCE(MAX(c.active_sender), MAX(c.sender_email), 'Auto Rotation') AS sender_email,
        MAX(c.created_at) AS created_at,
        COUNT(l.email) AS total,
        SUM(CASE WHEN l.thread_id != '' THEN 1 ELSE 0 END) AS sent,
        SUM(CASE WHEN l.status = 'Pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN l.status = 'Failed' THEN 1 ELSE 0 END) AS failed,
        SUM(CASE WHEN l.has_replied = 1 THEN 1 ELSE 0 END) AS replied
      FROM campaigns c
      LEFT JOIN leads l ON l.campaign_id = c.id
      GROUP BY c.id, c.name
      ORDER BY created_at DESC
    `);

    const result = rows.map(row => ({
      ...row,
      total:    parseInt(row.total)   || 0,
      sent:     parseInt(row.sent)    || 0,
      pending:  parseInt(row.pending) || 0,
      failed:   parseInt(row.failed)  || 0,
      replied:  parseInt(row.replied) || 0,
      status:   row.status ? row.status.toUpperCase() : 'PENDING',
      progress: row.total > 0 ? Math.round((row.sent / row.total) * 100) : 0,
      reply_rate: row.total > 0 ? parseFloat(((parseInt(row.replied) || 0) / row.total * 100).toFixed(1)) : 0,
    }));

    const senderEmails  = rows.map(r => r.sender_email).filter(Boolean);
    const uniqueDomains = [...new Set(senderEmails.map(domainFromEmail))];
    const domainSenderCounts = await Promise.all(
      uniqueDomains.map(async d => {
        await getOrCreateRecord(d).catch(() => {});
        const senders = await getActiveSenders(d).catch(() => []);
        return { domain: d, count: senders.length };
      })
    );
    const senderCountByDomain = Object.fromEntries(domainSenderCounts.map(({ domain, count }) => [domain, count]));

    const annotated = result.map(r => ({
      ...r,
      active_sender_count: r.sender_email ? (senderCountByDomain[domainFromEmail(r.sender_email)] ?? 0) : 0,
    }));

    res.json({ success: true, data: annotated });
  } catch (err) {
    console.error('❌ getCampaigns ERROR:', err);
    res.status(500).json({ success: false, data: [], message: err.message || 'Internal Server Error' });
  }
};

exports.sendFollowUpNow = async (req, res) => {
  const campaignId = parseInt(req.params.campaignId);
  if (isNaN(campaignId)) return res.status(400).json({ success: false, error: 'Invalid campaign ID' });

  try {
    const automationEnabled = await getAutomationEnabled();
    if (!automationEnabled) {
      console.log(`[FOLLOWUP_CHECK] campaign_id=${campaignId} campaign_name="" automation_status=paused followup_status=unknown is_selected=false`);
      console.log(`[FOLLOWUP_SKIP] campaign_id=${campaignId} reason=paused`);
      return res.status(400).json({ success: false, error: 'Follow-up automation is paused' });
    }

    const { rows: [camp] } = await pool.query(`SELECT id, name, status, followup_enabled FROM campaigns WHERE id = ?`, [campaignId]);
    if (!camp) return res.status(404).json({ success: false, error: 'Campaign not found' });
    const followupStatus = camp.followup_enabled === 0 || camp.followup_enabled === false
      ? 'paused'
      : String(camp.status || 'active').trim().toLowerCase();
    const isPaused = camp.followup_enabled === 0 || camp.followup_enabled === false ||
      ['paused', 'archived', 'stopped', 'cancelled', 'canceled'].includes(String(camp.status || '').trim().toLowerCase());

    console.log(
      `[FOLLOWUP_CHECK] campaign_id=${camp.id} campaign_name=${JSON.stringify(camp.name || '')} ` +
      `automation_status=active followup_status=${followupStatus} is_selected=${!isPaused}`
    );

    if (isPaused) {
      console.log(`[FOLLOWUP_SKIP] campaign_id=${campaignId} reason=paused`);
      return res.status(400).json({ success: false, error: 'Campaign is paused' });
    }

    const { rows: leads } = await pool.query(`
      SELECT * FROM leads
      WHERE campaign_id = ?
        AND has_replied  = 0
        AND is_bounced   = 0
        AND (followup_enabled = 1 OR followup_enabled IS NULL)
        AND follow_up_step <= 6
        AND status != 'Pending'
    `, [campaignId]);

    if (leads.length === 0) return res.json({ success: true, queued: 0, message: 'No eligible leads for follow-up' });

    let queued = 0;
    for (const lead of leads) {
      const senderEmail = lead.sender_email || process.env.DEFAULT_SENDER_EMAIL;
      if (!senderEmail) continue;
      const step    = lead.follow_up_step ?? 0;
      const html    = getFollowUpTemplate(step, lead);
      const subject = getFollowUpSubject(step, lead);
      await pool.query(
        `INSERT INTO email_queue (lead_email, campaign_id, subject, html_body, status, type, sender_email) VALUES (?, ?, ?, ?, 'pending', 'manual_followup', ?)`,
        [lead.email, campaignId, subject, html, senderEmail]
      );
      queued++;
    }

    res.json({ success: true, queued, message: `${queued} follow-up(s) queued successfully` });
  } catch (err) {
    console.error('[FOLLOWUP/SEND-NOW]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
