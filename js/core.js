let money = 1500;
let bank = 0;
let lifeXP = 0;
let passive = 0;
let carSpeed = 1;
let inventory = [];
let lastSaveTime = Date.now();
let lastDailyGift = 0;

// עדכון בזמן אמת (20 פעמים בשנייה)
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
        'passive-val': Math.floor(passive).toLocaleString(),
        'level-num': ld.level,
        'xp-detail': `${Math.floor(lifeXP).toLocaleString()} / ${ld.nextXP.toLocaleString()} XP`
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
    return { level, nextXP, progressPercent: progress };
}

function calculateOffline() {
    const now = Date.now();
    const diffSeconds = (now - lastSaveTime) / 1000;
    // אם עברו יותר מ-10 שניות, חשב רווח אופליין (עד 24 שעות מקסימום)
    if (diffSeconds > 10 && passive > 0) {
        const hours = Math.min(diffSeconds / 3600, 24);
        const earned = hours * passive;
        money += earned;
        if(earned > 1) {
            setTimeout(() => showMsg(`רווח אופליין: +₪${Math.floor(earned).toLocaleString()}`, "var(--green)"), 1000);
        }
    }
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
        calculateOffline();
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

setInterval(saveGame, 30000);
