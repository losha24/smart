/* Smart Money Pro - js/core.js - v6.0.3 - Final Build */

const VERSION = "6.0.3";
// שימוש במפתח קבוע כדי שעדכוני קבצים לא ימחקו את התקדמות השחקן
const SAVE_KEY = "smartMoneySave_v6_main";

// משתנים גלובליים
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

let msgTimer; 

// טעינת המשחק מהדפדפן
function loadGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
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
        }
        
        // החלת ערכת נושא שמורה (יום/לילה)
        const savedTheme = localStorage.getItem('theme');
        const body = document.getElementById('app-body');
        if (savedTheme === 'light' && body) {
            body.classList.replace('dark-theme', 'light-theme');
        }
    } catch (e) { 
        console.error("Load failed", e); 
    }
}

// שמירת המשחק
function saveGame() {
    const data = { 
        money, bank, loan, lifeXP, passive, lastGift, 
        skills, cars, inventory, invOwned, carSpeed, totalEarned 
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

// עדכון אלמנטים קבועים במסך
function updateUI() {
    const mEl = document.getElementById('money');
    const bEl = document.getElementById('bank');
    const lEl = document.getElementById('life-level-ui');
    
    if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    if(bEl) bEl.innerText = Math.floor(bank).toLocaleString();
    
    const level = Math.floor(lifeXP / 5000) + 1;
    if(lEl) lEl.innerText = level;
    
    // עדכון פס XP אם אנחנו בדף הבית
    const progress = ((lifeXP % 5000) / 5000) * 100;
    const xpBar = document.querySelector('.xp-bar');
    if(xpBar) xpBar.style.width = progress + "%";
}

// הצגת הודעות סטטוס (נעלמות אחרי 3 שניות)
function showMsg(txt, color = "white") {
    const bar = document.getElementById('status-bar');
    if (!bar) return;

    clearTimeout(msgTimer); 
    bar.innerText = txt;
    bar.style.color = color;
    bar.style.opacity = (txt === "") ? "0" : "1";

    if (txt !== "") {
        msgTimer = setTimeout(() => {
            bar.style.opacity = "0";
            setTimeout(() => { bar.innerText = ""; }, 300); 
        }, 3000);
    }
}

// החלפת מצב יום/לילה
function toggleTheme() {
    const body = document.getElementById('app-body');
    if(!body) return;

    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.replace('dark-theme', 'light-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.replace('light-theme', 'dark-theme');
        localStorage.setItem('theme', 'dark');
    }
}

// רענון קבצים ללא מחיקת כסף (Cache Busting)
function forceUpdate() {
    showMsg("מעדכן גרסת קבצים...", "var(--blue)");
    saveGame(); // שמירה אחרונה לפני הרענון
    setTimeout(() => {
        // רענון קשיח מהשרת
        location.reload(true); 
    }, 800);
}

// איפוס מוחלט של המשחק
function resetGame() {
    if (confirm("⚠️ אזהרה: כל הכסף, הרכבים והרמות יימחקו. לאפס הכל?")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

// --- מנוע הכנסה פסיבית בזמן אמת (10 פעמים בשנייה) ---
setInterval(() => {
    if (passive > 0) {
        const incomeTick = passive / 36000;
        money += incomeTick;
        totalEarned += incomeTick;
        
        // עדכון ישיר של הבר העליון לביצועים מקסימליים
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    }
}, 100);

// שמירה אוטומטית כל 10 שניות למניעת אובדן נתונים
setInterval(saveGame, 10000);

// אתחול ראשוני כשהדף מוכן
document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
});
