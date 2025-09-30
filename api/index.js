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

// Enhanced CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Allow all origins for now (you can restrict this later)
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
}));

// Handle preflight requests
app.options('*', cors());

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

// Direct login route (bypass middleware issues)
app.post('/api/direct/login', async (req, res) => {
  try {
    console.log('🔑 Direct login attempt:', { email: req.body?.email, hasPassword: !!req.body?.password });
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    
    const User = require('../models/User');
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs');
    
    const user = await User.findOne({ email }).populate('department');
    console.log('👤 User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('🔒 Password match:', passwordMatch);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ message: 'Compte désactivé' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '30d',
    });
    
    res.json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      department: user.department,
      token: token,
    });
    
  } catch (error) {
    console.error('❌ Direct login error:', error);
    res.status(500).json({ message: error.message });
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

// No global authentication middleware - will be applied per route group

// Working login route (replace problematic authRoutes)
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔑 Auth login attempt:', { email: req.body?.email, hasPassword: !!req.body?.password });
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    
    const User = require('../models/User');
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs');
    
    const user = await User.findOne({ email }).populate('department');
    console.log('👤 User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('🔒 Password match:', passwordMatch);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ message: 'Compte désactivé' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: '30d',
    });
    
    res.json({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      department: user.department,
      token: token,
    });
    
  } catch (error) {
    console.error('❌ Auth login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Other auth routes (added directly to avoid conflicts)
app.get('/api/auth/me', async (req, res) => {
  try {
    const { protect } = require('../middleware/authMiddleware');
    // Apply protection manually
    protect(req, res, async () => {
      const User = require('../models/User');
      const user = await User.findById(req.user.id).populate('department').select('-password');
      res.json(user);
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/auth/change-password', async (req, res) => {
  try {
    const { protect } = require('../middleware/authMiddleware');
    // Apply protection manually
    protect(req, res, async () => {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Mot de passe actuel et nouveau mot de passe requis' });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
      }
      
      const User = require('../models/User');
      const bcrypt = require('bcryptjs');
      
      const user = await User.findById(req.user.id);
      
      if (user && (await bcrypt.compare(currentPassword, user.password))) {
        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();
        res.json({ message: 'Mot de passe modifié avec succès' });
      } else {
        res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      }
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: error.message });
  }
});
// Apply authentication middleware only to admin routes
const { protect } = require('../middleware/authMiddleware');

// Public routes (no auth needed)
app.use('/api/contact', contactRoutes);

// Routes with mixed access (GET public, POST/PUT/DELETE protected)
app.use('/api/university', (req, res, next) => {
  if (req.method === 'GET') return next();
  protect(req, res, next);
}, universityRoutes);

app.use('/api/departments', (req, res, next) => {
  if (req.method === 'GET') return next();
  protect(req, res, next);
}, departmentRoutes);

app.use('/api/teachers', (req, res, next) => {
  if (req.method === 'GET') return next();
  protect(req, res, next);
}, teacherRoutes);

app.use('/api/classes', (req, res, next) => {
  if (req.method === 'GET') return next();
  protect(req, res, next);
}, classRoutes);

app.use('/api/courses', (req, res, next) => {
  if (req.method === 'GET') return next();
  protect(req, res, next);
}, courseRoutes);

app.use('/api/rooms', (req, res, next) => {
  if (req.method === 'GET') return next();
  protect(req, res, next);
}, roomRoutes);

app.use('/api/sessions', (req, res, next) => {
  if (req.method === 'GET') return next();
  protect(req, res, next);
}, sessionRoutes);

app.use('/api/study-plans', (req, res, next) => {
  if (req.method === 'GET') return next();
  protect(req, res, next);
}, studyPlanRoutes);

app.use('/api/academic-years', (req, res, next) => {
  if (req.method === 'GET') return next();
  protect(req, res, next);
}, academicYearRoutes);

app.use('/api/tracks', (req, res, next) => {
  if (req.method === 'GET') return next();
  protect(req, res, next);
}, trackRoutes);

app.use('/api/grades', (req, res, next) => {
  if (req.method === 'GET') return next();
  protect(req, res, next);
}, gradeRoutes);

// Fully protected routes (all methods require auth)
app.use('/api/users', protect, userRoutes);

// 404 handler
app.use((req, res, next) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ message: `Route not found: ${req.path}` });
});

// Error handler with CORS headers
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Ensure CORS headers are set even on errors
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    path: req.path
  });
});

module.exports = app;