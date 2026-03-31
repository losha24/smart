/* Smart Money Pro - js/core.js - v6.3 - Official Stable Version */

const VERSION = "6.3";
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
            
            lastKnownLevel = Math.floor(lifeXP / 1000) + 1;
            
            // חישוב הכנסה לא מקוונת
            if (data.lastSaveTime && passive > 0) {
                const now = Date.now();
                let msPassed = Math.min(now - data.lastSaveTime, 12 * 60 * 60 * 1000);
                const offlineEarnings = (msPassed / 3600000) * passive;
                
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
        console.error("שגיאה בטעינה:", e); 
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

// --- מערכת הודעות ---
function showMsg(txt, color = "var(--blue)") {
    const bar = document.getElementById('status-bar');
    if (!bar) return;
    clearTimeout(msgTimer); 
    bar.innerText = txt;
    bar.style.opacity = "1";
    bar.style.color = color;
    msgTimer = setTimeout(() => { bar.style.opacity = "0"; }, 3500);
}

// --- עדכון UI ---
function updateUI() {
    const mEl = document.getElementById('money');
    const bEl = document.getElementById('bank');
    const lEl = document.getElementById('life-level-ui');

    if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    if(bEl) bEl.innerText = Math.floor(bank).toLocaleString();
    
    const currentLevel = Math.floor(lifeXP / 1000) + 1;
    if(lEl) lEl.innerText = currentLevel;

    // שליחת נתונים ל-ui.js
    if (typeof window.renderUIUpdate === 'function') {
        const xpInCurrentLevel = lifeXP % 1000;
        window.renderUIUpdate({
            level: currentLevel,
            xpInCurrentLevel: xpInCurrentLevel,
            xpForNext: 1000,
            progressPercent: (xpInCurrentLevel / 1000) * 100
        });
    }
    
    checkLevelUp();
}

function checkLevelUp() {
    const currentLevel = Math.floor(lifeXP / 1000) + 1;
    if (currentLevel > lastKnownLevel && lastKnownLevel > 0) {
        const bonus = currentLevel * 1000;
        money += bonus;
        showMsg(`🎊 עליית רמה! קיבלת ${bonus.toLocaleString()}₪ 🎊`, "var(--purple)");
        lastKnownLevel = currentLevel;
        updateUI();
    }
}

// --- מנוע זמן (100ms - היציב והבדוק) ---
setInterval(() => {
    if (passive > 0) {
        // מתמטיקה: 36,000 טיקים בשעה
        const tickIncome = passive / 36000; 
        money += tickIncome;
        totalEarned += tickIncome;
        
        // עדכון מהיר של הכסף במסך
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();

        // עדכון שאר האלמנטים (XP וכו') דרך ה-UI
        if (typeof window.renderUIUpdate === 'function') {
            const currentLevel = Math.floor(lifeXP / 1000) + 1;
            const xpInCurrentLevel = lifeXP % 1000;
            window.renderUIUpdate({
                level: currentLevel,
                xpInCurrentLevel: xpInCurrentLevel,
                xpForNext: 1000,
                progressPercent: (xpInCurrentLevel / 1000) * 100
            });
        }
    }
}, 100); 

// שמירה אוטומטית כל 15 שניות
setInterval(saveGame, 15000);

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
    console.log(`Smart Money Engine v${VERSION} Ready.`);
});

// פונקציות תפעול
function forceUpdate() { saveGame(); setTimeout(() => { location.reload(true); }, 500); }
function toggleTheme() { 
    const isLight = document.body.classList.contains('light-theme');
    document.body.className = (isLight ? 'dark' : 'light') + '-theme';
    localStorage.setItem('theme', isLight ? 'dark' : 'light');
}
