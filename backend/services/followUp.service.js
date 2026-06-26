const fs = require('fs');
const path = require('path');
const pool = require('../db');
const { sendEmail } = require('./emailService');
const { canSendEmail, incrementSenderCount, domainFromEmail } = require('./senderWarmup.service');
const { getAutomationEnabled } = require('./systemSettings.service');

// Delegate to the new automated follow-up service for the 30-day sequence
const automatedFollowUp = require('./automatedFollowUp.service');

const FOLLOWUP_GAPS_DAYS = [2, 3, 4, 5, 7, 9];
const MAX_FOLLOW_UP_STEP = 6;

const TEMPLATE_PATH = path.join(__dirname, '..', '..', '..', '..', '..', '..', 'templates', 'followup_body.html');
const SUBJECT_PATH  = path.join(__dirname, '..', '..', '..', '..', '..', '..', 'templates', 'followup_subject.txt');

let migrationDone = false;

async function columnExists(table, column) {
  const { rows } = await pool.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  return (rows[0]?.cnt ?? 0) > 0;
}

async function ensureColumns() {
  if (migrationDone) return;

  const additions = [
    { col: 'follow_up_step',    def: 'INT NOT NULL DEFAULT 0' },
    { col: 'last_sent_at',      def: 'DATETIME' },
    { col: 'next_follow_up_at', def: 'DATETIME' },
    { col: 'has_replied',       def: 'TINYINT(1) NOT NULL DEFAULT 0' },
    { col: 'is_bounced',        def: 'TINYINT(1) NOT NULL DEFAULT 0' },
    { col: 'thread_id',         def: 'TEXT' },
    { col: 'message_id',        def: 'TEXT' },
  ];

  for (const { col, def } of additions) {
    const exists = await columnExists('leads', col);
    if (!exists) {
      await pool.query(`ALTER TABLE leads ADD COLUMN ${col} ${def}`).catch(e =>
        console.error(`[followUp] Failed to add column ${col}:`, e.message)
      );
    }
  }

  await pool.query(
    `UPDATE leads SET has_replied = 1 WHERE reply_detected_at IS NOT NULL AND reply_detected_at != '' AND has_replied = 0`
  ).catch(() => {});
  migrationDone = true;
}

function calculateNextFollowUp(step, lastSentAt) {
  const gapDays = FOLLOWUP_GAPS_DAYS[step] ?? FOLLOWUP_GAPS_DAYS[FOLLOWUP_GAPS_DAYS.length - 1];
  const base = lastSentAt ? new Date(lastSentAt) : new Date();
  return new Date(base.getTime() + gapDays * 24 * 60 * 60 * 1000);
}

function shouldSendFollowUp(lead) {
  if (lead.has_replied || lead.is_bounced || lead.unsubscribed) return false;
  if ((lead.follow_up_step ?? 0) > MAX_FOLLOW_UP_STEP) return false;
  if (!lead.next_follow_up_at) return false;
  return new Date() >= new Date(lead.next_follow_up_at);
}

function normalizedStatus(value) {
  return String(value || '').trim().toLowerCase();
}

function isCampaignPaused(lead) {
  if (lead.campaign_followup_enabled === 0 || lead.campaign_followup_enabled === false) return true;
  return ['paused', 'archived', 'stopped', 'cancelled', 'canceled'].includes(normalizedStatus(lead.campaign_status));
}

function logFollowUpCheck(lead, automationEnabled, isSelected) {
  const followupStatus = lead.campaign_followup_enabled === 0 || lead.campaign_followup_enabled === false
    ? 'paused'
    : normalizedStatus(lead.campaign_status) || 'active';

  console.log(
    `[FOLLOWUP_CHECK] campaign_id=${lead.campaign_id || ''} campaign_name=${JSON.stringify(lead.campaign_name || '')} ` +
    `automation_status=${automationEnabled ? 'active' : 'paused'} followup_status=${followupStatus} is_selected=${isSelected}`
  );
}

function getFollowUpTemplate(step, lead) {
  const html = fs.existsSync(TEMPLATE_PATH)
    ? fs.readFileSync(TEMPLATE_PATH, 'utf8')
    : `<p>Hi {{FirstName}},</p><p>Just following up on my previous email.</p><p>Regards,<br>Seawind Solution</p>`;
  const unsub = encodeURIComponent(lead.email || '');
  return html
    .replace(/\{\{\s*FirstName\s*\}\}/g, lead.name || '')
    .replace(/\{\{\s*customerName\s*\}\}/g, lead.name || '')
    .replace(/\{\{\s*company\s*\}\}/g, lead.company || 'your company')
    .replace(/\{\{\s*unsubscribe\s*\}\}/g, unsub)
    .replace(/\{\{\s*unsubscribe_token\s*\}\}/g, unsub);
}

function getFollowUpSubject(step, lead) {
  const template = fs.existsSync(SUBJECT_PATH)
    ? fs.readFileSync(SUBJECT_PATH, 'utf8')
    : 'Re: {{company}}';
  return template
    .replace(/\{\{\s*company\s*\}\}/g, lead.company || 'your business')
    .replace(/\{\{\s*name\s*\}\}/g, lead.name || '')
    .trim();
}

async function scheduleNextFollowUp(leadEmail, step, messageId, threadId) {
  const nextStep = step + 1;
  const nextAt = nextStep <= MAX_FOLLOW_UP_STEP ? calculateNextFollowUp(step, new Date()) : null;
  await pool.query(
    `UPDATE leads
     SET follow_up_step    = ?,
         last_sent_at      = NOW(),
         next_follow_up_at = ?,
         message_id        = CASE WHEN ? != '' THEN ? ELSE message_id END,
         thread_id         = CASE WHEN ? != '' THEN ? ELSE thread_id END
     WHERE email = ?`,
    [nextStep, nextAt, messageId || '', messageId || '', threadId || '', threadId || '', leadEmail]
  );
}

async function markAsReplied(leadEmail) {
  await pool.query(
    `UPDATE leads SET has_replied = 1, next_follow_up_at = NULL WHERE email = ?`,
    [leadEmail]
  );
}

async function markAsBounced(leadEmail) {
  await pool.query(
    `UPDATE leads SET is_bounced = 1, next_follow_up_at = NULL WHERE email = ?`,
    [leadEmail]
  );
}

async function runFollowUpScheduler() {
  // Run the new automated 30-day sequence scheduler
  await automatedFollowUp.runAutomatedFollowUpScheduler().catch(err =>
    console.error('[FOLLOWUP] Automated scheduler error:', err.message)
  );

  await ensureColumns();
  console.log('[FOLLOWUP] Scheduler running at', new Date().toISOString());

  const automationEnabled = await getAutomationEnabled();
  if (!automationEnabled) {
    console.log('[FOLLOWUP_SKIP] campaign_id=all reason=paused');
    return 0;
  }

  const { rows: due } = await pool.query(`
    SELECT
      l.*,
      c.name AS campaign_name,
      c.status AS campaign_status,
      c.followup_enabled AS campaign_followup_enabled
    FROM leads l
    LEFT JOIN campaigns c ON l.campaign_id = c.id
    WHERE l.has_replied    = 0
      AND l.is_bounced     = 0
      AND (l.unsubscribed  = 0 OR l.unsubscribed IS NULL)
      AND l.follow_up_step <= ?
      AND l.next_follow_up_at IS NOT NULL
      AND l.next_follow_up_at <= NOW()
      AND (c.followup_enabled = 1 OR c.followup_enabled IS NULL)
      AND (c.status IS NULL OR LOWER(c.status) NOT IN ('paused', 'archived', 'stopped', 'cancelled', 'canceled'))
    ORDER BY l.next_follow_up_at ASC
    LIMIT 50
  `, [MAX_FOLLOW_UP_STEP]);

  console.log(`[FOLLOWUP] ${due.length} lead(s) due`);
  if (due.length === 0) return 0;

  let sent = 0;
  for (const lead of due) {
    try {
      logFollowUpCheck(lead, automationEnabled, true);
      const { rows: latestCampaignRows } = await pool.query(
        `SELECT id, name AS campaign_name, status AS campaign_status, followup_enabled AS campaign_followup_enabled
         FROM campaigns WHERE id = ? LIMIT 1`,
        [lead.campaign_id]
      );
      const latestLeadState = { ...lead, ...(latestCampaignRows[0] || {}) };
      const latestAutomationEnabled = await getAutomationEnabled();
      logFollowUpCheck(latestLeadState, latestAutomationEnabled, false);
      if (!latestAutomationEnabled || isCampaignPaused(latestLeadState)) {
        console.log(`[FOLLOWUP_SKIP] campaign_id=${lead.campaign_id || ''} reason=paused`);
        continue;
      }

      const senderEmail = lead.sender_email || process.env.DEFAULT_SENDER_EMAIL;
      if (!senderEmail) { console.warn(`[FOLLOWUP] No sender for ${lead.email} — skipping`); continue; }

      const domain = domainFromEmail(senderEmail);
      const allowed = await canSendEmail(senderEmail);
      if (!allowed) { console.warn(`[FOLLOWUP] Domain ${domain} warm-up limit reached — skipping batch`); break; }

      const step    = lead.follow_up_step ?? 0;
      const html    = getFollowUpTemplate(step, lead);
      const subject = getFollowUpSubject(step, lead);

      const result = await sendEmail({
        to: lead.email, subject, html,
        text: html.replace(/<[^>]*>/g, ''),
        type: `follow_up_${step}`,
        inReplyTo: lead.message_id || undefined,
        references: lead.message_id || undefined,
        senderEmail, campaignId: lead.campaign_id, recipientName: lead.name || '',
      });

      await incrementSenderCount(senderEmail);
      await scheduleNextFollowUp(lead.email, step, result.messageId, result.threadId);

      const legacyStatus = `Follow-up ${step}`;
      await pool.query(
        `UPDATE leads SET status = ?, follow_up_count = ?, last_sent_date = NOW(), last_activity_at = NOW() WHERE email = ?`,
        [legacyStatus, step, lead.email]
      );

      await pool.query(
        `UPDATE email_events SET follow_up_sent = 1, follow_up_sent_at = NOW() WHERE recipient_email = ? AND email_type = 'initial'`,
        [lead.email]
      ).catch(() => {});

      console.log(`[FOLLOWUP] Sent FU${step} to ${lead.email} via ${senderEmail}`);
      sent++;
      await new Promise(r => setTimeout(r, 15000));
    } catch (err) {
      console.error(`[FOLLOWUP] Failed for ${lead.email}:`, err.message);
    }
  }

  console.log(`[FOLLOWUP] Done. Sent ${sent}/${due.length}`);
  return sent;
}

ensureColumns().catch(err => console.error('[followUp] Migration error:', err.message));

module.exports = {
  calculateNextFollowUp,
  shouldSendFollowUp,
  scheduleNextFollowUp,
  markAsReplied,
  markAsBounced,
  runFollowUpScheduler,
  getFollowUpTemplate,
  getFollowUpSubject,
  ensureColumns,
  // Re-export automated service helpers
  scheduleInitialFollowUp: automatedFollowUp.scheduleInitialFollowUp,
  handleReplyDetected:     automatedFollowUp.handleReplyDetected,
  handleUnsubscribe:       automatedFollowUp.handleUnsubscribe,
  handleBounce:            automatedFollowUp.handleBounce,
  pauseFollowUp:           automatedFollowUp.pauseFollowUp,
  resumeFollowUp:          automatedFollowUp.resumeFollowUp,
  getFollowUpAnalytics:    automatedFollowUp.getFollowUpAnalytics,
  getLeadFollowUpTimeline: automatedFollowUp.getLeadFollowUpTimeline,
  getSchedulePreview:      automatedFollowUp.getSchedulePreview,
  getNextFollowUpInfo:     automatedFollowUp.getNextFollowUpInfo,
};
