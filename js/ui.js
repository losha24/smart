/* Smart Money Pro - js/ui.js - v6.1.3 - Final Sync */

let deferredPrompt;
let currentTab = 'home'; 

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    renderInstallBtn();
});

// --- עדכון ויזואלי מהיר (נקרא מה-Core) ---
function renderUIUpdate() {
    if (currentTab === 'home') {
        const passiveEl = document.getElementById('passive-display');
        const progressEl = document.getElementById('xp-progress-bar');
        const xpTextEl = document.getElementById('xp-text-detail');
        const levelValEl = document.getElementById('home-level-val');
        
        // הצגת הכנסה פסיבית
        if (passiveEl) {
            const currentPassive = typeof passive !== 'undefined' ? passive : 0;
            passiveEl.innerText = currentPassive.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + " ₪/ש";
        }
        
        // עדכון בר התקדמות (לפי 1000 XP לרמה)
        if (progressEl && xpTextEl) {
            const currentXP = typeof lifeXP !== 'undefined' ? lifeXP : 0;
            const progress = ((currentXP % 1000) / 1000) * 100;
            progressEl.style.width = progress + "%";
            xpTextEl.innerText = Math.floor(currentXP % 1000).toLocaleString() + " / 1,000 XP";
        }
        
        // עדכון מספר הרמה
        if (levelValEl) {
            const level = Math.floor((typeof lifeXP !== 'undefined' ? lifeXP : 0) / 1000) + 1;
            levelValEl.innerText = level;
        }
    }
}

// --- מערכת ניווט ---
function openTab(t) {
    currentTab = t; 
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
        if(typeof updateUI === 'function') updateUI();
    }, 120);
}

// --- דף הבית ---
function drawHome(c) {
    const safeXP = typeof lifeXP !== 'undefined' ? lifeXP : 0;
    const level = Math.floor(safeXP / 1000) + 1;
    const progress = ((safeXP % 1000) / 1000) * 100;

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
                    <span id="xp-text-detail" style="opacity:0.8;">${Math.floor(safeXP % 1000).toLocaleString()} / 1,000 XP</span>
                </div>
                <div style="height:10px; background:rgba(0,0,0,0.2); border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,0.05);">
                    <div id="xp-progress-bar" style="width:${progress}%; height:100%; background:linear-gradient(90deg, var(--blue), #60a5fa); transition: width 0.5s ease;"></div>
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

            <button class="sys-btn" style="border:1px solid #451a1a; color:#ef4444; margin-top:25px; font-size:11px; padding:10px; width:100%;" onclick="resetGame()">🗑️ איפוס חשבון</button>
        </div>
    `;
    renderInstallBtn();
}
