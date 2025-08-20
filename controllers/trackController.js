const Track = require('../models/Track');
const asyncHandler = require('express-async-handler');

// @desc    Get tracks by department
// @route   GET /api/tracks?department=:departmentId
// @access  Public
const getTracks = asyncHandler(async (req, res) => {
  const { department } = req.query;
  
  let query = {};
  if (department) {
    query.department = department;
  }
  
  const tracks = await Track.find(query).populate('department');
  res.json(tracks);
});

// @desc    Create track
// @route   POST /api/tracks
// @access  Private
const createTrack = asyncHandler(async (req, res) => {
  const { name, code, department } = req.body;
  
  const track = await Track.create({
    name,
    code,
    department
  });
  
  const populatedTrack = await Track.findById(track._id).populate('department');
  res.status(201).json(populatedTrack);
});

// @desc    Update track
// @route   PUT /api/tracks/:id
// @access  Private
const updateTrack = asyncHandler(async (req, res) => {
  const { name, code, department } = req.body;
  
  const track = await Track.findById(req.params.id);
  
  if (!track) {
    res.status(404);
    throw new Error('Parcours non trouvé');
  }
  
  track.name = name || track.name;
  track.code = code || track.code;
  track.department = department || track.department;
  
  const updatedTrack = await track.save();
  const populatedTrack = await Track.findById(updatedTrack._id).populate('department');
  res.json(populatedTrack);
});

// @desc    Delete track
// @route   DELETE /api/tracks/:id
// @access  Private
const deleteTrack = asyncHandler(async (req, res) => {
  const track = await Track.findById(req.params.id);
  
  if (!track) {
    res.status(404);
    throw new Error('Parcours non trouvé');
  }
  
  await Track.findByIdAndDelete(req.params.id);
  res.json({ message: 'Parcours supprimé' });
});

module.exports = {
  getTracks,
  createTrack,
  updateTrack,
  deleteTrack,
};