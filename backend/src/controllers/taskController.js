const Task = require('../models/Task');
const Project = require('../models/Project');
const { successResponse, errorResponse } = require('../utils/helpers');
const { validateTask, validateTaskStatusUpdate } = require('../utils/validators');

/**
 * Create a new task (Admin only)
 * POST /api/tasks
 */
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

    // Validate input
    const validation = validateTask({ title, description, projectId, assignedTo });
    if (!validation.isValid) {
      return res.status(400).json(errorResponse('Validation Error', 400, validation.errors).body);
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json(errorResponse('Project not found', 404).body);
    }

    // Note: Removed team member validation - admins can assign to any user

    const newTask = await Task.create({
      title,
      description,
      projectId,
      assignedTo,
      createdBy: req.userId,
      priority: priority || 'Medium',
      dueDate,
    });

    await newTask.populate('assignedTo createdBy projectId', 'name email role title');

    const response = successResponse(newTask, 'Task created successfully', 201);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all tasks with filters
 * GET /api/tasks?projectId=xxx&assignedTo=xxx&status=xxx
 */
exports.getAllTasks = async (req, res, next) => {
  try {
    const { projectId, assignedTo, status } = req.query;
    let query = {};

    // Apply filters
    if (projectId) {
      query.projectId = projectId;
    }

    if (status) {
      query.status = status;
    }

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    // If user is Member, only show tasks assigned to them or created by them
    if (req.user.role === 'Member') {
      query = {
        ...query,
        $or: [{ assignedTo: req.userId }, { createdBy: req.userId }],
      };
    }

    const tasks = await Task.find(query)
      .populate('assignedTo createdBy projectId', 'name email role title')
      .sort({ dueDate: 1, createdAt: -1 });

    const response = successResponse(tasks, 'Tasks retrieved successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Get tasks for current user
 * GET /api/tasks/user/assigned
 */
exports.getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedTo: req.userId })
      .populate('assignedTo createdBy projectId', 'name email role title')
      .sort({ dueDate: 1 });

    const response = successResponse(tasks, 'Your tasks retrieved successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Get single task by ID
 * GET /api/tasks/:id
 */
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      'assignedTo createdBy projectId',
      'name email role title'
    );

    if (!task) {
      return res.status(404).json(errorResponse('Task not found', 404).body);
    }

    // Check authorization
    if (
      req.user.role === 'Member' &&
      task.assignedTo._id.toString() !== req.userId &&
      task.createdBy._id.toString() !== req.userId
    ) {
      return res.status(403).json(errorResponse('Not authorized to view this task', 403).body);
    }

    const response = successResponse(task, 'Task retrieved successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Update task (Admin or creator only for most fields)
 * PUT /api/tasks/:id
 */
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json(errorResponse('Task not found', 404).body);
    }

    const { title, description, priority, dueDate, status } = req.body;

    // Members can only update status
    if (req.user.role === 'Member') {
      if (task.assignedTo.toString() !== req.userId) {
        return res.status(403).json(errorResponse('Not authorized to update this task', 403).body);
      }

      if (status) {
        const validation = validateTaskStatusUpdate({ status });
        if (!validation.isValid) {
          return res
            .status(400)
            .json(errorResponse('Validation Error', 400, validation.errors).body);
        }
        task.status = status;
      }
    } else {
      // Admin can update all fields
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (priority) task.priority = priority;
      if (dueDate) task.dueDate = dueDate;
      if (status) task.status = status;
    }

    await task.save();
    await task.populate('assignedTo createdBy projectId', 'name email role title');

    const response = successResponse(task, 'Task updated successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Update task status (Members can use this)
 * PATCH /api/tasks/:id/status
 */
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validation = validateTaskStatusUpdate({ status });
    if (!validation.isValid) {
      return res.status(400).json(errorResponse('Validation Error', 400, validation.errors).body);
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json(errorResponse('Task not found', 404).body);
    }

    // Only assigned user can update status
    if (task.assignedTo.toString() !== req.userId && req.user.role !== 'Admin') {
      return res.status(403).json(errorResponse('Not authorized to update this task', 403).body);
    }

    task.status = status;
    await task.save();
    await task.populate('assignedTo createdBy projectId', 'name email role title');

    const response = successResponse(task, 'Task status updated successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete task (Admin or creator only)
 * DELETE /api/tasks/:id
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json(errorResponse('Task not found', 404).body);
    }

    // Check authorization
    if (task.createdBy.toString() !== req.userId && req.user.role !== 'Admin') {
      return res.status(403).json(errorResponse('Not authorized to delete this task', 403).body);
    }

    await Task.findByIdAndDelete(req.params.id);

    const response = successResponse(null, 'Task deleted successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Get task statistics for dashboard
 * GET /api/tasks/stats/dashboard
 */
exports.getTaskStats = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Get all tasks assigned to user
    const assignedTasks = await Task.find({ assignedTo: userId });

    const totalTasks = assignedTasks.length;
    const completedTasks = assignedTasks.filter((t) => t.status === 'Completed').length;
    const pendingTasks = assignedTasks.filter((t) => t.status === 'Pending').length;
    const inProgressTasks = assignedTasks.filter((t) => t.status === 'In Progress').length;
    const overdueTasks = assignedTasks.filter((t) => t.isOverdue).length;

    const stats = {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };

    const response = successResponse(stats, 'Task statistics retrieved successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Get project statistics
 * GET /api/tasks/stats/project/:projectId
 */
exports.getProjectStats = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ projectId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
    const overdueTasks = tasks.filter((t) => t.isOverdue).length;

    const stats = {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      completionPercentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };

    const response = successResponse(stats, 'Project statistics retrieved successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Add comment to task
 * POST /api/tasks/:id/comments
 */
exports.addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json(errorResponse('Comment text is required', 400).body);
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json(errorResponse('Task not found', 404).body);
    }

    // Authorization: assigned user, creator, or admin can comment
    const isAuthorized =
      task.assignedTo.toString() === req.userId ||
      task.createdBy.toString() === req.userId ||
      req.user.role === 'Admin';

    if (!isAuthorized) {
      return res.status(403).json(errorResponse('Not authorized to comment on this task', 403).body);
    }

    task.comments.push({
      userId: req.userId,
      text: text.trim(),
      createdAt: new Date(),
    });

    await task.save();

    // Populate comment user info
    await task.populate('comments.userId', 'name email role');

    const response = successResponse(task, 'Comment added successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};
