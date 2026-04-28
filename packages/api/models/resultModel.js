const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User'
  },
  code: {
    type: String,
    required: true,
  },
  arabicDescription: {
    type: Object,
    required: true
  },
  englishDescription: {
    type: Object,
    required: true
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model('Result', resultSchema);