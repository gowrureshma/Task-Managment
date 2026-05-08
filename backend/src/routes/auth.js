const express = require('express');
const authMiddleware = require('../middleware/auth');
const { signup, login, getMe } = require('../controllers/authController');

const router = express.Router();

/**
 * Public routes
 */
router.post('/signup', signup);
router.post('/login', login);

/**
 * Protected routes
 */
router.get('/me', authMiddleware, getMe);

module.exports = router;
