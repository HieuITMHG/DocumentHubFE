import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import publicApi from '../utils/publicApi.js';
import api from '../utils/api.js';
import { setUserInfo } from '../store/slices/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { normalizeSelfInfo } from '../utils/normalize.js';

const getApiErrorMessage = (err, fallback) => {
  const data = err?.response?.data;
  if (!data) return fallback;
  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail
      .map((d) => {
        if (typeof d === 'string') return d;
        const field = Array.isArray(d?.loc) ? d.loc.join('.') : '';
        const msg = d?.msg || '';
        return field ? `${field}: ${msg}` : msg;
      })
      .join('; ');
  }
  if (typeof data?.detail === 'string') return data.detail;
  return fallback;
};

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const [step, setStep] = useState('form'); // form | otp
  const [otpCode, setOtpCode] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8 || password.length > 16) {
      setError('Mật khẩu phải từ 8-16 ký tự theo yêu cầu API.');
      return;
    }
    try {
      // FastAPI OpenAPI: POST /api/auth/register/request { email }
      // OTP request/verify thường không cần cookie session.
      // Để tránh CORS lỗi khi backend trả `Access-Control-Allow-Origin: *` nhưng FE gửi credentials,
      // ta tắt credentials cho các request công khai này.
      await publicApi.post(
        '/api/auth/register/request',
        { email },
        { withCredentials: false }
      );
      setStep('otp');
      setOtpCode('');
    } catch (err) {
      console.error('[Register] request otp failed', {
        status: err?.response?.status,
        data: err?.response?.data,
      });
      setError(getApiErrorMessage(err, 'Lỗi đăng ký'));
    }
  };

  const handleVerifyAndComplete = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // FastAPI OpenAPI:
      // POST /api/auth/register/verify { email, otp_code }
      const verifyRes = await publicApi.post(
        '/api/auth/register/verify',
        { email, otp_code: otpCode },
        { withCredentials: false }
      );
      const registrationCode =
        verifyRes?.data?.data?.registration_token || verifyRes?.data?.data?.registration_code;

      if (!registrationCode) {
        console.error('[Register] verify ok but missing registration token', {
          response: verifyRes?.data,
        });
        setError('Xác thực OTP thành công nhưng API không trả registration token.');
        return;
      }

      // POST /api/auth/register/complete
      await publicApi.post('/api/auth/register/complete', {
        email,
        registration_code: registrationCode,
        username,
        password,
      });

      // Hoàn tất có thể tự login => gọi whoami để lấy profile
      const whoamiRes = await api.get('/api/auth/whoami');
      const self = whoamiRes?.data?.data ?? whoamiRes?.data;
      dispatch(setUserInfo(normalizeSelfInfo(self)));
      navigate('/profile');
    } catch (err) {
      console.error('[Register] verify/complete failed', {
        status: err?.response?.status,
        data: err?.response?.data,
      });
      setError(getApiErrorMessage(err, 'Lỗi xác thực đăng ký'));
    }
  };

  const handleGoogleSuccess = () => {
    setError('FastAPI openapi.json hiện chưa hỗ trợ Google login.');
  };

  const handleGoogleFailure = () => {
    setError('Google OAuth thất bại');
  };

  return (
    <div className="inset-0 h-screen w-screen bg-gray-100 flex justify-center items-center">
      {step === 'form' ? (
        <form className="w-[500px] bg-white p-6 rounded shadow-md" onSubmit={handleRegister}>
          <h2 className="text-2xl font-bold mb-4">Đăng Ký</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block text-gray-700">username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

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
            Đăng Ký
          </button>

          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              text="signup_with"
            />
          </GoogleOAuthProvider>

          <div className="p-2 text-gray-600">
            Bạn đã có tài khoản?{' '}
            <Link to={'/login'} className="underline text-blue-500 hover:text-blue-700 font-semibold">
              Đăng nhập
            </Link>
          </div>
        </form>
      ) : (
        <form className="w-[500px] bg-white p-6 rounded shadow-md" onSubmit={handleVerifyAndComplete}>
          <h2 className="text-2xl font-bold mb-4">Xác thực đăng ký</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <p className="text-gray-600 mb-4">
            Mã xác thực đã được gửi đến <strong>{email}</strong>
          </p>

          <div className="mb-4">
            <label className="block text-gray-700">OTP code</label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4">
            Hoàn tất
          </button>

          <div className="p-2 text-gray-600">
            <button
              type="button"
              className="underline text-blue-500 hover:text-blue-700 font-semibold"
              onClick={() => setStep('form')}
            >
              Quay lại
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Register;