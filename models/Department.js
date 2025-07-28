const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  head: { type: String, required: true }, // Chef de département
  teachers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher' 
  }],
  classes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class' 
  }],
  studyPlan: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'StudyPlan' 
  }
});

module.exports = mongoose.model('Department', departmentSchema);