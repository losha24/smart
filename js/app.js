function addIncome(){
const val = prompt("כמה הכנסה?");
if(!val) return;
saveTransaction("income", Number(val));
render();
}

function addExpense(){
const val = prompt("כמה הוצאה?");
if(!val) return;
saveTransaction("expense", Number(val));
render();
}

window.onload = render;