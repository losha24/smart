/* Smart Money Pro - js/ui.js - v6.0.3 - Full UI & Inventory Logic */

let deferredPrompt;

// תפיסת אירוע ההתקנה של הדפדפן
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    renderInstallBtn();
});

// ניווט ראשי בין טאבים
function openTab(t) {
    // עדכון כפתורי הניווט
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + t.charAt(0).toUpperCase() + t.slice(1));
    if(btn) btn.classList.add("active");
    
    const c = document.getElementById("content"); 
    if(!c) return;
    
    // אנימציית יציאה קלה
    c.style.opacity = "0";
    
    setTimeout(() => {
        c.innerHTML = "";
        
        // ניתוב לתוכן המתאים
        if(t === 'home') drawHome(c);
        else if(t === 'work') drawWork(c);
        else if(t === 'tasks') drawCasino(c);
        else if(t === 'invest') drawInvest(c);
        else if(t === 'bank') drawBank(c);
        else if(t === 'market') drawMarket(c); // תיקון: הפעלה ישירה של השוק
        else if(t === 'business') drawBusiness ? drawBusiness(c) : c.innerHTML = "<h3>בקרוב...</h3>";
        else if(t === 'realestate') drawRealEstate ? drawRealEstate(c) : c.innerHTML = "<h3>בקרוב...</h3>";
        else if(t === 'skills') drawSkills ? drawSkills(c) : c.innerHTML = "<h3>בקרוב...</h3>";
        else if(t === 'cars') drawCars ? drawCars(c) : c.innerHTML = "<h3>בקרוב...</h3>";
        
        c.style.opacity = "1";
        window.scrollTo(0,0);
    }, 50);
}

function drawHome(c) {
    const level = Math.floor(lifeXP / 5000) + 1;
    const progress = ((lifeXP % 5000) / 5000) * 100;

    c.innerHTML = `
        <div class="card fade-in">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0;">🏠 מרכז שליטה</h3>
                <div id="gift-container">
                     <button onclick="getDailyGift()" class="sys-btn" style="padding:5px 12px; font-size:12px;">🎁 מתנה יומית</button>
                </div>
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
                <small style="opacity:0.6;">📦 הפריטים שלי:</small>
                <div id="inventory-list" style="display:flex; gap:8px; margin-top:8px; overflow-x:auto; min-height:30px; padding-bottom:5px;">
                    ${inventory.length > 0 
                        ? inventory.map(item => `<span title="${item.name || ''}" style="font-size:20px; background:rgba(255,255,255,0.05); padding:5px; border-radius:8px;">${item.icon}</span>`).join('') 
                        : '<span style="opacity:0.4; font-size:11px;">טרם נרכשו פריטים בשוק</span>'}
                </div>
            </div>

            <div id="install-container" style="margin-top:15px;"></div>

            <div class="card" style="margin-top:15px; font-size:0.85em; border-style:dashed; opacity:0.8;">
                <p style="margin:5px 0;">🎓 <b>כישורים:</b> ${skills.length > 0 ? skills.join(", ") : "ללא השכלה"}</p>
                <p style="margin:5px 0;">🚗 <b>רכב נוכחי:</b> ${cars.length > 0 ? cars[cars.length-1] : "הולך ברגל"}</p>
            </div>

            <button class="action" style="background:none; border:1px solid var(--red); color:var(--red); margin-top:20px; font-size:11px; padding:8px;" onclick="resetGame()">🗑️ איפוס כל הנתונים</button>
        </div>
    `;

    renderInstallBtn();
    updateUI();
}

// ניהול כפתור ההתקנה
function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(!cont) return;
    
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if(!isInstalled) {
        cont.innerHTML = `
            <button class="action" style="background:var(--blue); color:#000; font-weight:bold;" onclick="showInstallGuide()">
                📲 התקן אפליקציה למסך הבית
            </button>`;
    } else {
        cont.innerHTML = ""; 
    }
}

// הצגת מדריך התקנה
function showInstallGuide() {
    const modal = document.getElementById("installModal");
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if(modal) {
        modal.style.display = "flex";
        const iosInstr = document.getElementById("ios-instr");
        const andInstr = document.getElementById("android-instr");
        if(iosInstr) iosInstr.style.display = ios ? "block" : "none";
        if(andInstr) andInstr.style.display = ios ? "none" : "block";
    }
    
    if (!ios && deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
    }
}

function closeInstallGuide() {
    const modal = document.getElementById("installModal");
    if(modal) modal.style.display = "none";
}

// הפעלה ראשונית של האפליקציה
document.addEventListener("DOMContentLoaded", () => {
    // טעינת המשחק לפני הצגת הטאב
    if(typeof loadGame === 'function') loadGame();
    
    setTimeout(() => {
        openTab('home');
        if(typeof updateUI === 'function') updateUI();
    }, 150);
});
