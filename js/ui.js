/* Smart Money Pro - js/ui.js - v6.5.2 - Ultra Optimized for Alexey */

let deferredPrompt;
let currentTab = 'home'; 

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    renderInstallBtn();
});

// --- עדכון ויזואלי מהיר ---
function renderUIUpdate(ld) {
    if (!ld && typeof getLevelData === 'function') {
        ld = getLevelData(window.lifeXP || 0);
    }
    if (currentTab === 'home' && ld) {
        const passiveEl = document.getElementById('passive-display');
        const progressEl = document.getElementById('xp-progress-bar');
        const levelValEl = document.getElementById('home-level-val');
        if (passiveEl) passiveEl.innerText = (window.passive || 0).toLocaleString() + " ₪/ש";
        if (progressEl) progressEl.style.width = ld.progressPercent + "%";
        if (levelValEl) levelValEl.innerText = ld.level;
    }
}

// --- מערכת ניווט (מתוקנת ללא כפילויות) ---
window.openTab = function(t) {
    currentTab = t; 
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + t.charAt(0).toUpperCase() + t.slice(1));
    if(btn) btn.classList.add("active");
    
    const c = document.getElementById("content"); 
    if(!c) return;
    
    c.style.opacity = "0";
    setTimeout(() => {
        c.innerHTML = "";
        const drawFunc = window["draw" + t.charAt(0).toUpperCase() + t.slice(1)];
        if (typeof drawFunc === 'function') {
            drawFunc(c);
        } else {
            window.drawHome(c);
        }
        c.style.opacity = "1";
        window.scrollTo(0,0);
        if(typeof updateUI === 'function') updateUI();
    }, 120);
};

// --- דף הבית המעודכן ---
window.drawHome = function(c) {
    const ld = (typeof getLevelData === 'function') 
               ? getLevelData(window.lifeXP || 0) 
               : { level: 1, xpInCurrentLevel: 0, xpForNext: 1000, progressPercent: 0 };

    // חישוב אייקונים לציוד
    let invIcons = "";
    if(window.skills && window.skills.length > 0) invIcons += "🎓 ";
    if(window.cars && window.cars.length > 0) invIcons += "🚗 ";
    if(window.propertys && window.propertys.length > 0) invIcons += "🏠 ";
    if(window.business && window.business.length > 0) invIcons += "🏢 ";
    if(window.marketItems && window.marketItems.length > 0) invIcons += "🛒 ";

    c.innerHTML = `
        <div class="card fade-in">
            <h3 style="margin:0 0 15px 0;">🏠 מרכז שליטה</h3>

            <div class="admin-box fade-in" style="margin-bottom:15px;">
                📢 <b>הודעת מערכת:</b> 
                <button onclick="window.editAdminMsg()" class="edit-admin-btn">✏️</button>
                <br><span>${window.adminMsgText || "המערכת פועלת כסדרה."}</span>
            </div>
            
            <div class="card" style="background:rgba(255,255,255,0.03); margin-bottom:15px; padding:12px; border:1px solid rgba(255,255,255,0.1);">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:12px;">
                    <span>⭐ רמת חיים <b id="home-level-val">${ld.level}</b></span>
                    <span style="opacity:0.8;">${ld.progressPercent}%</span>
                </div>
                <div style="height:10px; background:rgba(0,0,0,0.3); border-radius:10px; overflow:hidden;">
                    <div id="xp-progress-bar" style="width:${ld.progressPercent}%; height:100%; background:linear-gradient(90deg, #3b82f6, #60a5fa); transition: 0.4s;"></div>
                </div>
            </div>

            <div class="card" style="background:rgba(245, 158, 11, 0.05); border:1px solid rgba(245, 158, 11, 0.3); text-align:center; padding:15px; margin-bottom:15px;">
                <button id="giftBtn" onclick="claimDailyGift()" class="action-btn" style="width:100%; background:var(--yellow); color:#000; font-weight:bold;">🎁 קבלת בונוס</button>
                <div id="giftTimer" style="font-size:12px; margin-top:8px; color:var(--yellow);">טוען...</div>
            </div>

            <div class="grid-2">
                <div class="card" style="text-align:center; border: 1px solid rgba(34, 197, 94, 0.2);">
                    <small style="opacity:0.7; font-size:10px; display:block;">💰 פסיבי</small>
                    <b id="passive-display" style="color:#22c55e;">${(window.passive || 0).toLocaleString()} ₪</b>
                </div>
                <div class="card" style="text-align:center; border: 1px solid rgba(239, 68, 68, 0.2);">
                    <small style="opacity:0.7; font-size:10px; display:block;">🏦 חוב</small>
                    <b style="color:#ef4444;">${(window.loan || 0).toLocaleString()} ₪</b>
                </div>
            </div>

            <div class="card" style="margin-top:15px; padding:12px; background:rgba(255,255,255,0.02); text-align:center;">
                <small style="opacity:0.6; display:block; margin-bottom:8px;">🎒 הציוד שלי:</small>
                <div style="font-size:24px; letter-spacing:10px;">
                    ${invIcons || "📦"}
                </div>
            </div>

            <div id="install-container" style="margin-top:20px;"></div>
            <button class="sys-btn" style="color:#ef4444; margin-top:25px; width:100%; opacity:0.5;" onclick="resetGame()">🗑️ איפוס חשבון</button>
        </div>
    `;
    startGiftTimer();
    renderInstallBtn();
};

// --- שאר הפונקציות (Skills, Cars, וכו') ---
window.drawSkills = function(c) {
    c.innerHTML = `<h3>🎓 כישורים</h3><div id="skills-list" class="grid-1"></div>`;
    // כאן תבוא הלוגיקה של הרינדור שלך...
};

window.drawCars = function(c) {
    c.innerHTML = `<h3>🚗 רכבים</h3><div id="cars-list" class="grid-1"></div>`;
    // כאן תבוא הלוגיקה של הרינדור שלך...
};

// --- ניהול מתנה ובונוסים ---
function claimDailyGift() {
    const now = Date.now();
    if (window.lastGift && (now - window.lastGift < 14400000)) return;
    const bonus = 500 + (window.lastKnownLevel * 250);
    window.money += bonus;
    window.lastGift = now;
    if(window.saveGame) saveGame();
    if(window.updateUI) updateUI();
    showStatus(`🎁 קיבלת בונוס של ${bonus.toLocaleString()}₪!`, "green");
}

function startGiftTimer() {
    const timerEl = document.getElementById('giftTimer');
    const btn = document.getElementById('giftBtn');
    const update = () => {
        if (!timerEl || !btn) return;
        const timeLeft = 14400000 - (Date.now() - (window.lastGift || 0));
        if (timeLeft <= 0) {
            timerEl.innerText = "✅ המוכן!";
            btn.disabled = false; btn.style.opacity = "1";
        } else {
            const h = Math.floor(timeLeft / 3600000), m = Math.floor((timeLeft % 3600000) / 60000), s = Math.floor((timeLeft % 60000) / 1000);
            timerEl.innerText = `⏳ ${h}:${m}:${s}`;
            btn.disabled = true; btn.style.opacity = "0.5";
        }
    };
    update();
    setInterval(update, 1000);
}

window.editAdminMsg = function() {
    const pass = prompt("סיסמת מנהל:");
    if (pass === "1234") { 
        const newMsg = prompt("הודעה חדשה:", window.adminMsgText || "");
        if (newMsg !== null) { 
            window.adminMsgText = newMsg; 
            window.openTab('home'); 
        }
    }
};

function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(cont && !window.matchMedia('(display-mode: standalone)').matches && deferredPrompt) {
        cont.innerHTML = `<button class="action" onclick="triggerInstall()">📲 התקן אפליקציה</button>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => { window.openTab('home'); }, 150);
});
