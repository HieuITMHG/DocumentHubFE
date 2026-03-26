import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp } = location.state || {};

  const handleReset = async () => {
    if (password !== confirm) {
      setError('Mật khẩu không khớp');
      return;
    }

    try {
      // FastAPI OpenAPI: POST /api/auth/reset_password
      await api.post('/api/auth/reset_password', {
        identity: email,
        otp_code: otp,
        new_password: password,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi đặt lại mật khẩu');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-semibold">Đặt lại mật khẩu</h2>
      <input
        type="password"
        placeholder="Mật khẩu mới"
        className="w-full mt-3 p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Xác nhận mật khẩu"
        className="w-full mt-3 p-2 border rounded"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <button
        onClick={handleReset}
        className="w-full bg-blue-600 text-white mt-4 py-2 rounded hover:bg-blue-700"
      >
        Đặt lại mật khẩu
      </button>
    </div>
  );
};

export default ResetPassword;
