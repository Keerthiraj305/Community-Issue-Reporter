import axios from 'axios';

// API for issues
const issueApi = axios.create({
  baseURL: 'http://localhost:5000/api/issues',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API for auth
const authApi = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API for admin
const adminApi = axios.create({
  baseURL: 'http://localhost:5000/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

issueApi.interceptors.request.use(addAuthToken);
authApi.interceptors.request.use(addAuthToken);
adminApi.interceptors.request.use(addAuthToken);

export { issueApi, authApi, adminApi };
export default issueApi;