/* Smart Money Pro - core.js - v7.0.0 FULL */
let money = 1500;
let bank = 0;
let lifeXP = 0;
let passive = 0;
let carSpeed = 1;
let inventory = [];
let lastSaveTime = Date.now();
let lastDailyGift = 0;

// מנוע עדכון (זרימת כסף פסיבית)
setInterval(() => {
    if (passive > 0) {
        money += (passive / 72000); 
    }
    updateUI();
}, 50);

function updateUI() {
    const ld = getLevelData(lifeXP);
    const elements = {
        'money': Math.floor(money).toLocaleString(),
        'bank': Math.floor(bank).toLocaleString(),
        'level-num': ld.level,
        'passive-val': Math.floor(passive).toLocaleString(),
        'home-money-display': "₪" + Math.floor(money).toLocaleString()
    };

    for (let id in elements) {
        let el = document.getElementById(id);
        if (el) el.innerText = elements[id];
    }

    let xpb = document.getElementById('xp-progress-bar');
    if (xpb) xpb.style.width = ld.progressPercent + "%";
}

function getLevelData(xp) {
    let level = Math.floor(Math.sqrt(xp / 100)) + 1;
    let nextXP = Math.pow(level, 2) * 100;
    let prevXP = Math.pow(level - 1, 2) * 100;
    let progress = ((xp - prevXP) / (nextXP - prevXP)) * 100;
    return { level, progressPercent: progress };
}

function saveGame() {
    lastSaveTime = Date.now();
    const data = { money, bank, lifeXP, passive, carSpeed, inventory, lastSaveTime, lastDailyGift };
    localStorage.setItem('smartMoneySave', JSON.stringify(data));
}

function loadGame() {
    const saved = localStorage.getItem('smartMoneySave');
    if (saved) {
        const d = JSON.parse(saved);
        money = d.money || 1500;
        bank = d.bank || 0;
        lifeXP = d.lifeXP || 0;
        passive = d.passive || 0;
        carSpeed = d.carSpeed || 1;
        inventory = d.inventory || [];
        lastSaveTime = d.lastSaveTime || Date.now();
        lastDailyGift = d.lastDailyGift || 0;
        
        // חישוב רווח אופליין
        let diffHours = (Date.now() - lastSaveTime) / 3600000;
        if (diffHours > 0.01 && passive > 0) {
            let earnings = Math.min(diffHours, 24) * passive;
            money += earnings;
            setTimeout(() => showMsg(`בזמן שישנת: +₪${Math.floor(earnings).toLocaleString()}`, "var(--green)"), 1500);
        }
    }
}

function showMsg(txt, color) {
    const msg = document.getElementById('msg');
    if (!msg) return;
    msg.innerText = txt;
    msg.style.background = color;
    msg.style.bottom = "20px";
    setTimeout(() => { msg.style.bottom = "-100px"; }, 3000);
}

// מערכת התקנה PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.getElementById('install-btn');
    if (btn) btn.style.display = 'block';
});

function handleInstall() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
            document.getElementById('install-btn').style.display = 'none';
        });
    }
}
