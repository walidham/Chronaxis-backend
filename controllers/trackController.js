// backend/controllers/trackController.js
const Track = require('../models/Track');
const asyncHandler = require('express-async-handler');

// @desc    Get all tracks
// @route   GET /api/tracks
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

// @desc    Get track by ID
// @route   GET /api/tracks/:id
// @access  Public
const getTrackById = asyncHandler(async (req, res) => {
  const track = await Track.findById(req.params.id).populate('department');
  
  if (track) {
    res.json(track);
  } else {
    res.status(404);
    throw new Error('Track not found');
  }
});

// @desc    Create a track
// @route   POST /api/tracks
// @access  Private
const createTrack = asyncHandler(async (req, res) => {
  const { name, description, department } = req.body;

  if (!department) {
    res.status(400);
    throw new Error('Department is required');
  }

  const track = await Track.create({
    name,
    description,
    department
  });

  res.status(201).json(track);
});

// @desc    Update a track
// @route   PUT /api/tracks/:id
// @access  Private
const updateTrack = asyncHandler(async (req, res) => {
  const { name, description, department } = req.body;

  const track = await Track.findById(req.params.id);

  if (track) {
    track.name = name || track.name;
    track.description = description || track.description;
    track.department = department || track.department;

    const updatedTrack = await track.save();
    res.json(updatedTrack);
  } else {
    res.status(404);
    throw new Error('Track not found');
  }
});

// @desc    Delete a track
// @route   DELETE /api/tracks/:id
// @access  Private
const deleteTrack = asyncHandler(async (req, res) => {
  const track = await Track.findById(req.params.id);

  if (track) {
    await track.remove();
    res.json({ message: 'Track removed' });
  } else {
    res.status(404);
    throw new Error('Track not found');
  }
});

module.exports = {
  getTracks,
  getTrackById,
  createTrack,
  updateTrack,
  deleteTrack,
};
