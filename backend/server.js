const express = require('express');
const cors = require('cors');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cron = require('node-cron');
const pool = require('./db');
require('dotenv').config();
const { getActiveSenders, resetAllLimits, getNextSender, getSenderStats, getGlobalStats } = require('./services/senderService');
const { startWorker, triggerQueue } = require('./services/queueWorker');

const { checkReplies } = require('./services/replyService');
const { runFollowUpScheduler, markAsReplied, markAsBounced } = require('./services/followUp.service');
const {
  runAutomatedFollowUpScheduler,
  handleReplyDetected,
  handleUnsubscribe,
  handleBounce,
  pauseFollowUp,
  resumeFollowUp,
  getFollowUpAnalytics,
  getLeadFollowUpTimeline,
  getSchedulePreview,
  getNextFollowUpInfo,
  isInSuppressionList,
} = require('./services/automatedFollowUp.service');

console.log('[AUTO FOLLOWUP] imported:', typeof runAutomatedFollowUpScheduler);

// Start the background email worker
startWorker();

// Background Reply Detection (Every 60 seconds)
cron.schedule('* * * * *', async () => {
  try {
    await checkReplies();
  } catch (err) {
    console.error('[CRON] Reply check failed:', err.message);
  }
});

// Midnight reset logic
cron.schedule('0 0 * * *', async () => {
  console.log('[CRON] Midnight Reset Running');
  try {
    await resetAllLimits();
    console.log('[CRON] Midnight Reset Successful');
  } catch (err) {
    console.error('[CRON] Midnight reset failed:', err.message);
  }
});

// Domain warm-up daily reset (runs at 00:01 to let midnight reset finish first)
const { resetDailyCounters } = require('./services/domainWarmup.service');
const { resetSenderCounts } = require('./services/senderPool.service');
const { resetDailyDomainStats, getAllDomainStats } = require('./services/eventTracker.service');
cron.schedule('1 0 * * *', async () => {
  try {
    await Promise.all([resetDailyCounters(), resetSenderCounts(), resetDailyDomainStats()]);
  } catch (err) {
    console.error('[CRON] Domain warmup/pool reset failed:', err.message);
  }
});

process.on('unhandledRejection', err => {
  console.error('UNHANDLED PROMISE:', err)
})

process.on('uncaughtException', err => {
  console.error('UNCAUGHT ERROR:', err)
})

let isSending = false;

// Also load the root project's .env so Gmail credentials exist for Nodemailer.
function findPythonProjectDir() {
  if (process.env.PYTHON_PROJECT_DIR) return process.env.PYTHON_PROJECT_DIR;

  let current = __dirname;
  while (current && current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, 'gmail_oauth.py'))) {
      return current;
    }
    current = path.dirname(current);
  }

  return path.resolve(__dirname, '../../../../../..');
}

const pythonProjectDir = findPythonProjectDir();
require('dotenv').config({ path: path.join(pythonProjectDir, '.env'), override: false });
const { getOAuth2Client, getGmailService, verifyGmailAuth } = require('./config/gmail');
const { sendEmail, ensureEmailEventsTable } = require('./services/emailService');
const { isValidEmail, normalizeRow, parseCSV, parseExcel } = require('./utils/fileParser');
const { escapeHtml, escapeRegExp, stripHtml } = require('./utils/stringHelpers');
const {
  renderTemplate, renderFollowupTemplate, renderFollowupSubject,
  renderSubject, replaceTemplateVars, normalizeImageUrls, usePreviewSafeImages,
  TEMPLATE_PATH, FOLLOWUP_TEMPLATE_PATH, AGENT_NAME, TEST_SEND_LIMIT,
} = require('./utils/templateRenderer');
const { extractImageUrls, checkImageUrl, validateTemplateImages } = require('./utils/imageValidator');
const { delay, withTimeout, nextSendDelayMs, createTrackingId, getTrackingBaseUrl, appendOpenTrackingPixel } = require('./utils/misc');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/email-assets', express.static(path.join(__dirname, 'assets', 'email')));

// GET /api/health - Simple health check
app.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    timestamp: Date.now()
  });
});

// ─── OAuth Routes ───────────────────────────────────────────────────────────

// GET /auth/google/connect/:email — Start OAuth flow
app.get('/auth/google/connect/:email', async (req, res) => {
  const email = req.params.email;
  console.log("[OAuth] Initiation request for:", email);

  if (!email) {
    console.error("[OAuth] Missing email in connect request");
    return res.status(400).send('Email required');
  }

  try {
    const oauth2Client = getOAuth2Client();
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: true,
      scope: (process.env.GMAIL_SCOPES || '').split(' '),
      state: email
    });

    console.log(`[OAuth] Redirecting to Google Auth for ${email}. AuthURL: ${authUrl}`);
    res.redirect(authUrl);
  } catch (err) {
    console.error('[OAuth] Initiation error:', err);
    res.status(500).json({ success: false, message: 'OAuth initiation failed: ' + err.message });
  }
});

// GET /auth/google/callback — OAuth Callback
app.get('/auth/google/callback', async (req, res) => {
  console.log('[OAuth Callback] Received request. Params:', req.query);

  const { code, state: email } = req.query;

  if (!code || !email) {
    console.error('[OAuth Callback] Invalid params: Missing code or state (email)');
    return res.redirect('http://localhost:5173/dashboards/send-emails?error=invalid_callback');
  }

  try {
    const oauth2Client = getOAuth2Client();
    console.log(`[OAuth Callback] Exchanging code for tokens for: ${email}`);
    const { tokens } = await oauth2Client.getToken(code);

    console.log('[OAuth Callback] Token response received. Refresh token present:', !!tokens.refresh_token);

    if (!tokens.refresh_token) {
      console.error('[OAuth Callback] Refresh token missing from Google response.');
      return res.redirect('http://localhost:5173/dashboards/send-emails?error=no_refresh_token');
    }

    console.log(`[OAuth Callback] Saving tokens to DB for ${email}`);
    const dbResult = await pool.query(
      `INSERT INTO sender_accounts (email, refresh_token, is_connected, updated_at)
       VALUES (?, ?, 1, NOW())
       ON DUPLICATE KEY UPDATE
         refresh_token = VALUES(refresh_token),
         is_connected = 1,
         updated_at = NOW()`,
      [email, tokens.refresh_token]
    );

    console.log('[OAuth Callback] DB Update successful. Row count:', dbResult.rowCount);
    res.redirect('http://localhost:5173/dashboards/send-emails?success=connected');

  } catch (err) {
    console.error('[OAuth Callback] Exception occurred:', err.message);
    res.redirect(`http://localhost:5173/dashboards/send-emails?error=${encodeURIComponent(err.message)}`);
  }
});

app.use(require('./routes/tracking.routes'));

// Multer — store upload in memory (max 5MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.csv', '.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error('Only CSV and Excel files allowed'));
  },
});



// ─── Routes ─────────────────────────────────────────────────────────────────

// Ensure required analytics table exists on startup
ensureEmailEventsTable().catch((err) => {
  console.error("❌ Failed to ensure email_events table:", err.message);
});



// ─── Sender routes handled by senderController below ───────────────────────

// ─── Tracking Routes ────────────────────────────────────────────────────────
// (moved to routes/tracking.routes.js, mounted via app.use() above)

app.use(require('./routes/analytics.routes'));

// GET /api/dashboard/automation - Daily automation metrics
const DashboardController = require('./controllers/dashboard.controller');
app.get('/api/dashboard/automation', DashboardController.getAutomation);

// GET /api/activity/recent - Recent outreach activity
const activityController = require('./controllers/activity.controller');
app.get('/api/activity/recent', activityController.getRecentActivity);

const campaignsController = require('./controllers/campaigns.controller');
app.get('/api/campaigns/top', campaignsController.getTopCampaign);
app.get('/api/campaigns', campaignsController.getCampaigns);
app.post('/api/campaigns/:campaignId/followup/send-now', campaignsController.sendFollowUpNow);

const senderController = require('./controllers/sender.controller');
app.get('/api/senders', senderController.getSenders);
app.get('/api/senders/stats', senderController.getSenderStats);
app.post('/api/senders', senderController.addSender);
app.delete('/api/senders/:email', senderController.deleteSender);

// GET /api/domains/stats — all domain reputation stats
app.get('/api/domains/stats', async (req, res) => {
  try {
    const stats = await getAllDomainStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error('❌ /api/domains/stats ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/domains/events?domain=...&limit=50 — raw event log per domain
app.get('/api/domains/events', async (req, res) => {
  try {
    const domain = (req.query.domain || '').trim();
    const limit  = Math.min(parseInt(req.query.limit) || 50, 200);
    const { rows } = domain
      ? await pool.query(`SELECT * FROM domain_events WHERE domain = ? ORDER BY created_at DESC LIMIT ?`, [domain, limit])
      : await pool.query(`SELECT * FROM domain_events ORDER BY created_at DESC LIMIT ?`, [limit]);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('❌ /api/domains/events ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/domains/report-spam — manually flag a spam report for a domain
app.post('/api/domains/report-spam', async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: 'domain required' });
    const { trackEvent } = require('./services/eventTracker.service');
    await trackEvent({ domain, type: 'spam' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (analytics routes moved to routes/analytics.routes.js)

// (dashboard routes moved to routes/dashboard.routes.js)
app.use(require('./routes/dashboard.routes'));

// GET /api/leads — Enriched leads with campaign info
app.get('/api/leads', async (req, res) => {
  try {
    const campaignId = req.query.campaignId ? parseInt(req.query.campaignId, 10) : null;
    if (req.query.campaignId && isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaignId' });
    }

    let query = `
      SELECT
        l.email AS id,
        l.name,
        l.email,
        l.company,
        l.status,
        l.follow_up_count,
        l.has_replied,
        l.last_activity_at,
        l.created_at,
        l.reply_detected_at,
        l.sender_email AS lead_sender_email,
        c.id AS campaign_id,
        c.name AS campaign_name,
        COALESCE(c.sender_email, l.sender_email) AS sender_email,
        c.subject
      FROM leads l
      LEFT JOIN campaigns c ON l.campaign_id = c.id
    `;
    const params = [];
    if (campaignId) {
      query += ` WHERE l.campaign_id = ?`;
      params.push(campaignId);
    }
    query += ` ORDER BY l.last_activity_at IS NULL, l.last_activity_at DESC`;

    const { rows } = await pool.query(query, params);
    console.log(`[API] /api/leads campaignId=${campaignId ?? 'all'} → ${rows.length} rows`);
    res.json(rows);
  } catch (err) {
    console.error('❌ /api/leads ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// (dashboard/stats and /api/dashboard moved to routes/dashboard.routes.js)

// GET /api/recent-activity
// Returns recent outreach activity backed by PostgreSQL tables:
// - email_events (tracking/open/click/replied)
// - email_logs   (subject/provider)
// Shape is compatible with frontend `fetchRecentActivity()` normalizer.
app.get('/api/recent-activity', async (req, res) => {
  try {
    await ensureEmailEventsTable();

    const { rows } = await pool.query(
      `
        SELECT
          e.recipient_email AS email,
          COALESCE(NULLIF(l.subject, ''), e.email_type) AS subject,
          COALESCE(NULLIF(l.provider, ''), 'gmail') AS provider,
          e.email_type,
          e.replied,
          e.sent_at AS created_at,
          e.sender_email
        FROM email_events e
        LEFT JOIN email_logs l
          ON l.tracking_id = e.tracking_id
        ORDER BY e.sent_at DESC
        LIMIT 10
      `
    );

    const data = rows.map((r) => ({
      email: r.email,
      subject: r.subject,
      provider: r.provider,
      sender_email: r.sender_email,
      status: r.replied
        ? 'replied'
        : String(r.email_type || '').toLowerCase().startsWith('follow_up')
          ? 'followup'
          : 'sent',
      created_at: r.created_at,
    }));

    res.json({ data });
  } catch (err) {
    console.error('❌ /api/recent-activity ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// (dashboard/recent-activity moved to routes/dashboard.routes.js)

// GET /api/template-preview
app.get('/api/template-preview', async (req, res) => {
  try {
    const { id } = req.query;
    let lead;

    if (id) {
      const { rows } = await pool.query(`SELECT * FROM leads WHERE email = ?`, [id]);
      lead = rows[0];
    } else {
      // Latest pending lead, fallback to any lead
      const { rows } = await pool.query(`
        SELECT * FROM leads
        ORDER BY CASE WHEN status = 'Pending' THEN 0 ELSE 1 END, email
        LIMIT 1
      `);
      lead = rows[0];
    }

    if (!lead) {
      return res.send('<p style="font-family:sans-serif;padding:20px;color:#666">No leads available for preview. Upload a sheet first.</p>');
    }

    const html = usePreviewSafeImages(renderTemplate(lead));
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<p style="color:red">${err.message}</p>`);
  }
});

// GET /api/sender-stats
app.get('/api/sender-stats', async (req, res) => {
  try {
    const senders = await getSenderStats();
    const global = await getGlobalStats();
    res.json({ success: true, senders, global });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/leads/pending
app.get('/api/leads/pending', async (req, res) => {
  try {
    const { campaignId } = req.query;
    let query = `SELECT email, name, company FROM leads WHERE status = 'Pending'`;
    const params = [];
    if (campaignId) {
      query += ` AND campaign_id = ?`;
      params.push(campaignId);
    }
    const { rows } = await pool.query(query, params);
    console.log('Pending leads:', rows.length, campaignId ? `(campaign ${campaignId})` : '(global)');
    res.json({ count: rows.length, leads: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/upload-leads
app.post('/api/upload-leads', upload.single('file'), async (req, res) => {
  const client = await pool.connect();
  try {
    const { campaignName, senderEmail, subject, campaignId: requestedCampaignId } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (!campaignName) return res.status(400).json({ error: 'Campaign Name is required' });
    if (!subject) return res.status(400).json({ error: 'Subject is required' });

    // Step 1: Parse first to avoid empty campaigns
    const ext = path.extname(req.file.originalname).toLowerCase();
    let rows;
    try {
      rows = ext === '.csv'
        ? await parseCSV(req.file.buffer)
        : parseExcel(req.file.buffer);
    } catch (parseErr) {
      console.error('Parse error:', parseErr.message);
      return res.status(400).json({ error: `Failed to parse file: ${parseErr.message}` });
    }

    // Step 2: Validate + deduplicate within file
    const seen = new Set();
    const valid = [];
    const skipped = [];

    for (const row of rows) {
      if (!isValidEmail(row.email)) { skipped.push(row.email || '(empty)'); continue; }
      if (seen.has(row.email.toLowerCase())) continue;
      seen.add(row.email.toLowerCase());
      valid.push(row);
    }

    if (valid.length === 0) {
      return res.status(400).json({ error: 'No valid leads found in the uploaded file.' });
    }

    await client.query('BEGIN');

    // Step 3: Resolve campaign — explicit ID takes priority over name lookup
    const finalSenderEmail = senderEmail || null;
    let campaignId;

    if (requestedCampaignId) {
      // Use the campaign ID the frontend already knows about — skip name lookup entirely
      const { rows: byId } = await client.query(`SELECT id FROM campaigns WHERE id = ?`, [parseInt(requestedCampaignId, 10)]);
      if (byId.length > 0) {
        campaignId = byId[0].id;
        await client.query(
          `UPDATE campaigns SET status = 'Running', sender_email = COALESCE(?, sender_email), subject = ? WHERE id = ?`,
          [finalSenderEmail, subject, campaignId]
        );
        console.log(`[UPLOAD] Using explicit campaignId=${campaignId} from request`);
      }
    }

    if (!campaignId) {
      // Fallback: look up by name (first upload path)
      const existingCampaign = await client.query(
        `SELECT id FROM campaigns WHERE name = ? ORDER BY id DESC LIMIT 1`,
        [campaignName]
      );
      if (existingCampaign.rows.length > 0) {
        campaignId = existingCampaign.rows[0].id;
        await client.query(
          `UPDATE campaigns SET status = 'Running', sender_email = COALESCE(?, sender_email), subject = ? WHERE id = ?`,
          [finalSenderEmail, subject, campaignId]
        );
      } else {
        await client.query(
          `INSERT INTO campaigns (name, created_at, status, sender_email, subject)
           VALUES (?, NOW(), 'Running', ?, ?)`,
          [campaignName, finalSenderEmail, subject]
        );
        const { rows: lastIdRows } = await client.query(`SELECT LAST_INSERT_ID() AS insertId`);
        campaignId = lastIdRows[0]?.insertId;
        if (!campaignId) {
          const { rows: newCamp } = await client.query(
            `SELECT id FROM campaigns WHERE name = ? ORDER BY id DESC LIMIT 1`,
            [campaignName]
          );
          campaignId = newCamp[0]?.id;
        }
        if (!campaignId) throw new Error(`Failed to determine campaign ID for "${campaignName}"`);
      }
    }

    // Step 4: Batch Insert Leads — always attach to this campaign (inside transaction)
    if (!campaignId) throw new Error('campaign_id is null — cannot insert leads');
    console.log(`[UPLOAD] Campaign ID: ${campaignId} | Leads to insert: ${valid.length}`);
    const batch = valid.slice(0, 1000);
    let inserted = 0;
    for (const lead of batch) {
      await client.query(
        `INSERT INTO leads (email, name, company, campaign_id, status, last_activity_at, created_at, follow_up_count, message_id, initial_message_id, last_subject, inquiry_id, reply_detected_at)
         VALUES (?, ?, ?, ?, 'Pending', NOW(), NOW(), 0, '', '', '', '', '')
         ON DUPLICATE KEY UPDATE
           name               = VALUES(name),
           company            = VALUES(company),
           campaign_id        = VALUES(campaign_id),
           status             = 'Pending',
           last_activity_at   = NOW(),
           follow_up_count    = 0,
           message_id         = '',
           initial_message_id = '',
           last_subject       = '',
           reply_detected_at  = ''`,
        [lead.email, lead.name || '', lead.company || '', campaignId]
      );
      inserted++;
    }
    console.log(`[UPLOAD] Leads inserted: ${inserted} | campaign_id: ${campaignId}`);

    // Step 5: Update campaign counts
    await client.query(
      `UPDATE campaigns SET total_leads = ?, pending_count = ? WHERE id = ?`,
      [inserted, inserted, campaignId]
    );

    await client.query('COMMIT');

    res.json({
      total: rows.length,
      valid: valid.length,
      inserted,
      skipped: skipped.length,
      campaignId,
      message: `${inserted} lead(s) set as Pending. Campaign "${campaignName}" created successfully.`,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Upload error:', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// POST /send-emails — accepts CSV/Excel, sends, stores in DB
app.post('/send-emails', upload.single('file'), async (req, res) => {
  try {
    if (isSending) {
      return res.status(429).json({ success: false, message: 'A sending operation is already in progress. Please wait.' });
    }
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const ext = path.extname(req.file.originalname).toLowerCase();
    let rows;
    try {
      rows = ext === '.csv'
        ? await parseCSV(req.file.buffer)
        : parseExcel(req.file.buffer);
    } catch (parseErr) {
      console.error('Parse error:', parseErr.message);
      return res.status(400).json({ error: `Failed to parse file: ${parseErr.message}` });
    }

    const seen = new Set();
    const leads = [];
    for (const row of rows) {
      if (!isValidEmail(row.email)) continue;
      const key = row.email.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      leads.push(row);
    }

    if (leads.length === 0) {
      return res.json({ success: true, sent: 0, message: 'No valid rows found.' });
    }

    let sent = 0;
    try {
      for (const lead of leads) {
        try {
          const subject = renderSubject(lead, req.body.subject);
          const html = renderTemplate(lead);

          await pool.query(
            `INSERT INTO email_queue (lead_email, subject, html_body, status, campaign_id)
             VALUES (?, ?, ?, 'pending', ?)`,
            [lead.email, subject, html, req.body.campaignId || lead.campaign_id || null]
          );

          sent++;
        } catch (err) {
          console.error("FAILED to queue for:", lead.email, "Error:", err.message);
        }
      }
      console.log(`[QUEUE] Added ${sent} leads to queue.`);
    } catch (fatal) {
      console.error("QUEUE LOOP CRASHED:", fatal);
    }

    return res.json({
      success: true,
      sent,
      message: `${sent} email(s) added to queue for processing.`
    });
  } catch (err) {
    console.error('Send-emails failed:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/send-bulk-initial - sends pending initial emails through Gmail or domain SMTP
app.post('/api/send-bulk-initial', async (req, res) => {
  console.log("[SEND] Campaign started");
  console.log("REQ BODY:", req.body);
  try {
    const { campaignName, subject, senderEmail, sendingMode, domainAccounts, gmailAccounts, templateHtml, campaignId: incomingCampaignId } = req.body;

    if (!campaignName) return res.status(400).json({ success: false, message: 'Campaign Name is required' });
    if (!subject) return res.status(400).json({ success: false, message: 'Subject is required' });

    const sendingType = sendingMode === 'gmail' ? 'gmail' : 'domain';

    if (sendingType === 'domain') {
      if (!Array.isArray(domainAccounts) || domainAccounts.length === 0) {
        return res.status(400).json({ success: false, message: 'domainAccounts[] is required for domain sending mode' });
      }
    }

    if (sendingType === 'gmail' && (!Array.isArray(gmailAccounts) || gmailAccounts.length === 0)) {
      return res.status(400).json({ success: false, message: 'Gmail accounts are required for Gmail sending mode' });
    }

    const fixedSender = sendingType === 'domain'
      ? (senderEmail || null)
      : null;

    console.log('[SEND] fixedSender:', fixedSender, '| campaignId:', incomingCampaignId);

    // Ensure queue columns exist
    await pool.query(`ALTER TABLE email_queue ADD COLUMN sending_mode VARCHAR(50) DEFAULT 'domain'`).catch(() => {});
    await pool.query(`ALTER TABLE email_queue ADD COLUMN sender_email TEXT DEFAULT NULL`).catch(() => {});
    await pool.query(`ALTER TABLE campaigns ADD COLUMN domain_accounts JSON`).catch(() => {});

    // Ensure campaign columns exist BEFORE using them
    await pool.query(`ALTER TABLE campaigns ADD COLUMN template_html TEXT`).catch(() => {});
    await pool.query(`ALTER TABLE campaigns ADD COLUMN sending_type VARCHAR(50) DEFAULT 'domain'`).catch(() => {});
    await pool.query(`ALTER TABLE campaigns ADD COLUMN gmail_accounts JSON`).catch(() => {});

    let campaignId;

    // Use campaignId from upload if provided — avoids name-lookup mismatch
    if (incomingCampaignId) {
      campaignId = incomingCampaignId;
      await pool.query(
        `UPDATE campaigns SET subject = ?, status = 'Running', sending_type = ?, gmail_accounts = ?, sender_email = ?, template_html = ?, domain_accounts = ? WHERE id = ?`,
        [subject, sendingType, sendingType === 'gmail' ? JSON.stringify(gmailAccounts) : null, fixedSender, templateHtml || null, sendingType === 'domain' ? JSON.stringify(domainAccounts) : null, campaignId]
      );
    } else {
      const campaignCheck = await pool.query('SELECT id FROM campaigns WHERE name = ?', [campaignName]);
      if (campaignCheck.rows.length > 0) {
        campaignId = campaignCheck.rows[0].id;
        await pool.query(
          `UPDATE campaigns SET subject = ?, status = 'Running', sending_type = ?, gmail_accounts = ?, sender_email = ?, template_html = ?, domain_accounts = ? WHERE id = ?`,
          [subject, sendingType, sendingType === 'gmail' ? JSON.stringify(gmailAccounts) : null, fixedSender, templateHtml || null, sendingType === 'domain' ? JSON.stringify(domainAccounts) : null, campaignId]
        );
      } else {
        await pool.query(
          `INSERT INTO campaigns (name, subject, status, sending_type, gmail_accounts, sender_email, template_html, domain_accounts)
           VALUES (?, ?, 'Running', ?, ?, ?, ?, ?)`,
          [campaignName, subject, sendingType, sendingType === 'gmail' ? JSON.stringify(gmailAccounts) : null, fixedSender, templateHtml || null, sendingType === 'domain' ? JSON.stringify(domainAccounts) : null]
        );
        const { rows: lastIdRows } = await pool.query(`SELECT LAST_INSERT_ID() AS insertId`);
        campaignId = lastIdRows[0]?.insertId;
        if (!campaignId) {
          const { rows: newCamp } = await pool.query(
            `SELECT id FROM campaigns WHERE name = ? ORDER BY id DESC LIMIT 1`,
            [campaignName]
          );
          campaignId = newCamp[0]?.id;
        }
      }
    }

    console.log(`[SEND] Campaign ${campaignId} | sending_type=${sendingType} | sender=${sendingType === 'gmail' ? JSON.stringify(gmailAccounts) : JSON.stringify(domainAccounts)}`);
    console.log('SAVED SUBJECT:', subject);

    // Ensure queue columns exist
    await pool.query(`ALTER TABLE email_queue ADD COLUMN sending_mode VARCHAR(50) DEFAULT 'domain'`).catch(() => {});
    await pool.query(`ALTER TABLE email_queue ADD COLUMN sender_email TEXT DEFAULT NULL`).catch(() => {});
    await pool.query(`ALTER TABLE campaigns ADD COLUMN domain_accounts JSON`).catch(() => {});

    const { rows: pending } = await pool.query(`
      SELECT l.email, l.name, l.company, l.inquiry_id, l.campaign_id, c.subject as campaign_subject
      FROM leads l
      JOIN campaigns c ON l.campaign_id = c.id
      WHERE l.status = 'Pending' AND l.campaign_id = ?
      LIMIT ${TEST_SEND_LIMIT}
    `, [campaignId]);

    if (pending.length === 0) {
      console.error('NO LEADS FOUND FOR CAMPAIGN', campaignId);
      return res.status(200).json({ success: false, sent: 0, message: 'No pending leads found for this campaign. Upload a CSV first.' });
    }

    let sent = 0;
    console.log("TOTAL LEADS:", pending.length);

    // Round-robin index for domain accounts
    let domainRRIndex = 0;

    try {
      for (const lead of pending) {
        try {
          const finalSubject = subject || lead.campaign_subject;
          if (!finalSubject) throw new Error('Subject is required');
          const baseHtml = templateHtml || renderTemplate(lead);

          // Round-robin sender selection for domain mode
          let jobSender = null; // domain mode: worker resolves from campaign.domain_accounts
          if (sendingType === 'gmail') {
            jobSender = null; // worker picks from campaign.gmail_accounts
          }

          console.log("QUEUE ADD:", campaignId, lead.email);
          await pool.query(
            `INSERT INTO email_queue (lead_email, campaign_id, subject, html_body, status, sending_mode, sender_email)
             VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
            [lead.email, campaignId, finalSubject, baseHtml, sendingType, jobSender]
          );
          sent++;
        } catch (err) {
          console.error("QUEUE FAILED:", lead.email, err.message);
        }
      }
      console.log(`[QUEUE] Added ${sent} leads to queue.`);
      console.log('LEADS INSERTED:', sent);
    } catch (fatal) {
      console.error("LOOP CRASHED:", fatal);
    } finally {
      isSending = false;
    }

    const pendingCountRes = await pool.query(
      `SELECT COUNT(*) as cnt FROM leads WHERE status = 'Pending' AND campaign_id = ?`,
      [campaignId]
    );
    console.log('FINAL PENDING FOR CAMPAIGN', campaignId, ':', pendingCountRes.rows[0].cnt);

    return res.status(200).json({
      success: true,
      sent,
      message: `${sent} email(s) queued for campaign.`
    });
  } catch (err) {
    console.error('SEND ERROR:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

// POST /api/send-initial-email — single lead queue
app.post('/api/send-initial-email', async (req, res) => {
  try {
    const { email, name, company } = req.body;
    if (!email || !name) return res.status(400).json({ error: 'email and name are required' });

    // Backward-compatible migration (for existing databases).
    await pool.query(`ALTER TABLE leads ADD COLUMN email_provider TEXT DEFAULT 'gmail'`).catch(() => {});

    await pool.query(
      `INSERT INTO leads (email, name, company, status, email_provider)
       VALUES (?, ?, ?, 'Pending', ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         company = VALUES(company),
         status = CASE WHEN status = 'Replied' THEN status ELSE 'Pending' END,
         email_provider = VALUES(email_provider)`,
      [email, name, company || '', 'gmail']
    );

    res.json({ success: true, message: `Lead ${email} queued as Pending.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/test-email — send test to yourself to check spam vs inbox
app.post('/api/test-email', async (req, res) => {
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
});

// POST /api/smtp-diagnostic — raw SMTP test bypassing all application logic
// Use this to verify the SMTP server is actually delivering mail
app.post('/api/smtp-diagnostic', async (req, res) => {
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
});

// GET /test-gmail — verify Gmail Nodemailer connection/settings
app.get('/test-gmail', async (req, res) => {
  try {
    await verifyGmailAuth();
    res.json({ success: true, message: 'Gmail connection verified.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// (email-analytics routes moved to routes/analytics.routes.js)

app.get('/api/campaigns', campaignsController.getCampaigns);

// (campaign status/:id/:id/leads routes moved to routes/campaigns.routes.js)
app.use(require('./routes/campaigns.routes'));

// ─── Reply detection engine ─────────────────────────────────────────────────

async function runReplyCheck() {
  console.log('[REPLY] Running reply check at', new Date().toISOString());

  const projectDir = pythonProjectDir;
  const pythonBin = process.env.PYTHON_BIN || `${projectDir}\\.venv\\Scripts\\python.exe`;

  return new Promise((resolve, reject) => {
    execFile(
      pythonBin,
      ['main.py', 'run', '--limit', '0'],   // limit=0 → skip sending, only reply-check pass runs
      { cwd: projectDir, timeout: 60000 },
      (err, stdout, stderr) => {
        if (stdout) console.log('[REPLY] Python stdout:', stdout.trim());
        if (stderr) console.error('[REPLY] Python stderr:', stderr.trim());
        if (err) return reject(new Error(stderr || err.message));
        resolve(stdout);
      }
    );
  });
}

async function syncRepliedFlagsFromLeads() {
  try {
    await ensureEmailEventsTable();
    await pool.query(`
      UPDATE email_events e
      JOIN leads l ON l.email = e.recipient_email
      SET e.replied = 1,
          e.status = 'replied'
      WHERE l.reply_detected_at IS NOT NULL
        AND l.reply_detected_at != ''
    `);
  } catch (err) {
    console.error('[REPLY] Failed syncing replied flags:', err.message);
  }
}

// Run reply check every 5 minutes (DISABLED due to missing Python OAuth JSON)
// cron.schedule('*/5 * * * *', async () => {
//   try { await runReplyCheck(); await syncRepliedFlagsFromLeads(); }
//   catch (err) { console.error('[REPLY] Cron error:', err.message); }
// });

// POST /api/replies/check — manual trigger (Python path)
app.post('/api/replies/check', async (req, res) => {
  try {
    await runReplyCheck();
    await syncRepliedFlagsFromLeads();
    const { rows } = await pool.query(`
      SELECT COUNT(*) AS count FROM leads
      WHERE reply_detected_at IS NOT NULL AND reply_detected_at != ''
    `);
    res.json({ success: true, total_replied: parseInt(rows[0].count) });
  } catch (err) {
    console.error('[REPLY] Manual trigger error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/replies/sync — manual trigger for Gmail thread-based reply detection
app.post('/api/replies/sync', async (req, res) => {
  try {
    console.log('[REPLY_SCAN_START] Manual sync triggered');
    await checkReplies();
    await syncRepliedFlagsFromLeads();
    const { rows } = await pool.query(`
      SELECT
        COUNT(*) AS total_replied,
        (SELECT COUNT(*) FROM email_logs WHERE status IN ('sent','success')) AS total_sent
      FROM leads WHERE has_replied = 1
    `);
    const total_replied = parseInt(rows[0]?.total_replied) || 0;
    const total_sent    = parseInt(rows[0]?.total_sent)    || 0;
    const reply_rate    = total_sent > 0 ? parseFloat((total_replied / total_sent * 100).toFixed(1)) : 0;
    console.log(`[DASHBOARD_REFRESH] sync done replied=${total_replied} sent=${total_sent} rate=${reply_rate}%`);
    res.json({ success: true, total_replied, total_sent, reply_rate });
  } catch (err) {
    console.error('[REPLY] /api/replies/sync error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Follow-up engine ───────────────────────────────────────────────────────
// Delegated to services/automatedFollowUp.service.js
// Schedule: Day 1/3/7/11/15/20/25 (7 stages, stops Day 30)

// Run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  console.log('[AUTO FOLLOWUP] CRON FIRED');
  try {
    await runAutomatedFollowUpScheduler();
  } catch (err) {
    console.error('[FOLLOWUP] Cron error:', err.message);
  }
});

// POST /api/queue/trigger — force-reset isProcessing and kick the worker immediately
app.post('/api/queue/trigger', (req, res) => {
  triggerQueue();
  res.json({ success: true, message: 'Queue worker triggered. Check server logs.' });
});

// POST /api/warmup/reset — manually run the midnight warmup+sender reset without waiting for cron.
// Useful when the server was restarted after 00:01 and counters were not cleared.
// Accepts optional body { domain: 'viralkar.in' } to reset a single domain only.
app.post('/api/warmup/reset', async (req, res) => {
  try {
    const { domain } = req.body || {};
    if (domain) {
      await pool.query(`UPDATE domain_warmup SET current_sent = 0 WHERE domain = ?`, [domain]);
      await pool.query(`UPDATE sender_accounts SET daily_sent_count = 0 WHERE LOWER(email) LIKE ?`, [`%@${domain.toLowerCase()}`]);
      console.log(`[WARMUP/RESET] Manual reset for domain: ${domain}`);
      return res.json({ success: true, message: `Warmup counter reset for ${domain}` });
    }
    await Promise.all([resetDailyCounters(), resetSenderCounts()]);
    console.log('[WARMUP/RESET] Manual full reset triggered');
    res.json({ success: true, message: 'All warmup and sender counters reset.' });
  } catch (err) {
    console.error('[WARMUP/RESET] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/queue/unblock — clear future scheduled_at so warmup-blocked jobs become
// eligible immediately on the next worker cycle. Call AFTER /api/warmup/reset.
app.post('/api/queue/unblock', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT COUNT(*) AS cnt FROM email_queue WHERE status = 'pending' AND scheduled_at > NOW()`
    );
    const count = parseInt(rows[0]?.cnt) || 0;
    await pool.query(`UPDATE email_queue SET scheduled_at = NULL WHERE status = 'pending' AND scheduled_at > NOW()`);
    triggerQueue();
    console.log(`[QUEUE/UNBLOCK] Cleared scheduled_at for ${count} blocked job(s). Worker kicked.`);
    res.json({ success: true, unblocked: count, message: `${count} job(s) unblocked. Worker triggered.` });
  } catch (err) {
    console.error('[QUEUE/UNBLOCK] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/followup/run — manual trigger
app.post('/api/followup/run', async (req, res) => {
  try {
    const sent = await runAutomatedFollowUpScheduler();
    res.json({ success: true, message: `Follow-up job complete. ${sent} sent this run.` });
  } catch (err) {
    console.error('[FOLLOWUP] Manual trigger error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/followup/mark-replied
app.post('/api/followup/mark-replied', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    await markAsReplied(email);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/followup/mark-bounced
app.post('/api/followup/mark-bounced', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    await markAsBounced(email);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Email Templates CRUD ───────────────────────────────────────────────────

// Ensure email_templates table exists
pool.query(`
  CREATE TABLE IF NOT EXISTS email_templates (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(500) NOT NULL,
    html_content LONGTEXT NOT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`).catch(err => console.error('[TEMPLATES] Table init error:', err.message));

// Ensure campaigns has template_html column
pool.query(`ALTER TABLE campaigns ADD COLUMN template_html TEXT`).catch(() => {});

// GET /api/templates
app.get('/api/templates', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT id, name, created_at, updated_at FROM email_templates ORDER BY updated_at DESC`);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[GET /api/templates] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/templates/:id
app.get('/api/templates/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM email_templates WHERE id = ?`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Template not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[GET /api/templates/:id] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/templates
app.post('/api/templates', async (req, res) => {
  try {
    const { name, html_content } = req.body;
    if (!name || !html_content) return res.status(400).json({ success: false, error: 'name and html_content required' });
    const safe = String(html_content).replace(/<script[\s\S]*?<\/script>/gi, '');
    await pool.query(
      `INSERT INTO email_templates (name, html_content) VALUES (?, ?)`,
      [name.trim(), safe]
    );
    const { rows: idRows } = await pool.query(`SELECT LAST_INSERT_ID() AS insertId`);
    const newId = idRows[0]?.insertId;
    if (!newId) return res.status(500).json({ success: false, error: 'Insert failed: could not retrieve new ID' });
    const { rows } = await pool.query(`SELECT * FROM email_templates WHERE id = ?`, [newId]);
    if (!rows[0]) return res.status(500).json({ success: false, error: 'Template created but could not be retrieved' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[POST /api/templates] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/templates/:id
app.put('/api/templates/:id', async (req, res) => {
  try {
    const { name, html_content } = req.body;
    if (!name || !html_content) return res.status(400).json({ success: false, error: 'name and html_content required' });
    const safe = String(html_content).replace(/<script[\s\S]*?<\/script>/gi, '');
    await pool.query(
      `UPDATE email_templates SET name = ?, html_content = ?, updated_at = NOW() WHERE id = ?`,
      [name.trim(), safe, req.params.id]
    );
    const { rows } = await pool.query(`SELECT * FROM email_templates WHERE id = ?`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Template not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[PUT /api/templates/:id] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/templates/:id
app.delete('/api/templates/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT name FROM email_templates WHERE id = ?`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Template not found' });
    const PROTECTED = ['final templete', 'FOLLOW UP (VIRALKAR)', 'FOLLOW UP 2 (VIRALKAR)'];
    if (PROTECTED.includes(rows[0].name)) {
      return res.status(403).json({ success: false, error: `Template "${rows[0].name}" is protected and cannot be deleted.` });
    }
    await pool.query(`DELETE FROM email_templates WHERE id = ?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/templates/:id] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/followup/analytics — full follow-up analytics for dashboard
app.get('/api/followup/analytics', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        email, name, company, status,
        follow_up_step, follow_up_count,
        has_replied, is_bounced,
        last_sent_at, next_follow_up_at,
        reply_detected_at, sender_email
      FROM leads
      WHERE follow_up_count > 0 OR has_replied = 1 OR status LIKE 'Follow-up%'
      ORDER BY
        CASE WHEN has_replied = 1 THEN 0 ELSE 1 END,
        follow_up_count DESC,
        last_sent_at IS NULL, last_sent_at DESC
      LIMIT 200
    `);

    const { rows: [summary] } = await pool.query(`
      SELECT
        SUM(CASE WHEN follow_up_count > 0 THEN 1 ELSE 0 END)                                                        AS total_with_followups,
        SUM(CASE WHEN has_replied = 1 THEN 1 ELSE 0 END)                                                            AS total_replied,
        SUM(CASE WHEN has_replied = 0 AND is_bounced = 0 AND next_follow_up_at IS NOT NULL AND next_follow_up_at > NOW() THEN 1 ELSE 0 END) AS pending_followups,
        COALESCE(SUM(follow_up_count), 0)                                                                            AS total_followup_emails_sent,
        SUM(CASE WHEN has_replied = 0 AND follow_up_count > 0 AND is_bounced = 0 THEN 1 ELSE 0 END)                 AS active_sequences
      FROM leads
    `);

    res.json({ success: true, leads: rows, summary });
  } catch (err) {
    console.error('❌ /api/followup/analytics ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/followup/status — leads currently in follow-up pipeline
app.get('/api/followup/status', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT email, name, company, status, follow_up_step, follow_up_count,
             next_follow_up_at, last_sent_at, sender_email, has_replied, is_bounced
      FROM leads
      WHERE has_replied = 0
        AND is_bounced  = 0
        AND status NOT IN ('Pending', 'Failed', 'Replied')
      ORDER BY next_follow_up_at IS NULL, next_follow_up_at ASC
      LIMIT 200
    `);
    res.json({ count: rows.length, leads: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/email-logs — recent send log
app.get('/api/email-logs', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const { rows } = await pool.query(
      'SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT ?',
      [limit]
    );
    res.json({ logs: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /send-test-gmail - send one real Gmail test email
app.get('/send-test-gmail', async (req, res) => {
  try {
    const to = req.query.to || process.env.GMAIL_USER;
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'Seawind Sales'}" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Gmail Test',
      text: 'Gmail send test successful',
    });

    console.log('Gmail test messageId:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (dashboard/summary moved to routes/dashboard.routes.js)

// GET /api/recent-activity - fetch latest email log rows
app.get('/api/recent-activity', async (req, res) => {
  try {
    const tableCheck = await pool.query(
      `SELECT COUNT(*) AS cnt FROM information_schema.tables
       WHERE table_schema = DATABASE() AND table_name = 'email_logs'`
    );
    if (!parseInt(tableCheck.rows[0].cnt)) {
      return res.json([]);
    }

    const { rows: columnRows } = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND table_name = 'email_logs'
    `);
    const columns = new Set(columnRows.map((row) => row.column_name));
    const has = (name) => columns.has(name);
    const value = (name, fallback = "''") => has(name) ? name : fallback;
    const coalesce = (names, fallback = "''") => {
      const available = names.filter(has);
      return available.length ? `COALESCE(${available.join(', ')}, ${fallback})` : fallback;
    };
    const activityTime = coalesce(['created_at', 'sent_at'], 'NOW()');

    const { rows } = await pool.query(
      `SELECT
         ${value('id', 'NULL')} AS id,
         ${coalesce(['email', 'lead_email', 'to_email'])} AS email,
         ${value('subject')} AS subject,
         CASE WHEN ${value('status')} = 'success' THEN 'sent' ELSE ${value('status')} END AS status,
         ${has('provider') ? 'COALESCE(provider, \'\')' : "''"} AS provider,
         ${has('sender_email') ? 'COALESCE(sender_email, \'\')' : "''"} AS sender_email,
         ${value('message_id')} AS message_id,
         ${activityTime} AS created_at
       FROM email_logs
       ORDER BY ${activityTime} DESC
       LIMIT 20`
    );

    return res.json(rows);
  } catch (err) {
    console.error('/api/recent-activity failed:', err.message);
    return res.json([]);
  }
});

// ─── Automated Follow-Up API Routes ────────────────────────────────────────

// GET /api/followup/schedule
app.get('/api/followup/schedule', (req, res) => {
  res.json({ success: true, schedule: getSchedulePreview() });
});

// GET /api/followup/analytics/v2
app.get('/api/followup/analytics/v2', async (req, res) => {
  try {
    const campaignId = req.query.campaignId ? parseInt(req.query.campaignId) : null;
    const data = await getFollowUpAnalytics(campaignId);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/followup/timeline/:email
app.get('/api/followup/timeline/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const timeline = await getLeadFollowUpTimeline(email);
    const { rows: [lead] } = await pool.query(
      `SELECT email, name, follow_up_step, followup_enabled, followup_stopped_reason,
              next_follow_up_at, has_replied, is_bounced, unsubscribed, message_id, thread_id
       FROM leads WHERE email = ? LIMIT 1`,
      [email]
    );
    const nextInfo = lead ? getNextFollowUpInfo(lead) : null;
    res.json({ success: true, timeline, lead: lead || null, nextFollowUp: nextInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Global automation toggle (persisted in system_settings) ────────────────
const { ensureSystemSettings, getAutomationEnabled, setAutomationEnabled } = require('./services/systemSettings.service');

// GET /api/followup/automation/status
app.get('/api/followup/automation/status', async (req, res) => {
  try {
    const enabled = await getAutomationEnabled();
    res.json({ success: true, enabled });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/followup/automation/pause
app.post('/api/followup/automation/pause', async (req, res) => {
  try {
    await setAutomationEnabled(false);
    console.log('[AUTO FOLLOWUP] Automation paused via API');
    res.json({ success: true, enabled: false });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/followup/automation/resume
app.post('/api/followup/automation/resume', async (req, res) => {
  try {
    await setAutomationEnabled(true);
    console.log('[AUTO FOLLOWUP] Automation resumed via API');
    res.json({ success: true, enabled: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/followup/pause
app.post('/api/followup/pause', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    await pauseFollowUp(email);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/followup/resume
app.post('/api/followup/resume', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    await resumeFollowUp(email);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/followup/stop
app.post('/api/followup/stop', async (req, res) => {
  try {
    const { email, reason } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    const { stopFollowUp: stopFU } = require('./services/automatedFollowUp.service');
    await stopFU(email, reason || 'manual_stop');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/followup/campaign/:id/toggle
app.post('/api/followup/campaign/:id/toggle', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id);
    const { enabled } = req.body;
    await pool.query(`UPDATE campaigns SET followup_enabled = ? WHERE id = ?`, [enabled ? 1 : 0, campaignId]);
    if (!enabled) {
      await pool.query(
        `UPDATE leads SET followup_enabled = 0, followup_stopped_reason = 'campaign_disabled', next_follow_up_at = NULL
         WHERE campaign_id = ? AND has_replied = 0 AND is_bounced = 0`,
        [campaignId]
      );
    }
    res.json({ success: true, enabled: !!enabled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/followup/campaign/:id/stats
app.get('/api/followup/campaign/:id/stats', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id);
    const data = await getFollowUpAnalytics(campaignId);
    const { rows: [campaign] } = await pool.query(
      `SELECT id, name, followup_enabled FROM campaigns WHERE id = ?`,
      [campaignId]
    );
    res.json({ success: true, campaign: campaign || null, ...data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/unsubscribe
app.post('/api/unsubscribe', async (req, res) => {
  try {
    const { email, campaignId } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    await handleUnsubscribe(email, campaignId || null, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: `${email} has been unsubscribed.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/unsubscribe — one-click unsubscribe from email link
app.get('/api/unsubscribe', async (req, res) => {
  try {
    const email = decodeURIComponent(req.query.email || req.query.lid || '');
    const campaignId = req.query.cid || null;
    if (!email) return res.status(400).send('Missing email parameter');
    await handleUnsubscribe(email, campaignId, req.ip, req.headers['user-agent']);
    res.send('<!DOCTYPE html><html><head><title>Unsubscribed</title></head><body style="font-family:sans-serif;text-align:center;padding:60px;"><h2>You have been unsubscribed</h2><p>You will no longer receive emails from us.</p></body></html>');
  } catch (err) {
    res.status(500).send('Error processing unsubscribe request');
  }
});

// GET /api/suppression/:email
app.get('/api/suppression/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const suppressed = await isInSuppressionList(email);
    res.json({ suppressed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handling middleware for multer and other errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err.message);
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({ error: 'File is too large. Maximum 5MB allowed.' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err) {
    console.error('Middleware error:', err.message);
    return res.status(400).json({ error: err.message || 'An error occurred' });
  }
  next();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please kill the existing process and try again.`);
  } else {
    console.error("Server failed to start:", err.message);
  }
});
