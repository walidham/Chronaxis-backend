const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true 
  },
  abbreviation: { 
    type: String, 
    required: true 
  },
  level: { 
    type: Number, 
    required: true 
  } // Pour hiérarchiser les grades
});

module.exports = mongoose.model('Grade', gradeSchema);