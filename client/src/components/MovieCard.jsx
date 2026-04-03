import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


const CardContainer = styled.div`
  cursor: pointer;
  font-family: 'Times New Roman', Times, serif !important;
  transition: all 0.3s ease;

  &:hover h3 {
    color: #E50914;
  }
  
  * { font-family: 'Times New Roman', Times, serif !important; }
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background-color: #1a1a1a;
  height: 350px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.1);
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover .overlay {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background-color: #E50914;
  color: #fff;
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
  transition: 0.3s;

  &:hover {
    background-color: #b20710;
  }
`;


const MovieCard = ({ movie, isComingSoon, showtimeId }) => {
  const navigate = useNavigate();

  const handleBooking = (e) => {
    e.stopPropagation();

    if (isComingSoon) {
      alert("Phim này sắp chiếu, Thanh đợi thêm chút nhé!");
      return;
    }

    const targetId = showtimeId || movie.defaultShowtimeId || movie._id;

    if (targetId) {
      navigate(`/seat-selection/${targetId}`);
    } else {
      alert("Không tìm thấy mã suất chiếu!");
    }
  };

  return (
    <CardContainer onClick={handleBooking}>
      <ImageWrapper>
        <img 
          src={movie.posterURL || movie.poster || 'https://via.placeholder.com/300x450'} 
          alt={movie.title} 
        />
        <div className="overlay">
           <span style={{color: '#fff', fontWeight: 'bold'}}>XEM CHI TIẾT</span>
        </div>
      </ImageWrapper>

      <h3 style={{ 
        marginTop: '15px', 
        fontSize: '1.1rem', 
        textTransform: 'uppercase',
        fontWeight: 'bold' 
      }}>
        {movie.title}
      </h3>

      <p style={{ color: '#666', fontSize: '0.85rem', fontStyle: 'italic' }}>
        {Array.isArray(movie.genre) ? movie.genre.join(' • ') : movie.genre} 
      </p>

      {!isComingSoon && (
        <ActionButton onClick={handleBooking}>
          ĐẶT VÉ NGAY
        </ActionButton>
      )}
    </CardContainer>
  );
};

export default MovieCard;