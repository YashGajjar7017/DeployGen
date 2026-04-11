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
  
  // Email verification
  requestEmailVerification: () => apiClient.post('/auth/request-email-verification'),
  verifyEmail: (token) => apiClient.post('/auth/verify-email', { token }),
  
  // Settings
  getSettings: () => apiClient.get('/auth/settings'),
  updateSettings: (data) => apiClient.put('/auth/settings', data),
};

// ==================== APPS ENDPOINTS ====================

export const appsAPI = {
  getAll: () => apiClient.get('/apps'),
  getCategories: () => apiClient.get('/apps/categories'),
  getByCategory: (category) => apiClient.get(`/apps/category/${category}`),
  search: (query) => apiClient.get(`/apps/search?q=${query}`),
  getPremium: () => apiClient.get('/apps/premium'),
  getFeatured: () => apiClient.get('/apps/featured'),
  getApp: (slug) => apiClient.get(`/apps/${slug}`),
  getVersions: (slug) => apiClient.get(`/apps/${slug}/versions`),
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
  // Analytics
  getAnalytics: () => apiClient.get('/admin/analytics'),
  getTopApps: () => apiClient.get('/admin/analytics/top-apps'),
  getActiveUsers: () => apiClient.get('/admin/analytics/active-users'),
  
  // Maintenance
  getMaintenance: () => apiClient.get('/admin/maintenance'),
  updateMaintenance: (data) => apiClient.put('/admin/maintenance', data),
  
  // App Management
  getAllApps: () => apiClient.get('/admin/apps'),
  createApp: (data) => apiClient.post('/admin/apps', data),
  updateApp: (id, data) => apiClient.put(`/admin/apps/${id}`, data),
  deleteApp: (id) => apiClient.delete(`/admin/apps/${id}`),
};

export default apiClient;
