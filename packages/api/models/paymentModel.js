const mongoose = require('mongoose');
const paymentStatus = require('../enums/paymentStatus');

const paymentSchema = mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  checkoutState: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: paymentStatus,
    default: paymentStatus.PENDING
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
