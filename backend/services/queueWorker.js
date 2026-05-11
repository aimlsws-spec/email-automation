const pool = require('../db');
const { sendEmail, injectVariables, resolveSubjectForLead } = require('./emailService');
const { canSendEmail, incrementDomainCount, domainFromEmail } = require('./domainWarmup.service');
const { generatePlainText } = require('../utils/plainText');
const { scheduleNextFollowUp, scheduleInitialFollowUp } = require('./followUp.service');
const { trackEvent } = require('./eventTracker.service');

pool.query(`ALTER TABLE email_queue ADD COLUMN type VARCHAR(100) DEFAULT 'initial'`).catch(() => {});
pool.query(`ALTER TABLE email_queue ADD COLUMN sending_mode VARCHAR(50) DEFAULT 'domain'`).catch(() => {});
pool.query(`ALTER TABLE campaigns ADD COLUMN sending_type VARCHAR(50) DEFAULT 'domain'`).catch(() => {});
pool.query(`ALTER TABLE campaigns ADD COLUMN gmail_accounts JSON`).catch(() => {});
pool.query(`ALTER TABLE campaigns ADD COLUMN domain_accounts JSON`).catch(() => {});

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

async function processJob(job) {
  try {
    if (!job.campaign_id) throw new Error('campaign_id missing in job');

    const { rows: cr } = await pool.query(
      `SELECT sending_type, gmail_accounts, domain_accounts, sender_email, template_html, subject FROM campaigns WHERE id = ?`,
      [job.campaign_id]
    );
    const campaignRow = cr[0] || null;
    if (!campaignRow) throw new Error(`Campaign not found: ${job.campaign_id}`);

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

    const warmupAllowed = await canSendEmail(domain);
    if (!warmupAllowed) {
      console.log(`[WORKER] job=${job.id} SKIP — warmup limit reached for ${domain}. Rescheduled +1h.`);
      await pool.query(`UPDATE email_queue SET status = 'pending', last_error = 'Domain warmup limit reached', scheduled_at = NOW() + INTERVAL 1 HOUR WHERE id = ?`, [job.id]);
      return { blocked: false };
    }

    // Duplicate warmup cap check removed — canSendEmail() above is the single authority
    // if (warmupRow && warmupRow.current_sent >= warmupRow.daily_limit) { ... }

    const { rows: [sentCountRow] } = await pool.query(
      `SELECT COUNT(*) AS cnt FROM email_logs WHERE sender_email = ? AND status IN ('sent','success')`, [senderEmail]
    );
    const disableTracking = parseInt(sentCountRow?.cnt ?? 0) < 20;

    const { rows: [lead] } = await pool.query(
      `SELECT follow_up_step, message_id, thread_id, name, company, sender_email FROM leads WHERE email = ?`,
      [job.lead_email]
    );

    const isFollowUpJob = job.type === 'manual_followup' || (job.type || '').startsWith('follow_up');

    if (isFollowUpJob && sendingType === 'gmail' && !campaignRow.sender_email && lead?.sender_email) {
      senderEmail = lead.sender_email;
    }

    let rawHtml = isFollowUpJob ? job.html_body : campaignRow.template_html;
    if (!rawHtml) throw new Error(`Campaign ${job.campaign_id} has no template_html`);

    let emailHtml    = injectVariables(rawHtml, lead || { name: '', email: job.lead_email });
    let emailText    = generatePlainText(emailHtml || '');
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

    if (emailHtml?.includes('{{')) {
      emailHtml = emailHtml.replace(/\{\{[^}]*\}\}/g, '');
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

    console.log(`[WORKER] job=${job.id} → sendEmail() reached. to=${job.lead_email} via=${senderEmail} subject="${emailSubject}"`);
    const result = await sendEmail({
      to: job.lead_email, subject: emailSubject, html: emailHtml, text: emailText,
      senderEmail, campaignId: job.campaign_id, disableTracking,
      lead: lead || null,
      inReplyTo:  isFollowUpJob ? (lead?.message_id || undefined) : undefined,
      references: isFollowUpJob ? (lead?.message_id || undefined) : undefined,
      type: job.type || 'initial',
    });

    await incrementDomainCount(domain);

    const currentStep = lead?.follow_up_step ?? 0;
    await scheduleNextFollowUp(job.lead_email, isFollowUpJob ? currentStep : 0, result.messageId, result.threadId);

    if (!isFollowUpJob) {
      await pool.query(
        `UPDATE leads SET status = 'Sent', last_sent_date = NOW(), message_id = ?, thread_id = ?, sender_email = ?, last_activity_at = NOW(), last_subject = ? WHERE email = ?`,
        [result.messageId, result.threadId, senderEmail, emailSubject, job.lead_email]
      );
      // Schedule the automated 30-day follow-up sequence
      await scheduleInitialFollowUp(job.lead_email, result.messageId, result.threadId, new Date()).catch(err =>
        console.error('[WORKER] scheduleInitialFollowUp failed:', err.message)
      );
    } else {
      await pool.query(
        `UPDATE leads SET status = ?, follow_up_count = follow_up_count + 1, last_sent_date = NOW(), last_activity_at = NOW(), sender_email = ? WHERE email = ?`,
        [`Follow-up ${currentStep + 1}`, senderEmail, job.lead_email]
      );
    }

    await pool.query(`UPDATE email_queue SET status = 'sent', last_error = NULL, updated_at = NOW() WHERE id = ?`, [job.id]);
    console.log(`[WORKER] job=${job.id} → status=sent ✓`);

    if (job.campaign_id) {
      await pool.query(
        `UPDATE campaigns SET sent_count = sent_count + 1, pending_count = GREATEST(0, pending_count - 1), active_sender = ? WHERE id = ?`,
        [senderEmail, job.campaign_id]
      );
    }

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

function scheduleImmediate() {
  if (immediateTimer) return;
  immediateTimer = setTimeout(() => { immediateTimer = null; processQueue(); }, 200);
}

async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    await pool.query(`
      UPDATE email_queue SET status = 'pending'
      WHERE status = 'processing' AND updated_at < NOW() - INTERVAL 5 MINUTE
    `).catch(() => {});

    const { rows: jobs } = await pool.query(`
      SELECT * FROM email_queue
      WHERE status IN ('pending', 'failed') AND attempts < 3
        AND (scheduled_at IS NULL OR scheduled_at <= NOW())
      ORDER BY created_at ASC LIMIT ${BATCH_SIZE}
    `);

    if (jobs.length === 0) {
      const { rows: future } = await pool.query(
        `SELECT COUNT(*) AS cnt, MIN(scheduled_at) AS next_at FROM email_queue WHERE status = 'pending' AND scheduled_at > NOW()`
      );
      const futureCount = parseInt(future[0]?.cnt) || 0;
      if (futureCount > 0) {
        console.log(`[WORKER] 0 eligible jobs now. ${futureCount} job(s) blocked (warmup/scheduled). Next eligible: ${future[0]?.next_at}`);
      }
      isProcessing = false;
      return;
    }

    const ids = jobs.map(j => j.id);
    await pool.query(
      `UPDATE email_queue SET status = 'processing', updated_at = NOW() WHERE id IN (${ids.map(() => '?').join(',')})`,
      ids
    );

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
    scheduleImmediate();
  }
}

function startWorker() {
  console.log(`[WORKER] Email Queue Worker Started (batch=${BATCH_SIZE}, inter-email=${INTER_EMAIL_DELAY_MS}ms, batch-delay=${MIN_DELAY_MS}-${MAX_DELAY_MS}ms)`);
  pool.query(`UPDATE email_queue SET status = 'pending' WHERE status = 'processing'`)
    .then(() => console.log('[WORKER] Initial queue cleanup complete'))
    .catch(err => console.error('[WORKER] Cleanup failed:', err.message));
  // Heartbeat: only a safety net — the primary driver is scheduleImmediate() after each batch
  setInterval(processQueue, 60000);
}

// Force-reset isProcessing if stuck, then kick off a batch immediately.
// Callable via HTTP endpoint without restart.
function triggerQueue() {
  console.log(`[WORKER] triggerQueue called — isProcessing was ${isProcessing}`);
  isProcessing = false;
  scheduleImmediate();
}

module.exports = { startWorker, triggerQueue };
