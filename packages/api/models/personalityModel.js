const mongoose = require('mongoose');

const personalitySchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'personalityCodeRequired'],
    unique: true,
    trim: true,
    uppercase: true
  },
  arabicDescription: {
    type: String,
    required: [true, 'personalityArabicDescriptionRequired'],
    trim: true
  },
  englishDescription: {
    type: String,
    required: [true, 'personalityEnglishDescriptionRequired'],
    trim: true
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }]
});


module.exports = mongoose.model('Personality', personalitySchema);