/* Smart Money Pro - js/core.js - v6.3.0 - Dynamic XP Scaling (25%) */

const VERSION = "6.3.0";
const SAVE_KEY = "smartMoneySave_v6_main";

// --- משתנים גלובליים ---
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

// --- מנוע חישוב רמות דינמי (25% קושי עולה) ---
function getLevelData(xp) {
    let level = 1;
    let xpForNext = 1000; // רמה 1 דורשת 1000 XP
    let totalXPStack = 0;

    // לולאה שמחשבת את הרמה לפי ה-XP המצטבר
    while (xp >= totalXPStack + xpForNext) {
        totalXPStack += xpForNext;
        level++;
        xpForNext = Math.floor(xpForNext * 1.25); // כל רמה קשה ב-25%
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
            
            // הגדרת הרמה מיד עם הטעינה לפי הנוסחה החדשה
            lastKnownLevel = getLevelData(lifeXP).level;
            
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
        
    } catch (e) { console.error("שגיאה בטעינה:", e); }
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

    if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    if(bEl) bEl.innerText = Math.floor(bank).toLocaleString();
    
    // קבלת נתוני הרמה העדכניים
    const ld = getLevelData(lifeXP);
    
    if(lEl) lEl.innerText = ld.level;

    // העברת נתוני הרמה ל-UI.js כדי לעדכן את ה-Progress Bar
    if (typeof window.renderUIUpdate === 'function') window.renderUIUpdate(ld);
    
    checkLevelUp(ld.level);
}

function checkLevelUp(currentLevel) {
    if (currentLevel > lastKnownLevel && lastKnownLevel > 0) {
        const bonus = currentLevel * 1000;
        money += bonus;
        showMsg(`🎊 מזל טוב! עלית לרמה ${currentLevel}! קיבלת בונוס של ${bonus.toLocaleString()}₪ 🎊`, "var(--purple)");
        lastKnownLevel = currentLevel;
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

// --- מנועי זמן ---
setInterval(() => {
    if (passive > 0) {
        const tickIncome = passive / 72000; 
        money += tickIncome;
        totalEarned += tickIncome;
        
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();

        if (typeof window.renderUIUpdate === 'function') {
            const ld = getLevelData(lifeXP);
            window.renderUIUpdate(ld);
        }
    }
}, 50); 

setInterval(saveGame, 15000);

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
    console.log(`Smart Money Engine v${VERSION} Loaded.`);
});
