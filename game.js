let money=Number(localStorage.money)||100
let bank=Number(localStorage.bank)||0
let xp=Number(localStorage.xp)||0
let level=Number(localStorage.level)||1

let passive=0
let working=false

const works=[
{name:"עבודה קלה",pay:50,time:5},
{name:"עבודה משרדית",pay:120,time:10},
{name:"פרילנס",pay:300,time:20},
{name:"פרויקט גדול",pay:800,time:60}
]

const invests=[
{name:"קריפטו",cost:200},
{name:"מניה",cost:500},
{name:"נדלן קטן",cost:1000}
]

function save(){

localStorage.money=money
localStorage.bank=bank
localStorage.xp=xp
localStorage.level=level

}

function updateUI(){

document.getElementById("money").innerText=Math.floor(money)
document.getElementById("bank").innerText=Math.floor(bank)
document.getElementById("level").innerText=level

document.getElementById("xpfill").style.width=(xp%100)+"%"

save()

}

function message(t){

document.getElementById("message").innerText=t

}

function openTab(tab){

document.querySelectorAll(".topbar button").forEach(b=>b.classList.remove("active"))
document.getElementById("btn"+tab.charAt(0).toUpperCase()+tab.slice(1)).classList.add("active")

if(tab==="home")home()
if(tab==="work")workPage()
if(tab==="invest")investPage()
if(tab==="bank")bankPage()
if(tab==="market")marketPage()
if(tab==="tasks")tasksPage()

}

function home(){

document.getElementById("content").innerHTML=

`<h2>מצב כלכלי</h2>
<p>הכנסה פסיבית: ${passive} כל 5 שניות</p>`

}

function workPage(){

let html="<h2>עבודות</h2>"

works.forEach((w,i)=>{

html+=`<button class="action" onclick="startWork(${i})">
${w.name}  
💰 ${w.pay}  
⏱ ${w.time}s
</button>`

})

html+=`<div class="progress"><div id="workbar" class="progressFill"></div></div>`

document.getElementById("content").innerHTML=html

}

function startWork(i){

if(working)return message("סיים עבודה קודם")

let w=works[i]

working=true

let t=0

let bar=document.getElementById("workbar")

let interval=setInterval(()=>{

t++

bar.style.width=(t/w.time*100)+"%"

if(t>=w.time){

clearInterval(interval)

money+=w.pay
xp+=10
passive+=1

working=false

levelUp()

updateUI()

message("הרווחת "+w.pay)

}

},1000)

}

function investPage(){

let html="<h2>השקעות</h2>"

invests.forEach((inv,i)=>{

html+=`<button class="action" onclick="invest(${i})">
${inv.name}  
💰 ${inv.cost}
</button>`

})

document.getElementById("content").innerHTML=html

}

function invest(i){

let inv=invests[i]

if(money<inv.cost)return message("אין מספיק כסף")

money-=inv.cost

let result=Math.random()

if(result>0.5){

let gain=inv.cost*1.5
money+=gain
message("רווח "+gain)

}else{

message("הפסד בהשקעה")

}

updateUI()

}

function bankPage(){

document.getElementById("content").innerHTML=

`<h2>בנק</h2>

<button class="action" onclick="deposit()">הפקדה 100</button>
<button class="action" onclick="withdraw()">משיכה 100</button>`

}

function deposit(){

if(money<100)return

money-=100
bank+=100

updateUI()

}

function withdraw(){

if(bank<100)return

bank-=100
money+=100

updateUI()

}

function marketPage(){

document.getElementById("content").innerHTML="<h2>שוק</h2> בקרוב"

}

function tasksPage(){

document.getElementById("content").innerHTML=

`<h2>משימות</h2>

<button class="action" onclick="task()">בצע משימה</button>`

}

function task(){

money+=200
xp+=20

updateUI()

}

function levelUp(){

if(xp>=100){

xp=0
level++

money+=500

message("עלית רמה!")

}

}

setInterval(()=>{

money+=passive

updateUI()

},5000)

function resetGame(){

if(!confirm("לאפס משחק?"))return

localStorage.clear()

location.reload()

}

function checkUpdate(){

fetch("version.json")
.then(r=>r.json())
.then(v=>{

if(v.version!=="3")location.reload()
else location.reload()

})

}

let deferredPrompt

window.addEventListener("beforeinstallprompt",e=>{

e.preventDefault()

deferredPrompt=e

})

function installApp(){

if(!deferredPrompt){

alert("להתקנה:\nפתח תפריט דפדפן\nהוסף למסך הבית")

return

}

deferredPrompt.prompt()

}

updateUI()

openTab("home")
