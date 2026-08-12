/* ==========================================================================
   Bang Yai Child Development Center MIS - PWA Service Worker
   Offline Cache Management & PWA Functionality (Network-First Strategy)
   ========================================================================== */

const CACHE_NAME = 'bangyai-child-mis-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css',
  './css/components.css',
  './css/responsive.css',
  './js/supabaseClient.js',
  './js/store.js',
  './js/auth.js',
  './js/utils/chart.js',
  './js/utils/export.js',
  './js/components/navbar.js',
  './js/components/parentLanding.js',
  './js/components/loginModal.js',
  './js/components/parentView.js',
  './js/components/teacherView.js',
  './js/components/executiveView.js',
  './js/components/modals.js',
  './js/app.js',
  './manifest.json',
  './assets/images/logo.png',
  './assets/images/banner.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network-First fetch strategy: Fetch fresh version from Netlify first, fallback to cache if offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith('http')) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
