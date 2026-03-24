
let data = JSON.parse(localStorage.getItem("smartmoney")) || {
transactions:[],
assets:[],
goals:[]
}

function save(){
localStorage.setItem("smartmoney",JSON.stringify(data))
render()
}

function showPage(id){
document.querySelectorAll(".page").forEach(p=>p.style.display="none")
document.getElementById(id).style.display="block"
}

showPage("dashboard")

function addTransaction(){

let desc=document.getElementById("desc").value
let amount=Number(document.getElementById("amount").value)
let type=document.getElementById("type").value

data.transactions.push({desc,amount,type})

save()
}

function render(){

let ul=document.getElementById("transactions")
if(!ul)return

ul.innerHTML=""

data.transactions.forEach(t=>{
let li=document.createElement("li")
li.innerText=t.desc+" "+t.amount
ul.appendChild(li)
})

let income=data.transactions.filter(t=>t.type==="income").reduce((a,b)=>a+b.amount,0)
let expense=data.transactions.filter(t=>t.type==="expense").reduce((a,b)=>a+b.amount,0)

let summary=document.getElementById("summary")
if(summary){
summary.innerHTML="הכנסות: "+income+" | הוצאות: "+expense+" | יתרה: "+(income-expense)
}

renderAssets()
renderGoals()
}

function addAsset(){

let name=document.getElementById("assetName").value
let value=Number(document.getElementById("assetValue").value)

data.assets.push({name,value})

save()
}

function renderAssets(){

let ul=document.getElementById("assetList")
if(!ul)return

ul.innerHTML=""

data.assets.forEach(a=>{

let li=document.createElement("li")
li.innerText=a.name+" "+a.value
ul.appendChild(li)

})
}

function addGoal(){

let name=document.getElementById("goalName").value
let amount=Number(document.getElementById("goalAmount").value)

data.goals.push({name,amount})

save()
}

function renderGoals(){

let ul=document.getElementById("goalList")
if(!ul)return

ul.innerHTML=""

data.goals.forEach(g=>{

let li=document.createElement("li")
li.innerText=g.name+" יעד "+g.amount
ul.appendChild(li)

})
}

async function checkUpdate(){

let res=await fetch("version.json?"+Date.now())
let server=await res.json()

let local=localStorage.getItem("version")||"0"

if(server.version!=local){

localStorage.setItem("version",server.version)
location.reload(true)

}else{

location.reload()

}

}

render()
