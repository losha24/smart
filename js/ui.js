/* Smart Money Pro - js/ui.js - v6.1.8 - Final Update */

let deferredPrompt;
let adminMessage = localStorage.getItem('admin_msg') || "ברוכים הבאים אלכסיי! המערכת מוכנה.";

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

/**
 * שורת עדכונים צפה (Status Bar)
 */
function showMsg(text, color = "var(--blue)") {
    const msgEl = document.getElementById('msg');
    if (!msgEl) return;
    
    msgEl.innerText = text;
    msgEl.style.background = color;
    msgEl.style.opacity = "1";
    msgEl.style.top = "85px"; // ממוקם מתחת לסטטוס בר העליון

    setTimeout(() => {
        msgEl.style.opacity = "0";
        msgEl.style.top = "70px";
    }, 3000);
}

/**
 * פונקציית הבית
 */
function drawHome(c) {
    if (!c) return;
    const xpValue = (typeof lifeXP !== 'undefined') ? lifeXP : 0;
    const passiveVal = (typeof passive !== 'undefined') ? passive : 0;
    let ld = { level: 1, progressPercent: 0, nextXP: 1000 };
    
    if (typeof getLevelData === 'function') {
        try { ld = getLevelData(xpValue) || ld; } catch(e) {}
    }
    const nXP = (ld && ld.nextXP) ? ld.nextXP.toLocaleString() : "1,000";

    c.innerHTML = `
        <div class="dashboard fade-in">
            <div class="card" style="border-right: 4px solid var(--purple); background: rgba(168, 85, 247, 0.05); margin-bottom:15px; position:relative;">
                <small style="color:var(--purple); font-weight:bold;">📢 עדכונים</small>
                <p id="admin-text" style="margin:5px 0 0 0; font-size:13px;">${adminMessage}</p>
                <button onclick="editAdminMsg()" style="position:absolute; left:10px; top:10px; background:none; border:none; color:var(--blue); font-size:12px; opacity:0.5;">✏️</button>
            </div>

            <div class="card profile-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <span style="font-size:11px; opacity:0.7;">דרגה</span>
                        <div id="home-level-val" style="font-size:24px; font-weight:900; color:var(--blue);">LEVEL ${ld.level}</div>
                    </div>
                    <div style="text-align:left;">
                        <span style="font-size:11px; opacity:0.7;">הכנסה פסיבית</span>
                        <div id="passive-home-val" style="font-size:16px; font-weight:bold; color:var(--green);">₪${Math.floor(passiveVal).toLocaleString()}</div>
                    </div>
                </div>
                <div class="progress-container" style="margin-top:12px; height:10px; background:rgba(0,0,0,0.2); border-radius:10px; overflow:hidden;">
                    <div id="xp-progress-bar" style="width:${ld.progressPercent}%; height:100%; background:var(--blue); transition:0.5s;"></div>
                </div>
                <div id="xp-text-detail" style="font-size:10px; text-align:center; margin-top:6px; opacity:0.6;">
                    ${Math.floor(xpValue).toLocaleString()} / ${nXP} XP
                </div>
            </div>

            <div class="card" style="margin-top:15px;">
                <h4 style="margin:0 0 12px 0; font-size:14px; color:var(--yellow);">📦 נכסים וציוד</h4>
                <div id="inventory-list" style="display:grid; grid-template-columns: repeat(5, 1fr); gap:10px;">
                    ${renderInventoryIcons()}
                </div>
            </div>

            <div class="grid-2" style="margin-top:15px;">
                <button class="action" onclick="saveGame()" style="background:#1e293b; color:var(--blue); border:1px solid var(--blue); padding:15px;">💾 שמור</button>
                <button class="action" onclick="getDailyGift()" style="background:var(--purple); color:#fff; padding:15px;">🎁 מתנה</button>
            </div>
        </div>
    `;
}

/**
 * עיצוב בורסה - 2 בשורה
 */
function drawInvest(c) {
    if (!c) return;
    c.innerHTML = `
        <div class="fade-in">
            <h2 style="text-align:center; color:var(--blue); margin-bottom:15px;">📈 בורסה ומסחר</h2>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                ${typeof renderInvestments === 'function' ? renderInvestments() : '<p>טוען נכסים...</p>'}
            </div>
        </div>
    `;
}

/**
 * מתנה כל 4 שעות
 */
function getDailyGift() {
    const lastGift = localStorage.getItem('last_gift_time') || 0;
    const now = Date.now();
    const cooldown = 4 * 60 * 60 * 1000; // 4 שעות

    if (now - lastGift < cooldown) {
        const diff = cooldown - (now - lastGift);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        showMsg(`המתנה תהיה זמינה בעוד ${hours}ש' ו-${mins}ד'`, "var(--red)");
        return;
    }

    if (typeof money !== 'undefined') {
        const prize = 5000 + (typeof lifeXP !== 'undefined' ? lifeXP : 0);
        money += prize;
        lifeXP = (typeof lifeXP !== 'undefined' ? lifeXP : 0) + 250;
        localStorage.setItem('last_gift_time', now);
        updateUI();
        showMsg(`🎁 קיבלת ₪${prize.toLocaleString()} ו-250 XP!`, "var(--green)");
        if (typeof saveGame === 'function') saveGame();
    }
}

/**
 * כישורים (הוספת 5 כישורים חדשים)
 */
function drawSkills(c) {
    if (!c) return;
    // רשימת הכישורים המורחבת
    const skillList = [
        { id: 's1', name: 'ניהול זמן', icon: '⏱️', desc: 'מעלה XP ב-10%' },
        { id: 's2', name: 'שיווק דיגיטלי', icon: '📱', desc: 'בונוס לעסקים' },
        { id: 's3', name: 'תכנות PWA', icon: '💻', desc: 'פתיחת עבודות הייטק' },
        { id: 's4', name: 'ניתוח טכני', icon: '📊', desc: 'הנחה בבורסה' },
        { id: 's5', name: 'משא ומתן', icon: '🤝', desc: 'הנחה בנדל"ן' }
    ];

    c.innerHTML = `
        <div class="fade-in">
            <h2 style="text-align:center; color:var(--blue);">🎓 פיתוח כישורים</h2>
            <div style="display:grid; gap:10px; margin-top:15px;">
                ${skillList.map(s => `
                    <div class="card" style="display:flex; align-items:center; gap:15px; padding:12px;">
                        <div style="font-size:25px;">${s.icon}</div>
                        <div style="flex:1;">
                            <div style="font-weight:bold;">${s.name}</div>
                            <small style="opacity:0.6;">${s.desc}</small>
                        </div>
                        <button class="action" style="padding:5px 15px; font-size:12px; background:var(--blue); color:black;" onclick="upgradeSkill('${s.id}')">שדרג</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderInventoryIcons() {
    const inv = (typeof inventory !== 'undefined' && Array.isArray(inventory)) ? inventory : [];
    if (inv.length === 0) return '<span style="grid-column: 1/6; font-size:11px; opacity:0.4; text-align:center;">ריק...</span>';
    return inv.map(item => {
        const icon = (typeof item === 'object') ? (item.icon || '📦') : '📦';
        return `<div class="inv-item-slot" style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:12px; display:flex; justify-content:center; align-items:center; aspect-ratio:1/1; font-size:22px;">${icon}</div>`;
    }).join('');
}

function updateUI() {
    try {
        const m = (typeof money !== 'undefined') ? money : 0;
        const b = (typeof bank !== 'undefined') ? bank : 0;
        const xp = (typeof lifeXP !== 'undefined') ? lifeXP : 0;
        
        let ld = { level: 1, progressPercent: 0, nextXP: 1000 };
        if (typeof getLevelData === 'function') ld = getLevelData(xp) || ld;
        
        if(document.getElementById('money')) document.getElementById('money').innerText = Math.floor(m).toLocaleString();
        if(document.getElementById('bank')) document.getElementById('bank').innerText = Math.floor(b).toLocaleString();
        if(document.getElementById('life-level-ui')) document.getElementById('life-level-ui').innerText = ld.level;

        const bar = document.getElementById('xp-progress-bar');
        if(bar) bar.style.width = ld.progressPercent + "%";
        
        const xpTxt = document.getElementById('xp-text-detail');
        if(xpTxt) xpTxt.innerText = `${Math.floor(xp).toLocaleString()} / ${ld.nextXP.toLocaleString()} XP`;
    } catch(err) {}
}

function editAdminMsg() {
    const pass = prompt("סיסמה:");
    if (pass === "1234") {
        const msg = prompt("הודעה חדשה:", adminMessage);
        if (msg) {
            adminMessage = msg;
            localStorage.setItem('admin_msg', msg);
            if(document.getElementById('admin-text')) document.getElementById('admin-text').innerText = msg;
        }
    }
}
