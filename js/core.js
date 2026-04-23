/* Smart Money Pro - js/core.js - v9.1.0 - Clean (No Stocks) */

const VERSION = "9.1.0";
const SAVE_KEY = "smartMoneySave_v8_main";

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
window.staffData = {};
window.carSpeed = 1;
window.itemLevels = {};
window.carLevels = {};
window.totalEarned = 0;
window.lastSaveTime = Date.now();
window.lastKnownLevel = 0;
window.estateData = {};
window.eventLosses = 0;
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
    return { level, xpInCurrentLevel: xp - totalXPStack, xpForNext, progressPercent: ((xp - totalXPStack) / xpForNext) * 100 };
}

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

function loadGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
            const saveData = JSON.parse(saved);
            const data = saveData.data || saveData;
            window.playerName      = data.playerName      || window.playerName;
            window.money           = data.money           ?? 1200;
            window.bank            = data.bank            ?? 0;
            window.loan            = data.loan            ?? 0;
            window.lifeXP          = data.lifeXP          ?? 0;
            window.passive         = data.passive         ?? 0;
            window.jobPassive      = data.jobPassive      ?? 0;
            window.lastGift        = data.lastGift        ?? 0;
            window.skills          = data.skills          ?? [];
            window.cars            = data.cars            ?? [];
            window.inventory       = data.inventory       ?? [];
            window.carSpeed        = data.carSpeed        ?? 1;
            window.totalEarned     = data.totalEarned     ?? 0;
            window.estateData      = data.estateData      || {};
            window.itemLevels      = data.itemLevels      ?? {};
            window.carLevels       = data.carLevels       ?? {};
            window.staffData       = data.staffData       ?? {};
            window.crimeLevel      = data.crimeLevel      ?? 0;
            window.policeHeat      = data.policeHeat      ?? 0;
            window.gang            = data.gang            || null;
            window.blackMoney      = data.blackMoney      ?? 0;
            window.activeShipments = data.activeShipments || [];
            window.lastKnownLevel  = getLevelData(window.lifeXP).level;

            if (data.lastSaveTime && window.passive > 0) {
                const now = Date.now();
                const msPassed = Math.min(now - data.lastSaveTime, 12 * 60 * 60 * 1000);
                const offlineEarnings = (msPassed / 60000) * window.passive;

if (offlineEarnings > 1) {
    // בדיקה: האם הוספת הרווח תעבור את המיליארד?
    if (window.money + offlineEarnings > 1000000000) {
        window.money = 1000000000; // עוצר בדיוק במיליארד
        showMsgLong("💰 הגעת לתקרת המזומן המקסימלית (מיליארד ₪)!", 'var(--red)');
    } else {
        window.money += offlineEarnings;
    }
    
    window.totalEarned += offlineEarnings;
    
    // שאר הקוד של הלוגים והפסדים...
    const offlineLosses = data.eventLosses || 0;
    setTimeout(() => {
        if (typeof showMsgLong === 'function' && window.money < 1000000000) {
            let msg = `💰 בזמן שלא היית: הרווחת ${Math.floor(offlineEarnings).toLocaleString()} ₪`;
            if (offlineLosses > 0) msg += ` | ⚠️ והפסדת ${Math.floor(offlineLosses).toLocaleString()} ₪ מאירועים`;
            showMsgLong(msg, 'var(--yellow)');
        }
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
        playerName:      window.playerName,
        money:           window.money,
        bank:            window.bank,
        loan:            window.loan,
        lifeXP:          window.lifeXP,
        passive:         window.passive,
        jobPassive:      window.jobPassive,
        lastGift:        window.lastGift,
        skills:          window.skills,
        cars:            window.cars,
        inventory:       window.inventory,
        carSpeed:        window.carSpeed,
        totalEarned:     window.totalEarned,
        lastSaveTime:    window.lastSaveTime,
        estateData:      window.estateData,
        itemLevels:      window.itemLevels,
        carLevels:       window.carLevels,
        staffData:       window.staffData,
        eventLosses:     window.eventLosses  || 0,
        crimeLevel:      window.crimeLevel   || 0,
        policeHeat:      window.policeHeat   || 0,
        gang:            window.gang         || null,
        blackMoney:      window.blackMoney   || 0,
        activeShipments: window.activeShipments || []
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify({ data, hash: createHash(data) }));
}

function updateUI() {
    if (window.money > 1000000000) window.money = 1000000000;
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
        showMsg('🎊 מזל טוב! עלית לרמה ' + currentLevel + '! קיבלת ' + bonus.toLocaleString() + '₪!', 'var(--purple)');
        window.lastKnownLevel = currentLevel;
        updateUI();
    }
}

function toggleTheme() {
    const isLight = document.body.classList.contains('light-theme');
    const next = isLight ? 'dark' : 'light';
    document.body.className = next + '-theme';
    localStorage.setItem('theme', next);
    showMsg('עברת למצב ' + (next === 'light' ? 'יום' : 'לילה'), 'var(--blue)');
}

function savePlayerName() {
    const input = document.getElementById("player-name-input");
    const name = input.value.trim();
    if (name.length < 2) { alert("הכנס שם שחקן"); return; }
    localStorage.setItem("playerName", name);
    window.playerName = name;
    const el = document.getElementById("player-start");
    if (el) el.style.display = "none";
    showMsg("ברוך הבא " + name + " 🚀");
    saveGame();
}

// Passive income tick - תיקון קטן למניעת חריגה בזמן אמת
setInterval(() => {
    if (window.passive > 0 && window.money < 1000000000) { // הוספתי בדיקת מקסימום
        const tick = window.passive / 1200;
        window.money = Math.min(1000000000, window.money + tick); // מוודא שלא עובר מיליארד
        window.totalEarned += tick;
        const mEl = document.getElementById('money');
        if (mEl) mEl.innerText = Math.floor(window.money).toLocaleString();
    }
}, 50);


// UI update every second
setInterval(() => {
    if (typeof window.renderUIUpdate === 'function') {
        window.renderUIUpdate(getLevelData(window.lifeXP));
    }
}, 1000);

// Auto save every 15 seconds
setInterval(saveGame, 15000);

// Event timer
window.nextEventTime = parseInt(localStorage.getItem('nextEventTime')) || 60;

function startEventTimer() {
    setInterval(() => {
        window.nextEventTime--;
        localStorage.setItem('nextEventTime', window.nextEventTime);
        const timerEl = document.getElementById('event-timer');
        if (timerEl) {
            const mins = Math.floor(window.nextEventTime / 60);
            const secs = window.nextEventTime % 60;
            timerEl.innerText = mins + ':' + (secs < 10 ? '0' : '') + secs;
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
        const el = document.getElementById("player-start");
        if (el) el.style.display = "flex";
    }
    loadGame();
    updateUI();
    startEventTimer();
});
