/* Smart Money Pro - js/core.js - v5.7.7 */

// משתני משחק גלובליים
let money = 1000;
let bank = 0;
let loan = 0;
let lifeXP = 0;
let passive = 0;
let lastGift = 0;
let skills = [];
let cars = [];
let inventory = []; // תוספת חדשה לגרסה 5.7.7
let invOwned = { AAPL:0, TSLA:0, NVDA:0, BTC:0, GOOG:0, AMZN:0, MSFT:0, NFLX:0, META:0, ELAL:0 };
let carSpeed = 1;
let totalEarned = 0;
let totalSpent = 0;

// טעינת נתונים מהדפדפן
function loadGame() {
    const data = JSON.parse(localStorage.getItem('smartMoneySave_v5.7.7'));
    if (data) {
        money = data.money || 1000;
        bank = data.bank || 0;
        loan = data.loan || 0;
        lifeXP = data.lifeXP || 0;
        passive = data.passive || 0;
        lastGift = data.lastGift || 0;
        skills = data.skills || [];
        cars = data.cars || [];
        inventory = data.inventory || [];
        invOwned = data.invOwned || invOwned;
        carSpeed = data.carSpeed || 1;
        totalEarned = data.totalEarned || 0;
        totalSpent = data.totalSpent || 0;
    }
}

// שמירת נתונים
function saveGame() {
    const data = {
        money, bank, loan, lifeXP, passive, lastGift,
        skills, cars, inventory, invOwned, carSpeed,
        totalEarned, totalSpent
    };
    localStorage.setItem('smartMoneySave_v5.7.7', JSON.stringify(data));
}

// עדכון התצוגה (UI)
function updateUI() {
    document.getElementById('money').innerText = Math.floor(money).toLocaleString();
    document.getElementById('bank').innerText = Math.floor(bank).toLocaleString();
    document.getElementById('life-level-ui').innerText = Math.floor(lifeXP / 5000) + 1;
    saveGame();
}

// פונקציית עזר להצגת הודעות בראש המסך
function showMsg(txt, color = "white") {
    const bar = document.getElementById('status-bar');
    if (bar) {
        bar.innerText = txt;
        bar.style.color = color;
    }
}

// שינוי עיצוב (כהה/בהיר)
function toggleTheme() {
    const body = document.getElementById('app-body');
    body.classList.toggle('light-theme');
    body.classList.toggle('dark-theme');
}

// רענון כפוי (לעדכוני גרסה)
function forceUpdate() {
    if (confirm("האם לרענן גרסה? כל הנתונים יישמרו.")) {
        location.reload(true);
    }
}

// לוגיקת הכנסה פסיבית בכל שניה
setInterval(() => {
    if (passive > 0) {
        const perSec = passive / 3600;
        money += perSec;
        updateUI();
    }
}, 1000);

// אתחול המשחק
loadGame();
updateUI();
