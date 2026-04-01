/* Smart Money Pro - js/activities.js - v6.5.2 - Production Ready */

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

const stockList = [
    { id: 'AAPL', name: 'Apple', price: 580, trend: 0, icon: '🍎' },
    { id: 'TSLA', name: 'Tesla', price: 920, trend: 0, icon: '⚡' },
    { id: 'NVDA', name: 'Nvidia', price: 420, trend: 0, icon: '🎮' },
    { id: 'BTC',  name: 'Bitcoin', price: 65000, trend: 0, icon: '₿' },
    { id: 'ELAL', name: 'אל-על', price: 12, trend: 0, icon: '✈️' }
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
    { name: 'פרארי', price: 1800000, speed: 8, icon: '🏎️' }
];

// --- עדכון בורסה אוטומטי (כל 5 שניות) ---
setInterval(() => {
    stockList.forEach(s => {
        const change = (Math.random() * 0.06) - 0.03; // תנודה של עד 3%
        s.price *= (1 + change);
        if (s.price < 5) s.price = 5; // מחיר מינימום
        s.trend = change;
    });
    // רענון הטאב רק אם המשתמש נמצא בו
    const content = document.getElementById('content');
    const activeNav = document.querySelector('.topbar button.active');
    if (activeNav && activeNav.id.includes('invest')) {
        drawInvest(content);
    }
}, 5000);

// --- פונקציות תצוגה ---

function drawWork(c) {
    let html = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-2">`;
    jobList.forEach(j => {
        const hasSkill = !j.req || skills.includes(j.req);
        const hasCar = !j.reqCar || (Array.isArray(cars) && cars.length > 0);
        const canWork = hasSkill && hasCar;

        html += `
            <div class="card fade-in" style="text-align:center; opacity:${canWork ? 1 : 0.5}; border-top: 3px solid ${canWork ? 'var(--blue)' : '#334155'}">
                <div style="font-size:26px; margin-bottom:5px;">${j.icon}</div>
                <div style="font-weight:bold; font-size:13px; min-height:35px;">${j.name}</div>
                <div style="color:var(--green); font-size:12px; margin-bottom:10px;">${j.pay.toLocaleString()}₪</div>
                
                <div id="prog-cont-${j.id}" style="display:none; width:100%; background:rgba(0,0,0,0.3); height:6px; border-radius:10px; margin-bottom:10px; overflow:hidden;">
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
    
    // בונוס מהירות מהרכב
    const currentSpeed = typeof carSpeed !== 'undefined' ? carSpeed : 1;
    const actualTime = j.time / currentSpeed;

    if(btn) btn.disabled = true;
    if(container) container.style.display = "block";
    
    setTimeout(() => { if(bar) { bar.style.transition = `width ${actualTime}ms linear`; bar.style.width = "100%"; } }, 50);

    setTimeout(() => {
        money += j.pay;
        lifeXP += j.xp;
        if(btn) btn.disabled = false;
        if(container) container.style.display = "none";
        if(bar) { bar.style.transition = "none"; bar.style.width = "0%"; }
        showMsg(`💰 +${j.pay.toLocaleString()}₪ | ✨ +${j.xp} XP`, "var(--green)");
        updateUI(); saveGame();
    }, actualTime);
}

function drawInvest(c) {
    let html = `<h3>📈 מניות וקריפטו</h3><div class="grid-1">`;
    stockList.forEach(s => {
        const owned = invOwned[s.id] || 0;
        const color = s.trend >= 0 ? 'var(--green)' : 'var(--red)';
        html += `
            <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center; border-right: 4px solid ${color}">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="font-size:22px;">${s.icon}</div>
                    <div>
                        <div style="font-weight:bold;">${s.name}</div>
                        <small style="opacity:0.6;">בבעלותך: ${owned}</small>
                    </div>
                </div>
                <div style="text-align:left;">
                    <div style="color:${color}; font-weight:bold;">${s.price.toLocaleString(undefined,{maximumFractionDigits:2})}₪</div>
                    <small style="color:${color}; font-size:10px;">${s.trend >= 0 ? '▲' : '▼'} ${(Math.abs(s.trend)*100).toFixed(2)}%</small>
                </div>
                <div style="display:flex; gap:6px;">
                    <button class="sys-btn" style="padding:6px 12px;" onclick="buyStock('${s.id}')">קנה</button>
                    <button class="sys-btn" style="padding:6px 12px; background:rgba(239,68,68,0.15); color:var(--red);" onclick="sellStock('${s.id}')">מכור</button>
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
        showMsg(`רכשת מניית ${s.name}`, "var(--blue)");
        updateUI(); saveGame(); drawInvest(document.getElementById('content'));
    } else { showMsg("אין לך מספיק מזומן", "var(--red)"); }
}

function sellStock(id) {
    if (invOwned[id] > 0) {
        const s = stockList.find(x => x.id === id);
        money += s.price;
        invOwned[id] -= 1;
        showMsg(`מכרת מניית ${s.name}`, "var(--yellow)");
        updateUI(); saveGame(); drawInvest(document.getElementById('content'));
    }
}

function drawTasks(c) {
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center; padding:30px; border: 2px solid var(--yellow);">
            <div style="font-size:50px; margin-bottom:15px;">🎰</div>
            <h2 style="color:var(--yellow); margin:0;">קזינו מזל</h2>
            <p style="font-size:12px; opacity:0.7;">סיכוי זכייה: 45% | פרס: פי 2</p>
            <input type="number" id="gamble-amt" placeholder="סכום להימור..." style="width:100%; padding:15px; margin:20px 0; text-align:center; background:#000; color:#fff; border:1px solid #333; border-radius:10px;">
            <button class="action" style="background:var(--yellow); color:#000;" onclick="playCasino()">סובב את הרולטה!</button>
        </div>`;
}

function playCasino() {
    const input = document.getElementById('gamble-amt');
    const amt = parseInt(input.value);
    if(!amt || amt <= 0 || amt > money) return showMsg("סכום לא תקין או שאין לך מספיק כסף", "var(--red)");
    
    money -= amt;
    updateUI();
    showMsg("🎲 הרולטה מסתובבת...", "var(--white)");

    setTimeout(() => {
        if (Math.random() > 0.55) {
            const win = amt * 2;
            money += win;
            showMsg(`🎉 זכית ב-${win.toLocaleString()}₪!`, "var(--green)");
        } else {
            showMsg("😢 הפסדת הפעם. אולי פעם הבאה?", "var(--red)");
        }
        updateUI(); saveGame();
    }, 1200);
}

function drawSkills(c) {
    let html = `<h3>🎓 כישורים והכשרות</h3><div class="grid-2">`;
    skillList.forEach(s => {
        const has = skills.includes(s.name);
        html += `
            <div class="card" style="text-align:center;">
                <div style="font-size:24px;">${s.icon}</div>
                <div style="font-weight:bold; font-size:13px; margin:5px 0;">${s.name}</div>
                <button class="sys-btn" style="width:100%;" onclick="buySkill('${s.name}', ${s.price})" ${has ? 'disabled' : ''}>
                    ${has ? '✅ נלמד' : s.price.toLocaleString() + '₪'}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buySkill(name, price) {
    if (money >= price) {
        money -= price;
        skills.push(name);
        showMsg(`למדת ${name}!`, "var(--green)");
        updateUI(); saveGame(); drawSkills(document.getElementById('content'));
    } else { showMsg("אין לך מספיק כסף לקורס זה", "var(--red)"); }
}

function drawCars(c) {
    let html = `<h3>🏎️ סוכנות רכבים</h3><div class="grid-2">`;
    carList.forEach(car => {
        const has = cars.includes(car.name);
        html += `
            <div class="card" style="text-align:center;">
                <div style="font-size:24px;">${car.icon}</div>
                <div style="font-weight:bold; font-size:13px; margin:5px 0;">${car.name}</div>
                <small style="display:block; margin-bottom:10px; opacity:0.6;">מהירות: x${car.speed}</small>
                <button class="sys-btn" style="width:100%;" onclick="buyCar('${car.name}', ${car.price}, ${car.speed})" ${has ? 'disabled' : ''}>
                    ${has ? '🚗 במוסך' : car.price.toLocaleString() + '₪'}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyCar(name, price, speed) {
    if (money >= price) {
        money -= price;
        cars.push(name);
        carSpeed = speed;
        showMsg(`תתחדש על ה${name}!`, "var(--green)");
        updateUI(); saveGame(); drawCars(document.getElementById('content'));
    } else { showMsg("אין לך מספיק כסף לרכב זה", "var(--red)"); }
}
