/* Smart Money Pro - js/core.js - v5.7.7 - Final Updated */

// משתני משחק גלובליים
let money = 1000;
let bank = 0;
let loan = 0;
let lifeXP = 0;
let passive = 0;
let lastGift = 0;
let skills = [];
let cars = [];
let inventory = []; 
let invOwned = { AAPL:0, TSLA:0, NVDA:0, BTC:0, GOOG:0, AMZN:0, MSFT:0, NFLX:0, META:0, ELAL:0 };
let carSpeed = 1;
let totalEarned = 0;
let totalSpent = 0;

// טעינת נתונים מהדפדפן
function loadGame() {
    const data = JSON.parse(localStorage.getItem('smartMoneySave_v5.7.7'));
    if (data) {
        money = data.money ?? 1000;
        bank = data.bank ?? 0;
        loan = data.loan ?? 0;
        lifeXP = data.lifeXP ?? 0;
        passive = data.passive ?? 0;
        lastGift = data.lastGift ?? 0;
        skills = data.skills ?? [];
        cars = data.cars ?? [];
        inventory = data.inventory ?? [];
        invOwned = data.invOwned ?? invOwned;
        carSpeed = data.carSpeed ?? 1;
        totalEarned = data.totalEarned ?? 0;
        totalSpent = data.totalSpent ?? 0;
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

// פונקציית איפוס התקדמות (Reset)
function resetGame() {
    if (confirm("האם אתה בטוח שברצונך למחוק את כל ההתקדמות ולהתחיל מחדש?")) {
        localStorage.removeItem('smartMoneySave_v5.7.7');
        location.reload();
    }
}

// עדכון התצוגה (UI)
function updateUI() {
    const mEl = document.getElementById('money');
    const bEl = document.getElementById('bank');
    const lEl = document.getElementById('life-level-ui');
    
    if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    if(bEl) bEl.innerText = Math.floor(bank).toLocaleString();
    if(lEl) lEl.innerText = Math.floor(lifeXP / 5000) + 1;
    
    saveGame();
}

// פונקציית עזר להצגת הודעות בראש המסך (Status Bar)
function showMsg(txt, color = "white") {
    const bar = document.getElementById('status-bar');
    if (bar) {
        bar.innerText = txt;
        bar.style.color = color;
        bar.style.opacity = (txt === "") ? "0" : "1";
    }
}

// שינוי עיצוב (כהה/בהיר)
function toggleTheme() {
    const body = document.getElementById('app-body');
    if(body) {
        body.classList.toggle('light-theme');
        body.classList.toggle('dark-theme');
    }
}

// רענון גרסה שקט - ללא Confirm, הודעה בשורת הסטטוס
function forceUpdate() {
    showMsg("בוצע עדכון לגרסא חדשה 5.7.7", "var(--blue)");
    setTimeout(() => {
        location.reload(true);
    }, 1500);
}

// לוגיקת כסף רץ - מתעדכן כל שנייה בבר למעלה
setInterval(() => {
    if (passive > 0) {
        const perSec = passive / 3600;
        money += perSec;
        
        // עדכון ויזואלי מהיר של הכסף בלבד (ללא שמירה כבדה)
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
        
        // שמירה ל-Storage רק פעם ב-10 שניות (כדי לא לפגוע בביצועים)
        if (Math.round(money) % 10 === 0) {
            saveGame();
        }
    }
}, 1000);

// אתחול המשחק
document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
});
