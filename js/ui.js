/* Smart Money Pro - ui.js - SYNCED WITH TURBO CSS */

// פונקציית הניווט - מעדכנת את ה-Active ומחליפה טאב
function openTab(tabId) {
    const content = document.getElementById('content');
    if (!content) return;

    // עדכון ויזואלי של הכפתור הפעיל ב-Topbar (4 בשורה)
    document.querySelectorAll('.topbar button').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${tabId}`);
    if (activeBtn) activeBtn.classList.add('active');

    content.innerHTML = "";
    content.className = "main-content fade-in"; // אנימציית כניסה מה-CSS

    switch (tabId) {
        case 'home': drawHome(content); break;
        case 'work': drawWork(content); break;
        case 'business': drawBusiness(content); break;
        case 'estate': drawEstate(content); break;
        case 'market': drawMarket(content); break;
        case 'cars': drawCars(content); break;
        case 'skills': drawSkills(content); break;
        case 'bank': drawBank(content); break;
        case 'invest': drawInvest(content); break;
        case 'casino': drawCasino(content); break;
    }
    window.scrollTo(0,0);
}

// דף הבית - משולב עם כרטיס הגיבור (Hero Card)
function drawHome(c) {
    let ld = getLevelData(lifeXP);
    c.innerHTML = `
        <div class="main-card-hero">
            <h2 style="text-align:center; color:var(--blue); font-size:16px; margin:0;">📊 לוח בקרה ראשי</h2>
            
            <div style="text-align:center; margin:15px 0;">
                <div style="display:flex; justify-content: space-between; font-size:12px; margin-bottom:5px;">
                    <span style="font-weight:bold;">רמה ${ld.level}</span>
                    <span id="xp-detail" style="color:var(--purple); font-weight:bold;">
                        ${Math.floor(lifeXP).toLocaleString()} / ${ld.nextXP.toLocaleString()} XP
                    </span>
                </div>
                <div class="xp-container-big">
                    <div id="xp-progress-bar" class="xp-bar-fill" style="width:${ld.progressPercent}%"></div>
                </div>
            </div>

            <div class="grid-2">
                <div class="card" style="background:rgba(0,255,150,0.05); border-color:rgba(0,255,150,0.2);">
                    <small style="opacity:0.7; font-size:10px;">הכנסה פסיבית</small>
                    <b style="color:var(--green); font-size:16px;">₪<span id="passive-val">${Math.floor(passive).toLocaleString()}</span></b>
                </div>
                <div class="card" style="background:rgba(255,210,0,0.05); border-color:rgba(255,210,0,0.2);">
                    <small style="opacity:0.7; font-size:10px;">מזומן ביד</small>
                    <b style="color:var(--yellow); font-size:16px;">₪<span id="money">${Math.floor(money).toLocaleString()}</span></b>
                </div>
            </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; margin:10px;">
            <button class="action" onclick="getDailyGift()" style="font-size:11px; padding:12px 0; background:var(--purple); color:#fff;">🎁 בונוס</button>
            <button class="action" onclick="saveGame()" style="font-size:11px; padding:12px 0; background:#222; color:var(--blue); border:1px solid var(--blue);">💾 שמור</button>
            <button class="action" onclick="showInstallGuide()" style="font-size:11px; padding:12px 0; background:var(--blue); color:#000;">📲 התקנה</button>
        </div>

        <div class="card" style="margin:10px; align-items: flex-start;">
            <h3 style="font-size:14px; margin:0 0 10px 0; color:var(--blue);">📦 הנכסים שלי</h3>
            <div class="inv-grid" style="width:100%; grid-template-columns: repeat(5, 1fr);">
                ${inventory.length > 0 ? inventory.map(i => `<div class="inv-slot" title="${i.name}">${i.icon}</div>`).join('') : '<p style="font-size:10px; opacity:0.3; width:100%; text-align:center;">אין נכסים כרגע</p>'}
            </div>
        </div>
    `;
}

// פונקציית עזר להודעות קופצות (Message Popup)
function showMsg(txt, color) {
    const msg = document.getElementById('msg');
    if (!msg) return;
    
    msg.innerText = txt;
    msg.style.background = color;
    msg.style.bottom = "30px"; // קופץ מלמטה לפי ה-CSS
    
    setTimeout(() => {
        msg.style.bottom = "-100px";
    }, 3000);
}

// הסבר התקנה (בלחיצה על כפתור התקנה)
function showInstallGuide() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const guide = isIOS ? 
        "באייפון: לחץ על כפתור ה-'שתף' (ריבוע עם חץ) בתחתית הדפדפן ובחר 'הוסף למסך הבית'." : 
        "בכרום: לחץ על 3 הנקודות למעלה ובחר 'התקן אפליקציה' או 'הוסף למסך הבית'.";
    
    alert(`📲 התקנת Smart Money Pro:\n\n${guide}\n\nהמשחק שומר את ההתקדמות שלך באופן אוטומטי כל 30 שניות.`);
}

// עדכון ה-UI הכללי (נקרא כל 50ms מ-core.js)
function updateUI() {
    const ld = getLevelData(lifeXP);
    
    // עדכון ערכים בבר הסטטיסטיקה העליון ובדפים
    const updates = {
        'money': Math.floor(money).toLocaleString(),
        'bank': Math.floor(bank).toLocaleString(),
        'passive-val': Math.floor(passive).toLocaleString(),
        'level-num': ld.level,
        'xp-detail': `${Math.floor(lifeXP).toLocaleString()} / ${ld.nextXP.toLocaleString()} XP`
    };

    for (let id in updates) {
        const el = document.getElementById(id);
        if (el) {
            // אם הערך השתנה, נבצע עדכון (חוסך משאבים)
            if (el.innerText !== updates[id]) el.innerText = updates[id];
        }
    }

    // עדכון פס התקדמות XP
    const xpb = document.getElementById('xp-progress-bar');
    if (xpb) xpb.style.width = ld.progressPercent + "%";
}
