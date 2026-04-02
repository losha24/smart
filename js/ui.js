/* Smart Money Pro - js/ui.js - v6.5.4 - Final & Verified */

let deferredPrompt;
let currentTab = 'home'; 

// --- מערכת ניווט ---
window.openTab = function(t) {
    currentTab = t; 
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + t.charAt(0).toUpperCase() + t.slice(1));
    if(btn) btn.classList.add("active");
    
    const c = document.getElementById("content"); 
    if(!c) return;
    
    c.style.opacity = "0";
    setTimeout(() => {
        c.innerHTML = "";
        const drawFunc = window["draw" + t.charAt(0).toUpperCase() + t.slice(1)];
        if (typeof drawFunc === 'function') {
            drawFunc(c);
        } else {
            window.drawHome(c);
        }
        c.style.opacity = "1";
        if(typeof updateUI === 'function') updateUI();
    }, 120);
};

// --- דף הבית (עיצוב מקורי + אייקונים בציוד) ---
window.drawHome = function(c) {
    const ld = (typeof getLevelData === 'function') 
               ? getLevelData(window.lifeXP || 0) 
               : { level: 1, xpInCurrentLevel: 0, xpForNext: 1000, progressPercent: 0 };

    // בניית שורת אייקונים לפי מה שקיים במערכים
    let invIcons = "";
    if(window.skills && window.skills.length > 0) invIcons += "🎓 ";
    if(window.cars && window.cars.length > 0) invIcons += "🚗 ";
    if(window.business && window.business.length > 0) invIcons += "🏢 ";
    if(window.propertys && window.propertys.length > 0) invIcons += "🏠 ";
    if(window.marketItems && window.marketItems.length > 0) invIcons += "🛒 ";

    c.innerHTML = `
        <div class="card fade-in">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0;">🏠 מרכז שליטה</h3>
                <button onclick="forceUpdate()" class="sys-btn" style="padding:5px 12px; font-size:12px;">🔄 רענן</button>
            </div>

            <div class="admin-box" style="margin-bottom:15px;">
                📢 <b>הודעת מערכת:</b> 
                <button onclick="window.editAdminMsg()" class="edit-admin-btn">✏️</button>
                <br><span>${window.adminMsgText || "המערכת פועלת כסדרה."}</span>
            </div>
            
            <div class="card" style="background:rgba(255,255,255,0.03); margin-bottom:15px; padding:12px; border:1px solid rgba(255,255,255,0.1);">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:12px;">
                    <span>⭐ רמת חיים <b id="home-level-val">${ld.level}</b></span>
                    <span id="xp-text-detail" style="opacity:0.8;">${Math.floor(ld.xpInCurrentLevel).toLocaleString()} / ${Math.floor(ld.xpForNext).toLocaleString()} XP</span>
                </div>
                <div style="height:10px; background:rgba(0,0,0,0.3); border-radius:10px; overflow:hidden;">
                    <div id="xp-progress-bar" style="width:${ld.progressPercent}%; height:100%; background:linear-gradient(90deg, #3b82f6, #60a5fa); transition: width 0.4s ease;"></div>
                </div>
            </div>

            <div class="card" style="background:rgba(245, 158, 11, 0.05); border:1px solid rgba(245, 158, 11, 0.3); text-align:center; padding:15px; margin-bottom:15px;">
                <button id="giftBtn" onclick="claimDailyGift()" class="action-btn" style="width:100%; background:var(--yellow); color:#000; font-weight:bold; border:none; padding:10px; border-radius:8px; cursor:pointer;">🎁 קבלת בונוס</button>
                <div id="giftTimer" style="font-size:12px; margin-top:8px; color:var(--yellow); font-weight:bold;">טוען...</div>
            </div>

            <div class="grid-2">
                <div class="card" style="margin:0; padding:12px; text-align:center; border: 1px solid rgba(34, 197, 94, 0.2); background:rgba(34, 197, 94, 0.02);">
                    <small style="opacity:0.7; font-size:10px; display:block; margin-bottom:4px;">💰 הכנסה פסיבית</small>
                    <b id="passive-display" style="color:#22c55e; font-size:15px;">${(window.passive || 0).toLocaleString()} ₪/ש</b>
                </div>
                <div class="card" style="margin:0; padding:12px; text-align:center; border: 1px solid rgba(239, 68, 68, 0.2); background:rgba(239, 68, 68, 0.02);">
                    <small style="opacity:0.7; font-size:10px; display:block; margin-bottom:4px;">🏦 חוב לבנק</small>
                    <b style="color:#ef4444; font-size:15px;">${(window.loan || 0).toLocaleString()} ₪</b>
                </div>
            </div>

            <div class="card" style="margin-top:15px; padding:12px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); text-align:center;">
                <small style="opacity:0.6; display:block; margin-bottom:10px;">🎒 הציוד שלי:</small>
                <div style="font-size:24px; letter-spacing:10px;">
                    ${invIcons || "📦 (ריק)"}
                </div>
            </div>

            <div id="install-container" style="margin-top:20px;"></div>
            <button class="sys-btn" style="color:#ef4444; margin-top:25px; width:100%; opacity:0.5; font-size:11px;" onclick="resetGame()">🗑️ איפוס חשבון</button>
        </div>
    `;
    startGiftTimer();
    if(window.renderInstallBtn) renderInstallBtn();
};

// --- טאב כישורים ---
window.drawSkills = function(c) {
    c.innerHTML = `<h3>🎓 כישורים ולימודים</h3><div id="skills-list" class="grid-1"></div>`;
    const list = document.getElementById('skills-list');
    const skills = [
        {id:'s1', n:'ניהול זמן', p:1000, xp:200},
        {id:'s2', n:'שיווק דיגיטלי', p:5000, xp:1000},
        {id:'s3', n:'פיתוח PWAs', p:12000, xp:3000}
    ];
    skills.forEach(s => {
        const owned = window.skills && window.skills.includes(s.id);
        list.innerHTML += `
            <div class="card">
                <b>${s.n}</b><br><small>מחיר: ${s.p.toLocaleString()}₪ | בונוס: ${s.xp} XP</small><br>
                <button onclick="window.buySkill('${s.id}', ${s.p}, ${s.xp})" class="action-btn" ${owned?'disabled':''}>
                    ${owned ? 'נרכש ✅' : 'למד עכשיו'}
                </button>
            </div>`;
    });
};

// --- טאב רכבים ---
window.drawCars = function(c) {
    c.innerHTML = `<h3>🚗 סוכנות רכבים</h3><div id="cars-list" class="grid-1"></div>`;
    const list = document.getElementById('cars-list');
    const cars = [
        {id:'c1', n:'אופניים חשמליים', p:3500},
        {id:'c2', n:'רכב משומש', p:25000},
        {id:'c3', n:'רכב יוקרה', p:250000}
    ];
    cars.forEach(car => {
        const owned = window.cars && window.cars.includes(car.id);
        list.innerHTML += `
            <div class="card">
                <b>${car.n}</b><br><small>מחיר: ${car.p.toLocaleString()}₪</small><br>
                <button onclick="window.buyCar('${car.id}', ${car.p})" class="action-btn" ${owned?'disabled':''}>
                    ${owned ? 'בבעלותך 🔑' : 'קנה רכב'}
                </button>
            </div>`;
    });
};

// --- לוגיקה פונקציונלית ---
window.buySkill = function(id, price, xp) {
    if(window.money >= price) {
        window.money -= price;
        if(!window.skills) window.skills = [];
        window.skills.push(id);
        window.lifeXP += xp;
        if(window.saveGame) saveGame();
        showStatus("הכישור נלמד! +"+xp+" XP", "green");
        window.openTab('skills');
    } else {
        showStatus("אין לך מספיק כסף!", "red");
    }
};

window.buyCar = function(id, price) {
    if(window.money >= price) {
        window.money -= price;
        if(!window.cars) window.cars = [];
        window.cars.push(id);
        if(window.saveGame) saveGame();
        showStatus("תתחדש על הרכב!", "green");
        window.openTab('cars');
    } else {
        showStatus("חסר לך כסף לרכב זה", "red");
    }
};

function startGiftTimer() {
    const timerEl = document.getElementById('giftTimer');
    const btn = document.getElementById('giftBtn');
    const update = () => {
        if (!timerEl || !btn) return;
        const timeLeft = 14400000 - (Date.now() - (window.lastGift || 0));
        if (timeLeft <= 0) {
            timerEl.innerText = "✅ מוכן!";
            btn.disabled = false; btn.style.opacity = "1";
        } else {
            const h = Math.floor(timeLeft / 3600000), m = Math.floor((timeLeft % 3600000) / 60000);
            timerEl.innerText = `⏳ עוד ${h}ש' ו-${m}ד'`;
            btn.disabled = true; btn.style.opacity = "0.5";
        }
    };
    update();
    setInterval(update, 60000);
}

window.editAdminMsg = function() {
    const pass = prompt("סיסמת מנהל:");
    if (pass === "1234") { 
        const newMsg = prompt("הודעה חדשה:", window.adminMsgText || "");
        if (newMsg !== null) { 
            window.adminMsgText = newMsg; 
            window.openTab('home'); 
        }
    }
};
