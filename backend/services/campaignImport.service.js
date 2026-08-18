'use strict';

const path = require('path');
const crypto = require('crypto');
const pool = require('../db');
const { isValidEmail, parseCSV, parseExcel } = require('../utils/fileParser');

const INSERT_CHUNK_SIZE = 1000;
const SUPPRESSION_CHECK_CHUNK_SIZE = 500;

// Legacy `leads` statuses that mean "this person is done with their previous
// campaign" — safe to include them in a new campaign despite the old row.
const TERMINAL_LEAD_STATUSES = new Set(['Replied', 'Unsubscribed', 'Bounced']);

/**
 * Parse an uploaded CSV/XLSX buffer into normalized {email,name,company} rows.
 */
function parseFile(buffer, originalFilename) {
  const ext = path.extname(originalFilename || '').toLowerCase();
  return ext === '.csv' ? parseCSV(buffer) : parseExcel(buffer);
}

/**
 * For a batch of candidate emails, find which ones are already "active"
 * (non-terminal) under a DIFFERENT campaign in the legacy `leads` table.
 * Returns a Set of lowercased emails that must be suppressed.
 */
async function findCrossCampaignActiveEmails(emails, excludeLegacyCampaignId) {
  const suppressed = new Set();
  for (let i = 0; i < emails.length; i += SUPPRESSION_CHECK_CHUNK_SIZE) {
    const chunk = emails.slice(i, i + SUPPRESSION_CHECK_CHUNK_SIZE);
    if (chunk.length === 0) continue;
    const placeholders = chunk.map(() => '?').join(',');
    const params = [...chunk];
    let sql = `
      SELECT email, campaign_id, status, has_replied, is_bounced, unsubscribed
      FROM leads
      WHERE email IN (${placeholders})
    `;
    if (excludeLegacyCampaignId) {
      sql += ` AND (campaign_id IS NULL OR campaign_id != ?)`;
      params.push(excludeLegacyCampaignId);
    }
    const { rows } = await pool.query(sql, params);
    for (const row of rows) {
      const isTerminal =
        Number(row.has_replied) === 1 ||
        Number(row.is_bounced) === 1 ||
        Number(row.unsubscribed) === 1 ||
        TERMINAL_LEAD_STATUSES.has(row.status);
      if (!isTerminal) {
        suppressed.add(String(row.email).toLowerCase());
      }
    }
  }
  return suppressed;
}

async function findCampaignForImport(campaignId, userId) {
  const { rows } = await pool.query(
    `SELECT id, campaign_name, status, uploaded_by FROM campaign_master WHERE id = ? AND deleted_at IS NULL LIMIT 1`,
    [campaignId]
  );
  const campaign = rows[0];
  if (!campaign) {
    const err = new Error('Campaign not found');
    err.statusCode = 404;
    throw err;
  }
  if (userId && campaign.uploaded_by && campaign.uploaded_by !== userId) {
    const err = new Error('Campaign not found');
    err.statusCode = 404;
    throw err;
  }
  if (campaign.status !== 'Draft') {
    const err = new Error(
      `Leads can only be imported while a campaign is in "Draft" status. Current status: "${campaign.status}"`
    );
    err.statusCode = 409;
    throw err;
  }
  return campaign;
}

async function logImportEvent(campaignId, event, message, level = 'info') {
  await pool
    .query(
      `INSERT INTO campaign_import_logs (campaign_id, event, message, level) VALUES (?, ?, ?, ?)`,
      [campaignId, event, message, level]
    )
    .catch((err) => console.error('[CAMPAIGN_IMPORT] Failed to write import log:', err.message));
}

/**
 * Import a CSV/XLSX file of leads into campaign_leads for a Draft campaign.
 * Marks each row Valid / Invalid / Duplicate, bulk-inserts in chunks, and
 * transitions the campaign to 'Ready' on success.
 */
async function importLeads(campaignId, { buffer, originalFilename, userId }) {
  const campaign = await findCampaignForImport(campaignId, userId);

  await pool.query(`UPDATE campaign_master SET status = 'Importing', import_started_at = NOW() WHERE id = ?`, [
    campaignId,
  ]);
  await logImportEvent(campaignId, 'import_started', `File "${originalFilename}" received`);

  let rows;
  try {
    rows = await parseFile(buffer, originalFilename);
  } catch (parseErr) {
    await pool.query(`UPDATE campaign_master SET status = 'Draft' WHERE id = ?`, [campaignId]);
    await logImportEvent(campaignId, 'import_failed', parseErr.message, 'error');
    const err = new Error(`Failed to parse file: ${parseErr.message}`);
    err.statusCode = 400;
    throw err;
  }

  if (rows.length === 0) {
    await pool.query(`UPDATE campaign_master SET status = 'Draft' WHERE id = ?`, [campaignId]);
    const err = new Error('The uploaded file has no data rows');
    err.statusCode = 400;
    throw err;
  }

  const csvHash = crypto.createHash('sha256').update(buffer).digest('hex');
  const { rows: hashClash } = await pool.query(
    `SELECT id, campaign_name FROM campaign_master WHERE csv_hash = ? AND id != ? AND deleted_at IS NULL LIMIT 1`,
    [csvHash, campaignId]
  );
  if (hashClash.length > 0) {
    await pool.query(`UPDATE campaign_master SET status = 'Draft' WHERE id = ?`, [campaignId]);
    const err = new Error(
      `This exact file was already imported as campaign "${hashClash[0].campaign_name}" (id ${hashClash[0].id})`
    );
    err.statusCode = 409;
    throw err;
  }

  try {
    // ── In-file validation + de-dupe ──────────────────────────────────────────
    const seen = new Set();
    const prepared = [];
    let invalidCount = 0;
    let duplicateCount = 0;

    rows.forEach((row, idx) => {
      const email = String(row.email || '').trim();
      const emailLower = email.toLowerCase();

      if (!isValidEmail(email)) {
        invalidCount++;
        prepared.push({ row, rowNumber: idx + 1, importStatus: 'Invalid', validationErrors: 'Invalid or missing email' });
        return;
      }
      if (seen.has(emailLower)) {
        duplicateCount++;
        prepared.push({ row, rowNumber: idx + 1, importStatus: 'Duplicate', validationErrors: 'Duplicate email within this file' });
        return;
      }
      seen.add(emailLower);
      prepared.push({ row, rowNumber: idx + 1, importStatus: 'Valid', validationErrors: null });
    });

    // ── Cross-campaign suppression check ──────────────────────────────────────
    const candidateEmails = prepared.filter((p) => p.importStatus === 'Valid').map((p) => p.row.email);
    const suppressedEmails = await findCrossCampaignActiveEmails(candidateEmails, null);
    for (const p of prepared) {
      if (p.importStatus === 'Valid' && suppressedEmails.has(p.row.email.toLowerCase())) {
        p.importStatus = 'Duplicate';
        p.validationErrors = 'Email is already active in another campaign';
        duplicateCount++;
      }
    }
    const validCount = prepared.filter((p) => p.importStatus === 'Valid').length;

    // ── Bulk insert in chunks ─────────────────────────────────────────────────
    for (let i = 0; i < prepared.length; i += INSERT_CHUNK_SIZE) {
      const chunk = prepared.slice(i, i + INSERT_CHUNK_SIZE);
      const placeholders = chunk.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
      const params = [];
      for (const p of chunk) {
        params.push(
          campaignId,
          p.row.name || null,
          p.row.email,
          p.row.company || null,
          p.importStatus,
          p.rowNumber
        );
      }
      await pool.query(
        `INSERT INTO campaign_leads (campaign_id, name, email, company, import_status, import_row_number)
         VALUES ${placeholders}`,
        params
      );
    }

    await pool.query(
      `UPDATE campaign_master
       SET csv_hash = ?, original_filename = ?,
           total_leads = ?, valid_leads = ?, invalid_leads = ?, duplicate_leads = ?, imported_leads = ?,
           status = 'Ready', import_completed_at = NOW()
       WHERE id = ?`,
      [csvHash, originalFilename, prepared.length, validCount, invalidCount, duplicateCount, validCount, campaignId]
    );

    await logImportEvent(
      campaignId,
      'import_completed',
      `total=${prepared.length} valid=${validCount} invalid=${invalidCount} duplicate=${duplicateCount}`
    );

    return {
      campaignId,
      totalLeads: prepared.length,
      validLeads: validCount,
      invalidLeads: invalidCount,
      duplicateLeads: duplicateCount,
      importedLeads: validCount,
    };
  } catch (err) {
    // Whatever failed, don't leave the campaign stuck in "Importing" forever —
    // partially-inserted campaign_leads rows are harmless since re-import
    // overwrites via a fresh row set keyed by campaign_id + import_row_number
    // isn't unique, so also clear out any partial rows from this attempt.
    await pool.query(`DELETE FROM campaign_leads WHERE campaign_id = ?`, [campaignId]).catch(() => {});
    await pool.query(`UPDATE campaign_master SET status = 'Draft' WHERE id = ?`, [campaignId]).catch(() => {});
    await logImportEvent(campaignId, 'import_failed', err.message, 'error');
    if (err.statusCode) throw err;
    const wrapped = new Error(`Import failed: ${err.message}`);
    wrapped.statusCode = 500;
    throw wrapped;
  }
}

module.exports = { importLeads };
