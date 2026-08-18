'use strict';

const { randomUUID } = require('crypto');
const pool = require('../db');
const { normalizeString } = require('../validators/campaignAutomation.validator');
const { cascadeShadowCampaignStatus } = require('./campaignScheduling.service');

// ── Valid status transitions ──────────────────────────────────────────────────
// Maps current status → set of statuses it may transition to via PUT.
const ALLOWED_TRANSITIONS = {
  Draft:      new Set(['Ready', 'Cancelled']),
  Ready:      new Set(['Running', 'Cancelled']),
  Running:    new Set(['Paused', 'Completed', 'Cancelled']),
  Paused:     new Set(['Running', 'Cancelled']),
  Completed:  new Set(),   // terminal — no transitions allowed
  Cancelled:  new Set(),   // terminal — no transitions allowed
  Importing:  new Set(['Cancelled']),
};

// Statuses that block any field edits
const NON_EDITABLE_STATUSES = new Set(['Completed', 'Cancelled']);

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check whether a campaign name is already taken (excluding a given id for updates).
 */
async function isNameTaken(campaignName, excludeId = null) {
  const sql = excludeId
    ? 'SELECT id FROM campaign_master WHERE campaign_name = ? AND id != ? AND deleted_at IS NULL LIMIT 1'
    : 'SELECT id FROM campaign_master WHERE campaign_name = ? AND deleted_at IS NULL LIMIT 1';
  const params = excludeId ? [campaignName, excludeId] : [campaignName];
  const { rows } = await pool.query(sql, params);
  return rows.length > 0;
}

/**
 * Fetch a single campaign by id.
 * Returns the row or null.
 */
async function findById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM campaign_master WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

// ── CREATE ────────────────────────────────────────────────────────────────────

async function createCampaign({ campaignName, description, scheduleType, uploadedBy }) {
  const name = normalizeString(campaignName);
  const desc = description ? normalizeString(description) : null;
  const stype = scheduleType || null;
  const uid = uploadedBy ? parseInt(uploadedBy, 10) : null;

  if (await isNameTaken(name)) {
    const err = new Error(`A campaign named "${name}" already exists`);
    err.statusCode = 409;
    throw err;
  }

  const uuid = randomUUID();

  const { insertId } = await pool.query(
    `INSERT INTO campaign_master
       (uuid, campaign_name, description, schedule_type, uploaded_by, status)
     VALUES (?, ?, ?, ?, ?, 'Draft')`,
    [uuid, name, desc, stype, uid]
  );

  console.log(`[CAMPAIGN_AUTO] Created campaign id=${insertId} name="${name}" uploadedBy=${uid}`);

  return findById(insertId);
}

// ── LIST ──────────────────────────────────────────────────────────────────────

async function listCampaigns({ page = 1, limit = 20, status, search }) {
  const offset = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(100, Math.max(1, parseInt(limit, 10)));
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));

  const conditions = ['deleted_at IS NULL'];
  const params = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  if (search) {
    conditions.push('campaign_name LIKE ?');
    params.push(`%${normalizeString(search)}%`);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const [{ rows: countRows }, { rows: items }] = await Promise.all([
    pool.query(`SELECT COUNT(*) AS total FROM campaign_master ${where}`, params),
    pool.query(
      `SELECT
         id, uuid, campaign_name, description, schedule_type, status,
         uploaded_by, total_leads, valid_leads, invalid_leads, duplicate_leads,
         imported_leads, batch_no, next_schedule_at, completed_at,
         import_started_at, import_completed_at, created_at, updated_at
       FROM campaign_master
       ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, safeLimit, offset]
    ),
  ]);

  return {
    total: parseInt(countRows[0].total, 10),
    page: Math.max(1, parseInt(page, 10)),
    limit: safeLimit,
    items,
  };
}

// ── GET ONE ───────────────────────────────────────────────────────────────────

async function getCampaignById(id) {
  const campaign = await findById(id);
  if (!campaign) {
    const err = new Error('Campaign not found');
    err.statusCode = 404;
    throw err;
  }

  // Lead counts come from campaign_master counters (populated during import — zero until then)
  const stats = {
    total_leads:     campaign.total_leads     || 0,
    valid_leads:     campaign.valid_leads     || 0,
    invalid_leads:   campaign.invalid_leads   || 0,
    duplicate_leads: campaign.duplicate_leads || 0,
    imported_leads:  campaign.imported_leads  || 0,
  };

  return { ...campaign, stats };
}

// ── UPDATE ────────────────────────────────────────────────────────────────────

async function updateCampaign(id, { campaignName, description, scheduleType, status }) {
  const campaign = await findById(id);
  if (!campaign) {
    const err = new Error('Campaign not found');
    err.statusCode = 404;
    throw err;
  }

  if (NON_EDITABLE_STATUSES.has(campaign.status)) {
    const err = new Error(`Campaign with status "${campaign.status}" cannot be edited`);
    err.statusCode = 409;
    throw err;
  }

  // Validate status transition if a new status was supplied
  if (status && status !== campaign.status) {
    const allowed = ALLOWED_TRANSITIONS[campaign.status];
    if (!allowed || !allowed.has(status)) {
      const err = new Error(
        `Invalid status transition: "${campaign.status}" → "${status}". ` +
        `Allowed: ${allowed && allowed.size ? [...allowed].join(', ') : 'none'}`
      );
      err.statusCode = 409;
      throw err;
    }
  }

  // Build SET clause dynamically — only update supplied fields
  const setClauses = [];
  const params = [];

  if (campaignName !== undefined) {
    const name = normalizeString(campaignName);
    if (await isNameTaken(name, id)) {
      const err = new Error(`A campaign named "${name}" already exists`);
      err.statusCode = 409;
      throw err;
    }
    setClauses.push('campaign_name = ?');
    params.push(name);
  }

  if (description !== undefined) {
    setClauses.push('description = ?');
    params.push(description ? normalizeString(description) : null);
  }

  if (scheduleType !== undefined) {
    setClauses.push('schedule_type = ?');
    params.push(scheduleType || null);
  }

  if (status !== undefined && status !== campaign.status) {
    setClauses.push('status = ?');
    params.push(status);

    // Stamp completed_at when transitioning to Completed
    if (status === 'Completed') {
      setClauses.push('completed_at = NOW()');
    }
  }

  if (setClauses.length === 0) {
    // Nothing to update — return current record as-is
    return campaign;
  }

  params.push(id);
  await pool.query(
    `UPDATE campaign_master SET ${setClauses.join(', ')} WHERE id = ?`,
    params
  );

  console.log(`[CAMPAIGN_AUTO] Updated campaign id=${id} fields=[${setClauses.join(', ')}]`);

  return findById(id);
}

// ── PAUSE ─────────────────────────────────────────────────────────────────────

async function pauseCampaign(id) {
  const campaign = await findById(id);
  if (!campaign) {
    const err = new Error('Campaign not found');
    err.statusCode = 404;
    throw err;
  }

  if (campaign.status !== 'Running') {
    const err = new Error(`Only Running campaigns can be paused. Current status: "${campaign.status}"`);
    err.statusCode = 409;
    throw err;
  }

  await pool.query(
    `UPDATE campaign_master SET status = 'Paused' WHERE id = ?`,
    [id]
  );
  await cascadeShadowCampaignStatus(id, 'Paused').catch((err) =>
    console.error(`[CAMPAIGN_AUTO] Failed to cascade Paused status for campaign id=${id}:`, err.message)
  );

  console.log(`[CAMPAIGN_AUTO] Paused campaign id=${id} (cascaded to shadow campaigns)`);

  return findById(id);
}

// ── RESUME ────────────────────────────────────────────────────────────────────

async function resumeCampaign(id) {
  const campaign = await findById(id);
  if (!campaign) {
    const err = new Error('Campaign not found');
    err.statusCode = 404;
    throw err;
  }

  if (campaign.status !== 'Paused') {
    const err = new Error(`Only Paused campaigns can be resumed. Current status: "${campaign.status}"`);
    err.statusCode = 409;
    throw err;
  }

  await pool.query(
    `UPDATE campaign_master SET status = 'Running' WHERE id = ?`,
    [id]
  );
  await cascadeShadowCampaignStatus(id, 'Running').catch((err) =>
    console.error(`[CAMPAIGN_AUTO] Failed to cascade Running status for campaign id=${id}:`, err.message)
  );

  console.log(`[CAMPAIGN_AUTO] Resumed campaign id=${id} (cascaded to shadow campaigns)`);

  return findById(id);
}

// ── DELETE (soft) ─────────────────────────────────────────────────────────────

async function deleteCampaign(id) {
  const campaign = await findById(id);
  if (!campaign) {
    const err = new Error('Campaign not found');
    err.statusCode = 404;
    throw err;
  }

  if (campaign.status === 'Running') {
    const err = new Error('Running campaigns cannot be deleted. Pause or cancel it first.');
    err.statusCode = 409;
    throw err;
  }

  // Soft delete — preserve all data for audit/analytics. Clear csv_hash so
  // its UNIQUE constraint doesn't block re-importing the same file into a
  // new campaign later (the constraint has no concept of soft-delete).
  await pool.query(
    `UPDATE campaign_master SET deleted_at = NOW(), csv_hash = NULL WHERE id = ?`,
    [id]
  );
  await cascadeShadowCampaignStatus(id, 'Cancelled').catch((err) =>
    console.error(`[CAMPAIGN_AUTO] Failed to cascade Cancelled status for campaign id=${id}:`, err.message)
  );

  console.log(`[CAMPAIGN_AUTO] Soft-deleted campaign id=${id} name="${campaign.campaign_name}" (cascaded to shadow campaigns)`);

  return { id, campaign_name: campaign.campaign_name };
}

module.exports = {
  createCampaign,
  listCampaigns,
  getCampaignById,
  updateCampaign,
  pauseCampaign,
  resumeCampaign,
  deleteCampaign,
};
