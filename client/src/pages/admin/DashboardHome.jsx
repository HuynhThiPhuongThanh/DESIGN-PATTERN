import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const StatCard = styled.div`
  background: #111;
  padding: 25px;
  border-radius: 12px;
  border-left: 4px solid #E50914;
  display: flex;
  flex-direction: column;
  gap: 10px;

  h3 { color: #888; font-size: 0.9rem; margin: 0; }
  span { font-size: 1.8rem; font-weight: bold; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    todayShowtimes: 0,
    totalTickets: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy thống kê:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div style={{color: 'white'}}>Đang tải thống kê...</div>;

  return (
    <div>
      <h2 style={{marginBottom: '30px'}}>TỔNG QUAN HỆ THỐNG</h2>
      <Grid>
        <StatCard>
          <h3>TỔNG PHIM</h3>
          <span>{stats.totalMovies}</span>
        </StatCard>
        <StatCard>
          <h3>LỊCH CHIẾU HÔM NAY</h3>
          <span>{stats.todayShowtimes}</span>
        </StatCard>
        <StatCard>
          <h3>VÉ ĐÃ BÁN</h3>
          <span>{stats.totalTickets.toLocaleString()}</span>
        </StatCard>
        <StatCard style={{ borderLeft: '4px solid #4caf50' }}> 
          <h3>DOANH THU (VNĐ)</h3>
          <span>{stats.totalRevenue.toLocaleString()}</span>
        </StatCard>
      </Grid>
    </div>
  );
};

export default DashboardHome;