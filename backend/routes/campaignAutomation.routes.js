'use strict';

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/campaignAutomation.controller');
const { uploadLarge } = require('../middleware/uploadLarge');

// All routes are protected by the global auth middleware applied in server.js
// to every /api/* path — no need to re-apply it here.

router.post('/',              ctrl.create);   // Create campaign
router.get('/',               ctrl.list);     // List campaigns (paginated)
router.get('/:id',            ctrl.getOne);   // Get single campaign
router.put('/:id',            ctrl.update);   // Update campaign
router.patch('/:id/pause',    ctrl.pause);    // Pause  (Running → Paused)
router.patch('/:id/resume',   ctrl.resume);   // Resume (Paused  → Running)
router.delete('/:id',         ctrl.remove);   // Soft delete

router.post('/:id/import',    uploadLarge.single('file'), ctrl.importLeads); // Bulk CSV/XLSX lead import (Draft → Ready)
router.post('/:id/start',     ctrl.start);     // Assign senders/template, go Ready → Running
router.get('/:id/progress',   ctrl.progress);  // Per-sender batch/send progress

module.exports = router;
