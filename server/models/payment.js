const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  orderId: { type: String, required: true },
  transId: { type: String },
  paymentMethod: { type: String, default: 'MoMo' },
  status: { 
    type: String, 
    enum: ['Pending', 'Success', 'Failed'], 
    default: 'Pending' 
  },
  payUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);