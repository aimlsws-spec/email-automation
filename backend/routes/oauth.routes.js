const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauth.controller');

router.get('/auth/google/connect/:email', oauthController.connectGoogleAccount);
router.get('/auth/google/callback', oauthController.googleCallback);

module.exports = router;
