const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

router.post('/api/auth/register', AuthController.register);
router.post('/api/auth/login', AuthController.login);
router.post('/api/auth/forgot-password', AuthController.forgotPassword);
router.post('/api/auth/reset-password', AuthController.resetPassword);
router.get('/api/auth/profile', authMiddleware, AuthController.getProfile);

module.exports = router;
