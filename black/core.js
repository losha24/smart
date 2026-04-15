/* Smart Money Pro - js/core.js - v8.1.0 - Optimized & Fixed */

const VERSION = "8.1.0";
const SAVE_KEY = "smartMoneySave_v8_main";

// --- אתחול משתנים גלובליים ---
window.money = 1200;
window.blackMoney = 0;
window.bank = 0;
window.loan = 0;
window.lifeXP = 0;
window.passive = 0; 
window.jobPassive = 0; 
window.lastGift = 0;
window.skills = [];
window.cars = [];
window.inventory = [];
window.invOwned = { AAPL:0, TSLA:0, NVDA:0, BTC:0, MSFT:0, AMZN:0, ELAL:0, BEZQ:0, TEVA:0, ICL:0, NICE:0, CHKP:0 };
window.staffData = {};
window.invBuyPrice = {};
window.carSpeed = 1;
window.itemLevels = {};
window.carLevels = {};
window.totalEarned = 0;
window.lastSaveTime = Date.now();
window.lastKnownLevel = 0;
window.estateData = {};
window.eventLosses = 0;

// משתני שוק שחור
window.crimeLevel = 0;
window.policeHeat = 0;
window.gang = null;
window.activeShipments = [];

if (!localStorage.getItem("deviceID")) {
    localStorage.setItem("deviceID", 'dev_' + Math.random().toString(36).substr(2, 12));
}
window.deviceID = localStorage.getItem("deviceID");
window.playerName = localStorage.getItem("playerName") || "";

let msgTimer;

// --- פונקציות עזר ---
function createHash(data) {
    let str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

function getLevelData(xp) {
    let level = 1, xpForNext = 1000, totalXPStack = 0;
    while (xp >= totalXPStack + xpForNext) {
        totalXPStack += xpForNext;
        level++;
        xpForNext = Math.floor(xpForNext * 1.25);
    }
    let xpInCurrentLevel = xp - totalXPStack;
    let progressPercent = (xpInCurrentLevel / xpForNext) * 100;
    return { level, xpInCurrentLevel, xpForNext, progressPercent };
}

// --- הודעות מערכת (גרסה מאוחדת ותקינה) ---
function showMsg(txt, color = "var(--blue)") {
    const bar = document.getElementById('status-bar');
    const statusText = document.getElementById('status-text');
    if (!bar) return;
    clearTimeout(msgTimer);
    
    if (statusText) statusText.innerText = txt;
    else bar.innerText = txt;

    bar.style.opacity = "1";
    bar.style.transform = "translateY(0)";
    bar.style.color = color;
    bar.style.borderColor = color;

    msgTimer = setTimeout(() => {
        bar.style.opacity = "0.8"; 
        if (statusText) statusText.innerText = ""; 
    }, 3500);
}

function showMsgLong(txt, color = "var(--blue)") {
    const bar = document.getElementById('status-bar');
    const statusText = document.getElementById('status-text');
    if (!bar) return;
    clearTimeout(msgTimer);

    if (statusText) statusText.innerText = txt;
    else bar.innerText = txt;

    bar.style.opacity = "1";
    bar.style.color = color;
    
    msgTimer = setTimeout(() => {
        bar.style.opacity = "0.8";
        if (statusText) statusText.innerText = ""; 
    }, 5000); 
}

// --- שמירה וטעינה ---
function loadGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
            const saveData = JSON.parse(saved);
            const checkHash = createHash(saveData.data || saveData);
            
            if (saveData.hash && checkHash !== saveData.hash) {
                console.warn("Hash mismatch - loading anyway for compatibility");
            }

            const data = saveData.data || saveData;
            window.playerName    = data.playerName    || window.playerName;
            window.money         = data.money         ?? 1200;
            window.bank          = data.bank          ?? 0;
            window.loan          = data.loan          ?? 0;
            window.lifeXP        = data.lifeXP        ?? 0;
            window.passive       = data.passive       ?? 0;
            window.jobPassive    = data.jobPassive    ?? 0;
            window.lastGift      = data.lastGift      ?? 0;
            window.skills        = data.skills        ?? [];
            window.cars          = data.cars          ?? [];
            window.inventory     = data.inventory     ?? [];
            window.invOwned      = data.invOwned      ?? window.invOwned;
            window.carSpeed      = data.carSpeed      ?? 1;
            window.totalEarned   = data.totalEarned   ?? 0;
            window.estateData    = data.estateData    || {};
            window.itemLevels    = data.itemLevels    ?? {};
            window.carLevels     = data.carLevels     ?? {};
            window.invBuyPrice   = data.invBuyPrice   ?? {};
            window.staffData     = data.staffData     ?? {};
            window.crimeLevel    = data.crimeLevel    ?? 0;
            window.policeHeat    = data.policeHeat    ?? 0;
            window.gang          = data.gang          || null;
            window.blackMoney    = data.blackMoney    ?? 0;
            window.activeShipments = data.activeShipments || [];

            window.lastKnownLevel = getLevelData(window.lifeXP).level;

            // חישוב רווח אופליין
            if (data.lastSaveTime && window.passive > 0) {
                const now = Date.now();
                const msPassed = Math.min(now - data.lastSaveTime, 12 * 60 * 60 * 1000);
                const offlineEarnings = (msPassed / 60000) * window.passive;
                if (offlineEarnings > 1) {
                    window.money += offlineEarnings;
                    window.totalEarned += offlineEarnings;
                    const offlineLosses = data.eventLosses || 0;
                    setTimeout(() => {
                        let msg = `💰 בזמן שלא היית: הרווחת ${Math.floor(offlineEarnings).toLocaleString()} ₪`;
                        if (offlineLosses > 0) msg += ` | ⚠️ והפסדת ${Math.floor(offlineLosses).toLocaleString()} ₪ מאירועים`;
                        showMsgLong(msg, 'var(--yellow)');
                    }, 2000);
                }
            }
        } else {
            window.lastKnownLevel = 1;
        }
        document.body.className = (localStorage.getItem('theme') || 'dark') + '-theme';
    } catch(e) { console.error('שגיאה בטעינה:', e); }
}

function saveGame() {
    window.lastSaveTime = Date.now();
    const data = {
        playerName: window.playerName,
        jobPassive: window.jobPassive,
        money: window.money,
        bank: window.bank,
        loan: window.loan,
        lifeXP: window.lifeXP,
        passive: window.passive,
        lastGift: window.lastGift,
        skills: window.skills,
        cars: window.cars,
        inventory: window.inventory,
        invOwned: window.invOwned,
        carSpeed: window.carSpeed,
        totalEarned: window.totalEarned,
        lastSaveTime: window.lastSaveTime,
        estateData: window.estateData,
        itemLevels: window.itemLevels,
        carLevels: window.carLevels,
        invBuyPrice: window.invBuyPrice,
        staffData: window.staffData,
        eventLosses: window.eventLosses || 0,
        crimeLevel: window.crimeLevel || 0,
        policeHeat: window.policeHeat || 0,
        gang: window.gang || null,
        blackMoney: window.blackMoney || 0,
        activeShipments: window.activeShipments || []
    };

    const savePack = { data: data, hash: createHash(data) };
    localStorage.setItem(SAVE_KEY, JSON.stringify(savePack));
    console.log("Game Saved Successfully!");
}

// --- עדכון UI ---
function updateUI() {
    if (window.money > 2000000000) window.money = 1000000; // הגנת צ'יטים בסיסית
    const mEl = document.getElementById('money');
    const bEl = document.getElementById('bank');
    const lEl = document.getElementById('life-level-ui');
    
    if (mEl) mEl.innerText = Math.floor(window.money).toLocaleString();
    if (bEl) bEl.innerText = Math.floor(window.bank).toLocaleString();
    
    const ld = getLevelData(window.lifeXP);
    if (lEl) lEl.innerText = ld.level;
    
    if (typeof window.renderUIUpdate === 'function') window.renderUIUpdate(ld);
    checkLevelUp(ld.level);
}

function checkLevelUp(currentLevel) {
    if (currentLevel > window.lastKnownLevel && window.lastKnownLevel > 0) {
        const bonus = currentLevel * 1000;
        window.money += bonus;
        showMsg(`🎊 מזל טוב! עלית לרמה ${currentLevel}! קיבלת ${bonus.toLocaleString()}₪!`, 'var(--purple)');
        window.lastKnownLevel = currentLevel;
        updateUI();
    }
}

function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    const next = isLight ? 'dark' : 'light';
    document.body.className = next + '-theme';
    localStorage.setItem('theme', next);
    showMsg(`עברת למצב ${next === 'light' ? 'יום' : 'לילה'}`, 'var(--blue)');
}

// --- טיימרים ---
setInterval(() => {
    if (window.passive > 0) {
        const tick = window.passive / 1200;
        window.money += tick;
        window.totalEarned += tick;
        const mEl = document.getElementById('money');
        if (mEl) mEl.innerText = Math.floor(window.money).toLocaleString();
    }
}, 50);

setInterval(() => {
    if (typeof window.renderUIUpdate === 'function') {
        window.renderUIUpdate(getLevelData(window.lifeXP));
    }
}, 1000);

setInterval(saveGame, 15000);

// --- ניהול שם ואירועים ---
function savePlayerName() {
    const input = document.getElementById("player-name-input");
    const name = input.value.trim();
    if (name.length < 2) { alert("הכנס שם שחקן"); return; }
    localStorage.setItem("playerName", name);
    window.playerName = name;
    if (document.getElementById("player-start")) document.getElementById("player-start").style.display = "none";
    showMsg(`ברוך הבא ${name} 🚀`);
    saveGame();
}

window.nextEventTime = parseInt(localStorage.getItem('nextEventTime')) || 60; 

function startEventTimer() {
    setInterval(() => {
        window.nextEventTime--;
        localStorage.setItem('nextEventTime', window.nextEventTime);
        let timerEl = document.getElementById('event-timer');
        if (timerEl) {
            let mins = Math.floor(window.nextEventTime / 60);
            let secs = window.nextEventTime % 60;
            timerEl.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }

        if (window.nextEventTime <= 0) {
            if (Math.random() < 0.50 && typeof window.triggerRandomEvent === 'function') {
                window.triggerRandomEvent();
            }
            window.nextEventTime = 60;
            localStorage.setItem('nextEventTime', 60);
        }
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("playerName")) {
        if (document.getElementById("player-start")) document.getElementById("player-start").style.display = "flex";
    }
    loadGame();
    updateUI();
    startEventTimer();
});
