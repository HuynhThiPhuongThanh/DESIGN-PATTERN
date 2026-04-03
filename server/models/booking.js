const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  showtime: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Showtime', 
    required: true 
  },
  seats: [{
    row: String,
    number: Number,
    price: Number,
    seatId: String 
  }],
  totalPrice: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], 
    default: 'CONFIRMED' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['ZaloPay', 'MoMo', 'ATM', 'Cash'],
    default: 'ZaloPay' 
  },

}, { timestamps: true }); 

module.exports = mongoose.model('Booking', bookingSchema);