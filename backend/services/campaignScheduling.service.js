'use strict';

const pool = require('../db');

const ID_CHUNK_SIZE = 1000;
const TERMINAL_LEAD_STATUSES = new Set(['Replied', 'Unsubscribed', 'Bounced']);
const TERMINAL_PROCESSING_STATUSES = new Set(['Sent', 'Replied', 'Completed', 'Failed', 'Suppressed']);

function chunk(array, size) {
  const out = [];
  for (let i = 0; i < array.length; i += size) out.push(array.slice(i, i + size));
  return out;
}

async function findCampaignForStart(campaignId, userId) {
  const { rows } = await pool.query(
    `SELECT * FROM campaign_master WHERE id = ? AND deleted_at IS NULL LIMIT 1`,
    [campaignId]
  );
  const campaign = rows[0];
  if (!campaign) {
    const err = new Error('Campaign not found');
    err.statusCode = 404;
    throw err;
  }
  if (userId && campaign.uploaded_by && campaign.uploaded_by !== userId) {
    const err = new Error('Campaign not found');
    err.statusCode = 404;
    throw err;
  }
  if (campaign.status !== 'Ready') {
    const err = new Error(`Campaign must be "Ready" to start. Current status: "${campaign.status}"`);
    err.statusCode = 409;
    throw err;
  }
  return campaign;
}

/**
 * Assign senders to a Ready campaign — each sender gets ITS OWN subject and
 * template (not one shared across the whole campaign), because each shadow
 * campaign's `initial_template_id` is what the existing campaignFollowUp
 * system uses to pick that lead's follow-up sequence. Creates one shadow
 * single-sender row in the legacy `campaigns` table per sender (so the
 * existing send worker / follow-up / reply pipeline can pin exactly one
 * sender per row, see queueWorker.js sender resolution), round-robin
 * assigns every Valid/Pending campaign_leads row across those senders, and
 * flips the campaign to Running.
 */
async function startCampaign(campaignId, { senders, scheduleType, userId }) {
  const campaign = await findCampaignForStart(campaignId, userId);

  if (!Array.isArray(senders) || senders.length === 0) {
    const err = new Error('senders[] is required — one entry per sender with senderEmail, templateId, and subject');
    err.statusCode = 400;
    throw err;
  }
  for (const s of senders) {
    if (!s.senderEmail || !s.templateId || !s.subject) {
      const err = new Error('Each sender entry requires senderEmail, templateId, and subject');
      err.statusCode = 400;
      throw err;
    }
  }

  const senderEmails = senders.map((s) => s.senderEmail);
  const placeholders = senderEmails.map(() => '?').join(',');
  const { rows: senderAccountRows } = await pool.query(
    `SELECT email, COALESCE(type, 'gmail') AS type FROM sender_accounts
     WHERE user_id = ? AND status = 'active' AND email IN (${placeholders})`,
    [userId, ...senderEmails]
  );
  const senderAccountByEmail = new Map(senderAccountRows.map((s) => [s.email, s]));

  const templateIds = [...new Set(senders.map((s) => s.templateId))];
  const templatePlaceholders = templateIds.map(() => '?').join(',');
  const { rows: templateRows } = await pool.query(
    `SELECT id, html_content, template_type FROM email_templates WHERE user_id = ? AND id IN (${templatePlaceholders})`,
    [userId, ...templateIds]
  );
  const templateById = new Map(templateRows.map((t) => [t.id, t]));

  const finalScheduleType = scheduleType || 'alternate_day';

  // ── Create one campaign_senders row + one shadow legacy campaign per sender,
  //    each with its own subject/template so follow-ups stay sender-specific ──
  const campaignSenders = [];
  for (const s of senders) {
    const senderAccount = senderAccountByEmail.get(s.senderEmail);
    if (!senderAccount) {
      const err = new Error(`Sender "${s.senderEmail}" is not an active sender account for this user`);
      err.statusCode = 400;
      throw err;
    }
    const template = templateById.get(Number(s.templateId));
    if (!template) {
      const err = new Error(`Template id ${s.templateId} not found for sender "${s.senderEmail}"`);
      err.statusCode = 404;
      throw err;
    }

    const isGmail = senderAccount.type === 'gmail';
    const { insertId: legacyCampaignId } = await pool.query(
      `INSERT INTO campaigns
         (name, subject, from_name, status, sending_type, gmail_accounts, sender_email,
          template_html, template_type, domain_accounts, initial_template_id, followup_enabled, user_id)
       VALUES (?, ?, ?, 'Running', ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [
        `${campaign.campaign_name} — ${senderAccount.email}`,
        s.subject,
        s.fromName || null,
        isGmail ? 'gmail' : 'domain',
        isGmail ? JSON.stringify([senderAccount.email]) : null,
        isGmail ? null : senderAccount.email,
        template.html_content,
        template.template_type || 'html',
        isGmail ? null : JSON.stringify([senderAccount.email]),
        template.id,
        userId,
      ]
    );

    const { insertId: campaignSenderId } = await pool.query(
      `INSERT INTO campaign_senders (campaign_id, sender_email, legacy_campaign_id)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE legacy_campaign_id = VALUES(legacy_campaign_id)`,
      [campaignId, senderAccount.email, legacyCampaignId]
    );

    campaignSenders.push({ id: campaignSenderId, senderEmail: senderAccount.email, legacyCampaignId, templateId: template.id });
  }

  // ── Round-robin assign every Valid/Pending lead across the senders ──────────
  const { rows: leadIdRows } = await pool.query(
    `SELECT id FROM campaign_leads WHERE campaign_id = ? AND import_status = 'Valid' AND processing_status = 'Pending' ORDER BY id ASC`,
    [campaignId]
  );

  const bucketsBySenderId = new Map(campaignSenders.map((cs) => [cs.id, []]));
  leadIdRows.forEach((row, idx) => {
    const sender = campaignSenders[idx % campaignSenders.length];
    bucketsBySenderId.get(sender.id).push(row.id);
  });

  for (const cs of campaignSenders) {
    const ids = bucketsBySenderId.get(cs.id);
    for (const idChunk of chunk(ids, ID_CHUNK_SIZE)) {
      if (idChunk.length === 0) continue;
      const idPlaceholders = idChunk.map(() => '?').join(',');
      await pool.query(
        `UPDATE campaign_leads SET assigned_sender_id = ?, assigned_template_id = ? WHERE id IN (${idPlaceholders})`,
        [cs.id, cs.templateId, ...idChunk]
      );
    }
  }

  await pool.query(
    `UPDATE campaign_master SET status = 'Running', schedule_type = ?, next_schedule_at = NOW() WHERE id = ?`,
    [finalScheduleType, campaignId]
  );

  await pool.query(
    `INSERT INTO campaign_import_logs (campaign_id, event, message, level) VALUES (?, 'campaign_started', ?, 'info')`,
    [campaignId, `Assigned ${leadIdRows.length} leads across ${campaignSenders.length} sender(s), schedule=${finalScheduleType}`]
  );

  // Stagger senders into a rotation — only the first sender fires today;
  // each later sender's clock is pushed out by one extra day so exactly one
  // sender sends per day, cycling through the full list (day 1: sender A,
  // day 2: sender B, day 3: sender C, ... looping back to A once every
  // sender has had a turn) instead of all senders firing simultaneously.
  const { rows: freshSenders } = await pool.query(
    `SELECT * FROM campaign_senders WHERE campaign_id = ? ORDER BY id ASC`,
    [campaignId]
  );
  for (let i = 0; i < freshSenders.length; i++) {
    const sender = freshSenders[i];
    if (i === 0) {
      await releaseBatchForSender({ id: campaignId, uploaded_by: userId }, sender);
    } else {
      await pool.query(
        `UPDATE campaign_senders SET next_eligible_date = CURDATE() + INTERVAL ? DAY WHERE id = ?`,
        [i, sender.id]
      );
    }
  }

  return { campaignId, sendersAssigned: campaignSenders.length, leadsAssigned: leadIdRows.length };
}

/**
 * Cron entry point. For every Running campaign, release the next due batch
 * (up to batch_size leads) for each sender whose rotation turn has come due
 * today, bridging released leads into the legacy leads/email_queue tables so
 * the existing worker/follow-up/reply pipeline picks them up unmodified.
 * Senders take turns one per day (see startCampaign / releaseBatchForSender),
 * so normally only one sender is due on any given day.
 */
async function releaseDueBatches() {
  const { rows: campaigns } = await pool.query(
    `SELECT id, uploaded_by FROM campaign_master WHERE status = 'Running' AND deleted_at IS NULL`
  );

  let totalReleased = 0;

  for (const campaign of campaigns) {
    const { rows: senders } = await pool.query(
      `SELECT * FROM campaign_senders
       WHERE campaign_id = ? AND (next_eligible_date IS NULL OR next_eligible_date <= CURDATE())`,
      [campaign.id]
    );

    for (const sender of senders) {
      const released = await releaseBatchForSender(campaign, sender);
      totalReleased += released;
    }

    await syncCampaignLeadsStatus(campaign.id);
    await maybeCompleteCampaign(campaign.id);
  }

  if (totalReleased > 0) {
    console.log(`[CAMPAIGN_SCHEDULER] Released ${totalReleased} lead(s) into the send queue this run`);
  }
  return { totalReleased };
}

async function releaseBatchForSender(campaign, sender) {
  const { rows: leads } = await pool.query(
    `SELECT * FROM campaign_leads
     WHERE campaign_id = ? AND assigned_sender_id = ? AND import_status = 'Valid' AND processing_status = 'Pending'
     ORDER BY id ASC LIMIT ?`,
    [campaign.id, sender.id, sender.batch_size]
  );

  if (leads.length === 0) return 0;

  const { rows: legacyRows } = await pool.query(
    `SELECT id, subject, template_html, sending_type FROM campaigns WHERE id = ? LIMIT 1`,
    [sender.legacy_campaign_id]
  );
  const legacyCampaign = legacyRows[0];
  if (!legacyCampaign) {
    console.error(`[CAMPAIGN_SCHEDULER] Missing shadow campaign id=${sender.legacy_campaign_id} for sender=${sender.sender_email}`);
    return 0;
  }

  const emails = leads.map((l) => l.email);
  const suppressed = await findNowSuppressedEmails(emails, sender.legacy_campaign_id);

  let releasedCount = 0;
  const nextBatchNo = sender.last_batch_no + 1;

  for (const lead of leads) {
    if (suppressed.has(lead.email.toLowerCase())) {
      await pool.query(`UPDATE campaign_leads SET processing_status = 'Suppressed' WHERE id = ?`, [lead.id]);
      continue;
    }

    await pool.query(
      `INSERT INTO leads (email, name, company, campaign_id, status, sender_email, last_activity_at, created_at, follow_up_count, message_id, initial_message_id, last_subject, inquiry_id, reply_detected_at, user_id)
       VALUES (?, ?, ?, ?, 'Pending', ?, NOW(), NOW(), 0, '', '', '', '', '', ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name), company = VALUES(company), campaign_id = VALUES(campaign_id),
         status = 'Pending', sender_email = VALUES(sender_email), last_activity_at = NOW(), follow_up_count = 0,
         message_id = '', initial_message_id = '', last_subject = '', reply_detected_at = '', user_id = VALUES(user_id)`,
      [lead.email, lead.name || '', lead.company || '', sender.legacy_campaign_id, sender.sender_email, campaign.uploaded_by]
    );

    await pool.query(
      `INSERT INTO email_queue (lead_email, campaign_id, subject, html_body, status, sending_mode, sender_email, type, user_id)
       VALUES (?, ?, ?, ?, 'pending', ?, ?, 'initial', ?)`,
      [
        lead.email,
        sender.legacy_campaign_id,
        legacyCampaign.subject,
        legacyCampaign.template_html,
        legacyCampaign.sending_type,
        sender.sender_email,
        campaign.uploaded_by,
      ]
    );

    await pool.query(
      `UPDATE campaign_leads SET processing_status = 'Queued', queued_at = NOW(), batch_no = ? WHERE id = ?`,
      [nextBatchNo, lead.id]
    );
    releasedCount++;
  }

  // Rotation, not parallel every-other-day: a sender's next turn comes only
  // after every other sender in this campaign has had one turn, so exactly
  // one sender fires per day, cycling through the full sender list.
  const { rows: countRows } = await pool.query(
    `SELECT COUNT(*) AS cnt FROM campaign_senders WHERE campaign_id = ?`,
    [campaign.id]
  );
  const rotationDays = Math.max(1, parseInt(countRows[0]?.cnt, 10) || 1);

  await pool.query(
    `UPDATE campaign_senders SET last_batch_no = ?, next_eligible_date = CURDATE() + INTERVAL ? DAY WHERE id = ?`,
    [nextBatchNo, rotationDays, sender.id]
  );

  console.log(
    `[CAMPAIGN_SCHEDULER] campaign=${campaign.id} sender=${sender.sender_email} released=${releasedCount}/${leads.length} batch_no=${nextBatchNo}`
  );

  return releasedCount;
}

/** Re-check suppression at release time (state may have changed since import). */
async function findNowSuppressedEmails(emails, excludeLegacyCampaignId) {
  if (emails.length === 0) return new Set();
  const placeholders = emails.map(() => '?').join(',');
  const { rows } = await pool.query(
    `SELECT email, status, has_replied, is_bounced, unsubscribed
     FROM leads WHERE email IN (${placeholders}) AND (campaign_id IS NULL OR campaign_id != ?)`,
    [...emails, excludeLegacyCampaignId]
  );
  const suppressed = new Set();
  for (const row of rows) {
    const isTerminal =
      Number(row.has_replied) === 1 ||
      Number(row.is_bounced) === 1 ||
      Number(row.unsubscribed) === 1 ||
      TERMINAL_LEAD_STATUSES.has(row.status);
    if (!isTerminal) suppressed.add(String(row.email).toLowerCase());
  }
  return suppressed;
}

/**
 * Once a batch is released, campaign_leads is stamped 'Queued' and never
 * touched again — the actual send/reply pipeline (queueWorker.js,
 * replyCheck.service.js) only updates the legacy `leads` table. Without this,
 * the per-sender progress dashboard shows leads stuck at "In-Flight" forever,
 * even after they've actually sent or gotten a reply. Pulls the real outcome
 * back from `leads` for every still-in-flight campaign_leads row.
 */
async function syncCampaignLeadsStatus(campaignId) {
  await pool.query(
    `UPDATE campaign_leads cl
     JOIN campaign_senders cs ON cs.id = cl.assigned_sender_id
     JOIN leads l ON l.email = cl.email AND l.campaign_id = cs.legacy_campaign_id
     SET cl.processing_status = CASE
           WHEN l.has_replied = 1 THEN 'Replied'
           WHEN l.is_bounced = 1 THEN 'Failed'
           WHEN LOWER(COALESCE(l.status, '')) = 'sent' THEN 'Sent'
           WHEN LOWER(COALESCE(l.status, '')) = 'replied' THEN 'Replied'
           WHEN LOWER(COALESCE(l.status, '')) = 'failed' THEN 'Failed'
           WHEN LOWER(COALESCE(l.status, '')) = 'bounced' THEN 'Failed'
           WHEN LOWER(COALESCE(l.status, '')) = 'unsubscribed' THEN 'Completed'
           ELSE cl.processing_status
         END,
         cl.replied = CASE WHEN l.has_replied = 1 THEN 1 ELSE cl.replied END
     WHERE cl.campaign_id = ? AND cl.processing_status IN ('Queued', 'Scheduled')`,
    [campaignId]
  );
}

async function maybeCompleteCampaign(campaignId) {
  const { rows } = await pool.query(
    `SELECT processing_status, COUNT(*) AS cnt FROM campaign_leads WHERE campaign_id = ? GROUP BY processing_status`,
    [campaignId]
  );
  if (rows.length === 0) return;
  const hasOutstanding = rows.some((r) => !TERMINAL_PROCESSING_STATUSES.has(r.processing_status));
  if (!hasOutstanding) {
    await pool.query(
      `UPDATE campaign_master SET status = 'Completed', completed_at = NOW() WHERE id = ? AND status = 'Running'`,
      [campaignId]
    );
    console.log(`[CAMPAIGN_SCHEDULER] campaign=${campaignId} fully processed — marked Completed`);
  }
}

/**
 * Push a status change on campaign_master down to every shadow campaign it
 * owns. Required because queueWorker.js, campaignFollowUp.service.js, and
 * automatedFollowUp.service.js all gate sending/follow-ups on the shadow
 * `campaigns` row's OWN status — campaign_master.status alone only stops the
 * scheduler from releasing new batches, it does nothing for leads already
 * released into leads/email_queue under a shadow campaign.
 */
async function cascadeShadowCampaignStatus(campaignId, status) {
  await pool.query(
    `UPDATE campaigns c
     JOIN campaign_senders cs ON cs.legacy_campaign_id = c.id
     SET c.status = ?
     WHERE cs.campaign_id = ?`,
    [status, campaignId]
  );
}

/** Per-sender progress breakdown for the UI. */
async function getCampaignProgress(campaignId, userId) {
  const { rows: campaignRows } = await pool.query(
    `SELECT id FROM campaign_master WHERE id = ? AND deleted_at IS NULL AND (uploaded_by IS NULL OR uploaded_by = ?) LIMIT 1`,
    [campaignId, userId]
  );
  if (campaignRows.length === 0) {
    const err = new Error('Campaign not found');
    err.statusCode = 404;
    throw err;
  }

  await syncCampaignLeadsStatus(campaignId);

  const { rows: senders } = await pool.query(
    `SELECT cs.id, cs.sender_email, cs.batch_size, cs.last_batch_no, cs.next_eligible_date,
            SUM(CASE WHEN cl.processing_status = 'Pending' THEN 1 ELSE 0 END) AS pending,
            SUM(CASE WHEN cl.processing_status IN ('Scheduled','Queued') THEN 1 ELSE 0 END) AS in_flight,
            SUM(CASE WHEN cl.processing_status = 'Sent' THEN 1 ELSE 0 END) AS sent,
            SUM(CASE WHEN cl.processing_status = 'Replied' THEN 1 ELSE 0 END) AS replied,
            SUM(CASE WHEN cl.processing_status = 'Suppressed' THEN 1 ELSE 0 END) AS suppressed,
            SUM(CASE WHEN cl.processing_status = 'Failed' THEN 1 ELSE 0 END) AS failed,
            COUNT(cl.id) AS total
     FROM campaign_senders cs
     LEFT JOIN campaign_leads cl ON cl.assigned_sender_id = cs.id
     WHERE cs.campaign_id = ?
     GROUP BY cs.id
     ORDER BY cs.sender_email ASC`,
    [campaignId]
  );

  return senders;
}

module.exports = { startCampaign, releaseDueBatches, getCampaignProgress, cascadeShadowCampaignStatus };
