/* Smart Money Pro - js/core.js - v6.8.9 - Ultimate Core Engine */

const VERSION = "6.8.9";
const SAVE_KEY = "smartMoneySave_v6_main";

// --- משתנים גלובליים (State) ---
let money = 1250; 
let bank = 0;
let loan = 0;
let lifeXP = 0;
let passive = 0;
let energy = 100;   
let hunger = 0;     
let lastGift = 0;   // הוספתי: מעקב למתנה יומית
let skills = [];
let cars = [];
let inventory = []; 
let invOwned = { AAPL:0, TSLA:0, NVDA:0, BTC:0, GOOG:0, AMZN:0, MSFT:0, NFLX:0, META:0, ELAL:0 };
let carSpeed = 1;
let totalEarned = 0;
let lastSaveTime = Date.now();
let lastKnownLevel = 1; 
let currentTab = 'home'; 

let msgTimer; 

// --- 1. מנוע חישוב רמות דינמי ---
function getLevelData(xp) {
    let level = 1;
    let xpForNext = 1000; 
    let totalXpThreshold = 0; 

    while (xp >= totalXpThreshold + xpForNext) {
        totalXpThreshold += xpForNext;
        level++;
        xpForNext = Math.floor(xpForNext * 1.25); 
    }

    let xpInCurrentLevel = xp - totalXpThreshold;
    // הגנה שלא יעבור את ה-100% ב-UI
    let progressPercent = Math.min(99.9, (xpInCurrentLevel / xpForNext) * 100);

    return { 
        level, 
        xpInCurrentLevel, 
        xpForNext, 
        progressPercent,
        totalXpThreshold 
    };
}

// --- 2. ניהול זיכרון ושמירה ---
function loadGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            
            money = Number(data.money) || 1250;
            bank = Number(data.bank) || 0;
            loan = Number(data.loan) || 0;
            lifeXP = Number(data.lifeXP) || 0;
            passive = Number(data.passive) || 0;
            energy = Number(data.energy) || 100;
            hunger = Number(data.hunger) || 0;
            lastGift = Number(data.lastGift) || 0; // טעינת זמן מתנה
            
            skills = data.skills || [];
            cars = data.cars || [];
            inventory = data.inventory || [];
            invOwned = data.invOwned || invOwned;
            carSpeed = data.carSpeed || 1;
            totalEarned = data.totalEarned || 0;
            lastSaveTime = data.lastSaveTime || Date.now();
            
            lastKnownLevel = getLevelData(lifeXP).level;
            
            // חישוב רווחים לא מקוונים
            calculateOfflineEarnings();
        }
        
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.className = savedTheme + '-theme';
        
    } catch (e) { 
        console.error("שגיאה בטעינה:", e); 
    }
}

function calculateOfflineEarnings() {
    if (passive > 0) {
        const now = Date.now();
        let msPassed = Math.min(now - lastSaveTime, 12 * 60 * 60 * 1000); // מקסימום 12 שעות
        const hoursPassed = msPassed / (1000 * 60 * 60);
        const offlineEarnings = hoursPassed * passive;
        
        if (offlineEarnings > 10) {
            money += offlineEarnings;
            totalEarned += offlineEarnings;
            // הודעה מושהית כדי שה-UI יספיק להיטען
            setTimeout(() => {
                showMsg(`💰 ברוך השב אלכסיי! הרווחת ${Math.floor(offlineEarnings).toLocaleString()}₪ בזמן שלא היית`, "var(--yellow)");
                updateUI();
            }, 1500);
        }
    }
}

function saveGame() {
    const data = { 
        money, bank, loan, lifeXP, passive, energy, hunger, lastGift,
        skills, cars, inventory, invOwned, carSpeed, 
        totalEarned, lastSaveTime: Date.now() 
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    console.log("Game Saved...");
}

// --- 3. מערכת הודעות (Global UI) ---
function showMsg(txt, color = "var(--blue)") {
    const bar = document.getElementById('status-bar');
    if (!bar) return;
    clearTimeout(msgTimer); 
    bar.innerText = txt;
    bar.style.opacity = "1";
    bar.style.transform = "translateY(0)";
    bar.style.backgroundColor = color; // שימוש ברקע במקום צבע טקסט לנראות בטלפון
    
    msgTimer = setTimeout(() => {
        bar.style.opacity = "0";
        bar.style.transform = "translateY(-20px)";
    }, 4000);
}

// --- 4. סנכרון ותצוגה ---
function updateUI() {
    const ld = getLevelData(lifeXP);
    
    const mEl = document.getElementById('top-money');
    const bEl = document.getElementById('top-bank');
    const lEl = document.getElementById('life-level-ui');

    if(mEl) mEl.innerText = Math.floor(money).toLocaleString() + " ₪";
    if(bEl) bEl.innerText = Math.floor(bank).toLocaleString() + " ₪";
    if(lEl) lEl.innerText = ld.level;

    // שליחה ל-ui.js
    if (typeof window.renderUIUpdate === 'function') {
        window.renderUIUpdate(ld);
    }
    
    checkLevelUp(ld.level);
}

function checkLevelUp(currentLevel) {
    if (currentLevel > lastKnownLevel) {
        const bonus = currentLevel * 1500;
        money += bonus;
        showMsg(`🎉 רמה ${currentLevel}! קיבלת בונוס של ${bonus.toLocaleString()}₪ 🎉`, "var(--green)");
        lastKnownLevel = currentLevel;
        saveGame();
    }
}

// --- 5. מנועי זמן ---
// שים לב: הכנסה פסיבית מנוהלת ב-economy.js כדי למנוע כפילויות
// כאן נשאר רק עדכון ה-UI הבסיסי ושמירה אוטומטית
setInterval(saveGame, 60000); // שמירה כל דקה

// --- 6. פונקציות עזר ---
function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    const next = isLight ? 'dark' : 'light';
    document.body.className = next + '-theme';
    localStorage.setItem('theme', next);
    showMsg(`עברת למצב ${next === 'light' ? 'יום' : 'לילה'}`);
}

function resetGame() {
    if (confirm("⚠️ אלכסיי, כל ההתקדמות שלך תימחק. האם אתה בטוח?")) {
        localStorage.clear();
        location.reload();
    }
}

// אתחול מערכת
document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
    console.log(`Core v${VERSION} Initialized.`);
});
