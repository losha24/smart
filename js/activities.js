/* Smart Money Pro - js/activities.js - v6.5.0 - Business Empire Integration */

// --- מאגרי נתונים ---
const jobList = [
    { id: 'j1', name: 'מנקה', pay: 55, xp: 20, time: 3000, icon: '🧹' },
    { id: 'j2', name: 'שליח', pay: 95, xp: 45, time: 5000, icon: '🛵' },
    { id: 'j3', name: 'מאבטח', pay: 145, xp: 65, time: 8000, icon: '🏢' },
    { id: 'j4', name: 'מאבטח חמוש', pay: 290, xp: 140, time: 10000, icon: '🔫', req: 'רישיון נשק' },
    { id: 'j5', name: 'נהג מונית', pay: 340, xp: 110, time: 12000, icon: '🚕', reqCar: true },
    { id: 'j6', name: 'סוהר', pay: 420, xp: 190, time: 14000, icon: '👮', req: 'קורס פיקודי' },
    { id: 'j7', name: 'נהג משאית', pay: 650, xp: 250, time: 16000, icon: '🚛', req: 'רישיון משאית', reqCar: true },
    { id: 'j8', name: 'מתכנת PWA', pay: 900, xp: 480, time: 20000, icon: '💻', req: 'תכנות' },
    { id: 'j9', name: 'מנהל רשת', pay: 1750, xp: 850, time: 25000, icon: '🌐', req: 'ניהול רשת' },
    { id: 'j10', name: 'ארכיטקט', pay: 3500, xp: 1500, time: 35000, icon: '🏛️', req: 'ניהול טכנולוגי' }
];

const estateList = [
    { id: 'e1', name: 'מחסן להשכרה', price: 15000, passive: 120, icon: '📦' },
    { id: 'e2', name: 'דירת סטודיו', price: 150000, passive: 950, icon: '🏠' },
    { id: 'e3', name: 'חנות ברחוב', price: 450000, passive: 3200, icon: '🏪' },
    { id: 'e4', name: 'בניין מגורים', price: 2500000, passive: 18500, icon: '🏢' },
    { id: 'e5', name: 'מרכז מסחרי', price: 12000000, passive: 95000, icon: '🏗️' }
];

const businessList = [
    { id: 'biz_falafel', name: 'דוכן פלאפל', price: 65000, passive: 550, icon: '🥙' },
    { id: 'biz_garage', name: 'מוסך רכב', price: 320000, passive: 3400, icon: '🔧' },
    { id: 'biz_hall', name: 'אולם אירועים', price: 1800000, passive: 19500, icon: '🎊' },
    { id: 'biz_tech', name: 'חברת הייטק', price: 9500000, passive: 125000, icon: '🚀' }
];

const stockList = [
    { id: 'AAPL', name: 'Apple', price: 580, trend: 0 },
    { id: 'TSLA', name: 'Tesla', price: 920, trend: 0 },
    { id: 'NVDA', name: 'Nvidia', price: 420, trend: 0 },
    { id: 'BTC',  name: 'Bitcoin', price: 65000, trend: 0 },
    { id: 'ELAL', name: 'אל-על', price: 12, trend: 0 }
];

const skillList = [
    { name: 'רישיון נשק', price: 4500, icon: '🔫' },
    { name: 'תכנות', price: 10000, icon: '📜' },
    { name: 'רישיון משאית', price: 12000, icon: '🚛' },
    { name: 'קורס פיקודי', price: 14500, icon: '🎖️' },
    { name: 'ניהול רשת', price: 22000, icon: '🧠' },
    { name: 'ניהול טכנולוגי', price: 45000, icon: '🚀' }
];

const carList = [
    { name: 'קורקינט', price: 3000, speed: 1.2, icon: '🛴' },
    { name: 'אופנוע', price: 16000, speed: 1.6, icon: '🛵' },
    { name: 'סקודה', price: 90000, speed: 2.3, icon: '🚗' },
    { name: 'טסלה S', price: 280000, speed: 4.5, icon: '⚡' },
    { name: 'משאית וולוו', price: 550000, speed: 1.8, icon: '🚛' },
    { name: 'פרארי', price: 1800000, speed: 8, icon: '🏎️' }
];

// --- מנוע עדכון בורסה חי ---
setInterval(() => {
    stockList.forEach(s => {
        const change = (Math.random() * 0.05) - 0.024;
        s.price *= (1 + change);
        if (s.price < 1) s.price = 1;
        s.trend = change;
    });
    if (typeof currentTab !== 'undefined' && currentTab === 'market') {
        const content = document.getElementById('content');
        if (content) drawMarket(content);
    }
}, 3000);

// --- פונקציות תצוגה ועבודה ---

function drawWork(c) {
    let html = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-2">`;
    jobList.forEach(j => {
        const hasSkill = !j.req || skills.includes(j.req);
        const hasCar = !j.reqCar || cars.length > 0;
        const canWork = hasSkill && hasCar;

        html += `
            <div class="card fade-in" style="text-align:center; opacity:${canWork ? 1 : 0.6}; border-top: 3px solid ${canWork ? 'var(--blue)' : '#444'}">
                <div style="font-size:26px; margin-bottom:5px;">${j.icon}</div>
                <div style="font-weight:bold; font-size:13px; min-height:32px;">${j.name}</div>
                <div style="color:var(--green); font-size:12px; margin-bottom:8px;">${j.pay.toLocaleString()}₪</div>
                <div id="prog-cont-${j.id}" style="display:none; width:100%; background:#1e293b; height:6px; border-radius:3px; margin-bottom:10px; overflow:hidden;">
                    <div id="bar-${j.id}" style="width:0%; height:100%; background:var(--blue); transition: width linear;"></div>
                </div>
                <button class="sys-btn" id="job-${j.id}" style="width:100%;" onclick="startWork('${j.id}')" ${canWork ? '' : 'disabled'}>
                    ${canWork ? 'בצע עבודה' : 'נעול'}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function startWork(id) {
    const j = jobList.find(x => x.id === id);
    if (!j) return;
    const btn = document.getElementById(`job-${j.id}`);
    const container = document.getElementById(`prog-cont-${j.id}`);
    const bar = document.getElementById(`bar-${j.id}`);
    const actualTime = j.time / (carSpeed || 1);

    if(btn) btn.disabled = true;
    if(container) container.style.display = "block";
    
    setTimeout(() => { 
        if(bar) { bar.style.transition = `width ${actualTime}ms linear`; bar.style.width = "100%"; }
    }, 50);

    setTimeout(() => {
        money += j.pay;
        lifeXP += j.xp;
        showMsg(`💰 +${j.pay}₪ | ✨ +${j.xp} XP`, "var(--green)");
        if(btn) btn.disabled = false;
        if(container) container.style.display = "none";
        if(bar) { bar.style.transition = "none"; bar.style.width = "0%"; }
        updateUI(); saveGame();
    }, actualTime);
}

function drawEstate(c) {
    let html = `<h3>🏠 השקעות נדל"ן</h3><div class="grid-2">`;
    estateList.forEach(e => {
        const count = inventory.filter(item => item === e.name).length;
        html += `
            <div class="card fade-in" style="text-align:center; border: 1px solid var(--border)">
                <div style="font-size:30px; margin-bottom:5px;">${e.icon}</div>
                <div style="font-size:13px; font-weight:bold;">${e.name}</div>
                <div style="color:var(--green); font-size:11px; margin:5px 0;">+${e.passive}₪ / שעה</div>
                <div style="font-size:10px; opacity:0.6; margin-bottom:10px;">בבעלותך: ${count}</div>
                <button class="sys-btn" style="width:100%;" onclick="buyEstate('${e.id}')">
                    ${e.price.toLocaleString()}₪
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyEstate(id) {
    const e = estateList.find(x => x.id === id);
    if (!e || money < e.price) return showMsg("אין מספיק כסף!", "var(--red)");
    money -= e.price;
    passive += e.passive;
    inventory.push(e.name);
    showMsg(`🏠 תתחדש! רכשת ${e.name}`, "var(--green)");
    saveGame(); updateUI(); drawEstate(document.getElementById('content'));
}

function drawBusiness(c) {
    let html = `<h3>💼 הקמת אימפריית עסקים</h3><div class="grid-1">`;
    businessList.forEach(b => {
        const level = inventory.filter(item => item === b.id).length;
        const currentPrice = b.price * (level + 1);
        const currentPassive = b.passive * level;

        html += `
            <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center; border-left: 4px solid ${level > 0 ? 'var(--purple)' : '#444'}">
                <div style="display:flex; align-items:center; gap:15px;">
                    <div style="font-size:35px;">${b.icon}</div>
                    <div>
                        <div style="font-weight:bold;">${b.name} ${level > 0 ? `<span style="color:var(--purple)">[רמה ${level}]</span>` : ''}</div>
                        <div style="font-size:12px; color:var(--green);">הכנסה פסיבית: ${currentPassive.toLocaleString()}₪ / שעה</div>
                    </div>
                </div>
                <button class="sys-btn" style="min-width:120px;" onclick="buyBusiness('${b.id}', ${currentPrice}, ${b.passive})">
                    ${level === 0 ? `הקם: ${currentPrice.toLocaleString()}₪` : `שדרג: ${currentPrice.toLocaleString()}₪`}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyBusiness(id, price, passAdd) {
    const b = businessList.find(x => x.id === id);
    if (money >= price) {
        money -= price;
        passive += passAdd;
        inventory.push(id); 
        showMsg(`💼 ${b.name} שודרג/הוקם!`, "var(--purple)");
        saveGame(); updateUI(); drawBusiness(document.getElementById('content'));
    } else { showMsg("אין מספיק כסף להשקעה!", "var(--red)"); }
}

function drawMarket(c) {
    let html = `<h3>📈 שוק ההון (Live)</h3><div class="grid-1">`;
    stockList.forEach(s => {
        const owned = invOwned[s.id] || 0;
        const color = s.trend >= 0 ? 'var(--green)' : 'var(--red)';
        const arrow = s.trend >= 0 ? '▲' : '▼';
        html += `
            <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center; border-right: 4px solid ${color}">
                <div>
                    <div style="font-weight:bold;">${s.name}</div>
                    <div style="font-size:11px; opacity:0.6;">בבעלותך: <b>${owned}</b></div>
                </div>
                <div style="text-align:center;">
                    <div style="color:${color}; font-weight:bold;">${s.price.toLocaleString(undefined, {maximumFractionDigits:2})}₪</div>
                    <small style="color:${color}; font-size:10px;">${arrow} ${(s.trend*100).toFixed(2)}%</small>
                </div>
                <div style="display:flex; gap:5px;">
                    <button class="sys-btn" style="padding:5px; min-width:45px; background:rgba(34,197,94,0.1);" onclick="buyStock('${s.id}')">קנה</button>
                    <button class="sys-btn" style="padding:5px; min-width:45px; background:rgba(239,68,68,0.1);" onclick="sellStock('${s.id}')">מכור</button>
                </div>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyStock(id) {
    const s = stockList.find(x => x.id === id);
    if (money >= s.price) {
        money -= s.price;
        invOwned[id] = (invOwned[id] || 0) + 1;
        showMsg(`📈 קנית ${s.name}`, "var(--blue)");
        saveGame(); updateUI(); drawMarket(document.getElementById('content'));
    } else { showMsg("חסר מזומן!", "var(--red)"); }
}

function sellStock(id) {
    if (invOwned[id] > 0) {
        const s = stockList.find(x => x.id === id);
        money += s.price;
        invOwned[id] -= 1;
        showMsg(`💰 מכרת ${s.name}`, "var(--green)");
        saveGame(); updateUI(); drawMarket(document.getElementById('content'));
    } else { showMsg("אין לך יחידות למכירה!", "var(--red)"); }
}

function drawBank(c) {
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center;">
            <h3>🏦 בנק הפועלים</h3>
            <div class="card" style="background:rgba(0,0,0,0.2); margin-bottom:15px;">
                <small>יתרה בבנק</small>
                <h2 style="color:var(--blue); margin:5px 0;">${bank.toLocaleString()}₪</h2>
            </div>
            <div style="font-size:12px; color:var(--red); margin-bottom:10px;">חוב הלוואה: ${loan.toLocaleString()}₪</div>
            <button class="action" style="background:#451a1a; color:white; width:100%;" onclick="takeLoan()">קח הלוואה (50,000₪)</button>
        </div>
    `;
}

function takeLoan() {
    loan += 50000; money += 50000;
    showMsg("🏦 קיבלת הלוואה!", "var(--yellow)");
    saveGame(); updateUI(); drawBank(document.getElementById('content'));
}

function drawTasks(c) {
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center; padding:20px; border: 2px dashed var(--yellow);">
            <div style="font-size:50px; margin-bottom:10px;">🎰</div>
            <h3 style="color:var(--yellow); margin-top:0;">Casino</h3>
            <input type="number" id="gamble-amt" placeholder="סכום..." style="width:80%; padding:10px; margin-bottom:10px; text-align:center; background:#000; color:#fff; border:1px solid #333;">
            <div id="casino-anim" style="height:25px; font-size:13px;"></div>
            <button class="action" style="background:var(--yellow); color:black; width:100%;" onclick="playCasino()">המר!</button>
        </div>`;
}

function playCasino() {
    const amt = parseInt(document.getElementById('gamble-amt').value);
    if(!amt || amt <= 0 || amt > money) return showMsg("סכום לא תקין", "var(--red)");
    money -= amt; updateUI();
    document.getElementById('casino-anim').innerText = "🎲 מסובב...";
    setTimeout(() => {
        if (Math.random() > 0.55) {
            money += amt * 2;
            showMsg(`💎 זכייה!`, "var(--yellow)");
        } else { showMsg(`💀 הפסדת`, "var(--red)"); }
        updateUI(); saveGame(); drawTasks(document.getElementById('content'));
    }, 800);
}

function drawSkills(c) {
    let html = `<h3>🎓 הכשרה ולימודים</h3><div class="grid-2">`;
    skillList.forEach(s => {
        const has = skills.includes(s.name);
        html += `<div class="card" style="text-align:center;"><div style="font-size:24px;">${s.icon}</div><div>${s.name}</div>
        <button class="sys-btn" onclick="buySkill('${s.name}', ${s.price})" ${has ? 'disabled' : ''}>${has ? '✅' : s.price+'₪'}</button></div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buySkill(name, price) {
    if (money >= price) { money -= price; skills.push(name); saveGame(); updateUI(); drawSkills(document.getElementById('content')); }
}

function drawCars(c) {
    let html = `<h3>🏎️ סוכנות רכב</h3><div class="grid-2">`;
    carList.forEach(car => {
        const has = cars.includes(car.name);
        html += `<div class="card" style="text-align:center;"><div style="font-size:24px;">${car.icon}</div><div>${car.name}</div>
        <button class="sys-btn" onclick="buyCar('${car.name}', ${car.price}, ${car.speed})" ${has ? 'disabled' : ''}>${has ? '🏎️' : car.price+'₪'}</button></div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyCar(name, price, speed) {
    if (money >= price) { money -= price; cars.push(name); carSpeed = speed; saveGame(); updateUI(); drawCars(document.getElementById('content')); }
}

function drawInvest(c) { c.innerHTML = "<h3>💰 השקעות</h3><p>בקרוב...</p>"; }

function getDailyGift() {
    const now = Date.now();
    if (now - lastGift > 86400000) {
        money += 2000; lastGift = now;
        showMsg(`🎁 קיבלת 2,000₪!`, "var(--yellow)");
        saveGame(); updateUI(); openTab('home');
    } else { showMsg("חזור מחר!", "var(--white)"); }
}
