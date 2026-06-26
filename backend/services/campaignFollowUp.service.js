'use strict';

/**
 * Campaign-Linked Follow-Up Service
 *
 * Manages follow-up templates that are directly linked to a campaign template
 * (email_templates row) and a separate followup_queue for scheduling/tracking.
 *
 * Design:
 *   followup_templates  — stores per-stage config (subject, body, delay) keyed by campaign_template_id
 *   followup_queue      — one pending row per lead × stage, created after initial send
 *
 * Coexists with automatedFollowUp.service.js; neither modifies the other's tables.
 */

const pool = require('../db');
const { sendEmail, injectVariables } = require('./emailService');
const { canSendEmail, incrementSenderCount } = require('./senderWarmup.service');
const { generatePlainText } = require('../utils/plainText');
const { isUnsubscribed } = require('./unsubscribe.service');
const { getAutomationEnabled } = require('./systemSettings.service');

// ─── Schema (idempotent) ─────────────────────────────────────────────────────

let schemaMigrated = false;

async function ensureSchema() {
  if (schemaMigrated) return;

  const stmts = [
    `CREATE TABLE IF NOT EXISTS followup_templates (
      id                   INT AUTO_INCREMENT PRIMARY KEY,
      campaign_template_id INT NOT NULL,
      sender_account_id    INT DEFAULT NULL,
      followup_stage       INT NOT NULL,
      delay_value          INT NOT NULL DEFAULT 1,
      delay_unit           VARCHAR(10) NOT NULL DEFAULT 'days',
      subject              VARCHAR(500) NOT NULL,
      body                 LONGTEXT NOT NULL,
      created_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at           DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_ft_template (campaign_template_id),
      INDEX idx_ft_sender   (sender_account_id),
      UNIQUE KEY uniq_ft_template_stage (campaign_template_id, followup_stage)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    `CREATE TABLE IF NOT EXISTS followup_queue (
      id                   INT AUTO_INCREMENT PRIMARY KEY,
      lead_email           VARCHAR(255) NOT NULL,
      campaign_id          INT NOT NULL,
      campaign_template_id INT NOT NULL,
      followup_template_id INT NOT NULL,
      followup_stage       INT NOT NULL,
      scheduled_at         DATETIME NOT NULL,
      status               VARCHAR(50) NOT NULL DEFAULT 'pending',
      stopped_reason       VARCHAR(255),
      sent_at              DATETIME,
      created_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX  idx_fq_lead          (lead_email),
      INDEX  idx_fq_campaign      (campaign_id),
      INDEX  idx_fq_status_sched  (status, scheduled_at),
      UNIQUE KEY uniq_fq_lead_campaign_stage (lead_email(191), campaign_id, followup_stage)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Column on campaigns so queueWorker can look up the linked template id
    `ALTER TABLE campaigns ADD COLUMN initial_template_id INT DEFAULT NULL`,
    `ALTER TABLE campaigns ADD COLUMN followup_enabled TINYINT(1) DEFAULT 1`,
  ];

  for (const sql of stmts) {
    await pool.query(sql).catch(() => {});
  }

  schemaMigrated = true;
  console.log('[CAMPAIGN_FU] Schema ready');
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcScheduledAt(initialSentAt, delayValue, delayUnit) {
  const base = new Date(initialSentAt);
  const ms   = delayUnit === 'hours'
    ? delayValue * 60 * 60 * 1000
    : delayValue * 24 * 60 * 60 * 1000;
  return new Date(base.getTime() + ms);
}

function normalizedStatus(value) {
  return String(value || '').trim().toLowerCase();
}

function isFollowUpPaused(campaign) {
  if (!campaign) return { paused: true, reason: 'campaign_missing' };
  if (campaign.followup_enabled === 0 || campaign.followup_enabled === false) {
    return { paused: true, reason: 'paused' };
  }

  const status = normalizedStatus(campaign.status);
  if (['paused', 'archived', 'stopped', 'cancelled', 'canceled'].includes(status)) {
    return { paused: true, reason: 'paused' };
  }

  return { paused: false, reason: null };
}

function logFollowUpCheck(campaign, automationEnabled, isSelected) {
  const automationStatus = automationEnabled ? 'active' : 'paused';
  const followupStatus = campaign?.followup_enabled === 0 || campaign?.followup_enabled === false
    ? 'paused'
    : normalizedStatus(campaign?.status) || 'active';

  console.log(
    `[FOLLOWUP_CHECK] campaign_id=${campaign?.id || ''} campaign_name=${JSON.stringify(campaign?.name || '')} ` +
    `automation_status=${automationStatus} followup_status=${followupStatus} is_selected=${isSelected}`
  );
}

async function getCampaignState(campaignId) {
  const { rows } = await pool.query(
    `SELECT id, name, status, followup_enabled FROM campaigns WHERE id = ? LIMIT 1`,
    [campaignId]
  );
  return rows[0] || null;
}

async function canProcessCampaignFollowUps(campaignId, isSelected) {
  const automationEnabled = await getAutomationEnabled();
  const campaign = await getCampaignState(campaignId);
  logFollowUpCheck(campaign || { id: campaignId, name: '', status: null, followup_enabled: null }, automationEnabled, isSelected);

  if (!automationEnabled) {
    console.log(`[FOLLOWUP_SKIP] campaign_id=${campaignId} reason=paused`);
    return { ok: false, reason: 'paused', campaign };
  }

  const paused = isFollowUpPaused(campaign);
  if (paused.paused) {
    console.log(`[FOLLOWUP_SKIP] campaign_id=${campaignId} reason=${paused.reason}`);
    return { ok: false, reason: paused.reason, campaign };
  }

  return { ok: true, reason: null, campaign };
}

// ─── Schedule follow-ups after initial send ──────────────────────────────────

/**
 * Called by queueWorker after a successful initial email send.
 * Creates one followup_queue row per configured follow-up stage.
 */
async function scheduleLinkedFollowUps(leadEmail, campaignId, campaignTemplateId, initialSentAt) {
  await ensureSchema();

  const campaignCheck = await canProcessCampaignFollowUps(campaignId, false);
  if (!campaignCheck.ok) return;

  const { rows: templates } = await pool.query(
    `SELECT * FROM followup_templates
     WHERE campaign_template_id = ?
     ORDER BY followup_stage ASC`,
    [campaignTemplateId]
  );

  if (templates.length === 0) return;

  for (const tpl of templates) {
    const scheduledAt = calcScheduledAt(initialSentAt || new Date(), tpl.delay_value, tpl.delay_unit);
    await pool.query(
      `INSERT IGNORE INTO followup_queue
         (lead_email, campaign_id, campaign_template_id, followup_template_id, followup_stage, scheduled_at, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [leadEmail, campaignId, campaignTemplateId, tpl.id, tpl.followup_stage, scheduledAt]
    );
  }

  console.log(`[CAMPAIGN_FU] Scheduled ${templates.length} linked follow-up(s) for ${leadEmail}`);
}

// ─── Stop all pending follow-ups for a lead+campaign ────────────────────────

async function stopLinkedFollowUps(leadEmail, campaignId, reason) {
  const { rowsAffected } = await pool.query(
    `UPDATE followup_queue
     SET status = 'stopped', stopped_reason = ?
     WHERE lead_email = ? AND campaign_id = ? AND status = 'pending'`,
    [reason, leadEmail, campaignId]
  ).catch(() => ({ rowsAffected: 0 }));
  if (rowsAffected > 0) {
    console.log(`[CAMPAIGN_FU] Stopped ${rowsAffected} pending follow-up(s) for ${leadEmail} — ${reason}`);
  }
}

// ─── Main scheduler ──────────────────────────────────────────────────────────

let schedulerRunning = false;

async function runCampaignLinkedFollowUpScheduler() {
  if (schedulerRunning) {
    console.log('[CAMPAIGN_FU] Scheduler already running — skipping');
    return 0;
  }
  schedulerRunning = true;

  try {
    await ensureSchema();
    console.log('[CAMPAIGN_FU] Scheduler tick at', new Date().toISOString());

    const automationEnabled = await getAutomationEnabled();
    if (!automationEnabled) {
      console.log('[FOLLOWUP_SKIP] campaign_id=all reason=paused');
      console.log('[CAMPAIGN_FU] Global follow-up automation paused - skipping scheduler');
      return 0;
    }

    const { rows: due } = await pool.query(`
      SELECT
        fq.*,
        ft.subject    AS fu_subject,
        ft.body       AS fu_body,
        l.has_replied,
        l.is_bounced,
        l.unsubscribed,
        l.message_id  AS lead_message_id,
        l.thread_id   AS lead_thread_id,
        l.name        AS lead_name,
        l.sender_email AS lead_sender,
        l.last_subject,
        c.name        AS campaign_name,
        c.subject     AS campaign_subject,
        c.status      AS campaign_status,
        c.followup_enabled AS campaign_followup_enabled
      FROM followup_queue fq
      JOIN followup_templates ft ON ft.id = fq.followup_template_id
      JOIN leads l ON l.email = fq.lead_email AND l.campaign_id = fq.campaign_id
      JOIN campaigns c ON c.id = fq.campaign_id
      WHERE fq.status = 'pending'
        AND fq.scheduled_at <= NOW()
        AND (c.followup_enabled = 1 OR c.followup_enabled IS NULL)
        AND (c.status IS NULL OR LOWER(c.status) NOT IN ('paused', 'archived', 'stopped', 'cancelled', 'canceled'))
      ORDER BY fq.scheduled_at ASC
      LIMIT 20
    `);

    if (due.length === 0) {
      console.log('[CAMPAIGN_FU] No linked follow-ups due');
      return 0;
    }

    console.log(`[CAMPAIGN_FU] ${due.length} linked follow-up(s) due`);
    let sent = 0;

    for (const rec of due) {
      try {
        logFollowUpCheck({
          id: rec.campaign_id,
          name: rec.campaign_name,
          status: rec.campaign_status,
          followup_enabled: rec.campaign_followup_enabled,
        }, automationEnabled, true);
        // ── Stop-condition checks ────────────────────────────────────────────
        const suppressed = await isUnsubscribed(rec.lead_email);
        if (rec.has_replied || rec.is_bounced || rec.unsubscribed || suppressed) {
          const reason = rec.has_replied  ? 'reply_received'
                       : rec.is_bounced   ? 'bounced'
                       : 'unsubscribed';
          await pool.query(
            `UPDATE followup_queue
             SET status = 'stopped', stopped_reason = ?
             WHERE lead_email = ? AND campaign_id = ? AND status = 'pending'`,
            [reason, rec.lead_email, rec.campaign_id]
          );
          console.log(`[CAMPAIGN_FU] Stopped all pending for ${rec.lead_email} — ${reason}`);
          continue;
        }

        const campaignCheck = await canProcessCampaignFollowUps(rec.campaign_id, false);
        if (!campaignCheck.ok) {
          await pool.query(
            `UPDATE followup_queue
             SET status = 'pending',
                 stopped_reason = ?,
                 scheduled_at = GREATEST(scheduled_at, NOW() + INTERVAL 10 MINUTE)
             WHERE id = ?`,
            [campaignCheck.reason, rec.id]
          ).catch(() => {});
          continue;
        }

        // ── Sender warmup ────────────────────────────────────────────────────
        const senderEmail = rec.lead_sender || process.env.DEFAULT_SENDER_EMAIL;
        if (!senderEmail) {
          console.warn(`[CAMPAIGN_FU] No sender for ${rec.lead_email} — skipping`);
          continue;
        }

        const warmupOk = await canSendEmail(senderEmail);
        if (!warmupOk) {
          console.warn(`[CAMPAIGN_FU] Warmup limit for ${senderEmail} — pausing batch`);
          break;
        }

        // ── Build email content ──────────────────────────────────────────────
        const leadData = { name: rec.lead_name || '', email: rec.lead_email };

        const originalSubject = rec.last_subject || rec.campaign_subject || '';
        const cleanOriginal   = originalSubject.replace(/^(Re:\s*)+/i, '').trim();

        let emailSubject = (rec.fu_subject || '').trim();
        if (!emailSubject) {
          emailSubject = cleanOriginal ? `Re: ${cleanOriginal}` : 'Following up';
        } else {
          emailSubject = injectVariables(emailSubject, leadData);
          if (!/^Re:/i.test(emailSubject) && cleanOriginal) {
            emailSubject = `Re: ${emailSubject}`;
          }
        }

        const resolvedHtml = injectVariables(rec.fu_body, leadData);
        const resolvedText = generatePlainText(resolvedHtml);

        const preSendCampaignCheck = await canProcessCampaignFollowUps(rec.campaign_id, false);
        if (!preSendCampaignCheck.ok) {
          await pool.query(
            `UPDATE followup_queue
             SET status = 'pending',
                 stopped_reason = ?,
                 scheduled_at = GREATEST(scheduled_at, NOW() + INTERVAL 10 MINUTE)
             WHERE id = ?`,
            [preSendCampaignCheck.reason, rec.id]
          ).catch(() => {});
          continue;
        }

        console.log(`[CAMPAIGN_FU] Sending stage ${rec.followup_stage} to ${rec.lead_email} subject="${emailSubject}"`);

        const result = await sendEmail({
          to:            rec.lead_email,
          subject:       emailSubject,
          html:          resolvedHtml,
          text:          resolvedText,
          type:          `campaign_fu_${rec.followup_stage}`,
          inReplyTo:     rec.lead_message_id || undefined,
          references:    rec.lead_message_id || undefined,
          threadId:      rec.lead_thread_id  || undefined,
          senderEmail,
          campaignId:    rec.campaign_id,
          recipientName: rec.lead_name || '',
          lead:          leadData,
        });

        // ── Mark queue row as sent ───────────────────────────────────────────
        await pool.query(
          `UPDATE followup_queue SET status = 'sent', sent_at = NOW() WHERE id = ?`,
          [rec.id]
        );

        // ── Update lead thread info for continued threading ──────────────────
        if (result.messageId) {
          await pool.query(
            `UPDATE leads
             SET message_id       = ?,
                 thread_id        = COALESCE(NULLIF(?, ''), thread_id),
                 last_sent_at     = NOW(),
                 last_activity_at = NOW(),
                 last_subject     = ?
             WHERE email = ? AND campaign_id = ?`,
            [result.messageId, result.threadId || '', emailSubject, rec.lead_email, rec.campaign_id]
          );
        }

        await incrementSenderCount(senderEmail).catch(() => {});
        sent++;

        console.log(`[CAMPAIGN_FU] ✓ Stage ${rec.followup_stage} sent to ${rec.lead_email} via ${senderEmail}`);

        // Natural delay between sends
        await new Promise(r => setTimeout(r, 20000 + Math.floor(Math.random() * 15000)));

      } catch (err) {
        console.error(`[CAMPAIGN_FU] Failed for ${rec.lead_email}:`, err.message);
        await pool.query(
          `UPDATE followup_queue SET status = 'failed', stopped_reason = ? WHERE id = ?`,
          [String(err.message).slice(0, 254), rec.id]
        ).catch(() => {});
      }
    }

    console.log(`[CAMPAIGN_FU] Done — sent: ${sent}`);
    return sent;

  } finally {
    schedulerRunning = false;
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

ensureSchema().catch(err => console.error('[CAMPAIGN_FU] Schema init error:', err.message));

module.exports = {
  scheduleLinkedFollowUps,
  stopLinkedFollowUps,
  runCampaignLinkedFollowUpScheduler,
};
