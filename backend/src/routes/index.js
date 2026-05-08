const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const projectRoutes = require('./projects');
const taskRoutes = require('./tasks');

const router = express.Router();

/**
 * Enable CORS and JSON parsing for all API routes
 */
router.use(cors());
router.use(express.json());

/**
 * API routes
 */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
