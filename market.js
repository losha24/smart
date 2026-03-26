function showMarket(){

document.getElementById("content").innerHTML=

`

<h2>🛒 שוק</h2>

<div class="card" onclick="buyItem(300,3)">קיוסק קטן</div>

<div class="card" onclick="buyItem(1000,8)">חנות</div>

<div class="card" onclick="buyItem(3000,20)">עסק</div>

`

}

function buyItem(cost,inc){

if(money<cost){

updateMessage("אין מספיק כסף")

return

}

money-=cost

passive+=inc

updateMessage("עסק נרכש!")

}
