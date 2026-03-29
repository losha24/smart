/* Smart Money Pro - js/activities.js - v6.0.3 - Full Content Update */

// --- מאגר נתונים מורחב ---

const jobs = [
    { id: 'cleaner', name: 'מנקה רחובות', pay: 45, xp: 15, time: 5, icon: '🧹' },
    { id: 'delivery', name: 'שליח פיצה', pay: 75, xp: 30, time: 7, icon: '🍕' },
    { id: 'security_basic', name: 'שומר קניון', pay: 100, xp: 50, time: 10, icon: '🏢' },
    { id: 'security_armed', name: 'מאבטח חמוש', pay: 180, xp: 90, time: 12, icon: '🔫', reqSkill: 'רישיון נשק' },
    { id: 'driver', name: 'נהג מונית', pay: 220, xp: 70, time: 15, icon: '🚕', reqCar: true },
    { id: 'prison_guard', name: 'סוהר', pay: 250, xp: 120, time: 15, icon: '👮', reqSkill: 'קורס פיקודי' },
    { id: 'junior_dev', name: 'מפתח PWA', pay: 450, xp: 200, time: 20, icon: '💻', reqSkill: 'תכנות' },
    { id: 'senior_dev', name: 'ארכיטקט תוכנה', pay: 950, xp: 500, time: 25, icon: '🚀', reqSkill: 'ניהול טכנולוגי' }
];

const availableSkills = [
    { name: 'רישיון נשק', price: 3500, icon: '🔫' },
    { name: 'תכנות', price: 8000, icon: '📜' },
    { name: 'קורס פיקודי', price: 10000, icon: '🎖️' },
    { name: 'ניהול טכנולוגי', price: 25000, icon: '🧠' },
    { name: 'תיווך נדל"ן', price: 15000, icon: '🏠' }
];

const availableCars = [
    { name: 'קורקינט חשמלי', price: 2500, speed: 1.1, icon: '🛴' },
    { name: 'אופנוע 125 סמ"ק', price: 12000, speed: 1.5, icon: '🛵' },
    { name: 'סקודה אוקטביה', price: 65000, speed: 2.2, icon: '🚗' },
    { name: 'מרצדס S-Class', price: 450000, speed: 4, icon: 'Luxury' },
    { name: 'פרארי SF90', price: 2500000, speed: 10, icon: '🏎️' }
];

const realEstateOptions = [
    { name: 'יחידת דיור בקרית ים', price: 500000, income: 2500, icon: '🏘️' },
    { name: 'דירת 4 חדרים', price: 1800000, income: 6500, icon: '🏢' },
    { name: 'וילה עם בריכה', price: 5500000, income: 15000, icon: '🏡' },
    { name: 'בניין משרדים', price: 25000000, income: 95000, icon: '🏙️' }
];

// --- פונקציות תצוגה (Drawing) ---

function drawWork(c) {
    c.innerHTML = `<h3>⚒️ אפשרויות תעסוקה</h3>`;
    jobs.forEach(j => {
        const hasSkill = !j.reqSkill || skills.includes(j.reqSkill);
        const hasCar = !j.reqCar || cars.length > 0;
        const canWork = hasSkill && hasCar;

        c.innerHTML += `
            <div class="card fade-in" style="opacity: ${canWork ? 1 : 0.6}; border-right: 4px solid ${canWork ? 'var(--green)' : 'var(--red)'}">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <b>${j.icon} ${j.name}</b><br>
                        <small style="color:var(--green)">${j.pay}₪ למשמרת</small>
                        ${j.reqSkill ? `<br><small style="color:var(--yellow)">דרוש: ${j.reqSkill}</small>` : ''}
                        ${j.reqCar ? `<br><small style="color:var(--blue)">דרוש רכב</small>` : ''}
                    </div>
                    <button class="sys-btn" onclick="startWork('${j.id}')" ${canWork ? '' : 'disabled'}>
                        ${canWork ? 'התחל' : 'נעול'}
                    </button>
                </div>
            </div>`;
    });
}

function drawSkills(c) {
    c.innerHTML = `<h3>🎓 הכשרה וכישורים</h3>`;
    availableSkills.forEach(s => {
        const isOwned = skills.includes(s.name);
        c.innerHTML += `
            <div class="card fade-in">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span>${s.icon} <b>${s.name}</b></span>
                    <button class="sys-btn" onclick="buySkill('${s.name}', ${s.price})" ${isOwned ? 'disabled' : ''}>
                        ${isOwned ? 'נלמד' : s.price.toLocaleString() + '₪'}
                    </button>
                </div>
            </div>`;
    });
}

function drawCars(c) {
    c.innerHTML = `<h3>🏎️ אולם תצוגה</h3>`;
    availableCars.forEach(car => {
        const isOwned = cars.includes(car.name);
        c.innerHTML += `
            <div class="card fade-in">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <b>${car.icon} ${car.name}</b><br>
                        <small>מהירות: x${car.speed}</small>
                    </div>
                    <button class="sys-btn" onclick="buyCar('${car.name}', ${car.price}, ${car.speed})" ${isOwned ? 'disabled' : ''}>
                        ${isOwned ? 'במוסך' : car.price.toLocaleString() + '₪'}
                    </button>
                </div>
            </div>`;
    });
}

function drawRealestate(c) {
    c.innerHTML = `<h3>🏘️ השקעות נדל"ן</h3>`;
    realEstateOptions.forEach(prop => {
        c.innerHTML += `
            <div class="card fade-in">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <b>${prop.icon} ${prop.name}</b><br>
                        <small style="color:var(--green)">תשואה: ${prop.income.toLocaleString()}₪/שעה</small>
                    </div>
                    <button class="sys-btn" onclick="buyProperty('${prop.name}', ${prop.price}, ${prop.income})">
                        ${prop.price.toLocaleString()}₪
                    </button>
                </div>
            </div>`;
    });
}

// --- לוגיקה עסקית ---

function startWork(id) {
    const j = jobs.find(x => x.id === id);
    if (!j) return;
    
    showMsg(`בביצוע: ${j.name}...`, "var(--blue)");
    // זמן העבודה מושפע ממהירות הרכב אם יש כזה
    const workTime = (j.time * 100) / carSpeed; 

    setTimeout(() => {
        money += j.pay;
        lifeXP += j.xp;
        showMsg(`הרווחת ${j.pay}₪ ו-${j.xp} XP!`, "var(--green)");
        updateUI();
        saveGame();
    }, workTime);
}

function buySkill(name, price) {
    if (money >= price) {
        money -= price;
        skills.push(name);
        showMsg(`מזל טוב! רכשת את הכישור: ${name}`, "var(--green)");
        saveGame(); updateUI(); openTab('skills');
    } else {
        showMsg("אין לך מספיק כסף ללימודים!", "var(--red)");
    }
}

function buyCar(name, price, speed) {
    if (money >= price) {
        money -= price;
        cars.push(name);
        carSpeed = speed; // הרכב האחרון שנקנה קובע את המהירות
        showMsg(`תתחדש! ה${name} מחכה לך בחניה`, "var(--green)");
        saveGame(); updateUI(); openTab('cars');
    } else {
        showMsg("חסר לך כסף לרכב הזה!", "var(--red)");
    }
}

function buyProperty(name, price, income) {
    if (money >= price) {
        money -= price;
        passive += income;
        inventory.push({ id: 'prop', name: name, icon: '🏠' });
        showMsg(`נכס חדש בבעלותך! ההכנסה הפסיבית גדלה.`, "var(--green)");
        saveGame(); updateUI();
    } else {
        showMsg("הבנק לא מאשר משכנתא - חסר הון עצמי!", "var(--red)");
    }
}

// פונקציית מתנה יומית (בדיקה מול lastGift ב-core.js)
function getDailyGift() {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    if (now - lastGift > day) {
        const gift = Math.floor(Math.random() * 2000) + 1000;
        money += gift;
        lastGift = now;
        showMsg(`קיבלת שי לחג: ${gift}₪!`, "var(--yellow)");
        saveGame(); updateUI();
        if (typeof drawHome === 'function') drawHome(document.getElementById('content'));
    } else {
        const next = new Date(lastGift + day);
        showMsg(`המתנה הבאה תהיה זמינה ב-${next.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`, "var(--white)");
    }
}
