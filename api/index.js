const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Basic CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Import routes
const authRoutes = require('../routes/authRoutes');
const departmentRoutes = require('../routes/departmentRoutes');
const academicYearRoutes = require('../routes/academicYearRoutes');
const classRoutes = require('../routes/classRoutes');
const sessionRoutes = require('../routes/sessionRoutes');
const contactRoutes = require('../routes/contactRoutes');

// Basic auth middleware
const { protect } = require('../middleware/authMiddleware');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/academic-years', academicYearRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/sessions', sessionRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;