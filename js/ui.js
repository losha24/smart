/* Smart Money Pro - js/ui.js - v6.0.1 - Updated & Synced */

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    renderInstallBtn();
});

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
    else if(t === 'market') drawMarket(c, 'market');
    else drawMarket(c, t);
    
    window.scrollTo(0,0);
}

function drawHome(c) {
    const level = Math.floor(lifeXP / 5000) + 1;
    const progress = ((lifeXP % 5000) / 5000) * 100;

    c.innerHTML = `
        <div class="card fade-in">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0;">🏠 מרכז שליטה</h3>
                <div id="gift-container"></div>
            </div>
            
            <div class="card" style="background:rgba(0,0,0,0.2); margin-bottom:15px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <small>רמת חיים <b>${level}</b></small>
                    <small>${Math.floor(lifeXP % 5000).toLocaleString()} / 5,000 XP</small>
                </div>
                <div class="progress-container"><div class="progress-bar xp-bar" style="width:${progress}%"></div></div>
            </div>

            <div class="grid-2">
                <div class="card" style="margin:0; padding:12px; text-align:center;">
                    <small style="opacity:0.7;">הכנסה פסיבית</small><br>
                    <b style="color:var(--green)">${passive.toFixed(2)}₪/ש</b>
                </div>
                <div class="card" style="margin:0; padding:12px; text-align:center;">
                    <small style="opacity:0.7;">חוב לבנק</small><br>
                    <b style="color:var(--red)">${loan.toLocaleString()}₪</b>
                </div>
            </div>

            <div class="card" style="margin-top:15px; font-size:0.85em; background:rgba(255,255,255,0.02);">
                <p>🎓 <b>כישורים:</b> ${skills.length > 0 ? skills.join(", ") : "טרם נלמדו"}</p>
                <p>🚗 <b>רכבים:</b> ${cars.length > 0 ? cars.join(", ") : "ללא רכב"}</p>
                <p>🛒 <b>מלאי:</b> ${inventory.length > 0 ? inventory.length + " פריטים" : "ריק"}</p>
            </div>

            <div id="install-container"></div>
            
            <button class="action" style="background:none; border:1px solid var(--red); color:var(--red); margin-top:20px; font-size:11px; padding:10px;" onclick="resetGame()">🗑️ איפוס נתונים</button>
        </div>
    `;

    if (typeof renderGiftBtn === "function") renderGiftBtn();
    renderInstallBtn();
    updateUI();
}

function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(!cont) return;
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if(!isInstalled) {
        cont.innerHTML = `
            <button class="action" style="background:var(--blue); margin-top:15px;" onclick="showInstallGuide()">
                📲 התקן אפליקציה למכשיר
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
}

function closeInstallGuide() {
    const modal = document.getElementById("installModal");
    if(modal) modal.style.display = "none";
}
