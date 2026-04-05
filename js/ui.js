/* Smart Money Pro - js/ui.js - v7.9.8 - Cloud Sync & Live Leaderboard */

let deferredPrompt;
let currentTab = 'home'; 
let leaderboardPage = 1;
const playersPerPage = 4;
window.adminMsgText = "המערכת מחוברת לענן (Firebase). הנתונים מסונכרנים בזמן אמת.";

// --- אבטחת מנהל ---
if (!localStorage.getItem('adminPass')) {
    localStorage.setItem('adminPass', '1234');
}

// --- [חדש] פונקציית אתחול אפליקציה מול ענן ---
window.initApp = async function() {
    const content = document.getElementById("content");
    if (content) content.innerHTML = '<div style="text-align:center; margin-top:100px; color:var(--blue); font-family:sans-serif;">טוען נתונים מהענן... ⏳</div>';

    try {
        // מנסה לטעון נתונים מהענן (מוגדר ב-core.js)
        const isLoaded = await window.loadGameFromCloud();
        
        if (isLoaded) {
            console.log("Cloud Data Synced.");
        } else {
            console.log("New User or Local Only.");
            // אם אין משתמש בענן, ננסה לטעון מ-Local Storage הישן
            if (typeof loadGame === 'function') loadGame();
        }
        window.openTab('home');
    } catch (err) {
        console.error("Init failed:", err);
        window.openTab('home');
    }
};

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    renderInstallBtn();
});

// --- עדכון ויזואלי בזמן אמת ---
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

// --- מערכת ניווט טאבים ---
window.openTab = function(t) {
    currentTab = t; 
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btnId = "btn" + t.charAt(0).toUpperCase() + t.slice(1);
    const btn = document.getElementById(btnId);
    if(btn) btn.classList.add("active");
    
    const c = document.getElementById("content"); 
    if(!c) return;
    
    c.style.opacity = "0.5"; 
    setTimeout(() => {
        c.innerHTML = "";
        const drawFunc = window["draw" + t.charAt(0).toUpperCase() + t.slice(1)];
        if (typeof drawFunc === 'function') drawFunc(c);
        else window.drawHome(c);
        c.style.opacity = "1";
        if(typeof updateUI === 'function') updateUI();
    }, 100);
};

// --- דף הבית עם דירוג חי מ-Firebase ---
window.drawHome = async function(c) {
    const ld = (typeof getLevelData === 'function') 
               ? getLevelData(window.lifeXP || 0) 
               : { level: 1, xpInCurrentLevel: 0, xpForNext: 1000, progressPercent: 0 };

    // 1. יצירת המבנה הבסיסי של הדף
    c.innerHTML = `
        <div class="card fade-in">
            <div id="admin-box" class="admin-box">
                <button class="edit-admin-btn" onclick="window.editAdminMsg()">✏️</button>
                📢 <b>הודעה מהמערכת:</b><br>
                <span style="font-size:13px;">${window.adminMsgText}</span>
            </div>

            <div class="card" style="background:rgba(255,255,255,0.03); margin-bottom:15px; padding:12px; border:1px solid rgba(255,255,255,0.1);">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:12px;">
                    <span>⭐ רמת חיים <b id="home-level-val">${ld.level}</b></span>
                    <span id="xp-text-detail" style="opacity:0.8;">${Math.floor(ld.xpInCurrentLevel).toLocaleString()} / ${Math.floor(ld.xpForNext).toLocaleString()} XP</span>
                </div>
                <div style="height:10px; background:rgba(0,0,0,0.3); border-radius:10px; overflow:hidden;">
                    <div id="xp-progress-bar" style="width:${ld.progressPercent}%; height:100%; background:linear-gradient(90deg, #3b82f6, #60a5fa);"></div>
                </div>
            </div>

            <div class="card" style="background:rgba(245, 158, 11, 0.05); border:1px solid rgba(245, 158, 11, 0.3); text-align:center; padding:15px; margin-bottom:15px;">
                <button id="giftBtn" onclick="claimDailyGift()" class="action-btn" style="width:100%; background:var(--yellow); color:#000; font-weight:bold;">🎁 קבלת בונוס</button>
                <div id="giftTimer" style="font-size:12px; margin-top:8px; color:var(--yellow);">טוען...</div>
            </div>

            <div class="grid-2">
                <div class="card" style="margin:0; padding:12px; text-align:center;">
                    <small style="opacity:0.7; font-size:10px;">💰 פסיבי</small><br>
                    <b id="passive-display" style="color:#22c55e;">${(window.passive || 0).toLocaleString()} ₪/ש</b>
                </div>
                <div class="card" style="margin:0; padding:12px; text-align:center;">
                    <small style="opacity:0.7; font-size:10px;">🏦 חוב</small><br>
                    <b style="color:#ef4444;">${(window.loan || 0).toLocaleString()} ₪</b>
                </div>
            </div>

            <div class="card" style="margin-top:15px; padding:12px; background:rgba(255,255,255,0.02);">
                <small style="opacity:0.6; font-weight:bold;">🏆 דירוג עולמי חי:</small>
                <div id="live-leaderboard" style="margin-top:10px; display:flex; flex-direction:column; gap:8px;">
                    <div style="text-align:center; font-size:12px; opacity:0.5;">טוען שחקנים...</div>
                </div>
            </div>

            <div id="install-container" style="margin-top:20px;"></div>
            <button class="sys-btn" style="color:#ef4444; margin-top:25px; width:100%; opacity:0.5;" onclick="resetGame()">🗑️ איפוס חשבון</button>
        </div>
    `;

    startGiftTimer();
    renderInstallBtn();
    
    // 2. משיכת נתונים אמיתיים מ-Firebase לטבלת הדירוג
    try {
        const snapshot = await db.collection("players").orderBy("money", "desc").limit(10).get();
        const lbContainer = document.getElementById('live-leaderboard');
        if (!lbContainer) return;
        
        let html = "";
        let rank = 1;
        snapshot.forEach(doc => {
            const p = doc.data();
            const isMe = doc.id === (auth.currentUser ? auth.currentUser.uid : "");
            html += `
                <div style="display:flex; align-items:center; justify-content:space-between; padding:8px; background:${isMe ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.03)'}; border-radius:6px; border:1px solid ${isMe ? 'var(--blue)' : 'transparent'}">
                    <span style="font-size:12px; width:20px;">${rank}.</span>
                    <span style="flex:1; font-size:13px; font-weight:${isMe ? 'bold' : 'normal'}">${p.name || 'שחקן'} ${isMe ? '(אתה)' : ''}</span>
                    <span style="color:var(--green); font-size:12px; font-weight:bold;">${Math.floor(p.money).toLocaleString()} ₪</span>
                </div>
            `;
            rank++;
        });
        lbContainer.innerHTML = html;
    } catch (e) {
        document.getElementById('live-leaderboard').innerHTML = "שגיאה בטעינת דירוג";
    }
};

// --- ניהול מתנה ---
function claimDailyGift() {
    const now = Date.now();
    const waitTime = 4 * 60 * 60 * 1000; 
    if (window.lastGift && (now - window.lastGift < waitTime)) return;
    const currentLvl = (typeof getLevelData === 'function') ? getLevelData(window.lifeXP).level : 1;
    const bonus = 500 + (currentLvl * 250);
    window.money += bonus;
    window.lastGift = now;
    if(typeof saveGame === 'function') saveGame();
    if(typeof updateUI === 'function') updateUI();
    showMsg(`🎁 קיבלת ${bonus.toLocaleString()}₪!`, "var(--green)");
    window.openTab('home');
}

function startGiftTimer() {
    const timerEl = document.getElementById('giftTimer'), btn = document.getElementById('giftBtn');
    const update = () => {
        if (!timerEl || !btn) return;
        const timeLeft = (4 * 60 * 60 * 1000) - (Date.now() - (window.lastGift || 0));
        if (timeLeft <= 0) {
            timerEl.innerText = "✅ המתנה מוכנה!";
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

// --- פונקציות PWA & Admin (נשארות דומות) ---
function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(!cont || window.matchMedia('(display-mode: standalone)').matches || !deferredPrompt) return;
    cont.innerHTML = `<button class="action" style="background:#3b82f6; width:100%; border-radius:8px;" onclick="triggerInstall()">📲 התקן כאפליקציה</button>`;
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
        const newMsg = prompt("הודעה חדשה:", window.adminMsgText);
        if (newMsg) { window.adminMsgText = newMsg; window.openTab('home'); }
    } else alert("סיסמה שגויה");
};
