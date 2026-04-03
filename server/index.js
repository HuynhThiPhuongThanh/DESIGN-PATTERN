require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./config/db');

const app = express();


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

const paymentRoutes = require('./routes/paymentRoutes');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes'); 
const bookingRoutes = require('./routes/bookingRoutes'); 
const newsRoutes = require('./routes/newsRoutes'); 
const showtimeRoutes = require('./routes/showtimeRoutes'); 
const userRoutes = require('./routes/userRoutes');

app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/showtimes', showtimeRoutes); 
app.use('/api/bookings', bookingRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Lỗi hệ thống Server!',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`đang chạy tại port ${PORT}`);
});