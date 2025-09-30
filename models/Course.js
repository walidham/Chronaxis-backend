// backend/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  semester: { type: Number, required: true, min: 1, max: 2 },
  hours: {
    lectures: { type: Number, default: 0 },
    tutorials: { type: Number, default: 0 },
    practicals: { type: Number, default: 0 }
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    required: true
  }
});

module.exports = mongoose.model('Course', courseSchema);