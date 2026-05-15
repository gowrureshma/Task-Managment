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
 * CORS Configuration
 */
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

/**
 * Body Parser Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Root Route
 */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Team Task Manager Backend Running Successfully'
  });
});

/**
 * Test Route
 */
app.post('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Test API Working'
  });
});

/**
 * API Routes
 */
app.use('/api', apiRoutes);

/**
 * 404 Handler
 */
app.use(notFoundHandler);

/**
 * Global Error Handler
 */
app.use(errorHandler);

/**
 * PORT
 */
const PORT = process.env.PORT || config.port || 3000;

/**
 * Start Server Function
 */
const startServer = async () => {
  try {

    /**
     * Connect MongoDB
     */
    await connectDB();

    console.log('✅ MongoDB Connected Successfully');

    /**
     * Start Express Server
     */
    app.listen(PORT, '0.0.0.0', () => {

      console.log(`
╔════════════════════════════════════════════════════════════╗
║       🚀 Team Task Manager Backend Server Started 🚀      ║
╠════════════════════════════════════════════════════════════╣
║  Port: ${PORT}
║  Environment: ${process.env.NODE_ENV || 'development'}
║  Backend Status: RUNNING
╚════════════════════════════════════════════════════════════╝
      `);

    });

  } catch (error) {

    console.error('❌ Failed to Start Server');
    console.error(error);

    process.exit(1);
  }
};

/**
 * Run Server
 */
startServer();

/**
 * Handle Unhandled Promise Rejections
 */
process.on('unhandledRejection', (err) => {

  console.error('❌ Unhandled Rejection');
  console.error(err);

  process.exit(1);
});

/**
 * Handle Uncaught Exceptions
 */
process.on('uncaughtException', (err) => {

  console.error('❌ Uncaught Exception');
  console.error(err);

  process.exit(1);
});

