const mongoose = require('mongoose');
const HollandAttributes = require('../enums/HollandAttributes');
const MBTIAttributes = require('../enums/MBTIAttributes');

const testQuestionSchema = new mongoose.Schema({
  questionEn: {
    type: String,
    minLength: [10, 'questionEnShort'],
    required: [true, 'questionEnRequired'],
    unique: true,
    trim: true
  },
  questionAr: {
    type: String,
    minLength: [10, 'questionArShort'],
    required: [true, 'questionArRequired'],
    unique: true,
    trim: true
  },
  MBTIAttribute: {
    type: String,
    enum: MBTIAttributes,
    required: [true, 'mbtiRequired']
  },
  HollandAttribute: {
    type: String,
    enum: HollandAttributes,
    required: [true, 'hollandRequired']
  }
});

module.exports = mongoose.model('TestQuestion', testQuestionSchema);