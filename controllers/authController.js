const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login attempt:', { email, passwordLength: password?.length });

  if (!email || !password) {
    res.status(400);
    throw new Error('Email et mot de passe requis');
  }

  const user = await User.findOne({ email }).populate('department');
  console.log('User found:', user ? 'Yes' : 'No');
  
  if (user) {
    const passwordMatch = await user.comparePassword(password);
    console.log('Password match:', passwordMatch);
    
    if (passwordMatch) {
      if (!user.isActive) {
        res.status(401);
        throw new Error('Compte désactivé');
      }

      res.json({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Email ou mot de passe incorrect');
    }
  } else {
    res.status(401);
    throw new Error('Email ou mot de passe incorrect');
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Mot de passe actuel et nouveau mot de passe requis');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('Le nouveau mot de passe doit contenir au moins 6 caractères');
  }

  const user = await User.findById(req.user.id);

  if (user && (await user.comparePassword(currentPassword))) {
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Mot de passe modifié avec succès' });
  } else {
    res.status(400);
    throw new Error('Mot de passe actuel incorrect');
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('department').select('-password');
  res.json(user);
});

module.exports = {
  loginUser,
  changePassword,
  getMe,
};