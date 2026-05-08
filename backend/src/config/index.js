require('dotenv').config();

const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'production' && !process.env.MONGODB_URI) {
  console.error('FATAL: MONGODB_URI environment variable is not set in production.');
  process.exit(1);
}

const mongodbUri =
  process.env.MONGODB_URI ||
  (nodeEnv !== 'production' ? 'mongodb://localhost:27017/team-task-manager' : undefined);

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv,
  mongodbUri,
  jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
};
