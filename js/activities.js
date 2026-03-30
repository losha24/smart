/* Smart Money Pro - js/activities.js - v6.4.1 - Full Fixed Version */

// --- נתוני עבודות ---
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

// --- נתוני נדל"ן ---
const estateList = [
    { id: 'e1', name: 'מחסן להשכרה', price: 15000, passive: 120, icon: '📦' },
    { id: 'e2', name: 'דירת סטודיו', price: 150000, passive: 950, icon: '🏠' },
    { id: 'e3', name: 'חנות ברחוב', price: 450000, passive: 3200, icon: '🏪' },
    { id: 'e4', name: 'בניין מגורים', price: 2500000, passive: 18500, icon: '🏢' },
    { id: 'e5', name: 'מרכז מסחרי', price: 12000000, passive: 95000, icon: '🏗️' }
];

// --- נתוני עסקים ---
const businessTypes = [
    { id: 'b1', name: 'דוכן פלאפל', basePrice: 50000, basePassive: 450, icon: '🥙' },
    { id: 'b2', name: 'מוסך רכב', basePrice: 250000, basePassive: 2800, icon: '🔧' },
    { id: 'b3', name: 'אולם אירועים', basePrice: 1200000, basePassive: 14500, icon: '🎊' },
    { id: 'b4', name: 'חברת הייטק', basePrice: 8500000, basePassive: 110000, icon: '🚀' }
];

// --- נתוני בורסה ---
const stockList = [
    { id: 'AAPL', name: 'Apple', price: 580, trend: 0 },
    { id: 'TSLA', name: 'Tesla', price: 920, trend: 0 },
    { id: 'NVDA', name: 'Nvidia', price: 420, trend: 0 },
    { id: 'BTC',  name: 'Bitcoin', price: 65000, trend: 0 },
    { id: 'ELAL', name: 'אל-על', price: 12, trend: 0 }
];

// --- נתוני רכבים וכישורים ---
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

// --- מנוע בורסה חי ---
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

// --- פונקציות ליבה לציור מסכים ---

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
                <button class="sys-btn" id="job-${j.id}" style="width:100%;" onclick="startWork('${j.id}')" ${canWork ? '' : 'disabled'}>${canWork ? 'בצע' : 'נעול'}</button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function startWork(id) {
    const j = jobList.find(x => x.id === id);
    const btn = document.getElementById(`job-${j.id}`);
    const container = document.getElementById(`prog-cont-${j.id}`);
    const bar = document.getElementById(`bar-${j.id}`);
    const actualTime = j.time / (carSpeed || 1);
    if(btn) btn.disabled = true;
    if(container) container.style.display = "block";
    setTimeout(() => { if(bar) { bar.style.transition = `width ${actualTime}ms linear`; bar.style.width = "100%"; } }, 50);
    setTimeout(() => {
        money += j.pay; lifeXP += j.xp; passive += (j.pay * 0.15);
        showMsg(`💰 +${j.pay}₪ | ✨ +${j.xp} XP`, "var(--green)");
        if(btn) btn.disabled = false;
        if(container) container.style.display = "none";
        if(bar) { bar.style.transition = "none"; bar.style.width = "0%"; }
        updateUI(); saveGame();
    }, actualTime);
}

function drawBusiness(c) {
    let html = `<h3>💼 אימפריית עסקים</h3><div class="grid-1">`;
    businessTypes.forEach(b => {
        const myBiz = businesses.find(x => x.id === b.id);
        const level = myBiz ? myBiz.level : 0;
        const price = b.basePrice * (level + 1);
        const nextPassive = b.basePassive * Math.pow(1.5, level);
        html += `
            <div class="card" style="display:flex; justify-content:space-between; align-items:center; border-left: 4px solid ${level > 0 ? 'var(--purple)' : '#444'}">
                <div><b>${b.icon} ${b.name}</b> ${level > 0 ? `(רמה ${level})` : ''}</div>
                <button class="sys-btn" onclick="upgradeBusiness('${b.id}')">${price.toLocaleString()}₪</button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function upgradeBusiness(id) {
    const b = businessTypes.find(x => x.id === id);
    let myBiz = businesses.find(x => x.id === id);
    const level = myBiz ? myBiz.level : 0;
    const price = b.basePrice * (level + 1);
    if (money >= price) {
        money -= price;
        passive += (b.basePassive * Math.pow(1.5, level));
        if (!myBiz) businesses.push({ id: id, level: 1 }); else myBiz.level++;
        saveGame(); updateUI(); drawBusiness(document.getElementById('content'));
    }
}

function drawMarket(c) {
    let html = `<h3>📈 בורסה</h3><div class="grid-1">`;
    stockList.forEach(s => {
        const owned = invOwned[s.id] || 0;
        html += `
            <div class="card" style="display:flex; justify-content:space-between;">
                <div>${s.name} (${owned})</div>
                <div><b>${s.price.toFixed(2)}₪</b></div>
                <div style="display:flex; gap:5px;">
                    <button class="sys-btn" onclick="buyStock('${s.id}')">קנה</button>
                    <button class="sys-btn" onclick="sellStock('${s.id}')">מכור</button>
                </div>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyStock(id) {
    const s = stockList.find(x => x.id === id);
    if (money >= s.price) { money -= s.price; invOwned[id] = (invOwned[id] || 0) + 1; saveGame(); updateUI(); drawMarket(document.getElementById('content')); }
}

function sellStock(id) {
    if (invOwned[id] > 0) { const s = stockList.find(x => x.id === id); money += s.price; invOwned[id] -= 1; saveGame(); updateUI(); drawMarket(document.getElementById('content')); }
}

function drawEstate(c) {
    let html = `<h3>🏠 נדל"ן</h3><div class="grid-2">`;
    estateList.forEach(e => {
        const count = inventory.filter(item => item === e.name).length;
        html += `<div class="card"><div>${e.icon} ${e.name}</div><button class="sys-btn" onclick="buyEstate('${e.id}')">${e.price.toLocaleString()}₪</button></div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyEstate(id) {
    const e = estateList.find(x => x.id === id);
    if (money >= e.price) { money -= e.price; passive += e.passive; inventory.push(e.name); saveGame(); updateUI(); drawEstate(document.getElementById('content')); }
}

function drawBank(c) {
    c.innerHTML = `<h3>🏦 בנק</h3><div class="card">חוב: ${loan}₪</div><button class="sys-btn" onclick="takeLoan()">הלוואה 50K</button>`;
}
function takeLoan() { loan += 50000; money += 50000; saveGame(); updateUI(); drawBank(document.getElementById('content')); }

function drawTasks(c) {
    c.innerHTML = `<h3>🎰 קזינו</h3><button class="action" onclick="playCasino()">המר 500₪</button>`;
}
function playCasino() {
    if(money < 500) return; money -= 500;
    if(Math.random() > 0.6) { money += 1500; showMsg("זכית!"); } else { showMsg("הפסדת..."); }
    updateUI(); saveGame();
}

function drawSkills(c) {
    let html = `<h3>🎓 כישורים</h3>`;
    skillList.forEach(s => {
        const has = skills.includes(s.name);
        html += `<button class="sys-btn" onclick="buySkill('${s.name}', ${s.price})" ${has ? 'disabled' : ''}>${s.name} (${s.price}₪)</button>`;
    });
    c.innerHTML = html;
}
function buySkill(name, price) { if(money >= price) { money -= price; skills.push(name); saveGame(); updateUI(); drawSkills(document.getElementById('content')); } }

function drawCars(c) {
    let html = `<h3>🏎️ רכבים</h3>`;
    carList.forEach(car => {
        const has = cars.includes(car.name);
        html += `<button class="sys-btn" onclick="buyCar('${car.name}', ${car.price}, ${car.speed})" ${has ? 'disabled' : ''}>${car.name}</button>`;
    });
    c.innerHTML = html;
}
function buyCar(name, price, speed) { if(money >= price) { money -= price; cars.push(name); carSpeed = speed; saveGame(); updateUI(); drawCars(document.getElementById('content')); } }
function drawInvest(c) { c.innerHTML = "<h3>💰 השקעות</h3><p>בקרוב...</p>"; }
