/* Smart Money Pro - js/ui.js - v6.5.0 - Alexey Custom Edition */

let deferredPrompt;
let currentTab = 'home'; 
let msgTimer;

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
        
        if (progressEl) {
            progressEl.style.width = ld.progressPercent + "%";
        }
        
        if (xpTextEl) {
            xpTextEl.innerText = `${Math.floor(ld.xpInCurrentLevel).toLocaleString()} / ${Math.floor(ld.xpForNext).toLocaleString()} XP`;
        }
        
        if (levelValEl) {
            levelValEl.innerText = ld.level;
        }
    }
}

// --- מערכת ניווט ---
function openTab(t) {
    currentTab = t; 
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btnId = "btn" + t.charAt(0).toUpperCase() + t.slice(1);
    const btn = document.getElementById(btnId);
    if(btn) btn.classList.add("active");
    
    const c = document.getElementById("content"); 
    if(!c) return;
    
    c.innerHTML = "";
    switch(t) {
        case 'home':       drawHome(c); break;
        case 'work':       if(typeof drawWork === 'function') drawWork(c); break;
        case 'tasks':      if(typeof drawTasks === 'function') drawTasks(c); break; 
        case 'invest':     if(typeof drawInvest === 'function') drawInvest(c); break;
        case 'business':   if(typeof drawBusiness === 'function') drawBusiness(c); break;
        case 'estate':     if(typeof drawEstate === 'function') drawEstate(c); break; 
        case 'skills':     if(typeof drawSkills === 'function') drawSkills(c); break;
        case 'bank':       if(typeof drawBank === 'function') drawBank(c); break;
        case 'cars':       if(typeof drawCars === 'function') drawCars(c); break;
        case 'market':     if(typeof drawMarket === 'function') drawMarket(c); break;
        default:           drawHome(c);
    }
    
    window.scrollTo(0,0);
    if(typeof updateUI === 'function') updateUI();
}

// --- דף הבית המעודכן ---
function drawHome(c) {
    const ld = (typeof getLevelData === 'function') 
               ? getLevelData(window.lifeXP || 0) 
               : { level: 1, xpInCurrentLevel: 0, xpForNext: 1000, progressPercent: 0 };

    c.innerHTML = `
        <div class="card fade-in">
            <div id="admin-container"></div>

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
                <button id="giftBtn" onclick="claimDailyGift()" class="action-btn" style="width:100%; background:var(--yellow); color:#000; font-weight:bold; border:none; padding:10px; border-radius:8px; cursor:pointer;">🎁 קבלת בונוס</button>
                <div id="giftTimer" style="font-size:12px; margin-top:8px; color:var(--yellow); font-weight:bold;">טוען טיימר...</div>
            </div>

            <div class="grid-2">
                <div class="card" style="margin:0; padding:12px; text-align:center; border: 1px solid rgba(34, 197, 94, 0.2); background:rgba(34, 197, 94, 0.02);">
                    <small style="opacity:0.7; font-size:10px; display:block; margin-bottom:4px;">💰 הכנסה פסיבית</small>
                    <b id="passive-display" style="color:#22c55e; font-size:15px;">${(window.passive || 0).toLocaleString()} ₪/ש</b>
                </div>
                <div class="card" style="margin:0; padding:12px; text-align:center; border: 1px solid rgba(239, 68, 68, 0.2); background:rgba(239, 68, 68, 0.02);">
                    <small style="opacity:0.7; font-size:10px; display:block; margin-bottom:4px;">🏦 חוב לבנק</small>
                    <b style="color:#ef4444; font-size:15px;">${(window.loan || 0).toLocaleString()} ₪</b>
                </div>
            </div>

            <div class="card" style="margin-top:15px; padding:12px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05);">
                <small style="opacity:0.6; display:block; margin-bottom:10px;">🎒 הציוד שלי:</small>
                <div class="equipment-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:13px;">
                    <div>👕 <b>בגדים:</b> <span style="color:#94a3b8">בגדי עבודה</span></div>
                    <div>🚗 <b>רכב:</b> <span style="color:var(--yellow)">${(window.cars && window.cars.length > 0) ? window.cars[window.cars.length-1] : "הולך ברגל"}</span></div>
                    <div>📱 <b>טלפון:</b> <span style="color:#94a3b8">דור 5</span></div>
                    <div>🔑 <b>מפתח:</b> <span style="color:#94a3b8">דירה שכורה</span></div>
                </div>
            </div>

            <div id="install-container" style="margin-top:20px;"></div>

            <button class="sys-btn" style="border:1px solid #451a1a; color:#ef4444; margin-top:25px; font-size:11px; padding:10px; width:100%; opacity:0.7;" onclick="resetGame()">🗑️ איפוס חשבון</button>
        </div>
    `;
    startGiftTimer();
    renderInstallBtn();
}

// --- ניהול מתנה וטיימר 4 שעות ---
function claimDailyGift() {
    const now = Date.now();
    const waitTime = 4 * 60 * 60 * 1000; 

    if (window.lastGift && (now - window.lastGift < waitTime)) {
        showMsg("המתנה עדיין לא מוכנה...", "red");
        return;
    }

    const bonus = 500 + (window.lastKnownLevel * 250);
    window.money += bonus;
    window.lastGift = now;
    if(typeof saveGame === 'function') saveGame();
    if(typeof updateUI === 'function') updateUI();
    showMsg(`🎁 קיבלת בונוס של ${bonus.toLocaleString()}₪!`, "green");
}

function startGiftTimer() {
    const timerEl = document.getElementById('giftTimer');
    const btn = document.getElementById('giftBtn');
    
    const update = () => {
        if (!timerEl || !btn) return;
        const now = Date.now();
        const waitTime = 4 * 60 * 60 * 1000;
        const timeLeft = waitTime - (now - (window.lastGift || 0));

        if (timeLeft <= 0) {
            timerEl.innerText = "✅ המתנה מחכה לך!";
            timerEl.style.color = "#22c55e";
            btn.disabled = false;
            btn.style.opacity = "1";
        } else {
            const h = Math.floor(timeLeft / 3600000);
            const m = Math.floor((timeLeft % 3600000) / 60000);
            const s = Math.floor((timeLeft % 60000) / 1000);
            timerEl.innerText = `⏳ זמן נותר: ${h}ש' ${m}ד' ${s}ש'`;
            timerEl.style.color = "var(--yellow)";
            btn.disabled = true;
            btn.style.opacity = "0.5";
        }
    };
    
    update();
    const intv = setInterval(() => {
        if (!document.getElementById('giftTimer')) { clearInterval(intv); return; }
        update();
    }, 1000);
}

// --- עריכת הודעת מנהל בסיסמא ---
function editAdminMsg() {
    const pass = prompt("שלום אלכסיי, הכנס סיסמת מנהל לעריכה:");
    if (pass === "1234") { 
        const newMsg = prompt("הכנס הודעת מנהל חדשה:", window.adminMsgText || "");
        if (newMsg !== null) {
            window.adminMsgText = newMsg;
            if (typeof showMsg === 'function') showMsg("הודעה עודכנה בהצלחה!", "green");
            openTab('home'); // רענון התצוגה
        }
    } else if (pass !== null) {
        alert("סיסמא שגויה!");
    }
}

function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(!cont) return;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if(!isStandalone && deferredPrompt) {
        cont.innerHTML = `<button class="action" style="background:#3b82f6; color:#fff; font-weight:bold; width:100%; padding:12px; border-radius:8px; border:none; cursor:pointer;" onclick="triggerInstall()">📲 התקן כאפליקציה (PWA)</button>`;
    } else { cont.innerHTML = ""; }
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') { deferredPrompt = null; renderInstallBtn(); }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => { openTab('home'); }, 150);
});
