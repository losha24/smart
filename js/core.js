/* Smart Money Pro - js/core.js - v6.5.2 TURBO - FULL & FINAL */

// --- 1. משתני ליבה (Global State) ---
let money = 1500;
let bank = 0;
let lifeXP = 0;
let passive = 0;
let inventory = [];
let carSpeed = 1;
let lastKnownLevel = 1;
let currentTab = 'home';

// --- 2. מנוע רמות וניסיון (XP System) ---
function getLevelData(xp) {
    let level = 1;
    let xpForNext = 1000;
    let totalXPStack = 0;
    
    // נוסחת רמות אקספוננציאלית (כל רמה קשה יותר ב-25%)
    while (xp >= totalXPStack + xpForNext) {
        totalXPStack += xpForNext;
        level++;
        xpForNext = Math.floor(xpForNext * 1.25);
    }
    
    return {
        level: level,
        xpInCurrentLevel: Math.floor(xp - totalXPStack),
        xpForNext: xpForNext,
        progressPercent: ((xp - totalXPStack) / xpForNext) * 100
    };
}

// --- 3. מנוע הטיקים המהיר (Turbo Passive Income Engine) ---
// רץ 20 פעמים בשנייה (כל 50 מילישניות)
setInterval(() => {
    if (passive > 0) {
        // חישוב רווח לטיק (רווח לשעה חלקי 72,000 טיקים בשעה)
        const incomePerTick = passive / 72000; 
        
        money += incomePerTick;
        
        // בונוס XP קטן מאוד על עצם צבירת ההון (0.05% מהרווח הופך ל-XP)
        lifeXP += (incomePerTick * 0.05);

        // עדכון ישיר של הכסף ב-UI (לביצועים מקסימליים ללא לאגים)
        const moneyEl = document.getElementById('money');
        if (moneyEl) {
            moneyEl.innerText = Math.floor(money).toLocaleString();
        }

        // אם המשתמש בטאב הבית, נעדכן את פס הניסיון בזמן אמת
        if (currentTab === 'home') {
            const ld = getLevelData(lifeXP);
            const xpBar = document.getElementById('xp-progress-bar');
            if (xpBar) {
                xpBar.style.width = ld.progressPercent + "%";
            }
            
            // בדיקת עליית רמה
            if (ld.level > lastKnownLevel) {
                handleLevelUp(ld.level);
            }
        }
    }
}, 50);

// --- 4. טיפול בעליית רמה (Level Up Logic) ---
function handleLevelUp(newLevel) {
    lastKnownLevel = newLevel;
    const bonus = newLevel * 5000; // מענק כספי בכל עליית רמה
    money += bonus;
    
    if (typeof showMsg === 'function') {
        showMsg(`🎊 LEVEL UP! הגעת לרמה ${newLevel}! קיבלת בונוס ₪${bonus.toLocaleString()}`, "var(--purple)");
    }
    
    if (typeof updateUI === 'function') updateUI();
    if (typeof saveGame === 'function') saveGame();
}

// --- 5. פונקציות עזר גלובליות ---
function updateUI() {
    const ld = getLevelData(lifeXP);
    
    const elements = {
        'money': Math.floor(money).toLocaleString(),
        'bank': Math.floor(bank).toLocaleString(),
        'life-level-ui': ld.level
    };

    for (let [id, val] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
    }
}

// פונקציית הודעות סטטוס (מחליפה את ה-Alert המציק)
function showMsg(txt, color = "var(--blue)") {
    const sb = document.getElementById('status-bar');
    if (sb) {
        sb.innerText = txt;
        sb.style.color = color;
        sb.style.opacity = "1";
        sb.style.transform = "translateY(0)";
        
        // העלמת ההודעה אחרי 3 שניות
        setTimeout(() => {
            sb.style.opacity = "0";
            sb.style.transform = "translateY(-5px)";
        }, 3000);
    }
}

// פונקציית שמירה מהירה (נקראת מפעולות בקבצים אחרים)
function forceSave() {
    if (typeof saveGame === 'function') saveGame();
    showMsg("💾 ההתקדמות נשמרה בהצלחה", "var(--green)");
}
