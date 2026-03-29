/* Smart Money Pro - js/ui.js - v6.0.8 - Sync & Tabs Fix */

let deferredPrompt;
let currentTab = 'home'; // מעקב אחרי הלשונית הפתוחה

// תפיסת אירוע ההתקנה של ה-PWA
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    renderInstallBtn();
});

// --- פונקציית רינדור (נקראת מה-Core 10 פעמים בשנייה) ---
function renderUIUpdate() {
    // עדכון אלמנטים בדף הבית אם הוא פתוח
    if (currentTab === 'home') {
        const passiveEl = document.getElementById('passive-display');
        const progressEl = document.getElementById('xp-progress-bar');
        const xpTextEl = document.getElementById('xp-text-detail');
        
        if (passiveEl) passiveEl.innerText = passive.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + "₪/ש";
        
        if (progressEl && xpTextEl) {
            const progress = ((lifeXP % 5000) / 5000) * 100;
            progressEl.style.width = progress + "%";
            xpTextEl.innerText = Math.floor(lifeXP % 5000).toLocaleString() + " / 5,000 XP";
        }
    }
}

// --- ניווט ראשי ---
function openTab(t) {
    currentTab = t; // עדכון הלשונית הנוכחית
    
    // עדכון כפתורי התפריט
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btnId = "btn" + t.charAt(0).toUpperCase() + t.slice(1);
    const btn = document.getElementById(btnId);
    if(btn) btn.classList.add("active");
    
    const c = document.getElementById("content"); 
    if(!c) return;
    
    c.style.opacity = "0";
    
    setTimeout(() => {
        c.innerHTML = "";
        switch(t) {
            case 'home':       drawHome(c); break;
            case 'work':       if(typeof drawWork === 'function') drawWork(c); break;
            case 'tasks':      if(typeof drawTasks === 'function') drawTasks(c); break; 
            case 'invest':     if(typeof drawInvest === 'function') drawInvest(c); break;
            case 'bank':       if(typeof drawBank === 'function') drawBank(c); break;
            case 'skills':     if(typeof drawSkills === 'function') drawSkills(c); break;
            case 'cars':       if(typeof drawCars === 'function') drawCars(c); break;
            case 'estate':     if(typeof drawEstate === 'function') drawEstate(c); break; 
            case 'business':   if(typeof drawBusiness === 'function') drawBusiness(c); break;
            case 'market':     if(typeof drawMarket === 'function') drawMarket(c); break;
            default:           drawHome(c);
        }
        
        c.style.opacity = "1";
        window.scrollTo(0,0);
        
        // קריאה לעדכון הבר העליון מה-Core
        if(typeof updateUI === 'function') updateUI();
    }, 120);
}

// --- ציור דף הבית (Dashboard) ---
function drawHome(c) {
    const level = Math.floor(lifeXP / 5000) + 1;
    const progress = ((lifeXP % 5000) / 5000) * 100;

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
                    <span>רמת חיים <b id="home-level-val">${level}</b></span>
                    <span id="xp-text-detail" style="opacity:0.8;">${Math.floor(lifeXP % 5000).toLocaleString()} / 5,000 XP</span>
                </div>
                <div style="height:10px; background:rgba(0,0,0,0.2); border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,0.05);">
                    <div id="xp-progress-bar" style="width:${progress}%; height:100%; background:linear-gradient(90deg, var(--blue), #60a5fa); transition: width 0.5s ease;"></div>
                </div>
            </div>

            <div class="grid-2">
                <div class="card" style="margin:0; padding:12px; text-align:center; border: 1px solid rgba(34, 197, 94, 0.2); background:rgba(34, 197, 94, 0.02);">
                    <small style="opacity:0.7; font-size:10px; display:block; margin-bottom:4px;">💰 הכנסה פסיבית</small>
                    <b id="passive-display" style="color:var(--green); font-size:15px;">${passive.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}₪/ש</b>
                </div>
                <div class="card" style="margin:0; padding:12px; text-align:center; border: 1px solid rgba(239, 68, 68, 0.2); background:rgba(239, 68, 68, 0.02);">
                    <small style="opacity:0.7; font-size:10px; display:block; margin-bottom:4px;">🏦 חוב לבנק</small>
                    <b style="color:var(--red); font-size:15px;">${loan.toLocaleString()}₪</b>
                </div>
            </div>

            <div class="card" style="margin-top:15px; font-size:13px; background:rgba(255,255,255,0.01); padding:12px; border:1px dashed var(--border);">
                <div style="margin-bottom:8px;">🎓 <b>כישורים:</b> <span style="color:var(--blue)">${skills.length > 0 ? skills.join(", ") : "ללא הכשרה"}</span></div>
                <div>🚗 <b>רכב:</b> <span style="color:var(--yellow)">${cars.length > 0 ? cars[cars.length-1] : "הולך ברגל"}</span></div>
            </div>

            <div class="card" style="margin-top:15px; padding:12px; background:rgba(0,0,0,0.1);">
                <small style="opacity:0.6; display:block; margin-bottom:10px;">📦 הציוד שלי:</small>
                <div id="inventory-list" style="display:flex; gap:10px; overflow-x:auto; min-height:55px; padding-bottom:5px; align-items:center;">
                    ${inventory.length > 0 
                        ? inventory.map(item => `<div class="inv-item-icon">📦</div>`).join('') 
                        : '<span style="opacity:0.4; font-size:12px; font-style:italic;">אין פריטים במלאי...</span>'}
                </div>
            </div>

            <div id="install-container" style="margin-top:20px;"></div>

            <button class="sys-btn" style="border:1px solid #451a1a; color:#ef4444; margin-top:25px; font-size:11px; padding:10px; width:100%; background:rgba(239, 68, 68, 0.05);" onclick="resetGame()">🗑️ איפוס חשבון מוחלט</button>
        </div>
    `;
    renderInstallBtn();
}

// --- ניהול התקנת PWA ---
function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(!cont) return;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if(!isStandalone && deferredPrompt) {
        cont.innerHTML = `<button class="action" style="background:var(--blue); color:#fff; font-weight:bold;" onclick="triggerInstall()">📲 התקן כקיצור דרך</button>`;
    } else { cont.innerHTML = ""; }
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') { deferredPrompt = null; renderInstallBtn(); }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        openTab('home');
    }, 150);
});
