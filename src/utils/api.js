import axios from 'axios';

// Base URL theo môi trường (Docker/production)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.documenthub.io.vn';

// Tạo instance của axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Interceptor cho response
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Tách client refresh để tránh vòng lặp interceptor
        const refreshClient = axios.create({
          baseURL: API_BASE_URL,
          withCredentials: true,
        });

        const response = await refreshClient.post('/api/auth/refresh', null, {
          withCredentials: true,
        });

        const maybeToken =
          response?.data?.accessToken ||
          response?.data?.data?.accessToken ||
          response?.data?.data?.token;

        // Nếu backend trả access token qua body thì set Authorization, còn nếu backend dùng cookie thì chỉ cần retry request.
        if (maybeToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${maybeToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        console.error('Lỗi làm mới token:', refreshError);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;