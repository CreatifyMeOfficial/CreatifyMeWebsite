const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'commentRequired'],
    minLength: [1, 'commentShort'],
    maxLength: [300, 'commentLong'],
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    required: [true, 'commentCreatedByRequired'],
    ref: 'User'
  }
},
  { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);