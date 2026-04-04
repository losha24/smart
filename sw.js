/* Smart Money Pro - sw.js - v6.1.2/6.5.0 - Production Stable */

const CACHE_NAME = 'smart-money-v7.5.9';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './logo.png',
  './manifest.json',
  './js/core.js',
  './js/ui.js',
  './js/economy.js',
  './js/activities.js'
];

// התקנה: שמירת נכסי הליבה
self.addEventListener('install', e => {
  console.log(`[SW] Installing v6.1.2...`);
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// אקטיבציה: מחיקת כל גרסה ישנה (v6.0.x ומטה)
self.addEventListener('activate', e => {
  console.log(`[SW] Purging old caches...`);
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim(); 
});

// ניהול בקשות רשת
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      const fetchPromise = fetch(e.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, resClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // אופליין - יחזיר מהקאש באופן אוטומטי דרך cachedResponse
      });

      return cachedResponse || fetchPromise;
    })
  );
});
