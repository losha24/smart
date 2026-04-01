/* Smart Money Pro - js/ui.js - v6.2.8 - Final Logic & UI Sync */

let deferredPrompt;
let adminMessage = localStorage.getItem('admin_msg') || "ברוכים הבאים אלכסיי! המערכת מוכנה.";

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

/**
 * מערכת XP דינמית - כל רמה דורשת יותר מהקודמת (נוסחה אקספוננציאלית)
 */
function getLevelData(totalXp) {
    let level = 1;
    let xpNeededForNext = 1000; // בסיס רמה 1
    let tempXp = Number(totalXp) || 0;

    // נוסחה: כל רמה עולה ב-25% קושי + 500 נקודות קבועות
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
 * הצגת הודעה בתוך תיבה צפה בתחתית (Box Style)
 */
function showMsg(text, color = "var(--blue)") {
    const msgEl = document.getElementById('msg');
    if (!msgEl) return;
    
    // הזרקת התיבה המעוצבת
    msgEl.innerHTML = `<div class="msg-box" style="border-color: ${color};">${text}</div>`;
    
    // אנימציית כניסה (עולה מלמטה)
    msgEl.style.opacity = "1";
    msgEl.style.transform = "translateX(-50%) translateY(0)";

    // הסתרה לאחר 3 שניות
    setTimeout(() => {
        msgEl.style.opacity = "0";
        msgEl.style.transform = "translateX(-50%) translateY(20px)";
    }, 3000);
}

/**
 * ציור דף הבית
 */
function drawHome(c) {
    if (!c) return;
    
    // סנכרון אינוונטרי
    if (typeof updateGlobalInventory === 'function') updateGlobalInventory();

    const xpValue = (typeof lifeXP !== 'undefined') ? lifeXP : 0;
    const ld = getLevelData(xpValue);

    c.innerHTML = `
        <div class="dashboard fade-in">
            <div class="card" style="border-right: 4px solid var(--purple); background: rgba(168, 85, 247, 0.05); margin-bottom:15px; position:relative;">
                <small style="color:var(--purple); font-weight:bold;">📢 עדכונים</small>
                <p id="admin-text" style="margin:5px 0 0 0; font-size:13px; font-weight:500;">${adminMessage}</p>
                <button class="sys-btn" onclick="editAdminMsg()" style="position:absolute; left:10px; top:10px; padding:5px; font-size:12px; opacity:0.6; background:none; border:none; color:var(--blue);">✏️</button>
            </div>

            <div class="card profile-card" style="background: linear-gradient(145deg, #1e293b, #111827);">
                <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:15px;">
                    <div>
                        <span style="font-size:12px; opacity:0.6; display:block; margin-bottom:2px;">דרגת המשתמש</span>
                        <div id="home-level-val" style="font-size:28px; font-weight:900; color:var(--blue); letter-spacing:1px;">LEVEL ${ld.level}</div>
                    </div>
                    <div style="text-align:left;">
                        <span style="font-size:11px; opacity:0.6;">התקדמות</span>
                        <div style="font-size:14px; font-weight:bold; color:var(--green);">${Math.floor(ld.progressPercent)}%</div>
                    </div>
                </div>
                
                <div class="progress-container" style="height:12px; background:rgba(0,0,0,0.3); border-radius:20px; overflow:hidden; border:1px solid rgba(255,255,255,0.05);">
                    <div id="xp-progress-bar" style="width:${ld.progressPercent}%; height:100%; background: linear-gradient(90deg, var(--blue), #60a5fa); transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                </div>
                
                <div id="xp-text-detail" style="font-size:11px; text-align:center; margin-top:8px; opacity:0.7; font-family:monospace;">
                    ${Math.floor(ld.currentXpInLevel).toLocaleString()} / ${ld.nextXP.toLocaleString()} XP
                </div>
            </div>

            <div class="card" style="margin-top:15px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h4 style="margin:0; font-size:14px; color:var(--yellow);">📦 נכסים וציוד</h4>
                    <small style="opacity:0.5;">${(typeof inventory !== 'undefined') ? inventory.length : 0} פריטים</small>
                </div>
                <div id="inventory-list" style="display:grid; grid-template-columns: repeat(5, 1fr); gap:10px;">
                    ${renderInventoryIcons()}
                </div>
            </div>

            <div class="grid-2" style="margin-top:15px; gap:12px;">
                <button class="action" onclick="saveGame()" style="background:#1e293b; color:var(--blue); border:1px solid var(--blue); padding:15px; font-weight:bold;">💾 שמור</button>
                <button class="action daily-btn" onclick="getDailyGift()" style="background:var(--purple); color:#fff; padding:15px; font-weight:bold; box-shadow:0 4px 12px rgba(168,85,247,0.3);">🎁 מתנה</button>
            </div>
        </div>
    `;
}

/**
 * קבלת מתנה (כל 4 שעות)
 */
function getDailyGift() {
    const lastGift = localStorage.getItem('last_gift_time') || 0;
    const now = Date.now();
    const cooldown = 4 * 60 * 60 * 1000;

    if (now - lastGift < cooldown) {
        const diff = cooldown - (now - lastGift);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        showMsg(`⏳ המתנה תהיה זמינה בעוד ${hours}ש' ו-${mins}ד'`, "var(--red)");
        return;
    }

    if (typeof money !== 'undefined') {
        const basePrize = 5000;
        const levelBonus = (typeof lifeXP !== 'undefined' ? Math.floor(lifeXP / 3) : 0);
        const finalPrize = basePrize + levelBonus;
        
        money += finalPrize;
        lifeXP = (typeof lifeXP !== 'undefined' ? lifeXP : 0) + 350;
        
        localStorage.setItem('last_gift_time', now);
        updateUI();
        showMsg(`🎁 קיבלת ₪${finalPrize.toLocaleString()} ובונוס XP!`, "var(--green)");
        if (typeof saveGame === 'function') saveGame();
    }
}

/**
 * רינדור איקונים לאינוונטרי
 */
function renderInventoryIcons() {
    const inv = (typeof inventory !== 'undefined' && Array.isArray(inventory)) ? inventory : [];
    if (inv.length === 0) return '<span style="grid-column: 1/6; font-size:11px; opacity:0.3; text-align:center; padding:10px;">אין נכסים כרגע</span>';
    
    return inv.slice(0, 10).map(item => {
        const icon = (typeof item === 'object') ? (item.icon || '📦') : '📦';
        return `<div class="inv-item-slot" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; display:flex; justify-content:center; align-items:center; aspect-ratio:1/1; font-size:20px;">${icon}</div>`;
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
        
        const moneyEl = document.getElementById('money');
        const bankEl = document.getElementById('bank');
        const levelEl = document.getElementById('life-level-ui');
        
        if(moneyEl) moneyEl.innerText = Math.floor(m).toLocaleString();
        if(bankEl) bankEl.innerText = Math.floor(b).toLocaleString();
        if(levelEl) levelEl.innerText = ld.level;

        const bar = document.getElementById('xp-progress-bar');
        const xpTxt = document.getElementById('xp-text-detail');
        const levelValHome = document.getElementById('home-level-val');

        if(bar) bar.style.width = ld.progressPercent + "%";
        if(xpTxt) xpTxt.innerText = `${Math.floor(ld.currentXpInLevel).toLocaleString()} / ${ld.nextXP.toLocaleString()} XP`;
        if(levelValHome) levelValHome.innerText = `LEVEL ${ld.level}`;
        
    } catch(err) {
        console.warn("UI Update missing elements:", err);
    }
}

/**
 * עריכת הודעת מנהל
 */
function editAdminMsg() {
    const pass = prompt("סיסמה לשנוי הודעה:");
    if (pass === "1234") {
        const msg = prompt("הכנס הודעה חדשה:", adminMessage);
        if (msg !== null) {
            adminMessage = msg || "ברוכים הבאים!";
            localStorage.setItem('admin_msg', adminMessage);
            if(document.getElementById('admin-text')) document.getElementById('admin-text').innerText = adminMessage;
            showMsg("הודעת מנהל עודכנה בהצלחה", "var(--blue)");
        }
    } else if(pass !== null) {
        showMsg("גישה נדחתה: סיסמה שגויה", "var(--red)");
    }
}
