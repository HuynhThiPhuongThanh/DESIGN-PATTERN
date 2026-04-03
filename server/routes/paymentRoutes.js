const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/momo', paymentController.createMomoPayment);
router.post('/callback', paymentController.momoCallback);

module.exports = router;