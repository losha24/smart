/* Smart Money Pro - js/activities.js - v7.5.8 - Full Restore & New Dashboard */

// --- 1. מאגרי נתונים מלאים ---
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

// --- 2. מנוע בורסה חי ---
setInterval(() => {
    stockList.forEach(s => {
        const change = (Math.random() * 0.05) - 0.024;
        s.price *= (1 + change);
        if (s.price < 1) s.price = 1;
        s.trend = change;
    });
}, 4000);

// --- 3. דף הבית (העיצוב החדש והנקי) ---
window.drawHome = function(c) {
    const totalAssets = (window.money || 0) + (window.bank || 0) - (window.loan || 0);
    c.innerHTML = `
        <div class="fade-in">
            <h3 style="margin-bottom:15px; text-align:center;">🏠 מרכז שליטה אישי</h3>
            
            <div class="card" style="padding:20px; border-top: 4px solid var(--blue); margin-bottom:15px; text-align:center;">
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                    <div>
                        <small style="opacity:0.6; display:block; font-size:10px;">הון נטו</small>
                        <b style="font-size:16px; color:${totalAssets >= 0 ? 'var(--green)' : 'var(--red)'}">${totalAssets.toLocaleString()} ₪</b>
                    </div>
                    <div>
                        <small style="opacity:0.6; display:block; font-size:10px;">הכנסה פסיבית</small>
                        <b style="font-size:16px; color:var(--purple);">${(window.passive || 0).toLocaleString()} ₪/שעה</b>
                    </div>
                </div>
                <hr style="border:0; border-top:1px solid rgba(255,255,255,0.05); margin:15px 0;">
                <div style="display:flex; justify-content:space-around;">
                    <span>🏎️ ${(window.cars || []).length}</span>
                    <span>🎓 ${(window.skills || []).length}</span>
                    <span>👜 ${(window.inventory || []).filter(i => shopItems.some(s => s.id === i)).length}</span>
                </div>
            </div>

            <div class="card" style="background:rgba(255,255,255,0.02); padding:12px;">
                <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:5px;">
                    <span>רמת XP</span>
                    <span style="color:var(--yellow); font-weight:bold;">${window.lifeXP || 0}</span>
                </div>
                <div style="width:100%; height:6px; background:#1e293b; border-radius:3px; overflow:hidden;">
                    <div style="width:${Math.min(100, ((window.lifeXP || 0) % 1000) / 10)}%; height:100%; background:var(--yellow);"></div>
                </div>
            </div>
        </div>
    `;
}

// --- 4. מנוע עבודה ---
window.drawWork = function(c) {
    let html = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-2">`;
    jobList.forEach(j => {
        const hasSkill = !j.req || window.skills.includes(j.req);
        const hasCar = !j.reqCar || window.cars.length > 0;
        const canWork = hasSkill && hasCar;
        html += `
            <div class="card fade-in" style="text-align:center; opacity:${canWork ? 1 : 0.6};">
                <div style="font-size:26px;">${j.icon}</div>
                <div style="font-weight:bold; font-size:13px; height:32px;">${j.name}</div>
                <div style="color:var(--green); font-size:12px; margin-bottom:8px;">${j.pay.toLocaleString()}₪</div>
                <div id="prog-cont-${j.id}" style="display:none; width:100%; background:#1e293b; height:6px; border-radius:3px; margin-bottom:10px; overflow:hidden;">
                    <div id="bar-${j.id}" style="width:0%; height:100%; background:var(--blue); transition: width linear;"></div>
                </div>
                <button class="sys-btn" id="job-${j.id}" style="width:100%;" onclick="startWork('${j.id}')" ${canWork ? '' : 'disabled'}>
                    ${canWork ? 'עבוד' : 'נעול'}
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
        const passiveAdd = (j.pay * 0.3);
        window.money += j.pay; window.lifeXP += j.xp; window.passive += passiveAdd;
        showMsg(`💰 +${j.pay}₪ | 🚀 פסיבי: +${passiveAdd.toFixed(1)}₪`, "var(--green)");
        if(btn) btn.disabled = false;
        if(container) container.style.display = "none";
        if(bar) { bar.style.transition = "none"; bar.style.width = "0%"; }
        updateUI(); saveGame();
    }, actualTime);
}

// --- 5. נדל"ן ועסקים (הוחזרו!) ---
window.drawEstate = function(c) {
    let html = `<h3>🏠 נדל"ן</h3><div class="grid-2">`;
    estateList.forEach(e => {
        const count = window.inventory.filter(item => item === e.name).length;
        html += `<div class="card" style="text-align:center;">
            <div style="font-size:30px;">${e.icon}</div>
            <div style="font-size:12px;">${e.name}</div>
            <div style="color:var(--green); font-size:10px;">+${e.passive}₪/ש</div>
            <button class="sys-btn" onclick="buyEstate('${e.id}')">${e.price.toLocaleString()}₪</button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buyEstate = function(id) {
    const e = estateList.find(x => x.id === id);
    if (window.money >= e.price) {
        window.money -= e.price; window.passive += e.passive; window.inventory.push(e.name);
        saveGame(); updateUI(); drawEstate(document.getElementById('content'));
    }
}

window.drawBusiness = function(c) {
    let html = `<h3>💼 עסקים</h3><div class="grid-2">`;
    businessList.forEach(b => {
        const level = window.inventory.filter(item => item === b.id).length;
        const price = b.price * (level + 1);
        html += `<div class="card" style="text-align:center;">
            <div style="font-size:30px;">${b.icon}</div>
            <div style="font-size:12px;">${b.name} (${level})</div>
            <button class="sys-btn" onclick="buyBusiness('${b.id}', ${price}, ${b.passive})">${price.toLocaleString()}₪</button>
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

// --- 6. בנק ובורסה ---
window.drawBank = function(c) {
    c.innerHTML = `<h3>🏦 בנק</h3>
    <div class="card" style="text-align:center; margin-bottom:15px;">
        <small>יתרה</small><h2>${window.bank.toLocaleString()} ₪</h2>
    </div>
    <input type="number" id="bank-amt" style="width:100%; padding:10px; margin-bottom:10px; text-align:center;">
    <div style="display:flex; gap:10px;">
        <button class="sys-btn" style="flex:1;" onclick="bankProcess('deposit')">הפקדה</button>
        <button class="sys-btn" style="flex:1;" onclick="bankProcess('withdraw')">משיכה</button>
    </div>`;
}

window.bankProcess = function(mode) {
    const val = parseInt(document.getElementById('bank-amt').value);
    if(!val || val <= 0) return;
    if(mode === 'deposit' && window.money >= val) { window.money -= val; window.bank += val; }
    else if(mode === 'withdraw' && window.bank >= val) { window.bank -= val; window.money += val; }
    saveGame(); updateUI(); drawBank(document.getElementById('content'));
}

window.drawInvest = function(c) {
    let html = `<h3>📈 בורסה</h3><div class="grid-2">`;
    stockList.forEach(s => {
        const owned = window.invOwned[s.id] || 0;
        html += `<div class="card" style="text-align:center;">
            <b>${s.name}</b><div style="color:${s.trend>=0?'var(--green)':'var(--red)'}">${s.price.toFixed(2)}₪</div>
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
    if (window.invOwned[id] > 0) {
        const s = stockList.find(x => x.id === id);
        window.money += s.price; window.invOwned[id] -= 1;
        saveGame(); updateUI(); drawInvest(document.getElementById('content'));
    }
}

// --- 7. חנות, כישורים ורכבים ---
window.drawShop = function(c) {
    let html = `<h3>🛒 חנות</h3><div class="grid-2">`;
    shopItems.forEach(item => {
        const has = window.inventory.includes(item.id);
        html += `<div class="card" style="text-align:center;">
            <div style="font-size:30px;">${item.icon}</div>
            <button class="sys-btn" onclick="buyShopItem('${item.id}')" ${has ? 'disabled' : ''}>${has ? 'קנוי' : item.price.toLocaleString()+'₪'}</button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buyShopItem = function(id) {
    const item = shopItems.find(x => x.id === id);
    if (window.money >= item.price) {
        window.money -= item.price; window.lifeXP += item.xp; window.inventory.push(item.id);
        saveGame(); updateUI(); drawShop(document.getElementById('content'));
    }
}

window.drawSkills = function(c) {
    let html = `<h3>🎓 כישורים</h3><div class="grid-2">`;
    skillList.forEach(s => {
        const has = window.skills.includes(s.name);
        html += `<div class="card" style="text-align:center;">
            <div style="font-size:28px;">${s.icon}</div>
            <button class="sys-btn" onclick="buySkill('${s.name}', ${s.price})" ${has ? 'disabled' : ''}>${has ? 'נלמד' : s.price.toLocaleString()+'₪'}</button>
        </div>`;
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
        html += `<div class="card" style="text-align:center;">
            <div style="font-size:28px;">${car.icon}</div>
            <button class="sys-btn" onclick="buyCar('${car.name}', ${car.price}, ${car.speed})" ${has ? 'disabled' : ''}>${has ? 'במוסך' : car.price.toLocaleString()+'₪'}</button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buyCar = function(n, p, s) {
    if (window.money >= p) { window.money -= p; window.cars.push(n); window.carSpeed = s; saveGame(); updateUI(); drawCars(document.getElementById('content')); }
}

// --- 8. קזינו ---
window.drawTasks = function(c) {
    c.innerHTML = `<div class="card" style="text-align:center; padding:30px;">
        <div style="font-size:50px;">🎰</div><h3>Casino</h3>
        <input type="number" id="gamble-amt" style="width:80%; padding:10px; margin-bottom:10px;">
        <button class="action" style="background:var(--yellow); color:black;" onclick="runCasino()">המר!</button>
    </div>`;
}

window.runCasino = function() {
    const amt = parseInt(document.getElementById('gamble-amt').value);
    if(!amt || amt > window.money) return;
    window.money -= amt;
    setTimeout(() => {
        if(Math.random() > 0.6) window.money += amt * 2;
        updateUI(); saveGame(); drawTasks(document.getElementById('content'));
    }, 1000);
}
