let money=100
let bank=0
let level=1
let xp=0
let passive=0

loadGame()

function saveGame(){

localStorage.setItem("money",money)
localStorage.setItem("bank",bank)
localStorage.setItem("level",level)
localStorage.setItem("xp",xp)
localStorage.setItem("passive",passive)

}

function loadGame(){

money=Number(localStorage.getItem("money"))||100
bank=Number(localStorage.getItem("bank"))||0
level=Number(localStorage.getItem("level"))||1
xp=Number(localStorage.getItem("xp"))||0
passive=Number(localStorage.getItem("passive"))||0

}

function updateMessage(msg){

document.getElementById("message").innerText=msg

}

function setActive(btn){

document.querySelectorAll(".topbar button").forEach(b=>b.classList.remove("active"))

document.getElementById(btn).classList.add("active")

}

function openTab(tab){

if(tab==="home"){showHome();setActive("btnHome")}
if(tab==="work"){showWork();setActive("btnWork")}
if(tab==="invest"){showInvest();setActive("btnInvest")}
if(tab==="bank"){showBank();setActive("btnBank")}
if(tab==="market"){showMarket();setActive("btnMarket")}
if(tab==="tasks"){showTasks();setActive("btnTasks")}

}

function showHome(){

document.getElementById("content").innerHTML=

`

<h2>📊 מצב כלכלי</h2>

<p>💰 כסף: ${money}</p>

<p>🏦 כסף בבנק: ${bank}</p>

<p>📈 הכנסה פסיבית כל 5 שניות: ${passive}</p>

<p>⭐ רמה: ${level}</p>

`

saveGame()

}

function addXP(v){

xp+=v

if(xp>=100){

xp=0
level++

updateMessage("עלית רמה!")

}

}

setInterval(()=>{

money+=passive

saveGame()

},5000)

function resetGame(){

if(confirm("לאפס את המשחק?")){

localStorage.clear()
location.reload()

}

}

async function checkUpdate(){

try{

let res=await fetch("version.json?"+Date.now())

let data=await res.json()

let current=localStorage.getItem("version")

if(current!==data.version){

localStorage.setItem("version",data.version)

location.reload(true)

}else{

location.reload()

}

}catch(e){

location.reload()

}

}

let deferredPrompt

window.addEventListener("beforeinstallprompt",(e)=>{

e.preventDefault()

deferredPrompt=e

})

function installApp(){

alert("להתקנה:\nבדפדפן לחץ על הוסף למסך הבית")

}
