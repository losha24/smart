/* Smart Money Pro - js/ui.js - v7.9.5 - Complete Integration: Welcome Screen & Systems */

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
        <div class="card fade-in" style="text-align:center; padding:40px 20px; margin-top:30px;">
            <h1 style="color:var(--blue); margin-bottom:10px; font-size:28px;">💰 Smart Money Pro</h1>
            <p style="opacity:0.8; font-size:14px; margin-bottom:30px;">ברוך הבא למשחק הפיננסי שלך.<br>בוא נתחיל בבניית האימפריה.</p>
            
            <div style="margin-bottom:25px;">
                <label style="display:block; margin-bottom:10px; font-size:13px; opacity:0.7;">איך קוראים לך?</label>
                <input type="text" id="nameInput" placeholder="הכנס שם שחקן..." 
                    style="width:85%; padding:15px; border-radius:10px; border:1px solid rgba(255,255,255,0.2); background:rgba(0,0,0,0.3); color:white; text-align:center; font-size:18px; outline:none;">
            </div>
            
            <button onclick="startGameSession()" class="action-btn" style="width:90%; background:var(--blue); color:white; padding:15px; border-radius:10px; font-weight:bold; border:none; cursor:pointer; font-size:16px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">צא לדרך! 🚀</button>
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

// --- עדכון ויזואלי (XP, כסף פסיבי) ---
function renderUIUpdate(ld) {
    if (!ld && typeof getLevelData === 'function') {
        ld = getLevelData(window.lifeXP || 0);
    }

    if (currentTab === 'home' && ld) {
        const passiveEl = document.getElementById('passive-display');
        const progressEl = document.getElementById('xp-progress-bar');
        const xpTextEl = document.getElementById('xp-text-detail');
        const levelValEl = document.getElementById('home-level-val');
        
        if (passiveEl) passiveEl.innerText = (window.passive || 0).toLocaleString() + " ₪/ש";
        if (progressEl) progressEl.style.width = ld.progressPercent + "%";
        if (xpTextEl) xpTextEl.innerText = `${Math.floor(ld.xpInCurrentLevel).toLocaleString()} / ${Math.floor(ld.xpForNext).toLocaleString()} XP`;
        if (levelValEl) levelValEl.innerText = ld.level;
    }
}

// --- מערכת ניווט ---
window.openTab = function(t) {
    // הגנה: אם אין שם, תמיד להחזיר למסך פתיחה
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
        const drawFunc = window["draw" + t.charAt(0).toUpperCase() + t.slice(1)];
        if (typeof drawFunc === 'function') drawFunc(c);
        else window.drawHome(c);
        
        c.style.opacity = "1";
        if (t !== 'invest') window.scrollTo(0,0);
        if(typeof updateUI === 'function') updateUI();
    }, 100);
};

// --- דף הבית המלא ---
window.drawHome = function(c) {
    const userName = localStorage.getItem('gameUserName') || "שחקן";
    const ld = (typeof getLevelData === 'function') 
               ? getLevelData(window.lifeXP || 0) 
               : { level: 1, xpInCurrentLevel: 0, xpForNext: 1000, progressPercent: 0 };

    // רשימת שחקנים דינמית (השם שלך נלקח מהזיכרון)
    const allPlayers = [
        { name: "אבי כהן", money: 15500000, level: 25 },
        { name: `${userName} (אתה)`, money: window.money || 0, level: ld.level, isPlayer: true },
        { name: "מרינה לביא", money: 8200000, level: 18 },
        { name: "יוסי לוי", money: 4500000, level: 11 },
        { name: "רוני גיימר", money: 2100000, level: 8 },
        { name: "מיכל שרון", money: 1100000, level: 5 },
        { name: "עידן מזרחי", money: 950000, level: 4 }
    ].sort((a, b) => b.money - a.money);

    const totalPages = Math.ceil(allPlayers.length / playersPerPage);
    const paginated = allPlayers.slice((leaderboardPage - 1) * playersPerPage, leaderboardPage * playersPerPage);

    c.innerHTML = `
        <div class="card fade-in">
            <div id="admin-box" class="admin-box">
                <button class="edit-admin-btn" onclick="window.editAdminMsg()">✏️</button>
                📢 <b>מערכת:</b> <span style="font-size:13px;">${window.adminMsgText || "שלום " + userName + ", בהצלחה היום!"}</span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0;">🏠 מרכז שליטה</h3>
                <button onclick="location.reload();" class="sys-btn" style="padding:5px 12px; font-size:12px;">🔄 רענן</button>
            </div>
            
            <div class="card" style="background:rgba(255,255,255,0.03); margin-bottom:15px; padding:12px; border:1px solid rgba(255,255,255,0.1);">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:12px;">
                    <span>⭐ רמת חיים <b id="home-level-val">${ld.level}</b></span>
                    <span id="xp-text-detail" style="opacity:0.8;">${Math.floor(ld.xpInCurrentLevel).toLocaleString()} XP</span>
                </div>
                <div style="height:10px; background:rgba(0,0,0,0.3); border-radius:10px; overflow:hidden;">
                    <div id="xp-progress-bar" style="width:${ld.progressPercent}%; height:100%; background:linear-gradient(90deg, #3b82f6, #60a5fa);"></div>
                </div>
            </div>

            <div class="card" style="background:rgba(245, 158, 11, 0.05); border:1px solid rgba(245, 158, 11, 0.2); text-align:center; padding:15px; margin-bottom:15px;">
                <button id="giftBtn" onclick="claimDailyGift()" class="action-btn" style="width:100%; background:var(--yellow); color:#000; font-weight:bold;">🎁 קבלת בונוס</button>
                <div id="giftTimer" style="font-size:12px; margin-top:8px; color:var(--yellow);">טוען...</div>
            </div>

            <div class="grid-2">
                <div class="card" style="margin:0; padding:12px; text-align:center; background:rgba(34, 197, 94, 0.02);">
                    <small style="opacity:0.7; font-size:10px; display:block;">💰 פסיבי</small>
                    <b id="passive-display" style="color:#22c55e;">${(window.passive || 0).toLocaleString()} ₪</b>
                </div>
                <div class="card" style="margin:0; padding:12px; text-align:center; background:rgba(239, 68, 68, 0.02);">
                    <small style="opacity:0.7; font-size:10px; display:block;">🏦 חוב</small>
                    <b style="color:#ef4444;">${(window.loan || 0).toLocaleString()} ₪</b>
                </div>
            </div>

            <div class="card" style="margin-top:15px; padding:12px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05);">
                <small style="opacity:0.6; font-weight:bold; display:block; margin-bottom:10px;">🏆 דירוג (עמוד ${leaderboardPage}/${totalPages})</small>
                <div id="leaderboard" style="display:flex; flex-direction:column; gap:6px;">
                    ${paginated.map((p, i) => `
                        <div style="display:flex; align-items:center; justify-content:space-between; padding:8px; background:${p.isPlayer ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.03)'}; border-radius:6px; border: 1px solid ${p.isPlayer ? 'var(--blue)' : 'transparent'}">
                            <span style="font-size:12px; font-weight:bold;">${((leaderboardPage-1)*playersPerPage)+i+1}. ${p.name}</span>
                            <b style="font-size:12px; color:var(--green);">${Math.floor(p.money).toLocaleString()} ₪</b>
                        </div>
                    `).join('')}
                </div>
                <div style="display:flex; justify-content:center; gap:10px; margin-top:12px;">
                    <button onclick="changeLPage(-1)" ${leaderboardPage === 1 ? 'disabled style="opacity:0.3"' : ''} class="sys-btn" style="padding:4px 10px;">◀</button>
                    <button onclick="changeLPage(1)" ${leaderboardPage === totalPages ? 'disabled style="opacity:0.3"' : ''} class="sys-btn" style="padding:4px 10px;">▶</button>
                </div>
            </div>

            <div id="install-container" style="margin-top:20px;"></div>
            <button class="sys-btn" style="border:1px solid #451a1a; color:#ef4444; margin-top:25px; font-size:11px; width:100%;" onclick="resetGameSession()">🗑️ איפוס חשבון</button>
        </div>
    `;
    startGiftTimer();
    renderInstallBtn();
};

window.changeLPage = function(d) { leaderboardPage += d; window.openTab('home'); };

// --- מתנה וטיימר ---
function claimDailyGift() {
    const now = Date.now();
    if (window.lastGift && (now - window.lastGift < 14400000)) return;
    const bonus = 500 + ((typeof getLevelData === 'function' ? getLevelData(window.lifeXP).level : 1) * 250);
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
            timerEl.innerText = "✅ המתנה מוכנה!"; btn.disabled = false; btn.style.opacity = "1";
        } else {
            const h = Math.floor(left / 3600000), m = Math.floor((left % 3600000) / 60000), s = Math.floor((left % 60000) / 1000);
            timerEl.innerText = `⏳ ${h}ש' ${m}ד' ${s}ש'`;
            btn.disabled = true; btn.style.opacity = "0.5";
        }
    };
    update();
    const intv = setInterval(() => {
        if(!document.getElementById('giftTimer')) clearInterval(intv);
        else update();
    }, 1000);
}

// --- איפוס חשבון (Reset) ---
window.resetGameSession = function() {
    if (confirm('כל הנתונים ימחקו והאפליקציה תחזור למסך הפתיחה. להמשיך?')) {
        localStorage.removeItem('gameUserName');
        if (typeof resetGame === 'function') resetGame();
        location.reload();
    }
};

// --- PWA ---
function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(!cont || window.matchMedia('(display-mode: standalone)').matches || !deferredPrompt) return;
    cont.innerHTML = `<button class="action" style="background:#3b82f6; width:100%; border-radius:8px; border:none; color:white; padding:12px; font-weight:bold;" onclick="triggerInstall()">📲 התקן אפליקציה</button>`;
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') { deferredPrompt = null; renderInstallBtn(); }
}

// --- תפריט מנהל ---
window.editAdminMsg = function() {
    const pass = prompt("שלום אלכסיי, הכנס סיסמת מנהל:");
    if (pass === localStorage.getItem('adminPass')) { 
        const action = prompt("1-הודעה, 2-כסף, 3-XP, 4-סיסמה, 5-Debug", "1");
        switch(action) {
            case "1": window.adminMsgText = prompt("הודעה חדשה:"); window.openTab('home'); break;
            case "2": window.money += parseInt(prompt("כמה?") || 0); updateUI(); window.openTab('home'); break;
            case "3": window.lifeXP += parseInt(prompt("כמה?") || 0); updateUI(); window.openTab('home'); break;
            case "4": 
                const newP = prompt("סיסמה חדשה (מינימום 4):");
                if(newP && newP.length >= 4) localStorage.setItem('adminPass', newP);
                break;
            case "5":
                const s = document.createElement('script'); s.src = 'js/debug.js?v=' + Date.now();
                document.body.appendChild(s);
                break;
        }
    } else if (pass !== null) alert("שגויה!");
};

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initApp, 150);
});
