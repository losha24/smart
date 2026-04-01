/* Smart Money Pro - js/ui.js - v6.3.0 - Classic UI Sync */

let deferredPrompt;
let adminMessage = localStorage.getItem('admin_msg') || "ברוכים הבאים אלכסיי! המערכת מוכנה.";

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

/**
 * מערכת XP דינמית - כל רמה דורשת יותר מהקודמת
 */
function getLevelData(totalXp) {
    let level = 1;
    let xpNeededForNext = 1000; // בסיס רמה 1
    let tempXp = Number(totalXp) || 0;

    while (tempXp >= xpNeededForNext) {
        tempXp -= xpNeededForNext;
        level++;
        xpNeededForNext = Math.floor(xpNeededForNext * 1.25) + 500;
    }

    let progress = (tempXp / xpNeededForNext) * 100;
    return {
        level: level,
        progressPercent: progress,
        nextXP: xpNeededForNext,
        currentXpInLevel: tempXp
    };
}

/**
 * הצגת הודעה בשורת הסטטוס (Status Bar) - סגנון 6.0.5
 */
function showMsg(text, color = "var(--blue)") {
    const statusEl = document.getElementById('status-bar');
    if (!statusEl) return;
    
    statusEl.innerText = text;
    statusEl.style.color = color;
    statusEl.style.borderColor = color;
    statusEl.style.opacity = "1";

    // הסתרה חלקית לאחר 3 שניות כדי לשמור על המבנה נקי
    setTimeout(() => {
        statusEl.style.opacity = "0.5";
    }, 3000);
}

/**
 * ציור דף הבית
 */
function drawHome(c) {
    if (!c) return;
    
    if (typeof updateGlobalInventory === 'function') updateGlobalInventory();

    const xpValue = (typeof lifeXP !== 'undefined') ? lifeXP : 0;
    const ld = getLevelData(xpValue);

    c.innerHTML = `
        <div class="dashboard fade-in">
            <div class="card" style="border-right: 4px solid var(--purple); position:relative;">
                <small style="color:var(--purple); font-weight:bold;">📢 עדכונים</small>
                <p id="admin-text" style="margin:5px 0 0 0; font-size:13px; font-weight:500;">${adminMessage}</p>
                <button onclick="editAdminMsg()" style="position:absolute; left:10px; top:10px; background:none; border:none; color:var(--blue); cursor:pointer; opacity:0.5;">✏️</button>
            </div>

            <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <div style="font-size:22px; font-weight:900; color:var(--blue);">LEVEL ${ld.level}</div>
                    <div style="font-size:12px; opacity:0.7;">${Math.floor(ld.currentXpInLevel).toLocaleString()} / ${ld.nextXP.toLocaleString()} XP</div>
                </div>
                
                <div class="progress-container">
                    <div id="xp-progress-bar" class="progress-bar" style="width:${ld.progressPercent}%;"></div>
                </div>
            </div>

            <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h4 style="margin:0; font-size:14px; color:var(--yellow);">📦 נכסים</h4>
                    <small style="opacity:0.5;">${(typeof inventory !== 'undefined') ? inventory.length : 0} פריטים</small>
                </div>
                <div id="inventory-list" style="display:grid; grid-template-columns: repeat(5, 1fr); gap:10px;">
                    ${renderInventoryIcons()}
                </div>
            </div>

            <div class="grid-2">
                <button class="action" onclick="saveGame()" style="background:#1e293b; color:var(--blue); border:1px solid var(--blue);">💾 שמור</button>
                <button class="action daily-btn" onclick="getDailyGift()" style="background:var(--purple); color:#fff;">🎁 מתנה</button>
            </div>
        </div>
    `;
}

/**
 * קבלת מתנה יומית
 */
function getDailyGift() {
    const lastGift = localStorage.getItem('last_gift_time') || 0;
    const now = Date.now();
    const cooldown = 4 * 60 * 60 * 1000;

    if (now - lastGift < cooldown) {
        const diff = cooldown - (now - lastGift);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        showMsg(`⏳ זמין בעוד ${hours}ש' ו-${mins}ד'`, "var(--red)");
        return;
    }

    if (typeof money !== 'undefined') {
        const prize = 5000 + (typeof lifeXP !== 'undefined' ? Math.floor(lifeXP / 3) : 0);
        money += prize;
        lifeXP = (typeof lifeXP !== 'undefined' ? lifeXP : 0) + 350;
        
        localStorage.setItem('last_gift_time', now);
        updateUI();
        showMsg(`🎁 קיבלת ₪${prize.toLocaleString()} ובונוס XP!`, "var(--green)");
        if (typeof saveGame === 'function') saveGame();
    }
}

/**
 * רינדור איקונים לאינוונטרי
 */
function renderInventoryIcons() {
    const inv = (typeof inventory !== 'undefined' && Array.isArray(inventory)) ? inventory : [];
    if (inv.length === 0) return '<span style="grid-column: 1/6; font-size:11px; opacity:0.3; text-align:center;">אין נכסים</span>';
    
    return inv.slice(0, 10).map(item => {
        const icon = (typeof item === 'object') ? (item.icon || '📦') : '📦';
        return `<div class="inv-item-slot" style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:10px; display:flex; justify-content:center; align-items:center; aspect-ratio:1/1; font-size:20px;">${icon}</div>`;
    }).join('');
}

/**
 * עדכון UI כללי
 */
function updateUI() {
    try {
        const m = (typeof money !== 'undefined') ? money : 0;
        const b = (typeof bank !== 'undefined') ? bank : 0;
        const xp = (typeof lifeXP !== 'undefined') ? lifeXP : 0;
        
        const ld = getLevelData(xp);
        
        if(document.getElementById('money')) document.getElementById('money').innerText = Math.floor(m).toLocaleString();
        if(document.getElementById('bank')) document.getElementById('bank').innerText = Math.floor(b).toLocaleString();
        if(document.getElementById('life-level-ui')) document.getElementById('life-level-ui').innerText = ld.level;

        const bar = document.getElementById('xp-progress-bar');
        if(bar) bar.style.width = ld.progressPercent + "%";
        
    } catch(err) {
        console.warn("UI Update error:", err);
    }
}

/**
 * עריכת הודעת מנהל
 */
function editAdminMsg() {
    const pass = prompt("סיסמה:");
    if (pass === "1234") {
        const msg = prompt("הודעה חדשה:", adminMessage);
        if (msg !== null) {
            adminMessage = msg || "ברוכים הבאים!";
            localStorage.setItem('admin_msg', adminMessage);
            if(document.getElementById('admin-text')) document.getElementById('admin-text').innerText = adminMessage;
            showMsg("הודעה עודכנה", "var(--blue)");
        }
    } else if(pass !== null) {
        showMsg("סיסמה שגויה", "var(--red)");
    }
}
