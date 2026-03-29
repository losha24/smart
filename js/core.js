/* Smart Money Pro - js/core.js - v6.0.3 - Fixed Update & Theme Logic */

const VERSION = "6.0.3";
// שימוש במפתח קבוע לסדרה 6 כדי שעדכוני גרסה לא ימחקו שמירות
const SAVE_KEY = "smartMoneySave_v6_main";

// משתנים גלובליים
let money = 1000;
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

let msgTimer; 

function loadGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            money = data.money ?? 1000;
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
        }
        
        // טעינת ערכת נושא שמורה (יום/לילה)
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.getElementById('app-body').classList.replace('dark-theme', 'light-theme');
        }
    } catch (e) { 
        console.error("Load failed", e); 
    }
}

function saveGame() {
    const data = { 
        money, bank, loan, lifeXP, passive, lastGift, 
        skills, cars, inventory, invOwned, carSpeed, totalEarned 
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function updateUI() {
    const mEl = document.getElementById('money');
    const bEl = document.getElementById('bank');
    const lEl = document.getElementById('life-level-ui');
    
    if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    if(bEl) bEl.innerText = Math.floor(bank).toLocaleString();
    
    const level = Math.floor(lifeXP / 5000) + 1;
    if(lEl) lEl.innerText = level;
    
    // עדכון פס XP בדף הבית אם הוא קיים
    const progress = ((lifeXP % 5000) / 5000) * 100;
    const xpBar = document.querySelector('.xp-bar');
    if(xpBar) xpBar.style.width = progress + "%";
}

function showMsg(txt, color = "white") {
    const bar = document.getElementById('status-bar');
    if (!bar) return;

    clearTimeout(msgTimer); 
    bar.innerText = txt;
    bar.style.color = color;
    bar.style.opacity = (txt === "") ? "0" : "1";

    if (txt !== "") {
        msgTimer = setTimeout(() => {
            bar.style.opacity = "0";
            setTimeout(() => { bar.innerText = ""; }, 300); 
        }, 3000);
    }
}

// לוגיקת החלפת מצב יום/לילה
function toggleTheme() {
    const body = document.getElementById('app-body');
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.replace('dark-theme', 'light-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.replace('light-theme', 'dark-theme');
        localStorage.setItem('theme', 'dark');
    }
}

// רענון גרסה "קשיח" ללא איפוס נתונים
function forceUpdate() {
    showMsg("מרענן גרסה...", "var(--blue)");
    saveGame(); // שומר לפני הרענון ליתר ביטחון
    setTimeout(() => {
        location.reload(true); 
    }, 800);
}

// איפוס משחק (עם אישור)
function resetGame() {
    if (confirm("האם אתה בטוח? כל הכסף וההתקדמות יימחקו לצמיתות!")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

// מנוע הכנסה פסיבית - עדכון כל 100 מילי-שנייה
setInterval(() => {
    if (passive > 0) {
        const incomeTick = passive / 36000;
        money += incomeTick;
        totalEarned += incomeTick;
        
        // עדכון UI מהיר לכסף
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    }
}, 100);

// שמירה אוטומטית כל 10 שניות
setInterval(saveGame, 10000);

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
});
