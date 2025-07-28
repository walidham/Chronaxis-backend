// backend/models/Track.js
const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  }
});

module.exports = mongoose.model('Track', trackSchema);
