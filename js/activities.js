/* Smart Money Pro - js/activities.js - v6.5.1 
   FULL SYSTEM: Jobs, Casino, Cars, Skills & Daily Rewards
*/

// --- 1. מאגר נתונים מרכזי (Jobs & Skills) ---
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

// --- 2. תצוגת עבודות (Work Tab) ---
function drawWork(c) {
    if(!c) return;
    let html = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-2">`;
    jobList.forEach(j => {
        const hasSkill = !j.req || skills.includes(j.req);
        const opacity = hasSkill ? 1 : 0.5;
        const lockIcon = hasSkill ? '' : '🔒 ';

        html += `
        <div class="card fade-in" style="text-align:center; opacity: ${opacity};">
            <div style="font-size:32px; margin-bottom:5px;">${j.icon}</div>
            <b style="display:block; min-height:40px;">${lockIcon}${j.name}</b>
            <div style="color:var(--green); font-weight:bold; margin-bottom:5px;">${j.pay.toLocaleString()}₪</div>
            <div style="font-size:10px; margin-bottom:10px;">דרישה: ${j.req || 'ללא'}</div>
            
            <div id="prog-cont-${j.id}" style="display:none; height:6px; background:#111; border-radius:10px; margin-bottom:10px; overflow:hidden;">
                <div id="bar-${j.id}" style="height:100%; background:var(--blue); width:0%;"></div>
            </div>
            
            <button class="sys-btn" id="job-${j.id}" style="width:100%" 
                onclick="${hasSkill ? `startWork('${j.id}')` : `showMsg('חסר לך: ${j.req}', 'var(--red)')`}">
                ${hasSkill ? 'בצע עבודה' : 'נעול'}
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
    
    // חישוב זמן עבודה לפי מהירות הרכב (CarSpeed)
    const finalTime = j.time / carSpeed;

    btn.disabled = true;
    cont.style.display = "block";
    
    setTimeout(() => {
        bar.style.transition = `width ${finalTime}ms linear`;
        bar.style.width = "100%";
    }, 10);

    setTimeout(() => {
        money += j.pay;
        lifeXP += j.xp;
        totalEarned += j.pay;
        
        btn.disabled = false;
        cont.style.display = "none";
        bar.style.width = "0%";
        bar.style.transition = "none";
        
        showMsg(`+${j.pay}₪ | +${j.xp} XP`, "var(--green)");
        updateUI();
        saveGame();
    }, finalTime);
}

// --- 3. תצוגת כישורים (Skills Tab) ---
function drawSkills(c) {
    if(!c) return;
    let html = `<h3>🎓 פיתוח אישי וכישורים</h3><div class="grid-1">`;
    skillList.forEach(s => {
        const owned = skills.includes(s.name);
        html += `
        <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center;">
            <div><span style="font-size:20px;">${s.icon}</span> <b>${s.name}</b></div>
            <button class="sys-btn" ${owned ? 'disabled' : ''} onclick="buySkill('${s.name}', ${s.price})">
                ${owned ? 'נרכש' : s.price.toLocaleString() + ' ₪'}
            </button>
        </div>`;
    });
    c.innerHTML = html + "</div>";
}

function buySkill(name, price) {
    if(money >= price) {
        money -= price;
        skills.push(name);
        showMsg(`למדת ${name}!`, "var(--purple)");
        updateUI();
        saveGame();
        drawSkills(document.getElementById('content'));
    } else showMsg("אין לך מספיק כסף ללימודים", "var(--red)");
}

// --- 4. תצוגת רכבים (Cars Tab) ---
function drawCars(c) {
    if(!c) return;
    let html = `<h3>🚗 סוכנות רכב</h3>
    <p style="font-size:12px; text-align:center;">רכבים מקצרים את זמן העבודה (בונוס מהירות: x${carSpeed})</p>
    <div class="grid-2">`;
    carList.forEach(car => {
        const owned = cars.includes(car.name);
        html += `
        <div class="card fade-in" style="text-align:center; border: ${owned ? '1px solid var(--blue)' : '1px solid var(--border)'}">
            <div style="font-size:35px;">${car.icon}</div>
            <b>${car.name}</b><br>
            <small style="color:var(--blue)">מהירות: x${car.speed}</small><br><br>
            <button class="sys-btn" style="width:100%" ${owned ? 'disabled' : ''} onclick="buyCar('${car.name}', ${car.price}, ${car.speed})">
                ${owned ? 'בבעלותך' : car.price.toLocaleString() + ' ₪'}
            </button>
        </div>`;
    });
    c.innerHTML = html + "</div>";
}

function buyCar(name, price, speed) {
    if(money >= price) {
        money -= price;
        cars.push(name);
        if(speed > carSpeed) carSpeed = speed; // תמיד לוקח את הרכב המהיר ביותר
        showMsg(`תתחדש על ה${name}!`, "var(--blue)");
        updateUI();
        saveGame();
        drawCars(document.getElementById('content'));
    } else showMsg("אין לך מספיק כסף לרכב זה", "var(--red)");
}

// --- 5. קזינו (Tasks Tab) ---
function drawTasks(c) {
    if(!c) return;
    c.innerHTML = `
    <div class="card fade-in" style="text-align:center;">
        <h3 style="color:var(--yellow)">🎰 קזינו Grand Royal</h3>
        <p>בחר סכום והמר על המזל</p>
        <div style="display:flex; gap:10px; margin-bottom:15px;">
            <button class="sys-btn" onclick="document.getElementById('gamble-amt').value=1000">1K</button>
            <button class="sys-btn" onclick="document.getElementById('gamble-amt').value=10000">10K</button>
            <button class="sys-btn" onclick="document.getElementById('gamble-amt').value=50000">50K</button>
        </div>
        <input type="number" id="gamble-amt" placeholder="סכום..." 
               style="width:100%; padding:15px; border-radius:12px; border:1px solid var(--border); background:#000; color:#fff; text-align:center; font-size:20px; margin-bottom:15px;">
        
        <div class="grid-2">
            <button class="action" onclick="playGamble(2, 48)" style="background:var(--blue);">פי 2 <br><small>(48% סיכוי)</small></button>
            <button class="action" onclick="playGamble(10, 8)" style="background:var(--purple);">פי 10 <br><small>(8% סיכוי)</small></button>
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
        showMsg("הפסדת... נסה שוב!", "var(--red)");
    }
    updateUI();
    saveGame();
    drawTasks(document.getElementById('content'));
}

// --- 6. מתנה יומית ---
function getDailyGift() {
    const now = Date.now();
    const wait = 24 * 60 * 60 * 1000;
    if (now - lastGift > wait) {
        const amount = 5000 + (getLevelData(lifeXP).level * 1000);
        money += amount;
        lastGift = now;
        showMsg(`🎁 קיבלת ${amount.toLocaleString()}₪ מתנה!`, "var(--yellow)");
        updateUI();
        saveGame();
    } else {
        const diff = wait - (now - lastGift);
        const h = Math.floor(diff / 3600000);
        showMsg(`המתנה הבאה בעוד ${h} שעות`, "var(--red)");
    }
}
