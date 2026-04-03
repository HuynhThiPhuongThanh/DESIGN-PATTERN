import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Ticket, Calendar, MapPin, CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
  color: white;
  font-family: 'Times New Roman', Times, serif;
`;

const Title = styled.h2`
  text-transform: uppercase;
  letter-spacing: 2px;
  border-bottom: 2px solid #E50914;
  display: inline-block;
  padding-bottom: 10px;
  margin-bottom: 30px;
`;

const BookingCard = styled.div`
  background: #111;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 20px;
  align-items: center;
  transition: 0.3s;
  cursor: pointer;
  &:hover { border-color: #E50914; transform: translateX(5px); }
`;

const MoviePoster = styled.div`
  width: 120px;
  height: 160px;
  background: #222;
  border-radius: 8px;
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  h3 { margin: 0; color: #ffc107; font-size: 1.2rem; }
  p { margin: 0; color: #888; font-size: 0.9rem; display: flex; align-items: center; gap: 5px; }
`;

const StatusBadge = styled.span`
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
  background: ${props => 
    props.status === 'Paid' ? 'rgba(40, 167, 69, 0.2)' : 
    props.status === 'Pending' ? 'rgba(255, 193, 7, 0.2)' : 'rgba(220, 53, 69, 0.2)'};
  color: ${props => 
    props.status === 'Paid' ? '#28a745' : 
    props.status === 'Pending' ? '#ffc107' : '#dc3545'};
`;

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/bookings/mine', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) setBookings(res.data.data);
      } catch (err) {
        console.error("Lỗi lấy lịch sử:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusIcon = (status) => {
    if (status === 'Paid') return <CheckCircle2 size={14} />;
    if (status === 'Pending') return <Clock size={14} />;
    return <XCircle size={14} />;
  };

  if (loading) return <div style={{textAlign: 'center', padding: '100px'}}>Đang tìm lại vé cho Thanh...</div>;

  return (
    <Container>
      <Title>Lịch sử đặt vé</Title>
      
      {bookings.length > 0 ? (
        bookings.map((b) => (
          <BookingCard key={b._id} onClick={() => navigate(`/booking-detail/${b._id}`)}>
            <MoviePoster>
              <img src={b.showtime?.movie?.poster} alt="poster" />
            </MoviePoster>
            
            <Info>
              <StatusBadge status={b.status}>
                {getStatusIcon(b.status)} {b.status === 'Paid' ? 'ĐÃ THANH TOÁN' : b.status === 'Pending' ? 'CHỜ THANH TOÁN' : 'ĐÃ HỦY'}
              </StatusBadge>
              <h3>{b.showtime?.movie?.title}</h3>
              <p><Calendar size={14} /> {b.showtime?.date} | {b.showtime?.startTime}</p>
              <p><MapPin size={14} /> {b.showtime?.cinemaRoom}</p>
              <p><Ticket size={14} /> Ghế: {b.seats.map(s => s.seatNumber).join(', ')}</p>
              <p style={{color: '#ffc107', fontWeight: 'bold', marginTop: '5px'}}>
                Tổng: {b.totalPrice?.toLocaleString()} đ
              </p>
            </Info>

            <ChevronRight color="#444" />
          </BookingCard>
        ))
      ) : (
        <div style={{textAlign: 'center', padding: '50px', background: '#111', borderRadius: '12px'}}>
          <p color="#666">Thanh chưa có giao dịch nào. Đi xem phim thôi!</p>
        </div>
      )}
    </Container>
  );
};

export default History;