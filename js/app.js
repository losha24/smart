function addIncome(){

let value = prompt("הכנס סכום")

if(!value) return

let income = Number(localStorage.getItem("income")||0)

income += Number(value)

localStorage.setItem("income",income)

updateView()

}



function addExpense(){

let value = prompt("הכנס סכום")

if(!value) return

let expenses = Number(localStorage.getItem("expenses")||0)

expenses += Number(value)

localStorage.setItem("expenses",expenses)

updateView()

}



function updateView(){

let income = Number(localStorage.getItem("income")||0)

let expenses = Number(localStorage.getItem("expenses")||0)

let balance = income - expenses


document.getElementById("income").innerText = income

document.getElementById("expenses").innerText = expenses

document.getElementById("balance").innerText = balance

}



function resetData(){

if(confirm("לאפס נתונים?")){

localStorage.clear()

updateView()

}

}


window.onload = updateView
