import axios from 'axios';

const API_URL = 'http://localhost:8000/api' || process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== AUTH ENDPOINTS ====================

export const authAPI = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  changePassword: (data) => apiClient.post('/auth/change-password', data),
};

// ==================== APPS ENDPOINTS ====================

export const appsAPI = {
  getAll: () => apiClient.get('/apps'),
  getCategories: () => apiClient.get('/apps/categories'),
  getByCategory: (category) => apiClient.get(`/apps/category/${category}`),
  search: (query) => apiClient.get(`/apps/search?q=${query}`),
  getPremium: () => apiClient.get('/apps/premium'),
};

// ==================== CONFIG ENDPOINTS ====================

export const configAPI = {
  generate: (data) => apiClient.post('/config/generate', data),
  getConfig: (token) => apiClient.get(`/config/${token}`),
  getUserHistory: () => apiClient.get('/config/user/history'),
  deleteConfig: (id) => apiClient.delete(`/config/${id}`),
};

// ==================== ADMIN ENDPOINTS ====================

export const adminAPI = {
  getAnalytics: () => apiClient.get('/admin/analytics'),
  getTopApps: () => apiClient.get('/admin/analytics/top-apps'),
  getActiveUsers: () => apiClient.get('/admin/analytics/active-users'),
};

export default apiClient;
