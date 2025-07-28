// backend/models/AcademicYear.js
const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('AcademicYear', academicYearSchema);
