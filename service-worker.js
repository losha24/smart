const cacheName="smartMoney-v1";
const assets=["./","./index.html","./style.css","./app.js","./loan.js","./mortgage.js","./admin.js","./update.js","./storage.js"];

self.addEventListener("install",e=>{ e.waitUntil(caches.open(cacheName).then(c=>c.addAll(assets))) });
self.addEventListener("fetch",e=>{ e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))) });
