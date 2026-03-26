import axios from 'axios';

// Base URL theo môi trường (Docker/production)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.documenthub.io.vn';

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default publicApi;