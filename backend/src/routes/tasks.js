const express = require('express');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const {
  createTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats,
  getProjectStats,
  addComment,
} = require('../controllers/taskController');

const router = express.Router();

/**
 * All task routes require authentication
 */
router.use(authMiddleware);

/**
 * Stats routes
 */
router.get('/stats/dashboard', getTaskStats);
router.get('/stats/project/:projectId', getProjectStats);

/**
 * Admin routes
 */
router.post('/', authorize('Admin'), createTask);

/**
 * All authenticated users
 */
router.get('/', getAllTasks);
router.get('/user/assigned', getMyTasks);
router.get('/:id', getTaskById);

/**
 * Task management routes
 */
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);

/**
 * Comment routes
 */
router.post('/:id/comments', addComment);

module.exports = router;
