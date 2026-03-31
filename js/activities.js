/* Smart Money Pro - js/activities.js - v6.7.5 - The Ultimate Dashboard Update */

// --- 1. מאגרי נתונים (Data) ---
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

// --- 2. פונקציות ליבה (Core) ---
function messenger(text, type) {
    if (typeof showStatus === 'function') showStatus(text, type);
}

// עדכון בורסה אוטומטי
setInterval(() => {
    stockList.forEach(s => {
        const change = (Math.random() * 0.05) - 0.024;
        s.price *= (1 + change);
        if (s.price < 1) s.price = 1;
        s.trend = change;
    });
    const content = document.getElementById('content');
    if (content && content.innerHTML.includes('📈 בורסה')) drawMarket(content);
}, 3000);

// --- 3. רינדור טאבים (UI Rendering) ---

function drawHome(c) {
    const loanAmt = typeof loan !== 'undefined' ? loan : 0;
    
    let html = `
        <div class="card fade-in" style="border-top: 4px solid var(--blue);">
            <h3>📊 מרכז שליטה</h3>
            <div class="grid-2">
                <div class="stat-box">
                    <small>הכנסה פסיבית</small>
                    <div style="color:var(--green); font-weight:bold;">${Math.floor(passive).toLocaleString()}₪ / שעה</div>
                </div>
                <div class="stat-box">
                    <small>נכסים וכישורים</small>
                    <div style="font-weight:bold;">${inventory.length + skills.length}</div>
                </div>
            </div>
            
            ${loanAmt > 0 ? `
            <div style="background:rgba(239,68,68,0.1); border:1px solid var(--red); border-radius:8px; padding:10px; margin-top:10px; text-align:center;">
                <small style="color:var(--red); display:block;">⚠️ חוב לבנק</small>
                <b style="color:var(--red);">${loanAmt.toLocaleString()} ₪</b>
            </div>` : ''}

            <button class="action" style="width:100%; margin-top:15px; background:var(--yellow); color:black;" onclick="getDailyGift()">🎁 קבל מתנה יומית</button>
        </div>

        <div class="card fade-in" style="margin-top:15px;">
            <h3 style="font-size:16px; margin-bottom:10px;">📦 הציוד והנכסים שלי</h3>
            <div id="my-assets" style="display:flex; flex-wrap:wrap; gap:8px;">`;

    // הצגת רכבים
    cars.forEach(carName => {
        const item = carList.find(i => i.name === carName);
        if(item) html += `<div class="asset-tag" style="border-color:var(--blue);">${item.icon} ${item.name}</div>`;
    });

    // הצגת כישורים
    skills.forEach(skillName => {
        const item = skillList.find(i => i.name === skillName);
        if(item) html += `<div class="asset-tag" style="border-color:var(--purple);">${item.icon} ${item.name}</div>`;
    });

    // הצגת נדל"ן ועסקים
    inventory.forEach(invName => {
        const estate = estateList.find(i => i.name === invName);
        const biz = businessList.find(i => i.id === invName);
        if(estate) html += `<div class="asset-tag" style="border-color:var(--green);">${estate.icon} ${estate.name}</div>`;
        if(biz) html += `<div class="asset-tag" style="border-color:var(--yellow);">${biz.icon} ${biz.name}</div>`;
    });

    if(cars.length === 0 && skills.length === 0 && inventory.length === 0) {
        html += `<p style="font-size:12px; opacity:0.5; width:100%; text-align:center;">עדיין אין נכסים בבעלותך...</p>`;
    }

    html += `</div></div>`;
    c.innerHTML = html;
}

function drawWork(c) {
    let html = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-2">`;
    jobList.forEach(j => {
        const hasSkill = !j.req || skills.includes(j.req);
        const hasCar = !j.reqCar || cars.length > 0;
        const canWork = hasSkill && hasCar;
        html += `
            <div class="card fade-in" style="text-align:center; opacity:${canWork ? 1 : 0.6}; border-top: 3px solid ${canWork ? 'var(--blue)' : '#444'}">
                <div style="font-size:26px;">${j.icon}</div>
                <div style="font-weight:bold; font-size:13px; min-height:32px;">${j.name}</div>
                <div style="color:var(--green); font-size:12px;">${j.pay.toLocaleString()}₪</div>
                <div id="prog-cont-${j.id}" style="display:none; width:100%; background:#1e293b; height:6px; border-radius:3px; margin:10px 0; overflow:hidden;">
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
    const btn = document.getElementById(`job-${j.id}`);
    const container = document.getElementById(`prog-cont-${j.id}`);
    const bar = document.getElementById(`bar-${j.id}`);
    const actualTime = j.time / (typeof carSpeed !== 'undefined' ? carSpeed : 1);
    
    btn.disabled = true;
    container.style.display = "block";
    setTimeout(() => { bar.style.transition = `width ${actualTime}ms linear`; bar.style.width = "100%"; }, 50);
    
    setTimeout(() => {
        money += j.pay; lifeXP += j.xp;
        messenger(`💰 +${j.pay}₪ | ✨ +${j.xp} XP`, "green");
        btn.disabled = false;
        container.style.display = "none";
        bar.style.transition = "none"; bar.style.width = "0%";
        updateUI(); saveGame();
    }, actualTime);
}

function drawEstate(c) {
    let html = `<h3>🏠 נדל"ן</h3><div class="grid-2">`;
    estateList.forEach(e => {
        const count = inventory.filter(i => i === e.name).length;
        html += `
            <div class="card fade-in" style="text-align:center;">
                <div style="font-size:30px;">${e.icon}</div>
                <div style="font-weight:bold;">${e.name}</div>
                <div style="color:var(--green); font-size:11px;">+${e.passive}₪/שעה</div>
                <div style="font-size:10px; opacity:0.6;">בבעלותך: ${count}</div>
                <button class="sys-btn" style="width:100%;" onclick="buyEstate('${e.id}')">${e.price.toLocaleString()}₪</button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyEstate(id) {
    const e = estateList.find(x => x.id === id);
    if (money >= e.price) {
        money -= e.price; passive += e.passive; inventory.push(e.name);
        messenger(`🏠 תתחדש! רכשת ${e.name}`, "green");
        saveGame(); updateUI(); drawEstate(document.getElementById('content'));
    } else { messenger(`❌ חסר לך ${e.price - money}₪`, "red"); }
}

function drawBusiness(c) {
    let html = `<h3>💼 אימפריית עסקים</h3><div class="grid-1">`;
    businessList.forEach(b => {
        const level = inventory.filter(item => item === b.id).length;
        const currentPrice = b.price * (level + 1);
        html += `
            <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center; border-left: 4px solid ${level > 0 ? 'var(--purple)' : '#444'}">
                <div style="display:flex; gap:15px; align-items:center;">
                    <div style="font-size:35px;">${b.icon}</div>
                    <div><b>${b.name}</b><br><small>הכנסה: ${(b.passive * level).toLocaleString()}₪/שעה</small></div>
                </div>
                <button class="sys-btn" onclick="buyBusiness('${b.id}', ${currentPrice}, ${b.passive})">שדרג: ${currentPrice.toLocaleString()}₪</button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyBusiness(id, price, passAdd) {
    if (money >= price) {
        money -= price; passive += passAdd; inventory.push(id);
        messenger(`💼 העסק שודרג!`, "green");
        saveGame(); updateUI(); drawBusiness(document.getElementById('content'));
    } else { messenger(`❌ חסר לך ${price - money}₪`, "red"); }
}

function drawMarket(c) {
    let html = `<h3>📈 בורסה</h3><div class="grid-1">`;
    stockList.forEach(s => {
        const owned = invOwned[s.id] || 0;
        const color = s.trend >= 0 ? 'var(--green)' : 'var(--red)';
        html += `
            <div class="card fade-in" style="display:flex; justify-content:space-between; border-right: 4px solid ${color}">
                <div><b>${s.name}</b><br><small>בבעלותך: ${owned}</small></div>
                <div style="text-align:center; color:${color};"><b>${s.price.toFixed(2)}₪</b><br><small>${s.trend >= 0 ? '▲' : '▼'} ${(s.trend*100).toFixed(2)}%</small></div>
                <div style="display:flex; gap:5px;">
                    <button class="sys-btn" style="background:rgba(34,197,94,0.1);" onclick="buyStock('${s.id}')">קנה</button>
                    <button class="sys-btn" style="background:rgba(239,68,68,0.1);" onclick="sellStock('${s.id}')">מכור</button>
                </div>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyStock(id) {
    const s = stockList.find(x => x.id === id);
    if (money >= s.price) {
        money -= s.price; invOwned[id] = (invOwned[id] || 0) + 1;
        messenger(`📈 קנית מניה`, "green");
        saveGame(); updateUI(); drawMarket(document.getElementById('content'));
    } else { messenger("❌ אין מספיק כסף", "red"); }
}

function sellStock(id) {
    if (invOwned[id] > 0) {
        const s = stockList.find(x => x.id === id);
        money += s.price; invOwned[id] -= 1;
        messenger(`💰 מכרת מניה`, "green");
        saveGame(); updateUI(); drawMarket(document.getElementById('content'));
    }
}

function drawBank(c) {
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center;">
            <h3>🏦 בנק</h3>
            <div class="stat-box" style="background:rgba(59, 130, 246, 0.1); padding:20px; margin-bottom:15px;">
                <small>חוב הלוואה פעיל</small>
                <h2 style="color:var(--red);">${loan.toLocaleString()} ₪</h2>
            </div>
            <div class="grid-2">
                <button class="action" style="background:var(--blue);" onclick="takeLoan()">קח 50K</button>
                <button class="action" style="background:var(--green);" onclick="repayLoan()">החזר 50K</button>
            </div>
        </div>`;
}

function takeLoan() {
    loan += 50000; money += 50000; messenger("🏦 הלוואה אושרה!", "blue");
    saveGame(); updateUI(); drawBank(document.getElementById('content'));
}

function repayLoan() {
    if (money >= 50000 && loan >= 50000) {
        money -= 50000; loan -= 50000; messenger("✅ החזרת חוב", "green");
    } else { messenger("❌ חסר כסף או שאין חוב", "red"); }
    saveGame(); updateUI(); drawBank(document.getElementById('content'));
}

function drawTasks(c) {
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center; padding:20px; border: 2px dashed var(--yellow);">
            <div style="font-size:50px;">🎰</div>
            <h3>קזינו</h3>
            <input type="number" id="gamble-amt" placeholder="סכום..." style="width:80%; padding:10px; margin-bottom:10px; text-align:center; background:#000; color:#fff; border:1px solid #333; border-radius:5px;">
            <div id="casino-status" style="height:20px; margin-bottom:10px;"></div>
            <button class="action" style="background:var(--yellow); color:black; width:100%;" onclick="playCasino()">🎲 המר!</button>
        </div>`;
}

function playCasino() {
    const amt = parseInt(document.getElementById('gamble-amt').value);
    if (!amt || amt <= 0 || amt > money) return messenger("❌ סכום לא תקין", "red");
    money -= amt; updateUI();
    document.getElementById('casino-status').innerText = "🎲 מסובב...";
    setTimeout(() => {
        if (Math.random() > 0.55) {
            money += amt * 2; messenger("💎 זכית!", "green");
        } else { messenger("💀 הפסדת", "red"); }
        saveGame(); updateUI(); drawTasks(document.getElementById('content'));
    }, 1000);
}

function drawSkills(c) {
    let html = `<h3>🎓 כישורים</h3><div class="grid-2">`;
    skillList.forEach(s => {
        const has = skills.includes(s.name);
        html += `
            <div class="card" style="text-align:center;">
                <div style="font-size:24px;">${s.icon}</div>
                <div style="font-size:12px;">${s.name}</div>
                <button class="sys-btn" onclick="buySkill('${s.name}', ${s.price})" ${has ? 'disabled' : ''}>
                    ${has ? '✅' : s.price.toLocaleString()+'₪'}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buySkill(name, price) {
    if (money >= price) {
        money -= price; skills.push(name); messenger(`🎓 למדת ${name}`, "green");
        saveGame(); updateUI(); drawSkills(document.getElementById('content'));
    } else { messenger(`❌ חסר לך ${price - money}₪`, "red"); }
}

function drawCars(c) {
    let html = `<h3>🚗 רכבים</h3><div class="grid-2">`;
    carList.forEach(car => {
        const has = cars.includes(car.name);
        html += `
            <div class="card" style="text-align:center;">
                <div style="font-size:24px;">${car.icon}</div>
                <div style="font-size:12px;">${car.name}</div>
                <button class="sys-btn" onclick="buyCar('${car.name}', ${car.price}, ${car.speed})" ${has ? 'disabled' : ''}>
                    ${has ? '🏎️' : car.price.toLocaleString()+'₪'}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyCar(name, price, speed) {
    if (money >= price) {
        money -= price; cars.push(name); carSpeed = speed; messenger(`🏎️ תתחדש!`, "green");
        saveGame(); updateUI(); drawCars(document.getElementById('content'));
    } else { messenger(`❌ חסר לך ${price - money}₪`, "red"); }
}

function getDailyGift() {
    const now = Date.now();
    if (now - lastGift > 86400000) {
        money += 2000; lastGift = now; messenger("🎁 קיבלת 2,000₪!", "green");
        saveGame(); updateUI(); drawHome(document.getElementById('content'));
    } else { messenger("⏳ חזור מחר", "blue"); }
}
