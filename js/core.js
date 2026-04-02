/* Smart Money Pro - js/core.js - v6.8.9 - Ultimate Core Engine */

const VERSION = "6.8.9";
const SAVE_KEY = "smartMoneySave_v6_main";

// --- משתנים גלובליים (State) ---
let money = 1250; 
let bank = 0;
let loan = 0;
let lifeXP = 0;
let passive = 0;
let energy = 100;   // נוסף: ניהול כוח עבודה
let hunger = 0;     // נוסף: ניהול שובע
let skills = [];
let cars = [];
let inventory = []; 
let invOwned = { AAPL:0, TSLA:0, NVDA:0, BTC:0, GOOG:0, AMZN:0, MSFT:0, NFLX:0, META:0, ELAL:0 };
let carSpeed = 1;
let totalEarned = 0;
let lastSaveTime = Date.now();
let lastKnownLevel = 1; 
let currentTab = 'home'; // ניהול טאב נוכחי

let msgTimer; 

// --- 1. מנוע חישוב רמות דינמי (25% קושי עולה) ---
function getLevelData(xp) {
    let level = 1;
    let xpForNext = 1000; 
    let totalXpThreshold = 0; // הנקודה בה הרמה הנוכחית התחילה

    while (xp >= totalXpThreshold + xpForNext) {
        totalXpThreshold += xpForNext;
        level++;
        xpForNext = Math.floor(xpForNext * 1.25); 
    }

    let xpInCurrentLevel = xp - totalXpThreshold;
    let progressPercent = Math.min(100, (xpInCurrentLevel / xpForNext) * 100);

    return { 
        level, 
        xpInCurrentLevel, 
        xpForNext, 
        progressPercent,
        totalXpThreshold // חיוני לחישובים ב-UI
    };
}

// --- 2. ניהול זיכרון ושמירה (Persistence) ---
function loadGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            
            money = data.money ?? 1250;
            bank = data.bank ?? 0;
            loan = data.loan ?? 0;
            lifeXP = data.lifeXP ?? 0;
            passive = data.passive ?? 0;
            energy = data.energy ?? 100;
            hunger = data.hunger ?? 0;
            skills = data.skills ?? [];
            cars = data.cars ?? [];
            inventory = data.inventory ?? [];
            invOwned = data.invOwned ?? invOwned;
            carSpeed = data.carSpeed ?? 1;
            totalEarned = data.totalEarned ?? 0;
            lastSaveTime = data.lastSaveTime ?? Date.now();
            
            lastKnownLevel = getLevelData(lifeXP).level;
            
            // חישוב רווחים בזמן לא מקוון (עד 12 שעות)
            if (passive > 0) {
                const now = Date.now();
                let msPassed = Math.min(now - lastSaveTime, 12 * 60 * 60 * 1000);
                const offlineEarnings = (msPassed / (1000 * 60 * 60)) * passive;
                
                if (offlineEarnings > 5) {
                    money += offlineEarnings;
                    totalEarned += offlineEarnings;
                    setTimeout(() => {
                        showMsg(`💰 ברוך השב! הרווחת ${Math.floor(offlineEarnings).toLocaleString()}₪ בזמן שישנת`, "var(--yellow)");
                    }, 2000);
                }
            }
        }
        
        // טעינת ערכת נושא
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.className = savedTheme + '-theme';
        
    } catch (e) { 
        console.error("שגיאה בטעינה:", e); 
        showMsg("שגיאה בטעינת נתונים", "var(--red)");
    }
}

function saveGame() {
    lastSaveTime = Date.now();
    const data = { 
        money, bank, loan, lifeXP, passive, energy, hunger,
        skills, cars, inventory, invOwned, carSpeed, 
        totalEarned, lastSaveTime 
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

// --- 3. מערכת הודעות (Global UI) ---
function showMsg(txt, color = "var(--blue)") {
    const bar = document.getElementById('status-bar');
    if (!bar) return;
    clearTimeout(msgTimer); 
    bar.innerText = txt;
    bar.style.opacity = "1";
    bar.style.transform = "translateY(0)";
    bar.style.color = color;
    bar.style.borderLeft = `4px solid ${color}`; // עיצוב מודרני יותר
    
    msgTimer = setTimeout(() => {
        bar.style.opacity = "0";
        bar.style.transform = "translateY(-10px)";
    }, 4000);
}

// --- 4. סנכרון ותצוגה ---
function updateUI() {
    const ld = getLevelData(lifeXP);
    
    // עדכון אלמנטים גלובליים ב-Header
    const mEl = document.getElementById('top-money');
    const bEl = document.getElementById('top-bank');
    const lEl = document.getElementById('life-level-ui');

    if(mEl) mEl.innerText = Math.floor(money).toLocaleString() + " ₪";
    if(bEl) bEl.innerText = Math.floor(bank).toLocaleString() + " ₪";
    if(lEl) lEl.innerText = ld.level;

    // שליחה ל-ui.js לרינדור הטאב הפעיל
    if (typeof window.renderUIUpdate === 'function') {
        window.renderUIUpdate(ld);
    }
    
    checkLevelUp(ld.level);
}

function checkLevelUp(currentLevel) {
    if (currentLevel > lastKnownLevel) {
        const bonus = currentLevel * 1250;
        money += bonus;
        showMsg(`🎉 רמה ${currentLevel}! קיבלת בונוס של ${bonus.toLocaleString()}₪ 🎉`, "var(--green)");
        lastKnownLevel = currentLevel;
        saveGame();
    }
}

// --- 5. מנועי זמן (Timers) ---
// מנוע הכנסה פסיבית + התאוששות
setInterval(() => {
    // הכנסה פסיבית
    if (passive > 0) {
        const tickIncome = passive / 3600; // חישוב לפי שעה, מעדכן כל שנייה
        money += tickIncome;
        totalEarned += tickIncome;
    }

    // התאוששות אנרגיה ועליית רעב
    if (energy < 100) energy += 0.1;
    if (hunger < 100) hunger += 0.05;

    // עדכון UI מהיר רק למספרים
    const mDisplay = document.getElementById('top-money');
    if(mDisplay) mDisplay.innerText = Math.floor(money).toLocaleString() + " ₪";

}, 1000); 

// שמירה אוטומטית כל 30 שניות
setInterval(saveGame, 30000);

// --- 6. פונקציות עזר (Utilities) ---
function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    const next = isLight ? 'dark' : 'light';
    document.body.className = next + '-theme';
    localStorage.setItem('theme', next);
    showMsg(`עברת למצב ${next === 'light' ? 'יום' : 'לילה'}`);
}

function resetGame() {
    if (confirm("⚠️ אלכסיי, כל ההתקדמות שלך תימחק לצמיתות. האם אתה בטוח?")) {
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
