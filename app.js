var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

var app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://chronaxis-frontend.vercel.app',
    'https://chronaxis-frontend-git-master-walidham.vercel.app',
    'https://chronaxis-frontend-walidham.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/university', require('./routes/universityRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/study-plans', require('./routes/studyPlanRoutes'));
app.use('/api/academic-years', require('./routes/academicYearRoutes'));
app.use('/api/tracks', require('./routes/trackRoutes'));
app.use('/api/grades', require('./routes/gradeRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

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
