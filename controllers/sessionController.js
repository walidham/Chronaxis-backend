const Session = require('../models/Session');
const asyncHandler = require('express-async-handler');

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Public
const getSessions = asyncHandler(async (req, res) => {
  const { class: classId, semester } = req.query;
  
  let query = {};
  
  if (classId) {
    query.class = classId;
  }
  
  if (semester) {
    query.semester = semester;
  }
  
  const sessions = await Session.find(query)
    .populate('course')
    .populate('teacher')
    .populate('class')
    .populate('room');
    
  res.json(sessions);
});

// @desc    Get session by ID
// @route   GET /api/sessions/:id
// @access  Public
const getSessionById = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id)
    .populate('course')
    .populate('teacher')
    .populate('class')
    .populate('room');
  
  if (session) {
    res.json(session);
  } else {
    res.status(404);
    throw new Error('Session not found');
  }
});

// @desc    Create a session
// @route   POST /api/sessions
// @access  Private
const createSession = asyncHandler(async (req, res) => {
  const { course, teacher, class: classId, room, type, dayOfWeek, timeSlot, semester, group } = req.body;

  // Check for conflicts
  const conflicts = await checkSessionConflicts({
    room,
    teacher,
    classId,
    dayOfWeek,
    timeSlot,
    semester,
    type,
    group
  });

  if (conflicts.length > 0) {
    res.status(400);
    throw new Error('Session conflict detected: ' + conflicts.join(', '));
  }

  const session = await Session.create({
    course,
    teacher,
    class: classId,
    room,
    type,
    dayOfWeek,
    timeSlot,
    semester,
    group
  });

  res.status(201).json(session);
});

// @desc    Update a session
// @route   PUT /api/sessions/:id
// @access  Private
const updateSession = asyncHandler(async (req, res) => {
  const { course, teacher, class: classId, room, type, dayOfWeek, timeSlot, semester, group } = req.body;

  const session = await Session.findById(req.params.id);

  if (!session) {
    res.status(404);
    throw new Error('Session not found');
  }

  // Check for conflicts only if time/room/teacher/class has changed
  if (
    session.room.toString() !== room ||
    session.teacher.toString() !== teacher ||
    session.class.toString() !== classId ||
    session.dayOfWeek !== dayOfWeek ||
    session.timeSlot !== timeSlot ||
    session.semester !== semester
  ) {
    const conflicts = await checkSessionConflicts({
      room,
      teacher,
      classId,
      dayOfWeek,
      timeSlot,
      semester,
      type,
      group,
      excludeSessionId: req.params.id
    });

    if (conflicts.length > 0) {
      res.status(400);
      throw new Error('Session conflict detected: ' + conflicts.join(', '));
    }
  }

  session.course = course || session.course;
  session.teacher = teacher || session.teacher;
  session.class = classId || session.class;
  session.room = room || session.room;
  session.type = type || session.type;
  session.dayOfWeek = dayOfWeek || session.dayOfWeek;
  session.timeSlot = timeSlot || session.timeSlot;
  session.semester = semester || session.semester;
  session.group = group !== undefined ? group : session.group;

  const updatedSession = await session.save();
  res.json(updatedSession);
});

// @desc    Delete a session
// @route   DELETE /api/sessions/:id
// @access  Private
const deleteSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);

  if (session) {
    await session.remove();
    res.json({ message: 'Session removed' });
  } else {
    res.status(404);
    throw new Error('Session not found');
  }
});

// Helper function to check for session conflicts
const checkSessionConflicts = async ({ room, teacher, classId, dayOfWeek, timeSlot, semester, excludeSessionId, type, group }) => {
  const conflicts = [];
  
  // Build the base query
  const baseQuery = {
    dayOfWeek,
    timeSlot,
    semester
  };
  
  if (excludeSessionId) {
    baseQuery._id = { $ne: excludeSessionId };
  }
  
  // Check room conflict
  const roomConflict = await Session.findOne({
    ...baseQuery,
    room
  });
  
  if (roomConflict) {
    conflicts.push('Room is already booked for this time slot');
  }
  
  // Check teacher conflict
  const teacherConflict = await Session.findOne({
    ...baseQuery,
    teacher
  });
  
  if (teacherConflict) {
    conflicts.push('Teacher is already assigned to another session at this time');
  }
  
  // For TP sessions with groups, allow up to 2 sessions per class
  if (type !== 'PRACTICAL' || !group) {
    // For non-TP sessions or TP without group, check normal class conflict
    const classConflict = await Session.findOne({
      ...baseQuery,
      class: classId
    });
    
    if (classConflict) {
      conflicts.push('Class already has a session scheduled at this time');
    }
  } else {
    // For TP with groups, check if there are already 2 sessions for this class
    const classSessions = await Session.find({
      ...baseQuery,
      class: classId,
      type: 'PRACTICAL'
    });
    
    if (classSessions.length >= 2) {
      conflicts.push('Class already has the maximum number of TP groups (2) for this time slot');
    }
    
    // Check if the group name is already used for this class at this time
    const groupConflict = await Session.findOne({
      ...baseQuery,
      class: classId,
      group
    });
    
    if (groupConflict) {
      conflicts.push(`Group "${group}" already has a session for this class at this time`);
    }
  }
  
  return conflicts;
};

module.exports = {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
};