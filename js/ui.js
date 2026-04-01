/* Smart Money Pro - js/ui.js - v6.1.3 - Final Stable */

let deferredPrompt;
// טעינת הודעת מנהל מהזיכרון או ברירת מחדל
let adminMessage = localStorage.getItem('admin_msg') || "ברוכים הבאים למרכז השליטה! המשיכו לצבור נכסים ו-XP.";

// האזנה להתקנת אפליקציה (PWA)
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if(typeof renderInstallBtn === 'function') renderInstallBtn();
});

/**
 * פונקציית הבית (מרכז השליטה)
 */
function drawHome(c) {
    if (!c) return;
    
    // הגנה: וודא שנתוני הרמה קיימים
    const xpValue = (typeof lifeXP !== 'undefined') ? lifeXP : 0;
    const ld = (typeof getLevelData === 'function') ? getLevelData(xpValue) : { level: 1, progressPercent: 0, nextXP: 1000 };

    c.innerHTML = `
        <div class="dashboard fade-in">
            
            <div class="card" style="border-right: 4px solid var(--purple); position: relative; background: rgba(168, 85, 247, 0.05);">
                <small style="color:var(--purple); font-weight:bold; display:block; margin-bottom:5px;">📢 הודעת מנהל</small>
                <p id="admin-text" style="font-size:13px; margin:0; line-height:1.4; color:var(--text); white-space: pre-wrap;">${adminMessage}</p>
                <button onclick="editAdminMsg()" style="position:absolute; left:10px; top:10px; background:none; border:none; color:var(--blue); font-size:14px; cursor:pointer; opacity:0.6;">✏️</button>
            </div>

            <div class="card profile-card" style="margin-top:15px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <span style="font-size:11px; opacity:0.7;">דרגת משתמש</span>
                        <div id="home-level-val" style="font-size:24px; font-weight:900; color:var(--blue);">LEVEL ${ld.level}</div>
                    </div>
                    <div style="text-align:left;">
                        <span style="font-size:11px; opacity:0.7;">הכנסה פסיבית</span>
                        <div id="passive-home-val" style="font-size:16px; font-weight:bold; color:var(--green);">₪${Math.floor(typeof passive !== 'undefined' ? passive : 0).toLocaleString()}</div>
                    </div>
                </div>
                
                <div class="progress-container" style="margin-top:12px; height:12px; background:rgba(0,0,0,0.2); border-radius:10px; overflow:hidden;">
                    <div id="xp-progress-bar" class="progress-bar xp-bar" style="width:${ld.progressPercent}%; height:100%; transition: width 0.5s;"></div>
                </div>
                <div id="xp-text-detail" style="font-size:10px; text-align:center; margin-top:6px; opacity:0.6; letter-spacing:0.5px;">
                    ${Math.floor(xpValue).toLocaleString()} / ${ld.nextXP.toLocaleString()} XP
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
                <button class="action" onclick="saveGame()" style="background:#1e293b; color:var(--blue); border:1px solid var(--blue); padding:12px;">💾 שמור משחק</button>
                <button class="action" onclick="if(typeof getDailyGift === 'function') getDailyGift()" style="background:var(--purple); color:#fff; padding:12px;">🎁 בונוס יומי</button>
            </div>

            <div id="install-container" style="margin-top:15px;"></div>
            
            <button class="sys-btn" style="border:1px solid #451a1a; color:#ef4444; margin-top:20px; font-size:10px; padding:8px; width:100%; opacity:0.5; cursor:pointer;" onclick="resetGame()">🗑️ איפוס נתונים</button>
        </div>
    `;
    renderInstallBtn();
}

function renderInventoryIcons() {
    // בדיקה שהמערך קיים
    const inv = (typeof inventory !== 'undefined') ? inventory : [];
    if (inv.length === 0) {
        return '<span style="grid-column: 1/6; font-size:11px; opacity:0.4; text-align:center; padding:10px;">אין פריטים בבעלותך...</span>';
    }
    
    return inv.map(item => `
        <div class="inv-item-slot" style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:12px; display:flex; justify-content:center; align-items:center; aspect-ratio:1/1; font-size:22px;" title="${item.name || ''}">
            ${item.icon || '📦'}
        </div>
    `).join('');
}

function editAdminMsg() {
    const pass = prompt("הכנס סיסמת מנהל:");
    if (pass === "1234") {
        const newMsg = prompt("הקלד הודעה חדשה:", adminMessage);
        if (newMsg !== null && newMsg.trim() !== "") {
            adminMessage = newMsg;
            localStorage.setItem('admin_msg', newMsg);
            const msgEl = document.getElementById('admin-text');
            if (msgEl) msgEl.innerText = newMsg;
            if (typeof showMsg === 'function') showMsg("הודעה עודכנה!", "var(--green)");
        }
    } else if (pass !== null) {
        alert("סיסמה שגויה!");
    }
}

function updateUI() {
    // מניעת שגיאות אם משתנים לא הוגדרו עדיין
    const m = (typeof money !== 'undefined') ? money : 0;
    const p = (typeof passive !== 'undefined') ? passive : 0;
    const xp = (typeof lifeXP !== 'undefined') ? lifeXP : 0;
    
    const ld = (typeof getLevelData === 'function') ? getLevelData(xp) : { level: 1, progressPercent: 0, nextXP: 1000 };
    
    // עדכון בר עליון
    const mEl = document.getElementById('money');
    if(mEl) mEl.innerText = Math.floor(m).toLocaleString();
    
    const pEl = document.getElementById('passive-display');
    if(pEl) pEl.innerText = Math.floor(p).toLocaleString() + " ₪/ש";

    // עדכון מרכז שליטה
    const homePassive = document.getElementById('passive-home-val');
    if(homePassive) homePassive.innerText = "₪" + Math.floor(p).toLocaleString();
    
    const bar = document.getElementById('xp-progress-bar');
    if(bar) bar.style.width = ld.progressPercent + "%";
    
    const xpTxt = document.getElementById('xp-text-detail');
    if(xpTxt) xpTxt.innerText = `${Math.floor(xp).toLocaleString()} / ${ld.nextXP.toLocaleString()} XP`;

    const lvlVal = document.getElementById('home-level-val');
    if(lvlVal) lvlVal.innerText = `LEVEL ${ld.level}`;
}

function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(!cont) return;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if(!isStandalone && deferredPrompt) {
        cont.innerHTML = `<button class="action" style="background:var(--blue); color:#0f172a; font-weight:bold;" onclick="triggerInstall()">📲 התקן כאפליקציה</button>`;
    } else {
        cont.innerHTML = "";
    }
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') deferredPrompt = null;
    renderInstallBtn();
}
