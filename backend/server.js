const express = require('express');
const cors = require('cors');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const pool = require('./db');
require('dotenv').config();
const { getActiveSenders, resetAllLimits, getNextSender, getSenderStats, getGlobalStats } = require('./services/senderService');
const { startWorker, triggerQueue } = require('./services/queueWorker');

const { checkReplies, scanBounceNotifications } = require('./services/replyService');
const { runReplyCheck, syncRepliedFlagsFromLeads } = require('./services/replyCheck.service');
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

// Independent Bounce Detection (Every 5 minutes)
cron.schedule('*/5 * * * *', async () => {
  try {
    await scanBounceNotifications();
  } catch (err) {
    console.error('[CRON] Bounce scan failed:', err.message);
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

// Sender warm-up daily reset (runs at 00:01 to let midnight roll first)
const { resetDailyCounters } = require('./services/senderWarmup.service');
const { resetSenderCounts } = require('./services/senderPool.service');
const { resetDailyDomainStats, getAllDomainStats } = require('./services/eventTracker.service');
cron.schedule('1 0 * * *', async () => {
  try {
    await Promise.all([resetDailyCounters(), resetSenderCounts(), resetDailyDomainStats()]);
  } catch (err) {
    console.error('[CRON] Sender warmup/pool reset failed:', err.message);
  }
});

process.on('unhandledRejection', err => {
  console.error('UNHANDLED PROMISE:', err)
})

process.on('uncaughtException', err => {
  console.error('UNCAUGHT ERROR:', err)
})

const sendingState = require('./utils/sendingState');
const bcrypt = require('bcryptjs');

// Also load the root project's .env so Gmail credentials exist for Nodemailer.
const { findPythonProjectDir } = require('./utils/pythonPath');

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

const { runMigrations } = require('./utils/migrationRunner');

async function runMigration() {
  try {
    console.log('[MIGRATION] Running database migrations...');
    await runMigrations();

    console.log('[MIGRATION] Running multi-user auth post-migration setup...');
    const adminName     = process.env.DEFAULT_ADMIN_NAME     || 'admin';
    const adminEmail    = process.env.DEFAULT_ADMIN_EMAIL    || 'admin@example.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'changeme';

    const users = await pool.query('SELECT COUNT(*) AS cnt FROM users');
    let defaultUserId = null;
    if (parseInt(users.rows[0].cnt) === 0) {
      const hash = await bcrypt.hash(adminPassword, 10);
      const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [adminName, adminEmail, hash]
      );
      defaultUserId = result.insertId;
      console.log('[MIGRATION] Default user created with id:', defaultUserId);
    } else {
      const existing = await pool.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
      if (existing.rows.length > 0) {
        defaultUserId = existing.rows[0].id;
      } else {
        const first = await pool.query('SELECT id FROM users ORDER BY id ASC LIMIT 1');
        defaultUserId = first.rows[0].id;
      }
      console.log('[MIGRATION] Default user found with id:', defaultUserId);
    }

    const tables = [
      { name: 'campaigns', key: 'user_id', ref: 'INT DEFAULT NULL', fk: true },
      { name: 'leads', key: 'user_id', ref: 'INT DEFAULT NULL', fk: true },
      { name: 'email_queue', key: 'user_id', ref: 'INT DEFAULT NULL', fk: true },
      { name: 'email_logs', key: 'user_id', ref: 'INT DEFAULT NULL', fk: true },
      { name: 'email_events', key: 'user_id', ref: 'INT DEFAULT NULL', fk: true },
      { name: 'email_templates', key: 'user_id', ref: 'INT DEFAULT NULL', fk: true },
      { name: 'followup_templates', key: 'user_id', ref: 'INT DEFAULT NULL', fk: true },
      // { name: 'followup_schedules', key: 'user_id', ref: 'INT DEFAULT NULL', fk: true },
      { name: 'followup_logs', key: 'user_id', ref: 'INT DEFAULT NULL', fk: true },
      { name: 'sender_accounts', key: 'user_id', ref: 'INT DEFAULT NULL', fk: true },
      { name: 'domain_warmup', key: 'user_id', ref: 'INT DEFAULT NULL', fk: true },
      { name: 'domain_events', key: 'user_id', ref: 'INT DEFAULT NULL', fk: true },
      { name: 'domain_stats', key: 'user_id', ref: 'INT DEFAULT NULL', fk: true },
      { name: 'link_clicks', key: 'user_id', ref: 'INT DEFAULT NULL', fk: true },
      { name: 'suppression_list', key: 'user_id', ref: 'INT DEFAULT NULL', fk: false },
    ];

    for (const table of tables) {
      const check = await pool.query(`SELECT COUNT(*) AS cnt FROM ${table.name} WHERE user_id IS NULL`);
      if (parseInt(check.rows[0].cnt) > 0) {
        await pool.query(`UPDATE ${table.name} SET user_id = ? WHERE user_id IS NULL`, [defaultUserId]);
        console.log(`[MIGRATION] Assigned ${check.rows[0].cnt} records in ${table.name} to user ${defaultUserId}`);
      }
    }

    for (const table of tables) {
      try {
        await pool.query(`ALTER TABLE ${table.name} MODIFY COLUMN user_id INT NOT NULL`);
        console.log(`[MIGRATION] Set user_id NOT NULL on ${table.name}`);
      } catch (err) {
        console.log(`[MIGRATION] Could not set NOT NULL on ${table.name}: ${err.message}`);
      }
    }

    console.log('[MIGRATION] Multi-user auth migration complete');
  } catch (err) {
    console.error('[MIGRATION] Error:', err.message);
  }
}

runMigration();

const app = express();
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : true;
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/email-assets', express.static(path.join(__dirname, 'assets', 'email')));

// (system routes moved to routes/system.routes.js)
app.use(require('./routes/system.routes'));

// (oauth routes moved to routes/oauth.routes.js)
app.use(require('./routes/oauth.routes'));

// Multi-user auth routes
app.use(require('./routes/auth.routes'));

app.use(require('./routes/tracking.routes'));
app.use(require('./routes/trackingExtra.routes'));

const authMiddleware = require('./middleware/auth');
// Apply auth middleware to all /api routes except public ones (auth, health, etc.)
app.use((req, res, next) => {
  if (!req.originalUrl.startsWith('/api/')) return next();
  const publicPrefixes = ['/api/auth/', '/api/health'];
  if (publicPrefixes.some(p => req.originalUrl.startsWith(p))) {
    return next();
  }
  return authMiddleware(req, res, next);
});

const { upload } = require('./middleware/upload');



// ─── Routes ─────────────────────────────────────────────────────────────────

// Ensure required analytics table exists on startup
ensureEmailEventsTable().catch((err) => {
  console.error("❌ Failed to ensure email_events table:", err.message);
});



// ─── Sender routes handled by senderController below ───────────────────────

// ─── Tracking Routes ────────────────────────────────────────────────────────
// (moved to routes/tracking.routes.js, mounted via app.use() above)

app.use(require('./routes/analytics.routes'));
app.use(require('./routes/domains.routes'));
app.use(require('./routes/senders.routes'));




// (analytics routes moved to routes/analytics.routes.js)

// (dashboard routes moved to routes/dashboard.routes.js)
app.use(require('./routes/dashboard.routes'));

// (lead routes moved to routes/leads.routes.js)
app.use(require('./routes/leads.routes'));
app.use(require('./routes/activity.routes'));
app.use(require('./routes/suppression.routes'));

// (dashboard/stats and /api/dashboard moved to routes/dashboard.routes.js)


// (dashboard/recent-activity moved to routes/dashboard.routes.js)

// (template preview route moved to routes/templates.routes.js)



// (upload routes moved to routes/upload.routes.js)
app.use(require('./routes/upload.routes'));

// (bulk email sending routes moved to routes/emailSending.routes.js)
app.use(require('./routes/emailSending.routes'));

// (send-initial-email moved to routes/upload.routes.js)

// (email diagnostics routes moved to routes/emailDiagnostics.routes.js)
app.use(require('./routes/emailDiagnostics.routes'));

// (email-analytics routes moved to routes/analytics.routes.js)

// (campaign status/:id/:id/leads routes moved to routes/campaigns.routes.js)
app.use(require('./routes/campaigns.routes'));

// Bulk Campaign Automation — campaign_master CRUD
app.use('/api/campaign-automation', require('./routes/campaignAutomation.routes'));

// Bulk Campaign Automation — release due batches (200/sender, senders take
// turns one per day in rotation) into the legacy leads/email_queue pipeline.
// Runs every 30 minutes; a sender only actually releases once its
// next_eligible_date has arrived, so more frequent runs are safe no-ops.
const { releaseDueBatches } = require('./services/campaignScheduling.service');
cron.schedule('*/30 * * * *', async () => {
  try {
    await releaseDueBatches();
  } catch (err) {
    console.error('[CAMPAIGN_SCHEDULER] Cron error:', err.message);
  }
});

// ─── Reply detection engine ─────────────────────────────────────────────────

// (runReplyCheck and syncRepliedFlagsFromLeads moved to services/replyCheck.service.js)

// Run reply check every 5 minutes (DISABLED due to missing Python OAuth JSON)
// cron.schedule('*/5 * * * *', async () => {
//   try { await runReplyCheck(); await syncRepliedFlagsFromLeads(); }
//   catch (err) { console.error('[REPLY] Cron error:', err.message); }
// });

// (reply routes moved to routes/replies.routes.js)
app.use(require('./routes/replies.routes'));

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

// Campaign-linked follow-up queue — runs every 10 minutes
// Wrapped in try-catch: if the service fails to load for any reason, the
// remaining route registrations below (including /api/followup-templates)
// must still execute — they must not be skipped due to an aborted require.
let runCampaignLinkedFollowUpScheduler = async () => {};
try {
  runCampaignLinkedFollowUpScheduler = require('./services/campaignFollowUp.service').runCampaignLinkedFollowUpScheduler;
} catch (err) {
  console.error('[CAMPAIGN_FU] Service failed to load — cron disabled:', err.message);
}
cron.schedule('*/10 * * * *', async () => {
  try {
    await runCampaignLinkedFollowUpScheduler();
  } catch (err) {
    console.error('[CAMPAIGN_FU] Cron error:', err.message);
  }
});

// (queue routes moved to routes/queue.routes.js)
app.use(require('./routes/queue.routes'));

// Queue monitoring — read-only stats, sender analytics, paginated listings
app.use(require('./routes/queueMonitor.routes'));

// (followup routes moved to routes/followup.routes.js)
app.use(require('./routes/followup.routes'));

// Unsubscribe management API
app.use(require('./routes/unsubscribe.routes'));

// Reply leads (detected leads from reply tracking)
app.use(require('./routes/reply_leads.routes'));



// (template routes moved to routes/templates.routes.js)
app.use(require('./routes/templates.routes'));

// Campaign-linked follow-up templates CRUD
// Mounted at /api/followup-templates so handler paths are relative (/, /:id)
console.log('[STARTUP] Registering /api/followup-templates routes…');
app.use('/api/followup-templates', require('./routes/followupTemplates.routes'));
console.log('[STARTUP] /api/followup-templates routes registered ✓');

// (followup/analytics and followup/status moved to routes/followup.routes.js)

// (email-logs and send-test-gmail moved to routes/system.routes.js)

// (dashboard/summary moved to routes/dashboard.routes.js)


// (followup schedule/analytics/v2/timeline/automation/pause/resume/stop/campaign routes moved to routes/followup.routes.js)


// Error handling middleware for multer and other errors
const multerErrorHandler = require('./middleware/multerErrorHandler');
app.use(multerErrorHandler);

// Serve the built React frontend for all non-API routes
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ status: 'API running', note: 'Frontend not built — run: cd frontend && npm run build' });
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.`);
    console.error(`   Run: npx kill-port ${PORT}   then restart the server.\n`);
  } else {
    console.error("Server failed to start:", err.message);
  }
  process.exit(1);
});
