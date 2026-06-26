'use strict';

const path = require('path');
const fs   = require('fs');
const XLSX = require('xlsx');

const EXPORTS_DIR = path.join(__dirname, '..', 'exports');

const HEADERS = [
  'Sender Email',
  'Campaign Name',
  'Reply Date',
  'Subject',
  'Reply Message',
  'Mailbox',
  'Status',
];

// Column widths: generous for Reply Message (index 4), standard for others
const COL_WIDTHS = HEADERS.map((h, i) => ({ wch: i === 4 ? 80 : Math.max(h.length + 6, 22) }));

function ensureExportsDir() {
  if (!fs.existsSync(EXPORTS_DIR)) fs.mkdirSync(EXPORTS_DIR, { recursive: true });
}

function sanitizeName(name) {
  return (name || 'unknown')
    .slice(0, 80)
    .replace(/[/\\:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    || 'campaign';
}

function getExcelPath(campaignId, campaignName) {
  ensureExportsDir();
  const safeName = sanitizeName(campaignName);
  return path.join(EXPORTS_DIR, `campaign_${campaignId || 0}_${safeName}.xlsx`);
}

function rowFromLead(lead) {
  const date = lead.reply_date
    ? new Date(lead.reply_date).toISOString().replace('T', ' ').slice(0, 19)
    : '';
  return [
    lead.sender_email  || '',
    lead.campaign_name || '',
    date,
    lead.subject       || '',
    lead.reply_message || '',
    lead.mailbox       || '',
    lead.lead_status   || 'New',
  ];
}

/**
 * Append a single new lead row to its campaign's Excel file.
 * Creates the file (with header row) if it doesn't exist yet.
 * Skips silently on any file-system error so the caller's DB operation is unaffected.
 */
function appendLeadToCampaignExcel(lead) {
  try {
    const filePath = getExcelPath(lead.campaign_id, lead.campaign_name);
    const newRow   = rowFromLead(lead);

    if (fs.existsSync(filePath)) {
      const wb   = XLSX.readFile(filePath);
      const ws   = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      data.push(newRow);
      const updatedWs = XLSX.utils.aoa_to_sheet(data);
      updatedWs['!cols'] = COL_WIDTHS;
      wb.Sheets[wb.SheetNames[0]] = updatedWs;
      XLSX.writeFile(wb, filePath);
      console.log(`[EXCEL] Appended to ${path.basename(filePath)} — ${data.length - 1} leads total`);
    } else {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([HEADERS, newRow]);
      ws['!cols'] = COL_WIDTHS;
      XLSX.utils.book_append_sheet(wb, ws, 'Leads');
      XLSX.writeFile(wb, filePath);
      console.log(`[EXCEL] Created ${path.basename(filePath)}`);
    }
  } catch (err) {
    console.error('[EXCEL] appendLeadToCampaignExcel failed:', err.message);
  }
}

/**
 * Fully rebuild a campaign Excel file from a pre-fetched rows array.
 * Used by the /rebuild endpoint to bring the file in sync with the DB.
 */
function rebuildCampaignExcel(campaignId, campaignName, rows) {
  const filePath = getExcelPath(campaignId, campaignName);
  const wb = XLSX.utils.book_new();
  const data = [HEADERS, ...rows.map(rowFromLead)];
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = COL_WIDTHS;
  XLSX.utils.book_append_sheet(wb, ws, 'Leads');
  XLSX.writeFile(wb, filePath);
  console.log(`[EXCEL] Rebuilt ${path.basename(filePath)} — ${rows.length} leads`);
  return filePath;
}

/**
 * Read a campaign Excel file as a Buffer for HTTP download.
 * Returns null if the file does not exist.
 */
function readCampaignExcelBuffer(campaignId, campaignName) {
  const filePath = getExcelPath(campaignId, campaignName);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath);
}

/**
 * List all campaign Excel files in the exports directory.
 */
function listCampaignExcelFiles() {
  ensureExportsDir();
  return fs.readdirSync(EXPORTS_DIR)
    .filter(f => f.endsWith('.xlsx'))
    .map(f => {
      const stat = fs.statSync(path.join(EXPORTS_DIR, f));
      // Extract campaignId from filename: campaign_{id}_{name}.xlsx
      const match = f.match(/^campaign_(\d+)_(.+)\.xlsx$/);
      return {
        filename:   f,
        campaignId: match ? parseInt(match[1], 10) : null,
        label:      match ? match[2].replace(/_/g, ' ') : f,
        sizeBytes:  stat.size,
        modifiedAt: stat.mtime,
      };
    })
    .sort((a, b) => b.modifiedAt - a.modifiedAt);
}

module.exports = {
  appendLeadToCampaignExcel,
  rebuildCampaignExcel,
  readCampaignExcelBuffer,
  listCampaignExcelFiles,
  getExcelPath,
};
