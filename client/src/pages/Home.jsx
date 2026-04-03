import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { useNavigate } from 'react-router-dom';

const HomeContainer = styled.div`
  background-color: #000;
  min-height: 100vh;
  color: #fff;
  font-family: "Times New Roman", Times, serif !important;

  * {
    font-family: "Times New Roman", Times, serif !important;
  }
`;

const HeroSection = styled.section`
  position: relative;
  height: 90vh; /* Giảm nhẹ chiều cao để thấy phần phim bên dưới */
  display: flex;
  align-items: center;
  padding: 0 80px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0 30px;
  }
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Độ mờ của ảnh nền - Thanh có thể chỉnh 0.1 đến 0.3 tùy độ mờ muốn có */
    opacity: 0.2; 
    filter: blur(2px); /* Thêm hiệu ứng mờ nhẹ cho ảnh nền */
  }

  .gradient-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      black 10%,
      rgba(0, 0, 0, 0.6) 50%,
      transparent 100%
    );
  }

  .bottom-fade {
    position: absolute;
    inset: 0;
    /* Sửa lỗi to top để tạo hiệu ứng mờ dần xuống dưới */
    background: linear-gradient(to top, black, transparent 50%);
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  max-width: 800px;

  h4 {
    color: #e50914;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 5px;
    margin-bottom: 20px;
  }

  h1 {
    font-size: clamp(3rem, 8vw, 5.5rem);
    font-weight: 900;
    margin: 0;
    letter-spacing: -2px;
    font-style: italic;
    line-height: 1.1;
    text-shadow: 2px 2px 10px rgba(0,0,0,0.8);
  }

  .slogan {
    color: #e50914;
    font-size: 1.4rem;
    font-weight: bold;
    margin-top: 25px;
    margin-bottom: 40px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
`;

const PrimaryBtn = styled.button`
  background-color: #e50914;
  color: #fff;
  padding: 15px 40px;
  border: none;
  border-radius: 4px; /* Đổi sang bo góc nhẹ cho chuyên nghiệp */
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #b20710;
    transform: scale(1.05);
  }
`;

const SectionContainer = styled.section`
  padding: 60px 80px;
  background-color: ${(props) => (props.dark ? "#000" : "#080808")};

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 40px;
  border-left: 4px solid #e50914;
  padding-left: 15px;

  h2 {
    font-size: 2rem;
    font-weight: bold;
    text-transform: uppercase;
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px;
`;

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/movies");
        if (res.data.success) {
          setMovies(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);
  const nowShowing = movies.filter((m) => m.status === "IS_SHOWING");
  const comingSoon = movies.filter((m) => m.status === "COMING_SOON");

  if (loading) return <div style={{color: 'white', textAlign: 'center', marginTop: '20%'}}>ĐANG TẢI...</div>;

  return (
    <HomeContainer>
      <Navbar />
      <HeroSection>
        <HeroBg>
          <img
            src="https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=2070&auto=format&fit=cover"
            alt="galaxy-bg"
          />
          <div className="gradient-overlay" />
          <div className="bottom-fade" />
        </HeroBg>

        <HeroContent>
          <h4>CINEMAGIC GALAXY</h4>
          <h1>NƠI CẢM XÚC</h1>
          <h1>HOÀN TOÀN TỰ NHIÊN.</h1>
          <p className="slogan">TẬN HƯỞNG TỪNG KHOẢNH KHẮC ĐIỆN ẢNH.</p>
          <PrimaryBtn onClick={() => navigate('/schedule')}>
            MUA VÉ NGAY
          </PrimaryBtn>
        </HeroContent>
      </HeroSection>
      <SectionContainer>
        <SectionHeader>
          <h2>Phim đang chiếu</h2>
        </SectionHeader>
        <MovieGrid>
          {nowShowing.length > 0 ? (
            nowShowing.map((m) => <MovieCard key={m._id} movie={m} />)
          ) : (
            <p style={{color: '#444'}}>Đang cập nhật phim...</p>
          )}
        </MovieGrid>
      </SectionContainer>
      <SectionContainer dark>
        <SectionHeader style={{borderLeftColor: '#333'}}>
          <h2 style={{color: '#666'}}>Sắp ra mắt</h2>
        </SectionHeader>
        <MovieGrid>
          {comingSoon.length > 0 ? (
            comingSoon.map((m) => <MovieCard key={m._id} movie={m} isComingSoon />)
          ) : (
            <p style={{color: '#444'}}>Sắp có phim mới, chờ xíu nhé!</p>
          )}
        </MovieGrid>
      </SectionContainer>

      <footer style={{padding: '40px', textAlign: 'center', color: '#333', fontSize: '0.8rem'}}>
        © 2026 CINEMAGIC SYSTEM.
      </footer>
    </HomeContainer>
  );
};

export default Home;