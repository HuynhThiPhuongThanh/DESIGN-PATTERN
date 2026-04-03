import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { CalendarPlus, Trash2, Edit, Film, Monitor, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  color: white;
  font-family: 'Times New Roman', Times, serif;
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #333;
  padding-bottom: 20px;
`;

const AddBtn = styled.button`
  background-color: #ffc107;
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  &:hover { 
    background-color: #e0a800; 
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #111;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);

  th, td { 
    padding: 20px 15px; 
    text-align: left; 
    border-bottom: 1px solid #222; 
  }

  th { 
    background: #1a1a1a; 
    color: #ffc107; 
    font-size: 0.85rem; 
    text-transform: uppercase; 
    letter-spacing: 1.5px;
  }

  tr:last-child td { border-bottom: none; }
  tr:hover { background: #161616; }
`;

const ActionBtn = styled.button`
  background: #222;
  border: 1px solid #333;
  color: ${props => props.color || "white"};
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 8px;
  transition: 0.2s;
  &:hover { 
    background: ${props => props.hoverBg || "#333"}; 
    transform: translateY(-2px);
  }
`;

const FormatBadge = styled.span`
  background: #E50914;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px;
  color: #ffc107;
  svg { animation: ${spin} 1s linear infinite; margin-bottom: 15px; }
`;

const ScheduleManagement = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/showtimes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setSchedules(res.data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy lịch chiếu:", err);
      if (err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Thanh có chắc chắn muốn xóa suất chiếu này không? Hành động này không thể hoàn tác!")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/showtimes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSchedules(prev => prev.filter(item => item._id !== id));
      } catch (err) {
        alert("Lỗi: " + (err.response?.data?.message || "Không thể xóa"));
      }
    }
  };
  const formatVNTime = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) return (
    <LoadingWrapper>
      <Loader2 size={40} />
      <p>Đang tải dữ liệu lịch chiếu cho Thanh...</p>
    </LoadingWrapper>
  );

  return (
    <Container>
      <Header>
        <div>
          <h2 style={{ letterSpacing: '2px', margin: 0 }}>QUẢN LÝ LỊCH CHIẾU</h2>
          <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '5px' }}>Tổng cộng: {schedules.length} suất chiếu</p>
        </div>
        <AddBtn onClick={() => navigate('/admin/schedule/add')}>
          <CalendarPlus size={20}/> TẠO LỊCH CHIẾU MỚI
        </AddBtn>
      </Header>
      
      {schedules.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Phim & Mã suất</th>
              <th>Phòng chiếu</th>
              <th>Thời gian</th>
              <th>Định dạng</th>
              <th>Giá vé</th>
              <th style={{ textAlign: 'center' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((item) => (
              <tr key={item._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Film size={20} color="#E50914" />
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                        {item.movie?.title || <span style={{color: '#555'}}>Phim không xác định</span>}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#555' }}>
                        #{item._id.slice(-8).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <Monitor size={16} color="#888" />
                     {item.cinemaRoom}
                   </div>
                </td>
                <td>
                  <div style={{ color: '#ffc107', fontWeight: 'bold' }}>{item.startTime}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>
                    {formatVNTime(item.date)}
                  </div>
                </td>
                <td>
                  <FormatBadge>{item.format}</FormatBadge>
                </td>
                <td style={{ color: '#4caf50', fontWeight: 'bold' }}>
                  {item.price?.toLocaleString('vi-VN')} đ
                </td>
                <td style={{ textAlign: 'center' }}>
                  <ActionBtn 
                    color="#007bff" 
                    hoverBg="rgba(0, 123, 255, 0.1)"
                    onClick={() => navigate(`/admin/schedule/edit/${item._id}`)}
                    title="Chỉnh sửa"
                  >
                    <Edit size={18} />
                  </ActionBtn>
                  <ActionBtn 
                    color="#dc3545" 
                    hoverBg="rgba(220, 53, 69, 0.1)"
                    onClick={() => handleDelete(item._id)}
                    title="Xóa suất chiếu"
                  >
                    <Trash2 size={18} />
                  </ActionBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div style={{
          background: '#111', padding: '100px 20px', textAlign: 'center', 
          borderRadius: '15px', border: '1px dashed #333'
        }}>
          <AlertCircle size={48} color="#333" style={{ marginBottom: '20px' }} />
          <p style={{ fontSize: '1.2rem', color: '#888' }}>Danh sách đang trống.</p>
          <AddBtn style={{ margin: '20px auto' }} onClick={() => navigate('/admin/schedule/add')}>
            Bắt đầu tạo suất đầu tiên
          </AddBtn>
        </div>
      )}
    </Container>
  );
};

export default ScheduleManagement;