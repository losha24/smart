/* Smart Money Pro - js/ui.js - v6.5.6 - Fully Verified & Functional */

let deferredPrompt;
let currentTab = 'home'; 

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if(currentTab === 'home') renderInstallBtn();
});

// --- עדכון ויזואלי בזמן אמת (נקרא מה-Core) ---
window.renderUIUpdate = function(ld) {
    if (!ld && typeof getLevelData === 'function') {
        ld = getLevelData(window.lifeXP || 0);
    }
    if (currentTab === 'home' && ld) {
        const passiveEl = document.getElementById('passive-display');
        const progressEl = document.getElementById('xp-progress-bar');
        const levelValEl = document.getElementById('home-level-val');
        
        if (passiveEl) passiveEl.innerText = (window.passive || 0).toLocaleString() + " ₪/ש";
        if (progressEl) progressEl.style.width = ld.progressPercent + "%";
        if (levelValEl) levelValEl.innerText = ld.level;
    }
};

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
        window.scrollTo(0,0);
        // עדכון UI כללי (לא בשוק כדי למנוע ריצוד)
        if(typeof updateUI === 'function' && t !== 'market') updateUI();
    }, 120);
};

// --- דף הבית (מרכז שליטה) ---
window.drawHome = function(c) {
    const ld = (typeof getLevelData === 'function') 
               ? getLevelData(window.lifeXP || 0) 
               : { level: 1, xpInCurrentLevel: 0, xpForNext: 1000, progressPercent: 0 };

    let invIcons = "";
    if(window.skills && window.skills.length > 0) invIcons += "🎓 ";
    if(window.cars && window.cars.length > 0) invIcons += "🚗 ";
    if(window.business && window.business.length > 0) invIcons += "🏢 ";
    if(window.propertys && window.propertys.length > 0) invIcons += "🏠 ";
    if(window.marketItems && window.marketItems.length > 0) invIcons += "🛒 ";

    c.innerHTML = `
        <div class="card fade-in">
            <h3 style="margin:0 0 15px 0;">🏠 מרכז שליטה</h3>
            
            <div class="admin-box" style="margin-bottom:15px;">
                📢 <b>הודעת מערכת:</b> 
                <button onclick="window.editAdminMsg()" class="edit-admin-btn">✏️</button>
                <br><span>${window.adminMsgText || "המערכת פועלת כסדרה."}</span>
            </div>

            <div class="card" style="background:rgba(255,255,255,0.03); margin-bottom:15px; padding:12px; border:1px solid rgba(255,255,255,0.1);">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:12px;">
                    <span>⭐ רמת חיים <b id="home-level-val">${ld.level}</b></span>
                    <span style="opacity:0.8;">${ld.progressPercent}%</span>
                </div>
                <div style="height:10px; background:rgba(0,0,0,0.3); border-radius:10px; overflow:hidden;">
                    <div id="xp-progress-bar" style="width:${ld.progressPercent}%; height:100%; background:var(--blue); transition: 0.4s;"></div>
                </div>
            </div>

            <div class="card" style="background:rgba(245, 158, 11, 0.05); border:1px solid rgba(245, 158, 11, 0.3); text-align:center; padding:15px; margin-bottom:15px;">
                <button id="giftBtn" onclick="window.claimDailyGift()" class="action-btn" style="width:100%; background:var(--yellow); color:#000; font-weight:bold;">🎁 קבלת בונוס</button>
                <div id="giftTimer" style="font-size:12px; margin-top:8px; color:var(--yellow); font-weight:bold;">טוען...</div>
            </div>

            <div class="grid-2">
                <div class="card" style="text-align:center;"><small>פסיבי</small><br><b id="passive-display" style="color:#22c55e;">${(window.passive || 0).toLocaleString()} ₪</b></div>
                <div class="card" style="text-align:center;"><small>חוב</small><br><b style="color:#ef4444;">${(window.loan || 0).toLocaleString()} ₪</b></div>
            </div>

            <div class="card" style="margin-top:15px; text-align:center; background:rgba(255,255,255,0.02);">
                <small style="opacity:0.6; display:block; margin-bottom:10px;">🎒 הציוד שלי:</small>
                <div style="font-size:24px; letter-spacing:10px;">${invIcons || "📦 (ריק)"}</div>
            </div>

            <div id="install-container" style="margin-top:20px;"></div>
            <button class="sys-btn" style="color:#ef4444; margin-top:25px; width:100%; opacity:0.5; font-size:11px;" onclick="resetGame()">🗑️ איפוס חשבון</button>
        </div>
    `;
    startGiftTimer();
    renderInstallBtn();
};

// --- כישורים ורכבים (תוכן מלא) ---
window.drawSkills = function(c) {
    c.innerHTML = `<h3>🎓 כישורים</h3><div id="skills-list" class="grid-1"></div>`;
    const list = document.getElementById('skills-list');
    const skills = [
        {id:'s1', n:'ניהול זמן', p:1000, xp:200, d:'מייעל עבודה'},
        {id:'s2', n:'אוריינות פיננסית', p:3500, xp:600, d:'הבנה בשוק ההון'},
        {id:'s3', n:'שיווק ומכירות', p:8000, xp:1500, d:'מכירות משופרות'},
        {id:'s4', n:'פיתוח אפליקציות', p:15000, xp:3500, d:'בניית כלים דיגיטליים'},
        {id:'s5', n:'ניהול השקעות', p:40000, xp:10000, d:'גישה לנכסים מורכבים'}
    ];
    skills.forEach(s => {
        const owned = window.skills && window.skills.includes(s.id);
        list.innerHTML += `<div class="card"><b>${s.n}</b><br><small>${s.d}</small><br><button onclick="window.buySkill('${s.id}', ${s.p}, ${s.xp})" class="action-btn" ${owned?'disabled':''}>${owned?'נרכש':'למד'}</button></div>`;
    });
};

window.drawCars = function(c) {
    c.innerHTML = `<h3>🚗 רכבים</h3><div id="cars-list" class="grid-1"></div>`;
    const list = document.getElementById('cars-list');
    const cars = [{id:'c1', n:'קורקינט', p:2500, img:'🛴'}, {id:'c2', n:'אופנוע', p:12000, img:'🛵'}, {id:'c3', n:'רכב יד 2', p:35000, img:'🚗'}];
    cars.forEach(car => {
        const owned = window.cars && window.cars.includes(car.id);
        list.innerHTML += `<div class="card" style="text-align:center"><div style="font-size:30px">${car.img}</div><b>${car.n}</b><br><button onclick="window.buyCar('${car.id}', ${car.p})" class="action-btn" ${owned?'disabled':''}>${owned?'בבעלות':'קנה'}</button></div>`;
    });
};

// --- לוגיקה ---
window.claimDailyGift = function() {
    const cooldown = 4 * 60 * 60 * 1000;
    if (window.lastGift && (Date.now() - window.lastGift < cooldown)) return;
    window.money += 1000 + ((window.lifeLevel || 1) * 200);
    window.lastGift = Date.now();
    if(window.saveGame) saveGame();
    window.openTab('home');
};

window.buySkill = function(id, price, xp) {
    if(window.money >= price) {
        window.money -= price;
        if(!window.skills) window.skills = [];
        window.skills.push(id);
        window.lifeXP += xp;
        if(window.saveGame) saveGame();
        window.openTab('skills');
    }
};

window.buyCar = function(id, price) {
    if(window.money >= price) {
        window.money -= price;
        if(!window.cars) window.cars = [];
        window.cars.push(id);
        if(window.saveGame) saveGame();
        window.openTab('cars');
    }
};

function startGiftTimer() {
    const timerEl = document.getElementById('giftTimer');
    const update = () => {
        if (!timerEl) return;
        const timeLeft = (4 * 60 * 60 * 1000) - (Date.now() - (window.lastGift || 0));
        if (timeLeft <= 0) {
            timerEl.innerText = "✅ מוכן!";
            document.getElementById('giftBtn').disabled = false;
        } else {
            const h = Math.floor(timeLeft / 3600000), m = Math.floor((timeLeft % 3600000) / 60000);
            timerEl.innerText = `⏳ המתנה בעוד ${h}ש' ו-${m}ד'`;
            document.getElementById('giftBtn').disabled = true;
        }
    };
    update();
    setInterval(update, 60000);
}

function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(cont && deferredPrompt) {
        cont.innerHTML = `<button class="action" style="background:#3b82f6; width:100%" onclick="triggerInstall()">📲 התקן אפליקציה</button>`;
    }
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') deferredPrompt = null;
    renderInstallBtn();
}

window.editAdminMsg = function() {
    const pass = prompt("סיסמה:");
    if (pass === "1234") { 
        const newMsg = prompt("הודעה:", window.adminMsgText);
        if (newMsg !== null) { window.adminMsgText = newMsg; window.openTab('home'); }
    }
};
