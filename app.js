let data=JSON.parse(localStorage.getItem("smartMoney"))||{

money:100,
bank:0,
invested:0,
lost:0,
passive:0,
level:1,
xp:0,
xpNeed:100

}

function save(){

localStorage.setItem("smartMoney",JSON.stringify(data))

}

function msg(t){

document.getElementById("message").innerText=t

}

function openTab(tab){

document.querySelectorAll(".topbar button").forEach(b=>b.classList.remove("active"))

if(tab==="home")document.getElementById("btnHome").classList.add("active")

let c=document.getElementById("content")

if(tab==="home"){

c.innerHTML=`

<div class="card">
כסף: ${data.money}
</div>

<div class="card">
בבנק: ${data.bank}
</div>

<div class="card">
השקעות: ${data.invested}
</div>

<div class="card">
הפסדים: ${data.lost}
</div>

<div class="card">
הכנסה פסיבית: ${data.passive}/5s
</div>

<div class="card">

רמה ${data.level}

<div class="progress">
<div style="width:${data.xp/data.xpNeed*100}%"></div>
</div>

</div>

`

}

if(tab==="work"){

c.innerHTML=`

<h2>התקדמות עבודה</h2>

<div class="progress">
<div id="workBar"></div>
</div>

<div class="card">

<button onclick="work(5,20)">עבודה קצרה (5ש)</button>

<button onclick="work(15,70)">שליחות (15ש)</button>

<button onclick="work(30,150)">עבודה משרדית</button>

<button onclick="work(60,400)">פרויקט גדול</button>

</div>

`

}

if(tab==="invest"){

c.innerHTML=`

<div class="card">

<button onclick="invest(50)">קריפטו</button>

<button onclick="invest(100)">מניות</button>

<button onclick="invest(300)">נדלן קטן</button>

<button onclick="invest(1000)">סטארטאפ</button>

</div>

`

}

if(tab==="bank"){

c.innerHTML=`

<div class="card">

<button onclick="deposit()">הפקד 100</button>

<button onclick="withdraw()">משוך 100</button>

</div>

`

}

if(tab==="tasks"){

c.innerHTML=`

<div class="card">

בצע 3 עבודות  
פרס: 100

</div>

<div class="card">

בצע השקעה  
פרס: 150

</div>

`

}

}

function work(sec,reward){

let bar=document.getElementById("workBar")

let p=0

let t=setInterval(()=>{

p++

bar.style.width=(p/sec*100)+"%"

if(p>=sec){

clearInterval(t)

data.money+=reward

data.xp+=20

checkLevel()

save()

msg("הרווחת "+reward)

}

},1000)

}

function invest(amount){

if(data.money<amount){

msg("אין מספיק כסף")

return

}

data.money-=amount

data.invested+=amount

let result=Math.random()

if(result>0.5){

data.passive+=amount*0.05

msg("השקעה הצליחה")

}

else{

data.lost+=amount

msg("השקעה הפסידה")

}

save()

}

function deposit(){

if(data.money<100)return

data.money-=100
data.bank+=100
save()

}

function withdraw(){

if(data.bank<100)return

data.bank-=100
data.money+=100
save()

}

function checkLevel(){

if(data.xp>=data.xpNeed){

data.level++

data.xp=0
data.xpNeed*=1.5

data.money+=200

msg("עלית רמה! קיבלת 200")

}

}

setInterval(()=>{

data.money+=data.passive
save()

},5000)

function resetGame(){

localStorage.removeItem("smartMoney")
location.reload()

}

function checkUpdate(){

fetch("version.json")
.then(r=>r.json())
.then(v=>{

if(v.version!=="1.2"){

location.reload(true)

}else{

location.reload()

}

})

}

openTab("home")
