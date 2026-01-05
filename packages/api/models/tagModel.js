const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
  tag: {
    type: String,
    minLength: 3,
    maxLength: 25,
    required: [true, 'Please enter the tag name!'],
    unique: [true, 'This tag already exists!'],
    trim: true,
    uppercase: true
  }
});

module.exports = mongoose.model('Tag', tagSchema);