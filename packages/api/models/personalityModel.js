const mongoose = require('mongoose');

const personalitySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  arabicDescription: {
    type: String,
    required: true,
    trim: true
  },
  englishDescription: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }]
});


module.exports = mongoose.model('Personality', personalitySchema);