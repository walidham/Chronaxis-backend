const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  }
}, {
  timestamps: true
});

// Index composé pour éviter les doublons de code par département
trackSchema.index({ code: 1, department: 1 }, { unique: true });

module.exports = mongoose.model('Track', trackSchema);