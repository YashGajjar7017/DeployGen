/**
 * Smart Caching System
 * Provides memory and localStorage caching with automatic invalidation
 */

class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.timestamps = new Map();
  }

  // Set cache with TTL in milliseconds
  set(key, value, ttlMs = 5 * 60 * 1000) {
    this.memoryCache.set(key, value);
    this.timestamps.set(key, Date.now() + ttlMs);
  }

  // Get from cache if valid
  get(key) {
    if (!this.memoryCache.has(key)) return null;
    
    const expiry = this.timestamps.get(key);
    if (Date.now() > expiry) {
      this.memoryCache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    
    return this.memoryCache.get(key);
  }

  // Batch cache multiple items
  setMany(items, ttlMs = 5 * 60 * 1000) {
    items.forEach(({ key, value }) => this.set(key, value, ttlMs));
  }

  // Clear specific cache
  clear(key) {
    this.memoryCache.delete(key);
    this.timestamps.delete(key);
  }

  // Clear all cache
  clearAll() {
    this.memoryCache.clear();
    this.timestamps.clear();
  }

  // Get cache size
  size() {
    return this.memoryCache.size;
  }
}

export const cache = new CacheManager();

// localStorage wrapper for persistent cache
export const persistentCache = {
  set(key, value) {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(value));
    } catch (e) {
      console.warn('Persistent cache write failed:', e);
    }
  },

  get(key) {
    try {
      const data = localStorage.getItem(`cache_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Persistent cache read failed:', e);
      return null;
    }
  },

  clear(key) {
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (e) {
      console.warn('Persistent cache clear failed:', e);
    }
  },

  clearAll() {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith('cache_'))
        .forEach(key => localStorage.removeItem(key));
    } catch (e) {
      console.warn('Persistent cache clearAll failed:', e);
    }
  }
};
