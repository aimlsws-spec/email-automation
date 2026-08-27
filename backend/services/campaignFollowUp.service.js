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
const { isCampaignFollowUpPaused, logFollowUpCheck } = require('../utils/followUpHelpers');

// ─── Schema (idempotent) ─────────────────────────────────────────────────────

let schemaMigrated = false;
let legacyCampaignTemplateColumnExists = null;

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

    // Metadata on email_queue lets manual follow-up jobs remain idempotent per stage.
    `ALTER TABLE email_queue ADD COLUMN campaign_template_id INT DEFAULT NULL`,
    `ALTER TABLE email_queue ADD COLUMN followup_template_id INT DEFAULT NULL`,
    `ALTER TABLE email_queue ADD COLUMN followup_stage INT DEFAULT NULL`,
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

function getNextStageTemplate(templates, currentStage) {
  const numericStage = Number(currentStage || 0);
  return [...(templates || [])]
    .filter(tpl => Number(tpl.followup_stage) > numericStage)
    .sort((a, b) => Number(a.followup_stage) - Number(b.followup_stage))[0] || null;
}

function isFollowUpPaused(campaign) {
  if (!campaign) return { paused: true, reason: 'campaign_missing' };
  if (isCampaignFollowUpPaused(campaign)) {
    return { paused: true, reason: 'paused' };
  }
  return { paused: false, reason: null };
}

async function getCampaignState(campaignId) {
  const { rows } = await pool.query(
    `SELECT id, name, status, followup_enabled FROM campaigns WHERE id = ? LIMIT 1`,
    [campaignId]
  );
  return rows[0] || null;
}

async function columnExists(tableName, columnName) {
  const { rows } = await pool.query(
    `SELECT COUNT(*) AS count
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );
  return Number(rows[0]?.count || 0) > 0;
}

async function hasLegacyCampaignTemplateColumn() {
  if (legacyCampaignTemplateColumnExists === null) {
    legacyCampaignTemplateColumnExists = await columnExists('campaigns', 'campaign_template_id');
  }
  return legacyCampaignTemplateColumnExists;
}

async function getCampaignTemplateContext(campaignId, userId) {
  await ensureSchema();

  const legacyColumn = await hasLegacyCampaignTemplateColumn();
  const userFilter = userId ? ' AND user_id = ?' : '';
  const params = userId ? [campaignId, userId] : [campaignId];
  const legacySelect = legacyColumn ? ', campaign_template_id' : '';

  const { rows } = await pool.query(
    `SELECT id, name, status, followup_enabled, initial_template_id${legacySelect}
     FROM campaigns
     WHERE id = ?${userFilter}
     LIMIT 1`,
    params
  );

  const campaign = rows[0] || null;
  if (!campaign) return { campaign: null, campaignTemplateId: null, usedLegacyColumn: false };

  const campaignTemplateId = campaign.initial_template_id || (legacyColumn ? campaign.campaign_template_id : null) || null;
  return {
    campaign,
    campaignTemplateId,
    usedLegacyColumn: Boolean(!campaign.initial_template_id && legacyColumn && campaign.campaign_template_id),
  };
}

async function canProcessCampaignFollowUps(campaignId, isSelected) {
  const automationEnabled = await getAutomationEnabled();
  const campaign = await getCampaignState(campaignId);
  logFollowUpCheck(campaign || { id: campaignId, name: '', status: null, followup_enabled: null }, automationEnabled, isSelected);

  if (!campaign) {
    console.log(`[FOLLOWUP_SKIP] campaign_id=${campaignId} reason=campaign_missing`);
    return { ok: false, reason: 'campaign_missing', campaign };
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
 * Creates the first pending followup_queue row. Later stages are created only
 * after the previous stage is actually sent.
 */
async function scheduleLinkedFollowUps(leadEmail, campaignId, campaignTemplateId, initialSentAt) {
  await ensureSchema();

  const campaignCheck = await canProcessCampaignFollowUps(campaignId, false);
  if (!campaignCheck.ok) return;

  const templates = await getCampaignFollowUpTemplates(campaignTemplateId);
  const templateCount = Array.isArray(templates) ? templates.length : 0;

  console.log(
    `[FOLLOWUP_CHECK] Campaign ID=${campaignId} Campaign Template ID=${campaignTemplateId} Linked Templates Found=${templateCount}`
  );

  if (templateCount === 0) {
    console.log(
      `[FOLLOWUP_SKIP] Campaign ID=${campaignId} Campaign Template ID=${campaignTemplateId} Reason=No linked follow-up templates configured. Queue Creation: Skipped`
    );
    return;
  }

  const validTemplates = templates.filter(tpl => tpl && tpl.id && Number.isFinite(Number(tpl.followup_stage)));
  if (validTemplates.length === 0) {
    console.log(
      `[FOLLOWUP_SKIP] Campaign ID=${campaignId} Campaign Template ID=${campaignTemplateId} Reason=No valid linked follow-up templates found. Queue Creation: Skipped`
    );
    return;
  }

  const firstTemplate = validTemplates.sort((a, b) => Number(a.followup_stage) - Number(b.followup_stage))[0];
  const scheduledAt = calcScheduledAt(initialSentAt || new Date(), firstTemplate.delay_value, firstTemplate.delay_unit);

  try {
    await pool.query(
      `INSERT INTO followup_queue
         (lead_email, campaign_id, campaign_template_id, followup_template_id, followup_stage, scheduled_at, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')
       ON DUPLICATE KEY UPDATE
         campaign_template_id = VALUES(campaign_template_id),
         followup_template_id = VALUES(followup_template_id),
         scheduled_at         = VALUES(scheduled_at),
         status               = 'pending',
         stopped_reason       = NULL,
         sent_at              = NULL`,
      [leadEmail, campaignId, campaignTemplateId, firstTemplate.id, firstTemplate.followup_stage, scheduledAt]
    );
    console.log(
      `[FOLLOWUP_CREATE] Templates Found=${templateCount} Campaign ID=${campaignId} Lead=${leadEmail} Stage=${firstTemplate.followup_stage} ScheduledAt=${scheduledAt.toISOString()} TemplateId=${firstTemplate.id}`
    );
  } catch (err) {
    console.warn(`[FOLLOWUP_CREATE] Failed to insert followup_queue for ${leadEmail} stage=${firstTemplate.followup_stage}:`, err.message);
  }

  console.log(
    `[FOLLOWUP_CREATE] Campaign ID=${campaignId} Campaign Template ID=${campaignTemplateId} Templates Found=${templateCount} Next Pending Stage=${firstTemplate.followup_stage}`
  );
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

async function getCampaignFollowUpTemplate(campaignTemplateId, stage) {
  if (!campaignTemplateId) return null;
  const { rows } = await pool.query(
    `SELECT ft.*, et.name AS campaign_template_name
     FROM followup_templates ft
     LEFT JOIN email_templates et ON et.id = ft.campaign_template_id
     WHERE ft.campaign_template_id = ? AND ft.followup_stage = ?
     LIMIT 1`,
    [campaignTemplateId, stage]
  );
  return rows[0] || null;
}

async function getCampaignFollowUpTemplates(campaignTemplateId) {
  if (!campaignTemplateId) return [];
  const { rows } = await pool.query(
    `SELECT ft.*, et.name AS campaign_template_name
     FROM followup_templates ft
     JOIN email_templates et ON et.id = ft.campaign_template_id
     WHERE ft.campaign_template_id = ?
     ORDER BY ft.followup_stage ASC`,
    [campaignTemplateId]
  );
  return rows;
}

async function getCampaignFollowUpTemplatesForCampaign(campaignId, userId) {
  const context = await getCampaignTemplateContext(campaignId, userId);
  if (!context.campaign || !context.campaignTemplateId) {
    return { ...context, templates: [] };
  }

  const templates = await getCampaignFollowUpTemplates(context.campaignTemplateId);
  const validTemplates = templates
    .filter(tpl => tpl && tpl.id && Number.isFinite(Number(tpl.followup_stage)))
    .sort((a, b) => Number(a.followup_stage) - Number(b.followup_stage));

  return { ...context, templates: validTemplates };
}

async function getCampaignFollowUpTemplateForCampaign(campaignId, stage, userId) {
  const context = await getCampaignFollowUpTemplatesForCampaign(campaignId, userId);
  const numericStage = Number(stage);
  const template = context.templates.find(tpl => Number(tpl.followup_stage) === numericStage) || null;
  return { ...context, template };
}

async function syncFollowUpQueueAfterSend({
  leadEmail,
  campaignId,
  campaignTemplateId,
  followupTemplateId,
  followupStage,
  queueId,
  queueJobId,
  messageId,
  threadId,
  subject,
  senderEmail,
}) {
  await ensureSchema();

  const sentStage = Number(followupStage || 0);
  if (!leadEmail || !campaignId || !campaignTemplateId || !sentStage) {
    throw new Error('Missing follow-up synchronization context');
  }

  const templates = await getCampaignFollowUpTemplates(campaignTemplateId);
  const nextTemplate = getNextStageTemplate(templates, sentStage);
  const nextScheduledAt = nextTemplate
    ? calcScheduledAt(new Date(), nextTemplate.delay_value, nextTemplate.delay_unit)
    : null;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: leadRows } = await client.query(
      `SELECT email, follow_up_step, follow_up_count, has_replied, is_bounced, unsubscribed
       FROM leads
       WHERE email = ? AND campaign_id = ?
       LIMIT 1
       FOR UPDATE`,
      [leadEmail, campaignId]
    );
    const lead = leadRows[0] || null;

    if (!lead) {
      throw new Error(`Lead not found for follow-up sync: ${leadEmail}`);
    }

    if (lead.has_replied || lead.is_bounced || lead.unsubscribed) {
      if (queueJobId) {
        await client.query(
          `UPDATE email_queue
           SET status = 'sent', last_error = NULL, updated_at = NOW()
           WHERE id = ?`,
          [queueJobId]
        );
      }
      await client.query(
        `UPDATE followup_queue
         SET status = 'stopped',
             stopped_reason = ?,
             sent_at = COALESCE(sent_at, NOW())
         WHERE lead_email = ? AND campaign_id = ? AND status = 'pending'`,
        [lead.has_replied ? 'reply_received' : lead.is_bounced ? 'bounced' : 'unsubscribed', leadEmail, campaignId]
      );
      await client.query(
        `UPDATE leads
         SET followup_enabled = 0,
             followup_stopped_reason = ?,
             next_follow_up_at = NULL,
             last_activity_at = NOW()
         WHERE email = ? AND campaign_id = ?`,
        [lead.has_replied ? 'replied' : lead.is_bounced ? 'bounced' : 'unsubscribed', leadEmail, campaignId]
      );
      await client.query('COMMIT');
      return { completedStage: sentStage, nextStage: null, stopped: true };
    }

    if (queueId) {
      await client.query(
        `UPDATE followup_queue
         SET status = 'sent', sent_at = NOW(), stopped_reason = NULL
         WHERE id = ? AND lead_email = ? AND campaign_id = ?`,
        [queueId, leadEmail, campaignId]
      );
    }

    if (queueJobId) {
      await client.query(
        `UPDATE email_queue
         SET status = 'sent', last_error = NULL, updated_at = NOW()
         WHERE id = ?`,
        [queueJobId]
      );
    }

    await client.query(
      `UPDATE followup_queue
       SET status = 'sent', sent_at = COALESCE(sent_at, NOW()), stopped_reason = NULL
       WHERE lead_email = ? AND campaign_id = ? AND followup_stage = ? AND status = 'pending'`,
      [leadEmail, campaignId, sentStage]
    );

    await client.query(
      `UPDATE followup_queue
       SET status = 'stopped', stopped_reason = 'superseded_by_manual_send'
       WHERE lead_email = ? AND campaign_id = ? AND status = 'pending'`,
      [leadEmail, campaignId]
    );

    await client.query(
      `UPDATE leads
       SET follow_up_step = GREATEST(COALESCE(follow_up_step, 0), ?),
           follow_up_count = CASE
             WHEN COALESCE(follow_up_step, 0) < ? THEN COALESCE(follow_up_count, 0) + 1
             ELSE COALESCE(follow_up_count, 0)
           END,
           status = ?,
           message_id = COALESCE(NULLIF(?, ''), message_id),
           thread_id = COALESCE(NULLIF(?, ''), thread_id),
           last_sent_date = NOW(),
           last_sent_at = NOW(),
           last_activity_at = NOW(),
           last_subject = COALESCE(NULLIF(?, ''), last_subject),
           sender_email = COALESCE(NULLIF(?, ''), sender_email),
           next_follow_up_at = ?
       WHERE email = ? AND campaign_id = ?`,
      [
        sentStage,
        sentStage,
        `Follow-up ${sentStage}`,
        messageId || '',
        threadId || '',
        subject || '',
        senderEmail || '',
        nextScheduledAt,
        leadEmail,
        campaignId,
      ]
    );

    if (nextTemplate) {
      await client.query(
        `INSERT INTO followup_queue
           (lead_email, campaign_id, campaign_template_id, followup_template_id, followup_stage, scheduled_at, status)
         VALUES (?, ?, ?, ?, ?, ?, 'pending')
         ON DUPLICATE KEY UPDATE
           campaign_template_id = VALUES(campaign_template_id),
           followup_template_id = VALUES(followup_template_id),
           scheduled_at         = VALUES(scheduled_at),
           status               = 'pending',
           stopped_reason       = NULL,
           sent_at              = NULL`,
        [leadEmail, campaignId, campaignTemplateId, nextTemplate.id, nextTemplate.followup_stage, nextScheduledAt]
      );
    }

    await client.query('COMMIT');
    return {
      completedStage: sentStage,
      completedTemplateId: followupTemplateId || null,
      nextStage: nextTemplate ? Number(nextTemplate.followup_stage) : null,
      nextTemplateId: nextTemplate ? nextTemplate.id : null,
      nextScheduledAt,
      stopped: false,
    };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
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

        const syncResult = await syncFollowUpQueueAfterSend({
          leadEmail: rec.lead_email,
          campaignId: rec.campaign_id,
          campaignTemplateId: rec.campaign_template_id,
          followupTemplateId: rec.followup_template_id,
          followupStage: rec.followup_stage,
          queueId: rec.id,
          messageId: result.messageId,
          threadId: result.threadId,
          subject: emailSubject,
          senderEmail,
        });
        console.log(
          `[FOLLOWUP_SYNC] auto lead=${rec.lead_email} campaign=${rec.campaign_id} ` +
          `completedStage=${syncResult.completedStage} nextStage=${syncResult.nextStage || 'none'}`
        );

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
  getCampaignFollowUpTemplate,
  getCampaignFollowUpTemplates,
  getCampaignFollowUpTemplatesForCampaign,
  getCampaignFollowUpTemplateForCampaign,
  syncFollowUpQueueAfterSend,
  calcScheduledAt,
};
