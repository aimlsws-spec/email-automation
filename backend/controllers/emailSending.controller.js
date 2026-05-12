const pool = require('../db');
const { renderTemplate, TEST_SEND_LIMIT } = require('../utils/templateRenderer');
const sendingState = require('../utils/sendingState');

// POST /api/send-bulk-initial - sends pending initial emails through Gmail or domain SMTP
async function sendBulkInitial(req, res) {
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
      sendingState.isSending = false;
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
}

module.exports = { sendBulkInitial };
