const pool = require('../db');

// Ensure the email_suppressions table exists on startup
pool.query(`
  CREATE TABLE IF NOT EXISTS email_suppressions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Invalid',
    suppression_reason VARCHAR(50) DEFAULT 'Hard Bounce',
    bounce_type VARCHAR(50) DEFAULT 'Hard Bounce',
    smtp_code VARCHAR(50),
    failure_reason TEXT,
    skip_count INT DEFAULT 0,
    first_failed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_failed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    campaign_id INT,
    sender_account VARCHAR(255),
    failure_count INT DEFAULT 1,
    is_suppressed TINYINT(1) DEFAULT 1,
    revalidated_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_email_suppression (email)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`).then(() => {
  console.log('[SUPPRESSION] email_suppressions table ensured');
}).catch(err => console.error('[SUPPRESSION] Table init error:', err.message));

async function checkSuppression(email) {
  if (!email) return false;
  try {
    const { rows } = await pool.query(
      `SELECT is_suppressed FROM email_suppressions WHERE email = ? LIMIT 1`,
      [email]
    );
    if (rows.length > 0 && rows[0].is_suppressed === 1) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('[SUPPRESSION] checkSuppression error:', error.message);
    return false;
  }
}

async function recordSuppression(email, { reason, bounceType, smtpCode, failureReason, campaignId, senderAccount }) {
  if (!email) return;
  try {
    await pool.query(`
      INSERT INTO email_suppressions 
        (email, status, suppression_reason, bounce_type, smtp_code, failure_reason, first_failed_at, last_failed_at, campaign_id, sender_account, failure_count, is_suppressed)
      VALUES 
        (?, 'Invalid', ?, ?, ?, ?, NOW(), NOW(), ?, ?, 1, 1)
      ON DUPLICATE KEY UPDATE
        status = 'Invalid',
        suppression_reason = VALUES(suppression_reason),
        bounce_type = VALUES(bounce_type),
        smtp_code = VALUES(smtp_code),
        failure_reason = VALUES(failure_reason),
        last_failed_at = NOW(),
        campaign_id = VALUES(campaign_id),
        sender_account = VALUES(sender_account),
        failure_count = failure_count + 1,
        is_suppressed = 1
    `, [email, reason || 'Hard Bounce', bounceType || 'Hard Bounce', smtpCode || '', failureReason || '', campaignId || null, senderAccount || '']);

    await cancelFollowUps(email, campaignId);
  } catch (error) {
    console.error('[SUPPRESSION] recordSuppression error:', error.message);
  }
}

async function incrementSkipCount(email) {
  try {
    await pool.query(`UPDATE email_suppressions SET skip_count = skip_count + 1 WHERE email = ?`, [email]);
  } catch (error) {
    console.error('[SUPPRESSION] incrementSkipCount error:', error.message);
  }
}

async function revalidateEmail(email) {
  try {
    await pool.query(`UPDATE email_suppressions SET is_suppressed = 0, status = 'Active', revalidated_at = NOW() WHERE email = ?`, [email]);
  } catch (error) {
    console.error('[SUPPRESSION] revalidateEmail error:', error.message);
  }
}

async function cancelFollowUps(email, campaignId = null) {
  try {
    const whereClause = campaignId
      ? `WHERE email = ? AND campaign_id = ?`
      : `WHERE email = ?`;
    const params = campaignId ? [email, campaignId] : [email];
    await pool.query(`
      UPDATE leads 
      SET 
        is_bounced = 1, 
        next_follow_up_at = NULL,
        status = 'Bounced'
      ${whereClause}
    `, params);
  } catch (error) {
    console.error('[SUPPRESSION] cancelFollowUps error:', error.message);
  }
}

// ── Failure classification ────────────────────────────────────────────────
// Returns one of: HARD_BOUNCE | AUTH_FAILURE | CONNECTION_FAILURE | TEMPORARY | APP_ERROR
function classifyFailure(err) {
  const code    = String(err.code        || '').toUpperCase();
  const resCode = String(err.responseCode || err.statusCode || '').trim();
  const msg     = String(err.response    || err.message    || '').toLowerCase();

  // ── AUTH failures — sender-side, never suppress recipient ──────────────
  if (
    code === 'EAUTH' ||
    resCode === '435' || resCode === '535' ||
    msg.includes('invalid login') ||
    msg.includes('unable to authenticate') ||
    msg.includes('authentication failed') ||
    msg.includes('auth plain failed') ||
    msg.includes('auth login failed') ||
    msg.includes('535 ') ||
    msg.includes('435 ')
  ) return 'AUTH_FAILURE';

  // ── Connection / transport failures — retry, never suppress ───────────
  if (
    code === 'ECONNREFUSED' || code === 'ETIMEDOUT' ||
    code === 'ECONNRESET'   || code === 'ESOCKET'   ||
    code === 'EDNS'         || code === 'ENOTFOUND' ||
    msg.includes('socket closed') ||
    msg.includes('tls') ||
    msg.includes('connection refused') ||
    msg.includes('connection timeout') ||
    msg.includes('dns')
  ) return 'CONNECTION_FAILURE';

  // ── Temporary / rate-limit failures — retry, never suppress ──────────
  if (
    resCode.startsWith('4') ||
    msg.includes('mailbox full') ||
    msg.includes('quota exceeded') ||
    msg.includes('rate limit') ||
    msg.includes('greylist') ||
    msg.includes('too many') ||
    msg.includes('try again') ||
    msg.includes('temporarily') ||
    msg.includes('421 ') || msg.includes('450 ') ||
    msg.includes('451 ') || msg.includes('452 ')
  ) return 'TEMPORARY';

  // ── Hard bounce — recipient permanently rejected ───────────────────────
  const hardBounceIndicators = [
    '550', '551', '552', '553', '554',
    '5.1.0', '5.1.1', '5.1.2', '5.1.3',
    '5.2.0', '5.2.1', '5.2.2', '5.2.3',
    'user unknown', 'user does not exist', "user doesn't exist",
    'no such user', 'mailbox unavailable', 'mailbox not found',
    'recipient does not exist', 'recipient address rejected',
    'recipient rejected', 'invalid recipient',
    'address rejected', 'does not exist',
    'delivery failure', 'permanent error',
  ];
  for (const indicator of hardBounceIndicators) {
    if (msg.includes(indicator) || resCode.includes(indicator)) return 'HARD_BOUNCE';
  }

  // ── Application / internal errors — log only, never suppress ─────────
  return 'APP_ERROR';
}

function isHardBounce(errorMessage, smtpCode) {
  const msg = (errorMessage || '').toLowerCase();
  
  if (smtpCode && String(smtpCode).startsWith('4')) return false;
  if (msg.includes('mailbox full') || msg.includes('quota exceeded') || msg.includes('rate limit') || msg.includes('greylist')) {
    return false;
  }

  const hardBounceIndicators = [
    '550 user unknown',
    '550 mailbox unavailable',
    '551 user not local',
    '553 invalid recipient',
    '554 recipient rejected',
    '554 5.0.0',
    '5.1.1', "user doesn't exist", 'recipient does not exist',
    '5.1.3', 'invalid recipient address',
    'no such user', 'recipient address rejected'
  ];

  for (let indicator of hardBounceIndicators) {
    if (msg.includes(indicator) || (smtpCode && String(smtpCode).includes(indicator))) {
      return true;
    }
  }

  return false;
}

/**
 * Check if an email looks like a bounce notification based on From address
 * and subject patterns used by mailer-daemon / postmaster.
 */
function isBounceNotification(from, subject) {
  const isNoReply = /no-?reply@/i.test(from || '') || /mailer-daemon@/i.test(from || '') || /postmaster@/i.test(from || '');
  if (!isNoReply) return false;
  const bounceSubjects = [
    'delivery status', 'undeliverable', 'failed delivery',
    'mail delivery failed', 'returned mail', 'delivery failure',
    'non-delivery', 'unable to deliver', 'delivery notification',
    'delivery status notification',
  ];
  return bounceSubjects.some(p => (subject || '').toLowerCase().includes(p));
}

/**
 * Extract bounced email addresses from a bounce notification body.
 * Handles DSN (RFC 1894), standard Gmail/Outgoing mailer formats.
 */
function extractBouncedEmails(body) {
  if (!body) return [];
  const emails = new Set();

  // DSN Final-Recipient / Original-Recipient headers embedded in body
  const recipientPatterns = [
    /(?:final-recipient|original-recipient)[:\s]*rfc822;\s*([^\s;]+)/gi,
    /(?:final-recipient|original-recipient)[:\s]*[^;]+;\s*(?:rfc822\s+)?([^\s\r\n]+)/gi,
  ];
  for (const re of recipientPatterns) {
    let m;
    while ((m = re.exec(body)) !== null) {
      const email = m[1].trim().toLowerCase();
      if (email.includes('@') && email.includes('.')) emails.add(email);
    }
  }

  // Common text patterns in bounce bodies
  const textPatterns = [
    /delivery\s+(?:to\s+)?(?:the\s+)?following\s+recipient\s+failed[:\s]*\s*([^\s\r\n]+)/gi,
    /could\s+not\s+(?:be\s+)?delivered\s+to\s+([^\s\r\n]+)/gi,
    /(?:delivery|message)\s+(?:to\s+)?([^\s\r\n]+)\s+(?:has\s+)?failed/gi,
    /problem[s]?\s+(?:delivering|sending)\s+(?:to|message\s+to)\s+([^\s\r\n]+)/gi,
    /address\s+([^\s\r\n]+)\s+(?:is\s+)?(?:rejected|invalid|does\s+not\s+exist)/gi,
    /recipient\s+([^\s\r\n]+)\s+(?:was\s+)?rejected/gi,
  ];
  for (const re of textPatterns) {
    let m;
    while ((m = re.exec(body)) !== null) {
      const raw = m[1].replace(/[<>\[\]()"']/g, '').trim();
      if (raw.includes('@') && raw.includes('.')) emails.add(raw.toLowerCase());
    }
  }

  // Exim / generic MTA format: <email@domain>: host ... said: ...
  const eximPattern = /<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>:\s*(?:host|\([^)]*\))/gi;
  let m;
  while ((m = eximPattern.exec(body)) !== null) {
    emails.add(m[1].toLowerCase());
  }

  // Exim / generic MTA format: "The following address(es) failed:" then indented email on next line(s)
  const addressFailedHeader = /the\s+following\s+address(?:es)?\s+failed:?\s*$/gim;
  let headerMatch;
  while ((headerMatch = addressFailedHeader.exec(body)) !== null) {
    const after = body.slice(headerMatch.index + headerMatch[0].length);
    const lines = after.split('\n').slice(0, 10);
    for (const line of lines) {
      const trimmed = line.trim().replace(/[<>\[\]()"']/g, '').trim();
      if (trimmed.includes('@') && trimmed.includes('.')) {
        emails.add(trimmed.toLowerCase());
      } else if (!trimmed) {
        break; // empty line ends the list
      }
    }
  }

  // Catch-all: any <email> pattern on its own line followed by an error indicator
  const angleBracketEmail = /<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>/gi;
  while ((m = angleBracketEmail.exec(body)) !== null) {
    emails.add(m[1].toLowerCase());
  }

  // Exchange/Outlook DSN: "Delivery has failed to these recipients or groups:" then email on next line(s)
  const exchangeFailedHeader = /delivery\s+(?:has\s+)?failed\s+to\s+(?:these\s+)?(?:recipients?\s+or\s+groups?):?\s*$/gim;
  while ((headerMatch = exchangeFailedHeader.exec(body)) !== null) {
    const after = body.slice(headerMatch.index + headerMatch[0].length);
    const lines = after.split('\n').slice(0, 15);
    let foundEmail = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) { if (foundEmail) break; continue; }
      if (trimmed.includes('@') && trimmed.includes('.')) {
        emails.add(trimmed.toLowerCase());
        foundEmail = true;
      } else if (foundEmail) {
        break;
      }
    }
  }

  // Exchange/Outlook DSN: "Diagnostic information for administrators:" section has email on own line
  const diagHeader = /diagnostic\s+information\s+for\s+administrators?:?\s*$/gim;
  while ((headerMatch = diagHeader.exec(body)) !== null) {
    const after = body.slice(headerMatch.index + headerMatch[0].length);
    const endIdx = after.toLowerCase().indexOf('original message headers');
    const section = endIdx !== -1 ? after.slice(0, endIdx) : after;
    const lines = section.split('\n').slice(0, 20);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      // Line must be a standalone email (contains @ and . but is not a server name or header)
      if (trimmed.includes('@') && trimmed.includes('.') && !trimmed.startsWith('Generating server') && !trimmed.startsWith('Remote server')) {
        const email = trimmed.replace(/[<>\[\]()"']/g, '').trim();
        if (email.includes('@') && email.includes('.')) emails.add(email.toLowerCase());
      }
    }
  }

  return [...emails];
}

/**
 * Handle a bounce notification email: extract bounced addresses from the
 * notification body and record each as a suppression.
 */
async function handleBounceNotification(from, subject, bodyText) {
  if (!isBounceNotification(from, subject)) return [];
  console.log(`[BOUNCE_NOTIFICATION] Processing from=${from} subject="${subject}"`);
  const bouncedEmails = extractBouncedEmails(bodyText || '');
  if (bouncedEmails.length === 0) {
    console.log('[BOUNCE_NOTIFICATION] No bounced addresses found in body');
    return [];
  }
  console.log(`[BOUNCE_NOTIFICATION] Extracted: ${bouncedEmails.join(', ')}`);
  for (const email of bouncedEmails) {
    await recordSuppression(email, {
      reason: 'Delivery Failure',
      bounceType: 'Hard Bounce',
      smtpCode: '',
      failureReason: `Bounce notification from ${from}`,
      campaignId: null,
      senderAccount: from,
    }).catch(e => console.error('[BOUNCE_NOTIFICATION] recordSuppression error:', e.message));
  }
  return bouncedEmails;
}

module.exports = {
  checkSuppression,
  recordSuppression,
  incrementSkipCount,
  revalidateEmail,
  classifyFailure,
  isHardBounce,
  isBounceNotification,
  extractBouncedEmails,
  handleBounceNotification,
};
