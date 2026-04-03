import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ShieldAlert, Trash2, UserCheck } from 'lucide-react';
import axios from 'axios';

const UserTable = styled.table`
  width: 100%; border-collapse: collapse; background: #111; border-radius: 8px;
  th, td { padding: 15px; text-align: left; border-bottom: 1px solid #222; color: white; }
  th { background: #1a1a1a; color: #888; font-size: 0.8rem; text-transform: uppercase; }
  .role-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }
  .admin { background: rgba(229, 9, 20, 0.2); color: #E50914; }
  .customer { background: rgba(78, 168, 222, 0.2); color: #4ea8de; }
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách người dùng:", err);
      alert("Bạn không có quyền truy cập danh sách này!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Thanh có chắc muốn xóa người dùng này không?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers(); 
      } catch (err) {
        alert("Lỗi khi xóa người dùng");
      }
    }
  };

  return (
    <div>
      <h2 style={{color: 'white', marginBottom: '30px'}}>DANH SÁCH THÀNH VIÊN ({users.length})</h2>
      
      <UserTable>
        <thead>
          <tr>
            <th>Tên người dùng</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="4" style={{textAlign: 'center'}}>Đang tải dữ liệu...</td></tr>
          ) : users.length > 0 ? (
            users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role === 'ADMIN' ? 'admin' : 'customer'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '15px', color: '#666' }}>
                    <ShieldAlert 
                      size={18} 
                      title="Đổi quyền hạn" 
                      style={{cursor: 'pointer'}} 
                      className="hover-white"
                    />
                    <Trash2 
                      size={18} 
                      title="Xóa tài khoản" 
                      onClick={() => handleDeleteUser(user._id)}
                      style={{cursor: 'pointer'}} 
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4" style={{textAlign: 'center'}}>Không có người dùng nào.</td></tr>
          )}
        </tbody>
      </UserTable>
    </div>
  );
};

export default UserManagement;