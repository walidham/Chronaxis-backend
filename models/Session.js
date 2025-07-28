const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['LECTURE', 'TUTORIAL', 'PRACTICAL']
  },
  dayOfWeek: {
    type: Number,
    required: true,
    min: 1, // Lundi
    max: 6  // Samedi
  },
  timeSlot: {
    type: Number,
    required: true,
    min: 1, // 8h30-10h00
    max: 6  // 16h50-18h20
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  group: {
    type: String,
    default: null // Pour les TP en groupes
  }
});

// Vérification des contraintes de chevauchement
sessionSchema.index({ room: 1, dayOfWeek: 1, timeSlot: 1, semester: 1 }, { unique: true });
sessionSchema.index({ teacher: 1, dayOfWeek: 1, timeSlot: 1, semester: 1 }, { unique: true });
// Suppression de l'index unique sur la classe pour permettre plusieurs sessions de TP
sessionSchema.index({ class: 1, dayOfWeek: 1, timeSlot: 1, semester: 1 });
// Ajout d'un index unique sur la classe + groupe pour éviter les doublons de groupe
sessionSchema.index({ class: 1, dayOfWeek: 1, timeSlot: 1, semester: 1, group: 1 }, { unique: true });

module.exports = mongoose.model('Session', sessionSchema);