const pool = require('../db');
const { ImapFlow } = require('imapflow');
const { getGmailService } = require('../config/gmail');
const { handleReplyDetected } = require('./automatedFollowUp.service');

// ─── Safe column migration ───────────────────────────────────────────────────
async function ensureReplyColumns() {
  await pool.query(`ALTER TABLE leads ADD COLUMN has_replied TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {});
  await pool.query(`ALTER TABLE leads ADD COLUMN reply_detected_at DATETIME DEFAULT NULL`).catch(() => {});
  await pool.query(`
    UPDATE leads SET has_replied = 1
    WHERE reply_detected_at IS NOT NULL
      AND reply_detected_at != ''
      AND has_replied = 0
  `).catch(() => {});
}

// ─── Mark a lead as replied (idempotent) ────────────────────────────────────
async function markReplied(email, campaignId) {
  const result = await pool.query(`
    UPDATE leads
    SET has_replied       = 1,
        reply_detected_at = NOW(),
        status            = 'Replied',
        next_follow_up_at = NULL,
        last_activity_at  = NOW()
    WHERE email = ? AND has_replied = 0
  `, [email]);

  const affected = result?.affectedRows ?? result?.rowCount ?? 0;
  if (affected > 0) {
    console.log(`[REPLY_SAVED] email=${email} campaign=${campaignId ?? '?'} status=Replied`);
    await pool.query(
      `UPDATE email_events SET replied = 1, status = 'replied' WHERE recipient_email = ?`,
      [email]
    ).catch(() => {});
    // Stop automated follow-up sequence
    await handleReplyDetected(email).catch(err =>
      console.error(`[REPLY] handleReplyDetected failed for ${email}:`, err.message)
    );
    return true;
  }
  return false;
}

// ─── Parse raw header Buffer from imapflow ───────────────────────────────────
function getHeader(rawHeaders, name) {
  const raw = Buffer.isBuffer(rawHeaders) ? rawHeaders.toString() : String(rawHeaders || '');
  const m = raw.match(new RegExp(`^${name}:\\s*(.+)`, 'im'));
  return m ? m[1].trim() : '';
}

// Extract all <message-id> tokens from In-Reply-To + References values
function extractMessageIds(inReplyTo, references) {
  return [
    ...inReplyTo.split(/\s+/),
    ...references.split(/\s+/),
  ].map(s => s.trim()).filter(s => s.startsWith('<') && s.endsWith('>'));
}

// ─── IMAP reply scan (SMTP senders) ─────────────────────────────────────────
async function scanImapInbox(senderAccount, sentMessageIds) {
  const { smtp_host: host, smtp_user: user, smtp_pass: pass } = senderAccount;

  if (!host || !user || !pass) {
    console.warn(`[REPLY] IMAP skipped for ${user} — missing credentials`);
    return [];
  }

  const client = new ImapFlow({
    host,
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false,
    tls: { rejectUnauthorized: false },
  });

  const replies = [];

  try {
    await client.connect();
    console.log(`[REPLY_SCAN_START] IMAP connected to ${host} as ${user}`);

    const lock = await client.getMailboxLock('INBOX');
    try {
      const since = new Date();
      since.setDate(since.getDate() - 30);

      const uids = await client.search({ since });
      console.log(`[REPLY_SCAN_START] IMAP found ${uids.length} messages since ${since.toDateString()}`);

      if (uids.length === 0) return replies;

      // headers: true returns a Buffer with all raw headers
      for await (const msg of client.fetch(uids, { envelope: true, headers: true })) {
        const inReplyTo  = getHeader(msg.headers, 'in-reply-to');
        const references = getHeader(msg.headers, 'references');
        const from       = msg.envelope?.from?.[0]?.address || '';

        if (!inReplyTo && !references) continue;

        const referencedIds = extractMessageIds(inReplyTo, references);
        const matched = referencedIds.find(id => sentMessageIds.has(id));
        if (matched) {
          console.log(`[REPLY_FOUND] IMAP from=${from} matched sentId="${matched}"`);
          replies.push({ matchedMessageId: matched, from });
        }
      }
    } finally {
      lock.release();
    }
  } catch (err) {
    console.error(`[REPLY] IMAP error for ${user}@${host}:`, err.message);
  } finally {
    await client.logout().catch(() => {});
  }

  return replies;
}

// ─── Gmail API reply scan (Gmail OAuth senders) ──────────────────────────────
async function scanGmailInbox(senderEmail, sentMessageIds) {
  const replies = [];
  let gmail;
  try {
    gmail = await getGmailService(senderEmail);
  } catch (err) {
    console.error(`[REPLY] Gmail auth failed for ${senderEmail}:`, err.message);
    return replies;
  }

  console.log(`[REPLY_SCAN_START] Gmail scanning inbox for ${senderEmail}`);

  try {
    const listRes = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults: 100,
      q: 'newer_than:30d',
    });

    const messages = listRes.data.messages || [];
    console.log(`[REPLY_SCAN_START] Gmail found ${messages.length} inbox messages`);

    for (const { id } of messages) {
      try {
        const msgRes = await gmail.users.messages.get({
          userId: 'me', id,
          format: 'metadata',
          metadataHeaders: ['In-Reply-To', 'References', 'From'],
        });

        const headers = msgRes.data.payload?.headers || [];
        const get = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

        const inReplyTo  = get('In-Reply-To').trim();
        const references = get('References').trim();
        const from       = get('From');

        if (!inReplyTo && !references) continue;

        const referencedIds = extractMessageIds(inReplyTo, references);
        const matched = referencedIds.find(id => sentMessageIds.has(id));
        if (matched) {
          console.log(`[REPLY_FOUND] Gmail from=${from} matched sentId="${matched}"`);
          replies.push({ matchedMessageId: matched, from });
        }
      } catch (e) { /* skip individual message errors */ }
    }
  } catch (err) {
    console.error(`[REPLY] Gmail list error for ${senderEmail}:`, err.message);
  }

  return replies;
}

// ─── Main entry point ────────────────────────────────────────────────────────
async function checkReplies() {
  try {
    await ensureReplyColumns();

    const { rows: leads } = await pool.query(`
      SELECT
        l.email,
        l.message_id,
        l.campaign_id,
        COALESCE(l.sender_email, c.sender_email) AS sender_email
      FROM leads l
      LEFT JOIN campaigns c ON l.campaign_id = c.id
      WHERE l.has_replied = 0
        AND l.message_id IS NOT NULL
        AND l.message_id != ''
        AND l.status NOT IN ('Pending', 'Failed')
      LIMIT 200
    `);

    console.log(`[REPLY_SCAN_START] checking=${leads.length} leads at=${new Date().toISOString()}`);
    if (leads.length === 0) return;

    // Build map: message_id → lead
    const msgIdToLead = new Map();
    for (const lead of leads) {
      if (lead.message_id) msgIdToLead.set(lead.message_id.trim(), lead);
    }
    const sentMessageIds = new Set(msgIdToLead.keys());

    // Group by sender_email
    const bySender = {};
    for (const lead of leads) {
      if (!lead.sender_email) continue;
      (bySender[lead.sender_email] = bySender[lead.sender_email] || []).push(lead);
    }

    for (const senderEmail of Object.keys(bySender)) {
      const { rows: accts } = await pool.query(
        `SELECT type, smtp_host, smtp_user, smtp_pass FROM sender_accounts WHERE email = ?`,
        [senderEmail]
      );
      const acct = accts[0];
      const senderType = acct?.type || 'gmail';

      const replies = senderType === 'smtp'
        ? await scanImapInbox(acct, sentMessageIds)
        : await scanGmailInbox(senderEmail, sentMessageIds);

      for (const { matchedMessageId } of replies) {
        const lead = msgIdToLead.get(matchedMessageId);
        if (!lead) continue;
        console.log(`[THREAD_MATCH] messageId="${matchedMessageId}" → lead=${lead.email}`);
        console.log(`[LEAD_MATCH] email=${lead.email} campaign=${lead.campaign_id}`);
        await markReplied(lead.email, lead.campaign_id);
      }
    }

    console.log(`[DASHBOARD_REFRESH] reply scan complete at=${new Date().toISOString()}`);
  } catch (err) {
    console.error('[REPLY] Critical engine error:', err.message);
  }
}

module.exports = { checkReplies };
