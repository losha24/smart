const CACHE="smart-money-v1"

self.addEventListener("install",e=>{

self.skipWaiting()

})

self.addEventListener("activate",e=>{

caches.keys().then(keys=>{

keys.forEach(key=>{

if(key!==CACHE){

caches.delete(key)

}

})

})

})

self.addEventListener("fetch",event=>{

event.respondWith(

fetch(event.request).catch(()=>caches.match(event.request))

)

})
