'use strict';

const VALID_SCHEDULE_TYPES = ['daily', 'alternate_day', 'weekly'];
const HTML_TAG_RE = /<[^>]+>/;

/**
 * Strip leading/trailing whitespace and collapse internal runs of whitespace.
 */
function normalizeString(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\s+/g, ' ');
}

/**
 * Validate body for POST /api/campaign-automation (create).
 * Returns { valid: true } or { valid: false, errors: [...] }
 */
function validateCreate(body) {
  const errors = [];

  // ── campaignName ──────────────────────────────────────────────────────────
  const name = normalizeString(body.campaignName);
  if (!name) {
    errors.push('campaignName is required');
  } else if (name.length < 3) {
    errors.push('campaignName must be at least 3 characters');
  } else if (name.length > 150) {
    errors.push('campaignName must not exceed 150 characters');
  }

  // ── description ───────────────────────────────────────────────────────────
  if (body.description !== undefined && body.description !== null) {
    const desc = normalizeString(body.description);
    if (desc.length > 1000) {
      errors.push('description must not exceed 1000 characters');
    }
    if (HTML_TAG_RE.test(desc)) {
      errors.push('description must not contain HTML tags');
    }
  }

  // ── scheduleType ──────────────────────────────────────────────────────────
  if (body.scheduleType !== undefined && body.scheduleType !== null && body.scheduleType !== '') {
    if (!VALID_SCHEDULE_TYPES.includes(body.scheduleType)) {
      errors.push(`scheduleType must be one of: ${VALID_SCHEDULE_TYPES.join(', ')}`);
    }
  }

  // ── uploadedBy ────────────────────────────────────────────────────────────
  if (body.uploadedBy !== undefined && body.uploadedBy !== null) {
    const uid = parseInt(body.uploadedBy, 10);
    if (isNaN(uid) || uid <= 0) {
      errors.push('uploadedBy must be a positive integer');
    }
  }

  return errors.length ? { valid: false, errors } : { valid: true };
}

/**
 * Validate body for PUT /api/campaign-automation/:id (update).
 * All fields are optional — only validate what is present.
 */
function validateUpdate(body) {
  const errors = [];

  if (body.campaignName !== undefined) {
    const name = normalizeString(body.campaignName);
    if (!name) {
      errors.push('campaignName must not be empty');
    } else if (name.length < 3) {
      errors.push('campaignName must be at least 3 characters');
    } else if (name.length > 150) {
      errors.push('campaignName must not exceed 150 characters');
    }
  }

  if (body.description !== undefined && body.description !== null) {
    const desc = normalizeString(body.description);
    if (desc.length > 1000) {
      errors.push('description must not exceed 1000 characters');
    }
    if (HTML_TAG_RE.test(desc)) {
      errors.push('description must not contain HTML tags');
    }
  }

  if (body.scheduleType !== undefined && body.scheduleType !== null && body.scheduleType !== '') {
    if (!VALID_SCHEDULE_TYPES.includes(body.scheduleType)) {
      errors.push(`scheduleType must be one of: ${VALID_SCHEDULE_TYPES.join(', ')}`);
    }
  }

  return errors.length ? { valid: false, errors } : { valid: true };
}

/**
 * Parse and validate a route :id param.
 * Returns the integer on success, or null on failure.
 */
function validateId(id) {
  const parsed = parseInt(id, 10);
  if (isNaN(parsed) || parsed <= 0) return null;
  return parsed;
}

module.exports = { validateCreate, validateUpdate, validateId, normalizeString, VALID_SCHEDULE_TYPES };
