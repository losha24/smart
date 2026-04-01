/* Smart Money Pro - js/ui.js - v6.5.1 
   FULL INTERFACE ENGINE - NO MISSING LINES
*/

let currentTab = 'home';
const adminMsgText = "שלום אלכסיי! המערכת מעודכנת לגרסה 6.5.1. כל הנתונים נשמרים בענן המקומי.";

/**
 * ניהול החלפת טאבים וטעינת תוכן דינמי
 */
function openTab(t) {
    currentTab = t;
    
    // עדכון ויזואלי של הכפתור הפעיל ב-Topbar
    document.querySelectorAll(".topbar button").forEach(btn => {
        btn.classList.remove("active");
    });
    
    const activeBtn = document.getElementById("btn" + t.charAt(0).toUpperCase() + t.slice(1));
    if(activeBtn) activeBtn.classList.add("active");
    
    const container = document.getElementById("content");
    if(!container) return;
    
    // ניקוי הקונטיינר לפני רינדור חדש
    container.innerHTML = "";
    
    // ניתוב ללוגיקת הרינדור המתאימה (מפוזרת בין הקבצים)
    if(t === 'home') drawHome(container);
    else if(t === 'work') drawWork(container);
    else if(t === 'business') drawBusiness(container);
    else if(t === 'estate') drawEstate(container);
    else if(t === 'market') drawMarket(container);
    else if(t === 'bank') drawBank(container);
    else if(t === 'invest') drawInvest(container);
    else if(t === 'tasks') drawTasks(container);
    else if(t === 'skills') drawSkills(container);
    else if(t === 'cars') drawCars(container);

    // עדכון הנתונים הכלליים ב-UI
    updateUI();
    window.scrollTo(0,0);
}

/**
 * רינדור דף הבית המלא (Home Tab)
 */
function drawHome(c) {
    const ld = getLevelData(lifeXP);
    
    // חישוב כמות נכסים לפי סוגים (לצורך תצוגה סטטיסטית)
    const estateCount = inventory.filter(i => i.type === 'estate').length;
    const bizCount = inventory.filter(i => i.type === 'business').length;

    c.innerHTML = `
        <div class="admin-box fade-in">
            <div style="display:flex; align-items:center; gap:12px;">
                <div style="background:var(--blue); color:#000; padding:8px; border-radius:50%; font-size:20px;">📢</div>
                <div>
                    <b style="font-size:15px;">עדכון מערכת:</b><br>
                    <span style="font-size:12px; opacity:0.85;">${adminMsgText}</span>
                </div>
            </div>
        </div>

        <div class="card fade-in">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:15px;">
                <div>
                    <h2 style="margin:0; font-size:22px; color:var(--blue);">לוח בקרה</h2>
                    <small style="opacity:0.6;">גרסת תוכנה: ${VERSION}</small>
                </div>
                <button onclick="getDailyGift()" class="sys-btn" style="background:var(--yellow); color:#000; border:none; padding:10px 15px; font-weight:bold;">
                    🎁 מתנה יומית
                </button>
            </div>

            <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:12px; border:1px solid var(--border); margin-bottom:15px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <span>רמה <b style="color:var(--purple); font-size:18px;">${ld.level}</b></span>
                    <span style="font-size:12px;">${ld.xpInCurrentLevel.toLocaleString()} / ${ld.xpForNext.toLocaleString()} XP</span>
                </div>
                <div class="progress-container" style="height:12px;">
                    <div id="xp-progress-bar" class="progress-bar xp-bar" style="width:${ld.progressPercent}%"></div>
                </div>
            </div>

            <div class="grid-2">
                <div class="card" style="margin:0; border-right:4px solid var(--green); background:rgba(34,197,94,0.03);">
                    <small style="opacity:0.7;">רווח לשעה</small><br>
                    <b style="color:var(--green); font-size:18px;">+${Math.floor(passive).toLocaleString()} ₪</b>
                </div>
                <div class="card" style="margin:0; border-right:4px solid var(--red); background:rgba(239,68,68,0.03);">
                    <small style="opacity:0.7;">חובות לבנק</small><br>
                    <b style="color:var(--red); font-size:18px;">${loan.toLocaleString()} ₪</b>
                </div>
            </div>
        </div>

        <div class="card fade-in">
            <h3 style="margin-top:0; font-size:16px; border-bottom:1px solid var(--border); padding-bottom:8px;">📦 המלאי שלך</h3>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:15px;">
                <div style="font-size:12px; background:rgba(255,255,255,0.05); padding:8px; border-radius:8px;">
                    🏠 נדל"ן: <b>${estateCount}</b>
                </div>
                <div style="font-size:12px; background:rgba(255,255,255,0.05); padding:8px; border-radius:8px;">
                    🏢 עסקים: <b>${bizCount}</b>
                </div>
            </div>

            <div id="inventory-grid" style="display:flex; flex-wrap:wrap; gap:10px;">
                ${inventory.length === 0 ? '<div style="width:100%; text-align:center; opacity:0.3; padding:20px;">התיק ריק...</div>' : ''}
                ${inventory.map(item => `
                    <div class="inv-item" title="${item.name}" style="background:var(--bg); border:1px solid var(--border); padding:10px; border-radius:10px; font-size:24px; position:relative;">
                        ${item.icon}
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="card fade-in" style="opacity:0.8; font-size:12px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <span>סך הכל הרווחת בקריירה:</span>
                <b style="color:var(--blue);">${totalEarned.toLocaleString()} ₪</b>
            </div>
            <div style="display:flex; justify-content:space-between;">
                <span>מהירות עבודה נוכחית:</span>
                <b style="color:var(--yellow);">x${carSpeed}</b>
            </div>
        </div>
    `;
}

/**
 * עדכון ויזואלי של פסי התקדמות בזמן אמת (נקרא מה-core.js)
 */
function renderUIUpdate(ld) {
    if(currentTab === 'home') {
        const xpBar = document.getElementById('xp-progress-bar');
        if(xpBar) xpBar.style.width = ld.progressPercent + "%";
    }
}

/**
 * מערכת הודעות (Toast Notifications)
 */
function showMsg(msg, color = "var(--blue)") {
    const bar = document.getElementById('status-bar');
    if(!bar) return;
    
    // ביטול אנימציה קודמת אם קיימת
    bar.style.transition = 'none';
    bar.style.opacity = '0';
    bar.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        bar.innerText = msg;
        bar.style.color = color;
        bar.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        bar.style.opacity = '1';
        bar.style.transform = 'translateY(0)';
    }, 10);
    
    // הסתרה אוטומטית
    setTimeout(() => {
        bar.style.opacity = '0';
        bar.style.transform = 'translateY(-10px)';
    }, 4000);
}

// אתחול הממשק עם עליית הדף
document.addEventListener("DOMContentLoaded", () => {
    // השהייה קלה כדי לוודא ש-core סיים לטעון מה-localStorage
    setTimeout(() => {
        openTab('home');
    }, 150);
});
