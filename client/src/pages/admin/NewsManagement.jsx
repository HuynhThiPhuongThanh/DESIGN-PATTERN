import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Plus, Edit, Trash2, Newspaper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewsCard = styled.div`
  display: flex;
  gap: 20px;
  background: #111;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  align-items: center;
  border: 1px solid #222;
  img {
    width: 120px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
  }
  .info {
    flex: 1;
    h4 {
      margin: 0 0 5px 0;
      color: #fff;
    }
    p {
      color: #666;
      font-size: 0.85rem;
    }
  }
`;

const NewsManagement = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/news");
      if (res.data.success) {
        setNews(res.data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy tin tức:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Thanh có chắc muốn xóa bài viết này không?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/news/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchNews(); 
      } catch (err) {
        alert("Lỗi khi xóa tin tức!");
      }
    }
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      PROMOTION: "Khuyến mãi",
      CINE_NEWS: "Tin điện ảnh",
      EVENT: "Sự kiện",
    };
    return labels[cat] || cat;
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ color: "white" }}>QUẢN LÝ TIN TỨC ({news.length})</h2>
        <button
          onClick={() => navigate("/admin/news/add")}
          style={{
            background: "#E50914",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: "bold",
          }}
        >
          <Plus size={18} /> VIẾT TIN MỚI
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#666" }}>Đang tải tin tức...</p>
      ) : news.length > 0 ? (
        news.map((item) => (
          <NewsCard key={item._id}>
            {/* Chú ý: Dùng imageURL theo đúng Model Backend của Thanh */}
            <img src={item.imageURL} alt={item.title} />
            <div className="info">
              <span
                style={{
                  color: "#E50914",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {getCategoryLabel(item.category)}
              </span>
              <h4>{item.title}</h4>
              <p>{item.summary?.substring(0, 100)}...</p>
              <p style={{ fontSize: "0.75rem", color: "#444" }}>
                Đăng ngày:{" "}
                {new Date(item.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div style={{ display: "flex", gap: "15px", color: "#888" }}>
              <Edit
                size={18}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/admin/news/edit/${item._id}`)}
              />
              <Trash2
                size={18}
                style={{ cursor: "pointer" }}
                onClick={() => handleDelete(item._id)}
              />
            </div>
          </NewsCard>
        ))
      ) : (
        <p style={{ color: "#666" }}>Chưa có tin tức nào được đăng.</p>
      )}
    </div>
  );
};

export default NewsManagement;
