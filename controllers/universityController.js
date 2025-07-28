const University = require('../models/University');
const asyncHandler = require('express-async-handler');

// @desc    Get university info
// @route   GET /api/university
// @access  Public
const getUniversity = asyncHandler(async (req, res) => {
  const university = await University.findOne();
  
  if (university) {
    res.json(university);
  } else {
    res.status(404);
    throw new Error('University information not found');
  }
});

// @desc    Create or update university info
// @route   POST /api/university
// @access  Private/Admin
const updateUniversity = asyncHandler(async (req, res) => {
  const { name, address, directorName, studiesDirectorName } = req.body;

  const university = await University.findOne();

  if (university) {
    university.name = name || university.name;
    university.address = address || university.address;
    university.directorName = directorName || university.directorName;
    university.studiesDirectorName = studiesDirectorName || university.studiesDirectorName;

    const updatedUniversity = await university.save();
    res.json(updatedUniversity);
  } else {
    const newUniversity = await University.create({
      name,
      address,
      directorName,
      studiesDirectorName,
    });

    res.status(201).json(newUniversity);
  }
});

module.exports = {
  getUniversity,
  updateUniversity,
};