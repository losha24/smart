let money=100
let bank=0
let level=1
let xp=0

let jobActive=false
let jobTime=0
let jobReward=0
let jobStart=0

const canvas=document.getElementById("progressCanvas")
const ctx=canvas.getContext("2d")

function updateUI(){

document.getElementById("money").innerText=money
document.getElementById("bank").innerText=bank
document.getElementById("level").innerText=level

}

function showTab(name){

document.querySelectorAll(".tab").forEach(t=>t.style.display="none")

document.getElementById(name).style.display="block"

}

showTab("work")

function startJob(time,reward){

if(jobActive)return

jobActive=true
jobTime=time
jobReward=reward
jobStart=Date.now()

}

function drawProgress(){

ctx.clearRect(0,0,canvas.width,canvas.height)

if(jobActive){

let elapsed=(Date.now()-jobStart)/1000

let progress=elapsed/jobTime

ctx.fillStyle="#10b981"
ctx.fillRect(0,0,canvas.width*progress,canvas.height)

if(progress>=1){

money+=jobReward
xp+=jobReward

jobActive=false

checkLevel()

save()

}

}

}

setInterval(drawProgress,100)

function invest(cost,mult){

if(money<cost)return

money-=cost

let chance=Math.random()

if(chance>0.5){

money+=Math.floor(cost*mult)

}else{

money+=Math.floor(cost*0.3)

}

xp+=cost

checkLevel()

save()

updateUI()

}

function deposit(){

if(money>=500){

money-=500
bank+=500

save()
updateUI()

}

}

function withdraw(){

if(bank>=500){

bank-=500
money+=500

save()
updateUI()

}

}

function checkLevel(){

if(xp>level*1000){

level++
xp=0

}

}

function economicEvent(){

let r=Math.random()

if(r<0.2){

money=Math.floor(money*0.7)

document.getElementById("event").innerText="⚠️ משבר כלכלי!"

}

}

setInterval(economicEvent,60000)

function save(){

localStorage.setItem("sm_money",money)
localStorage.setItem("sm_bank",bank)
localStorage.setItem("sm_level",level)
localStorage.setItem("sm_xp",xp)

updateUI()

}

function load(){

money=parseInt(localStorage.getItem("sm_money"))||100
bank=parseInt(localStorage.getItem("sm_bank"))||0
level=parseInt(localStorage.getItem("sm_level"))||1
xp=parseInt(localStorage.getItem("sm_xp"))||0

updateUI()

}

load()

async function updateGame(){

try{

let r=await fetch("version.json?"+Date.now())
let data=await r.json()

let current=localStorage.getItem("version")

if(data.version!==current){

localStorage.clear()
localStorage.setItem("version",data.version)

location.reload()

}else{

location.reload()

}

}catch{

location.reload()

}

}

if("serviceWorker" in navigator){

navigator.serviceWorker.register("service-worker.js")

}
