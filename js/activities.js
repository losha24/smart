/* Smart Money Pro - js/activities.js - v6.5.5 - Final Production */

// --- מאגרי נתונים ---

const jobList = [
    { id: 'j1', name: 'מנקה', pay: 55, xp: 20, time: 3000, icon: '🧹' },
    { id: 'j2', name: 'שליח', pay: 95, xp: 45, time: 5000, icon: '🛵' },
    { id: 'j3', name: 'מאבטח', pay: 145, xp: 65, time: 8000, icon: '🏢' },
    { id: 'j4', name: 'מאבטח חמוש', pay: 290, xp: 140, time: 10000, icon: '🔫', req: 'רישיון נשק' },
    { id: 'j5', name: 'נהג מונית', pay: 340, xp: 110, time: 12000, icon: '🚕', reqCar: true },
    { id: 'j6', name: 'סוהר', pay: 420, xp: 190, time: 14000, icon: '👮', req: 'קורס פיקודי' },
    { id: 'j7', name: 'נהג משאית', pay: 650, xp: 250, time: 16000, icon: '🚛', req: 'רישיון משאית', reqCar: true },
    { id: 'j8', name: 'מתכנת PWA', pay: 1250, xp: 550, time: 18000, icon: '💻', req: 'תכנות PWA' },
    { id: 'j9', name: 'מנהל רשת', pay: 2100, xp: 950, time: 25000, icon: '🌐', req: 'ניהול רשת' },
    { id: 'j10', name: 'ארכיטקט מערכות', pay: 4500, xp: 2000, time: 35000, icon: '🏛️', req: 'ניהול טכנולוגי' }
];

const stockList = [
    { id: 'AAPL', name: 'Apple', price: 580, trend: 0, icon: '🍎' },
    { id: 'TSLA', name: 'Tesla', price: 920, trend: 0, icon: '⚡' },
    { id: 'NVDA', name: 'Nvidia', price: 420, trend: 0, icon: '🎮' },
    { id: 'BTC',  name: 'Bitcoin', price: 65000, trend: 0, icon: '₿' },
    { id: 'ELAL', name: 'אל-על', price: 12, trend: 0, icon: '✈️' },
    { id: 'AMZN', name: 'Amazon', price: 180, trend: 0, icon: '📦' }
];

const skillList = [
    { id: 's1', name: 'רישיון נשק', price: 4500, icon: '🔫', desc: 'מאפשר עבודה באבטחה חמושה' },
    { id: 's2', name: 'רישיון משאית', price: 12000, icon: '🚛', desc: 'מאפשר עבודה כנהג משאית' },
    { id: 's3', name: 'קורס פיקודי', price: 14500, icon: '🎖️', desc: 'מאפשר עבודה כסוהר' },
    { id: 's4', name: 'ניהול זמן', price: 2500, icon: '⏱️', desc: 'מעלה צבירת XP ב-15%' },
    { id: 's5', name: 'שיווק דיגיטלי', price: 5500, icon: '📱', desc: 'בונוס להכנסה פסיבית' },
    { id: 's6', name: 'תכנות PWA', price: 15000, icon: '💻', desc: 'פתיחת משרות פיתוח תוכנה' },
    { id: 's7', name: 'ניתוח טכני', price: 8500, icon: '📊', desc: 'הנחה של 5% בקניית מניות' },
    { id: 's8', name: 'ניהול רשת', price: 22000, icon: '🧠', desc: 'הכשרה למנהלי מערכות' }
];

const carList = [
    { name: 'קורקינט', price: 3000, speed: 1.2, icon: '🛴' },
    { name: 'אופנוע', price: 16000, speed: 1.6, icon: '🛵' },
    { name: 'סקודה', price: 95000, speed: 2.3, icon: '🚗' },
    { name: 'BMW M4', price: 480000, speed: 3.8, icon: '🏎️' },
    { name: 'טסלה S', price: 280000, speed: 4.5, icon: '⚡' },
    { name: 'Audi R8', price: 850000, speed: 5.5, icon: '🏎️' },
    { name: 'Porsche 911', price: 1300000, speed: 7.0, icon: '🐎' },
    { name: 'Lamborghini', price: 2500000, speed: 9.5, icon: '🐂' },
    { name: 'Bugatti', price: 6000000, speed: 13.0, icon: '💎' },
    { name: 'מסוק פרטי', price: 18000000, speed: 28.0, icon: '🚁' }
];

// --- לוגיקה ועדכונים אוטומטיים ---

setInterval(() => {
    stockList.forEach(s => {
        const change = (Math.random() * 0.10) - 0.05; // תנודה של עד 5%
        s.price *= (1 + change);
        if (s.price < 5) s.price = 5;
        s.trend = change;
    });
    const content = document.getElementById('content');
    const activeNav = document.querySelector('.topbar button.active');
    if (activeNav && activeNav.id === 'nav-invest') drawInvest(content);
}, 5000);

// --- פונקציות תצוגה (UI Rendering) ---

function drawWork(c) {
    if (!c) return;
    let html = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-2">`;
    jobList.forEach(j => {
        const hasSkill = !j.req || (typeof skills !== 'undefined' && skills.includes(j.req));
        const hasCar = !j.reqCar || (typeof cars !== 'undefined' && cars.length > 0);
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
                    ${canWork ? 'בצע' : 'נעול'}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function startWork(id) {
    const j = jobList.find(x => x.id === id);
    if (!j) return;
    const btn = document.getElementById(`job-${j.id}`);
    const bar = document.getElementById(`bar-${j.id}`);
    const container = document.getElementById(`prog-cont-${j.id}`);
    
    let speed = (typeof carSpeed !== 'undefined') ? carSpeed : 1;
    const actualTime = j.time / speed;

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
    if (!c) return;
    let html = `<h3>📈 בורסה ומסחר</h3><div class="grid-2">`;
    stockList.forEach(s => {
        const owned = (typeof invOwned !== 'undefined' && invOwned[s.id]) ? invOwned[s.id] : 0;
        const color = s.trend >= 0 ? 'var(--green)' : 'var(--red)';
        html += `
            <div class="card fade-in" style="text-align:center; border-bottom: 3px solid ${color}; padding:10px;">
                <div style="font-size:24px;">${s.icon}</div>
                <div style="font-weight:bold; font-size:14px;">${s.name}</div>
                <div style="color:${color}; font-size:13px; font-weight:bold;">₪${s.price.toFixed(2)}</div>
                <small style="opacity:0.6; display:block; margin-bottom:10px;">בבעלותך: ${owned}</small>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:5px;">
                    <button class="sys-btn" style="padding:5px; font-size:11px;" onclick="buyStock('${s.id}')">קנה</button>
                    <button class="sys-btn" style="padding:5px; font-size:11px; background:rgba(239,68,68,0.1); color:var(--red);" onclick="sellStock('${s.id}')">מכור</button>
                </div>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyStock(id) {
    const s = stockList.find(x => x.id === id);
    if (money >= s.price) {
        money -= s.price;
        if (typeof invOwned === 'undefined') window.invOwned = {};
        invOwned[id] = (invOwned[id] || 0) + 1;
        showMsg(`רכשת ${s.name}`, "var(--blue)");
        updateUI(); saveGame(); drawInvest(document.getElementById('content'));
    } else { showMsg("אין לך מספיק כסף", "var(--red)"); }
}

function sellStock(id) {
    if (invOwned && invOwned[id] > 0) {
        const s = stockList.find(x => x.id === id);
        money += s.price;
        invOwned[id] -= 1;
        showMsg(`מכרת ${s.name}`, "var(--yellow)");
        updateUI(); saveGame(); drawInvest(document.getElementById('content'));
    }
}

function drawSkills(c) {
    if (!c) return;
    let html = `<h3>🎓 כישורים והכשרות</h3><div class="grid-1">`;
    skillList.forEach(s => {
        const has = (typeof skills !== 'undefined' && skills.includes(s.name));
        html += `
            <div class="card fade-in" style="display:flex; align-items:center; gap:15px; border-left: 4px solid ${has ? 'var(--green)' : 'var(--blue)'}">
                <div style="font-size:28px;">${s.icon}</div>
                <div style="flex:1;">
                    <div style="font-weight:bold;">${s.name}</div>
                    <small style="opacity:0.6;">${s.desc}</small>
                </div>
                <button class="sys-btn" onclick="buySkill('${s.name}', ${s.price})" ${has ? 'disabled' : ''}>
                    ${has ? '✅' : '₪' + s.price.toLocaleString()}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buySkill(name, price) {
    if (money >= price) {
        money -= price;
        if (typeof skills === 'undefined') window.skills = [];
        skills.push(name);
        showMsg(`למדת ${name}!`, "var(--green)");
        updateUI(); saveGame(); drawSkills(document.getElementById('content'));
    } else { showMsg("אין לך מספיק כסף", "var(--red)"); }
}

function drawCars(c) {
    if (!c) return;
    let html = `<h3>🏎️ סוכנות רכבי יוקרה</h3><div class="grid-2">`;
    carList.forEach(car => {
        const has = (typeof cars !== 'undefined' && cars.includes(car.name));
        html += `
            <div class="card fade-in" style="text-align:center; border-bottom: 3px solid ${has ? 'var(--green)' : 'var(--blue)'};">
                <div style="font-size:30px; margin-bottom:5px;">${car.icon}</div>
                <div style="font-weight:bold; font-size:14px;">${car.name}</div>
                <small style="display:block; margin:5px 0; opacity:0.7; color:var(--yellow);">מהירות: x${car.speed}</small>
                <button class="sys-btn" style="width:100%; font-weight:bold;" onclick="buyCar('${car.name}', ${car.price}, ${car.speed})" ${has ? 'disabled' : ''}>
                    ${has ? 'בבעלותך ✅' : '₪' + car.price.toLocaleString()}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyCar(name, price, speed) {
    if (money >= price) {
        money -= price;
        if (typeof window.cars === 'undefined') window.cars = [];
        window.cars.push(name);
        window.carSpeed = speed; 
        showMsg(`תתחדש על ה${name}! המהירות עלתה.`, "var(--green)");
        updateUI(); saveGame(); drawCars(document.getElementById('content'));
    } else { showMsg("אין לך מספיק כסף", "var(--red)"); }
}

function drawTasks(c) {
    if (!c) return;
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center; padding:30px; border: 2px solid var(--yellow);">
            <div style="font-size:50px; margin-bottom:15px;">🎰</div>
            <h2 style="color:var(--yellow); margin:0;">קזינו מזל</h2>
            <input type="number" id="gamble-amt" placeholder="סכום להימור..." style="width:100%; padding:15px; margin:20px 0; text-align:center; background:#000; color:#fff; border:1px solid #333; border-radius:10px;">
            <button class="action" style="background:var(--yellow); color:#000; width:100%;" onclick="playCasino()">המר עכשיו!</button>
        </div>`;
}

function playCasino() {
    const input = document.getElementById('gamble-amt');
    const amt = parseInt(input.value);
    if(!amt || amt <= 0 || amt > money) return showMsg("סכום לא תקין", "var(--red)");
    
    money -= amt;
    updateUI();
    showMsg("🎲 מסובב...", "var(--white)");

    setTimeout(() => {
        if (Math.random() > 0.6) {
            const win = Math.floor(amt * 2.5);
            money += win;
            showMsg(`🎉 זכית ב-₪${win.toLocaleString()}!`, "var(--green)");
        } else {
            showMsg("😢 הפסדת.", "var(--red)");
        }
        updateUI(); saveGame();
    }, 1000);
}
