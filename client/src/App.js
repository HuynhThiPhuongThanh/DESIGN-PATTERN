import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Schedule from "./pages/Schedule";
import Movies from "./pages/Movies";
import History from "./pages/History";
import Payment from "./pages/Payment";
import BookingPage from "./pages/BookingPage"; 
import News from './pages/news';


// --- ADMIN PAGES ---
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardHome from "./pages/admin/DashboardHome";
import MovieManagement from "./pages/admin/MovieManagement";
import MovieForm from "./pages/admin/MovieForm";
import ScheduleManagement from "./pages/admin/ScheduleManagement";
import ScheduleForm from "./pages/admin/ScheduleForm"; 
import NewsManagement from "./pages/admin/NewsManagement";
import NewsForm from "./pages/admin/NewsForm"; 
import UserManagement from "./pages/admin/UserManagement";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  if (user && user.role && user.role.toLowerCase() === "admin") {
    return children;
  }

  console.log("Quyền hiện tại:", user.role);
  return <Navigate to="/home" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- CLIENT ROUTES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/movies" element={<Movies />} /> 
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/new" element={<News/>} />


        <Route path="/seat-selection/:id" element={
          <PrivateRoute>
            <BookingPage />
          </PrivateRoute>
        } />
        
        <Route path="/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />

        
        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="movies" element={<MovieManagement />} />
          <Route path="movies/add" element={<MovieForm />} />
          <Route path="movies/edit/:id" element={<MovieForm />} />
          <Route path="schedule" element={<ScheduleManagement />} />
          <Route path="schedule/add" element={<ScheduleForm />} /> 
          <Route path="schedule/edit/:id" element={<ScheduleForm />} />
          <Route path="news" element={<NewsManagement />} />
          <Route path="news/add" element={<NewsForm />} /> 
          <Route path="news/edit/:id" element={<NewsForm />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        <Route path="*" element={<div style={{color: "white", textAlign: "center", padding: "100px"}}>404 - Không tìm thấy trang</div>} />
      </Routes>
    </Router>
  );
}

export default App;