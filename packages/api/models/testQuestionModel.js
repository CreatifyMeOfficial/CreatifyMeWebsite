const mongoose = require('mongoose');
const HollandAttributes = require('../enums/HollandAttributes');
const MBTIAttributes = require('../enums/MBTIAttributes');

const testQuestionSchema = new mongoose.Schema({
  questionEn: {
    type: String,
    minLength: 10,
    required: [true, 'Please provide a question in english!'],
    unique: true,
    trim: true
  },
  questionAr: {
    type: String,
    minLength: 10,
    required: [true, 'Please provide a question in arabic!'],
    unique: true,
    trim: true
  },
  MBTIAttribute: {
    type: String,
    enum: MBTIAttributes,
    required: [true, 'Please provide MBTI attribute!']
  },
  HollandAttribute: {
    type: String,
    enum: HollandAttributes,
    required: [true, 'Please provide Holland code attribute!']
  }
});

module.exports = mongoose.model('TestQuestion', testQuestionSchema);