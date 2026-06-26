'use strict';

/**
 * Controlled single follow-up test.
 * Sends ONE stage-1 follow-up to the target email only.
 * Global automation is NOT enabled by this script.
 *
 * Usage:
 *   node scripts/test-followup-single.js
 */

const TARGET_EMAIL = 'aimlsws@gmail.com';
const SENDER_EMAIL = 'bhumi@viralkar.in';
const TEMPLATE_NAME = 'FOLLOW UP (VIRALKAR)';

const pool = require('../db');

async function main() {
  console.log('\n══════════════════════════════════════════════════');
  console.log(' SINGLE FOLLOW-UP TEST — NOT BULK AUTOMATION');
  console.log('══════════════════════════════════════════════════');
  console.log(`  Target : ${TARGET_EMAIL}`);
  console.log(`  Sender : ${SENDER_EMAIL}`);
  console.log(`  Template: ${TEMPLATE_NAME}`);
  console.log('══════════════════════════════════════════════════\n');

  // ── 1. Verify sender account ─────────────────────────────────────────
  const { rows: sRows } = await pool.query(
    `SELECT email, status, type, daily_sent_count, daily_limit
     FROM sender_accounts WHERE email = ? LIMIT 1`,
    [SENDER_EMAIL]
  );
  if (!sRows[0]) {
    console.error(`FAIL: Sender ${SENDER_EMAIL} not found in sender_accounts.`);
    process.exit(1);
  }
  const sender = sRows[0];
  console.log(`[SENDER]   ${sender.email}  status=${sender.status}  type=${sender.type}  sent=${sender.daily_sent_count}/${sender.daily_limit}`);
  if (sender.status !== 'active') {
    console.error(`FAIL: Sender is not active (status=${sender.status}).`);
    process.exit(1);
  }

  // ── 2. Verify template exists and is real HTML ───────────────────────
  const { rows: tRows } = await pool.query(
    `SELECT id, name, LENGTH(html_content) AS html_len,
            SUBSTRING(html_content, 1, 120) AS html_preview
     FROM email_templates WHERE name = ? LIMIT 1`,
    [TEMPLATE_NAME]
  );
  if (!tRows[0]) {
    console.error(`FAIL: Template "${TEMPLATE_NAME}" not found in email_templates.`);
    process.exit(1);
  }
  const tpl = tRows[0];
  console.log(`[TEMPLATE] [${tpl.id}] "${tpl.name}"  size=${tpl.html_len} bytes`);
  console.log(`[TEMPLATE] preview: ${tpl.html_preview.replace(/\s+/g, ' ').slice(0, 100)}…`);

  // Warn if it still looks like placeholder HTML
  if (/IT solutions|Acme Corp|custom software development/i.test(tpl.html_preview)) {
    console.warn('[TEMPLATE] WARNING: Template may still contain placeholder content. Proceeding anyway.');
  }

  // ── 3. Ensure lead record exists and is ready for stage-1 ───────────
  const { rows: lRows } = await pool.query(
    `SELECT * FROM leads WHERE email = ? LIMIT 1`,
    [TARGET_EMAIL]
  );

  if (!lRows[0]) {
    console.log(`[LEAD]     Not found — creating test lead for ${TARGET_EMAIL}`);
    await pool.query(`
      INSERT INTO leads
        (email, name, company, status, sender_email,
         has_replied, is_bounced, followup_enabled,
         follow_up_step, follow_up_count, next_follow_up_at, created_at)
      VALUES (?, 'Aaryan Test', 'Viralkar', 'Sent', ?, 0, 0, 1, 0, 0, NOW(), NOW())
    `, [TARGET_EMAIL, SENDER_EMAIL]);
  } else {
    // Reset to stage-0 for the test, preserve message_id/thread_id if present
    await pool.query(`
      UPDATE leads
      SET sender_email      = ?,
          followup_enabled  = 1,
          has_replied       = 0,
          is_bounced        = 0,
          unsubscribed      = 0,
          follow_up_step    = 0,
          next_follow_up_at = NOW()
      WHERE email = ?
    `, [SENDER_EMAIL, TARGET_EMAIL]);
    console.log(`[LEAD]     Existing lead reset to stage-0 for test.`);
  }

  // Re-fetch final lead state
  const { rows: readyRows } = await pool.query(`SELECT * FROM leads WHERE email = ? LIMIT 1`, [TARGET_EMAIL]);
  const lead = readyRows[0];
  console.log(`[LEAD]     id=${lead.id}  step=${lead.follow_up_step}  sender=${lead.sender_email}  message_id=${lead.message_id || '—'}`);

  // ── 4. Check sender warmup allows sending ────────────────────────────
  const { canSendEmail, incrementSenderCount } = require('../services/senderWarmup.service');
  const warmupOk = await canSendEmail(SENDER_EMAIL);
  if (!warmupOk) {
    console.error(`FAIL: Sender warmup limit reached for ${SENDER_EMAIL}. Cannot send today.`);
    process.exit(1);
  }
  console.log(`[WARMUP]   ${SENDER_EMAIL} — OK to send`);

  // ── 5. Send the follow-up ────────────────────────────────────────────
  console.log('\n[SEND]     Invoking sendFollowUp now…\n');

  // Import after DB prep so schema migrations don't double-fire
  const { sendFollowUp } = require('../services/automatedFollowUp.service');
  let result;
  try {
    result = await sendFollowUp(lead);
  } catch (err) {
    console.error(`FAIL: sendFollowUp threw: ${err.message}`);
    process.exit(1);
  }

  if (!result) {
    console.error('FAIL: sendFollowUp returned null. Check logs above.');
    process.exit(1);
  }

  // ── 6. Increment sender counter (mirrors scheduler behaviour) ────────
  await incrementSenderCount(SENDER_EMAIL).catch(() => {});

  // ── 7. Verify DB state ───────────────────────────────────────────────
  const { rows: afterLead } = await pool.query(`SELECT * FROM leads WHERE email = ? LIMIT 1`, [TARGET_EMAIL]);
  const after = afterLead[0];

  const { rows: logEntry } = await pool.query(
    `SELECT * FROM followup_logs WHERE lead_email = ? ORDER BY sent_at DESC LIMIT 1`,
    [TARGET_EMAIL]
  );

  const { rows: sAfter } = await pool.query(
    `SELECT daily_sent_count, daily_limit FROM sender_accounts WHERE email = ? LIMIT 1`,
    [SENDER_EMAIL]
  );

  console.log('\n══════════════════════════════════════════════════');
  console.log(' RESULT');
  console.log('══════════════════════════════════════════════════');
  console.log(`  messageId        : ${result.messageId || result.id || '—'}`);
  console.log(`  threadId         : ${result.threadId || '—'}`);
  console.log(`  provider         : ${result.providerUsed || '—'}`);
  console.log('──────────────────────────────────────────────────');
  console.log(' DB — leads');
  console.log(`  follow_up_step   : ${after?.follow_up_step}`);
  console.log(`  follow_up_count  : ${after?.follow_up_count}`);
  console.log(`  next_follow_up_at: ${after?.next_follow_up_at || '—'}`);
  console.log(`  message_id       : ${after?.message_id || '—'}`);
  console.log(`  thread_id        : ${after?.thread_id || '—'}`);
  console.log(`  status           : ${after?.status}`);
  console.log('──────────────────────────────────────────────────');
  console.log(' DB — followup_logs');
  if (logEntry[0]) {
    console.log(`  stage            : ${logEntry[0].followup_stage}`);
    console.log(`  template_used    : ${logEntry[0].template_used}`);
    console.log(`  status           : ${logEntry[0].status}`);
    console.log(`  sent_at          : ${logEntry[0].sent_at}`);
    console.log(`  message_id       : ${logEntry[0].message_id || '—'}`);
  } else {
    console.warn('  WARNING: No followup_logs entry found.');
  }
  console.log('──────────────────────────────────────────────────');
  console.log(' Sender limits after send');
  console.log(`  ${SENDER_EMAIL}: ${sAfter[0]?.daily_sent_count} / ${sAfter[0]?.daily_limit}`);
  console.log('══════════════════════════════════════════════════');
  console.log(' ✓ Test complete. Global automation is still disabled.');
  console.log('══════════════════════════════════════════════════\n');

  process.exit(0);
}

main().catch(err => {
  console.error('\n[TEST FATAL]', err.message);
  process.exit(1);
});
