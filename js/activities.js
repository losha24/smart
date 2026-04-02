/* Smart Money Pro - js/activities.js - v7.3.0 - Combined & Optimized */

// --- מאגרי נתונים משולבים (v7.3.0) ---
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
    { id: 'e1.5', name: 'קרקע חקלאית', price: 35000, passive: 280, icon: '🌱' },
    { id: 'e2', name: 'חניה במרכז', price: 45000, passive: 350, icon: '🅿️' },
    { id: 'e3', name: 'דירת סטודיו', price: 150000, passive: 950, icon: '🏠' },
    { id: 'e4', name: 'דירת 4 חדרים', price: 320000, passive: 2100, icon: '🏡' },
    { id: 'e5', name: 'חנות ברחוב', price: 450000, passive: 3200, icon: '🏪' },
    { id: 'e6', name: 'וילה עם בריכה', price: 1200000, passive: 8500, icon: '🏰' },
    { id: 'e7', name: 'בניין מגורים', price: 2500000, passive: 18500, icon: '🏢' },
    { id: 'e8', name: 'מרכז מסחרי', price: 12000000, passive: 95000, icon: '🏗️' }
];

const businessList = [
    { id: 'biz0', name: 'מכונת מסטיקים', price: 1200, passive: 15, icon: '🍬' },
    { id: 'biz1', name: 'דוכן לימונדה', price: 5000, passive: 45, icon: '🍋' },
    { id: 'biz_stand', name: 'דוכן פיצוחים', price: 15000, passive: 120, icon: '🥜' },
    { id: 'biz_kiosk', name: 'קיוסק שכונתי', price: 45000, passive: 380, icon: '🏪' },
    { id: 'biz_falafel', name: 'דוכן פלאפל', price: 85000, passive: 750, icon: '🥙' },
    { id: 'biz_cafe', name: 'בית קפה', price: 250000, passive: 2400, icon: '☕' },
    { id: 'biz_garage', name: 'מוסך רכב', price: 650000, passive: 6800, icon: '🔧' },
    { id: 'biz_hall', name: 'אולם אירועים', price: 2200000, passive: 26000, icon: '🎊' },
    { id: 'biz_tech', name: 'חברת הייטק', price: 12000000, passive: 180000, icon: '🚀' }
];

const stockList = [
    { id: 'AAPL', name: 'Apple', price: 580, trend: 0 },
    { id: 'TSLA', name: 'Tesla', price: 920, trend: 0 },
    { id: 'NVDA', name: 'Nvidia', price: 420, trend: 0 },
    { id: 'BTC',  name: 'Bitcoin', price: 65000, trend: 0 },
    { id: 'ELAL', name: 'אל-על', price: 12, trend: 0 }
];

const shopItems = [
    { id: 's1', name: 'חולצת טי פשוטה', price: 150, xp: 25, icon: '👕' },
    { id: 's2', name: 'ג’ינס אופנתי', price: 450, xp: 70, icon: '👖' },
    { id: 's3', name: 'נעלי ספורט', price: 850, xp: 130, icon: '👟' },
    { id: 's4', name: 'ז’קט עור', price: 2200, xp: 350, icon: '🧥' },
    { id: 's5', name: 'שעון חכם', price: 3500, xp: 550, icon: '⌚' },
    { id: 's6', name: 'משקפי שמש יוקרתיים', price: 1800, xp: 280, icon: '🕶️' },
    { id: 's7', name: 'חליפת עסקים', price: 6000, xp: 1000, icon: '👔' },
    { id: 's8', name: 'תיק מעצבים', price: 12000, xp: 2000, icon: '👜' },
    { id: 's9', name: 'טבעת יהלום', price: 45000, xp: 8000, icon: '💎' },
    { id: 's10', name: 'שעון רולקס זהב', price: 85000, xp: 15000, icon: '👑' }
];

const skillList = [
    { name: 'רישיון נשק', price: 4500, icon: '🔫' },
    { name: 'תכנות', price: 10000, icon: '📜' },
    { name: 'רישיון משאית', price: 12000, icon: '🚛' },
    { name: 'קורס פיקודי', price: 14500, icon: '🎖️' },
    { name: 'ניהול רשת', price: 22000, icon: '🧠' },
    { name: 'שיווק דיגיטלי', price: 28000, icon: '📢' },
    { name: 'ניהול טכנולוגי', price: 45000, icon: '🚀' },
    { name: 'תואר בכלכלה', price: 120000, icon: '🎓' }
];

const carList = [
    { name: 'קורקינט', price: 3000, speed: 1.2, icon: '🛴' },
    { name: 'אופנוע', price: 16000, speed: 1.6, icon: '🛵' },
    { name: 'סקודה', price: 90000, speed: 2.3, icon: '🚗' },
    { name: 'ג’יפ מרצדס', price: 450000, speed: 3.8, icon: '🚙' },
    { name: 'טסלה S', price: 280000, speed: 4.5, icon: '⚡' },
    { name: 'משאית וולוו', price: 550000, speed: 1.8, icon: '🚛' },
    { name: 'פרארי', price: 1800000, speed: 8, icon: '🏎️' },
    { name: 'מטוס פרטי', price: 15000000, speed: 25, icon: '🛩️' }
];

// --- אתחול משתנים ---
if (window.bankTaxRate === undefined) window.bankTaxRate = 0.01;

// --- מנוע בורסה ---
setInterval(() => {
    stockList.forEach(s => {
        const change = (Math.random() * 0.05) - 0.024;
        s.price *= (1 + change);
        if (s.price < 1) s.price = 1;
        s.trend = change;
    });
    if (typeof currentTab !== 'undefined' && currentTab === 'invest') {
        const content = document.getElementById('content');
        if (content) window.drawInvest(content);
    }
}, 4000);

// --- פונקציות עבודה ---
window.drawWork = function(c) {
    let html = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-2">`;
    jobList.forEach(j => {
        const hasSkill = !j.req || window.skills.includes(j.req);
        const hasCar = !j.reqCar || window.cars.length > 0;
        const canWork = hasSkill && hasCar;

        html += `
            <div class="card fade-in" style="text-align:center; opacity:${canWork ? 1 : 0.6}; border-top: 3px solid ${canWork ? 'var(--blue)' : '#444'}">
                <div style="font-size:26px; margin-bottom:5px;">${j.icon}</div>
                <div style="font-weight:bold; font-size:13px; min-height:32px;">${j.name} ${j.req ? `<br><small style="color:var(--red);font-size:9px;">דרוש: ${j.req}</small>` : ''}</div>
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

window.startWork = function(id) {
    const j = jobList.find(x => x.id === id);
    if (!j) return;
    const btn = document.getElementById(`job-${j.id}`);
    const container = document.getElementById(`prog-cont-${j.id}`);
    const bar = document.getElementById(`bar-${j.id}`);
    const actualTime = j.time / (window.carSpeed || 1);

    if(btn) btn.disabled = true;
    if(container) container.style.display = "block";
    setTimeout(() => { if(bar) { bar.style.transition = `width ${actualTime}ms linear`; bar.style.width = "100%"; } }, 50);

    setTimeout(() => {
        const jobLevel = parseInt(j.id.replace('j', ''));
        const passivePercent = 0.30 + (jobLevel - 1) * (0.20 / (jobList.length - 1));
        const passiveAdd = j.pay * passivePercent;

        window.money += j.pay;
        window.lifeXP += j.xp;
        window.passive += passiveAdd; 

        if(typeof showMsg === 'function') showMsg(`💰 +${j.pay}₪ | ✨ +${j.xp} XP | 🚀 פסיבי: +${passiveAdd.toFixed(1)}`, "var(--green)");
        if(btn) btn.disabled = false;
        if(container) container.style.display = "none";
        if(bar) { bar.style.transition = "none"; bar.style.width = "0%"; }
        updateUI(); saveGame();
    }, actualTime);
}

// --- נדל"ן ---
window.drawEstate = function(c) {
    let html = `<h3>🏠 השקעות נדל"ן</h3><div class="grid-2">`;
    estateList.forEach(e => {
        const count = window.inventory.filter(item => item === e.name).length;
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

window.buyEstate = function(id) {
    const e = estateList.find(x => x.id === id);
    if (window.money >= e.price) {
        window.money -= e.price; window.passive += e.passive; window.inventory.push(e.name);
        showMsg(`🏠 תתחדש! רכשת ${e.name}`, "var(--green)");
        saveGame(); updateUI(); drawEstate(document.getElementById('content'));
    } else { showMsg("אין מספיק כסף!", "var(--red)"); }
}

// --- עסקים ---
window.drawBusiness = function(c) {
    let html = `<h3>💼 אימפריית עסקים</h3><div class="grid-1">`;
    businessList.forEach(b => {
        const level = window.inventory.filter(item => item === b.id).length;
        const currentPrice = b.price * (level + 1);
        const currentPassive = b.passive * level;
        html += `
            <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center; border-left: 4px solid ${level > 0 ? 'var(--purple)' : '#444'}">
                <div style="display:flex; align-items:center; gap:15px;">
                    <div style="font-size:35px;">${b.icon}</div>
                    <div>
                        <div style="font-weight:bold;">${b.name} ${level > 0 ? `<span style="color:var(--purple)">[רמה ${level}]</span>` : ''}</div>
                        <div style="font-size:12px; color:var(--green);">פסיבי: ${currentPassive.toLocaleString()}₪ / שעה</div>
                    </div>
                </div>
                <button class="sys-btn" style="min-width:120px;" onclick="buyBusiness('${b.id}', ${currentPrice}, ${b.passive})">
                    ${level === 0 ? `הקם: ${currentPrice.toLocaleString()}₪` : `שדרג: ${currentPrice.toLocaleString()}₪`}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buyBusiness = function(id, price, passAdd) {
    if (window.money >= price) {
        window.money -= price; window.passive += passAdd; window.inventory.push(id); 
        showMsg("💼 עסק שודרג/הוקם!", "var(--purple)");
        saveGame(); updateUI(); drawBusiness(document.getElementById('content'));
    } else { showMsg("אין מספיק כסף!", "var(--red)"); }
}

// --- בנק משודרג ---
window.drawBank = function(c) {
    const tax = (window.bankTaxRate * 100).toFixed(1);
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center;">
            <h3>🏦 בנק הפועלים - ניהול חכם</h3>
            <div class="grid-2" style="margin-bottom:15px;">
                <div class="card" style="background:rgba(0,0,0,0.2);"><small>בבנק</small><h4 style="color:var(--blue);">${window.bank.toLocaleString()}₪</h4></div>
                <div class="card" style="background:rgba(0,0,0,0.2);"><small>חוב</small><h4 style="color:var(--red);">${window.loan.toLocaleString()}₪</h4></div>
            </div>
            <input type="number" id="bank-input" placeholder="הכנס סכום..." style="width:90%; padding:10px; margin-bottom:10px; text-align:center; background:#000; color:#fff; border:1px solid #333; border-radius:5px;">
            <div class="grid-2" style="gap:10px;">
                <button class="sys-btn" style="background:#2563eb;" onclick="bankAction('deposit')">הפקד</button>
                <button class="sys-btn" style="background:#a855f7;" onclick="bankAction('withdraw')">משוך</button>
            </div>
            <button class="sys-btn" style="width:100%; margin-top:10px; background:var(--green);" onclick="repayLoanFromBank()">החזר חוב מהבנק (סגירת הלוואה)</button>
            <button class="action" style="width:100%; margin-top:10px; background:#451a1a;" onclick="takeLoan()">בקש הלוואה (50,000₪)</button>
            <div style="font-size:10px; opacity:0.5; margin-top:10px;">עמלת פעולה נוכחית: ${tax}%</div>
        </div>
    `;
}

window.bankAction = function(type) {
    const amt = parseInt(document.getElementById('bank-input').value);
    if (!amt || amt <= 0) return showMsg("הכנס סכום תקין", "var(--red)");
    const tax = amt * window.bankTaxRate;
    
    if (type === 'deposit') {
        if (window.money >= (amt + tax)) {
            window.money -= (amt + tax); window.bank += amt;
            showMsg(`💰 הפקדת ${amt.toLocaleString()}₪`, "var(--blue)");
            if (window.bankTaxRate < 0.05) window.bankTaxRate += 0.005;
        } else showMsg("אין מספיק מזומן!", "var(--red)");
    } else {
        if (window.bank >= amt) {
            window.bank -= amt; window.money += (amt - tax);
            showMsg(`💵 משכת ${amt.toLocaleString()}₪`, "#a855f7");
            if (window.bankTaxRate < 0.05) window.bankTaxRate += 0.005;
        } else showMsg("אין מספיק בבנק!", "var(--red)");
    }
    updateUI(); drawBank(document.getElementById('content')); saveGame();
}

window.repayLoanFromBank = function() {
    if (window.loan <= 0) return showMsg("אין חובות פעילים", "var(--green)");
    const amountToPay = Math.min(window.loan, window.bank);
    window.bank -= amountToPay; window.loan -= amountToPay;
    showMsg(`✅ הוחזרו ${amountToPay.toLocaleString()}₪ מהחוב`, "var(--green)");
    updateUI(); drawBank(document.getElementById('content')); saveGame();
}

window.takeLoan = function() {
    window.loan += 50000; window.money += 50000;
    showMsg("🏦 קיבלת הלוואה!", "var(--yellow)");
    updateUI(); drawBank(document.getElementById('content')); saveGame();
}

// --- בורסה, חנות, קזינו, כישורים, רכבים (כפי שהיו ב-6.9.0) ---
window.drawInvest = function(c) {
    let html = `<h3 class="fade-in">📈 בורסה חיה</h3><div class="grid-1">`;
    stockList.forEach(s => {
        const owned = window.invOwned[s.id] || 0;
        const color = s.trend >= 0 ? 'var(--green)' : 'var(--red)';
        html += `
            <div class="card" style="display:flex; justify-content:space-between; align-items:center; border-right: 4px solid ${color}">
                <div><b>${s.name}</b><br><small>בבעלותך: ${owned}</small></div>
                <div style="color:${color}; font-weight:bold;">${s.price.toFixed(2)}₪</div>
                <div style="display:flex; gap:5px;">
                    <button class="sys-btn" onclick="buyStock('${s.id}')">קנה</button>
                    <button class="sys-btn" onclick="sellStock('${s.id}')">מכור</button>
                </div>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buyStock = function(id) {
    const s = stockList.find(x => x.id === id);
    if (window.money >= s.price) {
        window.money -= s.price; window.invOwned[id] = (window.invOwned[id] || 0) + 1;
        updateUI(); drawInvest(document.getElementById('content')); saveGame();
    }
}

window.sellStock = function(id) {
    if (window.invOwned[id] > 0) {
        const s = stockList.find(x => x.id === id);
        window.money += s.price; window.invOwned[id] -= 1;
        updateUI(); drawInvest(document.getElementById('content')); saveGame();
    }
}

window.drawShop = function(c) {
    let html = `<h3>🛒 חנות מותגים</h3><div class="grid-2">`;
    shopItems.forEach(item => {
        const has = window.inventory.includes(item.name);
        html += `
            <div class="card" style="text-align:center;">
                <div style="font-size:35px;">${item.icon}</div>
                <div style="font-size:12px; font-weight:bold;">${item.name}</div>
                <button class="sys-btn" style="width:100%; margin-top:10px;" onclick="buyShopItem('${item.id}')" ${has ? 'disabled' : ''}>
                    ${has ? 'בבעלותך' : item.price.toLocaleString() + '₪'}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buyShopItem = function(id) {
    const item = shopItems.find(x => x.id === id);
    if (window.money >= item.price) {
        window.money -= item.price; window.lifeXP += item.xp; window.inventory.push(item.name);
        showMsg("👜 תתחדש!", "var(--purple)");
        updateUI(); drawShop(document.getElementById('content')); saveGame();
    }
}

window.drawTasks = function(c) {
    c.innerHTML = `
        <div class="card" style="text-align:center;">
            <div style="font-size:50px;">🎰</div>
            <h3>Casino</h3>
            <input type="number" id="gamble-amt" placeholder="סכום הימור..." style="width:80%; padding:10px; margin-bottom:10px; background:#000; color:#fff; border:1px solid #333;">
            <div id="casino-anim" style="height:20px; font-size:12px; margin-bottom:10px;"></div>
            <button class="action" onclick="playCasino()">המר!</button>
        </div>`;
}

window.playCasino = function() {
    const amt = parseInt(document.getElementById('gamble-amt').value);
    if(!amt || amt > window.money) return showMsg("אין מספיק כסף", "var(--red)");
    window.money -= amt; updateUI();
    document.getElementById('casino-anim').innerText = "🎲 מסובב...";
    setTimeout(() => {
        if(Math.random() > 0.55) {
            window.money += amt * 2; showMsg("💎 זכייה!", "var(--yellow)");
        } else { showMsg("💀 הפסדת", "var(--red)"); }
        updateUI(); saveGame(); drawTasks(document.getElementById('content'));
    }, 800);
}

window.drawSkills = function(c) {
    let html = `<h3>🎓 כישורים</h3><div class="grid-2">`;
    skillList.forEach(s => {
        const has = window.skills.includes(s.name);
        html += `<div class="card" style="text-align:center;"><div>${s.icon}</div><div>${s.name}</div>
        <button class="sys-btn" onclick="buySkill('${s.name}', ${s.price})" ${has ? 'disabled' : ''}>${has ? '✅' : s.price+'₪'}</button></div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buySkill = function(name, price) { if (window.money >= price) { window.money -= price; window.skills.push(name); updateUI(); drawSkills(document.getElementById('content')); saveGame(); } }

window.drawCars = function(c) {
    let html = `<h3>🏎️ רכבים</h3><div class="grid-2">`;
    carList.forEach(car => {
        const has = window.cars.includes(car.name);
        html += `<div class="card" style="text-align:center;"><div>${car.icon}</div><div>${car.name}</div>
        <button class="sys-btn" onclick="buyCar('${car.name}', ${car.price}, ${car.speed})" ${has ? 'disabled' : ''}>${has ? '🏎️' : car.price+'₪'}</button></div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buyCar = function(name, price, speed) { if (window.money >= price) { window.money -= price; window.cars.push(name); window.carSpeed = speed; updateUI(); drawCars(document.getElementById('content')); saveGame(); } }
