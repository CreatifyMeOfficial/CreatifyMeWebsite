const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  tag: {
    type: String,
    minLength: [3, 'tagNameShort'],
    maxLength: [25, 'tagNameLong'],
    required: [true, 'tagNameRequired'],
    unique: true,
    trim: true,
    uppercase: true
  }
});

module.exports = mongoose.model('Tag', tagSchema);