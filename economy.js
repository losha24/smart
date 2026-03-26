function showWork(){

document.getElementById("content").innerHTML=

`

<h2>💼 עבודות</h2>

<div class="card" onclick="doWork(50,5)">עבודה קלה<br>5 שניות<br>50₪</div>

<div class="card" onclick="doWork(120,10)">עבודה רגילה<br>10 שניות<br>120₪</div>

<div class="card" onclick="doWork(300,20)">עבודה קשה<br>20 שניות<br>300₪</div>

`

}

function doWork(pay,time){

updateMessage("עובד...")

setTimeout(()=>{

money+=pay

addXP(20)

updateMessage("הרווחת "+pay)

showWork()

},time*1000)

}



function showInvest(){

document.getElementById("content").innerHTML=

`

<h2>📈 השקעות</h2>

<div class="card" onclick="invest(200,2)">השקעה קטנה<br>200₪</div>

<div class="card" onclick="invest(500,5)">השקעה בינונית<br>500₪</div>

<div class="card" onclick="invest(1000,12)">השקעה גדולה<br>1000₪</div>

`

}

function invest(cost,inc){

if(money<cost){

updateMessage("אין מספיק כסף")

return

}

money-=cost

passive+=inc

updateMessage("נוספה הכנסה פסיבית")

}
