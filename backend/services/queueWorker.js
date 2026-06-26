const pool = require('../db');
const { sendEmail, injectVariables, resolveSubjectForLead } = require('./emailService');
const { canSendEmail, incrementSenderCount, domainFromEmail } = require('./senderWarmup.service');
const { isUnsubscribed } = require('./unsubscribe.service');
const { generatePlainText } = require('../utils/plainText');
const { scheduleNextFollowUp, scheduleInitialFollowUp } = require('./followUp.service');
const { trackEvent } = require('./eventTracker.service');
const { recalculateCampaignStats } = require('./campaignStats.service');
const { scheduleLinkedFollowUps } = require('./campaignFollowUp.service');
const { getAutomationEnabled } = require('./systemSettings.service');

pool.query(`ALTER TABLE email_queue ADD COLUMN type VARCHAR(100) DEFAULT 'initial'`).catch(() => {});
pool.query(`ALTER TABLE email_queue ADD COLUMN sending_mode VARCHAR(50) DEFAULT 'domain'`).catch(() => {});
pool.query(`ALTER TABLE campaigns ADD COLUMN sending_type VARCHAR(50) DEFAULT 'domain'`).catch(() => {});
pool.query(`ALTER TABLE campaigns ADD COLUMN gmail_accounts JSON`).catch(() => {});
pool.query(`ALTER TABLE campaigns ADD COLUMN domain_accounts JSON`).catch(() => {});
pool.query(`ALTER TABLE campaigns ADD COLUMN from_name VARCHAR(255) DEFAULT NULL`).catch(() => {});
pool.query(`ALTER TABLE campaigns ADD COLUMN followup_enabled TINYINT(1) DEFAULT 1`).catch(() => {});
pool.query(`ALTER TABLE email_logs ADD COLUMN queue_job_id INT DEFAULT NULL`).catch(() => {});
pool.query(`ALTER TABLE email_logs ADD INDEX idx_email_logs_job_id (queue_job_id)`).catch(() => {});

const MIN_DELAY_MS = 12000;       // 12 s minimum between batches
const MAX_DELAY_MS = 18000;       // 18 s maximum between batches
const INTER_EMAIL_DELAY_MS = 5000; // 5 s between each email inside a batch
const BATCH_SIZE = 2;             // emails processed per cycle

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function batchDelayMs() {
  return randomBetween(MIN_DELAY_MS, MAX_DELAY_MS);
}

function normalizedStatus(value) {
  return String(value || '').trim().toLowerCase();
}

function isCampaignFollowUpPaused(campaignRow) {
  if (campaignRow?.followup_enabled === 0 || campaignRow?.followup_enabled === false) return true;
  return ['paused', 'archived', 'stopped', 'cancelled', 'canceled'].includes(normalizedStatus(campaignRow?.status));
}

function logFollowUpCheck(job, campaignRow, automationEnabled, isSelected) {
  const followupStatus = campaignRow?.followup_enabled === 0 || campaignRow?.followup_enabled === false
    ? 'paused'
    : normalizedStatus(campaignRow?.status) || 'active';

  console.log(
    `[FOLLOWUP_CHECK] campaign_id=${job.campaign_id} campaign_name=${JSON.stringify(campaignRow?.name || '')} ` +
    `automation_status=${automationEnabled ? 'active' : 'paused'} followup_status=${followupStatus} is_selected=${isSelected}`
  );
}

async function leaveQueuedFollowUpPending(job, reason) {
  console.log(`[FOLLOWUP_SKIP] campaign_id=${job.campaign_id} reason=${reason}`);
  await pool.query(
    `UPDATE email_queue
     SET status = 'pending',
         last_error = ?,
         scheduled_at = GREATEST(COALESCE(scheduled_at, NOW()), NOW() + INTERVAL 10 MINUTE),
         updated_at = NOW()
     WHERE id = ?`,
    [`followup_${reason}`, job.id]
  ).catch(() => {});
}

async function processJob(job) {
  try {
    if (!job.campaign_id) throw new Error('campaign_id missing in job');

    // Bail early if the recipient has unsubscribed — skip without counting as failure
    const unsubscribed = await isUnsubscribed(job.lead_email);
    if (unsubscribed) {
      console.log(`[WORKER] job=${job.id} SKIP — ${job.lead_email} is unsubscribed`);
      await pool.query(
        `UPDATE email_queue SET status = 'sent', last_error = 'unsubscribed_skip', updated_at = NOW() WHERE id = ?`,
        [job.id]
      );
      await pool.query(
        `UPDATE leads SET status = 'Unsubscribed' WHERE email = ? AND status != 'Unsubscribed'`,
        [job.lead_email]
      );
      return { blocked: false };
    }

    const { rows: cr } = await pool.query(
      `SELECT name, sending_type, gmail_accounts, domain_accounts, sender_email, template_html, template_type, subject, from_name, initial_template_id, status, followup_enabled FROM campaigns WHERE id = ?`,
      [job.campaign_id]
    );
    const campaignRow = cr[0] || null;
    if (!campaignRow) throw new Error(`Campaign not found: ${job.campaign_id}`);

    // Bail immediately if the campaign was cancelled/paused after this job was claimed
    if (campaignRow.status === 'Cancelled' || campaignRow.status === 'Paused') {
      console.log(`[WORKER] job=${job.id} SKIP — campaign ${job.campaign_id} is ${campaignRow.status}`);
      await pool.query(
        `UPDATE email_queue SET status = 'sent', last_error = 'campaign_cancelled', updated_at = NOW() WHERE id = ?`,
        [job.id]
      ).catch(() => {});
      return { blocked: false };
    }

    const sendingType = campaignRow.sending_type || job.sending_mode || 'gmail';
    let senderEmail;

    if (sendingType === 'gmail') {
      const gmailAccounts = Array.isArray(campaignRow.gmail_accounts) ? campaignRow.gmail_accounts : [];
      senderEmail = campaignRow.sender_email ||
        (gmailAccounts.length > 0 ? gmailAccounts[Math.floor(Math.random() * gmailAccounts.length)] : null);
      if (!senderEmail) throw new Error('No Gmail accounts configured for this campaign');
    } else {
      const domainAccounts = Array.isArray(campaignRow.domain_accounts) ? campaignRow.domain_accounts : [];
      senderEmail = campaignRow.sender_email ||
        (domainAccounts.length > 0 ? domainAccounts[job.id % domainAccounts.length] : null);
      if (!senderEmail) throw new Error('No domain accounts configured');
      if (senderEmail.toLowerCase().includes('@gmail.com')) throw new Error('Invalid sender: Gmail not allowed in domain mode');
    }

    const domain = domainFromEmail(senderEmail);

    const { rows: [senderLimitRow] } = await pool.query(
      `SELECT COALESCE(daily_sent_count, 0) AS sent_today, COALESCE(daily_limit, 300) AS daily_limit FROM sender_accounts WHERE email = ?`,
      [senderEmail]
    );
    if (senderLimitRow) {
      const sentToday  = parseInt(senderLimitRow.sent_today  ?? 0);
      const dailyLimit = parseInt(senderLimitRow.daily_limit ?? 300);
      if (sentToday >= dailyLimit) throw new Error(`BLOCK_ACCOUNT: Daily limit reached for ${senderEmail} (${sentToday}/${dailyLimit})`);
    }

    console.log(`[WORKER] job=${job.id} lead=${job.lead_email} campaign=${job.campaign_id} sender=${senderEmail} domain=${domain}`);

    const warmupAllowed = await canSendEmail(senderEmail);
    if (!warmupAllowed) {
      // Reschedule to 00:05 tomorrow so jobs sit out until AFTER the midnight
      // counter reset (00:01 cron).  Using +1 HOUR here caused an infinite
      // rotation: all 167 jobs would cycle through the warmup block every hour,
      // exhausting the daily limit before any email was sent.
      console.log(`[WORKER] job=${job.id} SKIP — warmup limit reached for ${senderEmail}. Rescheduled to tomorrow 00:05.`);
      await pool.query(
        `UPDATE email_queue SET status = 'pending', last_error = 'Sender warmup limit reached',
         scheduled_at = DATE(NOW() + INTERVAL 1 DAY) + INTERVAL 5 MINUTE WHERE id = ?`,
        [job.id]
      );
      return { blocked: false };
    }

    // Duplicate warmup cap check removed — canSendEmail() above is the single authority
    // if (warmupRow && warmupRow.current_sent >= warmupRow.daily_limit) { ... }

    const { rows: [sentCountRow] } = await pool.query(
      `SELECT COUNT(*) AS cnt FROM email_logs WHERE sender_email = ? AND status IN ('sent','success')`, [senderEmail]
    );
    const disableTracking = parseInt(sentCountRow?.cnt ?? 0) < 20;

    let { rows: leadRows } = await pool.query(
      `SELECT email, status, follow_up_step, message_id, thread_id, name, company, sender_email, campaign_id
       FROM leads WHERE email = ? AND campaign_id = ? LIMIT 1`,
      [job.lead_email, job.campaign_id]
    );
    if (leadRows.length === 0) {
      const fallback = await pool.query(
        `SELECT email, status, follow_up_step, message_id, thread_id, name, company, sender_email, campaign_id
         FROM leads WHERE email = ? LIMIT 1`,
        [job.lead_email]
      );
      leadRows = fallback.rows || [];
      if (leadRows[0]) {
        console.warn(`[WORKER] lead campaign mismatch: recipient=${job.lead_email} existing_campaign=${leadRows[0].campaign_id || 'none'} job_campaign=${job.campaign_id}`);
      }
    }
    const lead = leadRows[0] || null;

    const isFollowUpJob = job.type === 'manual_followup' || (job.type || '').startsWith('follow_up');

    if (isFollowUpJob) {
      const automationEnabled = await getAutomationEnabled();
      logFollowUpCheck(job, campaignRow, automationEnabled, true);

      if (!automationEnabled || isCampaignFollowUpPaused(campaignRow)) {
        await leaveQueuedFollowUpPending(job, 'paused');
        return { blocked: false };
      }
    }

    if (!isFollowUpJob && lead && lead.status !== 'Pending' && lead.status !== 'Queued') {
      console.log(`[WORKER] job=${job.id} SKIP duplicate initial email for ${job.lead_email}; lead status=${lead.status}`);
      await pool.query(
        `UPDATE email_queue SET status = 'sent', last_error = 'duplicate_initial_skipped', updated_at = NOW() WHERE id = ?`,
        [job.id]
      );
      return { blocked: false };
    }

    if (isFollowUpJob && sendingType === 'gmail' && !campaignRow.sender_email && lead?.sender_email) {
      senderEmail = lead.sender_email;
    }

    const rawContent = isFollowUpJob ? job.html_body : campaignRow.template_html;
    if (!rawContent) throw new Error(`Campaign ${job.campaign_id} has no template content`);

    // Follow-up templates are always HTML; only initial emails respect template_type
    const templateType = !isFollowUpJob ? (campaignRow.template_type || 'html') : 'html';

    let emailHtml, emailText;
    if (templateType === 'text') {
      emailHtml = null;
      emailText = injectVariables(rawContent, lead || { name: '', email: job.lead_email });
    } else {
      emailHtml = injectVariables(rawContent, lead || { name: '', email: job.lead_email });
      emailText = generatePlainText(emailHtml || '');
      if (emailHtml?.includes('{{')) {
        emailHtml = emailHtml.replace(/\{\{[^}]*\}\}/g, '');
      }
    }

    const rawSubject = campaignRow.subject || job.subject;
    if (!rawSubject) throw new Error(`No subject found for campaign ${job.campaign_id}`);

    console.log(`[SUBJECT_STAGE] stage="queueWorker.leadFetched" lead_email="${job.lead_email}" lead_name="${lead?.name || '(none)'}"`);
    console.log(`[SUBJECT_STAGE] stage="queueWorker.beforeResolve" subject="${rawSubject}"`);

    let emailSubject = resolveSubjectForLead(rawSubject, lead || { name: '', email: job.lead_email });

    // DEBUG: hardcoded check — if this fires but Gmail still shows old subject, another layer is overriding
    if (lead?.name === 'Prena') emailSubject = 'DEBUG PRENA SUBJECT';

    console.log(`[SUBJECT_STAGE] stage="queueWorker.afterResolve" subject="${emailSubject}"`);

    if (isFollowUpJob) {
      const baseSubject = resolveSubjectForLead(campaignRow.subject || job.subject || '', lead || { name: '', email: job.lead_email });
      emailSubject = baseSubject.startsWith('Re:') ? baseSubject : `Re: ${baseSubject}`;
      console.log(`[SUBJECT_STAGE] stage="queueWorker.followupSubject" subject="${emailSubject}"`);
    }

    if (isFollowUpJob) {
      const { rows: already } = await pool.query(
        `SELECT id FROM email_queue WHERE lead_email = ? AND type = ? AND status = 'sent' LIMIT 1`,
        [job.lead_email, job.type]
      );
      if (already.length > 0) {
        await pool.query(`UPDATE email_queue SET status = 'sent', last_error = 'duplicate_skipped', updated_at = NOW() WHERE id = ?`, [job.id]);
        return { blocked: false };
      }
    }

    // Idempotency guard: if this job was already sent and logged (e.g. worker
    // crashed after sendEmail() but before the status=sent UPDATE), skip it
    // rather than sending a duplicate email.
    const { rows: [existingLog] } = await pool.query(
      `SELECT id FROM email_logs WHERE queue_job_id = ? LIMIT 1`,
      [job.id]
    );
    if (existingLog) {
      console.log(`[WORKER] job=${job.id} campaign=${job.campaign_id} lead=${job.lead_email} SKIP — already in email_logs (idempotent)`);
      await pool.query(
        `UPDATE email_queue SET status = 'sent', last_error = 'idempotent_skip', updated_at = NOW() WHERE id = ?`,
        [job.id]
      );
      return { blocked: false };
    }

    console.log(`[WORKER] job=${job.id} campaign=${job.campaign_id} lead=${job.lead_email} ts=${new Date().toISOString()} → sendEmail() reached via=${senderEmail} subject="${emailSubject}"`);
    if (isFollowUpJob) {
      const automationEnabled = await getAutomationEnabled();
      const { rows: latestCampaignRows } = await pool.query(
        `SELECT id, name, status, followup_enabled FROM campaigns WHERE id = ? LIMIT 1`,
        [job.campaign_id]
      );
      const latestCampaign = latestCampaignRows[0] || campaignRow;
      logFollowUpCheck(job, latestCampaign, automationEnabled, false);

      if (!automationEnabled || isCampaignFollowUpPaused(latestCampaign)) {
        await leaveQueuedFollowUpPending(job, 'paused');
        return { blocked: false };
      }
    }

    const result = await sendEmail({
      to: job.lead_email, subject: emailSubject, html: emailHtml, text: emailText,
      senderEmail, campaignId: job.campaign_id, fromName: campaignRow.from_name, disableTracking,
      lead: lead || null,
      inReplyTo:  isFollowUpJob ? (lead?.message_id || undefined) : undefined,
      references: isFollowUpJob ? (lead?.message_id || undefined) : undefined,
      type: job.type || 'initial',
      queueJobId: job.id,
    });

    await incrementSenderCount(senderEmail);

    const currentStep = lead?.follow_up_step ?? 0;
    if (isFollowUpJob) {
      await scheduleNextFollowUp(job.lead_email, currentStep, result.messageId, result.threadId);
    }

    if (!isFollowUpJob) {
      await pool.query(
        `INSERT INTO leads (
           email, name, company, campaign_id, status, last_sent_date, message_id, thread_id,
           sender_email, last_activity_at, last_subject, created_at
         )
         VALUES (?, ?, ?, ?, 'Sent', NOW(), ?, ?, ?, NOW(), ?, NOW())
         ON DUPLICATE KEY UPDATE
           campaign_id      = VALUES(campaign_id),
           status           = 'Sent',
           last_sent_date   = NOW(),
           message_id       = VALUES(message_id),
           thread_id        = VALUES(thread_id),
           sender_email     = VALUES(sender_email),
           last_activity_at = NOW(),
           last_subject     = VALUES(last_subject)`,
        [job.lead_email, lead?.name || '', lead?.company || '', job.campaign_id, result.messageId, result.threadId, senderEmail, emailSubject]
      );
      console.log(`[LEAD_SYNC] campaign=${job.campaign_id} recipient=${job.lead_email} sender=${senderEmail} status=Sent action=${lead ? 'updated' : 'created'}`);
      const automationEnabled = await getAutomationEnabled();
      logFollowUpCheck(job, campaignRow, automationEnabled, false);
      if (automationEnabled && !isCampaignFollowUpPaused(campaignRow)) {
        // Schedule the automated 30-day follow-up sequence
        await scheduleInitialFollowUp(job.lead_email, result.messageId, result.threadId, new Date()).catch(err =>
          console.error('[WORKER] scheduleInitialFollowUp failed:', err.message)
        );
        // Schedule campaign-linked follow-ups (if this campaign template has any configured)
        if (campaignRow.initial_template_id) {
          await scheduleLinkedFollowUps(job.lead_email, job.campaign_id, campaignRow.initial_template_id, new Date()).catch(err =>
            console.error('[WORKER] scheduleLinkedFollowUps failed:', err.message)
          );
        }
      } else {
        console.log(`[FOLLOWUP_SKIP] campaign_id=${job.campaign_id} reason=paused`);
      }
    } else {
      await pool.query(
        `UPDATE leads
         SET campaign_id = ?, status = ?, follow_up_count = follow_up_count + 1,
             last_sent_date = NOW(), last_activity_at = NOW(), sender_email = ?
         WHERE email = ?`,
        [job.campaign_id, `Follow-up ${currentStep + 1}`, senderEmail, job.lead_email]
      );
      console.log(`[LEAD_SYNC] campaign=${job.campaign_id} recipient=${job.lead_email} sender=${senderEmail} status=Follow-up ${currentStep + 1} action=updated`);
    }

    await pool.query(`UPDATE email_queue SET status = 'sent', last_error = NULL, updated_at = NOW() WHERE id = ?`, [job.id]);
    console.log(`[WORKER] job=${job.id} campaign=${job.campaign_id} recipient=${job.lead_email} sender=${senderEmail} send_status=sent`);

    await recalculateCampaignStats(job.campaign_id, senderEmail);

    console.log(`[SUCCESS] Sent: ${job.lead_email} via ${senderEmail}`);

    await pool.query(
      `INSERT INTO email_events (tracking_id, recipient_email, recipient_name, email_type, status, opened, clicked, replied, sender_email)
       VALUES (?, ?, ?, ?, 'sent', 0, 0, 0, ?)
       ON DUPLICATE KEY UPDATE tracking_id = tracking_id`,
      [result.trackingId || result.messageId || `${job.lead_email}-${Date.now()}`,
       job.lead_email, (lead?.name) || '', job.type || 'initial', senderEmail]
    ).catch(() => {});

    await trackEvent({ lead_email: job.lead_email, campaign_id: job.campaign_id, domain, type: 'sent' }).catch(() => {});

    return { blocked: false };

  } catch (err) {
    console.error(`[WORKER] FAILED: ${job.lead_email}`, err.message);
    const isBlock = err.message.includes('BLOCK');
    await pool.query(
      `UPDATE email_queue SET status = ?, attempts = attempts + 1, last_error = ?, updated_at = NOW(), scheduled_at = NOW() + INTERVAL 5 MINUTE WHERE id = ?`,
      [isBlock ? 'pending' : 'failed', err.message, job.id]
    );
    return { blocked: isBlock };
  }
}

let isProcessing = false;
let immediateTimer = null;
// Track last-reported blocked state to suppress repeated identical log lines.
let _lastBlockedCount = -1;
let _lastNextAt = null;

function scheduleImmediate() {
  if (immediateTimer) return;
  immediateTimer = setTimeout(() => { immediateTimer = null; processQueue(); }, 200);
}

// Schedule the next processQueue() call at `msFromNow`, replacing any pending timer.
function scheduleIn(msFromNow) {
  if (immediateTimer) clearTimeout(immediateTimer);
  immediateTimer = setTimeout(() => { immediateTimer = null; processQueue(); }, msFromNow);
}

async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    await pool.query(`
      UPDATE email_queue SET status = 'pending'
      WHERE status = 'processing' AND updated_at < NOW() - INTERVAL 5 MINUTE
    `).catch(() => {});

    // Atomically claim the next batch using FOR UPDATE SKIP LOCKED so that
    // concurrent worker processes (e.g. multiple Node instances) never pick
    // the same job twice.
    let jobs = [];
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query(`
        SELECT * FROM email_queue
        WHERE status IN ('pending', 'failed') AND attempts < 3
          AND (scheduled_at IS NULL OR scheduled_at <= NOW())
        ORDER BY created_at ASC LIMIT ${BATCH_SIZE}
        FOR UPDATE SKIP LOCKED
      `);
      jobs = rows;
      if (jobs.length > 0) {
        const ids = jobs.map(j => j.id);
        await client.query(
          `UPDATE email_queue SET status = 'processing', updated_at = NOW() WHERE id IN (${ids.map(() => '?').join(',')})`,
          ids
        );
      }
      await client.query('COMMIT');
    } catch (txErr) {
      await client.query('ROLLBACK').catch(() => {});
      throw txErr;
    } finally {
      client.release();
    }

    if (jobs.length === 0) {
      const { rows: future } = await pool.query(
        `SELECT COUNT(*) AS cnt, MIN(scheduled_at) AS next_at FROM email_queue WHERE status IN ('pending','failed') AND scheduled_at > NOW()`
      );
      const futureCount = parseInt(future[0]?.cnt) || 0;
      const nextAt = future[0]?.next_at || null;

      // Only log when the blocked state actually changes, not on every poll.
      if (futureCount !== _lastBlockedCount || String(nextAt) !== String(_lastNextAt)) {
        if (futureCount > 0) {
          console.log(`[WORKER] 0 eligible jobs now. ${futureCount} job(s) scheduled for future. Next eligible: ${nextAt}`);
        } else {
          console.log(`[WORKER] Queue is empty. Waiting for new jobs.`);
        }
        _lastBlockedCount = futureCount;
        _lastNextAt = nextAt;
      }

      // Wake up precisely when the next job becomes eligible, not on a fixed 60s heartbeat.
      if (nextAt) {
        const msUntilNext = Math.max(5000, new Date(nextAt).getTime() - Date.now() + 1500);
        scheduleIn(Math.min(msUntilNext, 60_000));
      }
      // If queue is truly empty, the 60s heartbeat (setInterval) is enough — don't busy-wait.
      isProcessing = false;
      return;
    }

    // Reset suppression counters when processing resumes.
    _lastBlockedCount = -1;
    _lastNextAt = null;

    console.log(`[WORKER] Processing batch of ${jobs.length} job(s) sequentially`);

    // Process jobs one at a time with a delay between each to avoid send bursts
    let anyBlocked = false;
    for (let i = 0; i < jobs.length; i++) {
      const r = await processJob(jobs[i]);
      if (r.blocked) {
        anyBlocked = true;
        console.log('[WORKER] Sender blocked — stopping batch.');
        break;
      }
      if (i < jobs.length - 1) {
        await new Promise(resolve => setTimeout(resolve, INTER_EMAIL_DELAY_MS));
      }
    }

    if (anyBlocked) {
      isProcessing = false;
      scheduleIn(30_000); // wait 30s before retrying after a sender block
      return;
    }

    // Single delay between batches instead of per-email
    const delay = batchDelayMs();
    console.log(`[WORKER] Batch done. Next batch in ${delay}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));

  } catch (err) {
    console.error('[WORKER] CRITICAL ERROR:', err.message);
  } finally {
    isProcessing = false;
    // scheduleImmediate() is intentionally NOT called here unconditionally.
    // Each exit path above (early returns and normal completion) schedules
    // the next run at the appropriate time. The setInterval heartbeat in
    // startWorker() is the safety net for paths that don't re-schedule.
    if (!immediateTimer) scheduleImmediate();
  }
}

function startWorker() {
  console.log(`[WORKER] Email Queue Worker Started (batch=${BATCH_SIZE}, inter-email=${INTER_EMAIL_DELAY_MS}ms, batch-delay=${MIN_DELAY_MS}-${MAX_DELAY_MS}ms)`);
  pool.query(`UPDATE email_queue SET status = 'pending' WHERE status = 'processing'`)
    .then(() => {
      console.log('[WORKER] Initial queue cleanup complete');
      scheduleImmediate(); // kick off first batch immediately after cleanup
    })
    .catch(err => {
      console.error('[WORKER] Cleanup failed:', err.message);
      scheduleImmediate(); // still start the loop even if cleanup fails
    });
  // 60s heartbeat is a safety net in case the self-scheduling chain breaks.
  setInterval(processQueue, 60000);
}

// Kick off a batch immediately when the worker is idle.
// Callable via HTTP endpoint without restart.
function triggerQueue() {
  console.log(`[WORKER] triggerQueue called - isProcessing=${isProcessing}`);
  if (isProcessing) return;
  scheduleImmediate();
}

module.exports = { startWorker, triggerQueue };
