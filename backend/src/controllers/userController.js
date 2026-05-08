const User = require('../models/User');
const { successResponse, errorResponse, sanitizeUser } = require('../utils/helpers');

/**
 * Get all users (Admin only)
 * GET /api/users
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isActive: true }).select('-password');

    const response = successResponse(users, 'Users retrieved successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 * GET /api/users/:id
 */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json(errorResponse('User not found', 404).body);
    }

    const response = successResponse(user, 'User retrieved successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * PUT /api/users/:id
 */
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.params.id;

    // Check if user is updating own profile or is admin
    if (req.user._id.toString() !== userId && req.user.role !== 'Admin') {
      return res.status(403).json(errorResponse('Not authorized to update this user', 403).body);
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json(errorResponse('Email already in use', 400).body);
      }
      updateData.email = email.toLowerCase();
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json(errorResponse('User not found', 404).body);
    }

    const response = successResponse(updatedUser, 'User updated successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Get team members for a project
 * GET /api/users/team/:projectId
 */
exports.getTeamMembers = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const Project = require('../models/Project');

    const project = await Project.findById(projectId).populate('teamMembers', 'name email role');

    if (!project) {
      return res.status(404).json(errorResponse('Project not found', 404).body);
    }

    const response = successResponse(project.teamMembers, 'Team members retrieved successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};
