import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';
import { useDispatch } from 'react-redux';
import { setUserInfo, clearUserInfo } from '../store/slices/userSlice';
import { normalizeSelfInfo } from '../utils/normalize.js';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/api/auth/whoami');
        const self = res?.data?.data ?? res?.data;
        dispatch(setUserInfo(normalizeSelfInfo(self)));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Check auth error:', error.response?.data, error.message);
        dispatch(clearUserInfo());
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;