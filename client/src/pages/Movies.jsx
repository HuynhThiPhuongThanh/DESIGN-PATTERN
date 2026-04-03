import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';

const PageContainer = styled.div`
  background-color: #000;
  min-height: 100vh;
  padding-top: 120px; 
  font-family: 'Times New Roman', Times, serif !important;
  color: #fff;
  * { font-family: 'Times New Roman', Times, serif !important; }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  border-bottom: 1px solid #222;
  padding-bottom: 15px;

  button {
    background: none;
    border: none;
    color: #555;
    font-weight: bold;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 1.1rem;
    position: relative;
    transition: all 0.3s;

    &.active {
      color: #E50914;
      &:after {
        content: '';
        position: absolute;
        bottom: -16px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #E50914;
      }
    }
    &:hover { color: #fff; }
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 40px;
  padding-bottom: 100px;
`;

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState('ALL'); 
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/movies');
        if (res.data.success) {
          setMovies(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách phim:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter(movie => {
    if (filter === 'ALL') return true;
    return movie.status === filter;
  });

  if (loading) return <div style={{color: 'white', textAlign: 'center', marginTop: '20%'}}>ĐANG TẢI PHIM...</div>;

  return (
    <PageContainer>
      <Navbar />
      <ContentWrapper>
        <h1 style={{fontSize: '3.5rem', marginBottom: '10px', fontStyle: 'italic', fontWeight: '900'}}>
            DANH SÁCH PHIM
        </h1>
        <p style={{color: '#666', marginBottom: '40px', letterSpacing: '2px'}}>KHÁM PHÁ THẾ GIỚI ĐIỆN ẢNH TẠI CINEMAGIC</p>

        <FilterBar>
          <button 
            className={filter === 'ALL' ? 'active' : ''} 
            onClick={() => setFilter('ALL')}
          >
            Tất cả
          </button>
          <button 
            className={filter === 'IS_SHOWING' ? 'active' : ''} 
            onClick={() => setFilter('IS_SHOWING')}
          >
            Đang chiếu
          </button>
          <button 
            className={filter === 'COMING_SOON' ? 'active' : ''} 
            onClick={() => setFilter('COMING_SOON')}
          >
            Sắp chiếu
          </button>
        </FilterBar>

        <MovieGrid>
          {filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <MovieCard 
                key={movie._id} 
                movie={movie} 
                isComingSoon={movie.status === 'COMING_SOON'}
              />
            ))
          ) : (
            <h3 style={{color: '#333', gridColumn: '1/-1', textAlign: 'center', marginTop: '50px'}}>
                Hiện chưa có phim trong mục này.
            </h3>
          )}
        </MovieGrid>
      </ContentWrapper>
    </PageContainer>
  );
};

export default Movies;