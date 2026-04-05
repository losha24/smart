/* Smart Money Pro - js/core.js - v7.9.8 - Firebase Cloud Integration */

const VERSION = "7.9.8";
const SAVE_KEY = "smartMoneySave_v7_cloud";

// --- אתחול משתנים גלובליים ---
window.money = 1200; 
window.bank = 0;
window.loan = 0;
window.lifeXP = 0;
window.passive = 0;
window.lastGift = 0;
window.skills = [];
window.cars = [];
window.inventory = []; 
window.invOwned = { AAPL:0, TSLA:0, NVDA:0, BTC:0, GOOG:0, AMZN:0, MSFT:0, NFLX:0, META:0, ELAL:0 };
window.carSpeed = 1;
window.totalEarned = 0;
window.lastSaveTime = Date.now();
window.lastKnownLevel = 1; 

let msgTimer; 
let saveTimeout; // לניהול Auto-Save חכם לענן

// --- מנוע חישוב רמות דינמי ---
function getLevelData(xp) {
    let level = 1;
    let xpForNext = 1000; 
    let totalXPStack = 0;
    while (xp >= totalXPStack + xpForNext) {
        totalXPStack += xpForNext;
        level++;
        xpForNext = Math.floor(xpForNext * 1.25); 
    }
    return { level, xpInCurrentLevel: xp - totalXPStack, xpForNext, progressPercent: ((xp - totalXPStack) / xpForNext) * 100 };
}

// --- [חדש] טעינה מהענן (Firebase) ---
window.loadGameFromCloud = async function() {
    return new Promise((resolve) => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const doc = await db.collection("players").doc(user.uid).get();
                    if (doc.exists) {
                        const data = doc.data();
                        // סנכרון משתנים מהענן למשחק
                        window.money = data.money ?? 1200;
                        window.bank = data.bank ?? 0;
                        window.loan = data.loan ?? 0;
                        window.lifeXP = data.lifeXP ?? 0;
                        window.passive = data.passive ?? 0;
                        window.lastGift = data.lastGift ?? 0;
                        window.skills = data.skills ?? [];
                        window.cars = data.cars ?? [];
                        window.invOwned = data.invOwned ?? window.invOwned;
                        window.totalEarned = data.totalEarned ?? 0;
                        window.lastKnownLevel = getLevelData(window.lifeXP).level;
                        
                        // חישוב רווח לא מקוון (Offline Earnings)
                        if (data.lastSaveTime && window.passive > 0) {
                            const msPassed = Math.min(Date.now() - data.lastSaveTime, 12 * 60 * 60 * 1000);
                            const offlineEarnings = (msPassed / 3600000) * window.passive;
                            if (offlineEarnings > 5) {
                                window.money += offlineEarnings;
                                setTimeout(() => showMsg(`💰 הרווחת ${Math.floor(offlineEarnings).toLocaleString()}₪ בזמן שלא היית!`, "var(--yellow)"), 2000);
                            }
                        }
                        resolve(true);
                    } else resolve(false);
                } catch (e) { console.error("Cloud Load Error:", e); resolve(false); }
            } else resolve(false);
        });
    });
};

// --- [מעודכן] שמירה משולבת: Local + Cloud ---
window.saveGame = function() {
    window.lastSaveTime = Date.now();
    const data = { 
        money: window.money, bank: window.bank, loan: window.loan, lifeXP: window.lifeXP, 
        passive: window.passive, lastGift: window.lastGift, skills: window.skills, 
        cars: window.cars, invOwned: window.invOwned, totalEarned: window.totalEarned, 
        lastSaveTime: window.lastSaveTime, name: localStorage.getItem('gameUserName') || "שחקן"
    };

    // 1. שמירה מקומית (מהירה)
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));

    // 2. שמירה לענן (Firebase) - רק אם המשתמש מחובר
    const user = auth.currentUser;
    if (user) {
        db.collection("players").doc(user.uid).set(data, { merge: true })
            .then(() => console.log("Cloud sync complete"))
            .catch(e => console.error("Cloud sync failed:", e));
    }
};

// שמירה אוטומטית חכמה (מונעת עומס על ה-API)
window.autoSave = function() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(window.saveGame, 5000); // שומר לענן 5 שניות אחרי הפעולה האחרונה
};

// --- מערכת הודעות ---
function showMsg(txt, color = "var(--blue)") {
    const bar = document.getElementById('status-bar');
    if (!bar) return;
    clearTimeout(msgTimer); 
    bar.innerText = txt; bar.style.opacity = "1"; bar.style.transform = "translateY(0)";
    bar.style.color = color; bar.style.borderColor = color;
    msgTimer = setTimeout(() => { bar.style.opacity = "0"; bar.style.transform = "translateY(-5px)"; }, 3500);
}

// --- עדכון UI ---
function updateUI() {
    const mEl = document.getElementById('money'), bEl = document.getElementById('bank'), lEl = document.getElementById('life-level-ui');
    if(mEl) mEl.innerText = Math.floor(window.money).toLocaleString();
    if(bEl) bEl.innerText = Math.floor(window.bank).toLocaleString();
    const ld = getLevelData(window.lifeXP);
    if(lEl) lEl.innerText = ld.level;
    if (typeof window.renderUIUpdate === 'function') window.renderUIUpdate(ld);
    checkLevelUp(ld.level);
}

function checkLevelUp(currentLevel) {
    if (currentLevel > window.lastKnownLevel && window.lastKnownLevel > 0) {
        const bonus = currentLevel * 1000;
        window.money += bonus;
        showMsg(`🎊 רמה ${currentLevel}! בונוס: ${bonus.toLocaleString()}₪ 🎊`, "var(--purple)");
        window.lastKnownLevel = currentLevel;
        window.saveGame();
    }
}

function toggleTheme() {
    const next = document.body.classList.contains('light-theme') ? 'dark' : 'light';
    document.body.className = next + '-theme';
    localStorage.setItem('theme', next);
    showMsg(`מצב ${next === 'light' ? 'יום' : 'לילה'}`);
}

function resetGame() {
    if (confirm("⚠️ לאפס הכל? כל הנתונים בענן ימחקו.")) {
        const user = auth.currentUser;
        if (user) db.collection("players").doc(user.uid).delete();
        localStorage.clear();
        location.reload();
    }
}

// --- מנועי זמן ---
// עדכון כסף פסיבי מהיר (למראה חלק)
setInterval(() => {
    if (window.passive > 0) {
        const tick = window.passive / 72000; 
        window.money += tick;
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(window.money).toLocaleString();
    }
}, 50); 

// שמירה אוטומטית קבועה כל 30 שניות כגיבוי
setInterval(window.saveGame, 30000);

document.addEventListener("DOMContentLoaded", () => {
    // אתחול המשחק מתבצע מתוך ui.js דרך initApp()
    console.log(`Smart Money Engine v${VERSION} Cloud-Ready.`);
});
