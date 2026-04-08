import axios from 'axios';
import { cache, persistentCache } from './cache';
import { 
  debounce, 
  RequestDeduplicator, 
  retryWithBackoff 
} from './requestOptimization';

const API_URL = 'http://localhost:8000/api' || process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Request deduplication
const requestDedup = new RequestDeduplicator();

// Cache configuration
const CACHE_CONFIG = {
  apps: 10 * 60 * 1000,        // 10 minutes
  profile: 5 * 60 * 1000,       // 5 minutes
  settings: 5 * 60 * 1000,      // 5 minutes
  health: 1 * 60 * 1000,        // 1 minute
  search: 3 * 60 * 1000,        // 3 minutes
  default: 5 * 60 * 1000,       // 5 minutes
};

// ==================== CACHED REQUEST FUNCTION ====================

const cachedRequest = async (
  key,
  requestFn,
  cacheDuration = CACHE_CONFIG.default,
  usePersistent = false
) => {
  // Check memory cache first
  const cached = cache.get(key);
  if (cached) {
    console.log(`[Cache HIT] ${key}`);
    return cached;
  }

  // Check persistent cache
  if (usePersistent) {
    const persisted = persistentCache.get(key);
    if (persisted) {
      console.log(`[Persistent Cache HIT] ${key}`);
      cache.set(key, persisted, cacheDuration);
      return persisted;
    }
  }

  console.log(`[Cache MISS] ${key}`);

  try {
    // Use request deduplication to prevent duplicate requests
    const result = await requestDedup.execute(key, () =>
      retryWithBackoff(requestFn, 3, 500, 5000)
    );

    // Store in both caches
    cache.set(key, result, cacheDuration);
    if (usePersistent) {
      persistentCache.set(key, result);
    }

    return result;
  } catch (error) {
    console.error(`[Cache ERROR] ${key}:`, error.message);

    // Return stale cache if request fails
    if (usePersistent) {
      const stale = persistentCache.get(key);
      if (stale) {
        console.log(`[Fallback to Stale Cache] ${key}`);
        return stale;
      }
    }

    throw error;
  }
};

// Debounced search
const searchDebounced = debounce(async (query, searchFn) => {
  if (!query || query.length < 2) return [];
  return cachedRequest(
    `search_${query}`,
    () => searchFn(query),
    CACHE_CONFIG.search
  );
}, 300);

// ==================== AUTH ENDPOINTS ====================

export const authAPI = {
  signup: (data) => apiClient.post('/auth/signup', data),
  
  login: (data) => apiClient.post('/auth/login', data),
  
  getProfile: () =>
    cachedRequest(
      'auth_profile',
      () => apiClient.get('/auth/profile'),
      CACHE_CONFIG.profile,
      true
    ),
  
  updateProfile: (data) => {
    cache.clear('auth_profile');
    persistentCache.clear('auth_profile');
    return apiClient.put('/auth/profile', data);
  },
  
  changePassword: (data) => {
    cache.clear('auth_profile');
    persistentCache.clear('auth_profile');
    return apiClient.post('/auth/change-password', data);
  },
  
  // Email verification
  requestEmailVerification: () => apiClient.post('/auth/request-email-verification'),
  verifyEmail: (token) => {
    cache.clear('auth_profile');
    persistentCache.clear('auth_profile');
    return apiClient.post('/auth/verify-email', { token });
  },
  
  // Settings with caching
  getSettings: () =>
    cachedRequest(
      'auth_settings',
      () => apiClient.get('/auth/settings'),
      CACHE_CONFIG.settings,
      true
    ),
  
  updateSettings: (data) => {
    cache.clear('auth_settings');
    persistentCache.clear('auth_settings');
    return apiClient.put('/auth/settings', data);
  },
};

// ==================== APPS ENDPOINTS ====================

export const appsAPI = {
  getAll: () =>
    cachedRequest(
      'apps_all',
      () => apiClient.get('/apps'),
      CACHE_CONFIG.apps,
      true
    ),
  
  getCategories: () =>
    cachedRequest(
      'apps_categories',
      () => apiClient.get('/apps/categories'),
      CACHE_CONFIG.apps,
      true
    ),
  
  getByCategory: (category) =>
    cachedRequest(
      `apps_category_${category}`,
      () => apiClient.get(`/apps/category/${category}`),
      CACHE_CONFIG.apps,
      true
    ),
  
  search: (query) =>
    cachedRequest(
      `apps_search_${query}`,
      () => apiClient.get(`/apps/search?q=${query}`),
      CACHE_CONFIG.search
    ),
  
  getPremium: () =>
    cachedRequest(
      'apps_premium',
      () => apiClient.get('/apps/premium'),
      CACHE_CONFIG.apps,
      true
    ),
  
  getFeatured: () =>
    cachedRequest(
      'apps_featured',
      () => apiClient.get('/apps/featured'),
      CACHE_CONFIG.apps,
      true
    ),
  
  getApp: (slug) =>
    cachedRequest(
      `app_${slug}`,
      () => apiClient.get(`/apps/${slug}`),
      CACHE_CONFIG.apps,
      true
    ),
  
  getVersions: (slug) =>
    cachedRequest(
      `app_versions_${slug}`,
      () => apiClient.get(`/apps/${slug}/versions`),
      CACHE_CONFIG.apps,
      true
    ),
};

// ==================== CONFIG ENDPOINTS ====================

export const configAPI = {
  generate: (data) => apiClient.post('/config/generate', data),
  
  getByToken: (token) =>
    cachedRequest(
      `config_${token}`,
      () => apiClient.get(`/config/${token}`),
      CACHE_CONFIG.default,
      false
    ),
};

// ==================== HEALTH CHECK ====================

export const healthAPI = {
  check: () =>
    cachedRequest(
      'health_status',
      () => apiClient.get('/health'),
      CACHE_CONFIG.health
    ),
  
  detailed: () =>
    cachedRequest(
      'health_detailed',
      () => apiClient.get('/health/detailed'),
      CACHE_CONFIG.health
    ),
  
  database: () =>
    cachedRequest(
      'health_database',
      () => apiClient.get('/health/db'),
      CACHE_CONFIG.health
    ),
};

// ==================== PREMIUM ENDPOINTS ====================

export const premiumAPI = {
  getStatus: () =>
    cachedRequest(
      'premium_status',
      () => apiClient.get('/premium/status'),
      CACHE_CONFIG.profile
    ),
  
  subscribe: (data) => {
    cache.clear('premium_status');
    persistentCache.clear('premium_status');
    return apiClient.post('/premium/subscribe', data);
  },
  
  cancel: () => {
    cache.clear('premium_status');
    persistentCache.clear('premium_status');
    return apiClient.post('/premium/cancel');
  },
};

// ==================== CACHE MANAGEMENT ====================

export const cacheAPI = {
  clearAll: () => {
    cache.clearAll();
    persistentCache.clearAll();
  },
  
  getStats: () => ({
    memorySize: cache.size(),
    timestamp: new Date().toISOString(),
  }),
};

export default apiClient;
