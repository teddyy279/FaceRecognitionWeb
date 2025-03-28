const express = require('express');
const sql = require('mssql');
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { database } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối database
sql.connect(database).catch(err => {
  console.error('Database connection failed:', err);
});

// Routes
app.use('/auth', authRoutes);
app.use('/images', imageRoutes);
app.use('/admin', adminRoutes);

// Middleware xử lý lỗi cuối cùng
app.use(errorHandler);

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Xử lý các lỗi không mong muốn
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});