import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Save, Image as ImageIcon, Type, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const FormGrid = styled.form`
  display: flex; flex-direction: column; gap: 20px;
  background: #111; padding: 30px; border-radius: 12px;
  max-width: 900px; margin: 0 auto;
`;

const InputGroup = styled.div`
  display: flex; flex-direction: column; gap: 8px;
  label { color: #888; font-size: 0.9rem; display: flex; align-items: center; gap: 5px; }
  input, textarea, select {
    padding: 12px; background: #050505; border: 1px solid #333;
    color: white; border-radius: 6px; outline: none;
    &:focus { border-color: #E50914; }
  }
`;

const NewsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [newsData, setNewsData] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'CINE_NEWS',
    imageURL: ''
  });

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/news/${id}`)
        .then(res => {
          if (res.data.success) setNewsData(res.data.data);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = id 
        ? `http://localhost:5000/api/news/${id}` 
        : 'http://localhost:5000/api/news';
      
      const method = id ? 'patch' : 'post';

      await axios[method](url, newsData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(id ? "Cập nhật tin tức thành công!" : "Đã đăng tin tức mới!");
      navigate('/admin/news');
    } catch (err) {
      alert("Lỗi: " + err.response?.data?.message);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: 'white' }}>
        {id ? 'CHỈNH SỬA TIN TỨC' : 'VIẾT TIN TỨC MỚI'}
      </h2>
      <FormGrid onSubmit={handleSubmit}>
        <InputGroup>
          <label><Type size={16}/> Tiêu đề bài viết</label>
          <input 
            type="text" required 
            value={newsData.title}
            placeholder="Ví dụ: Khai trương cụm rạp mới tại Vũng Tàu"
            onChange={e => setNewsData({...newsData, title: e.target.value})} 
          />
        </InputGroup>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <InputGroup>
            <label><ImageIcon size={16}/> Link ảnh đại diện (URL)</label>
            <input 
              type="text" required 
              value={newsData.imageURL}
              placeholder="https://imgur.com/..." 
              onChange={e => setNewsData({...newsData, imageURL: e.target.value})} 
            />
          </InputGroup>

          <InputGroup>
            <label>Chuyên mục</label>
            <select 
              value={newsData.category}
              onChange={e => setNewsData({...newsData, category: e.target.value})}
            >
              <option value="CINE_NEWS">Tin điện ảnh</option>
              <option value="PROMOTION">Khuyến mãi</option>
              <option value="EVENT">Sự kiện</option>
            </select>
          </InputGroup>
        </div>

        <InputGroup>
          <label><FileText size={16}/> Tóm tắt ngắn</label>
          <textarea 
            rows="2" required 
            value={newsData.summary}
            placeholder="Viết một đoạn ngắn giới thiệu tin tức..."
            onChange={e => setNewsData({...newsData, summary: e.target.value})} 
          />
        </InputGroup>

        <InputGroup>
          <label>Nội dung chi tiết</label>
          <textarea 
            rows="10" required 
            value={newsData.content}
            placeholder="Nhập nội dung bài viết ở đây..."
            onChange={e => setNewsData({...newsData, content: e.target.value})} 
          />
        </InputGroup>

        <button type="submit" style={{ padding: '15px', background: '#E50914', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <Save size={18}/> {id ? 'CẬP NHẬT BÀI VIẾT' : 'XUẤT BẢN TIN TỨC'}
        </button>
      </FormGrid>
    </div>
  );
};

export default NewsForm;