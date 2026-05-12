const express = require('express');
const router = express.Router();
const repliesController = require('../controllers/replies.controller');

router.post('/api/replies/check', repliesController.checkRepliesHandler);
router.post('/api/replies/sync', repliesController.syncRepliesHandler);

module.exports = router;
