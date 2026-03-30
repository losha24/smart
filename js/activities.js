/* Smart Money Pro - js/activities.js - v6.4.0 - Full Features & Business Empire */

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

// --- נתוני עסקים (Business) ---
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

// --- פונקציות תצוגה: עבודה ---
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
    
    setTimeout(() => { if(bar) { bar.style.transition = `width ${actualTime}ms linear`; bar.style.width = "100%"; } }, 50);

    setTimeout(() => {
        money += j.pay;
        lifeXP += j.xp;
        const passiveAdd = j.pay * 0.15; 
        passive += passiveAdd; 
        showMsg(`💰 +${j.pay}₪ | ✨ +${j.xp} XP | 🚀 פסיבי: +${passiveAdd.toFixed(2)}`, "var(--green)");
        if(btn) btn.disabled = false;
        if(container) container.style.display = "none";
        if(bar) { bar.style.transition = "none"; bar.style.width = "0%"; }
        updateUI(); saveGame();
    }, actualTime);
}

// --- פונקציות תצוגה: הקמת עסק (החדש!) ---
function drawBusiness(c) {
    let html = `<h3>💼 אימפריית עסקים</h3><div class="grid-1">`;
    
    businessTypes.forEach(b => {
        // בדיקה אם העסק כבר בבעלותנו
        const myBiz = businesses.find(x => x.id === b.id);
        const level = myBiz ? myBiz.level : 0;
        const price = b.basePrice * (level + 1);
        const currentPassive = level > 0 ? b.basePassive * Math.pow(1.5, level - 1) : 0;
        const nextPassive = b.basePassive * Math.pow(1.5, level);

        html += `
            <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center; border-left: 4px solid ${level > 0 ? 'var(--purple)' : '#444'}">
                <div style="display:flex; align-items:center; gap:15px;">
                    <div style="font-size:35px;">${b.icon}</div>
                    <div>
                        <div style="font-weight:bold;">${b.name} ${level > 0 ? `<span style="color:var(--purple)">[רמה ${level}]</span>` : ''}</div>
                        <div style="font-size:12px; color:var(--green);">הכנסה: ${Math.floor(nextPassive).toLocaleString()}₪ / שעה</div>
                    </div>
                </div>
                <button class="sys-btn" style="min-width:110px;" onclick="upgradeBusiness('${b.id}')">
                    ${level === 0 ? `הקם: ${price.toLocaleString()}₪` : `שדרג: ${price.toLocaleString()}₪`}
                </button>
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
        const addedPassive = b.basePassive * Math.pow(1.5, level);
        passive += addedPassive;

        if (!myBiz) {
            businesses.push({ id: id, level: 1 });
            showMsg(`💼 תתחדש! הקמת את ${b.name}`, "var(--purple)");
        } else {
            myBiz.level++;
            showMsg(`🚀 שדרגת את ${b.name} לרמה ${myBiz.level}`, "var(--blue)");
        }
        saveGame(); updateUI(); drawBusiness(document.getElementById('content'));
    } else {
        showMsg("אין מספיק כסף להקמה/שדרוג!", "var(--red)");
    }
}

// --- פונקציות תצוגה: בורסה ---
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
        saveGame(); updateUI(); drawMarket(document.getElementById('content'));
    } else { showMsg("חסר מזומן!", "var(--red)"); }
}

function sellStock(id) {
    if (invOwned[id] > 0) {
        const s = stockList.find(x => x.id === id);
        money += s.price;
        invOwned[id] -= 1;
        saveGame(); updateUI(); drawMarket(document.getElementById('content'));
    }
}

// --- פונקציות נדל"ן ---
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
    saveGame(); updateUI(); drawEstate(document.getElementById('content'));
}

// שאר הפונקציות (Bank, Casino וכו') נשארות כרגיל...
function drawBank(c) { c.innerHTML = `<h3>🏦 בנק</h3><button class="sys-btn" onclick="takeLoan()">קח הלוואה (50,000₪)</button>`; }
function takeLoan() { loan += 50000; money += 50000; saveGame(); updateUI(); }
function drawInvest(c) { c.innerHTML = "<h3>💰 השקעות</h3><p>בקרוב...</p>"; }
