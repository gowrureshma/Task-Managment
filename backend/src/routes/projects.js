const express = require('express');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
} = require('../controllers/projectController');

const router = express.Router();

/**
 * All project routes require authentication
 */
router.use(authMiddleware);

/**
 * Admin only routes
 */
router.post('/', authorize('Admin'), createProject);
router.delete('/:id', authorize('Admin'), deleteProject);

/**
 * All authenticated users
 */
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

/**
 * Project management routes
 */
router.put('/:id', updateProject);
router.post('/:id/add-member', addTeamMember);
router.delete('/:id/remove-member/:memberId', removeTeamMember);

module.exports = router;
