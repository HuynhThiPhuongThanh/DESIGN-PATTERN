import React, { useState } from 'react';
import styled from 'styled-components';
import AuthLayout from '../components/AuthLayout';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 



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
  color: #fff; /* Chữ trắng bình thường */
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

  .eye-icon {
    position: absolute;
    right: 16px;
    cursor: pointer;
    color: #666;
    display: flex;
    align-items: center;
    &:hover { color: #fff; }
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
    border-color: #E50914; /* Vẫn giữ viền đỏ khi focus để người dùng biết đang nhập ô nào */
  }
`;

const HelperRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  font-size: 1rem;

  label {
    display: flex;
    align-items: center;
    color: #999;
    cursor: pointer;
    input { margin-right: 8px; accent-color: #E50914; }
  }

  .forgot-link {
    color: #E50914;
    text-decoration: none;
    &:hover { text-decoration: underline; }
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
  transition: background 0.3s;

  &:hover {
    background-color: #b20710;
  }
`;

const SignupText = styled.p`
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


const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        alert("Chào mừng trở lại CINEMAGIC!");
        navigate('/'); 
      }
    } catch (err) {
      alert(err.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <AuthLayout title="" subtitle="">
      <FormContainer onSubmit={handleSubmit}>
        <CenteredTitle>ĐĂNG NHẬP</CenteredTitle>
        
        <InputGroup>
          <div className="input-icon"><Mail size={20} /></div>
          <StyledInput 
            type="email" 
            name="email" 
            placeholder="Email của bạn" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </InputGroup>

        <InputGroup>
          <div className="input-icon"><Lock size={20} /></div>
          <StyledInput 
            type={showPass ? "text" : "password"} 
            name="password" 
            placeholder="Mật khẩu" 
            value={formData.password}
            onChange={handleChange}
            required 
          />
          <div className="eye-icon" onClick={() => setShowPass(!showPass)}>
            {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
          </div>
        </InputGroup>

        <HelperRow>
          <label>
            <input type="checkbox" /> Ghi nhớ tôi
          </label>
          <Link to="/forgot-password" core className="forgot-link">Quên mật khẩu?</Link>
        </HelperRow>

        <PrimaryButton type="submit">
          <LogIn size={20}/> ĐĂNG NHẬP
        </PrimaryButton>

        <SignupText>
          Mới biết đến CINEMAGIC? <Link to="/register">Đăng ký ngay</Link>
        </SignupText>
      </FormContainer>
    </AuthLayout>
  );
};

export default Login;