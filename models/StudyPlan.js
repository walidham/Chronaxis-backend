const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  tracks: [{
    name: { type: String, required: true },
    description: String,
    semesters: [{
      number: { type: Number, required: true, min: 1, max: 5 },
      courses: [{
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course'
        },
        credits: Number
      }]
    }]
  }],
  academicYear: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('StudyPlan', studyPlanSchema);