/* Smart Money Pro - js/ui.js - v7.9.8 - Final Integration: All Systems & Tabs */

let deferredPrompt;
let currentTab = 'home'; 
let leaderboardPage = 1;
const playersPerPage = 4;

// --- הגדרות ראשוניות ואבטחה ---
if (!localStorage.getItem('adminPass')) {
    localStorage.setItem('adminPass', '1234');
}

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    renderInstallBtn();
});

// --- פונקציית אתחול: בודקת אם קיים שם משתמש ---
function initApp() {
    const userName = localStorage.getItem('gameUserName');
    if (!userName) {
        drawWelcome();
    } else {
        window.openTab('home');
    }
}

// --- מסך פתיחה (Welcome Screen) ---
function drawWelcome() {
    const c = document.getElementById("content");
    if (!c) return;
    
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center; padding:40px 20px; margin-top:30px; border: 1px solid var(--blue);">
            <h1 style="color:var(--blue); margin-bottom:10px; font-size:28px;">💰 Smart Money Pro</h1>
            <p style="opacity:0.8; font-size:14px; margin-bottom:30px;">ברוך הבא למשחק הפיננסי שלך.<br>בוא נתחיל בבניית האימפריה.</p>
            
            <div style="margin-bottom:25px;">
                <label style="display:block; margin-bottom:10px; font-size:13px; opacity:0.7;">איך קוראים לך?</label>
                <input type="text" id="nameInput" placeholder="הכנס שם שחקן..." 
                    style="width:85%; padding:15px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.3); color:white; text-align:center; font-size:18px; outline:none;">
            </div>
            
            <button onclick="startGameSession()" class="action-btn" style="width:90%; background:var(--blue); color:white; padding:15px; border-radius:10px; font-weight:bold; border:none; cursor:pointer; font-size:16px;">צא לדרך! 🚀</button>
        </div>
    `;
}

window.startGameSession = function() {
    const name = document.getElementById("nameInput").value.trim();
    if (name.length < 2) {
        alert("נא להזין שם תקין (לפחות 2 תווים)");
        return;
    }
    localStorage.setItem('gameUserName', name);
    window.openTab('home');
};

// --- מערכת ניווט טאבים מרכזית ---
window.openTab = function(t) {
    if (!localStorage.getItem('gameUserName')) return drawWelcome();

    currentTab = t; 
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + t.charAt(0).toUpperCase() + t.slice(1));
    if(btn) btn.classList.add("active");
    
    const c = document.getElementById("content"); 
    if(!c) return;
    
    c.style.opacity = "0.5"; 
    setTimeout(() => {
        c.innerHTML = "";
        // קריאה דינמית לפונקציית הציור (למשל drawWork)
        const drawFunc = window["draw" + t.charAt(0).toUpperCase() + t.slice(1)];
        if (typeof drawFunc === 'function') drawFunc(c);
        else window.drawHome(c);
        
        c.style.opacity = "1";
        if (t !== 'invest') window.scrollTo(0,0);
        if(typeof updateUI === 'function') updateUI();
    }, 100);
};

// --- 🏠 דף הבית ---
window.drawHome = function(c) {
    const userName = localStorage.getItem('gameUserName') || "שחקן";
    const ld = (typeof getLevelData === 'function') ? getLevelData(window.lifeXP || 0) : { level: 1, xpInCurrentLevel: 0, xpForNext: 1000, progressPercent: 0 };

    const allPlayers = [
        { name: "אבי כהן", money: 15500000, level: 25 },
        { name: `${userName} (אתה)`, money: window.money || 0, level: ld.level, isPlayer: true },
        { name: "מרינה לביא", money: 8200000, level: 18 },
        { name: "יוסי לוי", money: 4500000, level: 11 }
    ].sort((a, b) => b.money - a.money);

    c.innerHTML = `
        <div class="card fade-in">
            <div id="admin-box" class="admin-box">
                <button class="edit-admin-btn" onclick="window.editAdminMsg()">✏️</button>
                📢 <b>מערכת:</b> <span style="font-size:13px;">${window.adminMsgText || "ברוכים הבאים, " + userName}</span>
            </div>

            <div class="card" style="background:rgba(255,255,255,0.03); margin-bottom:15px; padding:12px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:12px;">
                    <span>⭐ רמת חיים <b id="home-level-val">${ld.level}</b></span>
                    <span id="xp-text-detail" style="opacity:0.8;">${Math.floor(ld.xpInCurrentLevel).toLocaleString()} XP</span>
                </div>
                <div style="height:10px; background:rgba(0,0,0,0.3); border-radius:10px; overflow:hidden;">
                    <div id="xp-progress-bar" style="width:${ld.progressPercent}%; height:100%; background:linear-gradient(90deg, #3b82f6, #60a5fa);"></div>
                </div>
            </div>

            <div class="card" style="background:rgba(245, 158, 11, 0.05); text-align:center; padding:15px; margin-bottom:15px;">
                <button id="giftBtn" onclick="claimDailyGift()" class="action-btn" style="width:100%; background:var(--yellow); color:#000; font-weight:bold;">🎁 בונוס יומי</button>
                <div id="giftTimer" style="font-size:12px; margin-top:8px; color:var(--yellow);">טוען...</div>
            </div>

            <div class="grid-2">
                <div class="card" style="text-align:center; background:rgba(34, 197, 94, 0.02);"><small>💰 פסיבי</small><br><b id="passive-display" style="color:#22c55e;">${(window.passive || 0).toLocaleString()} ₪</b></div>
                <div class="card" style="text-align:center; background:rgba(239, 68, 68, 0.02);"><small>🏦 חוב</small><br><b style="color:#ef4444;">${(window.loan || 0).toLocaleString()} ₪</b></div>
            </div>

            <div class="card" style="margin-top:15px; padding:12px; background:rgba(255,255,255,0.02);">
                <small style="opacity:0.6; font-weight:bold;">🏆 דירוג שחקנים</small>
                <div id="leaderboard" style="margin-top:10px;">
                    ${allPlayers.map((p, i) => `
                        <div style="display:flex; justify-content:space-between; padding:8px; background:${p.isPlayer ? 'rgba(59, 130, 246, 0.1)' : 'transparent'}; border-radius:6px;">
                            <span>${i+1}. ${p.name}</span>
                            <b style="color:var(--green);">${Math.floor(p.money).toLocaleString()} ₪</b>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div id="install-container" style="margin-top:20px;"></div>
            <button class="sys-btn" style="color:#ef4444; margin-top:25px; width:100%; opacity:0.5;" onclick="resetGameSession()">🗑️ איפוס חשבון</button>
        </div>
    `;
    startGiftTimer();
    renderInstallBtn();
};

// --- ⚒️ טאב עבודות ---
window.drawWork = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>⚒️ מרכז תעסוקה</h3><div id="work-list"></div></div>`;
    if (window.renderWorkList) window.renderWorkList();
};

// --- 📈 טאב בורסה ---
window.drawInvest = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>📈 בורסה לניירות ערך</h3><div id="stock-market"></div></div>`;
    if (window.renderStocks) window.renderStocks();
};

// --- 🏠 טאב נדל"ן ---
window.drawEstate = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🏠 נכסים ונדל"ן</h3><div id="real-estate-list"></div></div>`;
    if (window.renderRealEstate) window.renderRealEstate();
};

// --- 🏢 טאב עסקים ---
window.drawBusiness = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🏢 ניהול עסקים</h3><div id="business-list"></div></div>`;
    if (window.renderBusinesses) window.renderBusinesses();
};

// --- 🎰 טאב קזינו (Tasks) ---
window.drawTasks = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🎰 קזינו המזל</h3><div id="casino-games"></div></div>`;
    if (window.renderCasino) window.renderCasino();
};

// --- 🎓 טאב כישורים ---
window.drawSkills = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🎓 לימודים וכישורים</h3><div id="skills-list"></div></div>`;
    if (window.renderSkillsList) window.renderSkillsList();
};

// --- 🚗 טאב רכבים ---
window.drawCars = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🚗 סוכנות רכבים</h3><div id="cars-list"></div></div>`;
    if (window.renderCarsList) window.renderCarsList();
};

// --- 🛒 טאב חנות ---
window.drawShop = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🛒 חנות פרימיום</h3><div id="shop-items"></div></div>`;
    if (window.renderShop) window.renderShop();
};

// --- 🏦 טאב בנק ---
window.drawBank = function(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <h3>🏦 בנק מרכזי</h3>
            <div class="card" style="text-align:center; background:rgba(59,130,246,0.1); margin-bottom:15px;">
                <small>יתרה בבנק:</small><br><b style="font-size:24px; color:#3b82f6;">${Math.floor(window.bank || 0).toLocaleString()} ₪</b>
            </div>
            <div class="grid-2">
                <button onclick="depositAll()" class="action-btn">💰 הפקדה</button>
                <button onclick="withdrawAll()" class="action-btn" style="background:#64748b;">💸 משיכה</button>
            </div>
        </div>`;
};

// --- פונקציות עזר (UI Update, Gift, Reset, Admin, PWA) ---

function renderUIUpdate(ld) {
    if (!ld) ld = typeof getLevelData === 'function' ? getLevelData(window.lifeXP || 0) : null;
    if (!ld) return;

    const moneyEl = document.getElementById('money');
    const bankEl = document.getElementById('bank');
    if (moneyEl) moneyEl.innerText = Math.floor(window.money || 0).toLocaleString();
    if (bankEl) bankEl.innerText = Math.floor(window.bank || 0).toLocaleString();

    if (currentTab === 'home') {
        const pEl = document.getElementById('passive-display');
        const bar = document.getElementById('xp-progress-bar');
        if (pEl) pEl.innerText = (window.passive || 0).toLocaleString() + " ₪/ש";
        if (bar) bar.style.width = ld.progressPercent + "%";
    }
}

function claimDailyGift() {
    const now = Date.now();
    if (window.lastGift && (now - window.lastGift < 14400000)) return;
    const bonus = 500 + (getLevelData(window.lifeXP).level * 250);
    window.money += bonus; window.lastGift = now;
    if(typeof saveGame === 'function') saveGame();
    if(typeof updateUI === 'function') updateUI();
    window.openTab('home');
}

function startGiftTimer() {
    const timerEl = document.getElementById('giftTimer'), btn = document.getElementById('giftBtn');
    if (!timerEl || !btn) return;
    const update = () => {
        const left = 14400000 - (Date.now() - (window.lastGift || 0));
        if (left <= 0) {
            timerEl.innerText = "✅ המוכן!"; btn.disabled = false; btn.style.opacity = "1";
        } else {
            const h = Math.floor(left/3600000), m = Math.floor((left%3600000)/60000), s = Math.floor((left%60000)/1000);
            timerEl.innerText = `⏳ ${h}:${m}:${s}`; btn.disabled = true; btn.style.opacity = "0.5";
        }
    };
    update();
}

window.resetGameSession = function() {
    if (confirm('לאפס הכל?')) {
        localStorage.removeItem('gameUserName');
        if (typeof resetGame === 'function') resetGame();
        location.reload();
    }
};

function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(!cont || window.matchMedia('(display-mode: standalone)').matches || !deferredPrompt) return;
    cont.innerHTML = `<button class="action" style="background:#3b82f6; width:100%; border-radius:8px;" onclick="triggerInstall()">📲 התקן אפליקציה</button>`;
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') { deferredPrompt = null; renderInstallBtn(); }
}

window.editAdminMsg = function() {
    const pass = prompt("סיסמת מנהל:");
    if (pass === localStorage.getItem('adminPass')) { 
        const action = prompt("1-הודעה, 2-כסף, 3-XP", "1");
        if (action === "1") window.adminMsgText = prompt("הודעה:");
        if (action === "2") window.money += parseInt(prompt("כמה?") || 0);
        if (action === "3") window.lifeXP += parseInt(prompt("כמה?") || 0);
        updateUI(); window.openTab('home');
    }
};

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initApp, 150);
});
