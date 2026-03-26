let money=500
let bank=0
let level=1

let totalInvest=0
let totalLoss=0

let passive=0
let passiveTimer=8

let jobActive=false
let jobStart=0
let jobTime=0
let jobReward=0

const canvas=document.getElementById("progressCanvas")
const ctx=canvas.getContext("2d")

function updateUI(){

money=Math.floor(money)

document.getElementById("money").innerText=money
document.getElementById("bank").innerText=bank
document.getElementById("level").innerText=level

document.getElementById("homeMoney").innerText=money
document.getElementById("homeInvest").innerText=totalInvest
document.getElementById("homeLoss").innerText=totalLoss
document.getElementById("homeBank").innerText=bank
document.getElementById("homePassive").innerText=passive
document.getElementById("homeTimer").innerText=passiveTimer+" שניות"

}

function msg(t){

document.getElementById("message").innerText=t

}

function showTab(name){

document.querySelectorAll(".tab").forEach(t=>t.style.display="none")

document.getElementById(name).style.display="block"

}

showTab("home")

function startJob(time,reward){

if(jobActive)return

jobActive=true
jobStart=Date.now()
jobTime=time
jobReward=reward

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height)

if(jobActive){

let e=(Date.now()-jobStart)/1000
let p=e/jobTime

ctx.fillStyle="#10b981"
ctx.fillRect(0,0,canvas.width*p,canvas.height)

if(p>=1){

money+=jobReward
jobActive=false

msg("קיבלת "+jobReward)

save()

}

}

}

setInterval(draw,100)

function invest(cost){

if(money<cost){

msg("אין מספיק כסף")

return

}

money-=cost

totalInvest+=cost

let change=(Math.random()*cost*0.4)-(cost*0.2)

passive+=Math.floor(change/10)

if(change<0){

totalLoss+=Math.abs(change)

}

msg("השקעה שינתה הכנסה "+Math.floor(change/10))

save()

}

function deposit(){

if(money<500){

msg("אין מספיק כסף")

return

}

money-=500
bank+=500

save()

}

function withdraw(){

if(bank<500){

msg("אין כסף בבנק")

return

}

bank-=500
money+=500

save()

}

setInterval(()=>{

money+=passive

updateUI()

},passiveTimer*1000)

function crisis(){

let r=Math.random()

if(r<0.2){

money*=0.8

msg("⚠️ משבר אינפלציה!")

}

else if(r<0.3){

passive*=0.7

msg("⚠️ קריסת שוק")

}

}

setInterval(crisis,60000)

function resetGame(){

localStorage.clear()
location.reload()

}

function save(){

localStorage.setItem("sm_money",money)
localStorage.setItem("sm_bank",bank)
localStorage.setItem("sm_passive",passive)
localStorage.setItem("sm_invest",totalInvest)
localStorage.setItem("sm_loss",totalLoss)

updateUI()

}

function load(){

money=parseInt(localStorage.getItem("sm_money"))||500
bank=parseInt(localStorage.getItem("sm_bank"))||0
passive=parseInt(localStorage.getItem("sm_passive"))||0
totalInvest=parseInt(localStorage.getItem("sm_invest"))||0
totalLoss=parseInt(localStorage.getItem("sm_loss"))||0

updateUI()

}

load()
