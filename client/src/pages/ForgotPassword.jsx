import React, { useState } from 'react';
import styled from 'styled-components';
import AuthLayout from '../components/AuthLayout';
import { Mail, Lock, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FormContainer = styled.div`
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
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CenteredSubtitle = styled.p`
  text-align: center;
  color: #888;
  font-size: 1rem;
  margin-bottom: 35px;
  line-height: 1.4;
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

  &.otp-input {
    text-align: center;
    letter-spacing: 0.5em;
    font-size: 1.5rem;
    font-weight: bold;
    padding: 15px;
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 16px;
  background-color: ${props => props.bg || '#E50914'};
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
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const BackToLogin = styled.div`
  text-align: center;
  margin-top: 35px;

  a {
    color: #888;
    text-decoration: none;
    font-size: 0.95rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: color 0.2s;

    &:hover {
      color: #fff;
    }
  }
`;

const ForgotPassword = () => {
  const [step, setStep] = useState(1);

  return (
    <AuthLayout title="" subtitle="">
      <FormContainer>
        {step === 1 ? (
          <>
            <CenteredTitle>QUÊN MẬT KHẨU</CenteredTitle>
            <CenteredSubtitle>Nhập email để nhận mã OTP xác thực</CenteredSubtitle>
            
            <InputGroup>
              <div className="input-icon"><Mail size={20} /></div>
              <StyledInput type="email" placeholder="Email của bạn" required />
            </InputGroup>

            <PrimaryButton onClick={() => setStep(2)}>
              <KeyRound size={20} /> GỬI MÃ OTP
            </PrimaryButton>
          </>
        ) : (
          <>
            <CenteredTitle>ĐẶT LẠI MẬT KHẨU</CenteredTitle>
            <CenteredSubtitle>Nhập mã OTP (6 số) và mật khẩu mới</CenteredSubtitle>
            
            <InputGroup>
              <StyledInput 
                className="otp-input" 
                type="text" 
                placeholder="000000" 
                maxLength={6} 
                required 
              />
            </InputGroup>

            <InputGroup>
              <div className="input-icon"><Lock size={20} /></div>
              <StyledInput type="password" placeholder="Mật khẩu mới" required />
            </InputGroup>

            <PrimaryButton bg="#28a745">
              <CheckCircle size={20} /> XÁC NHẬN ĐỔI MẬT KHẨU
            </PrimaryButton>
          </>
        )}

        <BackToLogin>
          <Link to="/login">
            <ArrowLeft size={18} /> Quay lại đăng nhập
          </Link>
        </BackToLogin>
      </FormContainer>
    </AuthLayout>
  );
};

export default ForgotPassword;