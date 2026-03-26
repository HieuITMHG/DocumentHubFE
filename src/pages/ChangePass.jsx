import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from "../utils/api";

function ChangePass() {
const [currentPassword, setCurrentPassword] = useState('');
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const user = useSelector((state) => state.user.userInfo);

const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    try {
      const response = await api.post('/api/users/change-password', {
        userId: user.id,               
        currentPassword,
        newPassword,
      });

      alert("Đổi mật khẩu thành công!");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      alert("Đổi mật khẩu thất bại! Vui lòng kiểm tra lại.");
    }
  };
  return (
  
  <form onSubmit={handleChangePassword}>
  <div className="mb-4">
    <label>Mật khẩu hiện tại</label>
    <input
      type="password"
      value={currentPassword}
      onChange={(e) => setCurrentPassword(e.target.value)}
      required
    />
  </div>

  <div className="mb-4">
    <label>Mật khẩu mới</label>
    <input
      type="password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      required
    />
  </div>

  <div className="mb-4">
    <label>Xác nhận mật khẩu mới</label>
    <input
      type="password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
    />
  </div>

  <button type="submit">Đổi mật khẩu</button>
</form>

    
  );
}

export default ChangePass;
