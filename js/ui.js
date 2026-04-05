/* Smart Money Pro - js/ui.js - v7.8.5 - Final Integration: Paging & Admin Security */

let deferredPrompt;
let currentTab = 'home'; 
let leaderboardPage = 1;
const playersPerPage = 4;

// --- אבטחת מנהל: סיסמה נשמרת ב-Storage ---
if (!localStorage.getItem('adminPass')) {
    localStorage.setItem('adminPass', '1234');
}

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

// --- מערכת ניווט טאבים ---
window.openTab = function(t) {
    const isAuto = new Error().stack.includes('setInterval');
    if (t === currentTab && isAuto) return;

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
        if (t !== 'invest') window.scrollTo(0,0);
        if(typeof updateUI === 'function') updateUI();
    }, 100);
};

// --- דף הבית המלא עם דפדוף בדירוג ---
window.drawHome = function(c) {
    const ld = (typeof getLevelData === 'function') 
               ? getLevelData(window.lifeXP || 0) 
               : { level: 1, xpInCurrentLevel: 0, xpForNext: 1000, progressPercent: 0 };

    // רשימת שחקנים (בדיקה עם 8 שחקנים ליצירת 2 דפים)
    const allPlayers = [
        { name: "אבי כהן", money: 12500000, level: 20 },
        { name: "אלכסיי (אתה)", money: window.money || 0, level: ld.level, isPlayer: true },
        { name: "מרינה לביא", money: 5200000, level: 15 },
        { name: "יוסי לוי", money: 2850000, level: 9 },
        { name: "רוני גיימר", money: 1100000, level: 6 },
        { name: "מיכל שרון", money: 850000, level: 4 },
        { name: "עידן מזרחי", money: 500000, level: 3 },
        { name: "דנה וייס", money: 250000, level: 1 }
    ].sort((a, b) => b.money - a.money);

    const totalPages = Math.ceil(allPlayers.length / playersPerPage);
    if (leaderboardPage > totalPages) leaderboardPage = totalPages;
    
    const startIdx = (leaderboardPage - 1) * playersPerPage;
    const paginatedPlayers = allPlayers.slice(startIdx, startIdx + playersPerPage);

    c.innerHTML = `
        <div class="card fade-in">
            <div id="admin-box" class="admin-box">
                <button class="edit-admin-btn" onclick="window.editAdminMsg()">✏️</button>
                📢 <b>הודעה מהמערכת:</b><br>
                <span style="font-size:13px;">${window.adminMsgText || "ברוכים הבאים למערכת הדירוג החדשה!"}</span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0;">🏠 מרכז שליטה</h3>
                <button onclick="location.reload();" class="sys-btn" style="padding:5px 12px; font-size:12px;">🔄 רענן</button>
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
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <small style="opacity:0.6; font-weight:bold;">🏆 דירוג עולמי (עמוד ${leaderboardPage}/${totalPages}):</small>
                </div>
                <div id="leaderboard-container" style="display:flex; flex-direction:column; gap:8px;">
                    ${paginatedPlayers.map((p, index) => {
                        const rank = startIdx + index + 1;
                        return `
                        <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 10px; background:${p.isPlayer ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.03)'}; border-radius:6px; border: 1px solid ${p.isPlayer ? 'var(--blue)' : 'transparent'}">
                            <div style="display:flex; align-items:center; gap:10px;">
                                <span style="font-size:13px; width:20px; font-weight:bold; color:var(--yellow)">${rank}.</span>
                                <div>
                                    <div style="font-size:13px; font-weight:bold; color:${p.isPlayer ? 'var(--blue)' : '#fff'}">${p.name}</div>
                                    <div style="font-size:10px; opacity:0.5;">רמה ${p.level}</div>
                                </div>
                            </div>
                            <div style="font-size:13px; color:var(--green); font-weight:bold;">${Math.floor(p.money).toLocaleString()} ₪</div>
                        </div>`;
                    }).join('')}
                </div>

                <div style="display:flex; justify-content:center; align-items:center; gap:15px; margin-top:15px;">
                    <button onclick="changeLPage(-1)" ${leaderboardPage === 1 ? 'disabled style="opacity:0.3"' : ''} class="sys-btn" style="padding:5px 15px;">◀ הקודם</button>
                    <span style="font-size:13px; font-weight:bold;">${leaderboardPage} / ${totalPages}</span>
                    <button onclick="changeLPage(1)" ${leaderboardPage === totalPages ? 'disabled style="opacity:0.3"' : ''} class="sys-btn" style="padding:5px 15px;">הבא ▶</button>
                </div>
            </div>

            <div id="install-container" style="margin-top:20px;"></div>

            <button class="sys-btn" style="border:1px solid #451a1a; color:#ef4444; margin-top:25px; font-size:11px; padding:10px; width:100%; opacity:0.7;" onclick="if(confirm('לאפס הכל?')) resetGame()">🗑️ איפוס חשבון</button>
        </div>
    `;
    startGiftTimer();
    renderInstallBtn();
};

window.changeLPage = function(direction) {
    leaderboardPage += direction;
    window.openTab('home');
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
    if(typeof showMsg === 'function') showMsg(`🎁 קיבלת ${bonus.toLocaleString()}₪!`, "var(--green)");
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
            timerEl.innerText = `⏳ ${h}ש' ${m}ד' ${s}ש'`;
            btn.disabled = true; btn.style.opacity = "0.5";
        }
    };
    update();
    setInterval(update, 1000);
}

// --- פונקציות PWA ---
function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(!cont || window.matchMedia('(display-mode: standalone)').matches || !deferredPrompt) return;
    cont.innerHTML = `<button class="action" style="background:#3b82f6; width:100%; border-radius:8px; border:none; color:white; padding:12px; font-weight:bold;" onclick="triggerInstall()">📲 התקן כאפליקציה</button>`;
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') { deferredPrompt = null; renderInstallBtn(); }
}

// --- תפריט מנהל מורחב (v7.8.5) ---
window.editAdminMsg = function() {
    const savedPass = localStorage.getItem('adminPass');
    const pass = prompt("שלום אלכסיי, הכנס סיסמת מנהל:");
    
    if (pass === savedPass) { 
        const action = prompt(
            "--- תפריט מנהל ---\n" +
            "1 - עריכת הודעת מערכת\n" +
            "2 - הוספת כסף (Cheat)\n" +
            "3 - הוספת XP (Boost)\n" +
            "4 - שינוי סיסמת מנהל\n" +
            "5 - הרצת System Check", 
            "1"
        );
        
        switch(action) {
            case "1":
                const newMsg = prompt("הכנס הודעה חדשה:", window.adminMsgText || "");
                if (newMsg !== null) { window.adminMsgText = newMsg; window.openTab('home'); }
                break;
            case "2":
                const m = prompt("כמה כסף להוסיף?");
                if (m) { window.money += parseInt(m); updateUI(); saveGame(); window.openTab('home'); }
                break;
            case "3":
                const x = prompt("כמה XP להוסיף?");
                if (x) { window.lifeXP += parseInt(x); updateUI(); saveGame(); window.openTab('home'); }
                break;
            case "4":
                const newPass = prompt("הכנס סיסמה חדשה (מינימום 4 תווים):");
                if (newPass && newPass.length >= 4) {
                    localStorage.setItem('adminPass', newPass);
                    alert("הסיסמה שונתה בהצלחה!");
                } else { alert("שגיאה: סיסמה קצרה מדי."); }
                break;
            case "5":
                const script = document.createElement('script');
                script.src = 'js/debug.js?v=' + Date.now();
                document.body.appendChild(script);
                break;
        }
    } else if (pass !== null) alert("סיסמה שגויה!");
};

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => { window.openTab('home'); }, 150);
});
