/* Smart Money Pro - js/ui.js - v6.8.9 - Final Stable Sync */

// --- 1. ניהול טאבים וניווט מלא ---
function openTab(tabName) {
    if (typeof currentTab !== 'undefined') currentTab = tabName;
    
    const content = document.getElementById('content');
    if (!content) return;

    // עדכון כפתורי הניווט - ויזואלי בלבד
    document.querySelectorAll('.topbar button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (activeBtn) activeBtn.classList.add('active');

    content.innerHTML = ""; 

    // סריקה מלאה של כל הפונקציות מ-activities.js
    switch(tabName) {
        case 'home': drawHome(content); break;
        case 'work': drawWork(content); break;
        case 'market': drawMarket(content); break;
        case 'estate': drawEstate(content); break;
        case 'tasks': drawTasks(content); break; // הוחזר: משימות יומיות
        case 'skills': drawSkills(content); break; // הוחזר: פיתוח יכולות
        case 'bank': drawBank(content); break;
        case 'cars': drawCars(content); break;
        default: drawHome(content);
    }
    
    updateUI();
    window.scrollTo(0,0); // גלילה למעלה בטלפון
}

// --- 2. דף הבית (Home) - נקי, מהיר ומקצועי ---
function drawHome(c) {
    const ld = getLevelData(lifeXP);
    
    let html = `
    <div class="fade-in">
        <div class="card" style="background: linear-gradient(135deg, #1e293b, #0f172a); border: 1px solid rgba(255,255,255,0.1); padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0; color:var(--blue); letter-spacing: 1px;">📊 סטטוס נוכחי</h3>
                <div class="badge" style="background:var(--blue); padding:5px 15px; border-radius:20px; font-weight:bold; box-shadow: 0 0 10px rgba(59,130,246,0.5);">דרגה ${ld.level}</div>
            </div>
            
            <div style="margin-top:10px;">
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:8px; opacity:0.8;">
                    <span>התקדמות לרמה ${ld.level + 1}</span>
                    <span>${Math.floor(ld.progressPercent)}%</span>
                </div>
                <div class="progress-container" style="height:12px; background:rgba(255,255,255,0.1); border-radius:6px; overflow:hidden;">
                    <div class="progress-bar" style="width:${ld.progressPercent}%; height:100%; background:var(--green); box-shadow: 0 0 10px var(--green); transition: width 0.6s ease-out;"></div>
                </div>
            </div>
        </div>

        <div class="grid-2" style="margin-top:15px;">
            <div class="card" style="border-right:4px solid var(--green); background:rgba(16,185,129,0.05); padding: 15px;">
                <small style="color:var(--green); font-weight:bold; text-transform:uppercase; font-size:10px;">💰 הכנסה פסיבית</small>
                <div style="font-size:18px; font-weight:900; margin-top:5px;">+${Math.floor(passive).toLocaleString()}₪ <span style="font-size:10px; opacity:0.6;">/שעה</span></div>
            </div>
            <div class="card" style="border-right:4px solid var(--red); background:rgba(239,68,68,0.05); padding: 15px;">
                <small style="color:var(--red); font-weight:bold; text-transform:uppercase; font-size:10px;">📉 חובות</small>
                <div style="font-size:18px; font-weight:900; margin-top:5px;">${Math.floor(loan).toLocaleString()}₪</div>
            </div>
        </div>

        <div class="card" style="margin-top:15px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4 style="margin:0;">📦 מחסן ורכוש (${inventory.length})</h4>
                <button onclick="openTab('cars')" style="background:none; border:none; color:var(--blue); font-size:12px; cursor:pointer; font-weight:bold;">ניהול מלא ></button>
            </div>
            <div id="mini-inventory" style="display:flex; flex-wrap:wrap; gap:10px; margin-top:15px; min-height:50px; justify-content: flex-start;">
                ${inventory.length === 0 ? '<small style="opacity:0.5; width:100%; text-align:center; padding:10px;">המחסן ריק כרגע...</small>' : ''}
            </div>
        </div>

        <button onclick="claimDailyGift()" class="action" style="width:100%; margin-top:20px; padding:18px; background:linear-gradient(45deg, #d97706, #f59e0b); border:none; border-radius:12px; color:white; font-weight:900; font-size:16px; box-shadow: 0 4px 15px rgba(217,119,6,0.4); cursor:pointer; active:transform:scale(0.98);">
            🎁 קבל מתנה יומית (Cash Bonus)
        </button>
    </div>`;
    
    c.innerHTML = html;
    
    // מילוי המחסן הקטן (עד 8 פריטים אחרונים)
    const invDiv = document.getElementById('mini-inventory');
    if (invDiv && inventory.length > 0) {
        inventory.slice(-8).forEach(item => {
            const span = document.createElement('span');
            span.innerHTML = item.i || '📦';
            span.style = "font-size:26px; background:rgba(255,255,255,0.05); padding:10px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); width:50px; height:50px; display:flex; align-items:center; justify-content:center;";
            invDiv.appendChild(span);
        });
    }
}

// --- 3. ניהול הבנק (Bank UI) - הוספת יתרות חסרות ---
function drawBank(c) {
    let html = `
    <div class="card fade-in">
        <h3 style="color:var(--blue); margin:0 0 5px 0;">🏦 בנק לאומי סמארט</h3>
        <p style="font-size:13px; opacity:0.8; margin-bottom:20px;">ניהול חשבונות וחיסכון בריבית שעתית של 2%.</p>
        
        <div style="background:rgba(59,130,246,0.1); padding:25px; border-radius:15px; text-align:center; margin-bottom:20px; border: 1px solid rgba(59,130,246,0.2);">
            <small style="display:block; margin-bottom:5px; opacity:0.7;">יתרה נוכחית בחיסכון</small>
            <div style="font-size:32px; font-weight:900; color:var(--blue);">${Math.floor(bank).toLocaleString()}₪</div>
        </div>

        <div class="grid-2">
            <button onclick="deposit('all')" class="action" style="background:var(--blue); border:none; padding:15px; border-radius:10px; color:white; font-weight:bold; cursor:pointer;">📥 הפקד הכל</button>
            <button onclick="withdraw('all')" class="action" style="background:var(--green); border:none; padding:15px; border-radius:10px; color:white; font-weight:bold; cursor:pointer;">📤 משוך הכל</button>
        </div>

        <div class="card" style="margin-top:20px; background:rgba(239,68,68,0.05); border:1px solid rgba(239,68,68,0.2);">
            <h4 style="margin:0 0 10px 0; color:var(--red);">🆘 ניהול הלוואות (ריבית: 6%)</h4>
            <p style="font-size:15px; margin-bottom:15px;">חוב פתוח לבנק: <b style="color:var(--red);">${Math.floor(loan).toLocaleString()}₪</b></p>
            <div class="grid-2">
                <button onclick="takeLoan(50000)" class="sys-btn" style="color:var(--yellow); font-size:13px; border: 1px solid var(--yellow); padding:8px; border-radius:6px; background:transparent;">בקש 50K ₪</button>
                <button onclick="payLoan('all')" class="sys-btn" style="color:var(--green); font-size:13px; border: 1px solid var(--green); padding:8px; border-radius:6px; background:transparent;">סגור הכל</button>
            </div>
        </div>
    </div>`;
    c.innerHTML = html;
}

// --- 4. פונקציות עדכון UI גלובליות ---
function renderUIUpdate(ld) {
    const moneyTop = document.getElementById('top-money');
    const bankTop = document.getElementById('top-bank');
    const levelTop = document.getElementById('life-level-ui');
    
    if (moneyTop) moneyTop.innerText = Math.floor(money).toLocaleString() + " ₪";
    if (bankTop) bankTop.innerText = Math.floor(bank).toLocaleString() + " ₪";
    if (levelTop && ld) levelTop.innerText = ld.level;

    // עדכון פרוגרס-בר חי אם אנחנו בבית
    const progBar = document.querySelector('.progress-bar');
    if (progBar && ld && (typeof currentTab !== 'undefined' && currentTab === 'home')) {
        progBar.style.width = ld.progressPercent + "%";
    }
}

// --- 5. התראות מערכת (Status Messages) ---
function showMsg(msg, color = 'var(--blue)') {
    const bar = document.getElementById('status-bar');
    if (!bar) return;
    
    // ניקוי טיימרים קודמים במידה ויש
    bar.innerText = msg;
    bar.style.background = color;
    bar.style.opacity = "1";
    bar.style.transform = "translateY(0)";
    
    setTimeout(() => {
        bar.style.opacity = "0";
        bar.style.transform = "translateY(-10px)";
    }, 3500);
}

// --- 6. הגדרות (Themes & System) ---
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    showMsg(isLight ? "☀️ עברת למצב יום" : "🌙 עברת למצב לילה");
}

function forceUpdate() {
    if(confirm("לבצע סנכרון נתונים ורענון מלא?")) {
        location.reload(true);
    }
}
