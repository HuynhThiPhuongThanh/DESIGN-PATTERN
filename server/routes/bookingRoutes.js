const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-history', protect, bookingController.getUserBookingHistory);

router.post('/create', protect, bookingController.createBooking);

module.exports = router;