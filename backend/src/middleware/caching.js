/**
 * Response Caching Middleware
 * Implements smart HTTP caching and compression for faster responses
 */

import NodeCache from 'node-cache';

// Initialize cache with 5 minute TTL
const responseCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Cache configuration by route pattern
const CACHE_CONFIG = {
  '/api/apps': { ttl: 600, condition: 'GET' },
  '/api/apps/': { ttl: 600, condition: 'GET' },
  '/api/health': { ttl: 60, condition: 'GET' },
  '/api/config': { ttl: 120, condition: 'GET' },
  '/api/premium': { ttl: 300, condition: 'GET' },
};

/**
 * Generate cache key from request
 */
const generateCacheKey = (req) => {
  const { method, path, query } = req;
  const queryString = Object.keys(query).length > 0 
    ? `?${new URLSearchParams(query).toString()}`
    : '';
  return `${method}:${path}${queryString}`;
};

/**
 * Check if response should be cached
 */
const shouldCache = (req, statusCode) => {
  if (req.method !== 'GET') return false;
  if (statusCode !== 200) return false;

  // Check cache config
  for (const pattern in CACHE_CONFIG) {
    if (req.path.includes(pattern)) {
      return CACHE_CONFIG[pattern].condition === req.method;
    }
  }

  return false;
};

/**
 * Get cache duration for route
 */
const getCacheDuration = (path) => {
  for (const pattern in CACHE_CONFIG) {
    if (path.includes(pattern)) {
      return CACHE_CONFIG[pattern].ttl;
    }
  }
  return 300; // Default 5 minutes
};

/**
 * Express middleware for response caching
 */
const cacheMiddleware = (req, res, next) => {
  const method = req.method;
  const path = req.path;

  // Only cache GET requests
  if (method !== 'GET') {
    return next();
  }

  const cacheKey = generateCacheKey(req);

  // Check cache
  const cachedResponse = responseCache.get(cacheKey);
  if (cachedResponse) {
    console.log(`[Cache HIT] ${cacheKey}`);
    res.set('X-Cache', 'HIT');
    return res.json(cachedResponse);
  }

  console.log(`[Cache MISS] ${cacheKey}`);

  // Intercept response
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    // Cache successful responses
    if (res.statusCode === 200 && shouldCache(req, res.statusCode)) {
      const ttl = getCacheDuration(path);
      responseCache.set(cacheKey, body, ttl);
      console.log(`[Cache SET] ${cacheKey} (TTL: ${ttl}s)`);
      res.set('X-Cache', 'MISS');
    }
    return originalJson(body);
  };

  next();
};

/**
 * Clear cache for specific pattern
 */
const clearCachePattern = (pattern) => {
  const keys = responseCache.keys();
  let cleared = 0;

  keys.forEach((key) => {
    if (key.includes(pattern)) {
      responseCache.del(key);
      cleared++;
    }
  });

  console.log(`[Cache] Cleared ${cleared} keys matching pattern: ${pattern}`);
  return cleared;
};

/**
 * Clear all cache
 */
const clearAllCache = () => {
  responseCache.flushAll();
  console.log('[Cache] All cache cleared');
};

/**
 * Get cache statistics
 */
const getCacheStats = () => {
  const keys = responseCache.keys();
  const stats = {
    totalKeys: keys.length,
    keys: keys.slice(0, 20), // Show first 20
    memory: JSON.stringify(responseCache.getStats()),
  };
  return stats;
};

export {
  cacheMiddleware,
  clearCachePattern,
  clearAllCache,
  getCacheStats,
  responseCache,
};
