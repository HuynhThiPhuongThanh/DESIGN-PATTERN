const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/by-date', showtimeController.getShowtimesByDate);

router.get('/:id', showtimeController.getShowtimeById);

router.get('/', protect, admin, showtimeController.getAllShowtimes);
router.post('/', protect, admin, showtimeController.createShowtime);
router.delete('/:id', protect, admin, showtimeController.deleteShowtime);

module.exports = router;