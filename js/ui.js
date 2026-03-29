/* Smart Money Pro - js/ui.js - v6.0.6 - Real-time Passive & Home Fix */

let deferredPrompt;

// תפיסת אירוע ההתקנה של ה-PWA
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    renderInstallBtn();
});

// --- 🔥 מנוע הכנסה פסיבית (עדכון כל שנייה) ---
setInterval(() => {
    if (typeof passive !== 'undefined' && passive > 0) {
        // מחלקים את ההכנסה השעתית ב-3600 שניות כדי לקבל רווח לשנייה
        money += (passive / 3600);
        updateUI();
    }
}, 1000);

// --- עדכון הבר העליון (Top Bar) ---
function updateUI() {
    const moneyEl = document.getElementById('money');
    const bankEl = document.getElementById('bank');
    const levelEl = document.getElementById('life-level-ui');

    if(moneyEl) moneyEl.innerText = Math.floor(money).toLocaleString();
    if(bankEl) bankEl.innerText = Math.floor(bank).toLocaleString();
    if(levelEl) levelEl.innerText = Math.floor(lifeXP / 5000) + 1;
    
    // שמירה אוטומטית
    if(typeof saveGame === 'function') saveGame();
}

// --- ניווט ראשי ---
function openTab(t) {
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
        updateUI();
    }, 100);
}

// --- ציור דף הבית (Dashboard) מעודכן ---
function drawHome(c) {
    const level = Math.floor(lifeXP / 5000) + 1;
    const progress = ((lifeXP % 5000) / 5000) * 100;

    c.innerHTML = `
        <div class="card fade-in">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0;">🏠 מרכז שליטה</h3>
                <button onclick="getDailyGift()" class="sys-btn" style="padding:5px 12px; font-size:12px;">🎁 מתנה</button>
            </div>
            
            <div class="card" style="background:rgba(0,0,0,0.15); margin-bottom:15px; padding:12px; border:1px solid var(--border);">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:12px;">
                    <span>רמת חיים <b>${level}</b></span>
                    <span>${Math.floor(lifeXP % 5000).toLocaleString()} / 5,000 XP</span>
                </div>
                <div style="height:10px; background:rgba(255,255,255,0.05); border-radius:10px; overflow:hidden;">
                    <div style="width:${progress}%; height:100%; background:var(--blue); transition: width 0.3s ease;"></div>
                </div>
            </div>

            <div class="grid-2">
                <div class="card" style="margin:0; padding:12px; text-align:center; border:1px solid rgba(34, 197, 94, 0.2);">
                    <small style="opacity:0.7; font-size:10px;">הכנסה פסיבית</small><br>
                    <b style="color:var(--green); font-size:14px;">${Math.floor(passive).toLocaleString()}₪/ש</b>
                </div>
                <div class="card" style="margin:0; padding:12px; text-align:center; border:1px solid rgba(239, 68, 68, 0.2);">
                    <small style="opacity:0.7; font-size:10px;">חוב לבנק</small><br>
                    <b style="color:var(--red); font-size:14px;">${loan.toLocaleString()}₪</b>
                </div>
            </div>

            <div class="card" style="margin-top:15px; font-size:13px; background:rgba(255,255,255,0.02); padding:10px; border:1px dashed var(--border);">
                <p style="margin:5px 0;">🎓 <b>כישורים:</b> ${skills.length > 0 ? skills.join(", ") : "ללא הכשרה"}</p>
                <p style="margin:5px 0;">🚗 <b>רכב:</b> ${cars.length > 0 ? cars.join(", ") : "אין רכב"}</p>
            </div>

            <div class="card" style="margin-top:15px; padding:12px; background:rgba(255,255,255,0.02);">
                <small style="opacity:0.6; display:block; margin-bottom:8px;">📦 המלאי שלי:</small>
                <div id="inventory-list" style="display:flex; gap:8px; overflow-x:auto; min-height:50px; padding-bottom:5px; align-items:center;">
                    ${inventory.length > 0 
                        ? inventory.map(item => `
                            <div title="${item.name || item}" style="font-size:22px; background:rgba(255,255,255,0.05); padding:8px; border-radius:10px; min-width:45px; text-align:center; border:1px solid var(--border);">
                                ${item.icon || '📦'}
                            </div>`).join('') 
                        : '<span style="opacity:0.4; font-size:11px;">המלאי ריק.</span>'}
                </div>
            </div>

            <div id="install-container" style="margin-top:15px;"></div>

            <button class="action" style="background:none; border:1px solid var(--red); color:var(--red); margin-top:20px; font-size:11px; padding:8px; opacity:0.5; width:100%;" onclick="if(confirm('לאפס הכל?')) resetGame()">🗑️ איפוס חשבון</button>
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
        cont.innerHTML = `<button class="action" style="background:var(--blue); color:#fff; font-weight:bold;" onclick="triggerInstall()">📲 התקן אפליקציה</button>`;
    } else { cont.innerHTML = ""; }
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') { deferredPrompt = null; renderInstallBtn(); }
}

// --- אתחול מערכת ---
document.addEventListener("DOMContentLoaded", () => {
    if(typeof loadGame === 'function') loadGame();
    setTimeout(() => {
        openTab('home');
        updateUI();
    }, 150);
});
