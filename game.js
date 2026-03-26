let money = 100
let passive = 0

loadGame()

function updateUI(){

document.getElementById("money").innerText="$"+money

document.getElementById("income").innerText=
"הכנסה פסיבית: $"+passive+" / 5s"

}

function work(){

money+=50

saveGame()

updateUI()

}

function buyBusiness(){

if(money>=500){

money-=500

passive+=20

saveGame()

updateUI()

}

}

function invest(){

if(money>=200){

money-=200

let result=Math.random()

if(result>0.5){

money+=400

}else{

money+=50

}

saveGame()

updateUI()

}

}

setInterval(()=>{

money+=passive

saveGame()

updateUI()

},5000)

function saveGame(){

localStorage.setItem("smartmoney_money",money)

localStorage.setItem("smartmoney_passive",passive)

}

function loadGame(){

let m=localStorage.getItem("smartmoney_money")

let p=localStorage.getItem("smartmoney_passive")

if(m){

money=parseInt(m)

}

if(p){

passive=parseInt(p)

}

updateUI()

}

async function updateGame(){

try{

let response=await fetch("version.json?"+Date.now())

let data=await response.json()

let current=localStorage.getItem("game_version")

if(!current){

localStorage.setItem("game_version",data.version)

location.reload()

}

if(data.version!==current){

localStorage.clear()

localStorage.setItem("game_version",data.version)

location.reload()

}else{

location.reload()

}

}catch(e){

location.reload()

}

}

if('serviceWorker' in navigator){

navigator.serviceWorker.register('service-worker.js')

}
