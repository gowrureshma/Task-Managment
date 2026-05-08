const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

/**
 * Format success response
 */
const successResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    statusCode,
    body: {
      success: true,
      message,
      data,
    },
  };
};

/**
 * Format error response
 */
const errorResponse = (message = 'Error', statusCode = 400, errors = null) => {
  return {
    statusCode,
    body: {
      success: false,
      message,
      ...(errors && { errors }),
    },
  };
};

/**
 * Sanitize user object for response (remove sensitive data)
 */
const sanitizeUser = (user) => {
  const { password, ...sanitized } = user.toObject();
  return sanitized;
};

module.exports = {
  generateToken,
  successResponse,
  errorResponse,
  sanitizeUser,
};
