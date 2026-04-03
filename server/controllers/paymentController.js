const crypto = require('crypto');
const axios = require('axios');
const Booking = require('../models/booking');
const Showtime = require('../models/Showtime');

exports.createMomoPayment = async (req, res) => {
    try {
        const { amount, orderInfo, userId, showtimeId, seats } = req.body;
        console.log(">>> Backend nhận data:", { amount, userId, showtimeId, seats });
        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) {
            console.log("X Lỗi: Không tìm thấy Showtime");
            return res.status(404).json({ message: "Không tìm thấy suất chiếu!" });
        }
        const isTaken = showtime.seats.some(s => 
            seats.includes(s._id.toString()) && s.isBooked
        );

        if (isTaken) {
            console.log("X Lỗi: Ghế đã bị đặt");
            return res.status(400).json({ message: "Ghế đã bị người khác chọn mất rồi!" });
        }
        const partnerCode = "MOMOBKUN20180810";
        const accessKey = "klm05nuE89An78p";
        const secretkey = "at67qH668ayA4shoaYtG6692886326x";
        const requestId = partnerCode + new Date().getTime();
        const orderId = requestId;
        const redirectUrl = "http://localhost:3000/history";
        const ipnUrl = "https://your-domain.com/api/payments/callback"; 
        const requestType = "captureWallet";
        const extraData = "";
        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto.createHmac('sha256', secretkey).update(rawSignature).digest('hex');

        const requestBody = {
            partnerCode, accessKey, requestId, amount, orderId, orderInfo,
            redirectUrl, ipnUrl, extraData, requestType, signature, lang: 'vi'
        };

        console.log(">>> Đang gọi MoMo API...");
        const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody);
        
        if (response.data.resultCode !== 0) {
            console.log("X MoMo từ chối:", response.data.message);
            return res.status(400).json({ message: response.data.message });
        }
        showtime.seats.forEach(s => {
            if (seats.includes(s._id.toString())) s.isBooked = true;
        });
        await showtime.save();

        const newBooking = new Booking({
            user: userId,
            showtime: showtimeId,
            seats: seats,
            totalPrice: amount,
            orderId: orderId,
            status: 'Pending'
        });
        await newBooking.save();

        return res.json(response.data);

    } catch (error) {
        console.error("X Lỗi hệ thống:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Lỗi kết nối MoMo", detail: error.message });
    }
};

exports.momoCallback = async (req, res) => {
    res.status(204).send();
};