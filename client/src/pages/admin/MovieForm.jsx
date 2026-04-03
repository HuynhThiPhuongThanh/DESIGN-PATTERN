import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Save, PlayCircle, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const FormGrid = styled.form`
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
  background: #111; padding: 30px; border-radius: 12px;
`;

const InputGroup = styled.div`
  display: flex; flex-direction: column; gap: 8px;
  &.full-width { grid-column: span 2; }
  label { color: #888; font-size: 0.9rem; display: flex; align-items: center; gap: 5px; }
  input, textarea, select {
    padding: 12px; background: #050505; border: 1px solid #333;
    color: white; border-radius: 6px; outline: none;
    &:focus { border-color: #E50914; }
  }
`;

const PreviewSection = styled.div`
  grid-column: span 2; display: grid; grid-template-columns: 180px 1fr;
  gap: 20px; margin-top: 10px; padding: 15px; background: #1a1a1a; border-radius: 8px;
  img { width: 100%; border-radius: 4px; object-fit: cover; height: 250px; border: 1px solid #333; }
`;

const MovieForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieData, setMovieData] = useState({
    title: '',
    description: '',
    duration: '',
    releaseDate: '',
    posterURL: '',
    trailerURL: '',
    status: 'COMING_SOON',
    genre: '',
    language: 'Tiếng Việt'
  });

  useEffect(() => {
    if (id) {
      const fetchMovie = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/movies/${id}`);
          if (res.data.success) {
            const m = res.data.data;
            setMovieData({
              ...m,
              releaseDate: m.releaseDate ? m.releaseDate.split('T')[0] : '',
              genre: m.genre ? m.genre.join(', ') : ''
            });
          }
        } catch (err) {
          console.error("Lỗi lấy thông tin phim:", err);
        }
      };
      fetchMovie();
    }
  }, [id]);


  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const dataToSend = {
        ...movieData,
        genre: typeof movieData.genre === 'string' ? movieData.genre.split(',').map(g => g.trim()) : movieData.genre
      };

if (id) {

  await axios.put(`http://localhost:5000/api/movies/${id}`, dataToSend, {
    headers: { Authorization: `Bearer ${token}` }
  });
  alert("Cập nhật phim thành công!");
      } else {

        await axios.post('http://localhost:5000/api/movies', dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Thêm phim mới thành công!");
      }
      navigate('/admin/movies');
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || "Thao tác thất bại"));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <ArrowLeft style={{ cursor: 'pointer', color: 'white' }} onClick={() => navigate('/admin/movies')} />
        <h2 style={{ color: 'white', textTransform: 'uppercase' }}>
            {id ? 'Chỉnh sửa thông tin phim' : 'Thêm phim mới vào hệ thống'}
        </h2>
      </div>

      <FormGrid onSubmit={handleSubmit}>
        <InputGroup className="full-width">
          <label>Tên Phim</label>
          <input type="text" required value={movieData.title} onChange={e => setMovieData({...movieData, title: e.target.value})} />
        </InputGroup>

        <InputGroup>
          <label><ImageIcon size={16}/> Poster URL (Link ảnh)</label>
          <input type="text" required value={movieData.posterURL} onChange={e => setMovieData({...movieData, posterURL: e.target.value})} />
        </InputGroup>

        <InputGroup>
          <label><PlayCircle size={16}/> Trailer URL (Youtube)</label>
          <input type="text" value={movieData.trailerURL} onChange={e => setMovieData({...movieData, trailerURL: e.target.value})} />
        </InputGroup>
        {(movieData.posterURL || movieData.trailerURL) && (
          <PreviewSection>
            <div>
              <p style={{fontSize: '0.7rem', color: '#666', marginBottom: '5px'}}>Poster Preview:</p>
              {movieData.posterURL ? <img src={movieData.posterURL} alt="Preview" /> : <div style={{height: '250px', background: '#000'}}></div>}
            </div>
            <div>
              <p style={{fontSize: '0.7rem', color: '#666', marginBottom: '5px'}}>Trailer Preview:</p>
              {getEmbedUrl(movieData.trailerURL) ? (
                <iframe width="100%" height="250" src={getEmbedUrl(movieData.trailerURL)} title="Trailer" frameBorder="0" allowFullScreen></iframe>
              ) : <div style={{height: '250px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444'}}>Link Youtube không hợp lệ</div>}
            </div>
          </PreviewSection>
        )}

        <InputGroup>
          <label>Ngày phát hành</label>
          <input type="date" required value={movieData.releaseDate} onChange={e => setMovieData({...movieData, releaseDate: e.target.value})} />
        </InputGroup>

        <InputGroup>
          <label>Thời Lượng (Phút)</label>
          <input type="number" required value={movieData.duration} onChange={e => setMovieData({...movieData, duration: e.target.value})} />
        </InputGroup>

        <InputGroup>
          <label>Thể loại (Cách nhau bởi dấu phẩy)</label>
          <input type="text" value={movieData.genre} placeholder="Hành động, Viễn tưởng..." onChange={e => setMovieData({...movieData, genre: e.target.value})} />
        </InputGroup>

        <InputGroup>
          <label>Trạng Thái</label>
          <select value={movieData.status} onChange={e => setMovieData({...movieData, status: e.target.value})}>
            <option value="IS_SHOWING">Đang chiếu</option>
            <option value="COMING_SOON">Sắp chiếu</option>
            <option value="END_SHOW">Đã kết thúc</option>
          </select>
        </InputGroup>

        <InputGroup className="full-width">
          <label>Mô tả phim</label>
          <textarea rows="4" required value={movieData.description} onChange={e => setMovieData({...movieData, description: e.target.value})} />
        </InputGroup>

        <button type="submit" style={{ gridColumn: 'span 2', padding: '15px', background: '#E50914', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          <Save size={18} style={{marginRight: '8px'}}/> {id ? 'CẬP NHẬT THÔNG TIN' : 'LƯU PHIM VÀO HỆ THỐNG'}
        </button>
      </FormGrid>
    </div>
  );
};

export default MovieForm;