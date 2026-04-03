import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Container = styled.div` color: white; `;
const Header = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; `;
const AddBtn = styled.button`
  background-color: #E50914; color: white; border: none; padding: 10px 20px;
  border-radius: 6px; display: flex; align-items: center; gap: 8px; cursor: pointer;
  font-weight: bold; &:hover { background-color: #b20710; }
`;
const Table = styled.table`
  width: 100%; border-collapse: collapse; background: #111; border-radius: 8px; overflow: hidden;
  th, td { padding: 15px; text-align: left; border-bottom: 1px solid #222; }
  th { background-color: #1a1a1a; color: #888; text-transform: uppercase; font-size: 0.8rem; }
  .actions { display: flex; gap: 15px; color: #888; .edit:hover { color: #4ea8de; } .delete:hover { color: #E50914; } }
`;

const MovieManagement = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/movies');
      if (res.data.success) setMovies(res.data.data);
    } catch (err) { 
      console.error("Lỗi lấy danh sách phim:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchMovies(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Thanh có chắc muốn xóa phim này không?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/movies/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMovies(); 
      } catch (err) { 
        alert("Không thể xóa phim! Kiểm tra lại quyền Admin nhé."); 
      }
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'IS_SHOWING': return { text: 'Đang chiếu', color: '#28a745' };
      case 'COMING_SOON': return { text: 'Sắp chiếu', color: '#ffc107' };
      case 'END_SHOW': return { text: 'Đã kết thúc', color: '#666' };
      default: return { text: status, color: '#fff' };
    }
  };

  return (
    <Container>
      <Header>
        <h2 style={{ textTransform: 'uppercase' }}>Quản lý kho phim ({movies.length})</h2>
        <AddBtn onClick={() => navigate('/admin/movies/add')}>
          <Plus size={20}/> THÊM PHIM MỚI
        </AddBtn>
      </Header>
      <Table>
        <thead>
          <tr>
            <th>Tên Phim</th>
            <th>Trạng Thái</th>
            <th>Thời Lượng</th>
            <th>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="4" style={{textAlign: 'center', padding: '50px'}}>Đang kết nối Database...</td></tr>
          ) : movies.length > 0 ? (
            movies.map((movie) => {
              const statusInfo = getStatusLabel(movie.status);
              return (
                <tr key={movie._id}>
                  <td style={{ fontWeight: 'bold' }}>{movie.title}</td>
                  <td style={{ color: statusInfo.color, fontWeight: '500' }}>
                    {statusInfo.text}
                  </td>
                  <td>{movie.duration} phút</td>
                  <td className="actions">
                    <Edit 
                      size={18} 
                      className="edit" 
                      style={{cursor: 'pointer'}} 
                      onClick={() => navigate(`/admin/movies/edit/${movie._id}`)} 
                    />
                    <Trash2 
                      size={18} 
                      className="delete" 
                      style={{cursor: 'pointer'}} 
                      onClick={() => handleDelete(movie._id)} 
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr><td colSpan="4" style={{textAlign: 'center', padding: '50px'}}>Kho phim đang trống. Hãy thêm phim mới!</td></tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default MovieManagement;