const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

/**
 * Middleware: Verify JWT token and attach user to request
 */
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login.',
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Attach user info to request
    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired.',
      });
    }

    res.status(401).json({
      success: false,
      message: 'Invalid token. Please login again.',
    });
  }
};

module.exports = authMiddleware;
