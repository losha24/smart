/* Smart Money Pro - js/core.js - v6.4.0 - Business Integration */

const VERSION = "6.4.0";
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
// הוספת מערך עסקים: שומר את ה-ID של העסק והרמה שלו
let businesses = []; 
let carSpeed = 1;
let totalEarned = 0;
let lastSaveTime = Date.now();
let currentTab = 'home'; // למעקב אחרי הלשונית הפעילה

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
            businesses = data.businesses ?? []; // טעינת עסקים
            carSpeed = data.carSpeed ?? 1;
            totalEarned = data.totalEarned ?? 0;
            
            // חישוב הכנסה לא מקוונת
            if (data.lastSaveTime && passive > 0) {
                const now = Date.now();
                let msPassed = now - data.lastSaveTime;
                const maxMS = 12 * 60 * 60 * 1000;
                if (msPassed > maxMS) msPassed = maxMS;
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
        }
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.className = savedTheme + '-theme';
    } catch (e) { console.error("שגיאה בטעינה:", e); }
}

function saveGame() {
    lastSaveTime = Date.now();
    const data = { 
        money, bank, loan, lifeXP, passive, lastGift, 
        skills, cars, inventory, invOwned, businesses, // שמירת עסקים
        carSpeed, totalEarned, lastSaveTime 
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
    if(lEl) lEl.innerText = currentLevel;

    if (typeof window.renderUIUpdate === 'function') window.renderUIUpdate();
    checkLevelUp();
}

function checkLevelUp() {
    const currentLevel = Math.floor(lifeXP / 1000) + 1;
    const levelDisplay = document.getElementById('life-level-ui');
    const displayedLevel = parseInt(levelDisplay?.innerText || "1");
    if (currentLevel > displayedLevel) {
        showMsg(`🎊 מזל טוב! עלית לרמה ${currentLevel}! 🎊`, "var(--purple)");
        money += currentLevel * 1000; 
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
    showMsg("מרענן נתונים...", "var(--yellow)");
    saveGame();
    setTimeout(() => { location.reload(true); }, 500);
}

function resetGame() {
    if (confirm("⚠️ אזהרה: הכל יימחק. האם אתה בטוח?")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

// --- מנועי זמן (Loops) ---
setInterval(() => {
    if (passive > 0) {
        const tickIncome = passive / 720; 
        money += tickIncome;
        totalEarned += tickIncome;
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    }
}, 50); 

setInterval(saveGame, 15000);

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
});
