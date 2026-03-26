const CACHE_NAME = "smartmoney-cache-v2";
const urlsToCache = [
  "./",
  "index.html",
  "style.css",
  "app.js",
  "economy.js",
  "market.js",
  "tasks.js",
  "manifest.json",
  "logo.png",
  "version.json"
];

// התקנה
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// הפעלה
self.addEventListener("activate", event => {
  event.waitUntil(
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
  self.clients.claim();
});

// טעינת קבצים
self.addEventListener("fetch", event => {

  if (event.request.url.includes("version.json")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );

});
