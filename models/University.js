const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  directorName: { type: String, required: true },
  studiesDirectorName: { type: String, required: true }
});

module.exports = mongoose.model('University', universitySchema);