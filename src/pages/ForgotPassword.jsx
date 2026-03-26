import React, { useState, useEffect } from 'react';
import api from "../utils/api"
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState('email'); // email | code
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let countdown;
    if (step === 'code' && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(countdown);
  }, [timer, step]);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      // FastAPI OpenAPI: POST /api/auth/forgot_password { identity }
      await api.post('/api/auth/forgot_password', { identity: email });
      setStep('code');
      setTimer(60);
      setCanResend(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi email');
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    try {
      await api.post('/api/auth/forgot_password', { identity: email });
      setTimer(60);
      setCanResend(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể gửi lại mã');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    // OpenAPI hiện không tách verify OTP riêng. Ta chuyển thẳng sang reset-password
    setError('');
    navigate('/reset-password', { state: { email, otp: code } });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md bg-white">
      {step === 'email' ? (
        <form onSubmit={handleSendEmail} className="space-y-4">
          <h2 className="text-xl font-semibold">Quên mật khẩu</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Gửi mã xác thực
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <h2 className="text-xl font-semibold">Nhập mã xác thực</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <p className="text-sm text-gray-500">
            Mã xác thực đã được gửi đến <strong>{email}</strong>
          </p>
          <div>
            <label className="block text-sm font-medium">Mã xác thực</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Xác minh mã
          </button>

          <div className="text-center text-sm mt-2">
            {canResend ? (
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={handleResendCode}
              >
                Gửi lại mã
              </button>
            ) : (
              <span>Gửi lại mã sau: {timer}s</span>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
