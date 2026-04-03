import React from 'react';
import styled from 'styled-components';
import { Clapperboard } from 'lucide-react';
import { Link } from 'react-router-dom';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Chuyển sang font Times New Roman */
  font-family: 'Times New Roman', Times, serif;
  color: #fff;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: #0a0a0a;
  border: 1px solid #222;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(229, 9, 20, 0.1);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    max-width: 550px;
  }
`;

const FormSection = styled.div`
  padding: 60px;
  display: flex;
  flex-direction: column;

  h2 {
    font-size: 2.2rem;
    font-weight: bold;
    margin-bottom: 8px;
  }

  p.subtitle {
    color: #888;
    margin-bottom: 35px;
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    padding: 40px 24px;
  }
`;

const BannerSection = styled.div`
  background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.9)), 
              url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 50px;

  h2 {
    font-size: 3.5rem;
    font-weight: bold;
    line-height: 1.1;
    text-transform: uppercase;
  }

  p {
    margin-top: 20px;
    color: #eee;
    font-size: 1.2rem;
    max-width: 350px;
    font-style: italic; /* Times New Roman để italic nhìn rất sang */
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const LogoWrapper = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  margin-bottom: 45px;
  width: fit-content;
  
  .icon-box {
    background-color: #E50914;
    padding: 10px;
    border-radius: 10px;
    display: flex;
  }
  
  span {
    color: #fff;
    font-size: 1.8rem;
    font-weight: bold;
    letter-spacing: 1px;
  }
`;

const AuthLayout = ({ children, title, subtitle }) => (
  <LayoutContainer>
    <AuthCard>
      <FormSection>
        <LogoWrapper to="/">
          <div className="icon-box">
            <Clapperboard size={24} color="white" strokeWidth={2.5}/>
          </div>
          <span>CINEMAGIC</span>
        </LogoWrapper>
        {title && <h2>{title}</h2>}
        {subtitle && <p className="subtitle">{subtitle}</p>}
        {children}
      </FormSection>
      
      <BannerSection>
        <h2>Đặt vé nhanh <br/> Xem phim hay</h2>
        <p>Sở hữu vị trí đẹp nhất và tận hưởng những giây phút giải trí tuyệt vời tại rạp.</p>
      </BannerSection>
    </AuthCard>
  </LayoutContainer>
);

export default AuthLayout;