const Movie = require('../models/Movie');
const Booking = require('../models/booking');
const Showtime = require('../models/Showtime');

exports.createBooking = async (req, res) => {
    try {
        const { showtimeId, seatIds, totalPrice, paymentMethod } = req.body;
        const userId = req.user._id; 
        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) return res.status(404).json({ message: "Không tìm thấy suất chiếu" });
        const isAnySeatTaken = showtime.seats.some(
            s => seatIds.includes(s._id.toString()) && s.isBooked
        );

        if (isAnySeatTaken) {
            return res.status(400).json({ message: "Một số ghế đã có người đặt. Vui lòng chọn ghế khác!" });
        }
        const selectedSeatsDetails = [];
        seatIds.forEach(id => {
            const seat = showtime.seats.id(id);
            if (seat) {
                seat.isBooked = true;
                seat.bookedBy = userId;
                selectedSeatsDetails.push({
                    row: seat.row,
                    number: seat.number,
                    type: seat.type 
                });
            }
        });
        await showtime.save();
        const newBooking = await Booking.create({
            user: userId,
            showtime: showtimeId,
            seats: selectedSeatsDetails,
            totalPrice,
            paymentMethod,
            status: 'CONFIRMED'
        });

        res.status(201).json({
            success: true,
            message: "Thanh toán thành công! Vé của bạn đã sẵn sàng.",
            data: newBooking
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getUserBookingHistory = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate({
                path: 'showtime',
                populate: { path: 'movie', select: 'title posterURL duration' }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bookings
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }

    exports.getDashboardStats = async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const todayShowtimes = await Showtime.countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay }
    });
    const revenueStats = await Booking.aggregate([
      { $match: { status: 'Paid' } },
      { 
        $group: { 
          _id: null, 
          totalTickets: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalPrice" } 
        } 
      }
    ]);

    const stats = {
      totalMovies,
      todayShowtimes,
      totalTickets: revenueStats[0]?.totalTickets || 0,
      totalRevenue: revenueStats[0]?.totalRevenue || 0
    };

    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

};
exports.getBookingDetail = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate({
                path: 'showtime',
                populate: { path: 'movie', select: 'title posterURL' }
            });

        if (!booking) return res.status(404).json({ message: "Không tìm thấy vé" });
        
        res.status(200).json({ success: true, data: booking });
    } catch (err) {
        res.status(400).json({ success: false, error: "ID vé không hợp lệ" });
    }
};