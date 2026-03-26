const CACHE="smartmoney-v3"

const urls=[
"./",
"./index.html",
"./style.css",
"./game.js",
"./logo.png"
]

self.addEventListener("install",e=>{

e.waitUntil(

caches.open(CACHE).then(c=>c.addAll(urls))

)

})

self.addEventListener("fetch",e=>{

e.respondWith(

caches.match(e.request).then(r=>r||fetch(e.request))

)

})
