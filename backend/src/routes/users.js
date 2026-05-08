const express = require('express');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  getTeamMembers 
} = require('../controllers/userController');

const router = express.Router();

/**
 * All user routes require authentication
 */
router.use(authMiddleware);

/**
 * Admin routes
 */
router.get('/', authorize('Admin'), getAllUsers);

/**
 * All authenticated users
 */
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.get('/team/:projectId', getTeamMembers);

module.exports = router;
