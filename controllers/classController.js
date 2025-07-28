const Class = require('../models/Class');
const asyncHandler = require('express-async-handler');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Public
const getClasses = asyncHandler(async (req, res) => {
  const classes = await Class.find({}).populate('department').populate('academicYear');
  res.json(classes);
});

// @desc    Get class by ID
// @route   GET /api/classes/:id
// @access  Public
const getClassById = asyncHandler(async (req, res) => {
  const classItem = await Class.findById(req.params.id)
    .populate('department')
    .populate('academicYear')
    .populate('sessions');
  
  if (classItem) {
    res.json(classItem);
  } else {
    res.status(404);
    throw new Error('Class not found');
  }
});

// @desc    Create a class
// @route   POST /api/classes
// @access  Private
const createClass = asyncHandler(async (req, res) => {
  const { name, level, track, department,academicYear, students } = req.body;

  const classItem = await Class.create({
    name,
    level,
    track,
    department,
    academicYear,
    students
  });

  res.status(201).json(classItem);
});

// @desc    Update a class
// @route   PUT /api/classes/:id
// @access  Private
const updateClass = asyncHandler(async (req, res) => {
  const { name, level, track, department, academicYear, students } = req.body;

  const classItem = await Class.findById(req.params.id);

  if (classItem) {
    classItem.name = name || classItem.name;
    classItem.level = level || classItem.level;
    classItem.track = track || classItem.track;
    classItem.department = department || classItem.department;
    classItem.academicYear = academicYear || classItem.academicYear;
    classItem.students = students || classItem.students;

    const updatedClass = await classItem.save();
    res.json(updatedClass);
  } else {
    res.status(404);
    throw new Error('Class not found');
  }
});

// @desc    Delete a class
// @route   DELETE /api/classes/:id
// @access  Private
const deleteClass = asyncHandler(async (req, res) => {
  const classItem = await Class.findById(req.params.id);

  if (classItem) {
    await classItem.remove();
    res.json({ message: 'Class removed' });
  } else {
    res.status(404);
    throw new Error('Class not found');
  }
});

module.exports = {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
};