// dotenv is a no-op when variables are already present in the environment
// (e.g. Railway injects them directly), but it is safe to call here so that
// local development still works with a .env file.
require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

// In production the URI must be supplied by the platform (Railway).
// Falling back to localhost in production would silently connect to a
// non-existent host, so we fail fast instead.
if (isProduction && !process.env.MONGODB_URI) {
  console.error('✗ MONGODB_URI environment variable is not set. Exiting.');
  process.exit(1);
}

const mongodbUri =
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/team-task-manager';

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv,
  mongodbUri,
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
};
