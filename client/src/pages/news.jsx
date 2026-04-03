import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Navbar from '../components/Navbar';

const NewsContainer = styled.div`
  background-color: #000;
  min-height: 100vh;
  padding: 120px 5% 50px;
  color: #fff;
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const NewsCard = styled.div`
  background: #111;
  border-radius: 10px;
  overflow: hidden;
  transition: 0.3s;
  border: 1px solid #222;
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    border-color: #E50914;
    box-shadow: 0 10px 20px rgba(229, 9, 20, 0.2);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .content {
    padding: 20px;
    h3 { margin: 0 0 10px; color: #fff; font-size: 1.2rem; }
    p { color: #888; font-size: 0.9rem; line-height: 1.5; }
    .footer {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #E50914;
      font-weight: bold;
    }
  }
`;

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/news');
        if (res.data.success) {
          setNewsList(res.data.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Lỗi lấy tin tức:", err);
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <NewsContainer>
      <Navbar />
      <h1 style={{ borderLeft: '5px solid #E50914', paddingLeft: '15px' }}>
        TIN TỨC & SỰ KIỆN
      </h1>
      
      {loading ? (
        <p>Đang tải tin tức...</p>
      ) : (
        <NewsGrid>
          {newsList.map((item) => (
            <NewsCard key={item._id}>
              <img src={item.imageURL} alt={item.title} />
              <div className="content">
                <span style={{fontSize: '0.7rem', color: '#E50914'}}>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.content.substring(0, 100)}...</p>
                <div className="footer">
                  <span>CHI TIẾT →</span>
                  <span style={{color: '#555'}}>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </NewsCard>
          ))}
        </NewsGrid>
      )}
    </NewsContainer>
  );
};

export default News;