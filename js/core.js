/* Smart Money Pro - js/core.js - v6.5.1 
   THE ULTIMATE CORE ENGINE - ALL SYSTEMS NOMINAL
*/

// --- 1. קבועים והגדרות מערכת ---
const VERSION = "6.5.1";
const SAVE_KEY = "smartMoneySave_v6_main";
const TICK_RATE = 50; // מילישניות (20 פעמים בשנייה)

// --- 2. מצב המשחק (Global State) ---
let money = 1500;        // כסף התחלתי מוגדל מעט
let bank = 0;
let loan = 0;
let lifeXP = 0;
let passive = 0;        // הכנסה לשעה
let lastGift = 0;       // חותמת זמן למתנה יומית
let lastSaveTime = Date.now();

// מערכים ואובייקטים של המשתמש
let skills = [];
let cars = [];
let inventory = [];
let invOwned = { 
    AAPL: 0, TSLA: 0, NVDA: 0, BTC: 0, ELAL: 0 
};

// בונוסים וסטטיסטיקה
let carSpeed = 1;       // מכפיל מהירות עבודה
let totalEarned = 0;    // סך הכסף שהורווח אי פעם
let lastKnownLevel = 1;

// --- 3. מנוע רמות וניסיון (XP System) ---
/**
 * מחשב רמה נוכחית לפי XP. 
 * נוסחה: כל רמה קשה ב-25% מהקודמת.
 */
function getLevelData(xp) {
    let level = 1;
    let xpForNext = 1000;
    let totalXPStack = 0;

    // לופ למציאת הרמה הנוכחית
    while (xp >= totalXPStack + xpForNext) {
        totalXPStack += xpForNext;
        level++;
        xpForNext = Math.floor(xpForNext * 1.25);
    }

    let xpInCurrentLevel = xp - totalXPStack;
    let progressPercent = (xpInCurrentLevel / xpForNext) * 100;

    return {
        level: level,
        xpInCurrentLevel: Math.max(0, Math.floor(xpInCurrentLevel)),
        xpForNext: xpForNext,
        progressPercent: Math.min(100, progressPercent)
    };
}

// --- 4. ניהול זיכרון (Save/Load) ---
function saveGame() {
    try {
        const data = {
            money, bank, loan, lifeXP, passive, lastGift,
            skills, cars, inventory, invOwned,
            carSpeed, totalEarned,
            lastSaveTime: Date.now(),
            version: VERSION
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        console.log(`Game Saved at ${new Date().toLocaleTimeString()}`);
    } catch (err) {
        console.error("Save Failed:", err);
    }
}

function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;

    try {
        const data = JSON.parse(raw);
        
        // טעינת ערכים עם ברירת מחדל לביטחון
        money = Number(data.money) || 0;
        bank = Number(data.bank) || 0;
        loan = Number(data.loan) || 0;
        lifeXP = Number(data.lifeXP) || 0;
        passive = Number(data.passive) || 0;
        lastGift = data.lastGift || 0;
        
        skills = Array.isArray(data.skills) ? data.skills : [];
        cars = Array.isArray(data.cars) ? data.cars : [];
        inventory = Array.isArray(data.inventory) ? data.inventory : [];
        invOwned = data.invOwned || invOwned;
        
        carSpeed = Number(data.carSpeed) || 1;
        totalEarned = Number(data.totalEarned) || 0;

        // חישוב רווחים בזמן שלא היית במשחק (אופליין)
        if (data.lastSaveTime && passive > 0) {
            const now = Date.now();
            const msPassed = Math.min(now - data.lastSaveTime, 24 * 3600000); // מקסימום 24 שעות
            const offlineEarned = (msPassed / 3600000) * passive;
            money += offlineEarned;
            // נציג הודעה רק אחרי שה-UI נטען
            setTimeout(() => {
                showMsg(`ברוך השב! הרווחת ${Math.floor(offlineEarned).toLocaleString()}₪ בזמן שלא היית.`, "var(--green)");
            }, 1000);
        }

        lastKnownLevel = getLevelData(lifeXP).level;
    } catch (err) {
        console.error("Load Failed:", err);
    }
}

// --- 5. עדכון נתונים ו-UI ---
function updateUI() {
    const ld = getLevelData(lifeXP);
    
    // עדכון אלמנטים קבועים ב-TopBar
    const elements = {
        'money': Math.floor(money).toLocaleString(),
        'bank': Math.floor(bank).toLocaleString(),
        'life-level-ui': ld.level
    };

    for (let [id, val] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    }

    // בדיקת עליית רמה (Level Up)
    if (ld.level > lastKnownLevel) {
        const bonus = ld.level * 2000;
        money += bonus;
        lastKnownLevel = ld.level;
        showMsg(`🎊 LEVEL UP! עלית לרמה ${ld.level} וקיבלת ${bonus.toLocaleString()}₪!`, "var(--purple)");
        saveGame(); // שמירה מיידית בעליית רמה
    }
}

// --- 6. מנוע הטיקים (Income Loop) ---
/**
 * רץ כל 50ms ומחשב את החלק היחסי של ההכנסה הפסיבית.
 * שעה אחת = 3,600,000 מילישניות. 
 * טיק של 50ms = 1/72,000 מהשעה.
 */
setInterval(() => {
    if (passive > 0) {
        const incomePerTick = passive / 72000;
        money += incomePerTick;
        
        // עדכון מהיר של תצוגת המזומן בלבד לצורך ביצועים
        const mEl = document.getElementById('money');
        if (mEl) mEl.innerText = Math.floor(money).toLocaleString();
        
        // שליחת נתוני רמה ל-UI.js לצורך עדכון פס ההתקדמות בבית
        if (typeof renderUIUpdate === 'function') {
            renderUIUpdate(getLevelData(lifeXP));
        }
    }
}, TICK_RATE);

// --- 7. פונקציות מערכת ---
function forceUpdate() {
    if (confirm("האם ברצונך לרענן את המשחק? כל הנתונים יישמרו.")) {
        saveGame();
        location.reload();
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    showMsg(isLight ? "מצב יום פעיל" : "מצב לילה פעיל");
}

// אתחול המשחק
document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
    console.log(`Smart Money Pro v${VERSION} Initialized.`);
});

// שמירה אוטומטית כל 30 שניות
setInterval(saveGame, 30000);
