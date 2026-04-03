import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Calendar, DollarSign, Film, Save, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const FormContainer = styled.div`
  background: #111; padding: 40px; border-radius: 12px; color: white;
  max-width: 850px; margin: 20px auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  font-family: "Times New Roman", Times, serif;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  label { display: flex; align-items: center; gap: 10px; color: #aaa; margin-bottom: 10px; font-size: 0.95rem; font-weight: bold; }
  select, input {
    width: 100%; padding: 14px; background: #0a0a0a; border: 1px solid #333;
    color: white; border-radius: 8px; outline: none; transition: 0.3s;
    font-size: 1rem;
    &:focus { border-color: #e50914; background: #111; }
  }
  option { background: #111; }
`;

const ScheduleForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  
  const [movies, setMovies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    movie: "",
    cinemaRoom: "Phòng Chiếu 01",
    startTime: "", 
    price: 75000,
    format: "2D",
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/movies');
        if (res.data.success) {
          setMovies(res.data.data.filter(m => m.status !== 'END_SHOW'));
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách phim:", err);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchDetail = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/showtimes/${id}`);
          if (res.data.success) {
            const d = res.data.data;
            const pureDate = d.date.includes('T') ? d.date.split('T')[0] : d.date;
            const pureTime = d.startTime.slice(0, 5);

            setScheduleData({
              movie: d.movie?._id || d.movie, 
              cinemaRoom: d.cinemaRoom,
              startTime: `${pureDate}T${pureTime}`, 
              price: d.price,
              format: d.format
            });
          }
        } catch (err) {
          console.error("Lỗi load chi tiết:", err);
          alert("Không thể tải thông tin suất chiếu!");
        }
      };
      fetchDetail();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleData.movie) return alert("Thanh ơi, chọn phim đã nhé!");
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const url = isEdit 
        ? `http://localhost:5000/api/showtimes/${id}` 
        : 'http://localhost:5000/api/showtimes';
      
      const method = isEdit ? 'put' : 'post';

      await axios[method](url, {
        ...scheduleData,
        price: Number(scheduleData.price)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(isEdit ? "Cập nhật thành công rồi Thanh nhé!" : "Tạo suất chiếu mới thành công!");
      navigate('/admin/schedule');
    } catch (err) {
      alert("Lỗi rồi: " + (err.response?.data?.message || "Thao tác thất bại"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
        <ArrowLeft 
          style={{ cursor: "pointer", color: "#E50914" }} 
          onClick={() => navigate("/admin/schedule")} 
        />
        <h2 style={{ margin: 0, textTransform: "uppercase", letterSpacing: "2px" }}>
          {isEdit ? "Cập nhật suất chiếu" : "Thiết lập suất chiếu mới"}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label><Film size={18} /> Chọn phim hiển thị</label>
          <select
            required
            value={scheduleData.movie}
            onChange={(e) => setScheduleData({ ...scheduleData, movie: e.target.value })}
          >
            <option value="">-- Chọn phim trong danh sách --</option>
            {movies.map((m) => (
              <option key={m._id} value={m._id}>{m.title}</option>
            ))}
          </select>
        </FormGroup>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
          <FormGroup>
            <label><Calendar size={18} /> Thời gian bắt đầu</label>
            <input
              type="datetime-local"
              required
              value={scheduleData.startTime}
              onChange={(e) => setScheduleData({ ...scheduleData, startTime: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <label><DollarSign size={18} /> Giá vé niêm yết (VNĐ)</label>
            <input
              type="number"
              required
              min="0"
              step="1000"
              value={scheduleData.price}
              onChange={(e) => setScheduleData({ ...scheduleData, price: e.target.value })}
            />
          </FormGroup>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
          <FormGroup>
            <label>Vị trí phòng chiếu</label>
            <select
              value={scheduleData.cinemaRoom}
              onChange={(e) => setScheduleData({ ...scheduleData, cinemaRoom: e.target.value })}
            >
              <option value="Phòng Chiếu 01">Phòng Chiếu 01</option>
              <option value="Phòng Chiếu 02">Phòng Chiếu 02</option>
              <option value="Phòng Chiếu 03">Phòng Chiếu 03</option>
              <option value="IMAX Premium Lounge">IMAX Premium Lounge</option>
            </select>
          </FormGroup>

          <FormGroup>
            <label>Định dạng trình chiếu</label>
            <select
              value={scheduleData.format}
              onChange={(e) => setScheduleData({ ...scheduleData, format: e.target.value })}
            >
              <option value="2D">Standard 2D</option>
              <option value="3D">Digital 3D</option>
              <option value="IMAX">IMAX Experience</option>
            </select>
          </FormGroup>
        </div>

        <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ 
                width: "100%", padding: "16px", 
                background: isSubmitting ? "#555" : "#E50914", 
                color: "white", border: "none", borderRadius: "8px", 
                cursor: isSubmitting ? "not-allowed" : "pointer", 
                fontWeight: "bold", marginTop: "10px", 
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                fontSize: "1rem", transition: "0.3s"
            }}
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isEdit ? "CẬP NHẬT THÔNG TIN" : "LƯU SUẤT CHIẾU"}
        </button>
      </form>
    </FormContainer>
  );
};

export default ScheduleForm;