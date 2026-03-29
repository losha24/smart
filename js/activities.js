/* Smart Money Pro - js/activities.js - v6.0.3 - Full Grid & Content Build */

// --- מאגרי נתונים מורחבים ---

const jobList = [
    { id: 'j1', name: 'מנקה', pay: 55, xp: 20, time: 5, icon: '🧹' },
    { id: 'j2', name: 'שליח', pay: 95, xp: 45, time: 7, icon: '🛵' },
    { id: 'j3', name: 'מאבטח', pay: 145, xp: 65, time: 10, icon: '🏢' },
    { id: 'j4', name: 'מאבטח חמוש', pay: 290, xp: 140, time: 12, icon: '🔫', req: 'רישיון נשק' },
    { id: 'j5', name: 'נהג מונית', pay: 340, xp: 110, time: 14, icon: '🚕', reqCar: true },
    { id: 'j6', name: 'סוהר', pay: 420, xp: 190, time: 15, icon: '👮', req: 'קורס פיקודי' },
    { id: 'j7', name: 'נהג משאית', pay: 650, xp: 250, time: 18, icon: '🚛', req: 'רישיון משאית', reqCar: true },
    { id: 'j8', name: 'מתכנת PWA', pay: 900, xp: 480, time: 20, icon: '💻', req: 'תכנות' },
    { id: 'j9', name: 'מנהל רשת', pay: 1750, xp: 850, time: 25, icon: '🌐', req: 'ניהול רשת' },
    { id: 'j10', name: 'ארכיטקט', pay: 3500, xp: 1500, time: 35, icon: '🏛️', req: 'ניהול טכנולוגי' }
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

const estateList = [
    { name: 'דירת סטודיו', price: 850000, inc: 3800, icon: '🏢' },
    { name: 'דו משפחתי', price: 2400000, inc: 9500, icon: '🏡' },
    { name: 'וילה יוקרתית', price: 5800000, inc: 22000, icon: '🏰' },
    { name: 'מרכז מסחרי', price: 12000000, inc: 55000, icon: '🏬' },
    { name: 'גורד שחקים', price: 85000000, inc: 350000, icon: '🏙️' }
];

// --- פונקציות ציור (UI Drawing) ---

function drawWork(c) {
    c.innerHTML = `<h3>⚒️ תעסוקה וקריירה</h3><div class="grid-2" id="grid"></div>`;
    jobList.forEach(j => {
        const hasSkill = !j.req || skills.includes(j.req);
        const hasCar = !j.reqCar || cars.length > 0;
        const canWork = hasSkill && hasCar;

        document.getElementById('grid').innerHTML += `
            <div class="card fade-in" style="text-align:center; opacity:${canWork ? 1 : 0.5}; border-top: 3px solid ${canWork ? 'var(--blue)' : 'var(--red)'}">
                <div style="font-size:26px; margin-bottom:5px;">${j.icon}</div>
                <div style="font-weight:bold; font-size:13px; min-height:32px;">${j.name}</div>
                <div style="color:var(--green); font-size:12px; margin-bottom:8px;">${j.pay.toLocaleString()}₪</div>
                <button class="sys-btn" style="width:100%;" onclick="startWork('${j.id}')" ${canWork ? '' : 'disabled'}>
                    ${canWork ? 'בצע' : 'נעול'}
                </button>
            </div>`;
    });
}

function drawSkills(c) {
    c.innerHTML = `<h3>🎓 הכשרה ולימודים</h3><div class="grid-2" id="grid"></div>`;
    skillList.forEach(s => {
        const has = skills.includes(s.name);
        document.getElementById('grid').innerHTML += `
            <div class="card fade-in" style="text-align:center;">
                <div style="font-size:26px; margin-bottom:5px;">${s.icon}</div>
                <div style="font-size:12px; font-weight:bold; min-height:30px;">${s.name}</div>
                <button class="sys-btn" style="width:100%; margin-top:5px;" onclick="buySkill('${s.name}', ${s.price})" ${has ? 'disabled' : ''}>
                    ${has ? 'נרכש' : s.price.toLocaleString() + '₪'}
                </button>
            </div>`;
    });
}

function drawCars(c) {
    c.innerHTML = `<h3>🏎️ סוכנות רכב</h3><div class="grid-2" id="grid"></div>`;
    carList.forEach(car => {
        const has = cars.includes(car.name);
        document.getElementById('grid').innerHTML += `
            <div class="card fade-in" style="text-align:center;">
                <div style="font-size:26px; margin-bottom:5px;">${car.icon}</div>
                <div style="font-size:12px; font-weight:bold;">${car.name}</div>
                <small>מהירות: x${car.speed}</small>
                <button class="sys-btn" style="width:100%; margin-top:8px;" onclick="buyCar('${car.name}', ${car.price}, ${car.speed})" ${has ? 'disabled' : ''}>
                    ${has ? 'בחניה' : car.price.toLocaleString() + '₪'}
                </button>
            </div>`;
    });
}

function drawRealestate(c) {
    c.innerHTML = `<h3>🏘️ נדל"ן מניב</h3>`; // נדל"ן נשאיר ברשימה מלאה כי זה נכסים יקרים
    estateList.forEach(e => {
        c.innerHTML += `
            <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <b>${e.icon} ${e.name}</b><br>
                    <small style="color:var(--green)">הכנסה: ${e.inc.toLocaleString()}₪/שעה</small>
                </div>
                <button class="sys-btn" onclick="buyEstate('${e.name}', ${e.price}, ${e.inc}, '${e.icon}')">
                    ${e.price.toLocaleString()}₪
                </button>
            </div>`;
    });
}

function drawCasino(c) {
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center; padding:30px;">
            <div style="font-size:50px;">🎰</div>
            <h3>קזינו Smart-Luck</h3>
            <p>המר 2,500₪ על כל הקופה!</p>
            <button class="action" onclick="playCasino()">שחק עכשיו!</button>
            <p id="casino-res" style="margin-top:15px; font-weight:bold;"></p>
        </div>`;
}

// --- לוגיקה פעילה ---

function startWork(id) {
    const j = jobList.find(x => x.id === id);
    if (!j) return;
    
    showMsg(`עובד: ${j.name}...`, "var(--blue)");
    const loadTime = (j.time * 100) / carSpeed;

    setTimeout(() => {
        money += j.pay;
        lifeXP += j.xp;
        showMsg(`הרווחת ${j.pay}₪!`, "var(--green)");
        updateUI();
        saveGame();
    }, loadTime);
}

function buySkill(name, price) {
    if (money >= price) {
        money -= price;
        skills.push(name);
        showMsg(`רכשת כישור: ${name}`, "var(--green)");
        saveGame(); updateUI(); drawSkills(document.getElementById('content'));
    } else {
        showMsg("אין לך מספיק כסף!", "var(--red)");
    }
}

function buyCar(name, price, speed) {
    if (money >= price) {
        money -= price;
        cars.push(name);
        carSpeed = speed; 
        showMsg(`תתחדש על ה${name}!`, "var(--green)");
        saveGame(); updateUI(); drawCars(document.getElementById('content'));
    } else {
        showMsg("חסר כסף לרכב!", "var(--red)");
    }
}

function buyEstate(name, price, income, icon) {
    if (money >= price) {
        money -= price;
        passive += income;
        inventory.push({ name, icon });
        showMsg(`נכס נרכש! ההכנסה הפסיבית עלתה.`, "var(--green)");
        saveGame(); updateUI(); drawRealestate(document.getElementById('content'));
    } else {
        showMsg("הבנק דחה את המשכנתא!", "var(--red)");
    }
}

function playCasino() {
    if (money < 2500) return showMsg("אין לך מספיק כסף להמר!", "var(--red)");
    money -= 2500;
    const res = document.getElementById('casino-res');
    res.innerText = "מערבב קלפים...";
    
    setTimeout(() => {
        if (Math.random() > 0.65) {
            const win = 7500;
            money += win;
            res.innerText = `זכית ב-${win.toLocaleString()}₪! 🎉`;
            res.style.color = "var(--green)";
        } else {
            res.innerText = "הפסדת את ההימור. נסה שוב!";
            res.style.color = "var(--red)";
        }
        updateUI(); saveGame();
    }, 1200);
}

function getDailyGift() {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    if (now - lastGift > day) {
        const amount = 2000;
        money += amount;
        lastGift = now;
        showMsg(`קיבלת מתנה יומית: ${amount}₪`, "var(--yellow)");
        saveGame(); updateUI();
        openTab('home');
    } else {
        showMsg("כבר קיבלת מתנה היום!", "var(--white)");
    }
}
