import axios from 'axios';

const baseConfig = {
  baseURL: process.env.REACT_APP_API_URL || 'http://192.168.103.40:5000/api',
  withCredentials: false,
  timeout: 30000, // 30 second timeout (increased for network access)
  headers: {
    'Content-Type': 'application/json',
  },
};

// Log API configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:', {
    baseURL: baseConfig.baseURL,
    envVar: process.env.REACT_APP_API_URL,
    timeout: baseConfig.timeout,
    currentOrigin: window.location.origin
  });
}

// Public API instance (no auth token)
export const publicApi = axios.create(baseConfig);

// Protected API instance (with auth token)
const api = axios.create(baseConfig);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Optional: redirect to login on auth failures
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
