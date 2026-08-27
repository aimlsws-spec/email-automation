const pool = require('../db');
const { getOrCreateRecord, domainFromEmail } = require('../services/senderWarmup.service');
const { getActiveSenders } = require('../services/senderPool.service');
const { getAutomationEnabled } = require('../services/systemSettings.service');
const { getCampaignFollowUpTemplatesForCampaign } = require('../services/campaignFollowUp.service');
const { injectVariables } = require('../services/emailService');

exports.getTopCampaign = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT c.id, c.name,
        SUM(CASE WHEN LOWER(COALESCE(l.status, '')) IN ('sent', 'replied') OR LOWER(COALESCE(l.status, '')) LIKE 'follow-up%' OR l.has_replied = 1 OR (l.message_id IS NOT NULL AND l.message_id != '') THEN 1 ELSE 0 END) AS sent,
        SUM(CASE WHEN l.has_replied = 1 THEN 1 ELSE 0 END) AS replies,
        ROUND(SUM(CASE WHEN l.has_replied = 1 THEN 1 ELSE 0 END) * 100.0 / NULLIF(SUM(CASE WHEN LOWER(COALESCE(l.status, '')) IN ('sent', 'replied') OR LOWER(COALESCE(l.status, '')) LIKE 'follow-up%' OR l.has_replied = 1 OR (l.message_id IS NOT NULL AND l.message_id != '') THEN 1 ELSE 0 END), 0), 2) AS reply_rate
      FROM campaigns c LEFT JOIN leads l ON l.campaign_id = c.id
      WHERE c.user_id = ?
      GROUP BY c.id, c.name
      HAVING SUM(CASE WHEN LOWER(COALESCE(l.status, '')) IN ('sent', 'replied') OR LOWER(COALESCE(l.status, '')) LIKE 'follow-up%' OR l.has_replied = 1 OR (l.message_id IS NOT NULL AND l.message_id != '') THEN 1 ELSE 0 END) > 0
      ORDER BY reply_rate DESC, sent DESC LIMIT 1
    `, [req.user.id]);
    const row = rows[0] || null;
    res.json({ success: true, data: row ? { ...row, sent: parseInt(row.sent) || 0, replies: parseInt(row.replies) || 0, reply_rate: parseFloat(row.reply_rate) || 0 } : null });
  } catch (err) {
    console.error('❌ getTopCampaign ERROR:', err);
    res.status(500).json({ success: false, data: null, message: err.message || 'Internal Server Error' });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT c.id, c.name, MAX(c.status) AS status, MAX(c.subject) AS subject,
        COALESCE(MAX(c.active_sender), MAX(c.sender_email), 'Auto Rotation') AS sender_email,
        MAX(c.created_at) AS created_at, COUNT(l.email) AS total,
        SUM(CASE WHEN LOWER(COALESCE(l.status, '')) IN ('sent', 'replied', 'bounced', 'failed', 'unsubscribed', 'suppressed') OR LOWER(COALESCE(l.status, '')) LIKE 'follow-up%' OR l.has_replied = 1 OR l.is_bounced = 1 THEN 1 ELSE 0 END) AS processed,
        SUM(CASE WHEN LOWER(COALESCE(l.status, '')) IN ('sent', 'replied') OR LOWER(COALESCE(l.status, '')) LIKE 'follow-up%' OR l.has_replied = 1 THEN 1 ELSE 0 END) AS sent,
        SUM(CASE WHEN LOWER(COALESCE(l.status, '')) IN ('pending', 'queued') THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN LOWER(COALESCE(l.status, '')) = 'failed' THEN 1 ELSE 0 END) AS failed,
        SUM(CASE WHEN l.has_replied = 1 THEN 1 ELSE 0 END) AS replied,
        SUM(CASE WHEN LOWER(COALESCE(l.status, '')) = 'bounced' OR l.is_bounced = 1 THEN 1 ELSE 0 END) AS bounced,
        SUM(CASE WHEN LOWER(COALESCE(l.status, '')) = 'suppressed' THEN 1 ELSE 0 END) AS suppressed
      FROM campaigns c LEFT JOIN leads l ON l.campaign_id = c.id
      WHERE c.user_id = ?
      GROUP BY c.id, c.name
      ORDER BY created_at DESC
    `, [req.user.id]);
    const result = rows.map(row => {
      const total = parseInt(row.total) || 0;
      const processed = parseInt(row.processed) || 0;
      const pending = parseInt(row.pending) || 0;
      const dbStatus = (row.status || '').toLowerCase();
      let computedStatus = 'PENDING';
      if (dbStatus === 'paused') computedStatus = 'PAUSED';
      else if (total > 0 && pending === 0) computedStatus = 'COMPLETED';
      else if (total > 0) computedStatus = 'RUNNING';
      return {
        ...row, total, processed, sent: parseInt(row.sent) || 0,
        pending, failed: parseInt(row.failed) || 0,
        replied: parseInt(row.replied) || 0, bounced: parseInt(row.bounced) || 0,
        suppressed: parseInt(row.suppressed) || 0,
        status: computedStatus,
        progress: total > 0 ? Math.round((processed / total) * 100) : 0,
        reply_rate: total > 0 ? parseFloat(((parseInt(row.replied) || 0) / total * 100).toFixed(1)) : 0,
      };
    });
    const senderEmails = rows.map(r => r.sender_email).filter(Boolean);
    const uniqueDomains = [...new Set(senderEmails.map(domainFromEmail))];
    const domainSenderCounts = await Promise.all(uniqueDomains.map(async d => {
      await getOrCreateRecord(d).catch(() => {});
      const senders = await getActiveSenders(d).catch(() => []);
      return { domain: d, count: senders.length };
    }));
    const senderCountByDomain = Object.fromEntries(domainSenderCounts.map(({ domain, count }) => [domain, count]));
    const annotated = result.map(r => ({ ...r, active_sender_count: r.sender_email ? (senderCountByDomain[domainFromEmail(r.sender_email)] ?? 0) : 0 }));
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
    if (!automationEnabled) return res.status(400).json({ success: false, error: 'Follow-up automation is paused' });
    const {
      campaign: camp,
      campaignTemplateId,
      templates,
    } = await getCampaignFollowUpTemplatesForCampaign(campaignId, req.user.id);
    if (!camp) return res.status(404).json({ success: false, error: 'Campaign not found' });
    const isPaused = camp.followup_enabled === 0 || ['paused', 'archived', 'stopped', 'cancelled', 'canceled'].includes(String(camp.status || '').trim().toLowerCase());
    if (isPaused) return res.status(400).json({ success: false, error: 'Campaign is paused' });
    if (!campaignTemplateId) {
      return res.status(400).json({ success: false, error: 'No initial template is linked to this campaign.' });
    }
    if (!templates.length) {
      return res.status(400).json({ success: false, error: 'No follow-up templates linked to this campaign.' });
    }

    const templateByStage = new Map(templates.map(tpl => [Number(tpl.followup_stage), tpl]));

    const { rows: leads } = await pool.query(`
      SELECT
        leads.*,
        fq.followup_stage AS queued_followup_stage,
        fq.followup_template_id AS queued_followup_template_id
      FROM leads
      LEFT JOIN (
        SELECT q1.*
        FROM followup_queue q1
        JOIN (
          SELECT lead_email, campaign_id, MIN(followup_stage) AS followup_stage
          FROM followup_queue
          WHERE campaign_id = ? AND status = 'pending'
          GROUP BY lead_email, campaign_id
        ) q2
          ON q2.lead_email = q1.lead_email
         AND q2.campaign_id = q1.campaign_id
         AND q2.followup_stage = q1.followup_stage
        WHERE q1.status = 'pending'
      ) fq ON fq.lead_email = leads.email AND fq.campaign_id = leads.campaign_id
      WHERE leads.campaign_id = ? AND leads.has_replied = 0 AND leads.is_bounced = 0
        AND (leads.followup_enabled = 1 OR leads.followup_enabled IS NULL) AND leads.follow_up_step <= 6 AND leads.status != 'Pending'
        AND NOT EXISTS (
          SELECT 1 FROM email_queue eq
          WHERE eq.campaign_id = leads.campaign_id
            AND eq.lead_email = leads.email
            AND eq.type = 'manual_followup'
            AND eq.status IN ('pending', 'processing')
        )
    `, [campaignId, campaignId]);
    if (leads.length === 0) return res.json({ success: true, queued: 0, message: 'No eligible leads for follow-up' });
    let queued = 0;
    let skipped = 0;
    for (const lead of leads) {
      const senderEmail = lead.sender_email || process.env.DEFAULT_SENDER_EMAIL;
      if (!senderEmail) {
        skipped++;
        continue;
      }
      const step = Number(lead.queued_followup_stage || (lead.follow_up_step ?? 0) + 1);
      if (step <= Number(lead.follow_up_step || 0)) {
        skipped++;
        continue;
      }
      const template = templateByStage.get(Number(step));

      if (!template) {
        console.warn('[FOLLOWUP_SEND] No linked follow-up template found; skipping lead=', lead.email, 'stage=', step);
        skipped++;
        continue;
      }

      const html = injectVariables(template.body || '', lead);
      const subject = injectVariables(template.subject || '', lead).trim();
      const templateName = template.campaign_template_name || template.subject || 'N/A';
      console.log('[FOLLOWUP_SEND] campaignId=', campaignId, 'lead=', lead.email, 'stage=', step, 'templateId=', template.id, 'templateName=', templateName, 'subject=', subject);
      console.log('[TEMPLATE_RENDER] source=database templateId=', template.id, 'templateName=', templateName, 'subject=', subject, 'bodyLength=', html.length, 'varsReplaced=', !!html.includes(lead.name || ''));

      if (!subject) {
        console.warn('[FOLLOWUP_SEND] Linked follow-up template has no subject; skipping lead=', lead.email, 'stage=', step);
        skipped++;
        continue;
      }
      if (!html) {
        console.warn('[FOLLOWUP_SEND] Linked follow-up template has no body; skipping lead=', lead.email, 'stage=', step);
        skipped++;
        continue;
      }

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(
          `SELECT email FROM leads WHERE email = ? AND campaign_id = ? FOR UPDATE`,
          [lead.email, campaignId]
        );
        const { rows: activeManualJobs } = await client.query(
          `SELECT id FROM email_queue
           WHERE lead_email = ? AND campaign_id = ? AND type = 'manual_followup'
             AND status IN ('pending', 'processing')
           LIMIT 1`,
          [lead.email, campaignId]
        );
        if (activeManualJobs.length > 0) {
          await client.query('COMMIT');
          skipped++;
          continue;
        }
        await client.query(
          `INSERT INTO email_queue
             (lead_email, campaign_id, subject, html_body, status, type, sender_email, user_id,
              campaign_template_id, followup_template_id, followup_stage)
           VALUES (?, ?, ?, ?, 'pending', 'manual_followup', ?, ?, ?, ?, ?)`,
          [lead.email, campaignId, subject, html, senderEmail, req.user.id, campaignTemplateId, template.id, step]
        );
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        throw err;
      } finally {
        client.release();
      }
      console.log('[EMAIL_SEND] recipient=', lead.email, 'subjectSent=', subject, 'templateId=', template?.id || 'none', 'campaignId=', campaignId);
      queued++;
    }
    const message = queued > 0
      ? `${queued} follow-up(s) queued successfully${skipped ? `; ${skipped} skipped` : ''}`
      : 'No eligible leads matched a linked follow-up stage.';
    res.json({ success: true, queued, skipped, message });
  } catch (err) {
    console.error('[FOLLOWUP/SEND-NOW]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
