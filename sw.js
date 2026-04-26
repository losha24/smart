/* Smart Money Pro - Service Worker v9.1.0 */
const CACHE_NAME = 'smart-money-v9.1.0';

// רשימת הנכסים המדויקת כולל הגרסאות כפי שמופיעות ב-HTML
const ASSETS = [
  './',
  './index.html',
  './style.css?v=9.1.0',
  './js/events.js?v=9.1.0',
  './js/core.js?v=9.1.0',
  './js/activities.js?v=9.1.0',
  './js/economy.js?v=9.1.0',
  './js/ui.js?v=9.1.0',
  './js/blackmarket.js?v=9.1.0',
  './manifest.json?v=9.1.0',
  './logo.png',
  './icons/icon_192.png',
  './icons/icon_512.png'
];

// התקנה - שמירת הקבצים בזיכרון
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Caching all assets');
      return cache.addAll(ASSETS);
    })
  );
});

// הפעלה - ניקוי גרסאות ישנות (חשוב מאוד כשמעדכנים גרסת קוד)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// אסטרטגיית "Network First" - מנסה להביא מהשרת, ואם נכשל (אין אינטרנט) מביא מה-Cache
self.addEventListener('fetch', (e) => {
  // התעלמות מבקשות של Firebase או שרתים חיצוניים כדי לא לשבש נתונים חיים
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
