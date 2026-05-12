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

const { checkReplies } = require('./services/replyService');
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

const sendingState = require('./utils/sendingState');

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

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/email-assets', express.static(path.join(__dirname, 'assets', 'email')));

// (system routes moved to routes/system.routes.js)
app.use(require('./routes/system.routes'));

// (oauth routes moved to routes/oauth.routes.js)
app.use(require('./routes/oauth.routes'));

app.use(require('./routes/tracking.routes'));
app.use(require('./routes/trackingExtra.routes'));

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


// (analytics routes moved to routes/analytics.routes.js)

// (dashboard routes moved to routes/dashboard.routes.js)
app.use(require('./routes/dashboard.routes'));

// (lead routes moved to routes/leads.routes.js)
app.use(require('./routes/leads.routes'));
app.use(require('./routes/activity.routes'));

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

// (queue routes moved to routes/queue.routes.js)
app.use(require('./routes/queue.routes'));

// (followup routes moved to routes/followup.routes.js)
app.use(require('./routes/followup.routes'));

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

// (template routes moved to routes/templates.routes.js)
app.use(require('./routes/templates.routes'));

// (followup/analytics and followup/status moved to routes/followup.routes.js)

// (email-logs and send-test-gmail moved to routes/system.routes.js)

// (dashboard/summary moved to routes/dashboard.routes.js)


// (followup schedule/analytics/v2/timeline/automation/pause/resume/stop/campaign routes moved to routes/followup.routes.js)


// Error handling middleware for multer and other errors
const multerErrorHandler = require('./middleware/multerErrorHandler');
app.use(multerErrorHandler);

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
