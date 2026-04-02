/* Smart Money Pro - js/ui.js - v7.1.0 - Updated Layout */

// --- 1. ניהול טאבים וניווט ---
function openTab(tabName) {
    window.currentTab = tabName;
    const content = document.getElementById('content');
    if (!content) return;

    // עדכון כפתורי תפריט
    document.querySelectorAll('.topbar button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (activeBtn) activeBtn.classList.add('active');

    content.innerHTML = ""; 

    // ניתוב לכל הפונקציות (כולל בורסה, שוק, עסקים וכו')
    switch(tabName) {
        case 'home': drawHome(content); break;
        case 'work': drawWork(content); break;
        case 'tasks': (typeof drawCasino === 'function') ? drawCasino(content) : drawTasks(content); break;
        case 'market': drawMarket(content); break; // בורסה (מניות)
        case 'shop': drawShop(content); break; // שוק (חפצים)
        case 'business': drawBusiness(content); break; 
        case 'estate': drawEstate(content); break;
        case 'skills': drawSkills(content); break;
        case 'bank': drawBank(content); break;
        case 'cars': drawCars(content); break;
        default: drawHome(content);
    }
    
    if (typeof window.updateUI === 'function') window.updateUI();
    window.scrollTo(0,0);
}

// --- 2. דף הבית (Home) - מעוצב ומוקטן ---
function drawHome(c) {
    const ld = getLevelData(window.lifeXP);
    
    c.innerHTML = `
    <div class="fade-in">
        <div class="card" style="background: linear-gradient(135deg, #1e293b, #0f172a); border-bottom: 3px solid var(--blue); padding: 12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px;">
                <b style="color:var(--blue);">📊 התקדמות</b>
                <span>רמה ${ld.level} (${Math.floor(ld.progressPercent)}%)</span>
            </div>
            
            <div style="margin-top:8px;">
                <div class="progress-container" style="height:6px; background:rgba(255,255,255,0.1); border-radius:3px; overflow:hidden;">
                    <div class="progress-bar" style="width:${ld.progressPercent}%; height:100%; background:var(--green);"></div>
                </div>
                <div style="text-align:center; margin-top:10px;">
                    <button onclick="claimDailyGift()" style="background:none; border:1px solid var(--blue); color:var(--blue); font-size:10px; padding:2px 12px; border-radius:12px; cursor:pointer; font-weight:bold;">
                        🎁 קבל מתנה יומית
                    </button>
                </div>
            </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-top:10px;">
            <div class="card" style="padding:10px; text-align:center; border-right:2px solid var(--green);">
                <small style="font-size:10px; color:var(--green); display:block;">הכנסה פסיבית</small>
                <b style="font-size:14px;">+${Math.floor(window.passive).toLocaleString()}₪</b>
            </div>
            <div class="card" style="padding:10px; text-align:center; border-right:2px solid var(--red);">
                <small style="font-size:10px; color:var(--red); display:block;">חוב לבנק</small>
                <b style="font-size:14px;">${Math.floor(window.loan).toLocaleString()}₪</b>
            </div>
        </div>

        <div class="card" style="margin-top:10px; padding:12px;">
            <h5 style="margin:0 0 8px 0; font-size:12px; opacity:0.8;">📦 פריטים, כישורים ורכבים</h5>
            <div id="mini-inventory" style="display:flex; gap:6px; flex-wrap:wrap;">
                ${renderFullInventory()}
            </div>
        </div>

        <button onclick="location.reload()" class="action" style="width:100%; margin-top:15px; padding:10px; font-size:11px; opacity:0.6; background:none; border:1px solid var(--border);">
            🔄 בדיקת עדכוני מערכת
        </button>
    </div>`;
}

// פונקציית עזר למחסן שמשלבת הכל
function renderFullInventory() {
    let items = "";
    // רכבים
    if (window.cars && window.cars.length > 0) {
        window.cars.forEach(() => items += `<span style="font-size:20px; background:rgba(59,130,246,0.1); padding:6px; border-radius:8px;">🚗</span>`);
    }
    // כישורים
    if (window.skills && window.skills.length > 0) {
        window.skills.forEach(() => items += `<span style="font-size:20px; background:rgba(16,185,129,0.1); padding:6px; border-radius:8px;">🎓</span>`);
    }
    // חפצים מהשוק
    if (window.inventory && window.inventory.length > 0) {
        window.inventory.slice(-8).forEach(item => {
            items += `<span style="font-size:20px; background:rgba(255,255,255,0.05); padding:6px; border-radius:8px; border:1px solid rgba(255,255,255,0.1);">${item.i || '📦'}</span>`;
        });
    }
    return items || '<small style="opacity:0.4;">המחסן ריק</small>';
}

// --- 3. תוכן הכפתורים (מסודר 2 בשורה) ---

function drawWork(c) {
    c.innerHTML = `<h4>⚒️ מרכז תעסוקה</h4>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
        <div class="card"><b>אבטחה</b><br><button onclick="doWork('guard')" class="action">עבוד</button></div>
        <div class="card"><b>פיקוח</b><br><button onclick="doWork('inspect')" class="action">עבוד</button></div>
        <div class="card"><b>משטרה</b><br><button onclick="doWork('police')" class="action">עבוד</button></div>
        <div class="card"><b>הייטק</b><br><button onclick="doWork('dev')" class="action">עבוד</button></div>
    </div>`;
}

function drawMarket(c) {
    c.innerHTML = `<h4>📈 בורסה (מניות)</h4>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
        <div class="card"><b>AAPL</b><br><button onclick="buyStock('AAPL')" class="action">קנה</button></div>
        <div class="card"><b>TSLA</b><br><button onclick="buyStock('TSLA')" class="action">קנה</button></div>
    </div>`;
}

function drawShop(c) {
    c.innerHTML = `<h4>🏪 שוק (חפצים)</h4>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
        <div class="card"><b>שעון</b><br><button onclick="buyItem('watch')" class="action">קנה</button></div>
        <div class="card"><b>טלפון</b><br><button onclick="buyItem('phone')" class="action">קנה</button></div>
    </div>`;
}

function drawBank(c) {
    c.innerHTML = `<h4>🏦 בנק</h4>
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
        <div class="card"><b>הפקדה</b><br><button onclick="deposit('all')" class="action">הכל</button></div>
        <div class="card"><b>משיכה</b><br><button onclick="withdraw('all')" class="action" style="background:var(--green);">הכל</button></div>
        <div class="card" style="grid-column: span 2;">
            <b>חוב: ${Math.floor(window.loan)}₪</b><br>
            <button onclick="takeLoan(10000)" class="sys-btn">הלוואה 10K</button>
            <button onclick="payLoan('all')" class="sys-btn">סגור חוב</button>
        </div>
    </div>`;
}

// --- 4. עדכון UI גלובלי ---
window.renderUIUpdate = function(ld) {
    const mTop = document.getElementById('top-money');
    const bTop = document.getElementById('top-bank');
    const lTop = document.getElementById('life-level-ui');
    
    if (mTop) mTop.innerText = Math.floor(window.money).toLocaleString() + " ₪";
    if (bTop) bTop.innerText = Math.floor(window.bank).toLocaleString() + " ₪";
    if (lTop && ld) lTop.innerText = ld.level;

    const progBar = document.querySelector('.progress-bar');
    if (progBar && ld && window.currentTab === 'home') {
        progBar.style.width = ld.progressPercent + "%";
    }
};
