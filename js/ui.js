/* Smart Money Pro - js/ui.js - v7.9.9 - Final Full Integration */

let deferredPrompt;
let currentTab = 'home'; 
let leaderboardPage = 1;
const playersPerPage = 5;
window.adminMsgText = "המערכת מחוברת לענן (Firebase). הנתונים מסונכרנים בזמן אמת.";

// --- 1. אתחול האפליקציה (קריטי לסינכרון ענן) ---
window.initApp = async function() {
    const content = document.getElementById("content");
    if (content) content.innerHTML = '<div style="text-align:center; margin-top:100px; color:#3b82f6; font-family:sans-serif;">מתחבר לשרת ומסנכרן נתונים... ⏳</div>';
    
    try {
        // טעינת נתונים מהענן (מוגדר ב-core.js)
        const isLoaded = await window.loadGameFromCloud();
        if (!isLoaded && typeof loadGame === 'function') loadGame();
        
        window.openTab('home');
    } catch (err) {
        console.error("Init Error:", err);
        window.openTab('home');
    }
};

// --- 2. מנוע הניווט (Navigation) ---
window.openTab = function(t) {
    currentTab = t;
    // עדכון כפתורי תפריט
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btnId = "btn" + t.charAt(0).toUpperCase() + t.slice(1);
    const btn = document.getElementById(btnId);
    if(btn) btn.classList.add("active");
    
    const c = document.getElementById("content"); 
    if(!c) return;
    
    c.style.opacity = "0.5"; 
    setTimeout(() => {
        c.innerHTML = "";
        // קריאה לפונקציית הציור המתאימה
        const drawFunc = window["draw" + t.charAt(0).toUpperCase() + t.slice(1)];
        if (typeof drawFunc === 'function') drawFunc(c);
        else window.drawHome(c);
        
        c.style.opacity = "1";
        window.scrollTo(0,0);
        if(typeof updateUI === 'function') updateUI();
    }, 100);
};

// --- 3. פונקציות ציור לכל הטאבים (Draw Functions) ---

// --- בית (Home) ---
window.drawHome = async function(c) {
    const ld = (typeof getLevelData === 'function') ? getLevelData(window.lifeXP || 0) : { level: 1, progressPercent: 0 };
    c.innerHTML = `
        <div class="card fade-in">
            <div id="admin-box" class="admin-box">
                <button class="edit-admin-btn" onclick="window.editAdminMsg()">✏️</button>
                📢 <b>הודעה:</b> <span style="font-size:13px;">${window.adminMsgText}</span>
            </div>
            <div class="card" style="background:rgba(255,255,255,0.03); padding:12px; border:1px solid rgba(255,255,255,0.1);">
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:8px;">
                    <span>⭐ רמת חיים <b id="home-level-val">${ld.level}</b></span>
                    <span id="xp-text-detail" style="opacity:0.8;">טוען XP...</span>
                </div>
                <div style="height:10px; background:rgba(0,0,0,0.3); border-radius:10px; overflow:hidden;">
                    <div id="xp-progress-bar" style="width:${ld.progressPercent}%; height:100%; background:linear-gradient(90deg, #3b82f6, #60a5fa);"></div>
                </div>
            </div>
            <div class="card" style="background:rgba(245, 158, 11, 0.05); border:1px solid rgba(245, 158, 11, 0.3); text-align:center; padding:15px; margin-top:15px;">
                <button id="giftBtn" onclick="claimDailyGift()" class="action-btn" style="width:100%; background:var(--yellow); color:#000; font-weight:bold;">🎁 קבלת בונוס יומי</button>
                <div id="giftTimer" style="font-size:12px; margin-top:8px; color:var(--yellow);">טוען טיימר...</div>
            </div>
            <div class="grid-2" style="margin-top:15px;">
                <div class="card" style="text-align:center; margin:0;"><small style="opacity:0.7; font-size:10px;">💰 פסיבי</small><br><b id="passive-display" style="color:#22c55e;">0 ₪</b></div>
                <div class="card" style="text-align:center; margin:0;"><small style="opacity:0.7; font-size:10px;">🏦 חוב</small><br><b style="color:#ef4444;">${(window.loan || 0).toLocaleString()} ₪</b></div>
            </div>
            <div class="card" style="margin-top:15px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05);">
                <small style="opacity:0.6; font-weight:bold;">🏆 דירוג עולמי (Live Firebase):</small>
                <div id="live-leaderboard" style="margin-top:10px; display:flex; flex-direction:column; gap:6px;">
                    <div style="text-align:center; font-size:12px; opacity:0.5;">מושך נתונים מהשרת...</div>
                </div>
            </div>
            <div id="install-container" style="margin-top:20px;"></div>
            <button class="sys-btn" style="color:#ef4444; margin-top:25px; width:100%; opacity:0.6; font-size:11px;" onclick="resetGame()">🗑️ איפוס חשבון מוחלט</button>
        </div>`;
    
    renderLiveLeaderboard();
    startGiftTimer();
    renderInstallBtn();
};

// --- עבודות (Work) ---
window.drawWork = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>⚒️ מרכז תעסוקה</h3><div id="work-list"></div></div>`;
    if(window.renderWorkList) window.renderWorkList();
};

// --- בורסה (Invest) ---
window.drawInvest = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>📈 בורסה לניירות ערך</h3><div id="stock-market"></div></div>`;
    if(window.renderStocks) window.renderStocks();
};

// --- נדל"ן (Estate) ---
window.drawEstate = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🏠 השקעות נדל"ן</h3><div id="real-estate-list"></div></div>`;
    if(window.renderRealEstate) window.renderRealEstate();
};

// --- עסקים (Business) ---
window.drawBusiness = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🏢 ניהול חברות</h3><div id="business-list"></div></div>`;
    if(window.renderBusinesses) window.renderBusinesses();
};

// --- קזינו (Tasks) ---
window.drawTasks = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🎰 קזינו והגרלות</h3><div id="casino-games"></div></div>`;
    if(window.renderCasino) window.renderCasino();
};

// --- כישורים (Skills) ---
window.drawSkills = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🎓 אקדמיה וכישורים</h3><div id="skills-list"></div></div>`;
    if(window.renderSkillsList) window.renderSkillsList();
};

// --- בנק (Bank) ---
window.drawBank = function(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <h3>🏦 בנק הפועלים</h3>
            <div class="card" style="text-align:center; background:rgba(59,130,246,0.1); margin-bottom:15px;">
                <small>יתרה בחשבון:</small><br><b style="font-size:24px; color:#3b82f6;">${Math.floor(window.bank).toLocaleString()} ₪</b>
            </div>
            <div class="grid-2">
                <button onclick="depositAll()" class="action-btn">💰 הפקדה</button>
                <button onclick="withdrawAll()" class="action-btn" style="background:#64748b;">💸 משיכה</button>
            </div>
        </div>`;
};

// --- רכבים (Cars) ---
window.drawCars = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🚗 סוכנות רכבים</h3><div id="cars-list"></div></div>`;
    if(window.renderCarsList) window.renderCarsList();
};

// --- חנות (Shop) ---
window.drawShop = function(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🛒 חנות מוצרים</h3><div id="shop-items"></div></div>`;
    if(window.renderShop) window.renderShop();
};

// --- 4. עזרי תצוגה ודירוג חי ---

async function renderLiveLeaderboard() {
    const lbContainer = document.getElementById('live-leaderboard');
    if(!lbContainer || typeof db === 'undefined') return;
    try {
        const snap = await db.collection("players").orderBy("money", "desc").limit(10).get();
        let html = ""; let r = 1;
        snap.forEach(doc => {
            const p = doc.data();
            const isMe = doc.id === (auth.currentUser?.uid);
            html += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:8px; background:${isMe ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.03)'}; border-radius:6px; border:1px solid ${isMe ? '#3b82f6' : 'transparent'}">
                    <span style="font-size:12px; width:20px; font-weight:bold; color:var(--yellow);">${r}.</span>
                    <span style="flex:1; font-size:13px; font-weight:${isMe ? 'bold' : 'normal'}">${p.name || 'שחקן אנונימי'} ${isMe ? '(אתה)' : ''}</span>
                    <span style="color:#22c55e; font-size:12px; font-weight:bold;">${Math.floor(p.money).toLocaleString()} ₪</span>
                </div>`;
            r++;
        });
        lbContainer.innerHTML = html;
    } catch(e) { 
        lbContainer.innerHTML = `<div style="font-size:11px; opacity:0.5; text-align:center;">שגיאה בחיבור לדירוג</div>`; 
    }
}

window.renderUIUpdate = function(ld) {
    if (!ld) ld = getLevelData(window.lifeXP);
    const mEl = document.getElementById('money'), bEl = document.getElementById('bank'), lEl = document.getElementById('life-level-ui');
    if(mEl) mEl.innerText = Math.floor(window.money).toLocaleString();
    if(bEl) bEl.innerText = Math.floor(window.bank).toLocaleString();
    if(lEl) lEl.innerText = ld.level;
    
    if (currentTab === 'home') {
        const xpBar = document.getElementById('xp-progress-bar');
        const xpText = document.getElementById('xp-text-detail');
        const passiveEl = document.getElementById('passive-display');
        if (xpBar) xpBar.style.width = ld.progressPercent + "%";
        if (xpText) xpText.innerText = `${Math.floor(ld.xpInCurrentLevel).toLocaleString()} / ${Math.floor(ld.xpForNext).toLocaleString()} XP`;
        if (passiveEl) passiveEl.innerText = (window.passive || 0).toLocaleString() + " ₪/ש";
    }
};

// --- 5. ניהול מתנה וטיימר ---
function claimDailyGift() {
    const now = Date.now();
    const wait = 4 * 60 * 60 * 1000; 
    if (window.lastGift && (now - window.lastGift < wait)) return;
    const bonus = 500 + (getLevelData(window.lifeXP).level * 250);
    window.money += bonus;
    window.lastGift = now;
    if(typeof saveGame === 'function') saveGame();
    if(typeof updateUI === 'function') updateUI();
    showMsg(`🎁 קיבלת ${bonus.toLocaleString()}₪!`, "var(--green)");
    window.openTab('home');
}

function startGiftTimer() {
    const tEl = document.getElementById('giftTimer'), btn = document.getElementById('giftBtn');
    const update = () => {
        if (!tEl || !btn) return;
        const left = (4 * 60 * 60 * 1000) - (Date.now() - (window.lastGift || 0));
        if (left <= 0) {
            tEl.innerText = "✅ המתנה מוכנה!"; btn.disabled = false; btn.style.opacity = "1";
        } else {
            const h = Math.floor(left/3600000), m = Math.floor((left%3600000)/60000), s = Math.floor((left%60000)/1000);
            tEl.innerText = `⏳ ${h}:${m}:${s}`; btn.disabled = true; btn.style.opacity = "0.5";
        }
    };
    update(); setInterval(update, 1000);
}

// --- 6. PWA ותפריט מנהל ---
function renderInstallBtn() {
    const cont = document.getElementById("install-container");
    if(!cont || window.matchMedia('(display-mode: standalone)').matches || !deferredPrompt) return;
    cont.innerHTML = `<button class="action" style="background:#3b82f6; width:100%; border-radius:8px; border:none; color:#white; padding:12px; font-weight:bold;" onclick="triggerInstall()">📲 התקן כאפליקציה</button>`;
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') { deferredPrompt = null; renderInstallBtn(); }
}

window.editAdminMsg = function() {
    const pass = prompt("שלום אלכסיי, הכנס סיסמת מנהל:");
    if (pass === localStorage.getItem('adminPass')) {
        const action = prompt("1 - הודעת מערכת, 2 - הוספת כסף, 3 - הוספת XP", "1");
        if (action === "1") {
            const m = prompt("הודעה חדשה:", window.adminMsgText);
            if (m) { window.adminMsgText = m; window.openTab('home'); }
        } else if (action === "2") {
            const m = prompt("כמות להוספה:");
            if (m) { window.money += parseInt(m); updateUI(); saveGame(); }
        } else if (action === "3") {
            const x = prompt("כמות XP להוספה:");
            if (x) { window.lifeXP += parseInt(x); updateUI(); saveGame(); }
        }
    } else alert("סיסמה שגויה");
};

// --- הפעלה ראשונית ---
document.addEventListener("DOMContentLoaded", () => {
    // בגרסת הענן, initApp נקרא מתוך ה-index.html לאחר טעינת Firebase
});
