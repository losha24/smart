function showTasks(){

document.getElementById("content").innerHTML=

`

<h2>🎯 משימות</h2>

<div class="card" onclick="taskReward(200)">הרווח 200₪</div>

<div class="card" onclick="taskReward(500)">בצע עבודה</div>

<div class="card" onclick="taskReward(1000)">השקע כסף</div>

`

}

function taskReward(v){

money+=v

updateMessage("קיבלת פרס "+v)

}
