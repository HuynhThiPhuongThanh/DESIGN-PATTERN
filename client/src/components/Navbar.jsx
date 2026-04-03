import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Search, User, LogOut, Ticket, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";


const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(229, 9, 20, 0.2);
  padding: 15px 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  font-family: "Times New Roman", Times, serif !important;

  @media (max-width: 768px) {
    padding: 15px 20px;
  }
`;

const LogoWrapper = styled(Link)`
  text-decoration: none;
  color: #e50914;
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: 0.3s;
  text-shadow: 0 0 10px rgba(229, 9, 20, 0.3);

  &:hover {
    transform: scale(1.02);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;

  a {
    text-decoration: none;
    color: #bbb;
    font-size: 0.95rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: 0.3s;
    position: relative;

    &.active {
      color: #e50914;
    }
    &:hover {
      color: #fff;
    }

    &::after {
      content: "";
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -5px;
      left: 0;
      background-color: #e50914;
      transition: 0.3s;
    }
    &:hover::after {
      width: 100%;
    }
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  .icon-btn {
    color: #888;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      color: #e50914;
    }
  }
`;

const AuthGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  border-left: 1px solid #333;
  padding-left: 15px;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  .nav-link-custom {
    display: flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    color: #eee;
    font-size: 0.85rem;
    font-weight: bold;
    text-transform: uppercase;
    transition: 0.3s;

    &:hover {
      color: #e50914;
    }
  }

  .logout-btn {
    cursor: pointer;
    color: #666;
    &:hover {
      color: #ff4d4d;
    }
  }
`;

const LoginBtn = styled(Link)`
  background-color: #e50914;
  color: #fff;
  text-decoration: none;
  padding: 8px 22px;
  border-radius: 4px; /* Chuyển sang bo nhẹ cho sang trọng hơn */
  font-weight: bold;
  font-size: 0.85rem;
  text-transform: uppercase;
  transition: 0.3s;

  &:hover {
    background-color: #b20710;
    box-shadow: 0 0 15px rgba(229, 9, 20, 0.4);
  }
`;



const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(true);
      setUserName(user.username);
      setUserRole(user.role); 
    } else {
      setIsLoggedIn(false);
      setUserRole("");
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <NavContainer>
      <LogoWrapper to="/">CINEMAGIC</LogoWrapper>

      <NavLinks>
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Trang chủ
        </Link>
        <Link
          to="/movies"
          className={location.pathname === "/movies" ? "active" : ""}
        >
          Phim
        </Link>
        <Link
          to="/schedule"
          className={location.pathname === "/schedule" ? "active" : ""}
        >
          Lịch chiếu
        </Link>
        <Link
          to="/news"
          className={location.pathname === "/news" ? "active" : ""}
        >
          Tin tức
        </Link>
      </NavLinks>

      <RightSection>
        <Search size={20} className="icon-btn" />

        <AuthGroup>
          {isLoggedIn ? (
            <UserMenu>
            
              {userRole === "ADMIN" ? (
                <Link
                  to="/admin/dashboard"
                  className="nav-link-custom"
                  style={{ color: "#ffffff" }}
                >
                  <Menu size={18} />
                  <span>Quản trị</span>
                </Link>
              ) : (
                <Link to="/history" className="nav-link-custom">
                  <Ticket size={18} />
                  <span>Vé của tôi</span>
                </Link>
              )}

              {/* Tên User và Logout giữ nguyên */}
              <div
                className="nav-link-custom"
                style={{ cursor: "default", color: "#E50914" }}
              >
                <User size={18} />
                <span>{userName}</span>
              </div>

              <LogOut
                size={18}
                className="logout-btn"
                onClick={handleLogout}
                title="Đăng xuất"
              />
            </UserMenu>
          ) : (
            <LoginBtn to="/login">Đăng nhập</LoginBtn>
          )}
        </AuthGroup>
      </RightSection>
    </NavContainer>
  );
};

export default Navbar;
