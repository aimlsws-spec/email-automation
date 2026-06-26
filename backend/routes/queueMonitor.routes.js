'use strict';

const express = require('express');
const router  = express.Router();
const {
  getStats,
  getSenders,
  getList,
  getFollowupList,
  deleteQueueItems,
  deleteFollowupItems,
} = require('../controllers/queueMonitor.controller');

function logReq(label) {
  return (req, res, next) => {
    console.log(`[QUEUE_API] Request:  ${label} ${JSON.stringify(req.query)}`);
    const origJson = res.json.bind(res);
    res.json = (body) => {
      console.log(`[QUEUE_API] Response: ${label} success=${body?.success} items=${body?.data ? (Array.isArray(body.data) ? body.data.length : 'object') : 'n/a'}`);
      return origJson(body);
    };
    next();
  };
}

router.get('/api/queue/stats',         logReq('GET /api/queue/stats'),         getStats);
router.get('/api/queue/senders',       logReq('GET /api/queue/senders'),       getSenders);
router.get('/api/queue/list',          logReq('GET /api/queue/list'),          getList);
router.get('/api/followup-queue/list', logReq('GET /api/followup-queue/list'), getFollowupList);

router.delete('/api/queue/items',          deleteQueueItems);
router.delete('/api/followup-queue/items', deleteFollowupItems);

module.exports = router;
