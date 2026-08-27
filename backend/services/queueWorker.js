const pool = require('../db');
const { sendEmail, injectVariables, resolveSubjectForLead } = require('./emailService');
const { canSendEmail, incrementSenderCount, domainFromEmail } = require('./senderWarmup.service');
const { isUnsubscribed } = require('./unsubscribe.service');
const { isHardBounce, recordSuppression, classifyFailure } = require('./suppression.service');
const { generatePlainText } = require('../utils/plainText');
const { scheduleNextFollowUp, scheduleInitialFollowUp } = require('./followUp.service');
const { trackEvent } = require('./eventTracker.service');
const { recalculateCampaignStats } = require('./campaignStats.service');
const { scheduleLinkedFollowUps, getCampaignFollowUpTemplates, syncFollowUpQueueAfterSend } = require('./campaignFollowUp.service');
const { getAutomationEnabled } = require('./systemSettings.service');
const { normalizedStatus, isCampaignFollowUpPaused, logFollowUpCheck } = require('../utils/followUpHelpers');

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
    console.log(`[QUEUE_EXECUTION] Executing: id=${job.id} lead=${job.lead_email} campaign=${job.campaign_id} type=${job.type}`);
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
        `UPDATE leads SET status = 'Unsubscribed' WHERE email = ? AND campaign_id = ? AND status != 'Unsubscribed'`,
        [job.lead_email, job.campaign_id]
      );
      if (job.campaign_id) {
        await recalculateCampaignStats(job.campaign_id).catch(e => console.error('[WORKER] stats recalculation after unsubscribe skip failed:', e.message));
      }
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
      `SELECT email, status, follow_up_step, follow_up_count, message_id, thread_id, name, company,
              sender_email, campaign_id, has_replied, is_bounced, unsubscribed, followup_enabled
       FROM leads WHERE email = ? AND campaign_id = ? LIMIT 1`,
      [job.lead_email, job.campaign_id]
    );
    if (leadRows.length === 0) {
      const fallback = await pool.query(
        `SELECT email, status, follow_up_step, follow_up_count, message_id, thread_id, name, company,
                sender_email, campaign_id, has_replied, is_bounced, unsubscribed, followup_enabled
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

      if (lead?.has_replied || lead?.is_bounced || lead?.unsubscribed || lead?.followup_enabled === 0) {
        const reason = lead?.has_replied ? 'reply_received' : lead?.is_bounced ? 'bounced' : lead?.unsubscribed ? 'unsubscribed' : 'disabled';
        await pool.query(
          `UPDATE followup_queue SET status = 'stopped', stopped_reason = ? WHERE lead_email = ? AND campaign_id = ? AND status = 'pending'`,
          [reason, job.lead_email, job.campaign_id]
        ).catch(() => {});
        await pool.query(
          `UPDATE email_queue SET status = 'sent', last_error = ?, updated_at = NOW() WHERE id = ?`,
          [`followup_${reason}_skip`, job.id]
        ).catch(() => {});
        return { blocked: false };
      }

      if (job.type === 'manual_followup' && job.followup_stage && Number(lead?.follow_up_step || 0) >= Number(job.followup_stage)) {
        console.log(`[WORKER] job=${job.id} SKIP duplicate manual follow-up stage=${job.followup_stage} for ${job.lead_email}`);
        await pool.query(
          `UPDATE email_queue SET status = 'sent', last_error = 'duplicate_stage_skipped', updated_at = NOW() WHERE id = ?`,
          [job.id]
        );
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

    const rawSubject = isFollowUpJob ? (job.subject || campaignRow.subject) : (campaignRow.subject || job.subject);
    if (!rawSubject) throw new Error(`No subject found for campaign ${job.campaign_id}`);

    console.log(`[SUBJECT_STAGE] stage="queueWorker.leadFetched" lead_email="${job.lead_email}" lead_name="${lead?.name || '(none)'}"`);
    console.log(`[SUBJECT_STAGE] stage="queueWorker.beforeResolve" subject="${rawSubject}"`);

    let emailSubject = resolveSubjectForLead(rawSubject, lead || { name: '', email: job.lead_email });

    // DEBUG: hardcoded check — if this fires but Gmail still shows old subject, another layer is overriding
    if (lead?.name === 'Prena') emailSubject = 'DEBUG PRENA SUBJECT';

    console.log(`[SUBJECT_STAGE] stage="queueWorker.afterResolve" subject="${emailSubject}"`);

    if (isFollowUpJob) {
      const baseSubject = resolveSubjectForLead(job.subject || campaignRow.subject || '', lead || { name: '', email: job.lead_email });
      emailSubject = baseSubject.startsWith('Re:') ? baseSubject : `Re: ${baseSubject}`;
      console.log(`[SUBJECT_STAGE] stage="queueWorker.followupSubject" subject="${emailSubject}"`);
    }

    if (isFollowUpJob) {
      if (job.followup_stage) {
        const { rows: already } = await pool.query(
          `SELECT id FROM email_queue
           WHERE lead_email = ? AND campaign_id = ? AND type = ? AND followup_stage = ?
             AND status = 'sent' AND id <> ?
           LIMIT 1`,
          [job.lead_email, job.campaign_id, job.type, job.followup_stage, job.id]
        );
        if (already.length > 0) {
          await pool.query(`UPDATE email_queue SET status = 'sent', last_error = 'duplicate_stage_skipped', updated_at = NOW() WHERE id = ?`, [job.id]);
          return { blocked: false };
        }
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
      userId: job.user_id,
    });

    // ── Global suppression — intentional skip, not a failure ──────────────
    if (result && result.suppressed) {
      console.log(
        `[SUPPRESSION]\n` +
        `  Recipient:    ${job.lead_email}\n` +
        `  Campaign:     ${job.campaign_id}\n` +
        `  Reason:       Already exists in Global Suppression List\n` +
        `  Action:       Skipped\n` +
        `  Lead Status:  Suppressed`
      );
      await pool.query(
        `UPDATE email_queue SET status = 'sent', last_error = 'global_suppression_skip', updated_at = NOW() WHERE id = ?`,
        [job.id]
      ).catch(() => {});
      await pool.query(
        `UPDATE leads SET status = 'Suppressed', next_follow_up_at = NULL, last_activity_at = NOW() WHERE email = ? AND campaign_id = ?`,
        [job.lead_email, job.campaign_id]
      ).catch(() => {});
      if (job.campaign_id) {
        await recalculateCampaignStats(job.campaign_id).catch(e => console.error('[WORKER] stats recalculation after suppression skip failed:', e.message));
      }
      return { blocked: false };
    }

    if (job.type === 'manual_followup') {
      const manualStage = Number(job.followup_stage || (lead?.follow_up_step ?? 0) + 1);
      const manualCampaignTemplateId = job.campaign_template_id || campaignRow.initial_template_id;
      const syncResult = await syncFollowUpQueueAfterSend({
        leadEmail: job.lead_email,
        campaignId: job.campaign_id,
        campaignTemplateId: manualCampaignTemplateId,
        followupTemplateId: job.followup_template_id || null,
        followupStage: manualStage,
        queueJobId: job.id,
        messageId: result.messageId,
        threadId: result.threadId,
        subject: emailSubject,
        senderEmail,
      });

      console.log(
        `[FOLLOWUP_SYNC] manual lead=${job.lead_email} campaign=${job.campaign_id} ` +
        `completedStage=${syncResult.completedStage} nextStage=${syncResult.nextStage || 'none'}`
      );

      await incrementSenderCount(senderEmail).catch(e =>
        console.error('[WORKER] incrementSenderCount failed:', e.message)
      );
      await recalculateCampaignStats(job.campaign_id, senderEmail).catch(e =>
        console.error('[WORKER] recalculateCampaignStats failed:', e.message)
      );
      await pool.query(
        `INSERT INTO email_events (tracking_id, recipient_email, recipient_name, email_type, status, opened, clicked, replied, sender_email, user_id)
         VALUES (?, ?, ?, ?, 'sent', 0, 0, 0, ?, ?)
         ON DUPLICATE KEY UPDATE tracking_id = tracking_id`,
        [result.trackingId || result.messageId || `${job.lead_email}-${Date.now()}`,
         job.lead_email, (lead?.name) || '', job.type || 'manual_followup', senderEmail, job.user_id]
      ).catch(() => {});
      await trackEvent({ lead_email: job.lead_email, campaign_id: job.campaign_id, domain, type: 'sent', user_id: job.user_id }).catch(() => {});

      return { blocked: false };
    }

    // ── Post-send bookkeeping ───────────────────────────────────────────────
    // Each operation has its own error handler so one failure never skips others.
    // CRITICAL: the email_queue status must always be updated to 'sent' so
    // the job is not retried — outer catch would incorrectly mark as Bounced.

    await pool.query(
      `UPDATE email_queue SET status = 'sent', last_error = NULL, updated_at = NOW() WHERE id = ?`,
      [job.id]
    ).catch(e => console.error('[WORKER] email_queue status update failed:', e.message));
    console.log(`[WORKER] job=${job.id} campaign=${job.campaign_id} recipient=${job.lead_email} sender=${senderEmail} send_status=sent`);
    console.log(`[QUEUE_EXECUTION] Completed: id=${job.id} lead=${job.lead_email} campaign=${job.campaign_id}`);
    await incrementSenderCount(senderEmail).catch(e =>
      console.error('[WORKER] incrementSenderCount failed:', e.message)
    );

    const currentStep = lead?.follow_up_step ?? 0;
    if (isFollowUpJob) {
      await scheduleNextFollowUp(job.lead_email, currentStep, result.messageId, result.threadId, job.campaign_id).catch(e =>
        console.error('[WORKER] scheduleNextFollowUp failed:', e.message)
      );
    }

    if (!isFollowUpJob) {
      await pool.query(
        `INSERT INTO leads (
           email, name, company, campaign_id, status, last_sent_date, message_id, thread_id,
           sender_email, last_activity_at, last_subject, created_at, user_id
         )
         VALUES (?, ?, ?, ?, 'Sent', NOW(), ?, ?, ?, NOW(), ?, NOW(), ?)
         ON DUPLICATE KEY UPDATE
           campaign_id      = VALUES(campaign_id),
           status           = 'Sent',
           last_sent_date   = NOW(),
           message_id       = VALUES(message_id),
           thread_id        = VALUES(thread_id),
           sender_email     = VALUES(sender_email),
           last_activity_at = NOW(),
           last_subject     = VALUES(last_subject)`,
        [job.lead_email, lead?.name || '', lead?.company || '', job.campaign_id, result.messageId, result.threadId, senderEmail, emailSubject, job.user_id]
      ).catch(e => console.error('[WORKER] leads insert failed:', e.message));
      console.log(`[LEAD_SYNC] campaign=${job.campaign_id} recipient=${job.lead_email} sender=${senderEmail} status=Sent action=${lead ? 'updated' : 'created'}`);
      const automationEnabled = await getAutomationEnabled().catch(() => true);
      logFollowUpCheck(job, campaignRow, automationEnabled, false);
      console.log(`[FOLLOWUP_CREATE] Triggering follow-up schedule for lead=${job.lead_email} campaign=${job.campaign_id} initial_template_id=${campaignRow.initial_template_id}`);

      let shouldScheduleLegacyFollowUp = false;
      if (campaignRow.initial_template_id) {
        const linkedTemplates = await getCampaignFollowUpTemplates(campaignRow.initial_template_id).catch(err => {
          console.error('[WORKER] getCampaignFollowUpTemplates failed:', err.message);
          return [];
        });
        if (Array.isArray(linkedTemplates) && linkedTemplates.length > 0) {
          shouldScheduleLegacyFollowUp = true;
        } else {
          console.log(
            `[FOLLOWUP_SKIP] Campaign=${job.campaign_id} Lead=${job.lead_email} Reason=No linked follow-up templates configured for template ${campaignRow.initial_template_id}. Legacy next_follow_up_at scheduling skipped.`
          );
        }
      }

      if (shouldScheduleLegacyFollowUp) {
        try {
          await scheduleInitialFollowUp(job.lead_email, result.messageId, result.threadId, new Date(), job.campaign_id);
          console.log(`[FOLLOWUP_CREATE] scheduleInitialFollowUp executed for ${job.lead_email}`);
        } catch (err) {
          console.error('[WORKER] scheduleInitialFollowUp failed:', err.message);
        }
      }

      if (campaignRow.initial_template_id) {
        try {
          await scheduleLinkedFollowUps(job.lead_email, job.campaign_id, campaignRow.initial_template_id, new Date());
          console.log(`[FOLLOWUP_CREATE] scheduleLinkedFollowUps executed for ${job.lead_email} using template ${campaignRow.initial_template_id}`);
        } catch (err) {
          console.error('[WORKER] scheduleLinkedFollowUps failed:', err.message);
        }
      } else {
        console.warn(`[FOLLOWUP_CREATE] No initial_template_id on campaign ${job.campaign_id}; linked follow-ups not created.`);
      }
    } else {
      await pool.query(
        `UPDATE leads
         SET campaign_id = ?, status = ?, follow_up_count = follow_up_count + 1,
             last_sent_date = NOW(), last_activity_at = NOW(), sender_email = ?
         WHERE email = ? AND campaign_id = ?`,
        [job.campaign_id, `Follow-up ${currentStep + 1}`, senderEmail, job.lead_email, job.campaign_id]
      ).catch(e => console.error('[WORKER] leads update failed:', e.message));
      console.log(`[LEAD_SYNC] campaign=${job.campaign_id} recipient=${job.lead_email} sender=${senderEmail} status=Follow-up ${currentStep + 1} action=updated`);
    }

    await recalculateCampaignStats(job.campaign_id, senderEmail).catch(e =>
      console.error('[WORKER] recalculateCampaignStats failed:', e.message)
    );

    console.log(`[SUCCESS] Sent: ${job.lead_email} via ${senderEmail}`);

    await pool.query(
      `INSERT INTO email_events (tracking_id, recipient_email, recipient_name, email_type, status, opened, clicked, replied, sender_email, user_id)
       VALUES (?, ?, ?, ?, 'sent', 0, 0, 0, ?, ?)
       ON DUPLICATE KEY UPDATE tracking_id = tracking_id`,
      [result.trackingId || result.messageId || `${job.lead_email}-${Date.now()}`,
       job.lead_email, (lead?.name) || '', job.type || 'initial', senderEmail, job.user_id]
    ).catch(() => {});

      await trackEvent({ lead_email: job.lead_email, campaign_id: job.campaign_id, domain, type: 'sent', user_id: job.user_id }).catch(() => {});

    return { blocked: false };

  } catch (err) {
    console.error(`[WORKER] FAILED: ${job.lead_email}`, err.message);
    const isBlock = err.message.includes('BLOCK');

    const smtpCode    = String(err.responseCode || err.code || '').trim();
    const fullMsg     = String(err.response    || err.message || '');
    const failureSender = job.sender_email || null;

    // ── Classify the failure before taking any action ───────────────────────────
    const failureType = isBlock ? 'BLOCK' : classifyFailure(err);
    const shouldSuppress = failureType === 'HARD_BOUNCE';

    console.log(
      `[EMAIL_FAILURE]\n` +
      `  Recipient:      ${job.lead_email}\n` +
      `  Campaign:       ${job.campaign_id}\n` +
      `  Sender:         ${failureSender || 'unknown'}\n` +
      `  SMTP Code:      ${smtpCode || '(none)'}\n` +
      `  SMTP Response:  ${fullMsg.slice(0, 200)}\n` +
      `  Error Code:     ${err.code || '(none)'}\n` +
      `  Failure Type:   ${failureType}\n` +
      `  Classification: ${failureType}\n` +
      `  ShouldSuppress: ${shouldSuppress}\n` +
      `  Reason:         ${shouldSuppress ? 'Recipient hard bounce — permanent delivery failure' : 'Sender/transport/app error — recipient not at fault'}`
    );

    if (isBlock) {
      // BLOCK_ACCOUNT / BLOCK_GLOBAL — already handled upstream, just reschedule
      await pool.query(
        `UPDATE email_queue SET status = 'pending', attempts = attempts + 1, last_error = ?, updated_at = NOW(), scheduled_at = NOW() + INTERVAL 5 MINUTE WHERE id = ?`,
        [err.message, job.id]
      );
      return { blocked: true };
    }

    if (failureType === 'HARD_BOUNCE') {
      // ── Genuine recipient rejection — suppress and mark bounced ─────────────
      console.log(`[BOUNCE] HARD_BOUNCE confirmed for ${job.lead_email} code=${smtpCode}`);
      await recordSuppression(job.lead_email, {
        reason: 'Hard Bounce',
        bounceType: 'Hard Bounce',
        smtpCode,
        failureReason: fullMsg.slice(0, 500),
        campaignId: job.campaign_id,
        senderAccount: failureSender,
      }).catch(e => console.error('[BOUNCE] recordSuppression error:', e.message));
      await pool.query(
        `UPDATE leads SET status = 'Bounced', is_bounced = 1, next_follow_up_at = NULL, last_activity_at = NOW() WHERE email = ? AND campaign_id = ?`,
        [job.lead_email, job.campaign_id]
      ).catch(() => {});
      await pool.query(
        `INSERT INTO email_logs (lead_email, to_email, email, type, subject, status, provider, message_id, tracking_id, sender_email, queue_job_id, user_id)
         VALUES (?, ?, ?, ?, ?, 'bounced', ?, ?, '', ?, ?, ?)`,
        [job.lead_email, job.lead_email, job.lead_email, job.type || 'initial', job.subject || '', 'smtp', smtpCode || 'unknown', failureSender || '', job.id, job.user_id]
      ).catch(() => {});
      await pool.query(
        `UPDATE email_queue SET status = 'failed', attempts = attempts + 1, last_error = ?, updated_at = NOW() WHERE id = ?`,
        [fullMsg.slice(0, 500), job.id]
      );
      if (job.campaign_id) {
        await recalculateCampaignStats(job.campaign_id).catch(e => console.error('[WORKER] stats recalculation after bounce failed:', e.message));
      }
      return { blocked: false };
    }

    if (failureType === 'AUTH_FAILURE') {
      // ── Sender auth failed — pause account, reschedule job, never suppress recipient ──
      console.error(`[AUTH_FAILURE] Sender ${failureSender} authentication failed (code=${smtpCode}). Pausing account and rescheduling job ${job.id}.`);
      if (failureSender) {
        await pool.query(
          `UPDATE sender_accounts SET status = 'paused', updated_at = NOW() WHERE email = ?`,
          [failureSender]
        ).catch(e => console.error('[AUTH_FAILURE] Failed to pause sender account:', e.message));
      }
      await pool.query(
        `UPDATE email_queue SET status = 'pending', attempts = attempts + 1, last_error = ?, updated_at = NOW(), scheduled_at = NOW() + INTERVAL 30 MINUTE WHERE id = ?`,
        [`AUTH_FAILURE: ${fullMsg.slice(0, 200)}`, job.id]
      );
      return { blocked: true }; // stop the current batch — sender is broken
    }

    if (failureType === 'CONNECTION_FAILURE' || failureType === 'TEMPORARY') {
      // ── Transient error — retry later, never suppress recipient ─────────────
      const retryDelay = failureType === 'TEMPORARY' ? 'INTERVAL 15 MINUTE' : 'INTERVAL 5 MINUTE';
      console.log(`[${failureType}] Rescheduling job ${job.id} for ${job.lead_email} — no suppression.`);
      await pool.query(
        `UPDATE email_queue SET status = 'pending', attempts = attempts + 1, last_error = ?, updated_at = NOW(), scheduled_at = NOW() + ${retryDelay} WHERE id = ?`,
        [`${failureType}: ${fullMsg.slice(0, 200)}`, job.id]
      );
      return { blocked: false };
    }

    // ── APP_ERROR or unknown — log only, reschedule, never suppress ───────────
    console.error(`[APP_ERROR] Unexpected failure for job ${job.id} (${job.lead_email}): ${fullMsg.slice(0, 300)}`);
    await pool.query(
      `UPDATE email_queue SET status = 'failed', attempts = attempts + 1, last_error = ?, updated_at = NOW(), scheduled_at = NOW() + INTERVAL 5 MINUTE WHERE id = ?`,
      [fullMsg.slice(0, 500), job.id]
    );
    return { blocked: false };
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
    // Temporary queue diagnostics
    try {
      const { rows: [eligible] } = await pool.query(
        `SELECT COUNT(*) AS cnt FROM email_queue WHERE status IN ('pending','failed') AND (scheduled_at IS NULL OR scheduled_at <= NOW())`
      );
      const { rows: [future] } = await pool.query(
        `SELECT COUNT(*) AS cnt, MIN(scheduled_at) AS next_at FROM email_queue WHERE status IN ('pending','failed') AND scheduled_at > NOW()`
      );
      const { rows: [overdueJobs] } = await pool.query(
        `SELECT COUNT(*) AS cnt FROM email_queue WHERE status IN ('pending','failed') AND scheduled_at IS NOT NULL AND scheduled_at <= NOW()`
      );
      console.log(`[QUEUE] Current Time=${new Date().toISOString()} EligibleJobs=${eligible.cnt} OverdueJobs=${overdueJobs.cnt} FutureScheduled=${future.cnt}`);
    } catch (e) {
      console.warn('[QUEUE] Diagnostics query failed:', e.message);
    }

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
        console.log(`[QUEUE_EXECUTION] SelectedJobs=${ids.join(',')} Count=${ids.length}`);
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
      console.log(`[QUEUE_EXECUTION] Current Time=${new Date().toISOString()} ExecutingJobId=${jobs[i].id} Lead=${jobs[i].lead_email} Campaign=${jobs[i].campaign_id}`);
      const r = await processJob(jobs[i]);
      if (!r.blocked) console.log(`[QUEUE_EXECUTION] Completed JobId=${jobs[i].id} Lead=${jobs[i].lead_email}`);
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

async function getQueueStatus() {
  try {
    const { rows: [eligible] } = await pool.query(
      `SELECT COUNT(*) AS cnt FROM email_queue WHERE status IN ('pending','failed') AND (scheduled_at IS NULL OR scheduled_at <= NOW())`
    );
    const { rows: [future] } = await pool.query(
      `SELECT COUNT(*) AS cnt, MIN(scheduled_at) AS next_at FROM email_queue WHERE status IN ('pending','failed') AND scheduled_at > NOW()`
    );
    const { rows: [overdueJobs] } = await pool.query(
      `SELECT COUNT(*) AS cnt FROM email_queue WHERE status IN ('pending','failed') AND scheduled_at IS NOT NULL AND scheduled_at <= NOW()`
    );
    return {
      isProcessing,
      eligible: parseInt(eligible.cnt || 0),
      overdue: parseInt(overdueJobs.cnt || 0),
      future: parseInt(future.cnt || 0),
      nextAt: future.next_at || null,
    };
  } catch (err) {
    console.warn('[QUEUE] getQueueStatus failed:', err.message);
    return { isProcessing, eligible: 0, overdue: 0, future: 0, nextAt: null };
  }
}

module.exports = { startWorker, triggerQueue, getQueueStatus };
