import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT Bearer token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hostel_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to catch 401 Unauthorized errors (session expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: auto-logout on expired token
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('hostel_token');
        localStorage.removeItem('hostel_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

