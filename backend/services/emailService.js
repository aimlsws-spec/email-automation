const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { getGmailService } = require("../config/gmail");
const pool = require("../db");
const crypto = require("crypto");
const { prepareSender, recordSuccess } = require("./senderService");
const { generatePlainText } = require('../utils/plainText');

const EMAIL_ASSETS_DIR = path.join(__dirname, "..", "assets", "email");
const INLINE_IMAGES = [
  {
    filename: "logo.png",
    path: path.join(EMAIL_ASSETS_DIR, "logo.png"),
    cid: "logo@seawind",
    contentDisposition: "inline",
  },
  {
    filename: "web.png",
    path: path.join(EMAIL_ASSETS_DIR, "web.png"),
    cid: "web.png",
    contentDisposition: "inline",
  },
  {
    filename: "ecommerce.png",
    path: path.join(EMAIL_ASSETS_DIR, "ecommerce.png"),
    cid: "ecommerce@seawind",
    contentDisposition: "inline",
  },
];

function prepareInlineImages(html) {
  const finalHtml = html || "";
  const attachments = [];
  const allowedCids = new Set(INLINE_IMAGES.map((image) => image.cid));
  const referencedCids = Array.from(finalHtml.matchAll(/src=["']cid:([^"']+)["']/gi)).map((match) => match[1]);

  for (const cid of referencedCids) {
    if (!allowedCids.has(cid)) {
      continue;
    }
  }

  for (const image of INLINE_IMAGES) {
    if (!finalHtml.includes(`cid:${image.cid}`)) continue;
    if (!fs.existsSync(image.path)) {
      continue;
    }
    attachments.push({
      filename: image.filename,
      path: image.path,
      cid: image.cid,
      contentDisposition: image.contentDisposition,
    });
  }

  return { html: finalHtml, attachments };
}

async function ensureEmailLogColumns() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS email_logs (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      lead_email   VARCHAR(255),
      to_email     VARCHAR(255),
      email        VARCHAR(255),
      type         VARCHAR(100) DEFAULT 'initial',
      subject      TEXT,
      provider     VARCHAR(100) DEFAULT 'gmail',
      sender_email VARCHAR(255) DEFAULT '',
      message_id   TEXT,
      tracking_id  VARCHAR(255) DEFAULT '',
      status       VARCHAR(50) DEFAULT 'sent',
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
      sent_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`ALTER TABLE email_logs ADD COLUMN tracking_id VARCHAR(255) DEFAULT ''`).catch(() => {});
  await pool.query(`ALTER TABLE email_logs ADD COLUMN sender_email VARCHAR(255) DEFAULT ''`).catch(() => {});
}

function getFromAddress() {
  const user = process.env.GMAIL_USER || "aimlsws@gmail.com";
  const name = process.env.FROM_NAME || "Seawind Sales";
  return `"${name}" <${user}>`;
}

async function ensureEmailEventsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS email_events (
      tracking_id       VARCHAR(255) PRIMARY KEY,
      recipient_email   VARCHAR(255) NOT NULL,
      recipient_name    VARCHAR(500) DEFAULT '',
      email_type        VARCHAR(100) NOT NULL DEFAULT 'initial',
      sent_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      status            VARCHAR(50) NOT NULL DEFAULT 'sent',
      opened            TINYINT(1) NOT NULL DEFAULT 0,
      clicked           TINYINT(1) NOT NULL DEFAULT 0,
      replied           TINYINT(1) NOT NULL DEFAULT 0,
      sender_email      VARCHAR(255) DEFAULT '',
      follow_up_sent    TINYINT(1) NOT NULL DEFAULT 0,
      follow_up_sent_at DATETIME DEFAULT NULL
    )
  `);
}

function injectTracking(html, leadEmail, campaignId, senderEmail) {
  if (!html) return html;

  const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
  const resolvedBase = baseUrl;

  let trackedCount = 0;

  const result = html.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi, (match, url) => {
    try {
      if (!url || url.startsWith('#') || url.startsWith('mailto:') || url.includes('/track/click')) {
        return match;
      }
      let finalUrl = url.trim();
      const type = finalUrl.includes('unsubscribe') ? 'unsubscribe' : 'service';
      if (!finalUrl.startsWith('http')) finalUrl = resolvedBase + finalUrl;
      const encodedUrl = Buffer.from(finalUrl).toString('base64');
      const trackingUrl = `${resolvedBase}/track/click?lid=${encodeURIComponent(leadEmail)}&cid=${campaignId || ''}&sid=${encodeURIComponent(senderEmail)}&url=${encodedUrl}&type=${type}`;
      trackedCount++;
      return match.replace(url, trackingUrl);
    } catch (err) {
      return match;
    }
  });

  // Never throw — if no trackable links exist just return html as-is
  console.log(`[TRACKING] Tracked ${trackedCount} link(s)`);
  return result;
}

function createTrackingId() {
  const crypto = require("crypto");
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : crypto.randomBytes(16).toString("hex");
}

function buildHumanFromName(senderEmail) {
  // Extracts first name from email local part for a human-like From header.
  // dhruvi@seawindsolution.in => "Dhruvi | Seawind Solution"
  const local = senderEmail.split('@')[0] || '';
  const firstName = local.charAt(0).toUpperCase() + local.slice(1).split(/[._-]/)[0];
  const displayName = process.env.FROM_NAME || 'Seawind Solution';
  return `"${firstName} | ${displayName}" <${senderEmail}>`;
}

function stripMarkdownFences(html) {
  if (!html) return html;
  // Remove opening ```html or ``` fence
  let s = html.replace(/^```html\s*/i, '').replace(/^```\s*/, '');
  // Remove closing ``` fence
  s = s.replace(/\s*```\s*$/, '');
  return s.trim();
}

function injectVariables(html, lead) {
  if (!html) return html;
  const name      = (lead.first_name || lead.name || 'there').trim();
  const firstName = name.split(' ')[0] || name;
  const agentName = process.env.FROM_NAME || 'Seawind Team';
  const company   = (lead.company || '').trim() || 'your company';
  const inquiryId = encodeURIComponent(lead.email || '');

  return html
    .replace(/\{\{customerName\}\}/g, name)
    .replace(/\{\{name\}\}/g, firstName)
    .replace(/\{\{FirstName\}\}/g, firstName)
    .replace(/\{\{agentName\}\}/g, agentName)
    // Handle all company variants: {{company}}, {{company | default(...)}}, {{ company }}, etc.
    .replace(/\{\{\s*company\s*(?:\|[^}]*)?\}\}/g, company)
    .replace(/\{\{inquiryId\}\}/g, inquiryId)
    .replace(/\{\{unsubscribe\}\}/g, inquiryId)
    // Strip any remaining unrecognised {{ }} so the worker never throws
    .replace(/\{\{[^}]*\}\}/g, '');
}

function buildMultipartMime({ from, to, subject, html, text, inReplyTo, references, unsubscribeEmail, entityRefId }) {
  console.log(`[SUBJECT_STAGE] stage="buildMultipartMime" subject="${subject}"`);
  const boundary = `----=_Part_${Date.now()}`;

  const senderDomain = (from.match(/@([\w.-]+)>?$/) || [])[1] || 'seawindsolution.com';
  const mimeMessageId = `<${Date.now()}.${Math.random().toString(36).slice(2)}@${senderDomain}>`;

  const htmlB64 = Buffer.from(html || '', 'utf8').toString('base64').match(/.{1,76}/g).join('\r\n');
  const textB64 = Buffer.from(text || '', 'utf8').toString('base64').match(/.{1,76}/g).join('\r\n');
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject || '', 'utf8').toString('base64')}?=`;

  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    `Message-ID: ${mimeMessageId}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    `List-Unsubscribe: <mailto:${unsubscribeEmail}>`,
    'List-Unsubscribe-Post: List-Unsubscribe=One-Click',
    'Precedence: bulk',
    'X-Mailer: Seawind Mailer',
    `X-Entity-Ref-ID: ${entityRefId}`,
  ];
  if (inReplyTo) lines.push(`In-Reply-To: ${inReplyTo}`);
  if (references) lines.push(`References: ${references}`);
  lines.push(
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    textB64,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    htmlB64,
    '',
    `--${boundary}--`,
  );
  return { mime: lines.join('\r\n'), mimeMessageId };
}

async function sendViaSmtp(senderAccount, { from, to, subject, html, text, inReplyTo, references, entityRefId, unsubUrl }) {
  const smtpPort = parseInt(senderAccount.smtp_port) || 465;
  const transporter = nodemailer.createTransport({
    host:    senderAccount.smtp_host,
    port:    smtpPort,
    secure:  smtpPort === 465,
    auth:    { user: senderAccount.smtp_user, pass: senderAccount.smtp_pass },
    debug:   true,
    logger:  true,
    connectionTimeout: 15000,
    greetingTimeout:   10000,
    socketTimeout:     15000,
  });

  // Validate sender consistency: from address must match auth user
  const fromEmail = (from.match(/<([^>]+)>/) || [])[1] || from;
  if (fromEmail.toLowerCase() !== senderAccount.smtp_user.toLowerCase()) {
    console.warn(`[SMTP] Sender mismatch: from=${fromEmail} auth.user=${senderAccount.smtp_user} — forcing auth.user`);
  }

  const unsubEmail = process.env.UNSUBSCRIBE_EMAIL || `unsubscribe@${senderAccount.smtp_host}`;
  const plainText  = text || generatePlainText(html || '');

  let info;
  try {
    info = await transporter.sendMail({
      from,
      to,
      subject,
      text:  plainText,
      html,
      envelope: { from: senderAccount.smtp_user, to },
      headers: {
        'List-Unsubscribe':      unsubUrl || `<mailto:${unsubEmail}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'Precedence':            'bulk',
        'X-Entity-Ref-ID':       entityRefId,
        'X-Mailer':              'Seawind Mailer',
        ...(inReplyTo ? { 'In-Reply-To': inReplyTo } : {}),
        ...(references ? { 'References':  references } : {}),
      },
    });
  } catch (err) {
    console.error('[SMTP] sendMail failed:', err.message);
    console.error('[SMTP] Full error:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    throw err;
  }

  console.log('SMTP RESPONSE:', info.response);
  console.log('MESSAGE ID:',    info.messageId);
  console.log('SMTP ACCEPTED:', info.accepted);
  console.log('SMTP REJECTED:', info.rejected);

  if (info.rejected && info.rejected.length > 0) {
    throw new Error(`SMTP rejected recipients: ${info.rejected.join(', ')}`);
  }

  return { id: info.messageId, threadId: '' };
}

async function sendViaGmail(senderEmail, { from, to, subject, html, text, inReplyTo, references, entityRefId, threadId }) {
  const gmail = await getGmailService(senderEmail);
  const unsubEmail = process.env.UNSUBSCRIBE_EMAIL || `unsubscribe@${senderEmail.split('@')[1]}`;
  const { mime: rawMime, mimeMessageId } = buildMultipartMime({ from, to, subject, html, text, inReplyTo, references, unsubscribeEmail: unsubEmail, entityRefId });
  const encodedMessage = Buffer.from(rawMime)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  const requestBody = { raw: encodedMessage };
  // Passing threadId keeps the follow-up inside the original Gmail thread
  if (threadId) requestBody.threadId = threadId;
  const sendPromise = gmail.users.messages.send({ userId: 'me', requestBody });
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Gmail API send timed out after 30s')), 30000)
  );
  const result = await Promise.race([sendPromise, timeoutPromise]);
  return { id: mimeMessageId, threadId: result?.data?.threadId || '' };
}

function resolveSubjectVars(subject, lead) {
  if (!subject || !subject.includes('{{')) return subject;
  const firstName = ((lead.first_name || lead.name || '').trim().split(' ')[0]) || '';
  if (/\{\{\s*name\s*\}\}/.test(subject)) {
    return firstName
      ? subject.replace(/\{\{\s*name\s*\}\}/g, firstName)
      : subject.replace(/\{\{\s*name\s*\}\}[,\s\-—:]*/g, '').trim();
  }
  return subject;
}

function resolveSubjectForLead(rawSubject, lead) {
  const name = (
    lead.name ||
    lead['Name'] ||
    lead['Full Name'] ||
    lead['full_name'] ||
    ''
  ).trim();
  const firstName = name.split(' ')[0] || '';
  const company   = (lead.company || lead['Company'] || '').trim() || 'your business';

  let resolved = String(rawSubject || '');

  if (/\{\{\s*name\s*\}\}/.test(resolved)) {
    resolved = firstName
      ? resolved.replace(/\{\{\s*name\s*\}\}/g, firstName)
      : resolved.replace(/\{\{\s*name\s*\}\}[,\s\-—:]*/g, '').trim();
  }

  resolved = resolved
    .replace(/\{\{\s*company\s*(?:\|[^}]*)?\}\}/g, company)
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  console.log(`[SUBJECT_RENDER] raw="${rawSubject}" name="${firstName}" resolved="${resolved}"`);
  return resolved;
}

async function sendEmail({ to, subject, text, html, type = "initial", inReplyTo, references, threadId, trackingId, recipientName, senderEmail, campaignId, disableTracking = false, lead = null }) {
  if (!to || !subject) throw new Error("sendEmail requires { to, subject }");
  if (!senderEmail) throw new Error("sendEmail requires senderEmail for multi-account support");

  const trimmedTo   = to.trim();
  // Only resolve if the subject still contains template vars (worker may have already resolved it)
  const resolvedSubject = (subject && subject.includes('{{'))
    ? resolveSubjectForLead(subject, lead || { name: recipientName || '' })
    : (subject || '').trim();
  console.log(`[SUBJECT_STAGE] stage="sendEmail.entry" raw="${subject}" resolved="${resolvedSubject}"`);
  const from        = buildHumanFromName(senderEmail);
  const entityRefId = createTrackingId();

  // Unsubscribe URL using sender domain
  const senderDomain = senderEmail.split('@')[1] || 'viralkar.in';
  const unsubUrl = `<https://${senderDomain}/unsubscribe/${encodeURIComponent(trimmedTo)}>`;

  // Plain text: always generated from HTML (multipart improves inbox placement)
  const plainText = text || generatePlainText(html || '');

  // Strip markdown code fences if template was accidentally stored with them
  const sanitizedHtml = stripMarkdownFences(html || '');
  const startsClean = /^<!doctype|^<html/i.test(sanitizedHtml);
  console.log(`[EMAIL_HTML_SANITIZED] starts_clean=${startsClean} length=${sanitizedHtml.length} preview="${sanitizedHtml.slice(0, 60).replace(/\n/g, ' ')}"`);
  console.log(`[EMAIL_SUBJECT_FINAL] subject="${resolvedSubject}"`);

  // Tracking: disabled for first 20 sends to avoid spam signals
  const trackedHtml = disableTracking
    ? sanitizedHtml
    : injectTracking(sanitizedHtml, trimmedTo, campaignId, senderEmail);

  if (!trackedHtml || trackedHtml.length < 10) {
    throw new Error('Template is empty — nothing to send');
  }

  console.log('DELIVERABILITY MODE ACTIVE');
  console.log("FINAL SUBJECT USED:", resolvedSubject);
  console.log("SENDER:", senderEmail);
  console.log("TO:", trimmedTo);
  console.log("CAMPAIGN:", campaignId);

  const inline = prepareInlineImages(trackedHtml);
  await ensureEmailLogColumns();
  await ensureEmailEventsTable();

  const guard = await prepareSender(senderEmail);
  if (!guard.allowed) {
    console.log(`[SENDER] ${senderEmail} - BLOCKED: ${guard.reason}`);
    if (guard.isGlobal) throw new Error(`BLOCK_GLOBAL: ${guard.reason}`);
    throw new Error(`BLOCK_ACCOUNT: ${guard.reason}`);
  }
  console.log(`[ACCOUNT] ${senderEmail} - STATUS: ${guard.sender.status} - COUNT: ${guard.sender.daily_sent_count}`);

  const waitMs = guard.delayMs || 0;
  if (waitMs > 0) {
    console.log(`[EmailService] Waiting ${waitMs / 1000}s before sending...`);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const accountType = guard.sender.type || 'gmail';
  console.log(`[EmailService] Sending via ${accountType.toUpperCase()} | host: ${guard.sender.smtp_host || 'Gmail API'} | from: ${senderEmail} | to: ${trimmedTo}`);

  let sendResult;
  if (accountType === 'smtp') {
    console.log(`[SUBJECT_STAGE] stage="sendMail.payload" transport="smtp" subject="${resolvedSubject}"`);
    sendResult = await sendViaSmtp(guard.sender, { from, to: trimmedTo, subject: resolvedSubject, html: inline.html, text: plainText, inReplyTo, references, entityRefId, unsubUrl });
  } else {
    console.log(`[SUBJECT_STAGE] stage="sendMail.payload" transport="gmail_api" subject="${resolvedSubject}"`);
    sendResult = await sendViaGmail(senderEmail, { from, to: trimmedTo, subject: resolvedSubject, html: inline.html, text: plainText, inReplyTo, references, entityRefId, threadId });
  }
  console.log("EMAIL SENT via", accountType.toUpperCase());

  await recordSuccess(senderEmail);

  const messageId = sendResult.id || '';
  const sentThreadId = sendResult.threadId || '';
  const finalTrackingId = trackingId || createTrackingId();

  await pool.query(
    `INSERT INTO email_logs (lead_email, to_email, email, type, subject, status, provider, message_id, tracking_id, sender_email)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [trimmedTo, trimmedTo, trimmedTo, type, resolvedSubject, 'sent', accountType, messageId, finalTrackingId, senderEmail]
  );
  console.log(`[SUBJECT_STAGE] stage="email_logs.insert" subject="${resolvedSubject}"`);

  await pool.query(
    `INSERT INTO email_events (
      tracking_id, recipient_email, recipient_name, email_type,
      status, opened, clicked, replied, sender_email
    ) VALUES (?, ?, ?, ?, ?, 0, 0, 0, ?)
    ON DUPLICATE KEY UPDATE tracking_id = tracking_id`,
    [finalTrackingId, trimmedTo, recipientName || '', type || 'initial', 'sent', senderEmail]
  );

  return { providerUsed: accountType, messageId, threadId: sentThreadId, trackingId: finalTrackingId, senderEmail };
}

module.exports = { sendEmail, ensureEmailEventsTable, injectVariables, resolveSubjectForLead };
