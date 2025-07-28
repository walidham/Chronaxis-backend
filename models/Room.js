const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['CLASSROOM', 'LAB', 'AMPHITHEATER']
  },
  building: { type: String },
  floor: { type: Number },
  isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('Room', roomSchema);