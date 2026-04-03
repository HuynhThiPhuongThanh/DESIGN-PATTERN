import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import AuthLayout from '../components/AuthLayout';
import { Mail, Lock, UserPlus, User, Phone } from 'lucide-react'; 
import api from '../api/axios';

const FormContainer = styled.form`
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  font-family: 'Times New Roman', Times, serif !important;
  
  * {
    box-sizing: border-box;
    font-family: 'Times New Roman', Times, serif !important;
  }
`;

const CenteredTitle = styled.h1`
  text-align: center;
  font-size: 2.2rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 40px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  .input-icon {
    position: absolute;
    left: 16px;
    color: #666;
    pointer-events: none;
    display: flex;
    align-items: center;
  }
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 15px 48px;
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;

  &::placeholder {
    color: #555;
  }

  &:focus {
    border-color: #E50914;
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #E50914;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-transform: uppercase;
  margin-top: 10px;
  transition: background 0.3s;

  &:hover {
    background-color: #b20710;
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const LoginLinkText = styled.p`
  text-align: center;
  margin-top: 40px;
  color: #888;
  font-size: 1rem;

  a {
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    margin-left: 5px;
    &:hover { color: #E50914; }
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    phone: '' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);

      if (response.data.success) {
        alert("Đăng ký thành công! Chào mừng " + formData.username);
        navigate('/login');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Đăng ký thất bại!";
      alert("Lỗi: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="" subtitle="">
      <FormContainer onSubmit={handleSubmit}>
        <CenteredTitle>ĐĂNG KÝ</CenteredTitle>
        
        {/* Username */}
        <InputGroup>
          <div className="input-icon"><User size={20} /></div>
          <StyledInput 
            type="text" 
            placeholder="Họ và tên" 
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required 
          />
        </InputGroup>

        {/* Số điện thoại (Mới thêm) */}
        <InputGroup>
          <div className="input-icon"><Phone size={20} /></div>
          <StyledInput 
            type="text" 
            placeholder="Số điện thoại" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required 
          />
        </InputGroup>

        {/* Email */}
        <InputGroup>
          <div className="input-icon"><Mail size={20} /></div>
          <StyledInput 
            type="email" 
            placeholder="Địa chỉ Email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
          />
        </InputGroup>

        {/* Password */}
        <InputGroup>
          <div className="input-icon"><Lock size={20} /></div>
          <StyledInput 
            type="password" 
            placeholder="Mật khẩu" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required 
          />
        </InputGroup>

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? (
            "ĐANG XỬ LÝ..."
          ) : (
            <><UserPlus size={20}/> ĐĂNG KÝ TÀI KHOẢN</>
          )}
        </PrimaryButton>

        <LoginLinkText>
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </LoginLinkText>
      </FormContainer>
    </AuthLayout>
  );
};

export default Register;