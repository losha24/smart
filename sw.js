/* Smart Money Pro - Service Worker v9.1.0 */
const CACHE_NAME = 'smart-money-v9.1';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './logo.png',
  './js/events.js',
  './js/core.js',
  './js/activities.js',
  './js/economy.js',
  './js/ui.js',
  './js/blackmarket.js',
  './icons/icon_192.png',
  './icons/icon_512.png'
];

// התקנה
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// הפעלה וניקוי CACHE ישן
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// ניהול בקשות - Network First עם החרגת Firebase
self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('firebasedatabase.app') || 
      e.request.url.includes('firebase') || 
      e.request.url.includes('googleapis')) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          if (e.request.method === 'GET') {
            cache.put(e.request, resClone);
          }
        });
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
