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
    throw new Error('Séance non trouvée');
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
    throw new Error('Conflit de séance détecté: ' + conflicts.join(', '));
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
    throw new Error('Séance non trouvée');
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
      throw new Error('Conflit de séance détecté: ' + conflicts.join(', '));
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
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Séance supprimée' });
  } else {
    res.status(404);
    throw new Error('Séance non trouvée');
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
    // Si on exclut une session (modification), vérifier que ce n'est pas la même
    if (!excludeSessionId || roomConflict._id.toString() !== excludeSessionId) {
      conflicts.push('La salle est déjà réservée pour ce créneau horaire');
    }
  }
  
  // Check teacher conflict
  const teacherConflict = await Session.findOne({
    ...baseQuery,
    teacher
  });
  
  if (teacherConflict) {
    // Si on exclut une session (modification), vérifier que ce n'est pas la même
    if (!excludeSessionId || teacherConflict._id.toString() !== excludeSessionId) {
      conflicts.push('L\'enseignant est déjà assigné à une autre séance à cette heure');
    }
  }
  
  // For TP sessions with groups, allow up to 2 sessions per class
  if (type !== 'PRACTICAL' || !group) {
    // For non-TP sessions or TP without group, check normal class conflict
    const classConflict = await Session.findOne({
      ...baseQuery,
      class: classId
    });
    
    if (classConflict) {
      // Si on exclut une session (modification), vérifier que ce n'est pas la même
      if (!excludeSessionId || classConflict._id.toString() !== excludeSessionId) {
        conflicts.push('La classe a déjà une séance programmée à cette heure');
      }
    }
  } else {
    // For TP with groups, check if there are already 2 sessions for this class
    const classSessions = await Session.find({
      ...baseQuery,
      class: classId,
      type: 'PRACTICAL'
    });
    
    if (classSessions.length >= 2) {
      conflicts.push('La classe a déjà le nombre maximum de groupes TP (2) pour ce créneau');
    }
    
    // Check if the group name is already used for this class at this time
    const groupConflict = await Session.findOne({
      ...baseQuery,
      class: classId,
      group
    });
    
    if (groupConflict) {
      // Si on exclut une session (modification), vérifier que ce n'est pas la même
      if (!excludeSessionId || groupConflict._id.toString() !== excludeSessionId) {
        conflicts.push(`Le groupe "${group}" a déjà une séance pour cette classe à cette heure`);
      }
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