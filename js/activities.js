/* Smart Money Pro - js/activities.js - v6.8.9 - Full Pro Edition */

let isWorking = false;
let energy = 100;
let hunger = 0; 
let workInterval;

// --- 1. מאגרי נתונים (מסונכרן לגרסה 6.5.0 המלאה) ---
const jobList = [
    { id: 'cleaner', name: 'מנקה רחובות', pay: 45, xp: 20, time: 10, energy: 12, minLvl: 1 },
    { id: 'guard', name: 'מאבטח מתקנים', pay: 85, xp: 40, time: 25, energy: 18, minLvl: 2 },
    { id: 'driver', name: 'נהג שליחויות', pay: 140, xp: 60, time: 45, energy: 25, minLvl: 3, req: 'רישיון נהיגה' },
    { id: 'police', name: 'שוטר סיור', pay: 250, xp: 120, time: 90, energy: 35, minLvl: 5, req: 'קורס שיטור' },
    { id: 'hacker', name: 'מתכנת Fullstack', pay: 750, xp: 400, time: 200, energy: 50, minLvl: 10, req: 'תואר הנדסה' }
];

const skillTree = [
    { id: 'license', name: 'רישיון נהיגה', price: 3500, xp: 500, icon: '🪪' },
    { id: 'police_course', name: 'קורס שיטור', price: 12000, xp: 1500, icon: '👮' },
    { id: 'eng_degree', name: 'תואר הנדסה', price: 55000, xp: 6000, icon: '🎓' }
];

const carDealer = [
    { id: 'toyota', name: 'טויוטה משומשת', price: 25000, speed: 1.2, icon: '🚗' },
    { id: 'tesla', name: 'טסלה מודל 3', price: 180000, speed: 1.8, icon: '⚡' },
    { id: 'ferrari', name: 'פרארי אדומה', price: 1200000, speed: 2.5, icon: '🏎️' }
];

// --- 2. ניהול עבודות וביצועים ---
function drawWork(c) {
    let h = `<div class="card fade-in">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <h3 style="margin:0;">⚒️ מרכז תעסוקה</h3>
            <div style="text-align:left;">
                <small style="display:block; color:var(--blue);">⚡ אנרגיה: ${Math.floor(energy)}%</small>
                <small style="display:block; color:var(--red);">🍗 רעב: ${Math.floor(hunger)}%</small>
            </div>
        </div>`;

    if (isWorking) {
        h += `<div class="work-active-box" style="padding:20px; text-align:center; background:rgba(0,0,0,0.2); border-radius:10px;">
                <p>עובד כרגע... נא לא לסגור ⏳</p>
                <div class="progress-container"><div id="work-bar" class="progress-bar active-pulse" style="width:0%; background:var(--green);"></div></div>
              </div>`;
    } else {
        jobList.forEach(j => {
            const hasSkill = j.req ? skills.includes(j.req) : true;
            const lvl = getLevelData(lifeXP).level;
            const canDo = lvl >= j.minLvl && hasSkill && energy >= j.energy && hunger < 90;

            h += `<div class="card job-item" style="opacity:${canDo ? 1 : 0.6}; border-left: 4px solid ${canDo ? 'var(--blue)' : 'var(--red)'};">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <b>${j.name}</b><br>
                        <small>💰 ${j.pay}₪ | ⭐ ${j.xp}XP | ⚡ ${j.energy}%</small>
                    </div>
                    <button onclick="startJob('${j.id}')" class="sys-btn" ${!canDo ? 'disabled' : ''}>בצע</button>
                </div>
                ${!hasSkill ? `<div style="color:var(--red); font-size:10px; margin-top:5px;">⚠️ דרוש: ${j.req}</div>` : ''}
                ${hunger >= 90 ? `<div style="color:var(--red); font-size:10px;">⚠️ אתה רעב מדי לעבוד!</div>` : ''}
            </div>`;
        });
    }
    h += `</div>`;
    c.innerHTML = h;
}

function startJob(id) {
    const j = jobList.find(x => x.id === id);
    if (!j || isWorking || energy < j.energy) return;

    isWorking = true;
    energy -= j.energy;
    hunger += 5; // העבודה מעלה את הרעב
    let elapsed = 0;
    
    // בונוס מהירות מהרכב הכי טוב שיש בבעלותך
    let speedMult = 1;
    if (cars.length > 0) {
        const bestCar = carDealer.filter(c => cars.includes(c.name)).sort((a,b) => b.speed - a.speed)[0];
        if (bestCar) speedMult = bestCar.speed;
    }

    const totalTime = j.time / speedMult;
    openTab('work');
    
    workInterval = setInterval(() => {
        elapsed++;
        const pct = (elapsed / totalTime) * 100;
        const bar = document.getElementById('work-bar');
        if (bar) bar.style.width = pct + "%";

        if (elapsed >= totalTime) {
            clearInterval(workInterval);
            finishJob(j);
        }
    }, 1000);
}

function finishJob(j) {
    isWorking = false;
    money += j.pay;
    lifeXP += j.xp;
    showMsg(`עבודה הושלמה! הרווחת ${j.pay}₪`, "var(--green)");
    saveGame();
    updateUI();
    openTab('work');
}

// --- 3. חנות רכבים וכישורים ---
function drawCars(c) {
    let h = `<div class="card fade-in"><h3>🏎️ סוכנות רכבים</h3>`;
    carDealer.forEach(car => {
        const owned = cars.includes(car.name);
        h += `<div class="card" style="border:1px solid ${owned ? 'var(--green)' : 'var(--border)'}">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:25px;">${car.icon}</div>
                <div style="flex:1; margin-right:15px;">
                    <b>${car.name}</b><br>
                    <small>מהירות: x${car.speed} | מחיר: ${car.price.toLocaleString()}₪</small>
                </div>
                <button onclick="buyCar('${car.id}')" class="sys-btn" ${owned ? 'disabled' : ''}>
                    ${owned ? 'בבעלותך' : 'קנה'}
                </button>
            </div>
        </div>`;
    });
    h += `</div>`;
    c.innerHTML = h;
}

function buyCar(id) {
    const car = carDealer.find(x => x.id === id);
    if (money >= car.price && !cars.includes(car.name)) {
        money -= car.price;
        cars.push(car.name);
        inventory.push({ n: car.name, i: car.icon, t: 'car' });
        showMsg(`תתחדש על ה${car.name}!`, "var(--green)");
        saveGame();
        updateUI();
        openTab('cars');
    }
}

// --- 4. שוק אוכל (Health System) ---
function drawMarket(c) {
    const foods = [
        { n: 'סנדוויץ׳', p: 50, h: -20, e: 10, i: '🥪' },
        { n: 'ארוחה מלאה', p: 150, h: -60, e: 30, i: '🍱' }
    ];
    let h = `<div class="card fade-in"><h3>🛒 שוק ומזון</h3>`;
    foods.forEach(f => {
        h += `<div class="card" style="display:flex; justify-content:space-between; align-items:center;">
            <span>${f.i} ${f.n} (שובע: ${Math.abs(f.h)}%)</span>
            <button onclick="eat('${f.n}', ${f.p}, ${f.h}, ${f.e})" class="action" style="padding:5px 15px;">אכול ב-${f.p}₪</button>
        </div>`;
    });
    h += `</div>`;
    c.innerHTML = h;
}

function eat(n, p, hChange, eChange) {
    if (money >= p) {
        money -= p;
        hunger = Math.max(0, hunger + hChange);
        energy = Math.min(100, energy + eChange);
        showMsg(`אכלת ${n}, הרעב ירד!`, "var(--green)");
        saveGame();
        updateUI();
        openTab('market');
    }
}

// --- 5. לוגיקת החלמה אוטומטית ---
setInterval(() => {
    if (hunger < 100) hunger += 0.5; // רעב עולה עם הזמן
    if (energy < 100 && hunger < 80) energy += 1; // אנרגיה עולה רק אם לא רעבים מדי
    
    if (currentTab === 'work') {
        const stats = document.querySelectorAll('.stat-badge, small');
        if (stats.length > 0) {
            // עדכון ויזואלי של הסטטוסים בתוך הטאב
        }
    }
}, 20000); 

function drawSkills(c) {
    let h = `<div class="card fade-in"><h3>🎓 מרכז הכשרה</h3>`;
    skillTree.forEach(s => {
        const owned = skills.includes(s.name);
        h += `<div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-size:24px;">${s.icon}</div>
                <div style="flex:1; margin-right:15px;"><b>${s.name}</b><br><small>מחיר: ${s.price.toLocaleString()}₪</small></div>
                <button onclick="buySkill('${s.id}')" class="sys-btn" ${owned ? 'disabled' : ''}>${owned ? 'נרכש' : 'קנה'}</button>
            </div>
        </div>`;
    });
    h += `</div>`;
    c.innerHTML = h;
}

function buySkill(id) {
    const s = skillTree.find(x => x.id === id);
    if (money >= s.price && !skills.includes(s.name)) {
        money -= s.price;
        skills.push(s.name);
        lifeXP += s.xp;
        showMsg(`רכשת ${s.name}!`, "var(--blue)");
        saveGame();
        updateUI();
        openTab('skills');
    }
}
