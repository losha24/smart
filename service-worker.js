self.addEventListener('install', e=>{
    e.waitUntil(
        caches.open('smartmoney-v2').then(cache=>{
            return cache.addAll([
                '/index.html','/style.css','/app.js','/economy.js','/bank.js','/market.js','/tasks.js','/logo.png'
            ]);
        })
    );
});
self.addEventListener('fetch', e=>{
    e.respondWith(
        caches.match(e.request).then(response => response || fetch(e.request))
    );
});
