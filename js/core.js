/* Smart Money Pro - js/core.js - v6.0.3 - Master Core Build */

const VERSION = "6.0.3";
const SAVE_KEY = "smartMoneySave_v6_main";

// --- משתנים גלובליים ---
let money = 1200; // סכום התחלתי מעודכן
let bank = 0;
let loan = 0;
let lifeXP = 0;
let passive = 0;
let lastGift = 0;
let skills = [];
let cars = [];
let inventory = []; 
// מניות (Stocks)
let invOwned = { AAPL:0, TSLA:0, NVDA:0, BTC:0, GOOG:0, AMZN:0, MSFT:0, NFLX:0, META:0, ELAL:0 };
let carSpeed = 1;
let totalEarned = 0;

let msgTimer; 

// --- ניהול זיכרון ושמירה ---

function loadGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            money = data.money ?? 1200;
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
        
        // החלת ערכת נושא שמורה
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.className = savedTheme + '-theme';
        
    } catch (e) { 
        console.error("שגיאה בטעינת נתונים:", e); 
    }
}

function saveGame() {
    const data = { 
        money, bank, loan, lifeXP, passive, lastGift, 
        skills, cars, inventory, invOwned, carSpeed, totalEarned 
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

// --- עדכון ממשק משתמש (UI) ---

function updateUI() {
    // אלמנטים בבר העליון
    const mEl = document.getElementById('money');
    const bEl = document.getElementById('bank');
    const lEl = document.getElementById('life-level-ui');
    const xpBar = document.querySelector('.xp-bar');
    
    if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    if(bEl) bEl.innerText = Math.floor(bank).toLocaleString();
    
    const level = Math.floor(lifeXP / 5000) + 1;
    if(lEl) lEl.innerText = level;
    
    // עדכון פס התקדמות (XP)
    if(xpBar) {
        const progress = ((lifeXP % 5000) / 5000) * 100;
        xpBar.style.width = progress + "%";
    }
}

// מערכת הודעות חכמה
function showMsg(txt, color = "white") {
    const bar = document.getElementById('status-bar');
    if (!bar) return;

    clearTimeout(msgTimer); 
    bar.innerText = txt;
    bar.style.color = color;
    bar.style.opacity = "1";
    bar.style.transform = "translateY(0)";

    msgTimer = setTimeout(() => {
        bar.style.opacity = "0";
        bar.style.transform = "translateY(-5px)";
        setTimeout(() => { bar.innerText = ""; }, 300); 
    }, 3000);
}

// --- פונקציות מערכת ---

function toggleTheme() {
    const current = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    
    document.body.className = next + '-theme';
    localStorage.setItem('theme', next);
    showMsg(`עברת למצב ${next === 'light' ? 'יום' : 'לילה'}`, "var(--blue)");
}

function forceUpdate() {
    showMsg("מרענן נתונים...", "var(--blue)");
    saveGame();
    setTimeout(() => {
        location.reload(true); 
    }, 500);
}

function resetGame() {
    if (confirm("⚠️ אזהרה: כל ההתקדמות שלך תימחק לצמיתות. לאפס?")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

// --- מנועי זמן (Loops) ---

// 1. מנוע הכנסה פסיבית - עדכון ויזואלי מהיר (10Hz)
setInterval(() => {
    if (passive > 0) {
        // הכנסה פסיבית מחושבת לפי שעה, לכן נחלק ב-36,000 (10 פעמים בשניה * 3600 שניות)
        const incomeTick = passive / 36000;
        money += incomeTick;
        totalEarned += incomeTick;
        
        // עדכון ישיר של הכסף במסך לביצועים חלקים
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    }
}, 100);

// 2. שמירה אוטומטית כל 15 שניות
setInterval(saveGame, 15000);

// --- אתחול ---
document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
    console.log(`Smart Money Pro v${VERSION} Loaded.`);
});
