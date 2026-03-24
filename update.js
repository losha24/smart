async function checkUpdate(){

let res=await fetch("version.json?"+Date.now())

let data=await res.json()

let current=localStorage.getItem("appVersion") || "1.1.0"

if(data.version!==current){

alert("יש גרסה חדשה מתבצע עדכון")

await clearAllCache()

localStorage.setItem("appVersion",data.version)

location.reload(true)

}else{

alert("האפליקציה מעודכנת")

}

}

async function clearAllCache(){

if("caches" in window){

let names=await caches.keys()

for(let name of names){

await caches.delete(name)

}

}

if("serviceWorker" in navigator){

let regs=await navigator.serviceWorker.getRegistrations()

for(let reg of regs){

reg.unregister()

}

}

}
