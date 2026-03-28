const cacheName = 'smart-money-v5.1.1';
const assets = [
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

// התקנה ושמירת קבצים בזיכרון
self.addEventListener('install', e => {
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});

// ניקוי גרסאות ישנות מהזיכרון בעת עדכון
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => {
    return Promise.all(keys.filter(k => k !== cacheName).map(k => caches.delete(k)));
  }));
});

// שליפת קבצים מהזיכרון גם ללא אינטרנט
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
