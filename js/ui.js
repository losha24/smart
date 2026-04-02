/* Smart Money Pro - js/ui.js - v6.5.9-Hybrid - 6.5.0 Base + Debug Trap */

let deferredPrompt;
let currentTab = 'home'; 

// --- מלכודת שגיאות וזיהוי קריאות (Debug Trace) ---
const debugLog = (action, tabName) => {
    const err = new Error();
    const stack = err.stack.split('\n')[3] || "Unknown Source";
    console.groupCollapsed(`%c[UI-DEBUG] ${action}: ${tabName}`, "color: #3b82f6; font-weight: bold;");
    console.log("Source:", stack.trim());
    console.trace("Full Call Stack (מי קרא לפונקציה):"); 
    console.groupEnd();
};

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    renderInstallBtn();
});

// --- עדכון ויזואלי מהיר (נקרא מה-Core) ---
function renderUIUpdate(ld) {
    if (!ld && typeof getLevelData === 'function') {
        ld = getLevelData(window.lifeXP || 0);
    }

    if (currentTab === 'home' && ld) {
        const passiveEl = document.getElementById('passive-display');
        const progressEl = document.getElementById('xp-progress-bar');
        const xpTextEl = document.getElementById('xp-text-detail');
        const levelValEl = document.getElementById('home-level-val');
        
        if (passiveEl) {
            passiveEl.innerText = (window.passive || 0).toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + " ₪/ש";
        }
        if (progressEl) progressEl.style.width = ld.progressPercent + "%";
        if (xpTextEl) {
            xpTextEl.innerText = `${Math.floor(ld.xpInCurrentLevel).toLocaleString()} / ${Math.floor(ld.xpForNext).toLocaleString()} XP`;
        }
        if (levelValEl) levelValEl.innerText = ld.level;
    }
}

// --- מערכת ניווט (עם הגנת ריענון לשוק) ---
window.openTab = function(t) {
    debugLog("Attempting to open Tab", t);

    // הגנה: אם אנחנו בשוק ומנסים לרענן אותו אוטומטית (לא בלחיצה ידנית) - נחסום
    if (currentTab === 'market' && t === 'market') {
        const stack = new Error().stack;
        if (stack.includes('setInterval') || stack.includes('setTimeout')) {
            console.warn("[UI-BLOCK] מנעתי ריענון אוטומטי של השוק כדי למנוע קפיצות תוכן.");
            return; 
        }
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
        switch(t) {
            case 'home':       window.drawHome(c); break;
            case 'skills':     if(typeof window.drawSkills === 'function') window.drawSkills(c); break;
            case 'cars':       if(typeof window.drawCars === 'function') window.drawCars(c); break;
            case 'market':     if(typeof window.drawMarket === 'function') window.drawMarket(c); break;
            // הוסף כאן את שאר הטאבים (work, invest וכו') אם קיימים בגרסה שלך
            default:           
                const drawFunc = window["draw" + t.charAt(0).toUpperCase() + t.slice(1)];
                if(typeof drawFunc === 'function') drawFunc(c);
                else window.drawHome(c);
        }
        
        c.style.opacity = "1";
        window.scrollTo(0,0);
        
        // עדכון UI כללי - חסום בתוך השוק כדי למנוע ריצוד נתונים
        if(typeof updateUI === 'function' && t !== 'market') updateUI();
    }, 120);
};

// --- דף הבית (6.5.0 המקורי) ---
window.drawHome = function(c) {
    const ld = (typeof getLevelData === 'function') 
               ? getLevelData(window.lifeXP || 0) 
               : { level: 1, xpInCurrentLevel: 0, xpForNext: 1000, progressPercent: 0 };

    c.innerHTML = `
        <div class="card fade-in">
            <div id="admin-box" style="margin-bottom:15px; border:1px solid rgba(59,130,246,0.5); padding:10px; border-radius:8px; background:rgba(59,130,246,0.05);">
                📢 <b>הודעת מערכת:</b> 
                <button onclick="window.editAdminMsg()" style="float:left; background:none; border:none; color:var(--blue); cursor:pointer;">✏️</button>
                <br><span style="font-size:13px;">${window.adminMsgText || "ברוך הבא, המערכת פועלת כסדרה."}</span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0;">🏠 מרכז שליטה</h3>
                <button onclick="forceUpdate()" class="sys-btn" style="padding:5px 12px; font-size:12px;">🔄 רענן</button>
            </div>
            
            <div class="card" style="background:rgba(255,255,255,0.03); margin-bottom:15px; padding:12px; border:1px solid rgba(255,255,255,0.1);">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:12px;">
                    <span>⭐ רמת חיים <b id="home-level-val">${ld.level}</b></span>
                    <span id="xp-text-detail" style="opacity:0.8;">${Math.floor(ld.xpInCurrentLevel).toLocaleString()} / ${Math.floor(ld.xpForNext).toLocaleString()} XP</span>
                </div>
                <div style="height:10px; background:rgba(0,0,0,0.3); border-radius:10px; overflow:hidden;">
                    <div id="xp-progress-bar" style="width:${ld.progressPercent}%; height:100%; background:linear-gradient(90deg, #3b82f6, #60a5fa); transition: width 0.4s ease;"></div>
                </div>
            </div>

            <div class="card" style="background:rgba(245, 158, 11, 0.05); border:1px solid rgba(245, 158, 11, 0.3); text-align:center; padding:15px; margin-bottom:15px;">
                <button id="giftBtn" onclick="claimDailyGift()" class="action-btn" style="width:100%; background:var(--yellow); color:#000; font-weight:bold;">🎁 קבלת בונוס</button>
                <div id="giftTimer" style="font-size:12px; margin-top:8px; color:var(--yellow); font-weight:bold;">טוען...</div>
            </div>

            <div class="grid-2">
                <div class="card" style="text-align:center; border: 1px solid rgba(34, 197, 94, 0.2);">
                    <small style="opacity:0.7; font-size:10px; display:block;">💰 פסיבי</small>
                    <b id="passive-display" style="color:#22c55e;">${(window.passive || 0).toLocaleString()} ₪/ש</b>
                </div>
                <div class="card" style="text-align:center; border: 1px solid rgba(239, 68, 68, 0.2);">
                    <small style="opacity:0.7; font-size:10px; display:block;">🏦 חוב</small>
                    <b style="color:#ef4444;">${(window.loan || 0).toLocaleString()} ₪</b>
                </div>
            </div>

            <div class="card" style="margin-top:15px; padding:12px; background:rgba(255,255,255,0.02);">
                <small style="opacity:0.6; display:block; margin-bottom:10px;">🎒 הציוד שלי:</small>
                <div class="equipment-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:13px;">
                    <div>👕 <b>בגדים:</b> <span style="color:#94a3b8">עבודה</span></div>
                    <div>🚗 <b>רכב:</b> <span style="color:var(--yellow)">${(window.cars && window.cars.length > 0) ? "רכב בבעלות" : "הולך ברגל"}</span></div>
                    <div>📱 <b>טלפון:</b> <span style="color:#94a3b8">iPhone 15</span></div>
                    <div>🔑 <b>מפתח:</b> <span style="color:#94a3b8">דירה</span></div>
                </div>
            </div>

            <div id="install-container" style="margin-top:20px;"></div>
            <button class="sys-btn" style="color:#ef4444; margin-top:25px; width:100%; opacity:0.5;" onclick="resetGame()">🗑️ איפוס חשבון</button>
        </div>
    `;
    startGiftTimer();
    renderInstallBtn();
};

// --- ניהול מתנה ---
function claimDailyGift() {
    debugLog("Action", "Claiming Gift");
    const now = Date.now();
    const waitTime = 4 * 60 * 60 * 1000; 
    if (window.lastGift && (now - window.lastGift < waitTime)) return;

    const bonus = 500 + ((window.lifeLevel || 1) * 250);
    window.money += bonus;
    window.lastGift = now;
    if(typeof saveGame === 'function') saveGame();
    if(typeof updateUI === 'function') updateUI();
    if(typeof showMsg === 'function') showMsg(`🎁 בונוס של ${bonus.toLocaleString()}₪ התקבל!`, "green");
}

function startGiftTimer() {
    const timerEl = document.getElementById('giftTimer');
    const btn = document.getElementById('giftBtn');
    const update = () => {
        if (!timerEl || !btn) return;
        const timeLeft = (4 * 60 * 60 * 1000) - (Date.now() - (window.lastGift || 0));
        if (timeLeft <= 0) {
            timerEl.innerText = "✅ המתנה מוכנה!";
            btn.disabled = false; btn.style.opacity = "1";
        } else {
            const h = Math.floor(timeLeft / 3600000), m = Math.floor((timeLeft % 3600000) / 60000), s = Math.floor((timeLeft % 60000) / 1000);
            timerEl.innerText = `⏳ עוד ${h}:${m}:${s}`;
            btn.disabled = true; btn.style.opacity = "0.5";
        }
    };
    update();
    const intv = setInterval(() => { if(!document.getElementById('giftTimer')) clearInterval(intv); else update(); }, 1000);
}

// --- ניהול התקנה (PWA) ---
function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(!cont) return;
    if(!window.matchMedia('(display-mode: standalone)').matches && deferredPrompt) {
        cont.innerHTML = `<button class="action" style="background:#3b82f6; width:100%; border-radius:8px; color:white; padding:12px; font-weight:bold;" onclick="triggerInstall()">📲 התקן כאפליקציה</button>`;
    }
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') { deferredPrompt = null; renderInstallBtn(); }
}

window.editAdminMsg = function() {
    const pass = prompt("סיסמת מנהל:");
    if (pass === "1234") { 
        const newMsg = prompt("הודעה חדשה:", window.adminMsgText || "");
        if (newMsg !== null) { window.adminMsgText = newMsg; window.openTab('home'); }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => { window.openTab('home'); }, 150);
});
