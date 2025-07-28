const Teacher = require('../models/Teacher');
const asyncHandler = require('express-async-handler');

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Public
const getTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find({}).populate('departments').populate('grade');
  res.json(teachers);
});

// @desc    Get teacher by ID
// @route   GET /api/teachers/:id
// @access  Public
const getTeacherById = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).populate('departments').populate('grade');
  
  if (teacher) {
    res.json(teacher);
  } else {
    res.status(404);
    throw new Error('Teacher not found');
  }
});

// @desc    Create a teacher
// @route   POST /api/teachers
// @access  Private
const createTeacher = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, grade, specialization, departments } = req.body;

  const teacher = await Teacher.create({
    firstName,
    lastName,
    email,
    grade,
    specialization,
    departments
  });

  res.status(201).json(teacher);
});

// @desc    Update a teacher
// @route   PUT /api/teachers/:id
// @access  Private
const updateTeacher = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, grade, specialization, departments } = req.body;

  const teacher = await Teacher.findById(req.params.id);

  if (teacher) {
    teacher.firstName = firstName || teacher.firstName;
    teacher.lastName = lastName || teacher.lastName;
    teacher.email = email || teacher.email;
    teacher.grade = grade || teacher.grade;
    teacher.specialization = specialization || teacher.specialization;
    teacher.departments = departments || teacher.departments;

    const updatedTeacher = await teacher.save();
    res.json(updatedTeacher);
  } else {
    res.status(404);
    throw new Error('Teacher not found');
  }
});

// @desc    Delete a teacher
// @route   DELETE /api/teachers/:id
// @access  Private
const deleteTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);

  if (teacher) {
    await teacher.remove();
    res.json({ message: 'Teacher removed' });
  } else {
    res.status(404);
    throw new Error('Teacher not found');
  }
});

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};