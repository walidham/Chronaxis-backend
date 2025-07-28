// backend/controllers/academicYearController.js
const AcademicYear = require('../models/AcademicYear');
const asyncHandler = require('express-async-handler');

const getAcademicYears = asyncHandler(async (req, res) => {
  const academicYears = await AcademicYear.find({}).sort({ startDate: -1 });
  res.json(academicYears);
});

const createAcademicYear = asyncHandler(async (req, res) => {
  const { name, startDate, endDate } = req.body;

  const academicYear = await AcademicYear.create({
    name,
    startDate,
    endDate
  });

  res.status(201).json(academicYear);
});

const updateAcademicYear = asyncHandler(async (req, res) => {
  const { name, startDate, endDate, isActive } = req.body;

  const academicYear = await AcademicYear.findById(req.params.id);

  if (academicYear) {
    academicYear.name = name || academicYear.name;
    academicYear.startDate = startDate || academicYear.startDate;
    academicYear.endDate = endDate || academicYear.endDate;
    academicYear.isActive = isActive !== undefined ? isActive : academicYear.isActive;

    const updatedAcademicYear = await academicYear.save();
    res.json(updatedAcademicYear);
  } else {
    res.status(404);
    throw new Error('Academic year not found');
  }
});

const deleteAcademicYear = asyncHandler(async (req, res) => {
  const academicYear = await AcademicYear.findById(req.params.id);

  if (academicYear) {
    await academicYear.remove();
    res.json({ message: 'Academic year removed' });
  } else {
    res.status(404);
    throw new Error('Academic year not found');
  }
});

module.exports = {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear
};
