/* Smart Money Pro - js/core.js - v6.2.2 - Anti-Cheat Leveling & Sync */

const VERSION = "6.2.2";
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
let lastKnownLevel = 0; // משתנה למניעת בונוס כפול ברענון

let msgTimer; 

// --- ניהול זיכרון ושמירה ---
function loadGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            
            // טעינת נתונים עם ערכי ברירת מחדל למקרה שחסר
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
            
            // הגדרת הרמה הנוכחית מיד עם הטעינה כדי למנוע "קפיצה" מזויפת בבונוס
            lastKnownLevel = Math.floor(lifeXP / 1000) + 1;
            
            // חישוב הכנסה לא מקוונת (Offline Income)
            if (data.lastSaveTime && passive > 0) {
                const now = Date.now();
                let msPassed = Math.min(now - data.lastSaveTime, 12 * 60 * 60 * 1000); // הגבלה ל-12 שעות
                const hoursPassed = msPassed / (1000 * 60 * 60);
                const offlineEarnings = hoursPassed * passive;
                
                if (offlineEarnings > 1) {
                    money += offlineEarnings;
                    totalEarned += offlineEarnings;
                    setTimeout(() => {
                        showMsg(`💰 הרווחת ${Math.floor(offlineEarnings).toLocaleString()}₪ בזמן שלא היית!`, "var(--yellow)");
                    }, 1500);
                }
            }
        } else {
            lastKnownLevel = 1; // שחקן חדש מתחיל מרמה 1
        }
        
        // טעינת עיצוב (Theme)
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.className = savedTheme + '-theme';
        
    } catch (e) { 
        console.error("שגיאה בטעינת נתונים:", e); 
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

// --- מערכת הודעות וסטטוס ---
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
    
    const currentLevel = Math.floor(lifeXP / 1000) + 1;
    
    // קודם כל מעדכנים את ה-UI עם הרמה האמיתית
    if(lEl) lEl.innerText = currentLevel;

    // קריאה לפונקציית הרינדור ב-UI.js
    if (typeof window.renderUIUpdate === 'function') window.renderUIUpdate();
    
    // בודקים אם מגיע בונוס על עליית רמה
    checkLevelUp();
}

function checkLevelUp() {
    const currentLevel = Math.floor(lifeXP / 1000) + 1;

    // אם הרמה הנוכחית גבוהה מהרמה האחרונה שזיהינו (ורשמנו ב-lastKnownLevel)
    if (currentLevel > lastKnownLevel && lastKnownLevel > 0) {
        const bonus = currentLevel * 1000;
        money += bonus;
        showMsg(`🎊 מזל טוב! עלית לרמה ${currentLevel}! קיבלת בונוס של ${bonus.toLocaleString()}₪ 🎊`, "var(--purple)");
        lastKnownLevel = currentLevel;
        updateUI();
    }
}

// --- שליטה בהגדרות ---
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
    if (confirm("⚠️ אזהרה: כל ההתקדמות תימחק לצמיתות. האם אתה בטוח?")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

// --- מנועי זמן (Loops) ---

// מנוע הכנסה פסיבית (מתעדכן כל 50ms)
setInterval(() => {
    if (passive > 0) {
        const tickIncome = passive / 72000; // חלוקת ההכנסה השעתית לטיקים של 50ms
        money += tickIncome;
        totalEarned += tickIncome;
        
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();

        if (typeof window.renderUIUpdate === 'function') {
            window.renderUIUpdate();
        }
    }
}, 50); 

// שמירה אוטומטית כל 15 שניות
setInterval(saveGame, 15000);

// אתחול המשחק בטעינת הדף
document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
    console.log(`Smart Money Engine v${VERSION} Loaded & Synced.`);
});
