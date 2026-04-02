/* Smart Money Pro - js/ui.js - v6.6.0 - Mobile Debug Edition */

let deferredPrompt;
let currentTab = 'home'; 

// --- פאנל דיבאג לנייד ---
function mobileLog(msg) {
    let debugDiv = document.getElementById('mobile-debug-log');
    if (!debugDiv) {
        debugDiv = document.createElement('div');
        debugDiv.id = 'mobile-debug-log';
        debugDiv.style = "position:fixed; bottom:0; left:0; width:100%; height:60px; background:rgba(0,0,0,0.8); color:#00ff00; font-family:monospace; font-size:10px; overflow-y:auto; z-index:10000; padding:5px; border-top:1px solid #3b82f6; pointer-events:none;";
        document.body.appendChild(debugDiv);
    }
    const time = new Date().toLocaleTimeString().split(' ')[0];
    debugDiv.innerHTML = `<div>[${time}] ${msg}</div>` + debugDiv.innerHTML;
}

// --- מערכת ניווט עם חסימת ריענון אוטומטי ---
window.openTab = function(t) {
    const stack = new Error().stack;
    const isAuto = stack.includes('setInterval') || stack.includes('setTimeout');
    
    mobileLog(`Tab Attempt: ${t} (${isAuto ? 'AUTO' : 'MANUAL'})`);

    // חסימת ריענון אוטומטי בשוק למניעת קפיצות
    if (currentTab === 'market' && t === 'market' && isAuto) {
        mobileLog(`!!! Blocked Auto-Refresh on Market`);
        return; 
    }

    currentTab = t; 
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btnId = "btn" + t.charAt(0).toUpperCase() + t.slice(1);
    const btn = document.getElementById(btnId);
    if(btn) btn.classList.add("active");
    
    const c = document.getElementById("content"); 
    if(!c) return;
    
    c.style.opacity = "0";
    setTimeout(() => {
        c.innerHTML = "";
        const drawFunc = window["draw" + t.charAt(0).toUpperCase() + t.slice(1)];
        if (typeof drawFunc === 'function') drawFunc(c);
        else window.drawHome(c);
        
        c.style.opacity = "1";
        window.scrollTo(0,0);
        
        // עדכון UI רק אם זה לא השוק
        if(typeof updateUI === 'function' && t !== 'market') updateUI();
    }, 120);
};

// --- דף הבית (6.5.0) ---
window.drawHome = function(c) {
    const ld = (typeof getLevelData === 'function') 
               ? getLevelData(window.lifeXP || 0) 
               : { level: 1, xpInCurrentLevel: 0, xpForNext: 1000, progressPercent: 0 };

    c.innerHTML = `
        <div class="card fade-in">
            <div id="admin-box" style="margin-bottom:15px; border:1px solid #3b82f6; padding:10px; border-radius:8px; background:rgba(59,130,246,0.05);">
                📢 <b>הודעה:</b> 
                <button onclick="window.editAdminMsg()" style="float:left; background:none; border:none; color:var(--blue); cursor:pointer;">✏️</button>
                <br><span style="font-size:12px;">${window.adminMsgText || "המערכת פועלת כסדרה."}</span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0;">🏠 מרכז שליטה</h3>
                <button onclick="forceUpdate()" class="sys-btn" style="padding:5px 12px; font-size:12px;">🔄 רענן</button>
            </div>
            
            <div class="card" style="background:rgba(255,255,255,0.03); margin-bottom:15px; padding:12px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:12px;">
                    <span>⭐ רמת חיים <b id="home-level-val">${ld.level}</b></span>
                    <span>${ld.progressPercent}%</span>
                </div>
                <div style="height:10px; background:rgba(0,0,0,0.3); border-radius:10px; overflow:hidden;">
                    <div id="xp-progress-bar" style="width:${ld.progressPercent}%; height:100%; background:var(--blue); transition: 0.4s;"></div>
                </div>
            </div>

            <div class="card" style="background:rgba(245, 158, 11, 0.05); border:1px solid rgba(245, 158, 11, 0.3); text-align:center; padding:15px; margin-bottom:15px;">
                <button id="giftBtn" onclick="claimDailyGift()" class="action-btn" style="width:100%; background:var(--yellow); color:#000; font-weight:bold;">🎁 קבלת בונוס</button>
                <div id="giftTimer" style="font-size:12px; margin-top:8px; color:var(--yellow);">טוען...</div>
            </div>

            <div class="grid-2">
                <div class="card" style="text-align:center;"><small>פסיבי</small><br><b style="color:#22c55e;">${(window.passive || 0).toLocaleString()} ₪</b></div>
                <div class="card" style="text-align:center;"><small>חוב</small><br><b style="color:#ef4444;">${(window.loan || 0).toLocaleString()} ₪</b></div>
            </div>

            <div id="install-container"></div>
            <button class="sys-btn" style="color:#ef4444; margin-top:20px; width:100%; opacity:0.5; font-size:10px;" onclick="resetGame()">🗑️ איפוס חשבון</button>
        </div>
    `;
    startGiftTimer();
    renderInstallBtn();
};

// --- לוגיקת מתנה ---
function claimDailyGift() {
    mobileLog("Action: Claim Gift");
    const bonus = 500 + ((window.lifeLevel || 1) * 250);
    window.money += bonus;
    window.lastGift = Date.now();
    if(typeof saveGame === 'function') saveGame();
    if(typeof updateUI === 'function') updateUI();
    window.openTab('home');
}

function startGiftTimer() {
    const timerEl = document.getElementById('giftTimer');
    const update = () => {
        if (!timerEl) return;
        const timeLeft = (4 * 60 * 60 * 1000) - (Date.now() - (window.lastGift || 0));
        if (timeLeft <= 0) {
            timerEl.innerText = "✅ מוכן!";
            document.getElementById('giftBtn').disabled = false;
        } else {
            const h = Math.floor(timeLeft / 3600000), m = Math.floor((timeLeft % 3600000) / 60000);
            timerEl.innerText = `⏳ עוד ${h}:${m}`;
            document.getElementById('giftBtn').disabled = true;
        }
    };
    update();
    setInterval(update, 60000);
}

// --- PWA ---
function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(cont && deferredPrompt) {
        cont.innerHTML = `<button class="action" style="background:#3b82f6; width:100%; margin-top:10px;" onclick="triggerInstall()">📲 התקן אפליקציה</button>`;
    }
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') deferredPrompt = null;
    renderInstallBtn();
}

window.editAdminMsg = function() {
    const pass = prompt("סיסמה:");
    if (pass === "1234") { 
        const newMsg = prompt("הודעה:", window.adminMsgText);
        if (newMsg !== null) { window.adminMsgText = newMsg; window.openTab('home'); }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => { window.openTab('home'); }, 150);
});
