/* Smart Money Pro - sw.js - v6.0.3 - Final Production */

const CACHE_NAME = 'smart-money-v6.0.7';
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

// התקנה: טעינת כל הנכסים לזיכרון המקומי
self.addEventListener('install', e => {
  console.log(`[SW] Installing version: ${CACHE_NAME}...`);
  self.skipWaiting(); // כופה על ה-SW החדש להשתלט מיד ללא המתנה
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// אקטיבציה: מחיקת גרסאות ישנות מהמכשיר (כמו גרסאות 5.x.x)
self.addEventListener('activate', e => {
  console.log(`[SW] Activating and Purging old caches...`);
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log(`[SW] Deleting old cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim(); // לקיחת שליטה על כל החלונות הפתוחים של האפליקציה
});

// ניהול בקשות: Network First (רשת קודם, ואם אין - קאש)
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // שדרוג: אם הצלחנו להביא מהרשת, נשמור עותק מעודכן בקאש לפעם הבאה שנהיה באופליין
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => {
        // אם הרשת נכשלה (מצב אופליין), נחפש בקאש
        return caches.match(e.request);
      })
  );
});
