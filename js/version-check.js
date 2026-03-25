async function checkVersion(){

try{

const response = await fetch("version.json?t=" + Date.now());
const data = await response.json();
const current = localStorage.getItem("app_version");

if(!current){
localStorage.setItem("app_version", data.version);
}

if(current && current !== data.version){
alert("יש גרסה חדשה. האפליקציה תתעדכן.");
localStorage.setItem("app_version", data.version);
location.reload(true);
}

}catch(e){
console.log("version check failed");
}

}

setInterval(checkVersion,60000);