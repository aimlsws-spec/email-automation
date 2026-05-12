const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const uploadController = require('../controllers/upload.controller');

router.post('/api/upload-leads', upload.single('file'), uploadController.uploadLeads);
router.post('/send-emails', upload.single('file'), uploadController.sendEmails);
router.post('/api/send-initial-email', uploadController.sendInitialEmail);

module.exports = router;
