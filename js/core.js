/* Smart Money Pro - js/core.js - v6.2.6 - Full Core Logic */

const VERSION = "6.2.6";
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
// הוספתי כאן את כל רשימת המניות כדי שהשמירה תזהה אותן
let invOwned = { AAPL:0, TSLA:0, NVDA:0, BTC:0, GOOG:0, AMZN:0, MSFT:0, NFLX:0, META:0, ELAL:0 };
let carSpeed = 1;
let totalEarned = 0;
let lastSaveTime = Date.now();
let currentTab = 'home'; 

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
                        showMsg(`💰 בזמן שלא היית, הרווחת: ${Math.floor(offlineEarnings).toLocaleString()}₪!`, "var(--yellow)");
                    }, 1500);
                }
            }
        }
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.className = savedTheme + '-theme';
    } catch (e) { console.error("Error loading:", e); }
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

// --- עדכון UI ושלבים ---
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
        showMsg(`🎊 רמה ${currentLevel}! קיבלת בונוס! 🎊`, "var(--purple)");
        money += currentLevel * 1000; 
        updateUI();
    }
}

// --- פונקציות מערכת (אלו השורות שחזרו) ---
function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    const next = isLight ? 'dark' : 'light';
    document.body.className = next + '-theme';
    localStorage.setItem('theme', next);
    showMsg(`עברת למצב ${next === 'light' ? 'יום' : 'לילה'}`);
}

function resetGame() {
    if (confirm("⚠️ למחוק את כל ההתקדמות ולהתחיל מחדש?")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

function forceUpdate() {
    saveGame();
    showMsg("שומר ומרענן...", "var(--yellow)");
    setTimeout(() => { location.reload(true); }, 500);
}

// --- לופים של זמן ---
setInterval(() => {
    if (passive > 0) {
        const tick = passive / 720; 
        money += tick;
        totalEarned += tick;
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    }
}, 50); 

setInterval(saveGame, 15000);

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
    console.log(`Smart Money Pro v${VERSION} Engine Loaded.`);
});
