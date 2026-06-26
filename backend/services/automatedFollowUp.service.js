'use strict';

/**
 * Automated Follow-Up Service
 *
 * Implements a 30-day follow-up sequence using saved templates:
 *   Day 1  → FOLLOW UP (VIRALKAR)
 *   Day 3  → FOLLOW UP 2 (VIRALKAR)
 *   Day 7  → FOLLOW UP (VIRALKAR)
 *   Day 11 → FOLLOW UP 2 (VIRALKAR)
 *   Day 15 → FOLLOW UP (VIRALKAR)
 *   Day 20 → FOLLOW UP 2 (VIRALKAR)
 *   Day 25 → FOLLOW UP (VIRALKAR)
 *   Day 30 → STOP
 *
 * Stop conditions: reply, unsubscribe, bounce, manual stop, campaign archived
 */

const pool = require('../db');
const { sendEmail, injectVariables, resolveSubjectForLead } = require('./emailService');
const { canSendEmail, incrementSenderCount, domainFromEmail } = require('./senderWarmup.service');
const { generatePlainText } = require('../utils/plainText');
const { addUnsubscribe, isUnsubscribed } = require('./unsubscribe.service');

// ─── Follow-up schedule: [{ day, templateSlot }] ────────────────────────────
// templateSlot 1 = "FOLLOW UP (VIRALKAR)", 2 = "FOLLOW UP 2 (VIRALKAR)"
const FOLLOWUP_SCHEDULE = [
  { stage: 1, day: 1,  templateSlot: 1 },
  { stage: 2, day: 3,  templateSlot: 2 },
  { stage: 3, day: 7,  templateSlot: 1 },
  { stage: 4, day: 11, templateSlot: 2 },
  { stage: 5, day: 15, templateSlot: 1 },
  { stage: 6, day: 20, templateSlot: 2 },
  { stage: 7, day: 25, templateSlot: 1 },
  // Day 30 = stop, no more follow-ups
];

const MAX_STAGE = FOLLOWUP_SCHEDULE.length;

// Template names in the email_templates table
const TEMPLATE_NAMES = {
  1: 'FOLLOW UP (VIRALKAR)',
  2: 'FOLLOW UP 2 (VIRALKAR)',
};

// Auto-responder / OOO detection patterns
const AUTO_REPLY_PATTERNS = [
  /out of office/i,
  /auto.?reply/i,
  /automatic reply/i,
  /vacation/i,
  /away from (the )?office/i,
  /delivery (status )?notification/i,
  /undeliverable/i,
  /mailer.daemon/i,
  /postmaster/i,
  /do not reply/i,
  /noreply/i,
];

// ─── Schema migration (idempotent) ──────────────────────────────────────────

let schemaMigrated = false;

async function ensureSchema() {
  if (schemaMigrated) return;

  const alterations = [
    `ALTER TABLE leads ADD COLUMN followup_enabled TINYINT(1) DEFAULT 1`,
    `ALTER TABLE leads ADD COLUMN followup_stopped_reason VARCHAR(255)`,
    `ALTER TABLE leads ADD COLUMN unsubscribed TINYINT(1) DEFAULT 0`,
    `ALTER TABLE leads ADD COLUMN unsubscribed_at DATETIME`,
    `ALTER TABLE campaigns ADD COLUMN followup_enabled TINYINT(1) DEFAULT 1`,
    `ALTER TABLE campaigns ADD COLUMN initial_template_id INT`,
    `ALTER TABLE campaigns ADD COLUMN followup_template_1_id INT`,
    `ALTER TABLE campaigns ADD COLUMN followup_template_2_id INT`,
    `CREATE TABLE IF NOT EXISTS followup_logs (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      lead_email     VARCHAR(255) NOT NULL,
      campaign_id    INT,
      followup_stage INT NOT NULL,
      template_used  VARCHAR(500),
      status         VARCHAR(50) DEFAULT 'sent',
      message_id     TEXT,
      thread_id      TEXT,
      sent_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
      stopped_reason VARCHAR(255),
      INDEX idx_lead (lead_email),
      INDEX idx_campaign (campaign_id),
      INDEX idx_stage (followup_stage),
      INDEX idx_sent_at (sent_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `CREATE TABLE IF NOT EXISTS suppression_list (
      email      VARCHAR(255) NOT NULL PRIMARY KEY,
      reason     VARCHAR(100) DEFAULT 'unsubscribe',
      campaign_id INT,
      added_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address VARCHAR(100),
      user_agent TEXT,
      INDEX idx_reason (reason)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  ];

  for (const sql of alterations) {
    await pool.query(sql).catch(() => {}); // silently skip duplicate column errors
  }

  // Backfill: stop follow-ups for already-replied/bounced leads
  await pool.query(`
    UPDATE leads SET followup_enabled = 0, followup_stopped_reason = 'replied'
    WHERE has_replied = 1 AND (followup_enabled IS NULL OR followup_enabled = 1)
  `).catch(() => {});

  await pool.query(`
    UPDATE leads SET followup_enabled = 0, followup_stopped_reason = 'bounced'
    WHERE is_bounced = 1 AND (followup_enabled IS NULL OR followup_enabled = 1)
  `).catch(() => {});

  schemaMigrated = true;
  console.log('[FOLLOWUP_AUTO] Schema migration complete');
}

// ─── Template cache ──────────────────────────────────────────────────────────

const templateCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function getTemplate(slot) {
  const name = TEMPLATE_NAMES[slot];
  if (!name) throw new Error(`Unknown template slot: ${slot}`);

  const cached = templateCache.get(slot);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.data;

  const { rows } = await pool.query(
    `SELECT id, name, html_content FROM email_templates WHERE name = ? AND 1=1 LIMIT 1`,
    [name]
  );

  if (!rows[0]) {
    throw new Error(`Template "${name}" not found in email_templates table. Please create it first.`);
  }

  templateCache.set(slot, { data: rows[0], ts: Date.now() });
  return rows[0];
}

// ─── Schedule helpers ────────────────────────────────────────────────────────

function getScheduleEntry(stage) {
  return FOLLOWUP_SCHEDULE.find(s => s.stage === stage) || null;
}

function getNextStageEntry(currentStage) {
  return FOLLOWUP_SCHEDULE.find(s => s.stage === currentStage + 1) || null;
}

/**
 * Calculate the next follow-up datetime based on the INITIAL send date.
 * This ensures Day 1 = 1 day after initial, Day 3 = 3 days after initial, etc.
 */
function calcNextFollowUpAt(initialSentAt, nextDayOffset) {
  const base = new Date(initialSentAt);
  // Add random jitter: ±2 hours to avoid burst patterns
  const jitterMs = (Math.random() * 4 - 2) * 60 * 60 * 1000;
  return new Date(base.getTime() + nextDayOffset * 24 * 60 * 60 * 1000 + jitterMs);
}

// ─── Stop condition checks ───────────────────────────────────────────────────

async function isInSuppressionList(email) {
  const { rows } = await pool.query(
    `SELECT email FROM suppression_list WHERE email = ? LIMIT 1`,
    [email]
  );
  return rows.length > 0;
}

function isAutoReply(subject = '', body = '') {
  const text = `${subject} ${body}`.toLowerCase();
  return AUTO_REPLY_PATTERNS.some(p => p.test(text));
}

function shouldSendFollowUp(lead) {
  if (!lead.followup_enabled && lead.followup_enabled !== null) return { ok: false, reason: 'followup_disabled' };
  if (lead.has_replied)   return { ok: false, reason: 'replied' };
  if (lead.is_bounced)    return { ok: false, reason: 'bounced' };
  if (lead.unsubscribed)  return { ok: false, reason: 'unsubscribed' };
  if (!lead.next_follow_up_at) return { ok: false, reason: 'no_schedule' };
  if (new Date() < new Date(lead.next_follow_up_at)) return { ok: false, reason: 'not_due_yet' };
  if ((lead.follow_up_step ?? 0) >= MAX_STAGE) return { ok: false, reason: 'max_stage_reached' };
  return { ok: true };
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

// ─── Core send logic ─────────────────────────────────────────────────────────

async function sendFollowUp(lead) {
  const currentStage = lead.follow_up_step ?? 0;
  const nextStage    = currentStage + 1;
  const schedEntry   = getScheduleEntry(nextStage);

  if (!schedEntry) {
    console.log(`[FOLLOWUP_AUTO] No schedule entry for stage ${nextStage} — stopping`);
    await stopFollowUp(lead.email, 'max_stage_reached');
    return null;
  }

  // Fetch template from DB (never hardcoded)
  const template = await getTemplate(schedEntry.templateSlot);

  // Resolve subject: always "Re: <original subject>" for threading
  const originalSubject = lead.last_subject || lead.campaign_subject || 'our conversation';
  const cleanSubject = originalSubject.replace(/^(Re:\s*)+/i, '').trim();
  const emailSubject = `Re: ${cleanSubject}`;

  // Inject lead variables into template HTML
  const resolvedHtml = injectVariables(template.html_content, lead);
  const resolvedText = generatePlainText(resolvedHtml);

  const senderEmail = lead.sender_email || process.env.DEFAULT_SENDER_EMAIL;
  if (!senderEmail) throw new Error(`No sender email for lead ${lead.email}`);

  // Threading headers — keep in same Gmail conversation
  const inReplyTo = lead.message_id || undefined;
  const references = lead.message_id || undefined;
  const threadId  = lead.thread_id  || undefined;

  console.log(`[FOLLOWUP_AUTO] Sending stage ${nextStage} (${template.name}) to ${lead.email} | subject="${emailSubject}" | inReplyTo=${inReplyTo || 'none'}`);

  const result = await sendEmail({
    to:           lead.email,
    subject:      emailSubject,
    html:         resolvedHtml,
    text:         resolvedText,
    type:         `follow_up_${nextStage}`,
    inReplyTo,
    references,
    threadId,
    senderEmail,
    campaignId:   lead.campaign_id,
    recipientName: lead.name || '',
    lead,
  });

  // Determine next schedule
  const afterNextEntry = getNextStageEntry(nextStage);
  const nextFollowUpAt = afterNextEntry
    ? calcNextFollowUpAt(lead.initial_sent_at || lead.last_sent_at || new Date(), afterNextEntry.day)
    : null;

  // Update lead state
  await pool.query(`
    UPDATE leads
    SET follow_up_step    = ?,
        follow_up_count   = follow_up_count + 1,
        last_sent_at      = NOW(),
        last_activity_at  = NOW(),
        next_follow_up_at = ?,
        message_id        = CASE WHEN ? != '' THEN ? ELSE message_id END,
        thread_id         = CASE WHEN ? != '' THEN ? ELSE thread_id END,
        status            = ?,
        last_subject      = ?
    WHERE email = ?
  `, [
    nextStage,
    nextFollowUpAt,
    result.messageId || '', result.messageId || '',
    result.threadId  || '', result.threadId  || '',
    `Follow-up ${nextStage}`,
    emailSubject,
    lead.email,
  ]);

  // Log the follow-up activity
  await pool.query(`
    INSERT INTO followup_logs (lead_email, campaign_id, followup_stage, template_used, status, message_id, thread_id, sent_at)
    VALUES (?, ?, ?, ?, 'sent', ?, ?, NOW())
  `, [lead.email, lead.campaign_id, nextStage, template.name, result.messageId || '', result.threadId || ''])
  .catch(err => console.error('[FOLLOWUP_AUTO] Log insert failed:', err.message));

  // If no more stages, mark as completed
  if (!afterNextEntry) {
    await stopFollowUp(lead.email, 'sequence_complete');
  }

  console.log(`[FOLLOWUP_AUTO] ✓ Stage ${nextStage} sent to ${lead.email} via ${senderEmail}`);
  return result;
}

// ─── Stop follow-up for a lead ───────────────────────────────────────────────

async function stopFollowUp(email, reason) {
  await pool.query(`
    UPDATE leads
    SET followup_enabled = 0,
        followup_stopped_reason = ?,
        next_follow_up_at = NULL
    WHERE email = ?
  `, [reason, email]);

  await pool.query(`
    INSERT INTO followup_logs (lead_email, campaign_id, followup_stage, status, stopped_reason, sent_at)
    SELECT email, campaign_id, COALESCE(follow_up_step, 0), 'stopped', ?, NOW()
    FROM leads WHERE email = ?
  `, [reason, email]).catch(() => {});

  console.log(`[FOLLOWUP_AUTO] Stopped follow-up for ${email} — reason: ${reason}`);
}

// ─── Schedule initial follow-up after first send ────────────────────────────

async function scheduleInitialFollowUp(leadEmail, messageId, threadId, initialSentAt) {
  const firstEntry = FOLLOWUP_SCHEDULE[0]; // Day 1
  const nextAt = calcNextFollowUpAt(initialSentAt || new Date(), firstEntry.day);

  await pool.query(`
    UPDATE leads
    SET follow_up_step    = 0,
        followup_enabled  = 1,
        next_follow_up_at = ?,
        message_id        = CASE WHEN ? != '' THEN ? ELSE message_id END,
        thread_id         = CASE WHEN ? != '' THEN ? ELSE thread_id END,
        last_sent_at      = NOW()
    WHERE email = ?
  `, [
    nextAt,
    messageId || '', messageId || '',
    threadId  || '', threadId  || '',
    leadEmail,
  ]);

  console.log(`[FOLLOWUP_AUTO] Scheduled first follow-up for ${leadEmail} at ${nextAt.toISOString()}`);
}

// ─── Main scheduler (runs every N minutes via cron) ─────────────────────────

let schedulerRunning = false;

async function isGlobalAutomationEnabled() {
  try {
    const { rows } = await pool.query(
      `SELECT \`value\` FROM system_settings WHERE \`key\` = 'followup_automation_enabled' LIMIT 1`
    );
    return rows[0]?.value !== '0';
  } catch {
    return true; // default enabled if table missing
  }
}

async function runAutomatedFollowUpScheduler() {
  console.log('[AUTO FOLLOWUP] Scheduler tick', new Date().toISOString());

  if (schedulerRunning) {
    console.log('[FOLLOWUP_AUTO] Scheduler already running — skipping');
    return 0;
  }

  const automationEnabled = await isGlobalAutomationEnabled();
  if (!automationEnabled) {
    console.log('[AUTO FOLLOWUP] Global automation OFF');
    return 0;
  }
  console.log('[AUTO FOLLOWUP] Global automation ON');

  schedulerRunning = true;

  try {
    await ensureSchema();
    console.log('[FOLLOWUP_AUTO] Scheduler tick at', new Date().toISOString());

    // Fetch leads due for follow-up
    const { rows: dueleads } = await pool.query(`
      SELECT
        l.*,
        c.name AS campaign_name,
        c.subject AS campaign_subject,
        c.followup_enabled AS campaign_followup_enabled,
        c.status AS campaign_status
      FROM leads l
      LEFT JOIN campaigns c ON l.campaign_id = c.id
      WHERE l.has_replied    = 0
        AND l.is_bounced     = 0
        AND (l.unsubscribed  = 0 OR l.unsubscribed IS NULL)
        AND (l.followup_enabled = 1 OR l.followup_enabled IS NULL)
        AND l.follow_up_step < ?
        AND l.next_follow_up_at IS NOT NULL
        AND l.next_follow_up_at <= NOW()
        AND (c.followup_enabled = 1 OR c.followup_enabled IS NULL)
        AND (c.status IS NULL OR LOWER(c.status) NOT IN ('paused', 'archived', 'stopped', 'cancelled', 'canceled'))
      ORDER BY l.next_follow_up_at ASC
      LIMIT 30
    `, [MAX_STAGE]);

    console.log(`[AUTO FOLLOWUP] Due leads found: ${dueleads.length}`);
    console.log(`[FOLLOWUP_AUTO] ${dueleads.length} lead(s) due for follow-up`);
    if (dueleads.length === 0) return 0;

    let sent = 0;
    let skipped = 0;

    for (const lead of dueleads) {
      try {
        logFollowUpCheck(lead, automationEnabled, true);
        // Double-check both suppression_list and unsubscribed_contacts
        const suppressed = await isUnsubscribed(lead.email);
        if (suppressed) {
          await stopFollowUp(lead.email, 'suppressed');
          skipped++;
          continue;
        }

        // Validate send conditions
        const check = shouldSendFollowUp(lead);
        if (!check.ok) {
          console.log(`[FOLLOWUP_AUTO] Skip ${lead.email} — ${check.reason}`);
          if (['replied', 'bounced', 'unsubscribed'].includes(check.reason)) {
            await stopFollowUp(lead.email, check.reason);
          }
          skipped++;
          continue;
        }

        const latestAutomationEnabled = await isGlobalAutomationEnabled();
        const { rows: latestCampaignRows } = await pool.query(
          `SELECT id, name AS campaign_name, status AS campaign_status, followup_enabled AS campaign_followup_enabled
           FROM campaigns WHERE id = ? LIMIT 1`,
          [lead.campaign_id]
        );
        const latestLeadState = { ...lead, ...(latestCampaignRows[0] || {}) };
        logFollowUpCheck(latestLeadState, latestAutomationEnabled, false);
        if (!latestAutomationEnabled || isCampaignPaused(latestLeadState)) {
          console.log(`[FOLLOWUP_SKIP] campaign_id=${lead.campaign_id || ''} reason=paused`);
          skipped++;
          continue;
        }

        // Sender warmup check
        const senderEmail = lead.sender_email || process.env.DEFAULT_SENDER_EMAIL;
        if (senderEmail) {
          const warmupOk = await canSendEmail(senderEmail);
          if (!warmupOk) {
            const domain = domainFromEmail(senderEmail);
            console.warn(`[FOLLOWUP_AUTO] Domain ${domain} warmup limit — pausing batch`);
            break;
          }
        }

        // Idempotency: check if this stage was already sent
        const { rows: alreadySent } = await pool.query(`
          SELECT id FROM followup_logs
          WHERE lead_email = ? AND followup_stage = ? AND status = 'sent'
          LIMIT 1
        `, [lead.email, (lead.follow_up_step ?? 0) + 1]);

        if (alreadySent.length > 0) {
          console.log(`[FOLLOWUP_AUTO] Stage ${(lead.follow_up_step ?? 0) + 1} already sent to ${lead.email} — skipping duplicate`);
          // Advance the schedule pointer
          const nextEntry = getNextStageEntry(lead.follow_up_step ?? 0);
          if (nextEntry) {
            const nextAt = calcNextFollowUpAt(lead.last_sent_at || new Date(), nextEntry.day);
            await pool.query(`UPDATE leads SET follow_up_step = ?, next_follow_up_at = ? WHERE email = ?`,
              [(lead.follow_up_step ?? 0) + 1, nextAt, lead.email]);
          } else {
            await stopFollowUp(lead.email, 'sequence_complete');
          }
          skipped++;
          continue;
        }

        const nextStage = (lead.follow_up_step ?? 0) + 1;
        console.log(`[AUTO FOLLOWUP] Processing lead ${lead.email} stage=${lead.follow_up_step}`);
        await sendFollowUp(lead);
        console.log(`[AUTO FOLLOWUP] SENT ${lead.email} nextStage=${nextStage}`);

        if (senderEmail) {
          await incrementSenderCount(senderEmail).catch(() => {});
        }

        sent++;

        // Natural delay between sends: 20–45 seconds
        const delayMs = 20000 + Math.floor(Math.random() * 25000);
        await new Promise(r => setTimeout(r, delayMs));

      } catch (err) {
        console.error(`[AUTO FOLLOWUP] FAILED ${lead.email}`, err.message);
        console.error(`[FOLLOWUP_AUTO] Failed for ${lead.email}:`, err.message);

        // Log the failure
        await pool.query(`
          INSERT INTO followup_logs (lead_email, campaign_id, followup_stage, status, stopped_reason, sent_at)
          VALUES (?, ?, ?, 'failed', ?, NOW())
        `, [lead.email, lead.campaign_id, (lead.follow_up_step ?? 0) + 1, err.message])
        .catch(() => {});
      }
    }

    console.log(`[FOLLOWUP_AUTO] Done — sent: ${sent}, skipped: ${skipped}`);
    return sent;

  } finally {
    schedulerRunning = false;
  }
}

// ─── Reply detection integration ─────────────────────────────────────────────

async function handleReplyDetected(leadEmail, subject = '', body = '') {
  // Ignore auto-responders
  if (isAutoReply(subject, body)) {
    console.log(`[FOLLOWUP_AUTO] Auto-reply ignored for ${leadEmail}`);
    return false;
  }

  await pool.query(`
    UPDATE leads
    SET has_replied          = 1,
        replied              = 1,
        replied_at           = NOW(),
        followup_enabled     = 0,
        followup_stopped_reason = 'replied',
        next_follow_up_at    = NULL,
        status               = 'Replied',
        last_activity_at     = NOW()
    WHERE email = ?
  `, [leadEmail]);

  await pool.query(`
    INSERT INTO followup_logs (lead_email, campaign_id, followup_stage, status, stopped_reason, sent_at)
    SELECT email, campaign_id, COALESCE(follow_up_step, 0), 'stopped', 'replied', NOW()
    FROM leads WHERE email = ?
  `, [leadEmail]).catch(() => {});

  console.log(`[FOLLOWUP_AUTO] Reply detected — stopped follow-up for ${leadEmail}`);
  return true;
}

// ─── Unsubscribe handling ─────────────────────────────────────────────────────

async function handleUnsubscribe(email, campaignId = null, ipAddress = null, userAgent = null) {
  // Add to suppression list
  await pool.query(`
    INSERT INTO suppression_list (email, reason, campaign_id, ip_address, user_agent, added_at)
    VALUES (?, 'unsubscribe', ?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE reason = 'unsubscribe', added_at = NOW()
  `, [email, campaignId, ipAddress, userAgent]);

  // Stop all follow-ups and mark lead as unsubscribed
  await pool.query(`
    UPDATE leads
    SET unsubscribed         = 1,
        unsubscribed_at      = NOW(),
        followup_enabled     = 0,
        followup_stopped_reason = 'unsubscribed',
        next_follow_up_at    = NULL,
        status               = 'Unsubscribed',
        last_activity_at     = NOW()
    WHERE email = ?
  `, [email]);

  // Write to unsubscribed_contacts — this is what Unsubscribe Management reads
  await addUnsubscribe({ email, campaignId, ipAddress, userAgent, source: 'email_link' })
    .catch(err => console.error(`[FOLLOWUP_AUTO] addUnsubscribe failed for ${email}:`, err.message));

  console.log(`[FOLLOWUP_AUTO] Unsubscribed: ${email} — suppression list, leads, and unsubscribed_contacts updated`);
}

// ─── Bounce handling ──────────────────────────────────────────────────────────

async function handleBounce(email) {
  await pool.query(`
    UPDATE leads
    SET is_bounced           = 1,
        followup_enabled     = 0,
        followup_stopped_reason = 'bounced',
        next_follow_up_at    = NULL,
        status               = 'Bounced',
        last_activity_at     = NOW()
    WHERE email = ?
  `, [email]);

  console.log(`[FOLLOWUP_AUTO] Bounce recorded — stopped follow-up for ${email}`);
}

// ─── Pause / Resume controls ──────────────────────────────────────────────────

async function pauseFollowUp(email) {
  await pool.query(`
    UPDATE leads SET followup_enabled = 0, followup_stopped_reason = 'paused' WHERE email = ?
  `, [email]);
}

async function resumeFollowUp(email) {
  // Only resume if not replied/bounced/unsubscribed
  const { rows } = await pool.query(
    `SELECT has_replied, is_bounced, unsubscribed, follow_up_step FROM leads WHERE email = ? LIMIT 1`,
    [email]
  );
  const lead = rows[0];
  if (!lead) return;
  if (lead.has_replied || lead.is_bounced || lead.unsubscribed) return;

  // Recalculate next send time from now
  const nextStage = (lead.follow_up_step ?? 0) + 1;
  const entry = getScheduleEntry(nextStage);
  if (!entry) return;

  const nextAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  await pool.query(`
    UPDATE leads SET followup_enabled = 1, followup_stopped_reason = NULL, next_follow_up_at = ? WHERE email = ?
  `, [nextAt, email]);
}

// ─── Analytics helpers ────────────────────────────────────────────────────────

async function getFollowUpAnalytics(campaignId = null) {
  const params = [];
  let where = '';
  if (campaignId) {
    where = 'WHERE l.campaign_id = ?';
    params.push(campaignId);
  }

  const { rows: stageSummary } = await pool.query(`
    SELECT
      fl.followup_stage,
      fl.template_used,
      COUNT(*) AS total_sent,
      SUM(
        CASE WHEN l.has_replied = 1
          AND l.last_activity_at IS NOT NULL
          AND fl.sent_at IS NOT NULL
          AND l.last_activity_at >= fl.sent_at
        THEN 1 ELSE 0 END
      ) AS replies_after,
      ROUND(
        SUM(
          CASE WHEN l.has_replied = 1
            AND l.last_activity_at IS NOT NULL
            AND fl.sent_at IS NOT NULL
            AND l.last_activity_at >= fl.sent_at
          THEN 1 ELSE 0 END
        ) * 100.0 / NULLIF(COUNT(*), 0), 2
      ) AS reply_rate
    FROM followup_logs fl
    LEFT JOIN leads l ON fl.lead_email = l.email
    ${campaignId ? 'WHERE fl.campaign_id = ?' : ''}
    GROUP BY fl.followup_stage, fl.template_used
    ORDER BY fl.followup_stage
  `, campaignId ? [campaignId] : []);

  const { rows: [totals] } = await pool.query(`
    SELECT
      COUNT(DISTINCT l.email) AS total_leads,
      SUM(CASE WHEN l.follow_up_step > 0 THEN 1 ELSE 0 END) AS in_sequence,
      SUM(CASE WHEN l.has_replied = 1 THEN 1 ELSE 0 END) AS replied,
      SUM(CASE WHEN l.unsubscribed = 1 THEN 1 ELSE 0 END) AS unsubscribed,
      SUM(CASE WHEN l.is_bounced = 1 THEN 1 ELSE 0 END) AS bounced,
      SUM(CASE WHEN l.followup_enabled = 1 AND l.next_follow_up_at IS NOT NULL THEN 1 ELSE 0 END) AS pending,
      COALESCE(SUM(l.follow_up_count), 0) AS total_followup_emails
    FROM leads l
    ${where}
  `, params);

  return { stageSummary, totals: totals || {} };
}

async function getLeadFollowUpTimeline(email) {
  const { rows } = await pool.query(`
    SELECT
      fl.followup_stage,
      fl.template_used,
      fl.status,
      fl.sent_at,
      fl.stopped_reason,
      fl.message_id
    FROM followup_logs fl
    WHERE fl.lead_email = ?
    ORDER BY fl.sent_at ASC
  `, [email]);
  return rows;
}

// ─── Schedule info helpers ────────────────────────────────────────────────────

function getSchedulePreview() {
  return FOLLOWUP_SCHEDULE.map(s => ({
    stage:        s.stage,
    day:          s.day,
    templateName: TEMPLATE_NAMES[s.templateSlot],
    templateSlot: s.templateSlot,
  }));
}

function getNextFollowUpInfo(lead) {
  const nextStage = (lead.follow_up_step ?? 0) + 1;
  const entry = getScheduleEntry(nextStage);
  if (!entry) return null;
  return {
    stage:        nextStage,
    day:          entry.day,
    templateName: TEMPLATE_NAMES[entry.templateSlot],
    scheduledAt:  lead.next_follow_up_at,
  };
}

// ─── Init ─────────────────────────────────────────────────────────────────────

ensureSchema().catch(err => console.error('[FOLLOWUP_AUTO] Schema init error:', err.message));

module.exports = {
  runAutomatedFollowUpScheduler,
  scheduleInitialFollowUp,
  sendFollowUp,
  handleReplyDetected,
  handleUnsubscribe,
  handleBounce,
  pauseFollowUp,
  resumeFollowUp,
  stopFollowUp,
  getFollowUpAnalytics,
  getLeadFollowUpTimeline,
  getSchedulePreview,
  getNextFollowUpInfo,
  isInSuppressionList,
  FOLLOWUP_SCHEDULE,
  MAX_STAGE,
};
