function render(){

const data = getData();

let income = 0;
let expense = 0;

data.forEach(t=>{
if(t.type==="income") income+=t.amount;
if(t.type==="expense") expense+=t.amount;
});

const balance = income-expense;

document.getElementById("log").innerHTML = `
<h3>הכנסות: ${income}</h3>
<h3>הוצאות: ${expense}</h3>
<h2>יתרה: ${balance}</h2>
`;

}