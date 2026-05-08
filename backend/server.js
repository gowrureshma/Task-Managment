require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const config = require('./src/config');
const apiRoutes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');
const notFoundHandler = require('./src/middleware/notFoundHandler');

const app = express();

/**
 * Connect to MongoDB
 */
connectDB();

/**
 * Middleware
 */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * API Routes
 */
app.use('/api', apiRoutes);

/**
 * 404 Handler
 */
app.use(notFoundHandler);

/**
 * Error Handler (must be last)
 */
app.use(errorHandler);

/**
 * Start Server
 */
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║       🚀 Team Task Manager Backend Server Started 🚀      ║
╠════════════════════════════════════════════════════════════╣
║  Server:    http://localhost:${PORT}                             ║
║  API Docs:  http://localhost:${PORT}/api/health                 ║
║  Database:  ${config.mongodbUri}
║  Environment: ${config.nodeEnv}                           ║
╚════════════════════════════════════════════════════════════╝
  `);
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (err) => {
  console.error(`✗ Unhandled Rejection: ${err.message}`);
  process.exit(1);
});
