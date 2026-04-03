import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Clock, MapPin, Loader2 } from 'lucide-react';


const PageContainer = styled.div`
  background-color: #000;
  min-height: 100vh;
  padding-top: 120px;
  color: #fff;
  font-family: 'Times New Roman', Times, serif !important;
  * { font-family: 'Times New Roman', Times, serif !important; }
`;

const ContentWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px 80px;
`;

const PageTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 900;
  font-style: italic;
  text-transform: uppercase;
  margin-bottom: 40px;
  border-left: 8px solid #E50914;
  padding-left: 25px;
`;

const DateStrip = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 50px;
  overflow-x: auto;
  padding-bottom: 15px;
  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
`;

const DateCard = styled.div`
  min-width: 90px;
  padding: 20px 10px;
  background: ${props => props.active ? '#E50914' : '#111'};
  border: 1px solid ${props => props.active ? '#E50914' : '#222'};
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  &:hover { border-color: #E50914; }
  .day-name { font-size: 0.8rem; text-transform: uppercase; color: ${props => props.active ? '#eee' : '#666'}; margin-bottom: 5px; }
  .day-number { font-size: 1.5rem; font-weight: bold; }
`;

const MovieScheduleCard = styled.div`
  display: flex;
  gap: 30px;
  background: #080808;
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 30px;
  border: 1px solid #111;
  @media (max-width: 768px) { flex-direction: column; }
`;

const MoviePoster = styled.img`
  width: 180px;
  height: 260px;
  object-fit: cover;
  border-radius: 12px;
`;

const ScheduleDetails = styled.div`
  flex: 1;
  h2 { font-size: 1.8rem; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; color: #E50914; }
  .meta { display: flex; gap: 20px; color: #888; font-size: 0.9rem; margin-bottom: 25px; font-style: italic; }
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
`;

const TimeSlot = styled.button`
  background: transparent;
  border: 1px solid #333;
  color: #fff;
  padding: 12px 0;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #fff; color: #000; border-color: #fff; }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px;
  color: #E50914;
`;

const Schedule = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      fullDate: d.toISOString().split('T')[0],
      name: i === 0 ? 'Hôm nay' : d.toLocaleDateString('vi-VN', { weekday: 'short' }),
      date: d.getDate()
    };
  });

  useEffect(() => {
    const fetchSchedules = async () => {
        setLoading(true);
        setMovies([]); 
        try {
            const res = await axios.get(`http://localhost:5000/api/showtimes/by-date?date=${selectedDate}`);
            
            if (res.data.success && res.data.data.length > 0) {
                const grouped = res.data.data.reduce((acc, curr) => {
                    if (!curr.movie) return acc;
                    const title = curr.movie.title;
                    if (!acc[title]) acc[title] = { ...curr.movie, showtimes: [] };
                    acc[title].showtimes.push({ id: curr._id, time: curr.startTime });
                    return acc;
                }, {});
                setMovies(Object.values(grouped));
            } else {
                setMovies([]); 
            }
        } catch (err) {
            console.error("Lỗi lấy lịch chiếu:", err);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };
    fetchSchedules();
}, [selectedDate]);

  return (
    <PageContainer>
      <Navbar />
      <ContentWrapper>
        <PageTitle>Lịch Chiếu Phim</PageTitle>

        <DateStrip>
          {days.map((d, index) => (
            <DateCard 
              key={index} 
              active={selectedDate === d.fullDate}
              onClick={() => setSelectedDate(d.fullDate)}
            >
              <div className="day-name">{d.name}</div>
              <div className="day-number">{d.date}</div>
            </DateCard>
          ))}
        </DateStrip>

        {loading ? (
          <LoadingWrapper><Loader2 className="animate-spin" size={40}/></LoadingWrapper>
        ) : movies.length > 0 ? (
          movies.map((movie, idx) => (
            <MovieScheduleCard key={idx}>
              <MoviePoster src={movie.posterURL} alt={movie.title} />
              <ScheduleDetails>
                <h2>{movie.title}</h2>
                <div className="meta">
                  <span><Clock size={16} /> {movie.duration} phút</span>
                  <span>{movie.genre?.join(' / ')}</span>
                  <span><MapPin size={16} /> CINEMAGIC Vũng Tàu</span>
                </div>
                <div style={{color: '#555', marginBottom: '15px', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase'}}>Chọn suất chiếu:</div>
                <TimeGrid>
                  {movie.showtimes.map((slot) => (
                    <TimeSlot key={slot.id} onClick={() => navigate(`/seat-selection/${slot.id}`)}>
                      {slot.time}
                    </TimeSlot>
                  ))}
                </TimeGrid>
              </ScheduleDetails>
            </MovieScheduleCard>
          ))
        ) : (
          <div style={{textAlign: 'center', color: '#444', marginTop: '50px'}}>Không có suất chiếu cho ngày này.</div>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default Schedule;