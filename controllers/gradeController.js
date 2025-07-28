const Grade = require('../models/Grade');
const asyncHandler = require('express-async-handler');

const getGrades = asyncHandler(async (req, res) => {
  const grades = await Grade.find({}).sort({ level: -1 });
  res.json(grades);
});

const createGrade = asyncHandler(async (req, res) => {
  const { name, abbreviation, level } = req.body;
  const grade = await Grade.create({ name, abbreviation, level });
  res.status(201).json(grade);
});

const updateGrade = asyncHandler(async (req, res) => {
  const { name, abbreviation, level } = req.body;
  const grade = await Grade.findById(req.params.id);

  if (grade) {
    grade.name = name || grade.name;
    grade.abbreviation = abbreviation || grade.abbreviation;
    grade.level = level || grade.level;
    const updatedGrade = await grade.save();
    res.json(updatedGrade);
  } else {
    res.status(404);
    throw new Error('Grade not found');
  }
});

const deleteGrade = asyncHandler(async (req, res) => {
  const grade = await Grade.findById(req.params.id);
  if (grade) {
    await grade.remove();
    res.json({ message: 'Grade removed' });
  } else {
    res.status(404);
    throw new Error('Grade not found');
  }
});

module.exports = {
  getGrades,
  createGrade,
  updateGrade,
  deleteGrade,
};