/* Smart Money Pro - js/ui.js - v6.3.2 - Final Version */

/**
 * מציג הודעת מערכת בשורת הסטטוס שנעלמת אחרי 5 שניות בדיוק
 */
function showMsg(text, color = "var(--blue)") {
    const statusEl = document.getElementById('status-bar');
    if (!statusEl) return;
    
    statusEl.innerText = text;
    statusEl.style.color = color;
    statusEl.style.opacity = "1";

    // טיימר היעלמות - 5000 מילישניות
    setTimeout(() => {
        statusEl.style.opacity = "0";
    }, 5000);
}

/**
 * חישוב נתוני רמה (XP) - לוגיקה דינמית
 */
function getLevelData(totalXp) {
    let level = 1;
    let xpNeeded = 1000; 
    let tempXp = Number(totalXp) || 0;

    while (tempXp >= xpNeeded) {
        tempXp -= xpNeeded;
        level++;
        xpNeeded = Math.floor(xpNeeded * 1.25) + 500;
    }

    return {
        level: level,
        progressPercent: (tempXp / xpNeeded) * 100,
        nextXP: xpNeeded,
        currentXpInLevel: tempXp
    };
}

/**
 * ציור דף הבית (Dashboard)
 */
function drawHome(c) {
    if (!c) return;
    
    const xpValue = (typeof lifeXP !== 'undefined') ? lifeXP : 0;
    const ld = getLevelData(xpValue);
    const passiveInc = (typeof passive !== 'undefined') ? passive : 0;

    c.innerHTML = `
        <div class="dashboard fade-in">
            <div class="card" style="padding: 10px 15px; display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                <div style="font-weight: 900; color: var(--blue); font-size: 14px;">LVL ${ld.level}</div>
                <div class="progress-container" style="flex: 1; height: 8px; margin: 0;">
                    <div id="xp-progress-bar" class="progress-bar" style="width: ${ld.progressPercent}%"></div>
                </div>
                <div style="font-size: 10px; opacity: 0.5;">${Math.floor(ld.progressPercent)}%</div>
            </div>

            <div class="card" style="text-align: center; border-bottom: 3px solid var(--green); padding: 15px;">
                <small style="opacity: 0.6; display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">הכנסה פסיבית לשעה</small>
                <div id="home-passive" style="font-size: 26px; font-weight: 800; color: var(--green); margin-top: 5px;">
                    ₪${Math.floor(passiveInc).toLocaleString()}
                </div>
            </div>

            <div class="grid-2" style="margin: 15px 0;">
                <button class="action" onclick="saveGame()" style="background:#1e293b; color:var(--blue); border:1px solid var(--blue);">💾 שמור משחק</button>
                <button class="action" onclick="getDailyGift()" style="background:var(--purple); color:#fff; box-shadow: none;">🎁 מתנה יומית</button>
            </div>

            <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <h4 style="margin:0; font-size:13px; color:var(--blue);">📦 נכסים אחרונים</h4>
                </div>
                <div id="inventory-list" style="display:grid; grid-template-columns: repeat(5, 1fr); gap:8px;">
                    ${renderInventoryIcons()}
                </div>
            </div>

            <div style="margin-top: 40px; text-align: center; padding-bottom: 20px;">
                <button class="reset-btn" onclick="confirmReset()">
                    ⚠️ איפוס נתונים כללי
                </button>
            </div>
        </div>
    `;
}

/**
 * עדכון כל רכיבי ה-UI בזמן אמת
 */
function updateUI() {
    try {
        const m = (typeof money !== 'undefined') ? money : 0;
        const b = (typeof bank !== 'undefined') ? bank : 0;
        const p = (typeof passive !== 'undefined') ? passive : 0;
        const xp = (typeof lifeXP !== 'undefined') ? lifeXP : 0;
        const ld = getLevelData(xp);
        
        // עדכון שורת סטטיסטיקה עליונה
        if(document.getElementById('money')) document.getElementById('money').innerText = Math.floor(m).toLocaleString();
        if(document.getElementById('bank')) document.getElementById('bank').innerText = Math.floor(b).toLocaleString();
        if(document.getElementById('life-level-ui')) document.getElementById('life-level-ui').innerText = ld.level;

        // עדכון דף הבית אם הוא פתוח
        if(document.getElementById('home-passive')) {
            document.getElementById('home-passive').innerText = "₪" + Math.floor(p).toLocaleString();
        }
        
        const bar = document.getElementById('xp-progress-bar');
        if(bar) bar.style.width = ld.progressPercent + "%";
        
    } catch(err) {
        console.warn("UI Sync Error:", err);
    }
}

/**
 * פונקציית עזר לרינדור אייקונים של נכסים
 */
function renderInventoryIcons() {
    const inv = (typeof inventory !== 'undefined' && Array.isArray(inventory)) ? inventory : [];
    if (inv.length === 0) return '<span style="grid-column: 1/6; font-size:11px; opacity:0.3; text-align:center; padding:10px;">אין נכסים בבעלותך</span>';
    
    // מציג רק את 10 הנכסים האחרונים
    return inv.slice(-10).reverse().map(item => {
        return `<div style="background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:10px; display:flex; justify-content:center; align-items:center; aspect-ratio:1/1; font-size:20px;">${item.icon || '📦'}</div>`;
    }).join('');
}

/**
 * קבלת מתנה יומית (עם הגנה)
 */
function getDailyGift() {
    const lastGift = localStorage.getItem('last_gift_time') || 0;
    const now = Date.now();
    const cooldown = 4 * 60 * 60 * 1000; // 4 שעות

    if (now - lastGift < cooldown) {
        const diff = cooldown - (now - lastGift);
        const mins = Math.ceil(diff / (1000 * 60));
        showMsg(`⏳ המתנה תהיה מוכנה בעוד ${mins} דקות`, "var(--red)");
        return;
    }

    if (typeof money !== 'undefined') {
        const prize = 5000 + (typeof lifeXP !== 'undefined' ? Math.floor(lifeXP / 2) : 0);
        money += prize;
        if(typeof lifeXP !== 'undefined') lifeXP += 500;
        
        localStorage.setItem('last_gift_time', now);
        updateUI();
        showMsg(`🎁 קיבלת ₪${prize.toLocaleString()} בונוס!`, "var(--green)");
        if (typeof saveGame === 'function') saveGame();
    }
}

/**
 * איפוס משחק מאובטח
 */
function confirmReset() {
    if (confirm("האם אתה בטוח שברצונך למחוק את כל ההתקדמות?")) {
        const pass = prompt("הכנס סיסמת אישור (1234):");
        if (pass === "1234") {
            localStorage.clear();
            showMsg("הנתונים נמחקו. טוען מחדש...", "var(--red)");
            setTimeout(() => location.reload(), 1500);
        } else if (pass !== null) {
            alert("סיסמה שגויה!");
        }
    }
}
