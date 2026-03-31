/* Smart Money Pro - sw.js - v6.1.2 - Production Stable */

const CACHE_NAME = 'smart-money-v6.1.2';
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

// התקנה: טעינת נכסי הליבה לזיכרון המקומי
self.addEventListener('install', e => {
  console.log(`[SW] Installing v6.1.2...`);
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// אקטיבציה: ניקוי יסודי של כל מה שאינו v6.1.2
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

// ניהול בקשות: Stale-While-Revalidate 
// (מציג מהר מהקאש, ומעדכן ברקע מהרשת אם יש שינוי)
self.addEventListener('fetch', e => {
  // נתעלם מבקשות שהן לא GET (כמו פוסטים של Firebase אם יש)
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      const fetchPromise = fetch(e.request).then(networkResponse => {
        // אם התקבלה תשובה תקינה, נעדכן את הקאש
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, resClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // במקרה של ניתוק מוחלט, caches.match כבר יחזיר את מה שיש
      });

      // מחזיר את הגרסה מהקאש מיד (למהירות), או מחכה לרשת אם אין בקאש
      return cachedResponse || fetchPromise;
    })
  );
});
