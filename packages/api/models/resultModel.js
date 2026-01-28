const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User'
  },
  codeId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Personality'
  }
});

module.exports = mongoose.model('Result', resultSchema);