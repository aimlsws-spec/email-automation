const pool = require('../db');
const { renderSubject, renderTemplate } = require('../utils/templateRenderer');
const { sendEmail } = require('../services/emailService');
const { withTimeout } = require('../utils/misc');
const { stripHtml } = require('../utils/stringHelpers');
const { verifyGmailAuth } = require('../config/gmail');

// POST /api/test-email — send test to yourself to check spam vs inbox
async function testEmail(req, res) {
  try {
    const testEmail = req.body.email;
    if (!testEmail) return res.status(400).json({ error: 'email required' });

    // Resolve sender: prefer explicit body param, then first connected account, then env default
    let senderEmail = (req.body.senderEmail || '').trim();
    if (!senderEmail) {
      const { rows: senders } = await pool.query(
        `SELECT email FROM sender_accounts WHERE is_connected = 1 AND status = 'active' ORDER BY email ASC LIMIT 1`
      );
      senderEmail = senders[0]?.email || process.env.DEFAULT_SENDER_EMAIL || '';
    }
    if (!senderEmail) {
      return res.status(400).json({ error: 'No connected sender account found. Add and connect a Gmail account first.' });
    }

    console.log(`[TEST EMAIL] Sending to ${testEmail} via ${senderEmail}`);

    const lead = { email: testEmail, name: 'Test User', company: 'Test Company' };
    const { subject: manualSubject } = req.body;
    const subject = renderSubject(lead, manualSubject);
    const html = renderTemplate(lead);
    const result = await withTimeout(sendEmail({
      to: testEmail,
      subject,
      text: stripHtml(html),
      html,
      senderEmail,
    }), 15000, "EMAIL TIMEOUT");

    await pool.query(
      `INSERT INTO leads (email, name, company, status, last_sent_date, follow_up_count, message_id, initial_message_id, last_subject, inquiry_id, reply_detected_at, email_provider)
       VALUES (?, 'Test User', 'Test Company', 'Sent', NOW(), 0, ?, ?, ?, '', '', 'gmail')
       ON DUPLICATE KEY UPDATE
         status = 'Sent',
         last_sent_date = NOW(),
         follow_up_count = 0,
         message_id = VALUES(message_id),
         initial_message_id = VALUES(initial_message_id),
         last_subject = VALUES(last_subject),
         email_provider = 'gmail'`,
      [testEmail, result.messageId || '', result.messageId || '', subject]
    );

    res.json({ success: true, message: `Test email sent to ${testEmail}. Check inbox AND spam folder.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/smtp-diagnostic — raw SMTP test bypassing all application logic
// Use this to verify the SMTP server is actually delivering mail
async function smtpDiagnostic(req, res) {
  const nodemailer = require('nodemailer');
  const { to, senderEmail } = req.body;
  if (!to || !senderEmail) {
    return res.status(400).json({ error: 'to and senderEmail are required' });
  }

  try {
    // Fetch SMTP credentials directly from DB
    const { rows } = await pool.query(
      `SELECT smtp_host, smtp_port, smtp_user, smtp_pass FROM sender_accounts WHERE email = ? AND type = 'smtp'`,
      [senderEmail]
    );
    if (!rows[0]) {
      return res.status(404).json({ error: `No SMTP account found for ${senderEmail}` });
    }
    const { smtp_host, smtp_port, smtp_user, smtp_pass } = rows[0];
    const port = parseInt(smtp_port) || 465;

    console.log('[DIAG] SMTP config:', { smtp_host, port, smtp_user });

    const transporter = nodemailer.createTransport({
      host:    smtp_host,
      port,
      secure:  port === 465,
      auth:    { user: smtp_user, pass: smtp_pass },
      debug:   true,
      logger:  true,
      connectionTimeout: 15000,
    });

    // Verify connection first
    await transporter.verify();
    console.log('[DIAG] SMTP connection verified');

    const info = await transporter.sendMail({
      from:    `"Diagnostic Test" <${senderEmail}>`,
      to,
      subject: 'SMTP Diagnostic Test — ' + new Date().toISOString(),
      text:    'This is a raw SMTP diagnostic email. If you receive this, SMTP delivery is working.',
      html:    '<p>This is a raw SMTP diagnostic email. If you receive this, SMTP delivery is working.</p>',
      envelope: { from: smtp_user, to },
    });

    console.log('[DIAG] Accepted:', info.accepted);
    console.log('[DIAG] Rejected:', info.rejected);
    console.log('[DIAG] Response:', info.response);
    console.log('[DIAG] MessageId:', info.messageId);

    res.json({
      success:   true,
      accepted:  info.accepted,
      rejected:  info.rejected,
      response:  info.response,
      messageId: info.messageId,
      smtp_host,
      smtp_user,
      note: info.accepted.length > 0
        ? 'SMTP accepted the message. Check spam folder. If still missing, the issue is server-side (SPF/DKIM/relay).'
        : 'SMTP REJECTED the message — check credentials and relay permissions.',
    });
  } catch (err) {
    console.error('[DIAG] SMTP diagnostic failed:', err.message);
    res.status(500).json({
      success: false,
      error:   err.message,
      hint:    'Check smtp_host, smtp_port, smtp_user, smtp_pass in sender_accounts table.',
    });
  }
}

// GET /test-gmail — verify Gmail Nodemailer connection/settings
async function testGmail(req, res) {
  try {
    await verifyGmailAuth();
    res.json({ success: true, message: 'Gmail connection verified.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { testEmail, smtpDiagnostic, testGmail };
