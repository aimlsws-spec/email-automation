const { execFile } = require('child_process');
const pool = require('../db');
const { ensureEmailEventsTable } = require('./emailService');
const { findPythonProjectDir } = require('../utils/pythonPath');

async function runReplyCheck() {
  console.log('[REPLY] Running reply check at', new Date().toISOString());

  const projectDir = findPythonProjectDir();
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

module.exports = {
  runReplyCheck,
  syncRepliedFlagsFromLeads,
};
