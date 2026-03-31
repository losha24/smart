/* Smart Money Pro - js/ui.js - v6.3.2 - Real-Time Sync & Smooth UI */

let deferredPrompt;
let currentTab = 'home'; 

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    renderInstallBtn();
});

/**
 * עדכון ויזואלי מהיר - נקרא מה-Core בכל "טיק" (50ms)
 * @param {Object} ld - אובייקט נתוני רמה: {level, xpInCurrentLevel, xpForNext, progressPercent}
 */
function renderUIUpdate(ld) {
    // 1. עדכון כסף וסטטיסטיקות גלובליות (מוצג בכל הטאבים)
    const mEl = document.getElementById('money');
    const bEl = document.getElementById('bank');
    
    if (mEl && typeof money !== 'undefined') {
        // מציג מספר שלם עם פסיקים (למשל 1,200)
        mEl.innerText = Math.floor(money).toLocaleString(); 
    }
    if (bEl && typeof bank !== 'undefined') {
        bEl.innerText = Math.floor(bank).toLocaleString();
    }

    // 2. עדכונים ספציפיים לדף הבית
    if (currentTab === 'home') {
        const passiveEl = document.getElementById('passive-display');
        const progressEl = document.getElementById('xp-progress-bar');
        const xpTextEl = document.getElementById('xp-text-detail');
        const levelValEl = document.getElementById('home-level-val');
        
        // הצגת הכנסה פסיבית שעתית
        if (passiveEl) {
            const currentPassive = typeof passive !== 'undefined' ? passive : 0;
            passiveEl.innerText = currentPassive.toLocaleString() + " ₪/ש";
        }
        
        // אם לא הגיע ld מה-Core, נחשב אותו כגיבוי
        if (!ld && typeof getLevelData === 'function') {
            ld = getLevelData(typeof lifeXP !== 'undefined' ? lifeXP : 0);
        }

        if (ld) {
            // עדכון פס התקדמות (Progress Bar)
            if (progressEl) {
                progressEl.style.width = ld.progressPercent + "%";
            }
            
            // עדכון טקסט XP (למשל: 450 / 1,250 XP)
            if (xpTextEl) {
                xpTextEl.innerText = `${Math.floor(ld.xpInCurrentLevel).toLocaleString()} / ${Math.floor(ld.xpForNext).toLocaleString()} XP`;
            }
            
            // עדכון מספר הרמה הגדול
            if (levelValEl) {
                levelValEl.innerText = ld.level;
            }
        }
    }
}

// --- מערכת ניווט בין טאבים ---
function openTab(t) {
    currentTab = t; 
    
    // עדכון ויזואלי של הכפתור הפעיל בתפריט
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btnId = "btn" + t.charAt(0).toUpperCase() + t.slice(1);
    const btn = document.getElementById(btnId);
    if(btn) btn.classList.add("active");
    
    const c = document.getElementById("content"); 
    if(!c) return;
    
    // אפקט פייד-אאוט קליל במעבר
    c.style.opacity = "0";
    
    setTimeout(() => {
        c.innerHTML = "";
        // טעינת התוכן המתאים לפי הטאב שנבחר
        switch(t) {
            case 'home':       drawHome(c); break;
            case 'work':       if(typeof drawWork === 'function') drawWork(c); break;
            case 'tasks':      if(typeof drawTasks === 'function') drawTasks(c); break; 
            case 'invest':     
            case 'market':     if(typeof drawMarket === 'function') drawMarket(c); 
                               else if(typeof drawInvest === 'function') drawInvest(c); break;
            case 'bank':       if(typeof drawBank === 'function') drawBank(c); break;
            case 'skills':     if(typeof drawSkills === 'function') drawSkills(c); break;
            case 'cars':       if(typeof drawCars === 'function') drawCars(c); break;
            case 'estate':     if(typeof drawEstate === 'function') drawEstate(c); break; 
            case 'business':   if(typeof drawBusiness === 'function') drawBusiness(c); break;
            default:           drawHome(c);
        }
        
        c.style.opacity = "1";
        window.scrollTo(0,0);
        
        // עדכון ערכים מיידי לאחר הציור
        if(typeof updateUI === 'function') updateUI();
    }, 120);
}

// --- ציור דף הבית (Dashboard) ---
function drawHome(c) {
    // חישוב נתוני רמה התחלתיים לציור הראשוני
    const ld = (typeof getLevelData === 'function') 
               ? getLevelData(typeof lifeXP !== 'undefined' ? lifeXP : 0) 
               : { level: 1, xpInCurrentLevel: 0, xpForNext: 1000, progressPercent: 0 };

    c.innerHTML = `
        <div class="card fade-in">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0;">🏠 מרכז שליטה</h3>
                <div style="display:flex; gap:8px;">
                     <button onclick="getDailyGift()" class="sys-btn" style="padding:5px 12px; font-size:12px; background:var(--yellow); color:black;">🎁 מתנה</button>
                     <button onclick="forceUpdate()" class="sys-btn" style="padding:5px 12px; font-size:12px;">🔄 רענן</button>
                </div>
            </div>
            
            <div class="card" style="background:rgba(255,255,255,0.03); margin-bottom:15px; padding:12px; border:1px solid var(--border);">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:12px;">
                    <span>רמת חיים <b id="home-level-val">${ld.level}</b></span>
                    <span id="xp-text-detail" style="opacity:0.8;">${Math.floor(ld.xpInCurrentLevel).toLocaleString()} / ${Math.floor(ld.xpForNext).toLocaleString()} XP</span>
                </div>
                <div style="height:10px; background:rgba(0,0,0,0.2); border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,0.05);">
                    <div id="xp-progress-bar" style="width:${ld.progressPercent}%; height:100%; background:linear-gradient(90deg, var(--blue), #60a5fa); transition: width 0.5s ease;"></div>
                </div>
            </div>

            <div class="grid-2">
                <div class="card" style="margin:0; padding:12px; text-align:center; border: 1px solid rgba(34, 197, 94, 0.2); background:rgba(34, 197, 94, 0.02);">
                    <small style="opacity:0.7; font-size:10px; display:block; margin-bottom:4px;">💰 הכנסה פסיבית</small>
                    <b id="passive-display" style="color:var(--green); font-size:15px;">${(typeof passive !== 'undefined' ? passive : 0).toLocaleString()} ₪/ש</b>
                </div>
                <div class="card" style="margin:0; padding:12px; text-align:center; border: 1px solid rgba(239, 68, 68, 0.2); background:rgba(239, 68, 68, 0.02);">
                    <small style="opacity:0.7; font-size:10px; display:block; margin-bottom:4px;">🏦 חוב לבנק</small>
                    <b style="color:var(--red); font-size:15px;">${(typeof loan !== 'undefined' ? loan : 0).toLocaleString()} ₪</b>
                </div>
            </div>

            <div class="card" style="margin-top:15px; font-size:13px; background:rgba(255,255,255,0.01); padding:12px; border:1px dashed var(--border);">
                <div style="margin-bottom:8px;">🎓 <b>כישורים:</b> <span style="color:var(--blue)">${(typeof skills !== 'undefined' && skills.length > 0) ? skills.join(", ") : "ללא הכשרה"}</span></div>
                <div>🚗 <b>רכב:</b> <span style="color:var(--yellow)">${(typeof cars !== 'undefined' && cars.length > 0) ? cars[cars.length-1] : "הולך ברגל"}</span></div>
            </div>

            <div class="card" style="margin-top:15px; padding:12px; background:rgba(0,0,0,0.1);">
                <small style="opacity:0.6; display:block; margin-bottom:10px;">📦 הציוד שלי:</small>
                <div id="inventory-list" style="display:flex; gap:10px; overflow-x:auto; min-height:55px; padding-bottom:5px; align-items:center;">
                    ${(typeof inventory !== 'undefined' && inventory.length > 0) 
                        ? inventory.map(item => `<div class="inv-item-icon">📦</div>`).join('') 
                        : '<span style="opacity:0.4; font-size:12px; font-style:italic;">אין פריטים...</span>'}
                </div>
            </div>

            <div id="install-container" style="margin-top:20px;"></div>

            <button class="sys-btn" style="border:1px solid #451a1a; color:#ef4444; margin-top:25px; font-size:11px; padding:10px; width:100%;" onclick="resetGame()">🗑️ איפוס חשבון</button>
        </div>
    `;
    renderInstallBtn();
}

// --- ניהול התקנת אפליקציה (PWA) ---
function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(!cont) return;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if(!isStandalone && deferredPrompt) {
        cont.innerHTML = `<button class="action" style="background:var(--blue); color:#fff; font-weight:bold; width:100%; padding:12px; border-radius:8px; border:none;" onclick="triggerInstall()">📲 התקן כאפליקציה (PWA)</button>`;
    } else { cont.innerHTML = ""; }
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') { deferredPrompt = null; renderInstallBtn(); }
}

// אתחול ראשוני של הדף
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => { openTab('home'); }, 150);
});
