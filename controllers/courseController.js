const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const { department, track, semester } = req.query;
  
  let query = {};
  if (department) query.department = department;
  if (track) query.track = track;
  if (semester) query.semester = semester;
  
  const courses = await Course.find(query).populate('department').populate('track');
  res.json(courses);
});

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('department');

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
  const { name, code, semester, hours, department, track } = req.body;

  const course = await Course.create({
    name,
    code,
    semester,
    hours,
    department,
    track
  });

  const populatedCourse = await Course.findById(course._id).populate('department').populate('track');
  res.status(201).json(populatedCourse);
});

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private
const updateCourse = asyncHandler(async (req, res) => {
  const { name, code, semester, hours, department, track } = req.body;

  const course = await Course.findById(req.params.id);

  if (course) {
    course.name = name || course.name;
    course.code = code || course.code;
    course.semester = semester || course.semester;
    course.hours = hours || course.hours;
    course.department = department || course.department;
    course.track = track || course.track;

    const updatedCourse = await course.save();
    const populatedCourse = await Course.findById(updatedCourse._id).populate('department').populate('track');
    res.json(populatedCourse);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
});

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  if (course) {
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