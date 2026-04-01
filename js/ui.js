/* Smart Money Pro - js/ui.js - v6.5.2 TURBO - FULL & FINAL */

// 1. ניהול מעבר בין טאבים (Navigation)
function openTab(t) {
    currentTab = t;
    
    // עדכון ויזואלי של הכפתור הפעיל בתפריט
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + t.charAt(0).toUpperCase() + t.slice(1));
    if(btn) btn.classList.add("active");
    
    const container = document.getElementById("content");
    container.innerHTML = ""; // ניקוי המסך לפני רינדור חדש

    // ניתוב לפונקציית הציור המתאימה (מוודא שכל הקבצים מחוברים)
    switch(t) {
        case 'home': drawHome(container); break;
        case 'work': if(window.drawWork) drawWork(container); break;
        case 'invest': if(window.drawInvest) drawInvest(container); break;
        case 'bank': if(window.drawBank) drawBank(container); break;
        case 'estate': if(window.drawEstate) drawEstate(container); break;
        case 'business': if(window.drawBusiness) drawBusiness(container); break;
        case 'cars': if(window.drawCars) drawCars(container); break;
        case 'skills': if(window.drawSkills) drawSkills(container); break;
        case 'market': if(window.drawMarket) drawMarket(container); break;
        case 'tasks': if(window.drawCasino) drawCasino(container); break;
        default: 
            container.innerHTML = `<div class="card fade-in" style="text-align:center; padding:30px;">
                <h3 style="color:var(--yellow);">בפיתוח...</h3>
                <p>הטאב ${t} יהיה זמין בעדכון הבא.</p>
            </div>`;
    }
    
    updateUI(); // עדכון מספרים (כסף/רמה) מיד עם המעבר
}

// 2. רינדור דף הבית (The Turbo Hero Card)
function drawHome(c) {
    const ld = getLevelData(lifeXP);
    c.innerHTML = `
        <div class="main-card-hero fade-in">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2 style="margin:0; font-size:24px; color:var(--blue);">לוח בקרה</h2>
                <span style="color:var(--green); font-weight:900; font-size:12px; border:1px solid var(--green); padding:2px 8px; border-radius:10px;">LIVE</span>
            </div>
            
            <div class="xp-container-big">
                <div id="xp-progress-bar" class="xp-bar-fill" style="width:${ld.progressPercent}%"></div>
            </div>

            <div class="grid-2">
                <div>
                    <small style="opacity:0.6; font-size:11px;">הכנסה פסיבית</small><br>
                    <b style="color:var(--green); font-size:20px;">₪${Math.floor(passive).toLocaleString()}</b>
                </div>
                <div style="text-align:left;">
                    <small style="opacity:0.6; font-size:11px;">רמת קריירה</small><br>
                    <b style="color:var(--blue); font-size:20px;">Lvl ${ld.level}</b>
                </div>
            </div>
        </div>

        <div class="card fade-in">
            <h3 style="margin:0 0 15px 0; font-size:15px; border-bottom:1px solid var(--border); padding-bottom:8px;">📦 מחסן נכסים</h3>
            <div class="inv-grid">
                ${inventory.map(i => `<div class="inv-slot" title="${i.name}">${i.icon}</div>`).join('')}
                ${new Array(Math.max(0, 8 - inventory.length)).fill('<div class="inv-slot" style="opacity:0.05;">?</div>').join('')}
            </div>
        </div>
        
        <button class="action" onclick="getDailyGift()" style="background:var(--yellow); color:#000; box-shadow: 0 4px 15px rgba(255,223,0,0.3); margin-top:10px;">🎁 קבל מענק יומי</button>
    `;
}

// 3. לוגיקת מתנה יומית (היה חסר בקוד שלך)
function getDailyGift() {
    const gift = 5000 + (getLevelData(lifeXP).level * 1000);
    money += gift;
    showMsg(`🎁 קיבלת מתנה יומית בסך ₪${gift.toLocaleString()}!`, "var(--green)");
    saveGame();
    updateUI();
}

// 4. ניהול מודאלים (Modals)
function openModal(title, html) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-body').innerHTML = html;
    document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
}

// 5. שמירה וטעינה אוטומטית (Persistence)
function saveGame() {
    const data = { money, bank, lifeXP, passive, inventory, carSpeed, lastKnownLevel };
    localStorage.setItem('smartMoneySave_v652', JSON.stringify(data));
}

function loadGame() {
    const saved = localStorage.getItem('smartMoneySave_v652');
    if (saved) {
        const d = JSON.parse(saved);
        money = d.money || 1500;
        bank = d.bank || 0;
        lifeXP = d.lifeXP || 0;
        passive = d.passive || 0;
        inventory = d.inventory || [];
        carSpeed = d.carSpeed || 1;
        lastKnownLevel = d.lastKnownLevel || 1;
    }
}

// 6. אתחול המערכת
document.addEventListener("DOMContentLoaded", () => {
    loadGame(); // טעינת נתונים קודמים
    openTab('home'); // פתיחת דף הבית
    
    // שמירה אוטומטית כל 30 שניות
    setInterval(saveGame, 30000);
});
