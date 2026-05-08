const Project = require('../models/Project');
const Task = require('../models/Task');
const { successResponse, errorResponse } = require('../utils/helpers');
const { validateProject } = require('../utils/validators');

/**
 * Create a new project (Admin only)
 * POST /api/projects
 */
exports.createProject = async (req, res, next) => {
  try {
    const { title, description, teamMembers, dueDate } = req.body;

    // Validate input
    const validation = validateProject({ title, description });
    if (!validation.isValid) {
      return res.status(400).json(errorResponse('Validation Error', 400, validation.errors).body);
    }

    const newProject = await Project.create({
      title,
      description,
      createdBy: req.userId,
      teamMembers: teamMembers || [req.userId],
      dueDate,
    });

    await newProject.populate('createdBy teamMembers', 'name email role');

    const response = successResponse(newProject, 'Project created successfully', 201);
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all projects
 * GET /api/projects
 */
exports.getAllProjects = async (req, res, next) => {
  try {
    let query = {};

    // If user is Member, only show projects they're part of
    if (req.user.role === 'Member') {
      query = {
        $or: [{ createdBy: req.userId }, { teamMembers: req.userId }],
      };
    }

    const projects = await Project.find(query)
      .populate('createdBy teamMembers', 'name email role')
      .sort({ createdAt: -1 });

    const response = successResponse(projects, 'Projects retrieved successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Get single project by ID
 * GET /api/projects/:id
 */
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy teamMembers', 'name email role');

    if (!project) {
      return res.status(404).json(errorResponse('Project not found', 404).body);
    }

    // Check authorization
    const isMember = project.teamMembers.some((member) => member._id.toString() === req.userId);
    const isCreator = project.createdBy._id.toString() === req.userId;
    const isAdmin = req.user.role === 'Admin';

    if (!isMember && !isCreator && !isAdmin) {
      return res.status(403).json(errorResponse('Not authorized to view this project', 403).body);
    }

    const response = successResponse(project, 'Project retrieved successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Update project (Admin or creator only)
 * PUT /api/projects/:id
 */
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json(errorResponse('Project not found', 404).body);
    }

    // Check authorization
    if (project.createdBy.toString() !== req.userId && req.user.role !== 'Admin') {
      return res.status(403).json(errorResponse('Not authorized to update this project', 403).body);
    }

    const { title, description, teamMembers, status, dueDate } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (teamMembers) updateData.teamMembers = teamMembers;
    if (status) updateData.status = status;
    if (dueDate) updateData.dueDate = dueDate;

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('createdBy teamMembers', 'name email role');

    const response = successResponse(updatedProject, 'Project updated successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete project (Admin or creator only)
 * DELETE /api/projects/:id
 */
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json(errorResponse('Project not found', 404).body);
    }

    // Check authorization
    if (project.createdBy.toString() !== req.userId && req.user.role !== 'Admin') {
      return res.status(403).json(errorResponse('Not authorized to delete this project', 403).body);
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ projectId: req.params.id });

    await Project.findByIdAndDelete(req.params.id);

    const response = successResponse(null, 'Project deleted successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Add team member to project
 * POST /api/projects/:id/add-member
 */
exports.addTeamMember = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json(errorResponse('Project not found', 404).body);
    }

    // Check authorization
    if (project.createdBy.toString() !== req.userId && req.user.role !== 'Admin') {
      return res.status(403).json(errorResponse('Not authorized to manage this project', 403).body);
    }

    // Check if user already is a member
    if (project.teamMembers.includes(userId)) {
      return res.status(400).json(errorResponse('User is already a member', 400).body);
    }

    project.teamMembers.push(userId);
    await project.save();
    await project.populate('createdBy teamMembers', 'name email role');

    const response = successResponse(project, 'Team member added successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Remove team member from project
 * DELETE /api/projects/:id/remove-member/:memberId
 */
exports.removeTeamMember = async (req, res, next) => {
  try {
    const { id, memberId } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json(errorResponse('Project not found', 404).body);
    }

    // Check authorization
    if (project.createdBy.toString() !== req.userId && req.user.role !== 'Admin') {
      return res.status(403).json(errorResponse('Not authorized to manage this project', 403).body);
    }

    project.teamMembers = project.teamMembers.filter((member) => member.toString() !== memberId);
    await project.save();
    await project.populate('createdBy teamMembers', 'name email role');

    const response = successResponse(project, 'Team member removed successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};
