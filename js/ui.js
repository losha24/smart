/* Smart Money Pro - js/ui.js - v6.8.9 - Full UI Engine */

let currentTab = 'home';

// --- 1. ניהול טאבים וניווט ---
function openTab(tabName) {
    currentTab = tabName;
    const content = document.getElementById('content');
    if (!content) return;

    // עדכון כפתורים פעילים
    document.querySelectorAll('.topbar button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (activeBtn) activeBtn.classList.add('active');

    content.innerHTML = ""; 

    // ניתוב לפונקציות הציור מ-activities.js
    switch(tabName) {
        case 'home': drawHome(content); break;
        case 'work': drawWork(content); break;
        case 'invest': 
        case 'market': drawMarket(content); break;
        case 'business':
        case 'estate': drawEstate(content); break;
        case 'tasks': drawTasks(content); break;
        case 'skills': drawSkills(content); break;
        case 'bank': drawBank(content); break;
        case 'cars': drawCars(content); break;
        default: drawHome(content);
    }
    
    updateUI();
}

// --- 2. רינדור דף הבית (Home Screen) ---
function drawHome(c) {
    const ld = getLevelData(lifeXP);
    
    let html = `
    <div class="fade-in">
        <div class="card profile-card" style="text-align:center; background: linear-gradient(135deg, #1e293b, #0f172a);">
            <div style="font-size:40px; margin-bottom:10px;">👤</div>
            <h2 style="margin:5px 0;">אלכסיי זבודיסקר</h2>
            <div class="badge" style="background:var(--blue); display:inline-block; padding:3px 12px; border-radius:15px; font-size:12px;">
                דרגה: ${ld.level}
            </div>
            
            <div style="margin-top:20px;">
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:5px;">
                    <span>התקדמות לרמה ${ld.level + 1}</span>
                    <span>${Math.floor(ld.progressPercent)}%</span>
                </div>
                <div class="progress-container" style="height:10px;">
                    <div class="progress-bar" style="width:${ld.progressPercent}%; background:var(--green); box-shadow: 0 0 10px var(--green);"></div>
                </div>
            </div>
        </div>

        <div class="grid-2">
            <div class="card" style="border-right:4px solid var(--green);">
                <small>הכנסה פסיבית</small>
                <div style="font-size:18px; font-weight:bold; color:var(--green);">+${Math.floor(passive).toLocaleString()}₪ <span style="font-size:10px; opacity:0.6;">/שעה</span></div>
            </div>
            <div class="card" style="border-right:4px solid var(--red);">
                <small>חובות לבנק</small>
                <div style="font-size:18px; font-weight:bold; color:var(--red);">${Math.floor(loan).toLocaleString()}₪</div>
            </div>
        </div>

        <div class="card" style="margin-top:15px;">
            <h4>📦 המחסן שלי</h4>
            <div id="mini-inventory" style="display:flex; flex-wrap:wrap; gap:10px; margin-top:10px;">
                ${inventory.length === 0 ? '<small style="opacity:0.5;">המחסן ריק...</small>' : ''}
            </div>
        </div>
    </div>`;
    
    c.innerHTML = html;
    
    // הוספת פריטים למחסן
    const invDiv = document.getElementById('mini-inventory');
    if (invDiv) {
        inventory.slice(-6).forEach(item => {
            const span = document.createElement('span');
            span.className = 'inv-item-icon';
            span.innerHTML = item.i;
            span.title = item.n;
            span.style = "font-size:24px; background:rgba(255,255,255,0.05); padding:8px; border-radius:10px;";
            invDiv.appendChild(span);
        });
    }
}

// --- 3. ניהול הבנק (Bank UI) ---
function drawBank(c) {
    let html = `
    <div class="card fade-in">
        <h3 style="color:var(--blue);">🏦 בנק לאומי סמארט</h3>
        <p style="font-size:13px; opacity:0.8;">נהל את החסכונות וההלוואות שלך בריבית שעתית.</p>
        
        <div class="bank-stats" style="display:flex; gap:10px; margin:20px 0;">
            <div class="card" style="flex:1; text-align:center; background:rgba(59,130,246,0.1);">
                <small>יתרה בבנק</small>
                <div style="font-size:20px; font-weight:bold;">${Math.floor(bank).toLocaleString()}₪</div>
            </div>
        </div>

        <div class="grid-2">
            <button onclick="deposit('all')" class="action" style="background:var(--blue);">הפקד הכל</button>
            <button onclick="withdraw('all')" class="action" style="background:var(--green);">משוך הכל</button>
        </div>

        <hr style="margin:20px 0; border:0; border-top:1px solid var(--border);">
        
        <h4>💰 הלוואות</h4>
        <div class="card" style="background:rgba(239,68,68,0.05); border:1px solid rgba(239,68,68,0.2);">
            <p>חוב נוכחי: <b>${Math.floor(loan).toLocaleString()}₪</b></p>
            <div class="grid-2">
                <button onclick="takeLoan(50000)" class="sys-btn" style="color:var(--yellow);">בקש 50K</button>
                <button onclick="payLoan('all')" class="sys-btn" style="color:var(--green);">סגור חוב</button>
            </div>
        </div>
    </div>`;
    c.innerHTML = html;
}

// --- 4. פונקציות עזר ועדכון (Core UI Logic) ---
function showMsg(msg, color = 'var(--blue)') {
    const bar = document.getElementById('status-bar');
    if (!bar) return;
    bar.innerText = msg;
    bar.style.backgroundColor = color;
    bar.style.opacity = "1";
    bar.style.transform = "translateY(0)";
    
    setTimeout(() => {
        bar.style.opacity = "0";
        bar.style.transform = "translateY(-10px)";
    }, 3000);
}

function renderUIUpdate(ld) {
    // פונקציה זו נקראת מה-Economy בכל Tick
    const moneyTop = document.getElementById('top-money');
    const bankTop = document.getElementById('top-bank');
    
    if (moneyTop) moneyTop.innerText = Math.floor(money).toLocaleString() + " ₪";
    if (bankTop) bankTop.innerText = Math.floor(bank).toLocaleString() + " ₪";

    // אם אנחנו בדף הבית, נרענן את פס ההתקדמות בזמן אמת
    const progBar = document.querySelector('.profile-card .progress-bar');
    if (progBar) {
        progBar.style.width = ld.progressPercent + "%";
    }
}

// --- 5. ערכות נושא (Theme Toggle) ---
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    showMsg(isLight ? "מצב יום הופעל" : "מצב לילה הופעל");
}

// --- 6. פונקציות מערכת ---
function forceUpdate() {
    if(confirm("לבדוק עדכוני גרסה? המשחק יתרענן.")) {
        location.reload(true);
    }
}
