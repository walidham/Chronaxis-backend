const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Import all models to register them
require('../models/University');
require('../models/Department');
require('../models/Track');
require('../models/Grade');
require('../models/AcademicYear');
require('../models/Teacher');
require('../models/Room');
require('../models/Course');
require('../models/Class');
require('../models/Session');
require('../models/User');
require('../models/ContactMessage');

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
  console.log(`🔍 ${req.method} ${req.path}`);
  if (req.path === '/api/auth/login') {
    console.log('📧 Login attempt:', { email: req.body?.email, hasPassword: !!req.body?.password });
  }
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

// Test login route
app.post('/api/test/login', async (req, res) => {
  try {
    console.log('🧪 Test login attempt:', req.body);
    const User = require('../models/User');
    const user = await User.findOne({ email: req.body.email });
    console.log('👤 User found:', user ? 'Yes' : 'No');
    res.json({ 
      userExists: !!user,
      email: req.body.email,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Import routes
const authRoutes = require('../routes/authRoutes');
const universityRoutes = require('../routes/universityRoutes');
const departmentRoutes = require('../routes/departmentRoutes');
const teacherRoutes = require('../routes/teacherRoutes');
const classRoutes = require('../routes/classRoutes');
const courseRoutes = require('../routes/courseRoutes');
const roomRoutes = require('../routes/roomRoutes');
const sessionRoutes = require('../routes/sessionRoutes');
const studyPlanRoutes = require('../routes/studyPlanRoutes');
const academicYearRoutes = require('../routes/academicYearRoutes');
const trackRoutes = require('../routes/trackRoutes');
const gradeRoutes = require('../routes/gradeRoutes');
const userRoutes = require('../routes/userRoutes');
const contactRoutes = require('../routes/contactRoutes');

// Basic auth middleware
const { protect } = require('../middleware/authMiddleware');

// Authentication middleware for protected routes
app.use('/api', (req, res, next) => {
  // Public routes that don't require authentication
  const publicRoutes = [
    '/api/health',
    '/api/test/',
    '/api/auth/login',
    '/api/contact'
  ];
  
  // Allow GET requests to public routes for student space
  const isPublicGet = req.method === 'GET' && (
    req.path.startsWith('/api/departments') ||
    req.path.startsWith('/api/academic-years') ||
    req.path.startsWith('/api/classes') ||
    req.path.startsWith('/api/sessions')
  );
  
  // Allow POST to contact form
  const isContactPost = req.method === 'POST' && req.path === '/api/contact';
  
  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => req.path.startsWith(route));
  
  if (isPublicRoute || isPublicGet || isContactPost || req.method === 'OPTIONS') {
    return next();
  }
  
  // All other routes require authentication
  const { protect } = require('../middleware/authMiddleware');
  protect(req, res, next);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/university', universityRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/study-plans', studyPlanRoutes);
app.use('/api/academic-years', academicYearRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);

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