import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Armchair, Ticket, Calendar, MapPin, CreditCard, Loader2, Film } from 'lucide-react';


const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  min-height: 100vh;
  background: #050505;
  color: white;
  font-family: 'Times New Roman', Times, serif;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SeatSection = styled.div`
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: radial-gradient(circle at top, #1a1a1a 0%, #050505 100%);
`;

const Screen = styled.div`
  width: 80%;
  height: 8px;
  background: #E50914;
  margin-bottom: 50px;
  border-radius: 50% / 100% 100% 0 0;
  box-shadow: 0 15px 30px rgba(229, 9, 20, 0.5);
  position: relative;
  &::after {
    content: "MÀN HÌNH";
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    color: #444;
    letter-spacing: 5px;
  }
`;

const SeatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr); /* 10 ghế mỗi hàng x 4 hàng = 40 ghế */
  gap: 12px;
  margin-top: 20px;
`;

const Seat = styled.div`
  width: 35px;
  height: 32px;
  border-radius: 6px 6px 2px 2px;
  cursor: ${props => (props.isBooked ? 'not-allowed' : 'pointer')};
  background: ${props => 
    props.isBooked ? '#333' : 
    props.isSelected ? '#ffc107' : '#fff'};
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  color: ${props => (props.isSelected || props.isBooked ? '#000' : '#888')};

  &:hover {
    transform: ${props => (props.isBooked ? 'none' : 'scale(1.2)')};
    background: ${props => !props.isBooked && !props.isSelected && '#e50914'};
    color: ${props => !props.isBooked && '#fff'};
  }
`;

const Sidebar = styled.div`
  background: #111;
  padding: 30px;
  border-left: 1px solid #222;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const SummaryItem = styled.div`
  display: flex;
  gap: 15px;
  align-items: flex-start;
  h4 { margin: 0; color: #ffc107; font-size: 1.1rem; }
  p { margin: 5px 0 0; color: #aaa; font-size: 0.9rem; }
`;

const CheckoutBtn = styled.button`
  background: #E50914;
  color: white;
  border: none;
  padding: 18px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: auto;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: #ff0a16; transform: translateY(-2px); }
  &:disabled { background: #444; cursor: not-allowed; }
`;

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowtime = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/showtimes/${id}`);
        if (res.data.success) setShowtime(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShowtime();
  }, [id]);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;
    if (selectedSeats.find(s => s._id === seat._id)) {
      setSelectedSeats(selectedSeats.filter(s => s._id !== seat._id));
    } else {
      if (selectedSeats.length >= 8) return alert("Thanh ơi, tối đa 8 ghế thôi nhé!");
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalPrice = selectedSeats.length * (showtime?.price || 0);

  if (loading) return <div style={{padding: '100px', textAlign: 'center'}}><Loader2 className="animate-spin" /></div>;

  return (
    <PageContainer>
      <SeatSection>
        <Screen />
        
        <SeatGrid>
          {showtime?.seats?.map((seat) => (
            <Seat 
              key={seat._id}
              isBooked={seat.isBooked}
              isSelected={selectedSeats.find(s => s._id === seat._id)}
              onClick={() => handleSeatClick(seat)}
            >
              {seat.seatNumber}
            </Seat>
          ))}
        </SeatGrid>
    
        {/* Chú thích màu ghế - Đã gộp và xóa lặp */}
        <div style={{ display: 'flex', gap: '30px', marginTop: '50px', fontSize: '0.8rem', color: '#888' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 15, height: 15, background: '#fff', borderRadius: 3 }} /> 
            Trống
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 15, height: 15, background: '#ffc107', borderRadius: 3 }} /> 
            Đang chọn
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 15, height: 15, background: '#333', borderRadius: 3 }} /> 
            Đã đặt
          </div>
        </div>
      </SeatSection>

      <Sidebar>
        <SummaryItem>
          <Film color="#E50914" />
          <div>
            <h4>{showtime?.movie?.title}</h4>
            <p>{showtime?.format} - {showtime?.cinemaRoom}</p>
          </div>
        </SummaryItem>

        <SummaryItem>
          <Calendar color="#E50914" />
          <div>
            <p>Suất chiếu: <strong>{showtime?.startTime}</strong></p>
            <p>Ngày: {showtime?.date}</p>
          </div>
        </SummaryItem>

        <SummaryItem>
          <Armchair color="#E50914" />
          <div>
            <p>Ghế đã chọn:</p>
            <h4 style={{ color: 'white' }}>
              {selectedSeats.length > 0 ? selectedSeats.map(s => s.seatNumber).join(', ') : 'Chưa chọn'}
            </h4>
          </div>
        </SummaryItem>

        <div style={{ borderTop: '1px dashed #333', paddingTop: '20px', marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Tạm tính:</span>
            <span>{totalPrice.toLocaleString()} đ</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 'bold' }}>
            <span style={{ color: '#ffc107' }}>TỔNG TIỀN:</span>
            <span style={{ color: '#ffc107' }}>{totalPrice.toLocaleString()} đ</span>
          </div>
        </div>

        <CheckoutBtn 
          disabled={selectedSeats.length === 0}
          onClick={() => navigate('/payment', { state: { showtime, selectedSeats, totalPrice } })}
        >
          <CreditCard size={20} style={{ marginRight: '10px' }} />
          XÁC NHẬN ĐẶT VÉ
        </CheckoutBtn>
      </Sidebar>
    </PageContainer>
  );
};

export default BookingPage;