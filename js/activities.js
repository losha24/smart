/* Smart Money Pro - js/activities.js - v7.5.3 - UI & Inventory Fix */

// --- 1. מאגרי נתונים ---
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

// --- 2. אתחול ומנוע בורסה חי ---
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

// --- 3. דף הבית (מרכז שליטה) - מתוקן להצגת אייקונים ---
window.drawHome = function(c) {
    // פונקציית עזר לבדיקה אם פריט קיים (לפי שם או ID)
    const hasItem = (id, name) => window.inventory.includes(id) || window.inventory.includes(name);

    const itemIcons = shopItems.filter(si => hasItem(si.id, si.name))
        .map(si => `<span title="${si.name}" style="font-size:32px; background:rgba(255,255,255,0.05); padding:8px; border-radius:10px; display:inline-block; margin:4px;">${si.icon}</span>`).join('');

    const carIcons = carList.filter(car => window.cars.includes(car.name))
        .map(car => `<span title="${car.name}" style="font-size:32px; background:rgba(255,255,255,0.05); padding:8px; border-radius:10px; display:inline-block; margin:4px;">${car.icon}</span>`).join('');

    const skillIcons = skillList.filter(sk => window.skills.includes(sk.name))
        .map(sk => `<span title="${sk.name}" style="font-size:32px; background:rgba(255,255,255,0.05); padding:8px; border-radius:10px; display:inline-block; margin:4px;">${sk.icon}</span>`).join('');

    c.innerHTML = `
        <div class="fade-in">
            <h3 style="margin-bottom:15px; text-align:center;">🏠 מרכז שליטה אישי</h3>
            
            <div class="card" style="margin-bottom:12px; border-right: 4px solid var(--purple);">
                <div style="font-weight:bold; color:var(--purple); font-size:14px; margin-bottom:10px;">📦 ארון ציוד וחפצים</div>
                <div style="display:flex; flex-wrap:wrap; gap:5px; min-height:45px;">${itemIcons || '<small style="opacity:0.4;">הארון ריק...</small>'}</div>
            </div>

            <div class="card" style="margin-bottom:12px; border-right: 4px solid var(--blue);">
                <div style="font-weight:bold; color:var(--blue); font-size:14px; margin-bottom:10px;">🏎️ החניה שלי</div>
                <div style="display:flex; flex-wrap:wrap; gap:5px; min-height:45px;">${carIcons || '<small style="opacity:0.4;">אין רכבים בחניה</small>'}</div>
            </div>

            <div class="card" style="border-right: 4px solid var(--green);">
                <div style="font-weight:bold; color:var(--green); font-size:14px; margin-bottom:10px;">🎓 הסמכות וכישורים</div>
                <div style="display:flex; flex-wrap:wrap; gap:5px; min-height:45px;">${skillIcons || '<small style="opacity:0.4;">טרם נרכשו כישורים</small>'}</div>
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

// --- 5. נדל"ן ---
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
    if (!e || window.money < e.price) return showMsg("אין מספיק כסף!", "var(--red)");
    window.money -= e.price;
    window.passive += e.passive;
    window.inventory.push(e.name);
    showMsg(`🏠 תתחדש! רכשת ${e.name}`, "var(--green)");
    saveGame(); updateUI(); drawEstate(document.getElementById('content'));
}

// --- 6. עסקים ---
window.drawBusiness = function(c) {
    let html = `<h3>💼 אימפריית עסקים</h3><div class="grid-2">`;
    businessList.forEach(b => {
        const level = window.inventory.filter(item => item === b.id).length;
        const currentPrice = b.price * (level + 1);
        const currentPassive = b.passive * level;
        html += `
            <div class="card fade-in" style="text-align:center; border-top: 4px solid ${level > 0 ? 'var(--purple)' : '#444'}">
                <div style="font-size:35px; margin-bottom:10px;">${b.icon}</div>
                <div>
                    <div style="font-weight:bold; font-size:14px;">${b.name}</div>
                    ${level > 0 ? `<div style="color:var(--purple); font-size:11px;">רמה ${level}</div>` : ''}
                    <div style="font-size:11px; color:var(--green); margin:5px 0;">פסיבי: ${currentPassive.toLocaleString()}₪/שעה</div>
                </div>
                <button class="sys-btn" style="width:100%; margin-top:10px; font-size:12px;" onclick="buyBusiness('${b.id}', ${currentPrice}, ${b.passive})">
                    ${currentPrice.toLocaleString()}₪
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buyBusiness = function(id, price, passAdd) {
    const b = businessList.find(x => x.id === id);
    if (window.money >= price) {
        window.money -= price;
        window.passive += passAdd;
        window.inventory.push(id); 
        showMsg(`💼 ${b.name} שודרג!`, "var(--purple)");
        saveGame(); updateUI(); drawBusiness(document.getElementById('content'));
    } else { showMsg("אין מספיק כסף!", "var(--red)"); }
}

// --- 7. בנק (מתוקן עם ריענון ממשק) ---
window.drawBank = function(c) {
    const tax = (window.bankTaxRate * 100).toFixed(1);
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center; border-top: 4px solid var(--blue);">
            <h3>🏦 בנק הפועלים</h3>
            <div class="grid-2" style="margin-bottom:15px;">
                <div class="card" style="background:rgba(0,0,0,0.2);"><small>יתרה בבנק</small><h4 style="color:var(--blue);">${window.bank.toLocaleString()}₪</h4></div>
                <div class="card" style="background:rgba(0,0,0,0.2);"><small>חוב הלוואה</small><h4 style="color:var(--red);">${window.loan.toLocaleString()}₪</h4></div>
            </div>
            <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:10px;">
                <input type="number" id="bank-amt" placeholder="הכנס סכום פעולה..." style="width:100%; padding:12px; margin-bottom:12px; text-align:center; background:#000; color:#fff; border:1px solid #333; border-radius:8px;">
                <div class="grid-2" style="gap:10px;">
                    <button class="sys-btn" style="background:#2563eb; height:45px;" onclick="bankProcess('deposit')">הפקד</button>
                    <button class="sys-btn" style="background:#a855f7; height:45px;" onclick="bankProcess('withdraw')">משוך</button>
                </div>
                <div style="font-size:11px; margin-top:8px; opacity:0.6;">עמלה: ${tax}%</div>
            </div>
            <button class="action" style="background:#451a1a; width:100%; margin-top:15px; padding:12px;" onclick="repayLoan()">💰 החזר חוב מהמזומן</button>
            <button class="action" style="background:#1e293b; width:100%; margin-top:10px;" onclick="takeLoan()">🏦 בקש הלוואה (50,000₪)</button>
        </div>
    `;
}

window.bankProcess = function(mode) {
    const val = parseInt(document.getElementById('bank-amt').value);
    if(!val || val <= 0) return showMsg("נא להזין סכום תקין", "var(--red)");
    const fee = val * window.bankTaxRate;

    if(mode === 'deposit') {
        if(window.money >= (val + fee)) {
            window.money -= (val + fee); window.bank += val;
            showMsg(`הופקד בהצלחה!`, "var(--blue)");
        } else return showMsg("אין מספיק מזומן", "var(--red)");
    } else {
        if(window.bank >= val) {
            window.bank -= val; window.money += (val - fee);
            showMsg(`נמשך בהצלחה!`, "var(--purple)");
        } else return showMsg("אין מספיק יתרה", "var(--red)");
    }
    saveGame(); updateUI(); drawBank(document.getElementById('content'));
}

window.repayLoan = function() {
    const amountToPay = Math.min(window.money, window.loan);
    if(amountToPay > 0) {
        window.money -= amountToPay; window.loan -= amountToPay;
        showMsg(`שילמת ${amountToPay.toLocaleString()}₪`, "var(--green)");
        saveGame(); updateUI(); drawBank(document.getElementById('content'));
    }
}

window.takeLoan = function() {
    window.loan += 50000; window.money += 50000;
    saveGame(); updateUI(); drawBank(document.getElementById('content'));
}

// --- 8. בורסה ---
window.drawInvest = function(c) {
    let html = `<h3>📈 מסחר בבורסה</h3><div class="grid-2">`;
    stockList.forEach(s => {
        const owned = window.invOwned[s.id] || 0;
        const color = s.trend >= 0 ? 'var(--green)' : 'var(--red)';
        const arrow = s.trend >= 0 ? '▲' : '▼';
        html += `
            <div class="card fade-in" style="text-align:center; border-bottom: 3px solid ${color}">
                <div style="font-weight:bold;">${s.name}</div>
                <div style="font-size:10px; opacity:0.6;">שלך: ${owned}</div>
                <div style="margin:8px 0;">
                    <div style="color:${color}; font-weight:bold; font-size:15px;">${s.price.toFixed(2)}₪</div>
                    <small style="color:${color}; font-size:9px;">${arrow} ${(s.trend*100).toFixed(2)}%</small>
                </div>
                <div style="display:flex; gap:4px;">
                    <button class="sys-btn" style="flex:1; padding:6px; background:rgba(34,197,94,0.15);" onclick="buyStock('${s.id}')">קנה</button>
                    <button class="sys-btn" style="flex:1; padding:6px; background:rgba(239,68,68,0.15);" onclick="sellStock('${s.id}')">מכור</button>
                </div>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buyStock = function(id) {
    const s = stockList.find(x => x.id === id);
    if (window.money >= s.price) {
        window.money -= s.price;
        window.invOwned[id] = (window.invOwned[id] || 0) + 1;
        saveGame(); updateUI(); drawInvest(document.getElementById('content'));
    }
}

window.sellStock = function(id) {
    if (window.invOwned[id] > 0) {
        const s = stockList.find(x => x.id === id);
        window.money += s.price;
        window.invOwned[id] -= 1;
        saveGame(); updateUI(); drawInvest(document.getElementById('content'));
    }
}

// --- 9. חנות מותגים ---
window.drawShop = function(c) {
    let html = `<h3 class="fade-in">🛒 חנות מותגים</h3><div class="grid-2">`;
    shopItems.forEach(item => {
        const hasItem = window.inventory.includes(item.id) || window.inventory.includes(item.name);
        html += `
            <div class="card fade-in" style="text-align:center; border: 1px solid ${hasItem ? 'var(--green)' : 'var(--border)'};">
                <div style="font-size:35px; margin-bottom:10px;">${item.icon}</div>
                <div style="font-weight:bold; font-size:14px;">${item.name}</div>
                <div style="color:var(--purple); font-size:11px; margin-bottom:10px;">✨ +${item.xp} XP</div>
                <button class="sys-btn" style="width:100%; font-size:13px;" onclick="buyShopItem('${item.id}')" ${hasItem ? 'disabled' : ''}>
                    ${hasItem ? 'בבעלותך' : item.price.toLocaleString() + ' ₪'}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
};

window.buyShopItem = function(id) {
    const item = shopItems.find(x => x.id === id);
    if (window.money >= item.price) {
        window.money -= item.price;
        window.lifeXP += item.xp;
        window.inventory.push(item.id);
        showMsg(`👜 תתחדש!`, "var(--purple)");
        saveGame(); updateUI(); drawShop(document.getElementById('content'));
    }
};

// --- 10. קזינו ---
window.drawTasks = function(c) {
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center; padding:25px; border: 2px dashed var(--yellow);">
            <div style="font-size:55px; margin-bottom:10px;">🎰</div>
            <h3 style="color:var(--yellow); margin-top:0; font-size:24px;">Royal Casino</h3>
            <p style="font-size:12px; opacity:0.8;">המר על מזלך - פי 2 או כלום!</p>
            <input type="number" id="gamble-amt" placeholder="כמה להמר?" style="width:85%; padding:12px; margin-bottom:15px; text-align:center; background:#000; color:#fff; border:1px solid #444; border-radius:8px;">
            <div id="casino-status" style="height:30px; font-weight:bold; margin-bottom:10px;"></div>
            <button class="action" style="background:var(--yellow); color:black; width:100%; font-weight:bold; height:50px; font-size:18px;" onclick="runCasino()">סובב גלגל!</button>
        </div>`;
}

window.runCasino = function() {
    const amt = parseInt(document.getElementById('gamble-amt').value);
    const status = document.getElementById('casino-status');
    if(!amt || amt <= 0 || amt > window.money) return showMsg("סכום לא תקין", "var(--red)");
    
    window.money -= amt; updateUI();
    status.innerHTML = `<span style="color:white;">🎲🎲🎲 מסובב...</span>`;
    
    setTimeout(() => {
        if (Math.random() > 0.58) {
            window.money += amt * 2;
            status.innerHTML = `<span style="color:var(--green);">💎 זכית ב-${amt*2}₪! 💎</span>`;
        } else {
            status.innerHTML = `<span style="color:var(--red);">💀 הפסדת הכל... 💀</span>`;
        }
        updateUI(); saveGame();
    }, 1200);
}

// --- 11. כישורים ורכבים ---
window.drawSkills = function(c) {
    let html = `<h3>🎓 מרכז הכשרה</h3><div class="grid-2">`;
    skillList.forEach(s => {
        const has = window.skills.includes(s.name);
        html += `<div class="card" style="text-align:center;">
            <div style="font-size:28px;">${s.icon}</div>
            <div style="font-size:12px; font-weight:bold; margin:5px 0;">${s.name}</div>
            <button class="sys-btn" onclick="buySkill('${s.name}', ${s.price})" ${has ? 'disabled' : ''}>${has ? '✅ נלמד' : s.price.toLocaleString()+'₪'}</button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buySkill = function(n, p) {
    if (window.money >= p) { window.money -= p; window.skills.push(n); saveGame(); updateUI(); drawSkills(document.getElementById('content')); }
}

window.drawCars = function(c) {
    let html = `<h3>🏎️ סוכנות רכב יוקרה</h3><div class="grid-2">`;
    carList.forEach(car => {
        const has = window.cars.includes(car.name);
        html += `<div class="card" style="text-align:center;">
            <div style="font-size:28px;">${car.icon}</div>
            <div style="font-size:12px; font-weight:bold; margin:5px 0;">${car.name}</div>
            <button class="sys-btn" onclick="buyCar('${car.name}', ${car.price}, ${car.speed})" ${has ? 'disabled' : ''}>${has ? '🏎️ במוסך' : car.price.toLocaleString()+'₪'}</button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

window.buyCar = function(n, p, s) {
    if (window.money >= p) { window.money -= p; window.cars.push(n); window.carSpeed = s; saveGame(); updateUI(); drawCars(document.getElementById('content')); }
}
