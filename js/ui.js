/* Smart Money Pro - js/ui.js - v7.4.0 - Full UI Sync */

// --- 1. ניהול טאבים וניווט ---
window.openTab = function(tabName) {
    window.currentTab = tabName;
    const content = document.getElementById('content');
    if (!content) return;

    // עדכון ויזואלי של הכפתורים בתפריט
    document.querySelectorAll('.topbar button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (activeBtn) activeBtn.classList.add('active');

    content.innerHTML = ""; 

    // ניתוב לכל חלקי המערכת
    switch(tabName) {
        case 'home': drawHome(content); break;
        case 'work': drawWork(content); break;
        case 'tasks': drawCasino(content); break; 
        case 'shop': drawShop(content); break; 
        case 'market': drawMarket(content); break; 
        case 'business': drawBusiness(content); break; 
        case 'estate': drawEstate(content); break; 
        case 'skills': drawSkills(content); break;
        case 'bank': drawBank(content); break;
        case 'cars': drawCars(content); break;
        default: drawHome(content);
    }
    
    if (typeof window.updateUI === 'function') window.updateUI();
    window.scrollTo(0,0);
};

// --- 2. דף הבית (Home) ---
function drawHome(c) {
    const ld = getLevelData(window.lifeXP || 0);
    c.innerHTML = `
    <div class="fade-in">
        <div class="card" style="background: linear-gradient(135deg, #1e293b, #0f172a); border-bottom: 3px solid var(--blue); padding: 12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px;">
                <b style="color:var(--blue);">📊 סטטוס רמה</b>
                <span>רמה ${ld.level} (${Math.floor(ld.progressPercent)}%)</span>
            </div>
            <div style="margin-top:8px;">
                <div class="progress-container" style="height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
                    <div class="progress-bar" style="width:${ld.progressPercent}%; height:100%; background:var(--green);"></div>
                </div>
                <div style="text-align:center; margin-top:10px;">
                    <button onclick="claimDailyGift()" style="background:none; border:1px solid var(--blue); color:var(--blue); font-size:10px; padding:2px 12px; border-radius:12px; font-weight:bold;">🎁 קבל מתנה יומית</button>
                </div>
            </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-top:10px;">
            <div class="card" style="padding:10px; text-align:center; border-right:2px solid var(--green);">
                <small style="font-size:10px; color:var(--green); display:block;">הכנסה פסיבית</small>
                <b style="font-size:14px;">+${Math.floor(window.passive || 0).toLocaleString()}₪</b>
            </div>
            <div class="card" style="padding:10px; text-align:center; border-right:2px solid var(--red);">
                <small style="font-size:10px; color:var(--red); display:block;">חוב לבנק</small>
                <b style="font-size:14px;">${Math.floor(window.loan || 0).toLocaleString()}₪</b>
            </div>
        </div>

        <div class="card" style="margin-top:10px; padding:12px;">
            <h5 style="margin:0 0 8px 0; font-size:12px; opacity:0.8;">📦 פריטים וכישורים</h5>
            <div id="mini-inventory" style="display:flex; gap:6px; flex-wrap:wrap;">
                ${renderFullInventory()}
            </div>
        </div>
    </div>`;
}

// --- 3. פונקציות התוכן (כולן ב-Grid 2) ---

window.drawCasino = function(c) {
    c.innerHTML = `<h4>🎰 קזינו</h4><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="card">🎰 <b>מכונות</b><br><button onclick="playGame('slots')" class="action">המר 100</button></div>
        <div class="card">🃏 <b>בלאק ג'ק</b><br><button onclick="playGame('bj')" class="action">המר 500</button></div>
    </div>`;
};

window.drawShop = function(c) {
    c.innerHTML = `<h4>🏪 שוק חפצים</h4><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="card">⌚ <b>שעון</b><br><button onclick="buyItem('watch', 5000)" class="action">5K ₪</button></div>
        <div class="card">📱 <b>אייפון</b><br><button onclick="buyItem('phone', 4500)" class="action">4.5K ₪</button></div>
    </div>`;
};

window.drawBusiness = function(c) {
    c.innerHTML = `<h4>🏢 ניהול עסקים</h4><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="card">🛒 <b>קיוסק</b><br><button onclick="buyBiz('kiosk', 50000)" class="action">פתח 50K</button></div>
        <div class="card">🔧 <b>מוסך</b><br><button onclick="buyBiz('garage', 200000)" class="action">פתח 200K</button></div>
    </div>`;
};

window.drawMarket = function(c) {
    c.innerHTML = `<h4>📈 בורסה</h4><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="card">🍏 <b>AAPL</b><br><button onclick="buyStock('AAPL')" class="action">קנה</button></div>
        <div class="card">🚗 <b>TSLA</b><br><button onclick="buyStock('TSLA')" class="action">קנה</button></div>
    </div>`;
};

window.drawEstate = function(c) {
    c.innerHTML = `<h4>🏘️ נדל"ן</h4><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="card">🏠 <b>דירה</b><br><button onclick="buyEstate('apt', 500000)" class="action">500K</button></div>
        <div class="card">🏘️ <b>וילה</b><br><button onclick="buyEstate('villa', 1500000)" class="action">1.5M</button></div>
    </div>`;
};

window.drawWork = function(c) {
    c.innerHTML = `<h4>⚒️ עבודה</h4><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="card">👮 <b>אבטחה</b><br><button onclick="doWork('guard')" class="action">עבוד</button></div>
        <div class="card">🚔 <b>משטרה</b><br><button onclick="doWork('police')" class="action">עבוד</button></div>
    </div>`;
};

window.drawSkills = function(c) {
    c.innerHTML = `<h4>🎓 כישורים</h4><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="card">📚 <b>ניהול</b><br><button onclick="buySkill('mgm')" class="action">למד</button></div>
        <div class="card">💻 <b>תכנות</b><br><button onclick="buySkill('code')" class="action">למד</button></div>
    </div>`;
};

window.drawCars = function(c) {
    c.innerHTML = `<h4>🚗 רכבים</h4><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="card">🚗 <b>מאזדה</b><br><button onclick="buyCar('mazda')" class="action">קנה</button></div>
        <div class="card">⚡ <b>טסלה</b><br><button onclick="buyCar('tesla')" class="action">קנה</button></div>
    </div>`;
};

window.drawBank = function(c) {
    c.innerHTML = `<h4>🏦 בנק</h4><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
        <div class="card">💰 <b>הפקדה</b><br><button onclick="deposit('all')" class="action">הכל</button></div>
        <div class="card">💸 <b>משיכה</b><br><button onclick="withdraw('all')" class="action">הכל</button></div>
    </div>`;
};

// --- 4. עזרי תצוגה ---

function renderFullInventory() {
    let items = "";
    if (window.cars?.length) window.cars.forEach(() => items += `<span style="font-size:20px; background:rgba(59,130,246,0.1); padding:6px; border-radius:8px;">🚗</span>`);
    if (window.skills?.length) window.skills.forEach(() => items += `<span style="font-size:20px; background:rgba(16,185,129,0.1); padding:6px; border-radius:8px;">🎓</span>`);
    if (window.inventory?.length) window.inventory.slice(-8).forEach(item => items += `<span style="font-size:20px; background:rgba(255,255,255,0.05); padding:6px; border-radius:8px;">${item.i || '📦'}</span>`);
    return items || '<small style="opacity:0.4;">המחסן ריק</small>';
}

window.renderUIUpdate = function(ld) {
    const mTop = document.getElementById('top-money');
    const bTop = document.getElementById('top-bank');
    const lTop = document.getElementById('life-level-ui');
    if (mTop) mTop.innerText = Math.floor(window.money || 0).toLocaleString() + " ₪";
    if (bTop) bTop.innerText = Math.floor(window.bank || 0).toLocaleString() + " ₪";
    if (lTop && ld) lTop.innerText = ld.level;
    const progBar = document.querySelector('.progress-bar');
    if (progBar && ld && window.currentTab === 'home') progBar.style.width = ld.progressPercent + "%";
};
