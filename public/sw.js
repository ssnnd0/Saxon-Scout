// Service Worker for Team 611 Saxons Scouting PWA
const CACHE_NAME = 'saxon-scouting-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event Strategy: Network First with Fallback to Cache
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // API requests - Network only
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch((error) => {
        console.log('Fetch failed for API; returning offline response', error);
        return new Response(
          JSON.stringify({ 
            error: 'You are offline. Please reconnect to use this feature.'
          }),
          { 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      })
    );
    return;
  }

  // HTML pages - Network, then cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache a copy of the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return caches.match('/index.html');
          });
        })
    );
    return;
  }

  // For all other requests - Try network first, fall back to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache a copy of the response
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Handle data synchronization when coming back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-scouting-data') {
    event.waitUntil(syncScoutingData());
  }
});

// Function to sync scouting data from IndexedDB to server
async function syncScoutingData() {
  // This is a placeholder for actual IndexedDB sync functionality
  // In a real implementation, we would:
  // 1. Open IndexedDB
  // 2. Get all unsynchronized scouting entries
  // 3. Send them to the server via fetch
  // 4. Mark them as synchronized in IndexedDB if successful
  console.log('Syncing scouting data from service worker');
}