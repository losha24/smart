/* Smart Money Pro - core.js - v6.5.2 TURBO FINAL */
let money = 1500;
let bank = 0;
let lifeXP = 0;
let passive = 0;
let carSpeed = 1;
let inventory = [];
let lastSaveTime = Date.now(); // שמירת זמן היציאה

// מנוע טורבו - מעדכן 20 פעם בשנייה (כל 50ms)
setInterval(() => {
    if (passive > 0) {
        // הוספת הכנסה פסיבית בכל טיק (חלקי 72,000 כדי להגיע לשעה)
        money += (passive / 72000);
    }
    updateUI();
}, 50);

function updateUI() {
    const ids = {
        'money': Math.floor(money).toLocaleString(),
        'bank': Math.floor(bank).toLocaleString(),
        'level-display': getLevelData(lifeXP).level,
        'home-money-display': "₪" + Math.floor(money).toLocaleString()
    };

    for (let id in ids) {
        let el = document.getElementById(id);
        if (el) el.innerText = ids[id];
    }

    let ld = getLevelData(lifeXP);
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

function showMsg(txt, color = "var(--blue)") {
    const sb = document.getElementById('status-bar');
    if (sb) {
        sb.innerText = txt;
        sb.style.color = color;
        sb.style.opacity = "1";
        setTimeout(() => sb.style.opacity = "0", 3000);
    }
}

// מערכת הכנסה במצב אופליין (עד 24 שעות)
function calculateOfflineEarnings() {
    if (passive <= 0) return;

    let now = Date.now();
    let diffMs = now - lastSaveTime; // כמה זמן עבר במילי-שניות
    let diffSec = diffMs / 1000;
    let diffHours = diffSec / 3600;

    // מגבלה ל-24 שעות מקסימום
    if (diffHours > 24) diffHours = 24;

    if (diffHours > 0.01) { // רק אם עבר יותר מחצי דקה בערך
        let earnings = diffHours * passive;
        money += earnings;
        
        // נציג הודעה למשתמש כשנכנסים
        setTimeout(() => {
            showMsg(`בזמן שלא היית, העסקים הניבו: ₪${Math.floor(earnings).toLocaleString()}`, "var(--green)");
        }, 1500);
    }
}

function saveGame() {
    lastSaveTime = Date.now(); // עדכון זמן השמירה האחרון
    const data = { 
        money, bank, lifeXP, passive, carSpeed, inventory, lastSaveTime 
    };
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
        
        // חישוב הכסף שנצבר בזמן שהיית בחוץ
        calculateOfflineEarnings();
    }
}

function resetGame() {
    if (confirm("אלכסיי, למחוק את כל הנתונים ולהתחיל מחדש?")) {
        localStorage.clear();
        location.reload();
    }
}

// שמירה אוטומטית כל 30 שניות כדי שלא יאבד כסף
setInterval(saveGame, 30000);
