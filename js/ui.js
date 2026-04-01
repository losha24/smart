/* Smart Money Pro - js/ui.js - v6.1.6 - Anti-Crash Final */

let deferredPrompt;
let adminMessage = localStorage.getItem('admin_msg') || "ברוכים הבאים אלכסיי! המערכת מסונכרנת ומוכנה.";

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    renderInstallBtn();
});

/**
 * פונקציית הבית (מרכז השליטה)
 */
function drawHome(c) {
    if (!c) return;
    
    // הגנה על משתני יסוד
    const xpValue = (typeof lifeXP !== 'undefined') ? lifeXP : 0;
    const passiveVal = (typeof passive !== 'undefined') ? passive : 0;
    
    // אובייקט ברירת מחדל למקרה של שגיאה בחישוב הרמה
    let ld = { level: 1, progressPercent: 0, nextXP: 1000 };
    
    if (typeof getLevelData === 'function') {
        try {
            const calculatedLd = getLevelData(xpValue);
            if (calculatedLd) ld = calculatedLd;
        } catch(e) {
            console.error("Level Calculation Error:", e);
        }
    }

    // וידוא ש-nextXP קיים לפני שימוש ב-toLocaleString כדי למנוע את השגיאה שראית
    const nextXPDisplay = (ld && ld.nextXP) ? ld.nextXP.toLocaleString() : "1,000";

    c.innerHTML = `
        <div class="dashboard fade-in">
            
            <div class="card" style="border-right: 4px solid var(--purple); position: relative; background: rgba(168, 85, 247, 0.05); margin-bottom:15px;">
                <small style="color:var(--purple); font-weight:bold; display:block; margin-bottom:5px;">📢 הודעת מנהל</small>
                <p id="admin-text" style="font-size:13px; margin:0; line-height:1.4; color:var(--text); white-space: pre-wrap;">${adminMessage}</p>
                <button onclick="editAdminMsg()" style="position:absolute; left:10px; top:10px; background:none; border:none; color:var(--blue); font-size:14px; cursor:pointer; opacity:0.6;">✏️</button>
            </div>

            <div class="card profile-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <span style="font-size:11px; opacity:0.7;">דרגת משתמש</span>
                        <div id="home-level-val" style="font-size:24px; font-weight:900; color:var(--blue);">LEVEL ${ld.level}</div>
                    </div>
                    <div style="text-align:left;">
                        <span style="font-size:11px; opacity:0.7;">הכנסה פסיבית</span>
                        <div id="passive-home-val" style="font-size:16px; font-weight:bold; color:var(--green);">₪${Math.floor(passiveVal).toLocaleString()}</div>
                    </div>
                </div>
                
                <div class="progress-container" style="margin-top:12px; height:12px; background:rgba(0,0,0,0.2); border-radius:10px; overflow:hidden;">
                    <div id="xp-progress-bar" class="progress-bar xp-bar" style="width:${ld.progressPercent}%; height:100%; background:var(--blue); transition: width 0.5s;"></div>
                </div>
                <div id="xp-text-detail" style="font-size:10px; text-align:center; margin-top:6px; opacity:0.6; letter-spacing:0.5px;">
                    ${Math.floor(xpValue).toLocaleString()} / ${nextXPDisplay} XP
                </div>
            </div>

            <div class="card" style="margin-top:15px;">
                <h4 style="margin:0 0 12px 0; font-size:14px; color:var(--yellow); display:flex; align-items:center; gap:5px;">
                    <span>📦</span> הציוד והנכסים שלי
                </h4>
                <div id="inventory-list" style="display:grid; grid-template-columns: repeat(5, 1fr); gap:10px;">
                    ${renderInventoryIcons()}
                </div>
            </div>

            <div class="grid-2" style="margin-top:15px;">
                <button class="action" onclick="saveGame()" style="background:#1e293b; color:var(--blue); border:1px solid var(--blue); padding:12px; border-radius:8px;">💾 שמור</button>
                <button class="action" onclick="if(typeof getDailyGift === 'function') getDailyGift()" style="background:var(--purple); color:#fff; padding:12px; border-radius:8px;">🎁 בונוס</button>
            </div>

            <div id="install-container" style="margin-top:15px;"></div>
            
            <button class="sys-btn" style="border:1px solid #451a1a; color:#ef4444; margin-top:30px; font-size:10px; padding:8px; width:100%; opacity:0.5;" onclick="if(confirm('לאפס נתונים?')) resetGame()">🗑️ איפוס נתונים</button>
        </div>
    `;
    renderInstallBtn();
}

function renderInventoryIcons() {
    const inv = (typeof inventory !== 'undefined' && Array.isArray(inventory)) ? inventory : [];
    if (inv.length === 0) return '<span style="grid-column: 1/6; font-size:11px; opacity:0.4; text-align:center; padding:10px;">אין פריטים...</span>';
    
    return inv.map(item => {
        const icon = (typeof item === 'object' && item !== null) ? (item.icon || '📦') : '📦';
        const name = (typeof item === 'object' && item !== null) ? (item.name || 'פריט') : item;
        return `
            <div class="inv-item-slot" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:12px; display:flex; justify-content:center; align-items:center; aspect-ratio:1/1; font-size:22px;" title="${name}">
                ${icon}
            </div>
        `;
    }).join('');
}

function updateUI() {
    try {
        const m = (typeof money !== 'undefined') ? money : 0;
        const b = (typeof bank !== 'undefined') ? bank : 0;
        const p = (typeof passive !== 'undefined') ? passive : 0;
        const xp = (typeof lifeXP !== 'undefined') ? lifeXP : 0;
        
        let ld = { level: 1, progressPercent: 0, nextXP: 1000 };
        if (typeof getLevelData === 'function') ld = getLevelData(xp) || ld;
        
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(m).toLocaleString();
        
        const bEl = document.getElementById('bank');
        if(bEl) bEl.innerText = Math.floor(b).toLocaleString();

        const lEl = document.getElementById('life-level-ui');
        if(lEl) lEl.innerText = ld.level;

        const homePassive = document.getElementById('passive-home-val');
        if(homePassive) homePassive.innerText = "₪" + Math.floor(p).toLocaleString();
        
        const bar = document.getElementById('xp-progress-bar');
        if(bar) bar.style.width = ld.progressPercent + "%";
        
        const xpTxt = document.getElementById('xp-text-detail');
        if(xpTxt) {
            const nXP = ld.nextXP ? ld.nextXP.toLocaleString() : "1,000";
            xpTxt.innerText = `${Math.floor(xp).toLocaleString()} / ${nXP} XP`;
        }

        const lvlVal = document.getElementById('home-level-val');
        if(lvlVal) lvlVal.innerText = `LEVEL ${ld.level}`;
    } catch(err) {
        console.warn("UI update suppressed error:", err);
    }
}

function editAdminMsg() {
    const pass = prompt("סיסמת מנהל:");
    if (pass === "1234") {
        const newMsg = prompt("הודעה חדשה:", adminMessage);
        if (newMsg) {
            adminMessage = newMsg;
            localStorage.setItem('admin_msg', newMsg);
            const msgEl = document.getElementById('admin-text');
            if (msgEl) msgEl.innerText = newMsg;
        }
    }
}

function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(!cont) return;
    if(deferredPrompt) {
        cont.innerHTML = `<button class="action" style="background:var(--blue); color:#000; font-weight:bold; width:100%;" onclick="triggerInstall()">📲 התקן אפליקציה</button>`;
    } else cont.innerHTML = "";
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') deferredPrompt = null;
    renderInstallBtn();
}
