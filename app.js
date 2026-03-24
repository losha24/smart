function addIncome(){

let desc=document.getElementById("desc").value
let amount=parseFloat(document.getElementById("amount").value)

if(!amount) return

let data=getData()

data.push({

type:"income",
desc,
amount

})

saveData(data)

render()

}

function addExpense(){

let desc=document.getElementById("desc").value
let amount=parseFloat(document.getElementById("amount").value)

if(!amount) return

let data=getData()

data.push({

type:"expense",
desc,
amount

})

saveData(data)

render()

}

function render(){

let data=getData()

let list=document.getElementById("list")

list.innerHTML=""

let balance=0

data.forEach(item=>{

let li=document.createElement("li")

li.textContent=item.desc+" "+item.amount+" ₪"

if(item.type==="income"){

balance+=item.amount
li.style.color="green"

}else{

balance-=item.amount
li.style.color="red"

}

list.appendChild(li)

})

document.getElementById("balance").innerText="יתרה: "+balance+" ₪"

}

function resetData(){

if(confirm("למחוק את כל הנתונים?")){

localStorage.removeItem("moneyData")

render()

}

}
