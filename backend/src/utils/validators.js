const validator = require('validator');

/**
 * Validate user input for signup
 */
const validateSignup = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email || !validator.isEmail(data.email)) {
    errors.email = 'Please provide a valid email';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate user input for login
 */
const validateLogin = (data) => {
  const errors = {};

  if (!data.email || !validator.isEmail(data.email)) {
    errors.email = 'Please provide a valid email';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate project input
 */
const validateProject = (data) => {
  const errors = {};

  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Project title must be at least 3 characters';
  }

  if (data.description && data.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate task input
 */
const validateTask = (data) => {
  const errors = {};

  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Task title must be at least 3 characters';
  }

  if (data.description && data.description.length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters';
  }

  if (!data.assignedTo) {
    errors.assignedTo = 'Task must be assigned to a user';
  }

  if (!data.projectId) {
    errors.projectId = 'Task must belong to a project';
  }

  if (data.status && !['Pending', 'In Progress', 'Completed'].includes(data.status)) {
    errors.status = 'Invalid status';
  }

  if (data.priority && !['Low', 'Medium', 'High'].includes(data.priority)) {
    errors.priority = 'Invalid priority';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate task status update
 */
const validateTaskStatusUpdate = (data) => {
  const errors = {};

  if (!data.status || !['Pending', 'In Progress', 'Completed'].includes(data.status)) {
    errors.status = 'Invalid status. Must be one of: Pending, In Progress, Completed';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateSignup,
  validateLogin,
  validateProject,
  validateTask,
  validateTaskStatusUpdate,
};
