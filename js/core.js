/* Smart Money Pro - js/core.js - v6.0.9 - Fast Speed Update */

const VERSION = "6.0.9";
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
        }
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.className = savedTheme + '-theme';
    } catch (e) { 
        console.error("שגיאה בטעינת נתונים:", e); 
    }
}

function saveGame() {
    const data = { money, bank, loan, lifeXP, passive, lastGift, skills, cars, inventory, invOwned, carSpeed, totalEarned };
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

    // עדכון ערכים בבר העליון
    if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    if(bEl) bEl.innerText = Math.floor(bank).toLocaleString();
    
    // חישוב רמה (כל 5000 XP עולים רמה)
    const currentLevel = Math.floor(lifeXP / 5000) + 1;
    if(lEl) lEl.innerText = currentLevel;

    // קריאה לפונקציית הרינדור ב-UI אם קיימת (לשוניות וכד')
    if (typeof window.renderUIUpdate === 'function') window.renderUIUpdate();
    
    // בדיקת עליית רמה
    checkLevelUp();
}

function checkLevelUp() {
    const currentLevel = Math.floor(lifeXP / 5000) + 1;
    const displayedLevel = parseInt(document.getElementById('life-level-ui')?.innerText || "1");
    if (currentLevel > displayedLevel) {
        showMsg(`🎊 מזל טוב! עלית לרמה ${currentLevel}! 🎊`, "var(--purple)");
        money += currentLevel * 500; // בונוס כספי על עליית רמה
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
    showMsg("מרענן נתונים...", "var(--yellow)");
    saveGame();
    setTimeout(() => { location.reload(true); }, 500);
}

function resetGame() {
    if (confirm("⚠️ אזהרה: כל ההתקדמות תימחק לצמיתות. האם אתה בטוח?")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

// --- מנועי זמן (Loops) ---

// מנוע הכנסה פסיבית - רץ 10 פעמים בשנייה לעדכון חלק
setInterval(() => {
    if (passive > 0) {
        // --- שורה 109: שיניתי מ-36000 ל-3600 כדי להאיץ את הקצב פי 10 ---
        const tickIncome = passive / 3600; 
        money += tickIncome;
        totalEarned += tickIncome;
        
        // עדכון ויזואלי מהיר של הכסף בלבד (ביצועים)
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    }
}, 100);

// שמירה אוטומטית כל 15 שניות
setInterval(saveGame, 15000);

// --- אתחול המערכת ---
document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
    console.log(`Smart Money Pro v${VERSION} Engine Loaded.`);
});
