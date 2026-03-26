let game = JSON.parse(localStorage.getItem("smartmoney")) || {

money: 1000,
bank: 0,
income: 0,
level: 1,
xp: 0

};

function saveGame(){

localStorage.setItem("smartmoney",JSON.stringify(game));

updateUI();

}

function updateUI(){

document.getElementById("money").innerText = game.money;
document.getElementById("bank").innerText = game.bank;
document.getElementById("income").innerText = game.income;
document.getElementById("level").innerText = game.level;

}

function openTab(tab){

let c = document.getElementById("content");

if(tab==="home"){

c.innerHTML=`
<h2>ברוכים הבאים</h2>
<p>התחל לעבוד ולהשקיע</p>
`;

}

if(tab==="work"){

c.innerHTML=`

<h2>עבודות</h2>

<button onclick="work(50)">שליח +50</button>

<button onclick="work(120)">מלצר +120</button>

<button onclick="work(300)">פרילנסר +300</button>

`;

}

if(tab==="invest"){

c.innerHTML=`

<h2>השקעות</h2>

<button onclick="invest(500,5)">
מניות קטנות  
עלות 500  
רווח פסיבי 5
</button>

<button onclick="invest(2000,20)">
נדלן קטן  
עלות 2000  
רווח 20
</button>

<button onclick="invest(5000,60)">
עסק  
עלות 5000  
רווח 60
</button>

`;

}

if(tab==="bank"){

c.innerHTML=`

<h2>בנק</h2>

<button onclick="deposit()">הפקדה</button>

<button onclick="withdraw()">משיכה</button>

`;

}

}

function work(amount){

game.money+=amount;
game.xp+=10;

if(game.xp>=100){

game.level++;
game.xp=0;

}

saveGame();

}

function invest(cost,income){

if(game.money>=cost){

game.money-=cost;

game.income+=income;

saveGame();

}

}

function deposit(){

let a=Number(prompt("כמה להפקיד"));

if(game.money>=a){

game.money-=a;

game.bank+=a;

saveGame();

}

}

function withdraw(){

let a=Number(prompt("כמה למשוך"));

if(game.bank>=a){

game.bank-=a;

game.money+=a;

saveGame();

}

}

function resetGame(){

if(confirm("לאפס משחק?")){

localStorage.removeItem("smartmoney");

location.reload();

}

}

async function checkUpdate(){

location.reload(true);

}

setInterval(()=>{

game.money+=game.income;

saveGame();

},5000);

updateUI();

openTab("home");
