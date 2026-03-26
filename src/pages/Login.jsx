import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import publicApi from '../utils/publicApi.js';
import api from '../utils/api.js';
import { setUserInfo } from '../store/slices/userSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {RoleType} from "../enums";
import { normalizeSelfInfo } from '../utils/normalize.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // FastAPI OpenAPI: POST /api/auth/login with { identity, password }
      await publicApi.post('/api/auth/login', { identity: email, password });

      // Lấy profile người dùng (aiami)
      const whoamiRes = await api.get('/api/auth/whoami');
      const self = whoamiRes?.data?.data ?? whoamiRes?.data;
      const user = normalizeSelfInfo(self);

      dispatch(setUserInfo(user));

      if (user?.role_id == RoleType.ADMIN) navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data.message || 'Lỗi đăng nhập');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    // OpenAPI hiện tại không định nghĩa Google OAuth login.
    setError('FastAPI hiện chưa hỗ trợ Google login trong openapi.json này.');
  };

  const handleGoogleFailure = () => {
    setError('Đăng nhập Google thất bại');
  };

  return (
    <div className="inset-0 h-screen w-screen bg-gray-100 flex justify-center items-center">
      <form className="w-[500px] bg-white p-6 rounded shadow-md" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-4">Đăng Nhập</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4">
          Đăng Nhập
        </button>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            text="signin_with"
          />
        </GoogleOAuthProvider>
          <div className='p-2 text-gray-600 flex justify-between'>
            <span>
              Bạn chưa có tài khoản? <Link to={'/register'} className='underline text-blue-500 hover:text-blue-700 font-semibold'>Đăng ký</Link>
            </span>
            <span>
              <Link to={'/forgot-password'} className='underline text-blue-500 hover:text-blue-700 font-semibold'>Quên mật khẩu</Link>
            </span>
          </div>
      </form>
    </div>
  );
}

export default Login;