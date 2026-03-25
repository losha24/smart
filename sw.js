const CACHE_NAME = "smart-money-cache-v2";

const urlsToCache = [
"/",
"/index.html",
"/manifest.json",
"/version.json",
"/css/style.css",
"/js/app.js",
"/js/storage.js",
"/js/ui.js",
"/js/version-check.js"
];

self.addEventListener("install", event => {
event.waitUntil(
caches.open(CACHE_NAME)
.then(cache => cache.addAll(urlsToCache))
);
});

self.addEventListener("fetch", event => {
event.respondWith(
caches.match(event.request)
.then(response => response || fetch(event.request))
);
});

self.addEventListener("activate", event => {
const whitelist = [CACHE_NAME];
event.waitUntil(
caches.keys().then(names =>
Promise.all(
names.map(name => {
if(!whitelist.includes(name)){
return caches.delete(name);
}
})
)
)
);
});