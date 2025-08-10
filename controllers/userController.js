const User = require('../models/User');
const Department = require('../models/Department');
const asyncHandler = require('express-async-handler');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().populate('department').select('-password');
  res.json(users);
});

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Admin only)
const createUser = asyncHandler(async (req, res) => {
  const { email, password, role, department, firstName, lastName } = req.body;

  if (!email || !password || !role || !firstName || !lastName) {
    res.status(400);
    throw new Error('Tous les champs requis doivent être remplis');
  }

  if (role === 'director' && !department) {
    res.status(400);
    throw new Error('Un département est requis pour un directeur');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Un utilisateur avec cet email existe déjà');
  }

  const user = await User.create({
    email,
    password,
    role,
    department: role === 'director' ? department : undefined,
    firstName,
    lastName
  });

  const createdUser = await User.findById(user._id).populate('department').select('-password');
  res.status(201).json(createdUser);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only)
const updateUser = asyncHandler(async (req, res) => {
  const { email, role, department, firstName, lastName, isActive } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400);
      throw new Error('Un utilisateur avec cet email existe déjà');
    }
  }

  if (role === 'director' && !department) {
    res.status(400);
    throw new Error('Un département est requis pour un directeur');
  }

  user.email = email || user.email;
  user.role = role || user.role;
  user.department = role === 'director' ? department : undefined;
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.isActive = isActive !== undefined ? isActive : user.isActive;

  const updatedUser = await user.save();
  const populatedUser = await User.findById(updatedUser._id).populate('department').select('-password');
  
  res.json(populatedUser);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Utilisateur supprimé' });
});

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};