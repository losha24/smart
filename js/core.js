/* Smart Money Pro - js/core.js - v6.5.1 - Stable Mobile Sync */

const VERSION = "6.5.1";
const SAVE_KEY = "smartMoneySave_v6_main";

// --- אתחול משתנים גלובליים ---
window.money = 1200; 
window.bank = 0;
window.loan = 0;
window.lifeXP = 0;
window.passive = 0;
window.lastGift = 0;
window.skills = [];
window.cars = [];
window.inventory = []; 
window.invOwned = { AAPL:0, TSLA:0, NVDA:0, BTC:0, GOOG:0, AMZN:0, MSFT:0, NFLX:0, META:0, ELAL:0 };
window.carSpeed = 1;
window.totalEarned = 0;
window.lastSaveTime = Date.now();
window.lastKnownLevel = 0; 

let msgTimer; 

// --- מנוע חישוב רמות דינמי (25% קושי עולה) ---
function getLevelData(xp) {
    let level = 1;
    let xpForNext = 1000; 
    let totalXPStack = 0;

    while (xp >= totalXPStack + xpForNext) {
        totalXPStack += xpForNext;
        level++;
        xpForNext = Math.floor(xpForNext * 1.25); 
    }

    let xpInCurrentLevel = xp - totalXPStack;
    let progressPercent = (xpInCurrentLevel / xpForNext) * 100;

    return { 
        level, 
        xpInCurrentLevel, 
        xpForNext, 
        progressPercent 
    };
}

// --- ניהול זיכרון ושמירה ---
function loadGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            
            window.money = data.money ?? 1200;
            window.bank = data.bank ?? 0;
            window.loan = data.loan ?? 0;
            window.lifeXP = data.lifeXP ?? 0;
            window.passive = data.passive ?? 0;
            window.lastGift = data.lastGift ?? 0;
            window.skills = data.skills ?? [];
            window.cars = data.cars ?? [];
            window.inventory = data.inventory ?? [];
            window.invOwned = data.invOwned ?? window.invOwned;
            window.carSpeed = data.carSpeed ?? 1;
            window.totalEarned = data.totalEarned ?? 0;
            
            window.lastKnownLevel = getLevelData(window.lifeXP).level;
            
            if (data.lastSaveTime && window.passive > 0) {
                const now = Date.now();
                let msPassed = Math.min(now - data.lastSaveTime, 12 * 60 * 60 * 1000);
                const offlineEarnings = (msPassed / (1000 * 60 * 60)) * window.passive;
                
                if (offlineEarnings > 1) {
                    window.money += offlineEarnings;
                    window.totalEarned += offlineEarnings;
                    setTimeout(() => {
                        if(typeof showMsg === 'function') showMsg(`💰 הרווחת ${Math.floor(offlineEarnings).toLocaleString()}₪ בזמן שלא היית!`, "var(--yellow)");
                    }, 1500);
                }
            }
        } else {
            window.lastKnownLevel = 1;
        }
        
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.className = savedTheme + '-theme';
        
    } catch (e) { console.error("שגיאה בטעינה:", e); }
}

function saveGame() {
    window.lastSaveTime = Date.now();
    const data = { 
        money: window.money, 
        bank: window.bank, 
        loan: window.loan, 
        lifeXP: window.lifeXP, 
        passive: window.passive, 
        lastGift: window.lastGift, 
        skills: window.skills, 
        cars: window.cars, 
        inventory: window.inventory, 
        invOwned: window.invOwned, 
        carSpeed: window.carSpeed, 
        totalEarned: window.totalEarned, 
        lastSaveTime: window.lastSaveTime 
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

// --- מערכת הודעות ---
function showMsg(txt, color = "var(--blue)") {
    const bar = document.getElementById('status-bar');
    if (!bar) return;
    clearTimeout(msgTimer); 
    bar.innerText = txt;
    bar.style.opacity = "1";
    bar.style.transform = "translateY(0)";
    bar.style.color = color;
    bar.style.borderColor = color;
    msgTimer = setTimeout(() => {
        bar.style.opacity = "0";
        bar.style.transform = "translateY(-5px)";
    }, 3500);
}

// --- פונקציות מערכת ותצוגה ---
function updateUI() {
    const mEl = document.getElementById('money');
    const bEl = document.getElementById('bank');
    const lEl = document.getElementById('life-level-ui');

    if(mEl) mEl.innerText = Math.floor(window.money).toLocaleString();
    if(bEl) bEl.innerText = Math.floor(window.bank).toLocaleString();
    
    const ld = getLevelData(window.lifeXP);
    if(lEl) lEl.innerText = ld.level;

    // עדכון UI כבד (גרפיקה ורמות) - רק אם הפונקציה קיימת ב-UI.js
    if (typeof window.renderUIUpdate === 'function') window.renderUIUpdate(ld);
    
    checkLevelUp(ld.level);
}

function checkLevelUp(currentLevel) {
    if (currentLevel > window.lastKnownLevel && window.lastKnownLevel > 0) {
        const bonus = currentLevel * 1000;
        window.money += bonus;
        showMsg(`🎊 מזל טוב! עלית לרמה ${currentLevel}! קיבלת בונוס של ${bonus.toLocaleString()}₪ 🎊`, "var(--purple)");
        window.lastKnownLevel = currentLevel;
        updateUI();
    }
}

function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    const next = isLight ? 'dark' : 'light';
    document.body.className = next + '-theme';
    localStorage.setItem('theme', next);
    showMsg(`עברת למצב ${next === 'light' ? 'יום' : 'לילה'}`, "var(--blue)");
}

function forceUpdate() {
    saveGame();
    showMsg("מרענן נתונים...", "var(--yellow)");
    setTimeout(() => { location.reload(true); }, 500);
}

function resetGame() {
    if (confirm("⚠️ אזהרה: כל ההתקדמות תימחק. האם אתה בטוח?")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

// --- מנועי זמן (Passive Income) ---

// 1. עדכון כסף מהיר (20 פעם בשנייה) - לא גורם לקפיצות כי הוא מעדכן רק טקסט
setInterval(() => {
    if (window.passive > 0) {
        const tickIncome = window.passive / 72000; 
        window.money += tickIncome;
        window.totalEarned += tickIncome;
        
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(window.money).toLocaleString();
    }
}, 50); 

// 2. עדכון UI גרפי כבד (פעם בשנייה) - המפתח למניעת קפיצות בשוק
setInterval(() => {
    if (typeof window.renderUIUpdate === 'function') {
        const ld = getLevelData(window.lifeXP);
        window.renderUIUpdate(ld);
    }
}, 1000); 

// 3. שמירה אוטומטית כל 15 שניות
setInterval(saveGame, 15000);

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
    console.log(`Smart Money Engine v${VERSION} Fully Loaded and Synced.`);
});
