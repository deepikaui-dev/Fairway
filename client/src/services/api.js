import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically add the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fairway_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global errors (like token expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only auto-redirect on 401 if we are not already on the login page
    // and the request wasn't specifically an auth request (login/register)
    const isAuthRequest = error.config?.url?.includes('/api/auth/login') || error.config?.url?.includes('/api/auth/register');
    if (error.response && error.response.status === 401 && !isAuthRequest && window.location.pathname !== '/login') {
      localStorage.removeItem('fairway_token');
      localStorage.removeItem('fairway_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
