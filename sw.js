const cacheName = 'smart-money-v5.7.7';
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

self.addEventListener('install', e => {
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
  self.skipWaiting(); // גורם לגרסה החדשה להיכנס לתוקף מיד
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => {
    return Promise.all(keys.filter(k => k !== cacheName).map(k => caches.delete(k)));
  }));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
