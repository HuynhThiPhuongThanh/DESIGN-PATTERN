const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Thanh chưa đăng nhập! Vui lòng đăng nhập để tiếp tục." 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id).select('-password');

        if (!currentUser) {
            return res.status(401).json({ 
                success: false, 
                message: "Tài khoản này không còn tồn tại trên hệ thống!" 
            });
        }

        req.user = currentUser;
        next();
    } catch (err) {
        return res.status(401).json({ 
            success: false, 
            message: "Phiên đăng nhập đã hết hạn hoặc Token không hợp lệ!" 
        });
    }
};

exports.admin = (req, res, next) => {

    console.log(`[AUTH] Đang kiểm tra quyền cho: ${req.user.username} | Role: ${req.user.role}`);
    if (req.user && req.user.role.toUpperCase() === 'ADMIN') {
        next();
    } else {
        return res.status(403).json({ 
            success: false, 
            message: `Truy cập bị từ chối! Quyền ${req.user.role} không thể xem danh sách này.` 
        });
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user.role.toUpperCase();
        const allowedRoles = roles.map(role => role.toUpperCase());

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "Bạn không có quyền thực hiện hành động này!"
            });
        }
        next();
    };
};