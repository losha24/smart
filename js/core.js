/* Smart Money Pro - js/core.js - v6.0.0 - Engine & Performance Update */

// משתני משחק גלובליים
const VERSION = "6.0.0";
const SAVE_KEY = `smartMoneySave_v${VERSION}`;

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
    try {
        const data = JSON.parse(localStorage.getItem(SAVE_KEY));
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
            console.log(`Game Loaded: v${VERSION}`);
        }
    } catch (e) {
        console.error("Failed to load game", e);
    }
}

// שמירת נתונים
function saveGame() {
    const data = {
        money, bank, loan, lifeXP, passive, lastGift,
        skills, cars, inventory, invOwned, carSpeed,
        totalEarned, totalSpent
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

// פונקציית איפוס התקדמות
function resetGame() {
    if (confirm("⚠️ האם אתה בטוח? כל הכסף והנכסים יימחקו לצמיתות!")) {
        localStorage.removeItem(SAVE_KEY);
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
    
    // בגרסה 6: עדכון ה-XP בר למעלה במידה והוא מוצג ב-Home
    const progress = ((lifeXP % 5000) / 5000) * 100;
    const xpBar = document.querySelector('.xp-bar');
    if(xpBar) xpBar.style.width = progress + "%";
}

// פונקציית עזר להצגת הודעות
function showMsg(txt, color = "white") {
    const bar = document.getElementById('status-bar');
    if (bar) {
        bar.innerText = txt;
        bar.style.color = color;
        bar.style.opacity = (txt === "") ? "0" : "1";
        // אפקט דופק קטן להודעה חדשה
        if(txt !== "") {
            bar.style.transform = "scale(1.05)";
            setTimeout(() => bar.style.transform = "scale(1)", 200);
        }
    }
}

// שינוי עיצוב
function toggleTheme() {
    const body = document.getElementById('app-body');
    if(body) {
        body.classList.toggle('light-theme');
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        localStorage.setItem('theme_pref', isDark ? 'dark' : 'light');
    }
}

// רענון גרסה שקט
function forceUpdate() {
    showMsg(`מעדכן לגרסה ${VERSION}...`, "var(--blue)");
    saveGame();
    setTimeout(() => {
        location.reload(true);
    }, 1200);
}

// --- לוגיקת ליבה: הכסף הרץ ---
setInterval(() => {
    if (passive > 0) {
        // חישוב הכנסה לשנייה אחת
        const incomePerSec = passive / 3600;
        money += incomePerSec;
        totalEarned += incomePerSec;
        
        // עדכון ויזואלי מהיר של הכסף בלבד
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    }
}, 1000);

// שמירה אוטומטית פעם ב-5 שניות (במקום בכל שנייה) לשיפור ביצועים
setInterval(() => {
    if (passive > 0) saveGame();
}, 5000);

// אתחול המשחק
document.addEventListener("DOMContentLoaded", () => {
    // טעינת העדפות עיצוב
    const savedTheme = localStorage.getItem('theme_pref');
    if (savedTheme === 'light') {
        document.getElementById('app-body')?.classList.replace('dark-theme', 'light-theme');
    }
    
    loadGame();
    updateUI();
});
