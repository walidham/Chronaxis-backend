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
    throw new Error('Enseignant non trouvé');
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
    throw new Error('Enseignant non trouvé');
  }
});

// @desc    Delete a teacher
// @route   DELETE /api/teachers/:id
// @access  Private
const deleteTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);

  if (teacher) {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Enseignant supprimé avec succès' });
  } else {
    res.status(404);
    throw new Error('Enseignant non trouvé');
  }
});

module.exports = {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};