/* Smart Money Pro - js/core.js - v6.3.2 - Final Synchronized Engine */

const VERSION = "6.3.2";
const SAVE_KEY = "smartMoneySave_v6_main";

// --- 1. משתנים גלובליים ---
let money = 1200; 
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
let lastSaveTime = Date.now();
let lastKnownLevel = 0; 

let msgTimer; 

// --- 2. מנוע חישוב רמות דינמי (קושי עולה ב-25%) ---
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

// --- 3. ניהול שמירות (LocalStorage) ---
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
            
            lastKnownLevel = getLevelData(lifeXP).level;
            
            // חישוב רווח לא מקוון (Offline Earnings)
            if (data.lastSaveTime && passive > 0) {
                const now = Date.now();
                let msPassed = Math.min(now - data.lastSaveTime, 12 * 60 * 60 * 1000);
                const offlineEarnings = (msPassed / (1000 * 60 * 60)) * passive;
                
                if (offlineEarnings > 1) {
                    money += offlineEarnings;
                    totalEarned += offlineEarnings;
                    setTimeout(() => {
                        showMsg(`💰 הרווחת ${Math.floor(offlineEarnings).toLocaleString()}₪ בזמן שלא היית!`, "var(--yellow)");
                    }, 1500);
                }
            }
        } else {
            lastKnownLevel = 1;
        }
        
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.className = savedTheme + '-theme';
        
    } catch (e) { 
        console.error("שגיאה בטעינת משחק:", e); 
    }
}

function saveGame() {
    lastSaveTime = Date.now();
    const data = { 
        money, bank, loan, lifeXP, passive, lastGift, 
        skills, cars, inventory, invOwned, carSpeed, 
        totalEarned, lastSaveTime 
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

// --- 4. מערכת הודעות (מסונכרן ל-ID 'msg') ---
function showMsg(txt, color = "var(--blue)") {
    const bar = document.getElementById('msg');
    if (!bar) return;
    clearTimeout(msgTimer); 
    bar.innerText = txt;
    bar.style.display = "block";
    bar.style.background = color;
    msgTimer = setTimeout(() => {
        bar.style.display = "none";
    }, 3500);
}

// --- 5. עדכון UI ורמות ---
function updateUI() {
    // קריאה לפונקציית העדכון ב-ui.js
    if (typeof window.updateUI === 'function') {
        window.updateUI();
    } else {
        // גיבוי למקרה ש-ui.js עוד לא נטען
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    }
    
    const ld = getLevelData(lifeXP);
    checkLevelUp(ld.level);
}

function checkLevelUp(currentLevel) {
    if (currentLevel > lastKnownLevel && lastKnownLevel > 0) {
        const bonus = currentLevel * 1000;
        money += bonus;
        showMsg(`🎊 מזל טוב! עלית לרמה ${currentLevel}! קיבלת בונוס של ${bonus.toLocaleString()}₪`, "var(--purple)");
        lastKnownLevel = currentLevel;
        updateUI();
    }
}

// --- 6. פונקציות מערכת ---
function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    const next = isLight ? 'dark' : 'light';
    document.body.className = next + '-theme';
    localStorage.setItem('theme', next);
}

function resetGame() {
    if (confirm("⚠️ אזהרה: כל ההתקדמות תימחק. האם אתה בטוח?")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

// --- 7. מנועי זמן (טיקים של כסף ושמירה) ---
setInterval(() => {
    if (passive > 0) {
        // מחלקים ב-72,000 כדי לקבל סכום קטן כל 50ms (שזה שעה שלמה של טיקים)
        const tickIncome = passive / 72000; 
        money += tickIncome;
        totalEarned += tickIncome;
        
        // עדכון מהיר של המזומן בתצוגה העליונה בלבד לביצועים
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    }
}, 50); 

setInterval(saveGame, 15000);

// אתחול כשהדף מוכן
document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
    console.log(`Smart Money Engine v${VERSION} Ready.`);
});
