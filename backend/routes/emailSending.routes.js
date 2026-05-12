const express = require('express');
const router = express.Router();
const emailSendingController = require('../controllers/emailSending.controller');

router.post('/api/send-bulk-initial', emailSendingController.sendBulkInitial);

module.exports = router;
