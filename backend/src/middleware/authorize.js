/**
 * Middleware: Check if user has specific role
 * @param {string|string[]} roles - Role(s) required to access the route
 */
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated.',
      });
    }

    // Convert single role to array
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${requiredRoles.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = authorize;
