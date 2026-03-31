/* Smart Money Pro - js/core.js - v6.2.1 - Engine & Sync */

const VERSION = "6.2.1";
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
// רשימת מניות מסונכרנת עם economy.js
let invOwned = { AAPL:0, TSLA:0, NVDA:0, BTC:0, GOOG:0, AMZN:0, MSFT:0, NFLX:0, META:0, ELAL:0 };
let carSpeed = 1;
let totalEarned = 0;
let lastSaveTime = Date.now(); 

let msgTimer; 

// --- ניהול שמירה ---
function loadGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            // מיזוג נתונים עם ערכי ברירת מחדל
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
            
            // חישוב הכנסה לא מקוונת (Offline)
            if (data.lastSaveTime && passive > 0) {
                const now = Date.now();
                let msPassed = Math.min(now - data.lastSaveTime, 12 * 60 * 60 * 1000); // מקסימום 12 שעות
                const hoursPassed = msPassed / (1000 * 60 * 60);
                const offlineEarnings = hoursPassed * passive;
                
                if (offlineEarnings > 1) {
                    money += offlineEarnings;
                    setTimeout(() => {
                        showMsg(`💰 הרווחת ${Math.floor(offlineEarnings).toLocaleString()}₪ בזמן שלא היית!`, "var(--yellow)");
                    }, 1500);
                }
            }
        }
    } catch (e) { console.error("שגיאה בטעינה:", e); }
}

function saveGame() {
    lastSaveTime = Date.now();
    const data = { money, bank, loan, lifeXP, passive, lastGift, skills, cars, inventory, invOwned, carSpeed, totalEarned, lastSaveTime };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

// --- הודעות מערכת ---
function showMsg(txt, color = "var(--blue)") {
    const bar = document.getElementById('status-bar');
    if (!bar) return;
    clearTimeout(msgTimer); 
    bar.innerText = txt;
    bar.style.opacity = "1";
    bar.style.transform = "translateY(0)";
    bar.style.color = color;
    bar.style.borderColor = color;
    msgTimer = setTimeout(() => { bar.style.opacity = "0"; bar.style.transform = "translateY(-5px)"; }, 3500);
}

// --- עדכון תצוגה ---
function updateUI() {
    const mEl = document.getElementById('money');
    const bEl = document.getElementById('bank');
    if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    if(bEl) bEl.innerText = Math.floor(bank).toLocaleString();

    // קריאה לעדכון הוויזואלי ב-UI.js (עבור ה-XP וה-Passive)
    if (typeof window.renderUIUpdate === 'function') window.renderUIUpdate();
    checkLevelUp();
}

function checkLevelUp() {
    const currentLevel = Math.floor(lifeXP / 1000) + 1;
    const levelDisplay = document.getElementById('life-level-ui');
    if (levelDisplay && currentLevel > parseInt(levelDisplay.innerText)) {
        showMsg(`🎊 רמה ${currentLevel}! קיבלת בונוס! 🎊`, "var(--purple)");
        money += currentLevel * 1000;
        levelDisplay.innerText = currentLevel;
    }
}

// --- פונקציות מערכת ---
function forceUpdate() {
    saveGame();
    showMsg("מרענן נתונים...", "var(--yellow)");
    setTimeout(() => { location.reload(true); }, 500);
}

function resetGame() {
    if (confirm("⚠️ למחוק הכל ולהתחיל מחדש?")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

// --- מנוע הכנסה פסיבית (Tick) ---
setInterval(() => {
    if (passive > 0) {
        money += (passive / 72000); // עדכון כל 50ms (שזה 1/72,000 של שעה)
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
        if (typeof window.renderUIUpdate === 'function') window.renderUIUpdate();
    }
}, 50); 

setInterval(saveGame, 15000);

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
    console.log(`Smart Money Engine v${VERSION} Ready.`);
});
