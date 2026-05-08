const User = require('../models/User');
const { generateToken, successResponse, errorResponse, sanitizeUser } = require('../utils/helpers');
const { validateSignup, validateLogin } = require('../utils/validators');

/**
 * Signup - Create a new user account
 * POST /api/auth/signup
 */
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    const validation = validateSignup({ name, email, password });
    if (!validation.isValid) {
      return res.status(400).json(errorResponse('Validation Error', 400, validation.errors).body);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json(errorResponse('Email already registered', 400).body);
    }

    // Create new user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'Member',
    });

    // Generate token
    const token = generateToken(newUser._id);

    const response = successResponse(
      {
        user: sanitizeUser(newUser),
        token,
      },
      'User created successfully',
      201
    );

    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * Login - Authenticate user and return token
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      return res.status(400).json(errorResponse('Validation Error', 400, validation.errors).body);
    }

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json(errorResponse('Invalid email or password', 401).body);
    }

    // Compare password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json(errorResponse('Invalid email or password', 401).body);
    }

    if (!user.isActive) {
      return res.status(403).json(errorResponse('Your account is deactivated', 403).body);
    }

    // Generate token
    const token = generateToken(user._id);

    const response = successResponse(
      {
        user: sanitizeUser(user),
        token,
      },
      'Login successful',
      200
    );

    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};

/**
 * GetMe - Get current user information
 * GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json(errorResponse('User not found', 404).body);
    }

    const response = successResponse(sanitizeUser(user), 'User retrieved successfully');
    res.status(response.statusCode).json(response.body);
  } catch (error) {
    next(error);
  }
};
