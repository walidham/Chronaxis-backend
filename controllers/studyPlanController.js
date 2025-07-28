const StudyPlan = require('../models/StudyPlan');
const asyncHandler = require('express-async-handler');

// @desc    Get all study plans
// @route   GET /api/study-plans
// @access  Public
const getStudyPlans = asyncHandler(async (req, res) => {
  const studyPlans = await StudyPlan.find({})
    .populate('department')
    .populate({
      path: 'tracks.semesters.courses.course',
      model: 'Course'
    });
  res.json(studyPlans);
});

// @desc    Get study plan by ID
// @route   GET /api/study-plans/:id
// @access  Public
const getStudyPlanById = asyncHandler(async (req, res) => {
  const studyPlan = await StudyPlan.findById(req.params.id)
    .populate('department')
    .populate({
      path: 'tracks.semesters.courses.course',
      model: 'Course'
    });
  
  if (studyPlan) {
    res.json(studyPlan);
  } else {
    res.status(404);
    throw new Error('Study plan not found');
  }
});

// @desc    Create a study plan
// @route   POST /api/study-plans
// @access  Private
const createStudyPlan = asyncHandler(async (req, res) => {
  const { name, department, tracks, academicYear, isActive } = req.body;

  const studyPlan = await StudyPlan.create({
    name,
    department,
    tracks,
    academicYear,
    isActive
  });

  res.status(201).json(studyPlan);
});

// @desc    Update a study plan
// @route   PUT /api/study-plans/:id
// @access  Private
const updateStudyPlan = asyncHandler(async (req, res) => {
  const { name, department, tracks, academicYear, isActive } = req.body;

  const studyPlan = await StudyPlan.findById(req.params.id);

  if (studyPlan) {
    studyPlan.name = name || studyPlan.name;
    studyPlan.department = department || studyPlan.department;
    studyPlan.tracks = tracks || studyPlan.tracks;
    studyPlan.academicYear = academicYear || studyPlan.academicYear;
    studyPlan.isActive = isActive !== undefined ? isActive : studyPlan.isActive;

    const updatedStudyPlan = await studyPlan.save();
    res.json(updatedStudyPlan);
  } else {
    res.status(404);
    throw new Error('Study plan not found');
  }
});

// @desc    Delete a study plan
// @route   DELETE /api/study-plans/:id
// @access  Private
const deleteStudyPlan = asyncHandler(async (req, res) => {
  const studyPlan = await StudyPlan.findById(req.params.id);

  if (studyPlan) {
    await studyPlan.remove();
    res.json({ message: 'Study plan removed' });
  } else {
    res.status(404);
    throw new Error('Study plan not found');
  }
});

module.exports = {
  getStudyPlans,
  getStudyPlanById,
  createStudyPlan,
  updateStudyPlan,
  deleteStudyPlan,
};