var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { securityHeaders } = require('./middleware/security');
const { securityLogger } = require('./middleware/logger');
const { sanitizeInput } = require('./middleware/validation');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

var app = express();

// Security headers
app.use(securityHeaders);

// Security logging
app.use(securityLogger);

// CORS configuration - Allow all origins for Azure deployment
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Add request logging
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.path} from ${req.ip}`);
  console.log(`   Headers: ${JSON.stringify(req.headers.authorization ? 'Bearer ***' : 'No Auth')}`);
  next();
});

// Health check endpoint (before any middleware)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rate limiting and security middleware
const { apiLimiter } = require('./middleware/rateLimiter');
app.use('/api', apiLimiter);

// Global API protection middleware
const { protect } = require('./middleware/authMiddleware');
app.use('/api', (req, res, next) => {
  // Allow login route
  if (req.path === '/api/auth/login') {
    return next();
  }
  
  // Allow POST to contact form
  if (req.method === 'POST' && req.path === '/api/contact') {
    return next();
  }
  
  // Allow GET requests to public routes for student space
  if (req.method === 'GET' && (
    req.path.startsWith('/api/departments') ||
    req.path.startsWith('/api/academic-years') ||
    req.path.startsWith('/api/classes') ||
    req.path.startsWith('/api/sessions')
  )) {
    return next();
  }
  
  // Allow OPTIONS requests (CORS preflight)
  if (req.method === 'OPTIONS') {
    return next();
  }
  
  // All other API routes require authentication
  protect(req, res, next);
});
app.use(logger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const authRoutes = require('./routes/authRoutes');
const universityRoutes = require('./routes/universityRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const classRoutes = require('./routes/classRoutes');
const courseRoutes = require('./routes/courseRoutes');
const roomRoutes = require('./routes/roomRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const studyPlanRoutes = require('./routes/studyPlanRoutes');
const academicYearRoutes = require('./routes/academicYearRoutes');
const trackRoutes = require('./routes/trackRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');

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
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;
