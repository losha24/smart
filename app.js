// Smart Money v2 PRO

let game = JSON.parse(localStorage.getItem("smartmoney")) || {
money: 1000,
bank: 0,
income: 0,
level: 1,
xp: 0
};

function saveGame(){
localStorage.setItem("smartmoney", JSON.stringify(game));
updateUI();
}

function updateUI(){

let content = document.getElementById("content");

content.innerHTML = `
<div class="stats">
💰 כסף: ${game.money} ₪ |
🏦 בנק: ${game.bank} ₪ |
📈 הכנסה פסיבית: ${game.income} ₪ |
⭐ רמה: ${game.level}
</div>
`;

}

function openTab(tab){

let content = document.getElementById("content");

if(tab === "home"){

content.innerHTML = `
<h2>ברוכים הבאים</h2>
<p>ניהול כסף חכם</p>
`;

}

if(tab === "work"){

content.innerHTML = `
<h2>עבודות</h2>

<button onclick="doWork(50)">עבודה קטנה +50</button>
<button onclick="doWork(120)">עבודה רגילה +120</button>
<button onclick="doWork(300)">עבודה קשה +300</button>

`;

}

if(tab === "invest"){

content.innerHTML = `
<h2>השקעות</h2>

<button onclick="buyInvestment(500,5)">השקעה קטנה</button>
<button onclick="buyInvestment(2000,25)">נדלן</button>
<button onclick="buyInvestment(5000,80)">עסק</button>

`;

}

if(tab === "bank"){

content.innerHTML = `
<h2>בנק</h2>

<button onclick="deposit()">הפקדה</button>
<button onclick="withdraw()">משיכה</button>

`;

}

if(tab === "market"){

loadMarket();

}

if(tab === "tasks"){

loadTasks();

}

}

function doWork(amount){

game.money += amount;
game.xp += 5;

if(game.xp >= 100){
game.level++;
game.xp = 0;
}

saveGame();

}

function buyInvestment(cost,income){

if(game.money >= cost){

game.money -= cost;
game.income += income;

saveGame();

}else{

alert("אין מספיק כסף");

}

}

function deposit(){

let amount = prompt("כמה להפקיד?");

amount = Number(amount);

if(game.money >= amount){

game.money -= amount;
game.bank += amount;

saveGame();

}

}

function withdraw(){

let amount = prompt("כמה למשוך?");

amount = Number(amount);

if(game.bank >= amount){

game.bank -= amount;
game.money += amount;

saveGame();

}

}

function resetGame(){

if(confirm("לאפס משחק?")){

localStorage.removeItem("smartmoney");
location.reload();

}

}

function installApp(){

if(deferredPrompt){
deferredPrompt.prompt();
}

}

async function checkUpdate(){

try{

let response = await fetch("version.json?"+Date.now());
let data = await response.json();

let currentVersion = localStorage.getItem("version");

if(currentVersion !== data.version){

localStorage.setItem("version",data.version);
location.reload(true);

}else{

location.reload();

}

}catch{

location.reload();

}

}

// Service Worker

if("serviceWorker" in navigator){

navigator.serviceWorker.register("sw.js");

}

updateUI();
openTab("home");
