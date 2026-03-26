const CACHE_NAME = "smartmoney-v2";

const urls = [
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

self.addEventListener("install", e => {

e.waitUntil(
caches.open(CACHE_NAME)
.then(cache => cache.addAll(urls))
);

});

self.addEventListener("fetch", e => {

e.respondWith(
caches.match(e.request)
.then(res => res || fetch(e.request))
);

});
