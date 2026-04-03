import React from 'react';
import styled from 'styled-components';
import { Film, Calendar, Newspaper, Users, LayoutDashboard, Home, LogOut } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #0a0a0a;
  color: #fff;
  font-family: 'Times New Roman', Times, serif;
`;

const Sidebar = styled.div`
  width: 260px;
  background-color: #111;
  border-right: 1px solid #222;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SidebarFooter = styled.div`
  margin-top: auto; 
  padding-top: 20px;
  border-top: 1px solid #222;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AdminLogo = styled.div`
  color: #E50914;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  text-decoration: none;
  color: #888;
  border-radius: 8px;
  transition: 0.3s;

  &:hover, &.active {
    background-color: #E50914;
    color: #fff;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 40px;
  background-color: #050505;
`;

const AdminLayout = () => {
  return (
    <AdminContainer>
      <Sidebar>
  <AdminLogo>CINEMAGIC ADMIN</AdminLogo>
  <NavItem to="/admin/dashboard"><LayoutDashboard size={20}/> Dashboard</NavItem>
  <NavItem to="/admin/movies"><Film size={20}/> Quản lý Phim</NavItem>
  <NavItem to="/admin/schedule"><Calendar size={20}/> Lịch chiếu</NavItem>
  <NavItem to="/admin/news"><Newspaper size={20}/> Tin tức</NavItem>
  <NavItem to="/admin/users"><Users size={20}/> Người dùng</NavItem>
  <SidebarFooter>
    <NavItem to="/" style={{ color: '#4caf50' }}>
      <Home size={20}/> Xem trang chủ
    </NavItem>
    <NavItem to="/login" onClick={() => localStorage.removeItem('token')} style={{ color: '#ff4d4d' }}>
      <LogOut size={20}/> Đăng xuất
    </NavItem>
  </SidebarFooter>
</Sidebar>
      
      <MainContent>
        <Outlet />
      </MainContent>
    </AdminContainer>
  );
};

export default AdminLayout;