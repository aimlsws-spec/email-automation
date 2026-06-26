const express = require('express');
const router = express.Router();
const {
  getReplyLeads,
  getLeadStats,
  updateLeadStatus,
  exportLeadsData,
} = require('../services/leadDetection.service');
const {
  listCampaignExcelFiles,
  readCampaignExcelBuffer,
  rebuildCampaignExcel,
} = require('../services/campaignExcel.service');
const pool = require('../db');
const path = require('path');

// GET /api/reply-leads — paginated list with filters
router.get('/api/reply-leads', async (req, res) => {
  try {
    const { campaign, search, status, page, limit } = req.query;
    const result = await getReplyLeads({ campaign, search, status, page, limit });
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[REPLY_LEADS] GET error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/reply-leads/stats — totals, per-campaign breakdown, recent entries
router.get('/api/reply-leads/stats', async (req, res) => {
  try {
    const stats = await getLeadStats();
    res.json({ success: true, ...stats });
  } catch (err) {
    console.error('[REPLY_LEADS] stats error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/reply-leads/export — CSV download (respects same filters as list)
router.get('/api/reply-leads/export', async (req, res) => {
  try {
    const { campaign, search, status } = req.query;
    const rows = await exportLeadsData({ campaign, search, status });

    const csvHeaders = ['Sender Email', 'Campaign Name', 'Reply Date', 'Subject', 'Reply Message', 'Mailbox', 'Status'];
    const esc = (v) => {
      if (v == null) return '';
      const s = String(v).replace(/"/g, '""');
      return /[",\n\r]/.test(s) ? `"${s}"` : s;
    };

    const csv = [
      csvHeaders.join(','),
      ...rows.map(r => [
        esc(r.sender_email),
        esc(r.campaign_name),
        esc(r.reply_date ? new Date(r.reply_date).toISOString().replace('T', ' ').slice(0, 19) : ''),
        esc(r.subject),
        esc(r.reply_message),
        esc(r.mailbox),
        esc(r.lead_status),
      ].join(',')),
    ].join('\r\n');

    const filename = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    console.error('[REPLY_LEADS] export error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/reply-leads/:id/status — update CRM status
router.patch('/api/reply-leads/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid id' });

    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, error: 'status is required' });

    const updated = await updateLeadStatus(id, status);
    if (!updated) return res.status(404).json({ success: false, error: 'Lead not found' });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// ─── Campaign-specific Excel endpoints ──────────────────────────────────────

// GET /api/reply-leads/excel/files — list all campaign Excel files on disk
router.get('/api/reply-leads/excel/files', (req, res) => {
  try {
    const files = listCampaignExcelFiles();
    res.json({ success: true, files });
  } catch (err) {
    console.error('[EXCEL] list error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/reply-leads/excel/download?campaign=:id — download a campaign's Excel file.
// If the file doesn't exist on disk yet, it is rebuilt from the DB on the fly.
router.get('/api/reply-leads/excel/download', async (req, res) => {
  try {
    const campaignId = parseInt(req.query.campaign, 10);
    if (!campaignId || isNaN(campaignId)) {
      return res.status(400).json({ success: false, error: 'campaign query param (numeric id) is required' });
    }

    // Resolve campaign name from DB
    const { rows: nameRows } = await pool.query(
      `SELECT campaign_name FROM reply_leads WHERE campaign_id = ? AND campaign_name IS NOT NULL LIMIT 1`,
      [campaignId]
    );
    const campaignName = nameRows[0]?.campaign_name || `Campaign_${campaignId}`;

    // Try to serve the pre-built file; rebuild from DB if missing
    let buffer = readCampaignExcelBuffer(campaignId, campaignName);
    if (!buffer) {
      const rows = await exportLeadsData({ campaign: String(campaignId) });
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: 'No leads found for this campaign' });
      }
      rebuildCampaignExcel(campaignId, campaignName, rows);
      buffer = readCampaignExcelBuffer(campaignId, campaignName);
    }

    const safeName = (campaignName || 'campaign').replace(/[/\\:*?"<>|]/g, '_').replace(/\s+/g, '_');
    const filename = `${safeName}-leads.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    console.error('[EXCEL] download error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/reply-leads/excel/rebuild?campaign=:id — force-rebuild from DB
// (use when the on-disk file is out of sync with the database)
router.post('/api/reply-leads/excel/rebuild', async (req, res) => {
  try {
    const campaignId = parseInt(req.query.campaign, 10);
    if (!campaignId || isNaN(campaignId)) {
      return res.status(400).json({ success: false, error: 'campaign query param (numeric id) is required' });
    }

    const { rows: nameRows } = await pool.query(
      `SELECT campaign_name FROM reply_leads WHERE campaign_id = ? AND campaign_name IS NOT NULL LIMIT 1`,
      [campaignId]
    );
    const campaignName = nameRows[0]?.campaign_name || `Campaign_${campaignId}`;

    const rows = await exportLeadsData({ campaign: String(campaignId) });
    const filePath = rebuildCampaignExcel(campaignId, campaignName, rows);

    res.json({ success: true, leads: rows.length, file: path.basename(filePath) });
  } catch (err) {
    console.error('[EXCEL] rebuild error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
