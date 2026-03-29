/* Smart Money Pro - sw.js - v5.7.7 */

const cacheName = 'smart-money-v5.7.7';
const assets = [
  'index.html',
  'style.css',
  'logo.png',
  'manifest.json',
  'js/core.js',
  'js/ui.js',
  'js/economy.js',
  'js/activities.js'
];

// התקנה ושמירת קבצים בקאש
self.addEventListener('install', e => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('SW: Caching Assets');
      return cache.addAll(assets);
    })
  );
});

// ניקוי גרסאות ישנות מהזיכרון
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== cacheName).map(k => caches.delete(k))
      );
    })
  );
  return self.clients.claim();
});

// ניהול בקשות - אסטרטגיית "רשת קודם" לשיפור עדכונים
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
