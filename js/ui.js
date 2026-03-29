/* Smart Money Pro - js/ui.js - v5.7.7 */

let deferredPrompt;

// תפיסת אירוע ההתקנה מהדפדפן
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    renderInstallBtn(); // רינדור הכפתור ברגע שהדפדפן מוכן
});

function openTab(t) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + t.charAt(0).toUpperCase() + t.slice(1));
    if(btn) btn.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";
    
    if(t === 'home') drawHome(c);
    else if(t === 'work') drawWork(c);
    else if(t === 'tasks') drawCasino(c);
    else if(t === 'invest') drawInvest(c);
    else if(t === 'bank') drawBank(c);
    else drawMarket(c, t);
    
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
            
            <div id="install-container" style="margin:10px 0;"></div>

            <div style="margin:10px 0;">
                <small>רמת חיים: <b>${level}</b> (${Math.floor(lifeXP)} / ${nextXP} XP)</small>
                <div class="progress-container"><div class="progress-bar xp-bar" style="width:${progress}%"></div></div>
            </div>

            <div class="grid-2">
                <div class="card" style="margin:0; padding:10px; text-align:center;">
                    <small>הכנסה פסיבית</small><br><b style="color:var(--green)">${passive.toFixed(2)}₪/ש</b>
                </div>
                <div class="card" style="margin:0; padding:10px; text-align:center;">
                    <small>חוב לבנק</small><br><b style="color:var(--red)">${loan.toLocaleString()}₪</b>
                </div>
            </div>

            <hr style="opacity:0.1; margin:15px 0;">
            
            <div style="font-size:0.85em;">
                <p>🎓 <b>כישורים:</b> ${skills.length > 0 ? skills.join(", ") : "אין"}</p>
                <p>🚗 <b>רכבים:</b> ${cars.length > 0 ? cars.join(", ") : "ברגל"}</p>
                <p>🛒 <b>פריטים:</b> ${inventory.length > 0 ? inventory.join(", ") : "אין"}</p>
            </div>
        </div>`;

    renderGiftBtn();
    renderInstallBtn();
    updateUI();
}

// לוגיקת כפתור ההתקנה (אדום אם מותקן, תכלת אם לא)
function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(!cont) return;
    
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if(isInstalled) {
        cont.innerHTML = `<button class="action" style="background:var(--red); border:none; margin:0;" disabled>אפליקציה מותקנת ✅</button>`;
    } else {
        cont.innerHTML = `<button class="action" style="background:var(--blue); border:none; margin:0;" onclick="showInstallGuide()">התקן אפליקציה 📲</button>`;
    }
}

function showInstallGuide() {
    const modal = document.getElementById("installModal");
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    modal.style.display = "flex";
    document.getElementById("ios-instr").style.display = ios ? "block" : "none";
    document.getElementById("android-instr").style.display = ios ? "none" : "block";
    
    // אם זה אנדרואיד ויש פרומפט מוכן, נפעיל אותו
    if (!ios && deferredPrompt) {
        deferredPrompt.prompt();
    }
}

function closeInstallGuide() {
    document.getElementById("installModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => openTab('home'), 200);
});
