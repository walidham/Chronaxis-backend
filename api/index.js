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

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test routes
app.get('/api/test/departments', async (req, res) => {
  try {
    const Department = require('../models/Department');
    const departments = await Department.find({});
    res.json({ count: departments.length, data: departments });
  } catch (error) {
    console.error('Test departments error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/test/classes', async (req, res) => {
  try {
    const Class = require('../models/Class');
    const classes = await Class.find({}).populate('department').populate('academicYear');
    res.json({ count: classes.length, data: classes });
  } catch (error) {
    console.error('Test classes error:', error);
    res.status(500).json({ error: error.message });
  }
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

// 404 handler
app.use((req, res, next) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ message: `Route not found: ${req.path}` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    path: req.path
  });
});

module.exports = app;