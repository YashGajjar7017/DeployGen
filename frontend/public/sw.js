/**
 * Service Worker
 * Enables offline support, caching, and fast-loading
 */

const CACHE_NAME = 'deployGen-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
];

const CACHE_URLS = [
  '/apps',
  '/dashboard',
  '/login',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Failed to cache some assets:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement cache-first strategy for assets, network-first for APIs
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { url } = request;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API calls - network-first
  if (url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache for failed requests
          return caches.match(request).then((cached) => {
            if (cached) {
              console.log(`[SW] Serving cached API: ${url}`);
              return cached;
            }
            return new Response('Offline - No cached data available', {
              status: 503,
              statusText: 'Service Unavailable',
            });
          });
        })
    );
  }
  // Static assets - cache-first
  else {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          console.log(`[SW] Serving from cache: ${url}`);
          return response;
        }
        return fetch(request)
          .then((response) => {
            if (response.ok && (url.includes('.js') || url.includes('.css') || url.includes('fonts'))) {
              const cache = caches.open(CACHE_NAME);
              cache.then((c) => c.put(request, response.clone()));
            }
            return response;
          })
          .catch(() => {
            console.warn(`[SW] Offline - Cannot fetch: ${url}`);
            return new Response('Offline - Page not cached', {
              status: 503,
              statusText: 'Service Unavailable',
            });
          });
      })
    );
  }
});

// Message event - for cache control
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  if (type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('[SW] Cache cleared');
      event.ports[0].postMessage({ success: true });
    });
  }

  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
