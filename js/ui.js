/* Smart Money Pro - js/ui.js - v7.9.9 - Full Tab Integration */

let deferredPrompt;
let currentTab = 'home'; 
window.adminMsgText = "המערכת מחוברת לענן (Firebase). הנתונים מסונכרנים בזמן אמת.";

// --- 1. אתחול האפליקציה (קריטי לעבודה עם Firebase) ---
window.initApp = async function() {
    const content = document.getElementById("content");
    if (content) content.innerHTML = '<div style="text-align:center; margin-top:100px; color:#3b82f6;">מתחבר לשרת... ⏳</div>';
    try {
        const isLoaded = await window.loadGameFromCloud();
        if (!isLoaded && typeof loadGame === 'function') loadGame();
        window.openTab('home');
    } catch (err) {
        window.openTab('home');
    }
};

// --- 2. מנוע הניווט (Navigation) ---
window.openTab = function(t) {
    currentTab = t;
    // עדכון כפתורים ב-Navbar
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btnId = "btn" + t.charAt(0).toUpperCase() + t.slice(1);
    const btn = document.getElementById(btnId);
    if(btn) btn.classList.add("active");
    
    const c = document.getElementById("content"); 
    if(!c) return;
    
    c.style.opacity = "0.5"; 
    setTimeout(() => {
        c.innerHTML = "";
        const drawFunc = window["draw" + t.charAt(0).toUpperCase() + t.slice(1)];
        if (typeof drawFunc === 'function') drawFunc(c);
        else window.drawHome(c);
        
        c.style.opacity = "1";
        window.scrollTo(0,0);
        if(typeof updateUI === 'function') updateUI();
    }, 100);
};

// --- 3. פונקציות הציור לכל הטאבים (Draw Functions) ---

// --- בית ---
window.drawHome = async function(c) {
    const ld = (typeof getLevelData === 'function') ? getLevelData(window.lifeXP || 0) : { level: 1, progressPercent: 0 };
    c.innerHTML = `
        <div class="card fade-in">
            <div id="admin-box" class="admin-box">
                <button class="edit-admin-btn" onclick="window.editAdminMsg()">✏️</button>
                📢 <b>הודעה:</b> <span style="font-size:13px;">${window.adminMsgText}</span>
            </div>
            <div class="card" style="background:rgba(255,255,255,0.03); padding:12px;">
                <div style="display:flex; justify-content:space-between; font-size:12px;">
                    <span>⭐ רמה <b id="home-level-val">${ld.level}</b></span>
                    <span id="xp-text-detail">XP טוען...</span>
                </div>
                <div style="height:10px; background:rgba(0,0,0,0.3); border-radius:10px; margin-top:8px; overflow:hidden;">
                    <div id="xp-progress-bar" style="width:${ld.progressPercent}%; height:100%; background:#3b82f6;"></div>
                </div>
            </div>
            <div class="grid-2" style="margin-top:15px;">
                <div class="card" style="text-align:center;"><small>💰 פסיבי</small><br><b id="passive-display" style="color:#22c55e;">0 ₪</b></div>
                <div class="card" style="text-align:center;"><small>🏦 חוב</small><br><b style="color:#ef4444;">${(window.loan || 0).toLocaleString()} ₪</b></div>
            </div>
            <div class="card" style="margin-top:15px; background:rgba(255,255,255,0.02);">
                <small>🏆 טבלת מובילים (Live):</small>
                <div id="live-leaderboard" style="margin-top:10px;"><div style="text-align:center; font-size:12px; opacity:0.5;">טוען...</div></div>
            </div>
        </div>`;
    renderLiveLeaderboard();
};

// --- עבודות ---
window.drawWork = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>⚒️ מרכז עבודה</h3><div id="work-list"></div></div>`;
    if(window.renderWorkList) window.renderWorkList();
};

// --- בורסה ---
window.drawInvest = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>📈 מניות וקריפטו</h3><div id="stock-market"></div></div>`;
    if(window.renderStocks) window.renderStocks();
};

// --- נדל"ן ---
window.drawEstate = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🏠 נכסים</h3><div id="real-estate-list"></div></div>`;
    if(window.renderRealEstate) window.renderRealEstate();
};

// --- עסקים ---
window.drawBusiness = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🏢 חברות ועסקים</h3><div id="business-list"></div></div>`;
    if(window.renderBusinesses) window.renderBusinesses();
};

// --- קזינו ---
window.drawTasks = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🎰 קזינו המזל</h3><div id="casino-games"></div></div>`;
    if(window.renderCasino) window.renderCasino();
};

// --- כישורים ---
window.drawSkills = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🎓 לימודים וכישורים</h3><div id="skills-list"></div></div>`;
    if(window.renderSkillsList) window.renderSkillsList();
};

// --- בנק ---
window.drawBank = function(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <h3>🏦 בנק מרכזי</h3>
            <div class="card" style="text-align:center; background:rgba(59,130,246,0.1);">
                <small>יתרה בבנק:</small><br><b style="font-size:24px; color:#3b82f6;">${Math.floor(window.bank).toLocaleString()} ₪</b>
            </div>
            <div class="grid-2">
                <button onclick="depositAll()" class="action-btn">💰 הפקדה</button>
                <button onclick="withdrawAll()" class="action-btn" style="background:#64748b;">💸 משיכה</button>
            </div>
        </div>`;
};

// --- רכבים ---
window.drawCars = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🚗 רכבים ותצוגה</h3><div id="cars-list"></div></div>`;
    if(window.renderCarsList) window.renderCarsList();
};

// --- חנות ---
window.drawShop = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🛒 חנות פרימיום</h3><div id="shop-items"></div></div>`;
    if(window.renderShop) window.renderShop();
};

// --- 4. עזרי תצוגה ---

async function renderLiveLeaderboard() {
    const lbContainer = document.getElementById('live-leaderboard');
    if(!lbContainer) return;
    try {
        const snap = await db.collection("players").orderBy("money", "desc").limit(8).get();
        let html = ""; let r = 1;
        snap.forEach(doc => {
            const p = doc.data();
            const isMe = doc.id === (auth.currentUser?.uid);
            html += `
                <div style="display:flex; justify-content:space-between; padding:8px; background:${isMe ? 'rgba(59,130,246,0.1)' : 'transparent'}; border-radius:5px; margin-bottom:4px; border: 1px solid ${isMe ? '#3b82f6' : 'rgba(255,255,255,0.05)'}">
                    <span style="font-size:13px;">${r}. ${p.name || 'שחקן'}</span>
                    <b style="color:#22c55e;">${Math.floor(p.money).toLocaleString()} ₪</b>
                </div>`;
            r++;
        });
        lbContainer.innerHTML = html;
    } catch(e) { lbContainer.innerHTML = "שגיאה בטעינה"; }
}

window.renderUIUpdate = function(ld) {
    const mEl = document.getElementById('money'), bEl = document.getElementById('bank'), lEl = document.getElementById('life-level-ui');
    if(mEl) mEl.innerText = Math.floor(window.money).toLocaleString();
    if(bEl) bEl.innerText = Math.floor(window.bank).toLocaleString();
    if(lEl) lEl.innerText = ld.level;
    
    if (currentTab === 'home') {
        const xpBar = document.getElementById('xp-progress-bar');
        const passiveEl = document.getElementById('passive-display');
        if (xpBar) xpBar.style.width = ld.progressPercent + "%";
        if (passiveEl) passiveEl.innerText = (window.passive || 0).toLocaleString() + " ₪/ש";
    }
};

window.editAdminMsg = function() {
    const pass = prompt("סיסמת מנהל:");
    if (pass === localStorage.getItem('adminPass')) {
        const m = prompt("הודעה חדשה:", window.adminMsgText);
        if (m) { window.adminMsgText = m; window.openTab('home'); }
    }
};
