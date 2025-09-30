const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = await User.findById(decoded.id).populate('department').select('-password');
      
      if (!req.user.isActive) {
        res.status(401);
        throw new Error('Compte désactivé');
      }
      
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Non autorisé, token invalide');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Non autorisé, pas de token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Accès refusé - Administrateur requis');
  }
};

const adminOrDepartmentDirector = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'director')) {
    next();
  } else {
    res.status(403);
    throw new Error('Accès refusé - Droits insuffisants');
  }
};

// Combined middleware that includes protection and admin check
const adminOnly = [protect, admin];

module.exports = { protect, admin, adminOnly, adminOrDepartmentDirector };