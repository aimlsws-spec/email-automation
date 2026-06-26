const pool = require('../db');
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const { convert: htmlToText } = require('html-to-text');
const { getGmailService } = require('../config/gmail');
const { handleReplyDetected } = require('./automatedFollowUp.service');
const { createLeadFromReply, ensureReplyLeadsTable } = require('./leadDetection.service');
const { trackEvent } = require('./eventTracker.service');

// ─── Safe column migration ────────────────────────────────────────────────────
async function ensureReplyColumns() {
  await pool.query(`ALTER TABLE leads ADD COLUMN has_replied TINYINT(1) NOT NULL DEFAULT 0`).catch(() => {});
  await pool.query(`ALTER TABLE leads ADD COLUMN reply_detected_at DATETIME DEFAULT NULL`).catch(() => {});
  await pool.query(`ALTER TABLE campaigns ADD COLUMN reply_count INT DEFAULT 0`).catch(() => {});
  await pool.query(`ALTER TABLE sender_accounts ADD COLUMN reply_count INT DEFAULT 0`).catch(() => {});
  await pool.query(`
    UPDATE leads SET has_replied = 1
    WHERE reply_detected_at IS NOT NULL
      AND reply_detected_at != ''
      AND has_replied = 0
  `).catch(() => {});
  await ensureReplyLeadsTable();
}

// ─── Auto-reply / bounce detection ───────────────────────────────────────────
const AUTO_REPLY_SUBJECT_PATTERNS = [
  'out of office', 'automatic reply', 'auto-reply', 'autoreply',
  'vacation', 'away from', 'on leave', 'on holiday',
  'delivery status', 'undeliverable', 'failed delivery',
  'mail delivery failed', 'returned mail', 'delivery failure',
  'non-delivery', 'unable to deliver',
];

const NO_REPLY_FROM_PATTERNS = [/no-?reply@/i, /mailer-daemon@/i, /postmaster@/i];

function isAutoReplySubject(subject) {
  return AUTO_REPLY_SUBJECT_PATTERNS.some(p => (subject || '').toLowerCase().includes(p));
}

function isNoReplyAddress(from) {
  return NO_REPLY_FROM_PATTERNS.some(re => re.test(from || ''));
}

function isAutoReplyHeaders(rawHeaders) {
  const autoSubmitted = getHeader(rawHeaders, 'auto-submitted');
  if (autoSubmitted && autoSubmitted.toLowerCase() !== 'no') return true;
  if (getHeader(rawHeaders, 'x-autoreply')) return true;
  if (getHeader(rawHeaders, 'x-autorespond')) return true;
  return false;
}

// ─── Raw IMAP header parser ───────────────────────────────────────────────────
function getHeader(rawHeaders, name) {
  const raw = Buffer.isBuffer(rawHeaders) ? rawHeaders.toString() : String(rawHeaders || '');
  const m = raw.match(new RegExp(`^${name}:\\s*(.+)`, 'im'));
  return m ? m[1].trim() : '';
}

function extractMessageIds(inReplyTo, references) {
  return [
    ...inReplyTo.split(/\s+/),
    ...references.split(/\s+/),
  ].map(s => s.trim()).filter(s => s.startsWith('<') && s.endsWith('>'));
}

function normalizeEmail(value) {
  return ((String(value || '').match(/<([^>]+)>/) || [])[1] || String(value || ''))
    .trim()
    .toLowerCase();
}

function normalizeSubject(subject) {
  return String(subject || '')
    .replace(/^\s*(re|fw|fwd)\s*:\s*/ig, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function normalizeMessageId(messageId) {
  const trimmed = String(messageId || '').trim();
  if (!trimmed) return '';
  const angle = trimmed.match(/<[^>]+>/);
  return angle ? angle[0] : trimmed;
}

function buildReplyMatcher(leads) {
  const msgIdToLead = new Map();
  const emailSubjectToLead = new Map();

  for (const lead of leads) {
    const messageId = normalizeMessageId(lead.message_id);
    if (messageId) msgIdToLead.set(messageId, lead);

    const subject = normalizeSubject(lead.last_subject);
    const key = `${normalizeEmail(lead.email)}|${subject}`;
    if (lead.email && subject && !emailSubjectToLead.has(key)) {
      emailSubjectToLead.set(key, lead);
    }
  }

  return ({ from, subject, inReplyTo = '', references = '' }) => {
    const referencedIds = extractMessageIds(inReplyTo, references).map(normalizeMessageId);
    for (const id of referencedIds) {
      const lead = msgIdToLead.get(id);
      if (lead) return { lead, matchedMessageId: id, matchMethod: 'headers' };
    }

    const key = `${normalizeEmail(from)}|${normalizeSubject(subject)}`;
    const lead = emailSubjectToLead.get(key);
    if (lead) {
      return {
        lead,
        matchedMessageId: normalizeMessageId(lead.message_id),
        matchMethod: 'sender_subject',
      };
    }

    return null;
  };
}

// ─── Quote / thread stripping ─────────────────────────────────────────────────
/**
 * Keeps only the newest reply content by removing:
 *  - quoted lines starting with ">"
 *  - "On [date] ... wrote:" attribution headers (single and multi-line)
 *  - "-----Original Message-----" / "-----Forwarded Message-----" blocks
 *  - Outlook From/Sent/To forwarded-message blocks
 *  - Trailing blank lines
 */
function stripQuotedReplies(text) {
  if (!text) return '';

  const lines  = text.split('\n');
  let   cutAt  = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const line    = lines[i].trim();
    const prevLine = i > 0 ? lines[i - 1].trim() : '';

    // Lines that are purely quoted content
    if (line.startsWith('>')) { cutAt = i; break; }

    // "On Mon, 1 Jan 2024, John wrote:" — single line
    if (/^on .{5,200}wrote:\s*$/i.test(line)) { cutAt = i; break; }

    // Multi-line attribution: previous line starts with "On …", this line ends with "wrote:"
    if (/^on .{5,150}$/i.test(prevLine) && /wrote:\s*$/i.test(line)) {
      cutAt = i - 1;
      break;
    }

    // Dash separators used by Outlook / Thunderbird
    if (/^-{5,}/.test(line) || /^_{5,}/.test(line)) { cutAt = i; break; }
    if (/^-{2,}\s*(original message|forwarded message|begin forwarded)/i.test(line)) {
      cutAt = i;
      break;
    }

    // Outlook forwarded block: "From: someone@domain" after a blank line
    if (/^from:\s.+@/i.test(line) && (!prevLine)) {
      const ctx = lines.slice(i, Math.min(i + 5, lines.length)).join(' ');
      if (/\bsent:\s/i.test(ctx) || /\bdate:\s/i.test(ctx)) { cutAt = i; break; }
    }
  }

  return lines
    .slice(0, cutAt)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')  // collapse excess blank lines
    .trim();
}

// ─── Body extraction helpers ─────────────────────────────────────────────────
const HTML_TO_TEXT_OPTS = {
  wordwrap:  false,
  selectors: [
    { selector: 'a',   options: { ignoreHref: true } },
    { selector: 'img', format: 'skip' },
    { selector: 'style', format: 'skip' },
    { selector: 'script', format: 'skip' },
  ],
};

/**
 * Given a mailparser-parsed message, returns the clean plain-text body
 * with quoted thread history removed.
 */
function extractCleanBodyFromParsed(parsed) {
  let body = '';

  if (parsed.text && parsed.text.trim()) {
    body = parsed.text;
  } else if (parsed.html) {
    body = htmlToText(parsed.html, HTML_TO_TEXT_OPTS);
  }

  return stripQuotedReplies(body);
}

/**
 * Recursively walks a Gmail API MIME payload tree to find a part by mimeType.
 */
function findGmailPart(payload, mimeType) {
  if (!payload) return null;
  if (payload.mimeType === mimeType && payload.body?.data) return payload;
  for (const part of (payload.parts || [])) {
    const found = findGmailPart(part, mimeType);
    if (found) return found;
  }
  return null;
}

function decodeGmailData(data) {
  // Gmail uses base64url encoding
  return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

/**
 * Extracts clean plain-text body from a Gmail API full-format message.
 */
function extractCleanBodyFromGmail(message) {
  const payload = message.payload;
  if (!payload) return '';

  let body = '';

  const textPart = findGmailPart(payload, 'text/plain');
  if (textPart?.body?.data) {
    body = decodeGmailData(textPart.body.data);
  } else {
    const htmlPart = findGmailPart(payload, 'text/html');
    if (htmlPart?.body?.data) {
      body = htmlToText(decodeGmailData(htmlPart.body.data), HTML_TO_TEXT_OPTS);
    }
  }

  return stripQuotedReplies(body);
}

// ─── Mark a lead as replied (idempotent) ─────────────────────────────────────
async function markReplied(email, campaignId, senderEmail) {
  const result = await pool.query(`
    UPDATE leads
    SET has_replied       = 1,
        replied           = 1,
        replied_at        = NOW(),
        reply_detected_at = NOW(),
        status            = 'Replied',
        next_follow_up_at = NULL,
        last_activity_at  = NOW()
    WHERE email = ? AND has_replied = 0
  `, [email]);

  const affected = result?.affectedRows ?? result?.rowCount ?? 0;
  if (affected > 0) {
    console.log(`[REPLY_SAVED] email=${email} campaign=${campaignId ?? '?'} status=Replied`);
    if (campaignId) {
      await pool.query(
        `UPDATE campaigns SET reply_count = COALESCE(reply_count, 0) + 1 WHERE id = ?`,
        [campaignId]
      ).catch(err => console.error(`[REPLY] campaign stats update failed:`, err.message));
      console.log(`[STATS_UPDATED] campaign=${campaignId} reply_count+=1`);
    }
    if (senderEmail) {
      await pool.query(
        `UPDATE sender_accounts SET reply_count = COALESCE(reply_count, 0) + 1 WHERE email = ?`,
        [senderEmail]
      ).catch(err => console.error(`[REPLY] sender stats update failed:`, err.message));
      const domain = senderEmail.includes('@') ? senderEmail.split('@').pop().toLowerCase() : '';
      await trackEvent({ lead_email: email, campaign_id: campaignId, domain, type: 'replied' }).catch(() => {});
    }
    await pool.query(
      `UPDATE email_events SET replied = 1, status = 'replied' WHERE recipient_email = ?`,
      [email]
    ).catch(() => {});
    await handleReplyDetected(email).catch(err =>
      console.error(`[REPLY] handleReplyDetected failed for ${email}:`, err.message)
    );
    return true;
  }
  return false;
}

// ─── IMAP reply scan (SMTP senders) ──────────────────────────────────────────
async function scanImapInbox(senderAccount, matchReply) {
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

      // ── Pass 1: lightweight header scan to identify matches ──────────────
      const matchedMeta = [];

      for await (const msg of client.fetch(uids, { envelope: true, headers: true })) {
        const inReplyTo  = getHeader(msg.headers, 'in-reply-to');
        const references = getHeader(msg.headers, 'references');
        const from       = msg.envelope?.from?.[0]?.address || '';
        const subject    = msg.envelope?.subject || '';
        const date       = msg.envelope?.date || null;

        if (isNoReplyAddress(from))    continue;
        if (isAutoReplySubject(subject)) continue;
        if (isAutoReplyHeaders(msg.headers)) continue;

        const match = matchReply({ from, subject, inReplyTo, references });
        if (match) {
          console.log(`[REPLY_FOUND] IMAP from=${from} uid=${msg.uid} method=${match.matchMethod} matched="${match.matchedMessageId}"`);
          matchedMeta.push({ uid: msg.uid, ...match, from, subject, date });
        }
      }

      // ── Pass 2: fetch full source only for matched messages ───────────────
      for (const meta of matchedMeta) {
        let body = '';
        try {
          const full = await client.fetchOne(meta.uid, { source: true });
          if (full?.source) {
            const parsed = await simpleParser(full.source, { skipHtmlToText: false });
            body = extractCleanBodyFromParsed(parsed);
            console.log(`[REPLY_BODY] uid=${meta.uid} chars=${body.length}`);
          }
        } catch (err) {
          console.warn(`[REPLY] Body fetch failed uid=${meta.uid}:`, err.message);
        }
        replies.push({ ...meta, snippet: body });
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

// ─── Gmail API reply scan (Gmail OAuth senders) ───────────────────────────────
async function scanGmailInbox(senderEmail, matchReply) {
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
        // ── Pass 1: metadata only (cheap — headers + snippet) ────────────────
        const metaRes = await gmail.users.messages.get({
          userId: 'me', id,
          format: 'metadata',
          metadataHeaders: ['In-Reply-To', 'References', 'From', 'Subject', 'Auto-Submitted', 'X-Autoreply'],
        });

        const headers = metaRes.data.payload?.headers || [];
        const get = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

        const inReplyTo  = get('In-Reply-To').trim();
        const references = get('References').trim();
        const from       = get('From');
        const subject    = get('Subject');

        if (isNoReplyAddress(from))    continue;
        if (isAutoReplySubject(subject)) continue;
        const autoSubmitted = get('Auto-Submitted');
        if (autoSubmitted && autoSubmitted.toLowerCase() !== 'no') continue;
        if (get('X-Autoreply')) continue;

        const match = matchReply({ from, subject, inReplyTo, references });
        if (!match) continue;

        const internalDate = metaRes.data.internalDate
          ? new Date(parseInt(metaRes.data.internalDate, 10))
          : null;

        console.log(`[REPLY_FOUND] Gmail from=${from} id=${id} method=${match.matchMethod} matched="${match.matchedMessageId}"`);

        // ── Pass 2: full format to get body (only for matched messages) ──────
        let body = metaRes.data.snippet || ''; // safe fallback
        try {
          const fullRes = await gmail.users.messages.get({
            userId: 'me', id,
            format: 'full',
          });
          const extracted = extractCleanBodyFromGmail(fullRes.data);
          if (extracted) body = extracted;
          console.log(`[REPLY_BODY] Gmail id=${id} chars=${body.length}`);
        } catch (err) {
          console.warn(`[REPLY] Gmail body fetch failed id=${id}:`, err.message);
        }

        replies.push({ ...match, from, subject, date: internalDate, snippet: body });
      } catch (e) { /* skip individual message errors */ }
    }
  } catch (err) {
    console.error(`[REPLY] Gmail list error for ${senderEmail}:`, err.message);
  }

  return replies;
}

// ─── Main entry point ─────────────────────────────────────────────────────────
async function checkReplies() {
  try {
    await ensureReplyColumns();

    const { rows: leads } = await pool.query(`
      SELECT
        l.email,
        l.message_id,
        COALESCE(l.last_subject, c.subject) AS last_subject,
        l.campaign_id,
        c.name AS campaign_name,
        COALESCE(l.sender_email, c.sender_email) AS sender_email
      FROM leads l
      LEFT JOIN campaigns c ON l.campaign_id = c.id
      WHERE l.has_replied = 0
        AND l.message_id IS NOT NULL
        AND l.message_id != ''
        AND l.status NOT IN ('Pending', 'Failed')
      ORDER BY l.last_activity_at DESC
      LIMIT 200
    `);

    console.log(`[REPLY_SCAN_START] checking=${leads.length} leads at=${new Date().toISOString()}`);
    if (leads.length === 0) return;

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
      const acct       = accts[0];
      const senderType = acct?.type || 'gmail';
      const matchReply = buildReplyMatcher(bySender[senderEmail]);

      if (senderType === 'smtp' && !acct) {
        console.warn(`[REPLY] SMTP sender ${senderEmail} has no sender_accounts row; skipping IMAP scan`);
        continue;
      }

      const replies = senderType === 'smtp'
        ? await scanImapInbox(acct, matchReply)
        : await scanGmailInbox(senderEmail, matchReply);

      for (const { matchedMessageId, matchMethod, lead, from, subject, date, snippet } of replies) {
        if (!lead) continue;
        console.log(`[THREAD_MATCH] method=${matchMethod} messageId="${matchedMessageId}" -> lead=${lead.email}`);
        console.log(`[LEAD_MATCH]   email=${lead.email} campaign=${lead.campaign_id}`);

        const saved = await markReplied(lead.email, lead.campaign_id, senderEmail);

        // Always upsert the lead record — ON DUPLICATE KEY UPDATE fills reply_message
        // if it was previously empty (e.g. from an older scan before body-fetch was added)
        const fromEmail = normalizeEmail(from);
        await createLeadFromReply({
          senderEmail:  fromEmail.trim(),
          campaignId:   lead.campaign_id,
          campaignName: lead.campaign_name,
          subject,
          replyMessage: snippet,
          replyDate:    date,
          mailbox:      senderEmail,
        }).catch(err => console.error(`[LEAD] createLeadFromReply failed:`, err.message));

        if (saved) {
          console.log(`[DASHBOARD_REFRESH] reply saved for ${lead.email}; leads/export endpoints now include it`);
        }
      }
    }

    console.log(`[DASHBOARD_REFRESH] reply scan complete at=${new Date().toISOString()}`);
  } catch (err) {
    console.error('[REPLY] Critical engine error:', err.message);
  }
}

module.exports = { checkReplies };
