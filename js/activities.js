/* Smart Money Pro - js/activities.js - v6.5.1 - Business Empire & Economy Sync */

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
    { n: 'מחסן להשכרה', c: 15000, p: 120, i: '📦' },
    { n: 'דירת סטודיו', c: 150000, p: 950, i: '🏠' },
    { n: 'חנות ברחוב', c: 450000, p: 3200, i: '🏪' },
    { n: 'בניין מגורים', c: 2500000, p: 18500, i: '🏢' },
    { n: 'מרכז מסחרי', c: 12000000, p: 95000, i: '🏗️' },
    { n: 'אי פרטי', c: 50000000, p: 250000, i: '🏝️' }
];

const businessList = [
    { n: 'דוכן פלאפל', c: 65000, p: 550, i: '🥙' },
    { n: 'מוסך רכב', c: 320000, p: 3400, i: '🔧' },
    { n: 'אולם אירועים', c: 1800000, p: 19500, i: '🎊' },
    { n: 'חברת הייטק', c: 9500000, p: 125000, i: '🚀' }
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

// --- פונקציות עבודה ---

function drawWork(c) {
    let html = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-2">`;
    jobList.forEach(j => {
        const canWork = (!j.req || skills.includes(j.req)) && (!j.reqCar || cars.length > 0);
        html += `
            <div class="card fade-in" style="text-align:center; opacity:${canWork ? 1 : 0.6}">
                <div style="font-size:26px;">${j.icon}</div>
                <div style="font-weight:bold; font-size:13px; min-height:32px;">${j.name}</div>
                <div style="color:var(--green); font-size:12px;">${j.pay.toLocaleString()}₪</div>
                <div id="prog-cont-${j.id}" style="display:none; width:100%; background:#1e293b; height:6px; border-radius:3px; margin:10px 0; overflow:hidden;">
                    <div id="bar-${j.id}" style="width:0%; height:100%; background:var(--blue);"></div>
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
        // בונוס פסיבי קטן על עבודה (כפי שהיה לך ב-6.5.0)
        passive += (j.pay * 0.01); 
        showStatus(`💰 +${j.pay}₪ | ✨ +${j.xp} XP`, "green");
        if(btn) btn.disabled = false;
        if(container) container.style.display = "none";
        if(bar) { bar.style.transition = "none"; bar.style.width = "0%"; }
        updateUI(); saveGame();
    }, actualTime);
}

// --- פונקציות קנייה (משתמשות ב-executeBuy מ-economy.js) ---

function drawEstate(c) {
    let html = `<h3>🏠 השקעות נדל"ן</h3><div class="grid-2">`;
    estateList.forEach(e => {
        const owned = inventory.filter(i => i === e.n).length;
        html += `
            <div class="card fade-in" style="text-align:center;">
                <div style="font-size:28px;">${e.i}</div>
                <b style="font-size:13px; display:block; min-height:32px;">${e.n}</b>
                <div style="color:var(--green); font-size:11px;">+${e.p.toLocaleString()}₪/ש</div>
                <div style="font-size:10px; opacity:0.5;">בבעלותך: ${owned}</div>
                <button class="sys-btn" style="width:100%; margin-top:8px;" onclick="executeBuy('estate','${e.n}',${e.c},${e.p},'${e.i}')">
                    ${e.c.toLocaleString()}₪
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function drawBusiness(c) {
    let html = `<h3>💼 הקמת אימפריית עסקים</h3><div class="grid-1">`;
    businessList.forEach(b => {
        const level = inventory.filter(i => i === b.n).length;
        const price = b.c * (level + 1);
        html += `
            <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:15px;">
                    <div style="font-size:35px;">${b.i}</div>
                    <div>
                        <div style="font-weight:bold;">${b.n} ${level > 0 ? `<span style="color:var(--blue)">[רמה ${level}]</span>` : ''}</div>
                        <div style="font-size:12px; color:var(--green);">הכנסה: ${(b.p * level).toLocaleString()}₪/ש</div>
                    </div>
                </div>
                <button class="sys-btn" style="min-width:120px;" onclick="executeBuy('business','${b.n}',${price},${b.p},'${b.i}')">
                    ${price.toLocaleString()}₪
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
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
    else showStatus("אין מספיק כסף!", "red");
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
    else showStatus("אין מספיק כסף!", "red");
}

function drawTasks(c) {
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center; padding:20px; border: 2px dashed var(--yellow);">
            <div style="font-size:50px;">🎰</div>
            <h3>Casino</h3>
            <input type="number" id="gamble-amt" placeholder="סכום..." style="width:80%; padding:10px; margin-bottom:10px; text-align:center; background:#000; color:#fff; border:1px solid #333;">
            <button class="action" style="background:var(--yellow); color:black; width:100%;" onclick="playCasino()">המר!</button>
        </div>`;
}

function playCasino() {
    const amt = parseInt(document.getElementById('gamble-amt').value);
    if(!amt || amt <= 0 || amt > money) return showStatus("סכום לא תקין", "red");
    money -= amt;
    setTimeout(() => {
        if (Math.random() > 0.55) { money += amt * 2; showStatus("💎 זכית!", "green"); }
        else showStatus("💀 הפסדת", "red");
        updateUI(); saveGame(); drawTasks(document.getElementById('content'));
    }, 500);
}
