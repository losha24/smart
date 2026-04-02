/* Smart Money Pro - js/ui.js - v6.6.2 - Full Restoration + Debug */

let deferredPrompt;
let currentTab = 'home'; 
let lastScrollPos = 0;

// --- פאנל דיבאג לנייד (שורת המעקב בתחתית) ---
function mobileLog(msg) {
    let debugDiv = document.getElementById('mobile-debug-log');
    if (!debugDiv) {
        debugDiv = document.createElement('div');
        debugDiv.id = 'mobile-debug-log';
        debugDiv.style = "position:fixed; bottom:0; left:0; width:100%; height:30px; background:rgba(0,0,0,0.85); color:#00ff00; font-family:monospace; font-size:10px; z-index:10000; padding:5px; pointer-events:none; border-top:1px solid #3b82f6; display:flex; align-items:center;";
        document.body.appendChild(debugDiv);
    }
    debugDiv.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}`;
}

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
        
        if (passiveEl) passiveEl.innerText = (window.passive || 0).toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + " ₪/ש";
        if (progressEl) progressEl.style.width = ld.progressPercent + "%";
        if (xpTextEl) xpTextEl.innerText = `${Math.floor(ld.xpInCurrentLevel).toLocaleString()} / ${Math.floor(ld.xpForNext).toLocaleString()} XP`;
        if (levelValEl) levelValEl.innerText = ld.level;
    }
}

// --- מערכת ניווט עם הגנת שוק ---
window.openTab = function(t) {
    const stack = new Error().stack;
    const isAuto = stack.includes('setInterval') || stack.includes('setTimeout');
    
    // שמירת גלילה לשוק
    if (currentTab === 'market') lastScrollPos = window.scrollY;

    // חסימת ריענון אוטומטי בשוק
    if (currentTab === 'market' && t === 'market' && isAuto) {
        mobileLog("Blocked auto-jump on Market");
        return; 
    }

    mobileLog(`Tab: ${t} | Mode: ${isAuto ? 'AUTO' : 'MANUAL'}`);
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
        if (typeof drawFunc === 'function') drawFunc(c);
        else window.drawHome(c);
        
        c.style.opacity = "1";
        
        if (t === 'market') window.scrollTo(0, lastScrollPos);
        else window.scrollTo(0, 0);
        
        if(typeof updateUI === 'function' && t !== 'market') updateUI();
    }, 120);
};

// --- דף הבית המלא (6.5.0) ---
window.drawHome = function(c) {
    const ld = (typeof getLevelData === 'function') 
               ? getLevelData(window.lifeXP || 0) 
               : { level: 1, xpInCurrentLevel: 0, xpForNext: 1000, progressPercent: 0 };

    // אייקונים לציוד
    let invIcons = "";
    if(window.skills?.length > 0) invIcons += "🎓 ";
    if(window.cars?.length > 0) invIcons += "🚗 ";
    if(window.business?.length > 0) invIcons += "🏢 ";
    if(window.propertys?.length > 0) invIcons += "🏠 ";

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
                <button id="giftBtn" onclick="claimDailyGift()" class="action-btn" style="width:100%; background:var(--yellow); color:#000; font-weight:bold; border:none; padding:12px; border-radius:8px;">🎁 קבלת בונוס</button>
                <div id="giftTimer" style="font-size:12px; margin-top:8px; color:var(--yellow); font-weight:bold;">טוען...</div>
            </div>

            <div class="grid-2">
                <div class="card" style="text-align:center; border: 1px solid rgba(34, 197, 94, 0.2); background:rgba(34, 197, 94, 0.02);">
                    <small style="opacity:0.7; font-size:10px; display:block;">💰 פסיבי</small>
                    <b id="passive-display" style="color:#22c55e; font-size:15px;">${(window.passive || 0).toLocaleString()} ₪/ש</b>
                </div>
                <div class="card" style="text-align:center; border: 1px solid rgba(239, 68, 68, 0.2); background:rgba(239, 68, 68, 0.02);">
                    <small style="opacity:0.7; font-size:10px; display:block;">🏦 חוב</small>
                    <b style="color:#ef4444; font-size:15px;">${(window.loan || 0).toLocaleString()} ₪</b>
                </div>
            </div>

            <div class="card" style="margin-top:15px; padding:12px; background:rgba(255,255,255,0.02); text-align:center;">
                <small style="opacity:0.6; display:block; margin-bottom:10px;">🎒 הציוד שלי:</small>
                <div style="font-size:24px; letter-spacing:10px;">${invIcons || "📦 (ריק)"}</div>
            </div>

            <div id="install-container" style="margin-top:20px;"></div>
            <button class="sys-btn" style="color:#ef4444; margin-top:25px; width:100%; opacity:0.5; font-size:11px;" onclick="resetGame()">🗑️ איפוס חשבון</button>
        </div>
    `;
    startGiftTimer();
    renderInstallBtn();
};

// --- ניהול מתנה ---
function claimDailyGift() {
    const now = Date.now();
    const waitTime = 4 * 60 * 60 * 1000; 
    if (window.lastGift && (now - window.lastGift < waitTime)) return;
    const bonus = 500 + ((window.lifeLevel || 1) * 250);
    window.money += bonus;
    window.lastGift = now;
    if(typeof saveGame === 'function') saveGame();
    if(typeof updateUI === 'function') updateUI();
    window.openTab('home');
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
            timerEl.innerText = `⏳ עוד ${h}ש' ${m}ד' ${s}ש'`;
            btn.disabled = true; btn.style.opacity = "0.5";
        }
    };
    update();
    const intv = setInterval(() => { if(!document.getElementById('giftTimer')) clearInterval(intv); else update(); }, 1000);
}

// --- שחזור כישורים ורכבים מלא (6.5.0) ---
window.drawSkills = function(c) {
    c.innerHTML = `<h3>🎓 כישורים</h3><div id="skills-list" class="grid-1"></div>`;
    const skills = [
        {id:'s1', n:'ניהול זמן', p:1000, xp:200}, {id:'s2', n:'אוריינות פיננסית', p:3500, xp:600},
        {id:'s3', n:'שיווק ומכירות', p:8000, xp:1500}, {id:'s4', n:'פיתוח אפליקציות', p:15000, xp:3500}
    ];
    skills.forEach(s => {
        const owned = window.skills?.includes(s.id);
        document.getElementById('skills-list').innerHTML += `<div class="card"><b>${s.n}</b><br><button onclick="buySkill('${s.id}',${s.p},${s.xp})" class="action-btn" ${owned?'disabled':''}>${owned?'נרכש':s.p+'₪'}</button></div>`;
    });
};

window.drawCars = function(c) {
    c.innerHTML = `<h3>🚗 רכבים</h3><div id="cars-list" class="grid-1"></div>`;
    const cars = [{id:'c1', n:'קורקינט', p:2500, i:'🛴'}, {id:'c2', n:'אופנוע', p:15000, i:'🛵'}, {id:'c3', n:'מכונית', p:45000, i:'🚗'}];
    cars.forEach(car => {
        const owned = window.cars?.includes(car.id);
        document.getElementById('cars-list').innerHTML += `<div class="card" style="text-align:center"><div>${car.i}</div><b>${car.n}</b><br><button onclick="buyCar('${car.id}',${car.p})" class="action-btn" ${owned?'disabled':''}>${owned?'בבעלות':car.p+'₪'}</button></div>`;
    });
};

// --- פונקציות עזר ו-PWA ---
window.editAdminMsg = function() {
    const pass = prompt("סיסמת מנהל:");
    if (pass === "1234") { 
        const newMsg = prompt("הודעה:", window.adminMsgText || "");
        if (newMsg !== null) { window.adminMsgText = newMsg; window.openTab('home'); }
    }
};

function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(cont && !window.matchMedia('(display-mode: standalone)').matches && deferredPrompt) {
        cont.innerHTML = `<button class="action" style="background:#3b82f6; width:100%; border-radius:8px; color:white; padding:12px;" onclick="triggerInstall()">📲 התקן אפליקציה</button>`;
    }
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') deferredPrompt = null;
    renderInstallBtn();
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => { window.openTab('home'); }, 150);
});
