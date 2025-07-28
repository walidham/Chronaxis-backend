const Room = require('../models/Room');
const asyncHandler = require('express-async-handler');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({});
  res.json(rooms);
});

// @desc    Get room by ID
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  
  if (room) {
    res.json(room);
  } else {
    res.status(404);
    throw new Error('Room not found');
  }
});

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private
const createRoom = asyncHandler(async (req, res) => {
  const { name, capacity, type, building, floor, isAvailable } = req.body;

  const room = await Room.create({
    name,
    capacity,
    type,
    building,
    floor,
    isAvailable
  });

  res.status(201).json(room);
});

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private
const updateRoom = asyncHandler(async (req, res) => {
  const { name, capacity, type, building, floor, isAvailable } = req.body;

  const room = await Room.findById(req.params.id);

  if (room) {
    room.name = name || room.name;
    room.capacity = capacity || room.capacity;
    room.type = type || room.type;
    room.building = building || room.building;
    room.floor = floor || room.floor;
    room.isAvailable = isAvailable !== undefined ? isAvailable : room.isAvailable;

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } else {
    res.status(404);
    throw new Error('Room not found');
  }
});

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (room) {
    await room.remove();
    res.json({ message: 'Room removed' });
  } else {
    res.status(404);
    throw new Error('Room not found');
  }
});

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};