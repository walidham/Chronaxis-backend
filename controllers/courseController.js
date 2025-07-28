const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({}).populate('department').populate('teachers');
  res.json(courses);
});

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('department')
    .populate('teachers');

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Create a course
// @route   POST /api/courses
// @access  Private
const createCourse = asyncHandler(async (req, res) => {
  const { name, code, semester, hours, department, teachers } = req.body;

  const course = await Course.create({
    name,
    code,
    semester,
    hours,
    department,
    teachers: teachers || []
  });

  res.status(201).json(course);
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private
const updateCourse = asyncHandler(async (req, res) => {
  const { name, code, semester, hours, department, teachers } = req.body;

  const course = await Course.findById(req.params.id);

  if (course) {
    course.name = name || course.name;
    course.code = code || course.code;
    course.semester = semester || course.semester;
    course.hours = hours || course.hours;
    course.department = department || course.department;
    course.teachers = teachers || course.teachers;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    await course.remove();
    res.json({ message: 'Course removed' });
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

const importCourses = asyncHandler(async (req, res) => {
  const { courses } = req.body;

  if (!courses || !Array.isArray(courses) || courses.length === 0) {
    res.status(400);
    throw new Error('Données d\'importation invalides');
  }

  try {
    // Utiliser insertMany pour une insertion en masse efficace
    const result = await Course.insertMany(courses, { ordered: false });
    res.status(201).json({
      message: `${result.length} matières importées avec succès`
    });
  } catch (error) {
    // Gérer les erreurs de duplication (codes de cours en double)
    if (error.code === 11000) {
      res.status(400);
      throw new Error('Certains codes de cours existent déjà');
    }
    throw error;
  }
});
module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  importCourses
};