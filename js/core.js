/* Smart Money Pro - js/core.js - v6.0.6 - Master Core with Level Checks */

const VERSION = "6.0.6";
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
    const data = { 
        money, bank, loan, lifeXP, passive, lastGift, 
        skills, cars, inventory, invOwned, carSpeed, totalEarned 
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

// --- מערכת הודעות חכמה וצבעונית ---
function showMsg(txt, color = "var(--blue)") {
    const bar = document.getElementById('status-bar');
    if (!bar) return;

    clearTimeout(msgTimer); 
    
    // עיצוב הבר לפי הצבע שנבחר
    bar.innerText = txt;
    bar.style.opacity = "1";
    bar.style.transform = "translateY(0)";
    bar.style.color = color;
    bar.style.borderColor = color;
    // יצירת רקע שקוף מעט מהצבע שנבחר
    const bgColor = color.includes("var") ? `rgba(56, 189, 248, 0.15)` : color.replace(')', ', 0.15)');
    bar.style.backgroundColor = color.includes("--green") ? "rgba(34, 197, 94, 0.15)" : 
                               color.includes("--red") ? "rgba(239, 68, 68, 0.15)" : 
                               color.includes("--purple") ? "rgba(168, 85, 247, 0.15)" : bgColor;

    msgTimer = setTimeout(() => {
        bar.style.opacity = "0";
        bar.style.transform = "translateY(-5px)";
    }, 3500);
}

// בדיקת עליית רמה
function checkLevelUp() {
    const currentLevel = Math.floor(lifeXP / 5000) + 1;
    // נשלוף את הרמה שמוצגת כרגע ב-UI כדי להשוות
    const displayedLevel = parseInt(document.getElementById('life-level-ui')?.innerText || "1");
    
    if (currentLevel > displayedLevel) {
        showMsg(`🎊 מזל טוב! עלית לרמת חיים ${currentLevel}! 🎊`, "var(--purple)");
        // בונוס עליית רמה
        const bonus = currentLevel * 500;
        money += bonus;
        updateUI();
    }
}

// --- עדכון ממשק משתמש (UI) ---

function updateUI() {
    const mEl = document.getElementById('money');
    const bEl = document.getElementById('bank');
    const lEl = document.getElementById('life-level-ui');
    
    if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    if(bEl) bEl.innerText = Math.floor(bank).toLocaleString();
    
    const level = Math.floor(lifeXP / 5000) + 1;
    if(lEl) lEl.innerText = level;

    // בדיקה אוטומטית אם עלינו רמה בעקבות העדכון
    checkLevelUp();
}

// --- פונקציות מערכת ---

function toggleTheme() {
    const current = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    
    document.body.className = next + '-theme';
    localStorage.setItem('theme', next);
    showMsg(`עברת למצב ${next === 'light' ? 'יום' : 'לילה'}`, "var(--blue)");
}

function forceUpdate() {
    showMsg("מרענן נתונים וגרסה...", "var(--yellow)");
    saveGame();
    setTimeout(() => {
        location.reload(true); 
    }, 500);
}

function resetGame() {
    if (confirm("⚠️ אזהרה: כל ההתקדמות שלך תימחק. לאפס?")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

// --- מנועי זמן (Loops) ---

// 1. מנוע הכנסה פסיבית - עדכון ויזואלי מהיר (10 פעמים בשנייה)
setInterval(() => {
    if (passive > 0) {
        const incomeTick = passive / 36000; 
        money += incomeTick;
        totalEarned += incomeTick;
        
        // עדכון מהיר של התצוגה בלי לרענן את כל ה-UI
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    }
}, 100);

// 2. שמירה אוטומטית כל 15 שניות
setInterval(saveGame, 15000);

// --- אתחול ---
document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
    console.log(`Smart Money Pro v${VERSION} Ready.`);
});
