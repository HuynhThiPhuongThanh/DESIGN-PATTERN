import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Navbar from "../components/Navbar";

const PaymentContainer = styled.div`
  background-color: #000;
  min-height: 100vh;
  padding-top: 120px;
  color: #fff;
  font-family: "Times New Roman", Times, serif;
`;

const PaymentCard = styled.div`
  max-width: 500px;
  margin: 0 auto;
  background: #080808;
  padding: 40px;
  border-radius: 10px;
  border: 1px solid #222;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  border-bottom: 1px dashed #333;
  padding-bottom: 10px;

  .label {
    color: #888;
  }
  .value {
    font-weight: bold;
    color: #fff;
  }
  .highlight {
    color: #e50914;
    font-size: 1.5rem;
  }
`;

const MomoButton = styled.button`
  width: 100%;
  background-color: #ae2070; /* Màu hồng đặc trưng của MoMo */
  color: white;
  border: none;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 30px;
  transition: 0.3s;

  &:hover {
    background-color: #d82d8b;
    transform: translateY(-2px);
  }
`;

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  if (!state || !state.showtime) {
    return (
      <PaymentContainer>
        <div style={{ textAlign: "center" }}>
          <h2>Không có thông tin thanh toán!</h2>
          <button
            onClick={() => navigate("/")}
            style={{
              color: "#e50914",
              cursor: "pointer",
              background: "none",
              border: "none",
              fontSize: "1.2rem",
            }}
          >
            {" "}
            Quay lại trang chủ{" "}
          </button>
        </div>
      </PaymentContainer>
    );
  }

  const { showtime, selectedSeats, totalPrice } = state;

 const handleProcessPayment = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      
      const paymentData = {
        amount: totalPrice,
        orderInfo: `Thanh toán vé phim ${showtime.movie.title}`,
        userId: userData ? (userData.id || userData._id) : null,
        showtimeId: showtime._id,
        seats: selectedSeats.map((s) => s._id), 
      };

      console.log("Dữ liệu gửi lên MoMo:", paymentData);
      const response = await axios.post(
        "http://localhost:5000/api/payments/momo",
        paymentData
      );

      if (response.data && response.data.payUrl) {
        window.location.href = response.data.payUrl;
      } else {
        alert("Có lỗi khi tạo link thanh toán MoMo!");
      }
    } catch (error) {
      console.error("Payment Error:", error.response?.data || error.message);
      alert("Lỗi kết nối đến máy chủ thanh toán!");
    }
  };

  return (
    <PaymentContainer>
      <Navbar />
      <PaymentCard>
        <h2
          style={{
            textAlign: "center",
            color: "#e50914",
            marginBottom: "30px",
            textTransform: "uppercase",
            fontStyle: "italic",
          }}
        >
          Chi tiết hóa đơn
        </h2>

        <InfoRow>
          <span className="label">Phim:</span>
          <span className="value">{showtime.movie.title}</span>
        </InfoRow>

        <InfoRow>
          <span className="label">Suất chiếu:</span>
          <span className="value">
            {showtime.startTime} |{" "}
            {new Date(showtime.date).toLocaleDateString("vi-VN")}
          </span>
        </InfoRow>

        <InfoRow>
          <span className="label">Phòng chiếu:</span>
          <span className="value">{showtime.room}</span>
        </InfoRow>

        <InfoRow>
          <span className="label">Ghế đã chọn:</span>
          <span className="value">
            {selectedSeats.map((s) => `${s.row}${s.number}`).join(", ")}
          </span>
        </InfoRow>

        <InfoRow style={{ borderBottom: "none", marginTop: "20px" }}>
          <span className="label" style={{ fontSize: "1.2rem" }}>
            TỔNG TIỀN:
          </span>
          <span className="value highlight">
            {(totalPrice || 0).toLocaleString()} VNĐ
          </span>
        </InfoRow>
        <MomoButton onClick={handleProcessPayment}>
          THANH TOÁN QUA MOMO
        </MomoButton>

        <p
          style={{
            fontSize: "0.8rem",
            color: "#555",
            textAlign: "center",
            marginTop: "15px",
          }}
        >
          Hệ thống sẽ chuyển bạn đến cổng thanh toán MoMo Sandbox.
        </p>
      </PaymentCard>
    </PaymentContainer>
  );
};

export default Payment;
