const mongoose = require("mongoose");

const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String, 
      required: true,
    },
    endTime: {
      type: String, 
    },
    format: {
      type: String,
      enum: ["2D", "3D", "IMAX"],
      default: "2D",
    },
    cinemaRoom: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 75000,
    },
    seats: [
      {
        row: String,
        number: Number,
        seatNumber: String, 
        type: {
          type: String,
          enum: ["NORMAL", "VIP", "DOUBLE"],
          default: "NORMAL",
        },
        isBooked: { type: Boolean, default: false },
        bookedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Showtime", showtimeSchema);
