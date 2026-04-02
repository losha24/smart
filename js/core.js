/* Smart Money Pro - js/core.js - v6.9.4 - Ultimate Core Engine */

// הגדרות מערכת גלובליות
window.VERSION = "6.9.4";
window.SAVE_KEY = "SMP_Final_Save"; 

// --- משתנים גלובליים (מוצמדים ל-window לסנכרון מלא) ---
window.money = 1250; 
window.bank = 0;
window.loan = 0;
window.lifeXP = 0;
window.passive = 0;
window.energy = 100;   
window.hunger = 0;     
window.lastGift = 0;   
window.skills = [];
window.cars = [];
window.inventory = []; 
window.invOwned = { AAPL:0, TSLA:0, NVDA:0, BTC:0, GOOG:0, AMZN:0, MSFT:0, NFLX:0, META:0, ELAL:0 };
window.carSpeed = 1;
window.totalEarned = 0;
window.lastSaveTime = Date.now();
window.lastKnownLevel = 1; 
window.currentTab = 'home'; 

let msgTimer; 

// --- 1. מנוע חישוב רמות דינמי ---
window.getLevelData = function(xp) {
    let level = 1;
    let xpForNext = 1000; 
    let totalXpThreshold = 0; 

    while (xp >= totalXpThreshold + xpForNext) {
        totalXpThreshold += xpForNext;
        level++;
        xpForNext = Math.floor(xpForNext * 1.25); 
    }

    let xpInCurrentLevel = xp - totalXpThreshold;
    let progressPercent = Math.min(99.9, (xpInCurrentLevel / xpForNext) * 100);

    return { 
        level, 
        xpInCurrentLevel, 
        xpForNext, 
        progressPercent,
        totalXpThreshold 
    };
};

// --- 2. ניהול זיכרון ושמירה ---
window.loadGame = function() {
    try {
        const saved = localStorage.getItem(window.SAVE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            
            window.money = Number(data.money) || 1250;
            window.bank = Number(data.bank) || 0;
            window.loan = Number(data.loan) || 0;
            window.lifeXP = Number(data.lifeXP) || 0;
            window.passive = Number(data.passive) || 0;
            window.energy = Number(data.energy) || 100;
            window.hunger = Number(data.hunger) || 0;
            window.lastGift = Number(data.lastGift) || 0;
            
            window.skills = data.skills || [];
            window.cars = data.cars || [];
            window.inventory = data.inventory || [];
            window.invOwned = data.invOwned || window.invOwned;
            window.carSpeed = data.carSpeed || 1;
            window.totalEarned = data.totalEarned || 0;
            window.lastSaveTime = data.lastSaveTime || Date.now();
            
            window.lastKnownLevel = window.getLevelData(window.lifeXP).level;
            
            calculateOfflineEarnings();
        }
        
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.className = savedTheme + '-theme';
        
    } catch (e) { 
        console.error("שגיאה בטעינה:", e); 
    }
};

function calculateOfflineEarnings() {
    if (window.passive > 0) {
        const now = Date.now();
        let msPassed = Math.min(now - window.lastSaveTime, 12 * 60 * 60 * 1000); 
        const hoursPassed = msPassed / (1000 * 60 * 60);
        const offlineEarnings = hoursPassed * window.passive;
        
        if (offlineEarnings > 10) {
            window.money += offlineEarnings;
            window.totalEarned += offlineEarnings;
            setTimeout(() => {
                showMsg(`💰 ברוך השב אלכסיי! הרווחת ${Math.floor(offlineEarnings).toLocaleString()}₪ בזמן שלא היית`, "var(--yellow)");
                window.updateUI();
            }, 2000);
        }
    }
}

window.saveGame = function() {
    const data = { 
        money: window.money, bank: window.bank, loan: window.loan, lifeXP: window.lifeXP, 
        passive: window.passive, energy: window.energy, hunger: window.hunger, lastGift: window.lastGift,
        skills: window.skills, cars: window.cars, inventory: window.inventory, invOwned: window.invOwned, 
        carSpeed: window.carSpeed, totalEarned: window.totalEarned, lastSaveTime: Date.now() 
    };
    localStorage.setItem(window.SAVE_KEY, JSON.stringify(data));
};

// --- 3. מערכת הודעות (Global UI) ---
window.showMsg = function(txt, color = "var(--blue)") {
    const bar = document.getElementById('status-bar');
    if (!bar) return;
    clearTimeout(msgTimer); 
    bar.innerText = txt;
    bar.style.opacity = "1";
    bar.style.transform = "translateY(0)";
    bar.style.backgroundColor = color; 
    
    msgTimer = setTimeout(() => {
        bar.style.opacity = "0";
        bar.style.transform = "translateY(-20px)";
    }, 4000);
};

// --- 4. סנכרון ותצוגה ---
window.updateUI = function() {
    const ld = window.getLevelData(window.lifeXP);
    
    const mEl = document.getElementById('top-money');
    const bEl = document.getElementById('top-bank');
    const lEl = document.getElementById('life-level-ui');

    if(mEl) mEl.innerText = Math.floor(window.money).toLocaleString() + " ₪";
    if(bEl) bEl.innerText = Math.floor(window.bank).toLocaleString() + " ₪";
    if(lEl) lEl.innerText = ld.level;

    // עדכון UI משני (נמצא ב-ui.js)
    if (typeof window.renderUIUpdate === 'function') {
        window.renderUIUpdate(ld);
    }
    
    checkLevelUp(ld.level);
};

function checkLevelUp(currentLevel) {
    if (currentLevel > window.lastKnownLevel) {
        const bonus = currentLevel * 1500;
        window.money += bonus;
        showMsg(`🎉 רמה ${currentLevel}! קיבלת בונוס של ${bonus.toLocaleString()}₪ 🎉`, "var(--green)");
        window.lastKnownLevel = currentLevel;
        window.saveGame();
    }
}

// --- 5. מנועי זמן ושמירה ---
setInterval(window.saveGame, 60000); // שמירה אוטומטית כל דקה

window.toggleTheme = function() {
    const isLight = document.body.classList.contains('light-theme');
    const next = isLight ? 'dark' : 'light';
    document.body.className = next + '-theme';
    localStorage.setItem('theme', next);
    showMsg(`עברת למצב ${next === 'light' ? 'יום' : 'לילה'}`);
};

window.resetGame = function() {
    if (confirm("⚠️ אלכסיי, כל ההתקדמות שלך תימחק. האם אתה בטוח?")) {
        localStorage.clear();
        location.reload();
    }
};

// אתחול מערכת
document.addEventListener("DOMContentLoaded", () => {
    window.loadGame();
    window.updateUI();
    console.log(`Core v${window.VERSION} Initialized.`);
});
