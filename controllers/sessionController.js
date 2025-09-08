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
    console.log('Conflicts detected:', conflicts);
    res.status(400);
    throw new Error(conflicts.join('\n\n'));
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
      console.log('Update conflicts detected:', conflicts);
      res.status(400);
      throw new Error(conflicts.join('\n\n'));
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
  }).populate('class').populate('teacher').populate('course').populate('room');
  
  if (roomConflict) {
    const groupInfo = roomConflict.group ? ` (${roomConflict.group})` : '';
    const sessionType = roomConflict.type === 'LECTURE' ? 'Cours' : roomConflict.type === 'TUTORIAL' ? 'TD' : 'TP';
    conflicts.push(`Conflit de salle: La salle "${roomConflict.room?.name}" est déjà occupée par:\n• Classe: ${roomConflict.class?.name}${groupInfo}\n• Enseignant: ${roomConflict.teacher?.firstName} ${roomConflict.teacher?.lastName}\n• Cours: ${roomConflict.course?.name} (${sessionType})`);
  }
  
  // Check teacher conflict
  const teacherConflict = await Session.findOne({
    ...baseQuery,
    teacher
  }).populate('class').populate('teacher').populate('course').populate('room');
  
  if (teacherConflict) {
    conflicts.push(`Conflit d'enseignant: L'enseignant "${teacherConflict.teacher?.firstName} ${teacherConflict.teacher?.lastName}" enseigne déjà à la classe "${teacherConflict.class?.name}" dans la salle "${teacherConflict.room?.name}" pour le cours "${teacherConflict.course?.name}"`);
  }
  
  // Gestion des conflits selon le type de séance
  const existingSessions = await Session.find({
    ...baseQuery,
    class: classId
  }).populate('class').populate('teacher').populate('course').populate('room');
  
  if (type === 'LECTURE') {
    // Pour les cours magistraux, vérifier qu'il n'y a pas d'autre cours
    const lectureConflict = existingSessions.find(session => session.type === 'LECTURE');
    if (lectureConflict) {
      conflicts.push(`Conflit de classe: La classe "${lectureConflict.class?.name}" a déjà un cours magistral "${lectureConflict.course?.name}" avec l'enseignant "${lectureConflict.teacher?.firstName} ${lectureConflict.teacher?.lastName}" dans la salle "${lectureConflict.room?.name}"`);
    }
    
    // Un cours magistral peut coexister avec des TP (groupes différents)
    // Pas de conflit avec les TP
  } else if (type === 'PRACTICAL') {
    // Pour les TP, vérifier les groupes
    if (!group) {
      conflicts.push('Un groupe doit être spécifié pour les séances de TP');
    } else {
      // Vérifier si le même groupe a déjà une séance
      const groupConflict = existingSessions.find(session => 
        session.group === group
      );
      
      if (groupConflict) {
        conflicts.push(`Conflit de groupe: Le groupe "${group}" de la classe "${groupConflict.class?.name}" a déjà une séance "${groupConflict.course?.name}" avec l'enseignant "${groupConflict.teacher?.firstName} ${groupConflict.teacher?.lastName}" dans la salle "${groupConflict.room?.name}"`);
      }
      
      // Vérifier le nombre maximum de TP (2 groupes max)
      const tpSessions = existingSessions.filter(session => session.type === 'PRACTICAL');
      if (tpSessions.length >= 2) {
        conflicts.push('La classe a déjà le nombre maximum de groupes TP (2) pour ce créneau');
      }
    }
  } else if (type === 'TUTORIAL') {
    // Pour les TD, même logique que les TP
    if (group) {
      const groupConflict = existingSessions.find(session => 
        session.group === group
      );
      
      if (groupConflict) {
        conflicts.push(`Conflit de groupe TD: Le groupe "${group}" de la classe "${groupConflict.class?.name}" a déjà une séance "${groupConflict.course?.name}" avec l'enseignant "${groupConflict.teacher?.firstName} ${groupConflict.teacher?.lastName}" dans la salle "${groupConflict.room?.name}"`);
      }
    } else {
      // TD sans groupe - vérifier qu'il n'y a pas d'autre TD sans groupe
      const tutorialConflict = existingSessions.find(session => 
        session.type === 'TUTORIAL' && !session.group
      );
      
      if (tutorialConflict) {
        conflicts.push(`Conflit de classe TD: La classe "${tutorialConflict.class?.name}" a déjà un TD "${tutorialConflict.course?.name}" avec l'enseignant "${tutorialConflict.teacher?.firstName} ${tutorialConflict.teacher?.lastName}" dans la salle "${tutorialConflict.room?.name}"`);
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