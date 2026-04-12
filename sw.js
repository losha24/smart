/* Smart Money Pro - Service Worker v9.0.0 */
const CACHE_NAME = 'smart-money-v9';

// רשימת הנכסים לשמירה (הוספתי את הקבצים המדויקים שלך)
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './js/core.js',
  './js/ui.js',
  './js/activities.js',
  './js/economy.js',
  './manifest.json',
  './logo.png'
];

// התקנה - שמירת הקבצים בזיכרון
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// הפעלה - ניקוי גרסאות ישנות כדי שלא יהיו באגים
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// אסטרטגיית "Network First" - מנסה להביא מהאינטרנט, אם אין קליטה מביא מהזיכרון
// זה הכי טוב למשחק שלך כי יש עדכוני בורסה ב-Firebase
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
