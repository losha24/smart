/* Smart Money Pro - js/ui.js - v6.0.0 - Updated & Synced */

let deferredPrompt;

// תפיסת אירוע ההתקנה
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    renderInstallBtn();
});

// פונקציית ניווט בין טאבים - מעודכן לגרסה 6
function openTab(t) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + t.charAt(0).toUpperCase() + t.slice(1));
    if(btn) btn.classList.add("active");
    
    const c = document.getElementById("content"); 
    c.innerHTML = "";
    
    if(t === 'home') drawHome(c);
    else if(t === 'work') drawWork(c);
    else if(t === 'tasks') drawCasino(c);
    else if(t === 'invest') drawInvest(c);
    else if(t === 'bank') drawBank(c);
    else drawMarket(c, t); // מטפל בכישורים, רכבים, נדל"ן ועסקים
    
    window.scrollTo(0,0);
}

function drawHome(c) {
    const level = Math.floor(lifeXP / 5000) + 1;
    const nextXP = level * 5000;
    const progress = ((lifeXP % 5000) / 5000) * 100;

    c.innerHTML = `
        <div class="card fade-in">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3>🏠 מרכז שליטה</h3>
                <div id="gift-container"></div>
            </div>
            
            <div style="margin:10px 0;">
                <small>רמת חיים: <b>${level}</b> (${Math.floor(lifeXP).toLocaleString()} / ${nextXP.toLocaleString()} XP)</small>
                <div class="progress-container"><div class="progress-bar xp-bar" style="width:${progress}%"></div></div>
            </div>

            <div class="grid-2">
                <div class="card" style="margin:0; padding:10px; text-align:center;">
                    <small>הכנסה פסיבית</small><br>
                    <b style="color:var(--green)">${passive.toFixed(2)}₪/ש</b>
                </div>
                <div class="card" style="margin:0; padding:10px; text-align:center;">
                    <small>חוב לבנק</small><br>
                    <b style="color:var(--red)">${loan.toLocaleString()}₪</b>
                </div>
            </div>

            <hr style="opacity:0.1; margin:15px 0;">
            
            <div style="font-size:0.85em; line-height:1.5;">
                <p>🎓 <b>כישורים:</b> ${skills.length > 0 ? skills.join(", ") : "אין"}</p>
                <p>🚗 <b>רכבים:</b> ${cars.length > 0 ? cars.join(", ") : "ברגל"}</p>
                <p>🛒 <b>פריטים:</b> ${inventory.length > 0 ? inventory.join(", ") : "אין"}</p>
            </div>

            <button class="action" style="background:var(--red); margin-top:20px; border:none; font-size:12px;" onclick="resetGame()">🗑️ איפוס התקדמות</button>
            
            <div id="install-container" style="margin-top:15px;"></div>
        </div>
    `;

    // קריאה לפונקציות עזר מקבצים אחרים
    if (typeof renderGiftBtn === "function") renderGiftBtn();
    renderInstallBtn();
    updateUI();
}

function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(!cont) return;
    
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if(isInstalled) {
        cont.innerHTML = `
            <div class="card" style="background:rgba(34, 197, 94, 0.1); color:var(--green); text-align:center; margin:0; padding:12px; border:1px solid var(--green); font-weight:bold; border-radius:10px; font-size:13px;">
                ✅ האפליקציה מותקנת בהצלחה
            </div>`;
    } else {
        cont.innerHTML = `
            <button class="action" style="background:var(--blue); border:none; margin:0; width:100%;" onclick="showInstallGuide()">
                📲 התקן אפליקציה למסך הבית
            </button>`;
    }
}

function showInstallGuide() {
    const modal = document.getElementById("installModal");
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if(modal) {
        modal.style.display = "flex";
        document.getElementById("ios-instr").style.display = ios ? "block" : "none";
        document.getElementById("android-instr").style.display = ios ? "none" : "block";
    }
    
    if (!ios && deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            deferredPrompt = null;
        });
    }
}

function closeInstallGuide() {
    const modal = document.getElementById("installModal");
    if(modal) modal.style.display = "none";
}

// אתחול דף הבית בטעינה
document.addEventListener("DOMContentLoaded", () => {
    // השהייה קטנה כדי לוודא ש-core טען את הנתונים מה-Storage
    setTimeout(() => openTab('home'), 150);
});
