require('dotenv').config();

module.exports = {

  port: process.env.PORT || 3000,

  nodeEnv: process.env.NODE_ENV || 'development',

  mongodbUri: process.env.MONGO_URI,

  jwtSecret:
    process.env.JWT_SECRET ||
    'your_super_secret_jwt_key_change_in_production',

  jwtExpire: process.env.JWT_EXPIRE || '7d',

  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
};
