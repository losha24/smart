let money=500
let bank=0
let level=1

let totalInvest=0
let totalLoss=0
let passive=0

let jobActive=false
let jobStart=0
let jobTime=0
let jobReward=0

const canvas=document.getElementById("progressCanvas")
const ctx=canvas.getContext("2d")

function safe(n){

if(isNaN(n))return 0
return Math.floor(n)

}

function msg(t){

document.getElementById("message").innerText=t

}

function updateUI(){

money=safe(money)
bank=safe(bank)
passive=safe(passive)

document.getElementById("money").innerText=money
document.getElementById("bank").innerText=bank
document.getElementById("level").innerText=level

document.getElementById("homeMoney").innerText=money
document.getElementById("homeInvest").innerText=totalInvest
document.getElementById("homeLoss").innerText=totalLoss
document.getElementById("homeBank").innerText=bank
document.getElementById("homePassive").innerText=passive

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

msg("הרווחת "+jobReward)

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

let result=Math.random()

if(result>0.5){

let gain=Math.floor(cost*0.5)

money+=gain
passive+=Math.floor(gain/20)

msg("רווח "+gain)

}else{

let loss=Math.floor(cost*0.3)

totalLoss+=loss
msg("הפסד "+loss)

}

save()

}

function buyBusiness(cost,income){

if(money<cost){

msg("אין מספיק כסף")

return

}

money-=cost
passive+=income

msg("עסק חדש הכנסה "+income)

save()

}

function trade(){

let r=Math.random()

if(r>0.5){

money+=200

msg("מסחר הצליח")

}else{

money-=150

msg("מסחר נכשל")

}

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

},8000)

function resetGame(){

if(confirm("לאפס את המשחק?")){

localStorage.clear()
location.reload()

}

}

function save(){

localStorage.setItem("money",money)
localStorage.setItem("bank",bank)
localStorage.setItem("passive",passive)

updateUI()

}

function load(){

money=parseInt(localStorage.getItem("money"))||500
bank=parseInt(localStorage.getItem("bank"))||0
passive=parseInt(localStorage.getItem("passive"))||0

updateUI()

}

load()
