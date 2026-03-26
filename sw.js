const CACHE = "smartmoney-v3.1.2";
const urls = ["./", "./index.html", "./style.css", "./game.js", "./logo.png"];

self.addEventListener("install", e => {
    e.waitUntil(caches.open(CACHE).then(c => c.addAll(urls)));
    self.skipWaiting(); // גורם לגרסה החדשה להיכנס לתוקף מיד
});

self.addEventListener("activate", e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(k => { if(k !== CACHE) return caches.delete(k); })
        ))
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

// האזנה להודעת עדכון מהאפליקציה
self.addEventListener("message", e => {
    if (e.data === "SKIP_WAITING") self.skipWaiting();
});
