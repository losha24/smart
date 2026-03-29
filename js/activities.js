/* Smart Money Pro - js/activities.js - v6.0.3 - Full Grid & Content Build */

// --- מאגרי נתונים ---
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

// --- פונקציות ציור ---

function drawWork(c) {
    let html = `<h3>⚒️ תעסוקה וקריירה</h3><div class="grid-2">`;
    jobList.forEach(j => {
        const hasSkill = !j.req || skills.includes(j.req);
        const hasCar = !j.reqCar || cars.length > 0;
        const canWork = hasSkill && hasCar;

        html += `
            <div class="card fade-in" style="text-align:center; opacity:${canWork ? 1 : 0.6}; border-top: 3px solid ${canWork ? 'var(--blue)' : '#444'}">
                <div style="font-size:26px; margin-bottom:5px;">${j.icon}</div>
                <div style="font-weight:bold; font-size:13px; min-height:32px;">${j.name}</div>
                <div style="color:var(--green); font-size:12px; margin-bottom:8px;">${j.pay.toLocaleString()}₪</div>
                <button class="sys-btn" id="job-${j.id}" style="width:100%;" onclick="startWork('${j.id}')" ${canWork ? '' : 'disabled'}>
                    ${canWork ? 'בצע עבודה' : 'נעול'}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function drawSkills(c) {
    let html = `<h3>🎓 הכשרה ולימודים</h3><div class="grid-2">`;
    skillList.forEach(s => {
        const has = skills.includes(s.name);
        html += `
            <div class="card fade-in" style="text-align:center; border: 1px solid ${has ? 'var(--green)' : 'var(--border)'}">
                <div style="font-size:26px; margin-bottom:5px;">${s.icon}</div>
                <div style="font-size:12px; font-weight:bold; min-height:30px;">${s.name}</div>
                <button class="sys-btn" style="width:100%; margin-top:5px; background:${has ? 'rgba(34,197,94,0.1)' : ''}" 
                    onclick="buySkill('${s.name}', ${s.price})" ${has ? 'disabled' : ''}>
                    ${has ? '✅ נרכש' : s.price.toLocaleString() + '₪'}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function drawCars(c) {
    let html = `<h3>🏎️ סוכנות רכב</h3><div class="grid-2">`;
    carList.forEach(car => {
        const has = cars.includes(car.name);
        html += `
            <div class="card fade-in" style="text-align:center; border: 1px solid ${has ? 'var(--blue)' : 'var(--border)'}">
                <div style="font-size:26px; margin-bottom:5px;">${car.icon}</div>
                <div style="font-size:12px; font-weight:bold;">${car.name}</div>
                <small style="font-size:10px; opacity:0.7;">מהירות: x${car.speed}</small>
                <button class="sys-btn" style="width:100%; margin-top:8px;" onclick="buyCar('${car.name}', ${car.price}, ${car.speed})" ${has ? 'disabled' : ''}>
                    ${has ? '🏎️ בחניה' : car.price.toLocaleString() + '₪'}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function drawRealestate(c) {
    let html = `<h3>🏘️ נדל"ן מניב</h3>`;
    estateList.forEach(e => {
        html += `
            <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div>
                    <b style="font-size:15px;">${e.icon} ${e.name}</b><br>
                    <small style="color:var(--green)">הכנסה פסיבית: ${e.inc.toLocaleString()}₪/שעה</small>
                </div>
                <button class="sys-btn" onclick="buyEstate('${e.name}', ${e.price}, ${e.inc}, '${e.icon}')">
                    ${e.price.toLocaleString()}₪
                </button>
            </div>`;
    });
    c.innerHTML = html;
}

function drawCasino(c) {
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center; padding:30px; border: 2px dashed var(--yellow);">
            <div style="font-size:60px; margin-bottom:10px;">🎰</div>
            <h2 style="color:var(--yellow); margin-top:0;">Smart-Luck Casino</h2>
            <p style="opacity:0.8;">הימור קבוע: <b>2,500₪</b></p>
            <div id="casino-anim" style="height:40px; margin:15px 0; font-size:20px; font-weight:bold;"></div>
            <button class="action" style="background:var(--yellow); color:black; font-weight:bold;" onclick="playCasino()">סובב את הרולטה!</button>
        </div>`;
}

// --- לוגיקה פעילה ---

function startWork(id) {
    const j = jobList.find(x => x.id === id);
    if (!j) return;
    
    const btn = document.getElementById(`job-${j.id}`);
    if(btn) { btn.disabled = true; btn.innerText = "עובד..."; }
    
    showMsg(`יוצא לעבודה: ${j.name}...`, "var(--blue)");
    
    // חישוב זמן עבודה לפי מהירות הרכב
    const loadTime = (j.time * 1000) / (carSpeed || 1);

    setTimeout(() => {
        money += j.pay;
        lifeXP += j.xp;
        showMsg(`סיימת משמרת! הרווחת ${j.pay.toLocaleString()}₪`, "var(--green)");
        updateUI();
        saveGame();
        if(btn) { btn.disabled = false; btn.innerText = "בצע עבודה"; }
    }, loadTime);
}

function buySkill(name, price) {
    if (money >= price) {
        money -= price;
        skills.push(name);
        showMsg(`מזל טוב! למדת: ${name}`, "var(--green)");
        saveGame(); updateUI(); drawSkills(document.getElementById('content'));
    } else {
        showMsg("חסר לך כסף ללימודים!", "var(--red)");
    }
}

function buyCar(name, price, speed) {
    if (money >= price) {
        money -= price;
        cars.push(name);
        carSpeed = speed; 
        showMsg(`תתחדש! ה${name} מחכה לך בחניה.`, "var(--green)");
        saveGame(); updateUI(); drawCars(document.getElementById('content'));
    } else {
        showMsg("אין מספיק כסף לרכב הזה", "var(--red)");
    }
}

function buyEstate(name, price, income, icon) {
    if (money >= price) {
        money -= price;
        passive += income;
        // חשוב: דוחפים אובייקט עם שם ואייקון כדי ש-Home Tab ידע לצייר אותו
        inventory.push({ name: name, icon: icon });
        showMsg(`נכס נרכש! ההכנסה הפסיבית שלך עלתה ב-${income}₪`, "var(--green)");
        saveGame(); updateUI(); drawRealestate(document.getElementById('content'));
    } else {
        showMsg("הבנק לא אישר משכנתא (חסר כסף)", "var(--red)");
    }
}

function playCasino() {
    if (money < 2500) return showMsg("אין לך מספיק כסף להימור!", "var(--red)");
    
    money -= 2500;
    updateUI();
    const res = document.getElementById('casino-anim');
    res.innerText = "💎 🍋 🍒";
    res.style.color = "var(--text)";
    
    setTimeout(() => {
        if (Math.random() > 0.65) {
            const win = 7500;
            money += win;
            res.innerText = `7️⃣ 7️⃣ 7️⃣ זכית ב-${win.toLocaleString()}₪!`;
            res.style.color = "var(--green)";
        } else {
            res.innerText = "🍋 💀 🍒 הפסדת...";
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
        showMsg(`קיבלת שי יומיומי: ${amount.toLocaleString()}₪`, "var(--yellow)");
        saveGame(); updateUI();
        openTab('home');
    } else {
        showMsg("כבר קיבלת מתנה ב-24 השעות האחרונות", "var(--white)");
    }
}
