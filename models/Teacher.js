const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grade',
    required: true
  },
  departments: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department' 
  }],
  specialization: { type: String },
  sessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  }]
});

module.exports = mongoose.model('Teacher', teacherSchema);