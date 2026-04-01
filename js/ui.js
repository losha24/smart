/* Smart Money Pro - ui.js - v6.5.2 TURBO FINAL */

function openTab(tabId) {
    const content = document.getElementById('content');
    if (!content) return;

    // עדכון ויזואלי של הכפתור הפעיל
    document.querySelectorAll('.topbar button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${tabId}`);
    if (activeBtn) activeBtn.classList.add('active');

    content.innerHTML = ""; 

    // ניתוב דפים
    switch (tabId) {
        case 'home': drawHome(content); break;
        case 'work': drawWork(content); break;
        case 'business': drawBusiness(content); break;
        case 'estate': drawEstate(content); break;
        case 'market': drawMarket(content); break;
        case 'skills': drawSkills(content); break;
        case 'cars': drawCars(content); break;
        case 'bank': drawBank(content); break;
        case 'casino': drawCasino(content); break;
        default: content.innerHTML = `<div class="card"><h3>${tabId}</h3><p>בפיתוח...</p></div>`;
    }
    updateUI();
}

// --- דף הבית (מרכז הבקרה) ---
function drawHome(c) {
    let ld = getLevelData(lifeXP);
    c.innerHTML = `
        <div class="main-card-hero fade-in">
            <h2 style="text-align:center; color:var(--blue); margin-bottom:5px;">פרופיל Alexei</h2>
            <div style="text-align:center; font-size:22px; font-weight:900;">רמה ${ld.level}</div>
            <div class="xp-container-big"><div id="xp-progress-bar" class="xp-bar-fill" style="width:${ld.progressPercent}%"></div></div>
            <div class="grid-2">
                <div class="card" style="text-align:center; margin:0; background:rgba(0,255,150,0.05);">
                    <small>הכנסה פסיבית</small><br><b style="color:var(--green); font-size:18px;">₪${Math.floor(passive).toLocaleString()}/ש</b>
                </div>
                <div class="card" style="text-align:center; margin:0; background:rgba(255,210,0,0.05);">
                    <small>מזומן זמין</small><br><b id="home-money-display" style="color:var(--yellow); font-size:18px;">₪${Math.floor(money).toLocaleString()}</b>
                </div>
            </div>
        </div>
        <div class="grid-2" style="margin-top:10px;">
            <button class="action" onclick="getDailyGift()">🎁 בונוס יומי</button>
            <button class="action" onclick="saveGame()" style="background:var(--purple); color:white;">💾 שמור התקדמות</button>
        </div>
        <div class="card fade-in" style="margin-top:15px;">
            <h3>📦 מחסן נכסים</h3>
            <div class="inv-grid">
                ${inventory.length > 0 ? inventory.map(i => `<div class="inv-slot" title="${i.n}">${i.icon}</div>`).join('') : '<p style="grid-column:span 4; text-align:center; opacity:0.4;">המחסן ריק...</p>'}
            </div>
        </div>
    `;
}

// --- עבודות (10 פריטים + בונוס פסיבי) ---
function drawWork(c) {
    const jobs = [
        { n: 'ניקיון קניון', p: 150, x: 15, i: '🧹' }, { n: 'שליח וולט', p: 400, x: 30, i: '🛵' },
        { n: 'מאבטח בנמל', p: 850, x: 60, i: '👮' }, { n: 'נהג מונית', p: 1800, x: 120, i: '🚕' },
        { n: 'טבח ראשי', p: 3500, x: 250, i: '👨‍🍳' }, { n: 'מנהל משמרת', p: 7200, x: 500, i: '💼' },
        { n: 'מתכנת FullStack', p: 15000, x: 1200, i: '💻' }, { n: 'קצין ביטחון', p: 35000, x: 3000, i: '🎖️' },
        { n: 'מנכ"ל חברה', p: 85000, x: 7000, i: '🏢' }, { n: 'יהלומן בורסה', p: 200000, x: 18000, i: '💎' }
    ];
    let h = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-2">`;
    jobs.forEach(j => {
        h += `<div class="card" style="text-align:center;">${j.i}<br><b>${j.n}</b><br><button class="sys-btn" style="width:100%;" onclick="doWork(${j.p}, ${j.x})">עבוד ₪${j.p}</button></div>`;
    });
    c.innerHTML = h + "</div>";
}

function doWork(p, x) {
    money += p; lifeXP += x; passive += (p * 0.01);
    showMsg(`רווח: +₪${p} | פסיבי: +₪${(p*0.01).toFixed(1)}`, "var(--green)");
    updateUI();
}

// --- עסקים (10 פריטים - רווח פי 3) ---
function drawBusiness(c) {
    const biz = [
        { n: 'דוכן פלאפל', c: 10000, r: 900 }, { n: 'פיצריה', c: 30000, r: 3200 },
        { n: 'מוסך רכבים', c: 120000, r: 15000 }, { n: 'אולם אירועים', c: 450000, r: 65000 },
        { n: 'סופרמרקט', c: 2000000, r: 350000 }, { n: 'חברת תוכנה', c: 10000000, r: 1800000 },
        { n: 'קניון', c: 35000000, r: 8000000 }, { n: 'חברת נפט', c: 150000000, r: 45000000 },
        { n: 'בנק פרטי', c: 800000000, r: 250000000 }, { n: 'תחנת חלל', c: 5000000000, r: 1500000000 }
    ];
    let h = `<h3>🏢 עסקים מניבים</h3>`;
    biz.forEach(b => {
        h += `<div class="card grid-2"><div><b>${b.n}</b><br><small>₪${b.r.toLocaleString()}/ש</small></div>
        <button class="sys-btn" onclick="buyBiz('${b.n}',${b.c},${b.r},'🏢')">קנה ₪${b.c.toLocaleString()}</button></div>`;
    });
    c.innerHTML = h;
}

function buyBiz(n, c, r, i) {
    if (money >= c) { money -= c; passive += r; inventory.push({ n, icon: i }); showMsg(`קנית ${n}!`, "var(--green)"); updateUI(); saveGame(); openTab('home'); }
    else { showMsg("חסר כסף!", "var(--red)"); }
}

// --- בנק (ניהול כספים) ---
function drawBank(c) {
    c.innerHTML = `
        <div class="card" style="text-align:center;">
            <h3>🏦 בנק לאומי</h3>
            <h1 style="color:var(--blue); font-size:32px; margin:10px 0;">₪${Math.floor(bank).toLocaleString()}</h1>
            <p style="opacity:0.6;">הכסף בבנק בטוח מפני הפסדים בקזינו</p>
            <div class="grid-2">
                <button class="action" onclick="bankOp('dep')">הפקד הכל</button>
                <button class="action" onclick="bankOp('wit')" style="background:none; border:1px solid var(--blue); color:var(--blue);">משוך הכל</button>
            </div>
        </div>
    `;
}

function bankOp(type) {
    if (type === 'dep') { bank += money; money = 0; showMsg("הפקדת הכל", "var(--green)"); }
    else { money += bank; bank = 0; showMsg("משכת הכל", "var(--blue)"); }
    updateUI(); saveGame(); openTab('bank');
}

// --- קזינו (הימורים) ---
function drawCasino(c) {
    c.innerHTML = `
        <div class="card" style="text-align:center;">
            <h3>🎰 קזינו מזל</h3>
            <p>המר על סכום והכפל אותו פי 2!</p>
            <input type="number" id="bet-amt" value="1000" class="card" style="width:80%; text-align:center; background:#000; color:white; border:1px solid var(--blue); font-size:20px;">
            <button class="action" style="margin-top:15px; width:100%;" onclick="gamble()">המר עכשיו!</button>
        </div>
    `;
}

function gamble() {
    let amt = parseInt(document.getElementById('bet-amt').value);
    if (amt > money || amt <= 0) return showMsg("אין לך מספיק מזומן!", "var(--red)");
    money -= amt;
    if (Math.random() > 0.55) { money += amt * 2; showMsg(`זכית! +₪${amt*2}`, "var(--green)"); }
    else { showMsg("הפסדת את ההימור...", "var(--red)"); }
    updateUI(); saveGame();
}

function buyCar(n, c, s, i) {
    if (money >= c) { money -= c; carSpeed = s; inventory.push({ n, icon: i }); showMsg(`תתחדש!`, "var(--green)"); updateUI(); saveGame(); openTab('home'); }
    else { showMsg("חסר כסף!", "var(--red)"); }
}

function getDailyGift() {
    let gift = 25000 * getLevelData(lifeXP).level;
    money += gift;
    showMsg(`בונוס: +₪${gift.toLocaleString()}`, "var(--yellow)");
    updateUI(); saveGame(); openTab('home');
}

// --- דפים נוספים (בקיצור עבור ה-10 פריטים) ---
function drawEstate(c) {
    const est = [
        { n: 'אוהל', c: 1500, r: 80 }, { n: 'דירת חדר', c: 60000, r: 4200 },
        { n: 'דירת 4 חדרים', c: 200000, r: 15000 }, { n: 'פנטהאוז', c: 750000, r: 65000 },
        { n: 'וילה בכרמל', c: 2500000, r: 220000 }, { n: 'בניין מגורים', c: 12000000, r: 1100000 },
        { n: 'גורד שחקים', c: 60000000, r: 5500000 }, { n: 'אי פרטי', c: 300000000, r: 35000000 },
        { n: 'מושבה במאדים', c: 1200000000, r: 160000000 }, { n: 'כוכב לכת', c: 12000000000, r: 1800000000 }
    ];
    let h = `<h3>🏘️ נדל"ן</h3>`;
    est.forEach(e => { h += `<div class="card grid-2"><div><b>${e.n}</b><br><small>₪${e.r.toLocaleString()}/ש</small></div><button class="sys-btn" onclick="buyBiz('${e.n}',${e.c},${e.r},'🏠')">₪${e.c.toLocaleString()}</button></div>`; });
    c.innerHTML = h;
}

function drawCars(c) {
    const cars = [
        { n: 'אופניים', c: 600, s: 1.1, i: '🚲' }, { n: 'קורקינט', c: 4000, s: 1.3, i: '🛴' },
        { n: 'מאזדה 3', c: 40000, s: 1.8, i: '🚗' }, { n: 'ג\'יפ', c: 150000, s: 2.6, i: '🚙' },
        { n: 'מרצדס', c: 700000, s: 4.5, i: '🚘' }, { n: 'פרארי', c: 2000000, s: 8, i: '🏎️' },
        { n: 'מטוס פרטי', c: 25000000, s: 18, i: '🛩️' }, { n: 'יאכטה', c: 90000000, s: 25, i: '🚤' },
        { n: 'חללית', c: 950000000, s: 120, i: '🚀' }, { n: 'פורטל קוונטי', c: 6000000000, s: 1500, i: '🌀' }
    ];
    let h = `<h3>🏎️ סוכנות רכבים</h3>`;
    cars.forEach(car => { h += `<div class="card grid-2"><div><b>${car.n} ${car.i}</b><br><small>x${car.s}</small></div><button class="sys-btn" onclick="buyCar('${car.n}',${car.c},${car.s},'${car.i}')">₪${car.c.toLocaleString()}</button></div>`; });
    c.innerHTML = h;
}

function drawSkills(c) {
    const sk = [
        { n: 'ניהול זמן', c: 2000, r: 150 }, { n: 'מכירות', c: 6500, r: 750 },
        { n: 'שיווק דיגיטלי', c: 25000, r: 3500 }, { n: 'השקעות', c: 120000, r: 18000 },
        { n: 'משא ומתן', c: 500000, r: 75000 }, { n: 'מנהיגות', c: 2000000, r: 350000 },
        { n: 'כלכלה עולמית', c: 10000000, r: 1800000 }, { n: 'סייבר אופנסיבי', c: 45000000, r: 8500000 },
        { n: 'בינה מלאכותית', c: 200000000, r: 45000000 }, { n: 'שליטה גלובלית', c: 1200000000, r: 350000000 }
    ];
    let h = `<h3>🎓 כישורים</h3>`;
    sk.forEach(s => { h += `<div class="card grid-2"><div><b>${s.n}</b><br><small>₪${s.r.toLocaleString()}/ש</small></div><button class="sys-btn" onclick="buyBiz('${s.n}',${s.c},${s.r},'🎓')">למד ₪${s.c.toLocaleString()}</button></div>`; });
    c.innerHTML = h;
}

function drawMarket(c) {
    const items = [
        { n: 'אייפון 17', c: 7000, i: '📱' }, { n: 'רולקס זהב', c: 65000, i: '⌚' },
        { n: 'טבעת יהלום', c: 180000, i: '💍' }, { n: 'ציור שמן', c: 950000, i: '🖼️' },
        { n: 'פסל שיש', c: 3500000, i: '🗿' }, { n: 'כתר מלכות', c: 20000000, i: '👑' },
        { n: 'ביצת זהב', c: 120000000, i: '🥚' }, { n: 'גולגולת קריסטל', c: 650000000, i: '💀' },
        { n: 'חרב עתיקה', c: 1800000000, i: '⚔️' }, { n: 'תיבת פנדורה', c: 5500000000, i: '📦' }
    ];
    let h = `<h3>🛒 שוק היוקרה</h3><div class="grid-2">`;
    items.forEach(it => { h += `<div class="card" style="text-align:center;">${it.i}<br><b>${it.n}</b><br><button class="sys-btn" style="width:100%;" onclick="buyMarket('${it.n}',${it.c},'${it.i}')">₪${it.c.toLocaleString()}</button></div>`; });
    c.innerHTML = h + "</div>";
}

function buyMarket(n, c, i) {
    if (money >= c) { money -= c; inventory.push({ n, icon: i }); showMsg(`רכשת ${n}!`, "var(--yellow)"); updateUI(); saveGame(); }
    else { showMsg("חסר כסף!", "var(--red)"); }
}
