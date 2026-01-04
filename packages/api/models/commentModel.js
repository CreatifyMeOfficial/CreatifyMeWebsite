const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'Please provide a comment!'],
    minLength: 1,
    maxLength: 300,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    required: [true, 'Please provide a user!'],
    ref: 'User'
  }
},
  { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);