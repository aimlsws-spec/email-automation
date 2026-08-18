'use strict';

const service = require('../services/campaignAutomation.service');
const importService = require('../services/campaignImport.service');
const schedulingService = require('../services/campaignScheduling.service');
const { validateCreate, validateUpdate, validateId } = require('../validators/campaignAutomation.validator');

// ── Shared error responder ────────────────────────────────────────────────────
function handleError(res, err) {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  if (status === 500) {
    console.error('[CAMPAIGN_AUTO] Unhandled error:', err);
  }
  return res.status(status).json({ success: false, error: message });
}

// ── POST /api/campaign-automation ─────────────────────────────────────────────
exports.create = async (req, res) => {
  const validation = validateCreate(req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, errors: validation.errors });
  }

  try {
    const campaign = await service.createCampaign({
      campaignName: req.body.campaignName,
      description:  req.body.description,
      scheduleType: req.body.scheduleType,
      uploadedBy:   req.body.uploadedBy ?? req.user?.id ?? null,
    });
    return res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    return handleError(res, err);
  }
};

// ── GET /api/campaign-automation ──────────────────────────────────────────────
exports.list = async (req, res) => {
  try {
    const result = await service.listCampaigns({
      page:   req.query.page,
      limit:  req.query.limit,
      status: req.query.status,
      search: req.query.search,
    });
    return res.json({ success: true, ...result });
  } catch (err) {
    return handleError(res, err);
  }
};

// ── GET /api/campaign-automation/:id ─────────────────────────────────────────
exports.getOne = async (req, res) => {
  const id = validateId(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, error: 'Invalid campaign ID' });
  }

  try {
    const campaign = await service.getCampaignById(id);
    return res.json({ success: true, data: campaign });
  } catch (err) {
    return handleError(res, err);
  }
};

// ── PUT /api/campaign-automation/:id ─────────────────────────────────────────
exports.update = async (req, res) => {
  const id = validateId(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, error: 'Invalid campaign ID' });
  }

  const validation = validateUpdate(req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, errors: validation.errors });
  }

  try {
    const campaign = await service.updateCampaign(id, {
      campaignName: req.body.campaignName,
      description:  req.body.description,
      scheduleType: req.body.scheduleType,
      status:       req.body.status,
    });
    return res.json({ success: true, data: campaign });
  } catch (err) {
    return handleError(res, err);
  }
};

// ── PATCH /api/campaign-automation/:id/pause ─────────────────────────────────
exports.pause = async (req, res) => {
  const id = validateId(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, error: 'Invalid campaign ID' });
  }

  try {
    const campaign = await service.pauseCampaign(id);
    console.log(`[CAMPAIGN_AUTO] Campaign Paused id=${id}`);
    return res.json({ success: true, data: campaign });
  } catch (err) {
    return handleError(res, err);
  }
};

// ── PATCH /api/campaign-automation/:id/resume ────────────────────────────────
exports.resume = async (req, res) => {
  const id = validateId(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, error: 'Invalid campaign ID' });
  }

  try {
    const campaign = await service.resumeCampaign(id);
    console.log(`[CAMPAIGN_AUTO] Campaign Resumed id=${id}`);
    return res.json({ success: true, data: campaign });
  } catch (err) {
    return handleError(res, err);
  }
};

// ── DELETE /api/campaign-automation/:id ──────────────────────────────────────
exports.remove = async (req, res) => {
  const id = validateId(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, error: 'Invalid campaign ID' });
  }

  try {
    const result = await service.deleteCampaign(id);
    console.log(`[CAMPAIGN_AUTO] Campaign Deleted id=${id}`);
    return res.json({
      success: true,
      message: `Campaign "${result.campaign_name}" deleted successfully`,
      data: result,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

// ── POST /api/campaign-automation/:id/import ─────────────────────────────────
exports.importLeads = async (req, res) => {
  const id = validateId(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, error: 'Invalid campaign ID' });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  try {
    const result = await importService.importLeads(id, {
      buffer: req.file.buffer,
      originalFilename: req.file.originalname,
      userId: req.user?.id ?? null,
    });
    return res.json({ success: true, data: result });
  } catch (err) {
    return handleError(res, err);
  }
};

// ── POST /api/campaign-automation/:id/start ──────────────────────────────────
exports.start = async (req, res) => {
  const id = validateId(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, error: 'Invalid campaign ID' });
  }

  try {
    const result = await schedulingService.startCampaign(id, {
      senders: req.body.senders,
      scheduleType: req.body.scheduleType,
      userId: req.user?.id ?? null,
    });
    return res.json({ success: true, data: result });
  } catch (err) {
    return handleError(res, err);
  }
};

// ── GET /api/campaign-automation/:id/progress ────────────────────────────────
exports.progress = async (req, res) => {
  const id = validateId(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, error: 'Invalid campaign ID' });
  }

  try {
    const senders = await schedulingService.getCampaignProgress(id, req.user?.id ?? null);
    return res.json({ success: true, data: senders });
  } catch (err) {
    return handleError(res, err);
  }
};
