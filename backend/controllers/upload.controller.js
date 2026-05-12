const path = require('path');
const pool = require('../db');
const { isValidEmail, parseCSV, parseExcel } = require('../utils/fileParser');
const { renderSubject, renderTemplate } = require('../utils/templateRenderer');
const sendingState = require('../utils/sendingState');

// POST /api/upload-leads
async function uploadLeads(req, res) {
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
}

// POST /send-emails — accepts CSV/Excel, sends, stores in DB
async function sendEmails(req, res) {
  try {
    if (sendingState.isSending) {
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
}

// POST /api/send-initial-email — single lead queue
async function sendInitialEmail(req, res) {
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
}

module.exports = { uploadLeads, sendEmails, sendInitialEmail };
