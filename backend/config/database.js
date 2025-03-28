require('dotenv').config();

const database = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 't1gumayusi',
  server: process.env.DB_SERVER || '16.0.1000.6',
  database: process.env.DB_NAME || 'FACEDB',
  options: {
    encrypt: true, 
    trustServerCertificate: process.env.NODE_ENV === 'development'
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

module.exports = { database };