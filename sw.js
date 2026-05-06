const CACHE_NAME = 'smart-money-pro-v9.1';
const BASE = '/smart/';

// קבצים קריטיים (App Shell)
const CORE_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'style.css',
  BASE + 'manifest.json',
  BASE + 'logo.png',
  BASE + 'icons/icon_192.png',
  BASE + 'icons/icon_512.png'
];

// JS מודולים
const JS_ASSETS = [
  BASE + 'js/events.js',
  BASE + 'js/core.js',
  BASE + 'js/activities.js',
  BASE + 'js/economy.js',
  BASE + 'js/ui.js',
  BASE + 'js/blackmarket.js'
];

// כל האסטרים יחד
const ALL_ASSETS = [...CORE_ASSETS, ...JS_ASSETS];

// ======================
// INSTALL (precache)
// ======================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => cache.addAll(ALL_ASSETS))
    .then(() => self.skipWaiting())
  );
});

// ======================
// ACTIVATE (cleanup old cache)
// ======================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ======================
// FETCH STRATEGY (SMART)
// ======================
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // לא לגעת בחיצוניים (Firebase וכו')
  if (url.origin !== location.origin) return;
  
  // HTML → Network First
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(BASE + 'index.html'))
    );
    return;
  }
  
  // JS / CSS / IMG → Cache First
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      
      return fetch(event.request)
        .then((res) => {
          if (!res || res.status !== 200) return res;
          
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          
          return res;
        })
        .catch(() => {
          // fallback בטוח
          if (event.request.destination === 'document') {
            return caches.match(BASE + 'index.html');
          }
        });
    })
  );
});
