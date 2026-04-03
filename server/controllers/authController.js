const User = require('../models/User');
const UserFactory = require('../factories/UserFactory');
const Booking = require('../models/booking');
const jwt = require('jsonwebtoken');


exports.register = async (req, res, next) => { 
    try {
        const { email, password, phone, username } = req.body;
        const newUser = await UserFactory.create('CUSTOMER', { 
            email, password, phone, username 
        });

        res.status(201).json({ 
            success: true,
            message: "Đăng ký thành công tài khoản CINEMAGIC!", 
            user: { id: newUser._id, email: newUser.email } 
        });
    } catch (err) {
        next(err); 
    }
};


exports.login = async (req, res, next) => { 
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ 
                success: false, 
                message: "Email hoặc mật khẩu không chính xác!" 
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, email: user.email, role: user.role }
        });
    } catch (err) {
        next(err);
    }
};


exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        const user = await User.findOneAndUpdate(
            { email },
            { otp, otpExpires: Date.now() + 600000 },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "Email không tồn tại" });

        console.log(`[CINEMAGIC MAILER] OTP cho ${email} là: ${otp}`); 
        res.json({ success: true, message: "Mã OTP đã được gửi!" });
    } catch (err) {
        next(err);
    }
};


exports.resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;
        
        const user = await User.findOne({ 
            email, 
            otp, 
            otpExpires: { $gt: Date.now() } 
        });

        if (!user) return res.status(400).json({ message: "OTP không chính xác hoặc hết hạn" });

        user.password = newPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ success: true, message: "Mật khẩu đã được thay đổi!" });
    } catch (err) {
        next(err);
    }
};

exports.getMyHistory = async (req, res, next) => {
    try {
        const userId = req.user.id; 

        const history = await Booking.find({ 
            user: userId, 
            status: 'Paid'
        })
        .populate({
            path: 'showtime',
            populate: { path: 'movie', select: 'title' }
        })
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        next(error);
    }
};