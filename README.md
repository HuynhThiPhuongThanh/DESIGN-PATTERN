Hướng dẫn cài đặt và khởi chạy
1. Tải mã nguồn

git clone https://github.com/username/cinemagic.git
cd cinemagic
2. Cài đặt Backend
Mở terminal tại thư mục gốc của dự án:

cd backend
npm install
Cấu hình file .env trong thư mục backend:

PORT=5000
MONGO_URI=mongodb://localhost:27017/
JWT_SECRET=your_secret_key_here

Chạy server:

npm start

# Server sẽ chạy tại http://localhost:5000

3. Cài đặt Frontend
Mở một terminal mới:

cd frontend
npm install

Chạy ứng dụng:

npm start

# Ứng dụng sẽ chạy tại http://localhost:3000