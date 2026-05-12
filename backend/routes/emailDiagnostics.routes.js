const express = require('express');
const router = express.Router();
const emailDiagnosticsController = require('../controllers/emailDiagnostics.controller');

router.post('/api/test-email', emailDiagnosticsController.testEmail);
router.post('/api/smtp-diagnostic', emailDiagnosticsController.smtpDiagnostic);
router.get('/test-gmail', emailDiagnosticsController.testGmail);

module.exports = router;
