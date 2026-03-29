/* Smart Money Pro - js/ui.js - v6.0.3 - Full UI & Inventory Logic Build */

let deferredPrompt;

// תפיסת אירוע ההתקנה של ה-PWA
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    renderInstallBtn();
});

// ניווט ראשי בין טאבים
function openTab(t) {
    // עדכון ויזואלי של כפתורי הניווט
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    
    // מציאת הכפתור לפי ה-ID (הופך 'home' ל-'btnHome')
    const btnId = "btn" + t.charAt(0).toUpperCase() + t.slice(1);
    const btn = document.getElementById(btnId);
    if(btn) btn.classList.add("active");
    
    const c = document.getElementById("content"); 
    if(!c) return;
    
    // אנימציית מעבר חלקה
    c.style.opacity = "0";
    
    setTimeout(() => {
        c.innerHTML = "";
        
        // ניתוב חכם לפונקציות הציור מתוך activities.js
        switch(t) {
            case 'home':   drawHome(c); break;
            case 'work':   drawWork(c); break;
            case 'skills': drawSkills(c); break;
            case 'cars':   drawCars(c); break;
            case 'estate': drawRealestate(c); break;
            case 'tasks':  drawCasino(c); break;
            default:       drawHome(c);
        }
        
        c.style.opacity = "1";
        window.scrollTo(0,0);
    }, 100);
}

function drawHome(c) {
    const level = Math.floor(lifeXP / 5000) + 1;
    const progress = ((lifeXP % 5000) / 5000) * 100;

    c.innerHTML = `
        <div class="card fade-in">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0;">🏠 מרכז שליטה</h3>
                <button onclick="getDailyGift()" class="sys-btn" style="padding:5px 12px; font-size:12px;">🎁 מתנה יומית</button>
            </div>
            
            <div class="card" style="background:rgba(0,0,0,0.15); margin-bottom:15px; padding:12px; border:1px solid var(--border);">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:12px;">
                    <span>רמת חיים <b>${level}</b></span>
                    <span>${Math.floor(lifeXP % 5000).toLocaleString()} / 5,000 XP</span>
                </div>
                <div class="progress-container"><div class="progress-bar xp-bar" style="width:${progress}%"></div></div>
            </div>

            <div class="grid-2">
                <div class="card" style="margin:0; padding:12px; text-align:center;">
                    <small style="opacity:0.7; font-size:10px;">הכנסה פסיבית</small><br>
                    <b style="color:var(--green); font-size:14px;">${passive.toFixed(2)}₪/ש</b>
                </div>
                <div class="card" style="margin:0; padding:12px; text-align:center;">
                    <small style="opacity:0.7; font-size:10px;">חוב לבנק</small><br>
                    <b style="color:var(--red); font-size:14px;">${loan.toLocaleString()}₪</b>
                </div>
            </div>

            <div class="card" style="margin-top:15px; padding:12px; background:rgba(255,255,255,0.02);">
                <small style="opacity:0.6;">📦 המלאי שלי (Inventory):</small>
                <div id="inventory-list" style="display:flex; gap:8px; margin-top:8px; overflow-x:auto; min-height:45px; padding-bottom:5px; align-items:center;">
                    ${inventory.length > 0 
                        ? inventory.map(item => `
                            <div title="${item.name}" style="font-size:24px; background:rgba(255,255,255,0.05); padding:8px; border-radius:12px; min-width:45px; text-align:center; border:1px solid var(--border);">
                                ${item.icon}
                            </div>`).join('') 
                        : '<span style="opacity:0.4; font-size:11px; padding:10px;">המלאי ריק. רכוש נכסים או פריטים כדי לראותם כאן.</span>'}
                </div>
            </div>

            <div class="card" style="margin-top:15px; font-size:0.85em; border-style:dashed; opacity:0.8; background:none;">
                <p style="margin:5px 0;">🎓 <b>השכלה:</b> ${skills.length > 0 ? skills.join(", ") : "ללא הכשרה מקצועית"}</p>
                <p style="margin:5px 0;">🚗 <b>רכב:</b> ${cars.length > 0 ? cars[cars.length-1] : "הולך ברגל"}</p>
            </div>

            <div id="install-container" style="margin-top:15px;"></div>

            <button class="action" style="background:none; border:1px solid var(--red); color:var(--red); margin-top:20px; font-size:11px; padding:8px; opacity:0.5;" onclick="resetGameConfirm()">🗑️ איפוס חשבון</button>
        </div>
    `;

    renderInstallBtn();
}

// ניהול כפתור ההתקנה (PWA)
function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(!cont) return;
    
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if(!isStandalone && deferredPrompt) {
        cont.innerHTML = `
            <button class="action" style="background:var(--blue); color:#000; font-weight:bold;" onclick="triggerInstall()">
                📲 התקן את Smart Money בנייד
            </button>`;
    } else {
        cont.innerHTML = ""; 
    }
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        deferredPrompt = null;
        renderInstallBtn();
    }
}

function resetGameConfirm() {
    if(confirm("האם אתה בטוח שברצונך למחוק את כל ההתקדמות? פעולה זו אינה הפיכה!")) {
        localStorage.clear();
        location.reload();
    }
}

// הפעלה ראשונית
document.addEventListener("DOMContentLoaded", () => {
    // טעינת נתונים
    if(typeof loadGame === 'function') loadGame();
    
    // פתיחת דף הבית
    setTimeout(() => {
        openTab('home');
        if(typeof updateUI === 'function') updateUI();
    }, 150);
});
