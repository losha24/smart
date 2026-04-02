/* Smart Money Pro - js/ui.js - v6.9.1 - Final Fixed */

// --- 1. ניהול טאבים וניווט ---
function openTab(tabName) {
    if (typeof currentTab !== 'undefined') currentTab = tabName;
    
    const content = document.getElementById('content');
    if (!content) return;

    // עדכון כפתורי תפריט
    document.querySelectorAll('.topbar button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (activeBtn) activeBtn.classList.add('active');

    content.innerHTML = ""; 

    // ניתוב לכל הפונקציות (מוודא שהן קיימות)
    switch(tabName) {
        case 'home': drawHome(content); break;
        case 'work': (typeof drawWork === 'function') ? drawWork(content) : content.innerHTML = "טוען עבודות..."; break;
        case 'market': (typeof drawMarket === 'function') ? drawMarket(content) : content.innerHTML = "טוען בורסה..."; break;
        case 'estate': (typeof drawEstate === 'function') ? drawEstate(content) : content.innerHTML = "טוען נדל\"ן..."; break;
        case 'tasks': (typeof drawTasks === 'function') ? drawTasks(content) : content.innerHTML = "טוען משימות..."; break;
        case 'skills': (typeof drawSkills === 'function') ? drawSkills(content) : content.innerHTML = "טוען יכולות..."; break;
        case 'bank': drawBank(content); break;
        case 'cars': (typeof drawCars === 'function') ? drawCars(content) : content.innerHTML = "טוען רכבים..."; break;
        default: drawHome(content);
    }
    
    updateUI();
    window.scrollTo(0,0);
}

// --- 2. דף הבית (Home) - נקי ללא פרופיל ---
function drawHome(c) {
    const ld = getLevelData(lifeXP);
    
    c.innerHTML = `
    <div class="fade-in">
        <div class="card" style="background: linear-gradient(135deg, #1e293b, #0f172a); border-bottom: 4px solid var(--blue); padding: 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3 style="margin:0; color:var(--blue);">📊 לוח בקרה</h3>
                <span class="badge" style="background:var(--blue); padding:4px 12px; border-radius:15px; font-weight:bold;">רמה ${ld.level}</span>
            </div>
            
            <div style="margin-top:15px;">
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:5px; opacity:0.8;">
                    <span>התקדמות לרמה ${ld.level + 1}</span>
                    <span>${Math.floor(ld.progressPercent)}%</span>
                </div>
                <div class="progress-container" style="height:10px; background:rgba(255,255,255,0.1); border-radius:5px; overflow:hidden;">
                    <div class="progress-bar" style="width:${ld.progressPercent}%; height:100%; background:var(--green); transition:0.8s ease-out;"></div>
                </div>
            </div>
        </div>

        <div class="grid-2" style="margin-top:15px;">
            <div class="card" style="border-right:3px solid var(--green);">
                <small style="color:var(--green);">הכנסה פסיבית</small>
                <div style="font-size:18px; font-weight:bold;">+${Math.floor(passive).toLocaleString()}₪</div>
            </div>
            <div class="card" style="border-right:3px solid var(--red);">
                <small style="color:var(--red);">חוב לבנק</small>
                <div style="font-size:18px; font-weight:bold;">${Math.floor(loan).toLocaleString()}₪</div>
            </div>
        </div>

        <div class="card" style="margin-top:15px;">
            <h4 style="margin:0 0 10px 0;">📦 פריטים אחרונים</h4>
            <div id="mini-inventory" style="display:flex; gap:10px; flex-wrap:wrap; min-height:40px;">
                ${inventory.length === 0 ? '<small style="opacity:0.5;">המחסן ריק</small>' : ''}
            </div>
        </div>

        <button onclick="claimDailyGift()" class="action" style="width:100%; margin-top:20px; padding:15px; background:var(--blue); color:white; border:none; border-radius:10px; font-weight:bold; box-shadow: 0 4px 10px rgba(59,130,246,0.3);">
            🎁 קבל מתנה יומית
        </button>
    </div>`;

    const invDiv = document.getElementById('mini-inventory');
    if (invDiv && inventory.length > 0) {
        inventory.slice(-6).forEach(item => {
            const s = document.createElement('span');
            s.innerHTML = item.i || '📦';
            s.style = "font-size:24px; background:rgba(255,255,255,0.05); padding:10px; border-radius:10px; border:1px solid rgba(255,255,255,0.1);";
            invDiv.appendChild(s);
        });
    }
}

// --- 3. בנק (Bank) - החזרת ההלוואות ---
function drawBank(c) {
    c.innerHTML = `
    <div class="card fade-in">
        <h3 style="color:var(--blue); margin-top:0;">🏦 בנק סמארט</h3>
        
        <div style="text-align:center; padding:25px; background:rgba(59,130,246,0.05); border-radius:15px; margin:15px 0; border:1px solid rgba(59,130,246,0.1);">
            <small style="display:block; margin-bottom:5px;">יתרה בחיסכון</small>
            <div style="font-size:28px; color:var(--blue); font-weight:900;">${Math.floor(bank).toLocaleString()}₪</div>
        </div>

        <div class="grid-2">
            <button onclick="deposit('all')" class="action" style="padding:12px;">הפקד הכל</button>
            <button onclick="withdraw('all')" class="action" style="background:var(--green); padding:12px;">משוך הכל</button>
        </div>

        <div class="card" style="margin-top:20px; border:1px solid rgba(239,68,68,0.2); background:rgba(239,68,68,0.02);">
            <h4 style="margin:0 0 10px 0; color:var(--red);">🚨 ניהול חובות</h4>
            <p>חוב נוכחי: <b>${Math.floor(loan).toLocaleString()}₪</b></p>
            <div class="grid-2">
                <button onclick="takeLoan(50000)" class="sys-btn" style="color:var(--yellow); border:1px solid var(--yellow);">בקש 50K</button>
                <button onclick="payLoan('all')" class="sys-btn" style="color:var(--green); border:1px solid var(--green);">סגור חוב</button>
            </div>
        </div>
    </div>`;
}

// --- 4. עדכון UI גלובלי ---
function renderUIUpdate(ld) {
    const mTop = document.getElementById('top-money');
    const bTop = document.getElementById('top-bank');
    const lTop = document.getElementById('life-level-ui');
    
    if (mTop) mTop.innerText = Math.floor(money).toLocaleString() + " ₪";
    if (bTop) bTop.innerText = Math.floor(bank).toLocaleString() + " ₪";
    if (lTop && ld) lTop.innerText = ld.level;

    // עדכון פרוגרס-בר אם אנחנו בבית
    const progBar = document.querySelector('.progress-bar');
    if (progBar && ld && (typeof currentTab !== 'undefined' && currentTab === 'home')) {
        progBar.style.width = ld.progressPercent + "%";
    }
}

// --- 5. הודעות מערכת ---
function showMsg(msg, color = 'var(--blue)') {
    const bar = document.getElementById('status-bar');
    if (!bar) return;
    bar.innerText = msg;
    bar.style.background = color;
    bar.style.opacity = "1";
    bar.style.transform = "translateY(0)";
    
    setTimeout(() => {
        bar.style.opacity = "0";
        bar.style.transform = "translateY(-10px)";
    }, 3000);
}

// --- 6. הגדרות ---
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    showMsg(isLight ? "☀️ מצב יום" : "🌙 מצב לילה");
}
