/* Smart Money Pro - js/activities.js - v7.5.0 - Full Sync & Advanced Bank */

// --- מאגרי נתונים (נתוני בסיס מהקובץ שלך) ---
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
    { id: 'e2', name: 'חניה במרכז', price: 45000, passive: 350, icon: '🅿️' },
    { id: 'e3', name: 'דירת סטודיו', price: 150000, passive: 950, icon: '🏠' },
    { id: 'e4', name: 'דירת 4 חדרים', price: 320000, passive: 2100, icon: '🏡' },
    { id: 'e5', name: 'חנות ברחוב', price: 450000, passive: 3200, icon: '🏪' },
    { id: 'e6', name: 'וילה עם בריכה', price: 1200000, passive: 8500, icon: '🏰' },
    { id: 'e7', name: 'בניין מגורים', price: 2500000, passive: 18500, icon: '🏢' },
    { id: 'e8', name: 'מרכז מסחרי', price: 12000000, passive: 95000, icon: '🏗️' }
];

const businessList = [
    { id: 'biz_gum', name: 'מכונת מסטיקים', price: 1200, passive: 30, icon: '🍬' },
    { id: 'biz_lemon', name: 'דוכן לימונדה', price: 4500, passive: 90, icon: '🍋' },
    { id: 'biz_hotdog', name: 'דוכן נקניקיות', price: 9000, passive: 180, icon: '🌭' },
    { id: 'biz_stand', name: 'דוכן פיצוחים', price: 15000, passive: 160, icon: '🥜' },
    { id: 'biz_kiosk', name: 'קיוסק שכונתי', price: 45000, passive: 560, icon: '🏪' },
    { id: 'biz_falafel', name: 'דוכן פלאפל', price: 85000, passive: 1300, icon: '🥙' },
    { id: 'biz_cafe', name: 'בית קפה', price: 250000, passive: 4200, icon: '☕' },
    { id: 'biz_garage', name: 'מוסך רכב', price: 650000, passive: 11600, icon: '🔧' },
    { id: 'biz_hall', name: 'אולם אירועים', price: 2200000, passive: 48000, icon: '🎊' },
    { id: 'biz_tech', name: 'חברת הייטק', price: 12000000, passive: 300000, icon: '🚀' }
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

// --- אתחול ומנוע בורסה ---
if (window.bankTaxRate === undefined) window.bankTaxRate = 0.01;

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

// --- דף הבית (Home): תצוגת אייקונים קטנים של חפצים, רכבים וכישורים ---
window.drawHome = function(c) {
    const itemIcons = shopItems.filter(si => window.inventory.includes(si.name))
        .map(si => `<span title="${si.name}" style="font-size:22px;">${si.icon}</span>`).join(' ');

    const carIcons = carList.filter(car => window.cars.includes(car.name))
        .map(car => `<span title="${car.name}" style="font-size:22px;">${car.icon}</span>`).join(' ');

    const skillIcons = skillList.filter(sk => window.skills.includes(sk.name))
        .map(sk => `<span title="${sk.name}" style="font-size:22px;">${sk.icon}</span>`).join(' ');

    c.innerHTML = `
        <div class="fade-in">
            <h3>🏠 הבית שלי</h3>
            <div class="card" style="margin-bottom:12px;">
                <div style="font-weight:bold; color:var(--purple); font-size:12px; margin-bottom:8px; border-bottom:1px solid #333;">📦 חפצים מהחנות</div>
                <div style="display:flex; flex-wrap:wrap; gap:8px;">${itemIcons || '<small style="opacity:0.4;">אין חפצים</small>'}</div>
            </div>
            <div class="card" style="margin-bottom:12px;">
                <div style="font-weight:bold; color:var(--blue); font-size:12px; margin-bottom:8px; border-bottom:1px solid #333;">🏎️ כלי רכב</div>
                <div style="display:flex; flex-wrap:wrap; gap:8px;">${carIcons || '<small style="opacity:0.4;">אין רכבים</small>'}</div>
            </div>
            <div class="card">
                <div style="font-weight:bold; color:var(--green); font-size:12px; margin-bottom:8px; border-bottom:1px solid #333;">🎓 כישורים</div>
                <div style="display:flex; flex-wrap:wrap; gap:8px;">${skillIcons || '<small style="opacity:0.4;">אין כישורים</small>'}</div>
            </div>
        </div>
    `;
}

// --- בנק (Bank): הפקדה/משיכה בסכום חופשי + החזר הלוואה ---
window.drawBank = function(c) {
    const currentTaxPercent = (window.bankTaxRate * 100).toFixed(1);
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center; border-top: 4px solid var(--blue);">
            <h3>🏦 בנק הפועלים</h3>
            <div class="grid-2" style="margin-bottom:15px;">
                <div class="card" style="background:rgba(0,0,0,0.2);"><small>יתרה</small><h4 style="color:var(--blue);">${window.bank.toLocaleString()}₪</h4></div>
                <div class="card" style="background:rgba(0,0,0,0.2);"><small>חוב</small><h4 style="color:var(--red);">${window.loan.toLocaleString()}₪</h4></div>
            </div>
            <div style="background:rgba(255,255,255,0.05); padding:12px; border-radius:8px; margin-bottom:15px;">
                <input type="number" id="bank-amt" placeholder="סכום להזנה..." style="width:100%; padding:10px; margin-bottom:10px; text-align:center; background:#000; color:#fff; border:1px solid #333; border-radius:5px;">
                <div class="grid-2" style="gap:10px;">
                    <button class="sys-btn" style="background:#2563eb;" onclick="handleBank('deposit')">הפקד</button>
                    <button class="sys-btn" style="background:#a855f7;" onclick="handleBank('withdraw')">משוך</button>
                </div>
                <small style="display:block; margin-top:5px; opacity:0.6;">עמלה: ${currentTaxPercent}%</small>
            </div>
            <button class="action" style="background:#451a1a; width:100%;" onclick="repayLoan()">החזר הלוואה מהמזומן</button>
            <button class="action" style="background:#1e293b; width:100%; margin-top:8px;" onclick="takeLoan()">קח הלוואה (50,000₪)</button>
        </div>
    `;
}

window.handleBank = function(type) {
    const amt = parseInt(document.getElementById('bank-amt').value);
    if (!amt || amt <= 0) return showMsg("נא להזין סכום", "var(--red)");
    const tax = amt * window.bankTaxRate;
    if (type === 'deposit') {
        if (window.money >= (amt + tax)) {
            window.money -= (amt + tax); window.bank += amt;
            showMsg(`💰 הופקד: ${amt}₪`, "var(--blue)");
        } else { return showMsg("אין מספיק מזומן!", "var(--red)"); }
    } else {
        if (window.bank >= amt) {
            window.bank -= amt; window.money += (amt - tax);
            showMsg(`💵 נמשך: ${amt}₪`, "#a855f7");
        } else { return showMsg("אין מספיק בבנק!", "var(--red)"); }
    }
    if (window.bankTaxRate < 0.05) window.bankTaxRate += 0.002;
    saveGame(); updateUI(); drawBank(document.getElementById('content'));
}

window.repayLoan = function() {
    if (window.loan <= 0) return showMsg("אין חוב", "var(--green)");
    const pay = Math.min(window.money, window.loan);
    if (pay > 0) {
        window.money -= pay; window.loan -= pay;
        showMsg(`✅ הוחזר: ${pay.toLocaleString()}₪`, "var(--green)");
        saveGame(); updateUI(); drawBank(document.getElementById('content'));
    } else { showMsg("אין לך מזומן!", "var(--red)"); }
}

window.takeLoan = function() {
    window.loan += 50000; window.money += 50000;
    showMsg("🏦 קיבלת הלוואה!", "var(--yellow)");
    saveGame(); updateUI(); drawBank(document.getElementById('content'));
}

// --- שאר הפונקציות מהקובץ המקור (עבודה, נדל"ן, בורסה, חנות וכו') ---
window.drawWork = function(c) {
    let html = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-2">`;
    jobList.forEach(j => {
        const hasSkill = !j.req || window.skills.includes(j.req);
        const hasCar = !j.reqCar || window.cars.length > 0;
        const canWork = hasSkill && hasCar;
        html += `<div class="card fade-in" style="text-align:center; opacity:${canWork ? 1 : 0.6}; border-top: 3px solid ${canWork ? 'var(--blue)' : '#444'}">
            <div style="font-size:26px;">${j.icon}</div>
            <div style="font-weight:bold; font-size:13px;">${j.name}</div>
            <div style="color:var(--green); font-size:11px; margin-bottom:5px;">${j.pay.toLocaleString()}₪</div>
            <div id="prog-cont-${j.id}" style="display:none; width:100%; background:#1e293b; height:6px; border-radius:3px; margin-bottom:10px; overflow:hidden;">
                <div id="bar-${j.id}" style="width:0%; height:100%; background:var(--blue);"></div>
            </div>
            <button class="sys-btn" style="width:100%;" onclick="startWork('${j.id}')" ${canWork ? '' : 'disabled'}>${canWork ? 'בצע' : 'נעול'}</button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.startWork = function(id) {
    const j = jobList.find(x => x.id === id);
    const actualTime = j.time / (window.carSpeed || 1);
    document.getElementById(`prog-cont-${j.id}`).style.display = "block";
    const bar = document.getElementById(`bar-${j.id}`);
    bar.style.transition = `width ${actualTime}ms linear`;
    setTimeout(() => bar.style.width = "100%", 50);
    setTimeout(() => {
        window.money += j.pay; window.lifeXP += j.xp; window.passive += (j.pay * 0.3);
        showMsg(`💰 +${j.pay}₪`, "var(--green)");
        updateUI(); saveGame(); drawWork(document.getElementById('content'));
    }, actualTime);
}

window.drawEstate = function(c) {
    let html = `<h3>🏠 השקעות נדל"ן</h3><div class="grid-2">`;
    estateList.forEach(e => {
        const count = window.inventory.filter(item => item === e.name).length;
        html += `<div class="card" style="text-align:center;">
            <div style="font-size:30px;">${e.icon}</div>
            <div style="font-size:12px; font-weight:bold;">${e.name}</div>
            <div style="color:var(--green); font-size:10px;">+${e.passive}₪</div>
            <button class="sys-btn" style="width:100%;" onclick="buyEstate('${e.id}')">${e.price.toLocaleString()}₪</button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buyEstate = function(id) {
    const e = estateList.find(x => x.id === id);
    if (window.money >= e.price) {
        window.money -= e.price; window.passive += e.passive; window.inventory.push(e.name);
        showMsg("🏠 תתחדש!", "var(--green)");
        saveGame(); updateUI(); drawEstate(document.getElementById('content'));
    }
}

window.drawBusiness = function(c) {
    let html = `<h3>💼 אימפריית עסקים</h3><div class="grid-2">`;
    businessList.forEach(b => {
        const level = window.inventory.filter(item => item === b.id).length;
        const price = b.price * (level + 1);
        html += `<div class="card" style="text-align:center; border-top: 3px solid ${level > 0 ? 'var(--purple)' : '#444'}">
            <div style="font-size:30px;">${b.icon}</div>
            <div style="font-weight:bold; font-size:13px;">${b.name}</div>
            <div style="color:var(--green); font-size:10px;">פסיבי: ${(b.passive * level).toLocaleString()}₪</div>
            <button class="sys-btn" style="width:100%;" onclick="buyBusiness('${b.id}', ${price}, ${b.passive})">${price.toLocaleString()}₪</button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buyBusiness = function(id, price, pass) {
    if (window.money >= price) {
        window.money -= price; window.passive += pass; window.inventory.push(id);
        saveGame(); updateUI(); drawBusiness(document.getElementById('content'));
    }
}

window.drawInvest = function(c) {
    let html = `<h3>📈 בורסה</h3><div class="grid-2">`;
    stockList.forEach(s => {
        const owned = window.invOwned[s.id] || 0;
        const color = s.trend >= 0 ? 'var(--green)' : 'var(--red)';
        html += `<div class="card" style="text-align:center; border-bottom: 2px solid ${color}">
            <div style="font-weight:bold; font-size:12px;">${s.name}</div>
            <div style="color:${color}; font-weight:bold;">${s.price.toFixed(2)}₪</div>
            <div style="display:flex; gap:5px; margin-top:5px;">
                <button class="sys-btn" style="flex:1;" onclick="buyStock('${s.id}')">קנה</button>
                <button class="sys-btn" style="flex:1;" onclick="sellStock('${s.id}')">מכור</button>
            </div>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buyStock = function(id) {
    const s = stockList.find(x => x.id === id);
    if (window.money >= s.price) {
        window.money -= s.price; window.invOwned[id] = (window.invOwned[id] || 0) + 1;
        saveGame(); updateUI(); drawInvest(document.getElementById('content'));
    }
}

window.sellStock = function(id) {
    const s = stockList.find(x => x.id === id);
    if (window.invOwned[id] > 0) {
        window.money += s.price; window.invOwned[id] -= 1;
        saveGame(); updateUI(); drawInvest(document.getElementById('content'));
    }
}

window.drawShop = function(c) {
    let html = `<h3>🛒 חנות</h3><div class="grid-2">`;
    shopItems.forEach(item => {
        const has = window.inventory.includes(item.name);
        html += `<div class="card" style="text-align:center;">
            <div style="font-size:30px;">${item.icon}</div>
            <div style="font-size:12px;">${item.name}</div>
            <button class="sys-btn" onclick="buyShopItem('${item.id}')" ${has ? 'disabled' : ''}>${has ? '✅' : item.price+'₪'}</button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buyShopItem = function(id) {
    const item = shopItems.find(x => x.id === id);
    if (window.money >= item.price) {
        window.money -= item.price; window.lifeXP += item.xp; window.inventory.push(item.name);
        saveGame(); updateUI(); drawShop(document.getElementById('content'));
    }
}

window.drawSkills = function(c) {
    let html = `<h3>🎓 כישורים</h3><div class="grid-2">`;
    skillList.forEach(s => {
        const has = window.skills.includes(s.name);
        html += `<div class="card" style="text-align:center;"><div>${s.icon} ${s.name}</div>
        <button class="sys-btn" onclick="buySkill('${s.name}', ${s.price})" ${has ? 'disabled' : ''}>${has ? '✅' : s.price+'₪'}</button></div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buySkill = function(n, p) {
    if (window.money >= p) { window.money -= p; window.skills.push(n); saveGame(); updateUI(); drawSkills(document.getElementById('content')); }
}

window.drawCars = function(c) {
    let html = `<h3>🏎️ רכבים</h3><div class="grid-2">`;
    carList.forEach(car => {
        const has = window.cars.includes(car.name);
        html += `<div class="card" style="text-align:center;"><div>${car.icon} ${car.name}</div>
        <button class="sys-btn" onclick="buyCar('${car.name}', ${car.price}, ${car.speed})" ${has ? 'disabled' : ''}>${has ? 'בבעלותך' : car.price+'₪'}</button></div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buyCar = function(n, p, s) {
    if (window.money >= p) { window.money -= p; window.cars.push(n); window.carSpeed = s; saveGame(); updateUI(); drawCars(document.getElementById('content')); }
}

window.drawTasks = function(c) {
    c.innerHTML = `<div class="card" style="text-align:center;"><h3>🎰 קזינו</h3><button class="action" onclick="playCasino()">להמר על 1,000₪</button></div>`;
}

window.playCasino = function() {
    if(window.money >= 1000) {
        window.money -= 1000;
        if(Math.random() > 0.6) { window.money += 3000; showMsg("זכייה!", "var(--yellow)"); }
        else { showMsg("הפסד", "var(--red)"); }
        updateUI(); saveGame();
    }
}
