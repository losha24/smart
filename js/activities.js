/* Smart Money Pro - js/activities.js - v6.5.2 TURBO - ALIGNED WITH CORE */

// --- 1. מאגרי נתונים ---
const jobList = [
    { id: 'j1', name: 'מנקה רחובות', pay: 65, xp: 25, time: 3000, icon: '🧹', req: null },
    { id: 'j2', name: 'שליח פיצה', pay: 95, xp: 40, time: 5000, icon: '🍕', req: null },
    { id: 'j3', name: 'מאבטח טיולים', pay: 160, xp: 65, time: 7500, icon: '🛡️', req: 'כושר קרבי' },
    { id: 'j4', name: 'נהג מונית', pay: 240, xp: 90, time: 9000, icon: '🚕', req: 'רישיון נהיגה' },
    { id: 'j5', name: 'מפקח עירוני', pay: 350, xp: 140, time: 11000, icon: '📋', req: 'קורס פיקוח' },
    { id: 'j6', name: 'סוהר שב"ס', pay: 520, xp: 220, time: 13500, icon: '👮', req: 'קורס פיקודי' },
    { id: 'j7', name: 'טכנאי רשתות', pay: 780, xp: 380, time: 17000, icon: '🔧', req: 'טכנאי מוסמך' },
    { id: 'j8', name: 'מתכנת PWA', pay: 1450, xp: 650, time: 22000, icon: '💻', req: 'פיתוח תוכנה' },
    { id: 'j9', name: 'ארכיטקט מערכות', pay: 3200, xp: 1400, time: 35000, icon: '🏗️', req: 'תואר ראשון' },
    { id: 'j10', name: 'מנכ"ל חברה', pay: 7500, xp: 3000, time: 50000, icon: '🏢', req: 'ניהול בכיר' }
];

const skillList = [
    { id: 's1', name: 'כושר קרבי', price: 2500, icon: '💪' },
    { id: 's2', name: 'רישיון נהיגה', price: 5000, icon: '🚗' },
    { id: 's3', name: 'קורס פיקוח', price: 12000, icon: '📜' },
    { id: 's4', name: 'קורס פיקודי', price: 25000, icon: '🎖️' },
    { id: 's5', name: 'טכנאי מוסמך', price: 45000, icon: '🛠️' },
    { id: 's6', name: 'פיתוח תוכנה', price: 85000, icon: '🖥️' },
    { id: 's7', name: 'ניהול בכיר', price: 200000, icon: '🎓' }
];

const carList = [
    { id: 'c1', name: 'אופניים חשמליים', price: 3500, speed: 1.1, icon: '🚲' },
    { id: 'c2', name: 'קטנוע 125', price: 12000, speed: 1.3, icon: '🛵' },
    { id: 'c3', name: 'מאזדה 3 משומשת', price: 45000, speed: 1.6, icon: '🚗' },
    { id: 'c4', name: 'טסלה מודל 3', price: 180000, speed: 2.2, icon: '⚡' },
    { id: 'c5', name: 'פורשה 911', price: 950000, speed: 3.5, icon: '🏎️' },
    { id: 'c6', name: 'מטוס פרטי', price: 15000000, speed: 6.0, icon: '🛩️' }
];

// --- 2. עבודה (Work) ---
function drawWork(c) {
    let html = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-2">`;
    jobList.forEach(j => {
        // בדיקת דרישות מתוך ה-Inventory הכללי של הטורבו
        const hasSkill = !j.req || inventory.some(i => i.name === j.req);
        const opacity = hasSkill ? 1 : 0.5;

        html += `
        <div class="card fade-in" style="opacity: ${opacity};">
            <div style="font-size:32px;">${j.icon}</div>
            <b>${!hasSkill ? '🔒 ' : ''}${j.name}</b>
            <div style="color:var(--green); font-weight:bold;">${j.pay.toLocaleString()}₪</div>
            <div style="font-size:10px; margin-bottom:10px;">דרישה: ${j.req || 'ללא'}</div>
            
            <div id="prog-cont-${j.id}" style="display:none; height:6px; background:#111; border-radius:10px; margin-bottom:10px; overflow:hidden;">
                <div id="bar-${j.id}" style="height:100%; background:var(--blue); width:0%;"></div>
            </div>
            
            <button class="sys-btn" id="job-${j.id}" style="width:100%" 
                onclick="${hasSkill ? `startWork('${j.id}')` : `showMsg('חסר לך: ${j.req}', 'var(--red)')`}">
                בצע עבודה
            </button>
        </div>`;
    });
    c.innerHTML = html + "</div>";
}

function startWork(id) {
    const j = jobList.find(x => x.id === id);
    const btn = document.getElementById(`job-${j.id}`);
    const bar = document.getElementById(`bar-${j.id}`);
    const cont = document.getElementById(`prog-cont-${j.id}`);
    
    const finalTime = j.time / carSpeed;
    btn.disabled = true;
    cont.style.display = "block";
    
    setTimeout(() => {
        bar.style.transition = `width ${finalTime}ms linear`;
        bar.style.width = "100%";
    }, 50);

    setTimeout(() => {
        money += j.pay;
        lifeXP += j.xp;
        btn.disabled = false;
        cont.style.display = "none";
        bar.style.width = "0%";
        bar.style.transition = "none";
        showMsg(`+${j.pay.toLocaleString()}₪ | +${j.xp} XP`, "var(--green)");
        updateUI();
        saveGame();
    }, finalTime);
}

// --- 3. כישורים (Skills) ---
function drawSkills(c) {
    let html = `<h3>🎓 כישורים ולימודים</h3><div class="grid-1">`;
    skillList.forEach(s => {
        const owned = inventory.some(i => i.name === s.name);
        html += `
        <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center;">
            <div><span>${s.icon}</span> <b>${s.name}</b></div>
            <button class="sys-btn" ${owned ? 'disabled' : ''} onclick="buySkill('${s.name}', ${s.price}, '${s.icon}')">
                ${owned ? 'נרכש' : s.price.toLocaleString() + ' ₪'}
            </button>
        </div>`;
    });
    c.innerHTML = html + "</div>";
}

function buySkill(name, price, icon) {
    if(money >= price) {
        money -= price;
        inventory.push({ name, icon, type: 'skill' });
        showMsg(`למדת ${name}!`, "var(--purple)");
        updateUI();
        saveGame();
        drawSkills(document.getElementById('content'));
    } else showMsg("אין לך מספיק כסף!", "var(--red)");
}

// --- 4. רכבים (Cars) ---
function drawCars(c) {
    let html = `<h3>🚗 סוכנות רכב</h3><div class="grid-2">`;
    carList.forEach(car => {
        const owned = inventory.some(i => i.name === car.name);
        html += `
        <div class="card fade-in" style="text-align:center;">
            <div style="font-size:35px;">${car.icon}</div>
            <b>${car.name}</b><br>
            <small style="color:var(--blue)">מהירות: x${car.speed}</small><br><br>
            <button class="sys-btn" style="width:100%" ${owned ? 'disabled' : ''} onclick="buyCar('${car.name}', ${car.price}, ${car.speed}, '${car.icon}')">
                ${owned ? 'בבעלות' : car.price.toLocaleString() + ' ₪'}
            </button>
        </div>`;
    });
    c.innerHTML = html + "</div>";
}

function buyCar(name, price, speed, icon) {
    if(money >= price) {
        money -= price;
        inventory.push({ name, icon, type: 'car' });
        if(speed > carSpeed) carSpeed = speed; 
        showMsg(`תתחדש על ה${name}!`, "var(--blue)");
        updateUI();
        saveGame();
        drawCars(document.getElementById('content'));
    } else showMsg("אין לך מספיק כסף!", "var(--red)");
}

// --- 5. קזינו (נקרא כעת drawCasino כדי להתאים ל-ui.js) ---
function drawCasino(c) {
    c.innerHTML = `
    <div class="card fade-in" style="text-align:center;">
        <h3 style="color:var(--yellow)">🎰 קזינו Grand Royal</h3>
        <input type="number" id="gamble-amt" value="1000" style="width:100%; padding:15px; border-radius:12px; background:#000; color:#fff; text-align:center; font-size:20px; margin-bottom:15px; border:1px solid var(--border);">
        <div class="grid-2">
            <button class="action" onclick="playGamble(2, 48)" style="background:var(--blue);">פי 2 <br><small>(48%)</small></button>
            <button class="action" onclick="playGamble(10, 8)" style="background:var(--purple);">פי 10 <br><small>(8%)</small></button>
        </div>
    </div>`;
}

function playGamble(mult, chance) {
    const amt = parseInt(document.getElementById('gamble-amt').value);
    if (!amt || amt <= 0 || amt > money) return showMsg("סכום לא חוקי!", "var(--red)");

    money -= amt;
    if (Math.random() * 100 < chance) {
        const win = amt * mult;
        money += win;
        showMsg(`🎉 זכית ב-${win.toLocaleString()}₪!`, "var(--green)");
    } else {
        showMsg("הפסדת...", "var(--red)");
    }
    updateUI();
    saveGame();
    drawCasino(document.getElementById('content'));
}
