const CACHE_NAME = "smartmoney-v3.4.11";
const urlsToCache = ["./", "./index.html", "./style.css", "./game.js", "./manifest.json", "./logo.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => {
    if (k !== CACHE_NAME) return caches.delete(k);
  }))));
});

self.addEventListener("fetch", (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
