/* Smart Money Pro - js/core.js - v6.3.4 - Ultra-Fast Ticks (20ms) - Integers Only */

const VERSION = "6.3.4";
const SAVE_KEY = "smartMoneySave_v6_main";

// --- משתנים גלובליים ---
let money = 1200; 
let bank = 0;
let loan = 0;
let lifeXP = 0;
let passive = 0;
let lastKnownLevel = 0;
let totalEarned = 0;
let lastSaveTime = Date.now();

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
    return { level, xpInCurrentLevel, xpForNext, progressPercent };
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
            totalEarned = data.totalEarned ?? 0;
            lastKnownLevel = getLevelData(lifeXP).level;
            
            // חישוב הכנסה לא מקוונת (מוגבל ל-12 שעות)
            if (data.lastSaveTime && passive > 0) {
                const now = Date.now();
                let msPassed = Math.min(now - data.lastSaveTime, 43200000);
                const offlineEarnings = (msPassed / 3600000) * passive;
                if (offlineEarnings > 1) {
                    money += offlineEarnings;
                }
            }
        } else { lastKnownLevel = 1; }
        document.body.className = (localStorage.getItem('theme') || 'dark') + '-theme';
    } catch (e) { console.error("טעינה נכשלה", e); }
}

function saveGame() {
    lastSaveTime = Date.now();
    const data = { money, bank, loan, lifeXP, passive, totalEarned, lastSaveTime };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

// --- עדכון UI (נקרא מהטיקר) ---
function updateUI() {
    const ld = getLevelData(lifeXP);
    const mEl = document.getElementById('money');
    
    if(mEl) {
        // מציג מספרים שלמים בלבד עם פסיקים
        mEl.innerText = Math.floor(money).toLocaleString();
    }

    if (typeof window.renderUIUpdate === 'function') {
        window.renderUIUpdate(ld);
    }
    
    checkLevelUp(ld.level);
}

function checkLevelUp(currentLevel) {
    if (currentLevel > lastKnownLevel && lastKnownLevel > 0) {
        const bonus = currentLevel * 1000;
        money += bonus;
        if(typeof showMsg === 'function') showMsg(`🎊 רמה ${currentLevel}! בונוס: ${bonus.toLocaleString()}₪ 🎊`, "var(--purple)");
        lastKnownLevel = currentLevel;
    }
}

// --- מנוע הטיקים המהיר (20ms - 50 פעמים בשנייה) ---
setInterval(() => {
    if (passive > 0) {
        // בשעה יש 180,000 טיקים של 20ms
        const tickIncome = passive / 180000; 
        money += tickIncome;
        totalEarned += tickIncome;
    }
    
    // עדכון המסך קורה כאן באותה מהירות
    updateUI();
}, 20);

// שמירה אוטומטית כל 15 שניות
setInterval(saveGame, 15000);

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    console.log("Smart Money Engine v6.3.4 [ULTRA-FAST] Loaded.");
});
