/* Smart Money Pro - sw.js - v6.0.0 - Final Production */

const cacheName = 'smart-money-v6.0.2';
const assets = [
  './',
  'index.html',
  'style.css',
  'logo.png',
  'manifest.json',
  'js/core.js',
  'js/ui.js',
  'js/economy.js',
  'js/activities.js'
];

// התקנה: טעינת כל הנכסים לזיכרון המקומי
self.addEventListener('install', e => {
  console.log('SW v6.0.0: Installing and Caching...');
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// אקטיבציה: מחיקת גרסאות ישנות (כמו 5.7.7) מהמכשיר
self.addEventListener('activate', e => {
  console.log('SW v6.0.0: Activating and Purging old caches...');
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== cacheName).map(k => caches.delete(k))
      );
    })
  );
  return self.clients.claim();
});

// ניהול בקשות: ניסיון להביא מהרשת, ואם אין קליטה - מהקאש
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // אם הצלחנו להביא מהרשת, נחזיר את התוצאה
        return res;
      })
      .catch(() => {
        // אם הרשת נכשלה (מצב אופליין), נחפש בקאש
        return caches.match(e.request);
      })
  );
});
