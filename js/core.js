/* Smart Money Pro - js/core.js - v8.0.2 - Fixed Upgrades Save */

const VERSION = "8.0.2";
const SAVE_KEY = "smartMoneySave_v8_main";

window.money = 1200;
window.bank = 0;
window.loan = 0;
window.lifeXP = 0;
window.passive = 0;
window.lastGift = 0;

window.skills = [];
window.cars = [];
window.inventory = [];

window.invOwned = {
AAPL:0,TSLA:0,NVDA:0,BTC:0,
GOOG:0,AMZN:0,MSFT:0,NFLX:0,
META:0,ELAL:0
};

window.carSpeed = 1;

window.itemLevels = {};
window.carLevels = {};

window.totalEarned = 0;
window.lastSaveTime = Date.now();
window.lastKnownLevel = 0;

window.estateData = {};
// Device ID for cloud save
if (!localStorage.getItem("deviceID")) {
  
  localStorage.setItem("deviceID", crypto.randomUUID());
  
}

window.deviceID = localStorage.getItem("deviceID");

window.playerName = localStorage.getItem("playerName") || "";
let msgTimer;
// --- Anti Cheat Hash ---
function createHash(data) {
  
  let str = JSON.stringify(data);
  let hash = 0;
  
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  
  return hash;
  
}

function getLevelData(xp){
let level=1,xpForNext=1000,totalXPStack=0;

while(xp>=totalXPStack+xpForNext){
totalXPStack+=xpForNext;
level++;
xpForNext=Math.floor(xpForNext*1.25);
}

let xpInCurrentLevel=xp-totalXPStack;
let progressPercent=(xpInCurrentLevel/xpForNext)*100;

return{level,xpInCurrentLevel,xpForNext,progressPercent};
}

function loadGame(){

try{

const saved=localStorage.getItem(SAVE_KEY);

if(saved){

const saveData = JSON.parse(saved);

if (!saveData.hash) {
  console.warn("Old save detected");
}

const checkHash = createHash(saveData.data || saveData);

if (saveData.hash && checkHash !== saveData.hash) {
  
  alert("⚠️ זוהה שינוי לא חוקי בשמירה");
  
  localStorage.removeItem(SAVE_KEY);
  location.reload();
  return;
  
}

const data = saveData.data || saveData;
window.playerName = data.playerName || window.playerName;

window.money=data.money??1200;
window.bank=data.bank??0;
window.loan=data.loan??0;
window.lifeXP=data.lifeXP??0;
window.passive=data.passive??0;
window.lastGift=data.lastGift??0;

window.skills=data.skills??[];
window.cars=data.cars??[];
window.inventory=data.inventory??[];

window.invOwned=data.invOwned??window.invOwned;

window.carSpeed=data.carSpeed??1;

window.totalEarned=data.totalEarned??0;

window.estateData=data.estateData??{};

window.itemLevels=data.itemLevels??{};
window.carLevels=data.carLevels??{};

window.lastKnownLevel=getLevelData(window.lifeXP).level;

if(data.lastSaveTime && window.passive>0){

const now=Date.now();

let msPassed=Math.min(now-data.lastSaveTime,12*60*60*1000);

const minutesPassed=msPassed/60000;

const offlineEarnings=minutesPassed*window.passive;

if(offlineEarnings>1){

window.money+=offlineEarnings;

window.totalEarned+=offlineEarnings;

setTimeout(()=>{
if(typeof showMsg==='function'){
showMsg('💰 הרווחת '+Math.floor(offlineEarnings).toLocaleString()+'₪ בזמן שלא היית!','var(--yellow)');
}
},1500);

}

}

}else{

window.lastKnownLevel=1;

}

const savedTheme=localStorage.getItem('theme')||'dark';

document.body.className=savedTheme+'-theme';

}catch(e){

console.error('שגיאה בטעינה:',e);

}

}

function saveGame(){

window.lastSaveTime=Date.now();

const data={

playerName: window.playerName,
  level: getLevelData(window.lifeXP).level,
  device: window.deviceID,
money:window.money,
bank:window.bank,
loan:window.loan,

lifeXP:window.lifeXP,
passive:window.passive,
lastGift:window.lastGift,

skills:window.skills,
cars:window.cars,
inventory:window.inventory,

invOwned:window.invOwned,
carSpeed:window.carSpeed,

totalEarned:window.totalEarned,

lastSaveTime:window.lastSaveTime,

estateData:window.estateData,

itemLevels:window.itemLevels,
carLevels:window.carLevels

};

const savePack = {
  data: data,
  hash: createHash(data)
};

localStorage.setItem(SAVE_KEY, JSON.stringify(savePack));
// Save to Firebase leaderboard
if (window.firebaseDB && window.playerName) {
  
  firebaseDB
    .collection("leaderboard")
    .doc(window.deviceID)
    .set({
      
      name: window.playerName,
      money: window.money,
      level: getLevelData(window.lifeXP).level,
      time: Date.now()
      
    });
  
}
}

function showMsg(txt,color="var(--blue)"){

const bar=document.getElementById('status-bar');

if(!bar)return;

clearTimeout(msgTimer);

bar.innerText=txt;

bar.style.opacity="1";
bar.style.transform="translateY(0)";
bar.style.color=color;
bar.style.borderColor=color;

msgTimer=setTimeout(()=>{

bar.style.opacity="0";
bar.style.transform="translateY(-5px)";

},3500);

}

function updateUI(){
// Anti Cheat - Money limit
if (window.money > 1000000000) {
  console.warn("Money cheat detected");
  window.money = 1000000;
}
if (window.lifeXP > 100000000) {
  console.warn("XP cheat detected");
  window.lifeXP = 1000;
}

const mEl=document.getElementById('money');
const bEl=document.getElementById('bank');
const lEl=document.getElementById('life-level-ui');

if(mEl)mEl.innerText=Math.floor(window.money).toLocaleString();

if(bEl)bEl.innerText=Math.floor(window.bank).toLocaleString();

const ld=getLevelData(window.lifeXP);

if(lEl)lEl.innerText=ld.level;

if(typeof window.renderUIUpdate==='function'){
window.renderUIUpdate(ld);
}

checkLevelUp(ld.level);

}

function checkLevelUp(currentLevel){

if(currentLevel>window.lastKnownLevel && window.lastKnownLevel>0){

const bonus=currentLevel*1000;

window.money+=bonus;

showMsg('🎊 מזל טוב! עלית לרמה '+currentLevel+'! קיבלת '+bonus.toLocaleString()+'₪!','var(--purple)');

window.lastKnownLevel=currentLevel;

updateUI();

}

}

function toggleTheme(){

const isLight=document.body.classList.contains('light-theme');

const next=isLight?'dark':'light';

document.body.className=next+'-theme';

localStorage.setItem('theme',next);

showMsg('עברת למצב '+(next==='light'?'יום':'לילה'),'var(--blue)');

}

function forceUpdate(){

saveGame();

showMsg('מרענן נתונים...','var(--yellow)');

setTimeout(()=>{
location.reload(true);
},500);

}

function resetGame(){

if(confirm('⚠️ אזהרה: כל ההתקדמות תימחק. האם אתה בטוח?')){

localStorage.removeItem(SAVE_KEY);

location.reload();

}

}

setInterval(()=>{

if(window.passive>0){

const tickIncome=window.passive/1200;

window.money+=tickIncome;

window.totalEarned+=tickIncome;

const mEl=document.getElementById('money');

if(mEl)mEl.innerText=Math.floor(window.money).toLocaleString();

}

},50);

setInterval(()=>{

if(typeof window.renderUIUpdate==='function'){

const ld=getLevelData(window.lifeXP);

window.renderUIUpdate(ld);

}

},1000);

setInterval(saveGame,15000);
function checkPlayerName() {
  
  const name = localStorage.getItem("playerName");
  
  if (!name) {
    
    document.getElementById("player-start").style.display = "flex";
    
  } else {
    
    window.playerName = name;
    
  }
  
}

function savePlayerName() {
  
  const input = document.getElementById("player-name-input");
  
  const name = input.value.trim();
  
  if (name.length < 2) {
    
    alert("הכנס שם שחקן");
    
    return;
    
  }
  
  localStorage.setItem("playerName", name);
  
  window.playerName = name;
  
  document.getElementById("player-start").style.display = "none";
  
  showMsg("ברוך הבא " + name + " 🚀");
  
}
document.addEventListener("DOMContentLoaded", () => {
  
  checkPlayerName();
  
  loadGame();
  
  updateUI();
  
});
