require('dotenv').config();

const config = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'newsportal',
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  dialectOptions: { ssl: false }
};

module.exports = {
  development: config,
  production: config
};
