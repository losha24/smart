/* Smart Money Pro - js/activities.js - v6.8.9 - Fix No Duplicates */

// --- 1. מאגרי נתונים (מסונכרן מלא) ---
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

let workInterval; // נשאר כאן כי הוא מקומי לניהול הטיימר

// --- 2. ניהול עבודות ---
function drawWork(c) {
    // שימוש במשתנים הגלובליים מ-core.js ללא הגדרה מחדש
    let h = `<div class="card fade-in">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <h3 style="margin:0;">⚒️ מרכז תעסוקה</h3>
            <div style="text-align:left;">
                <small style="display:block; color:var(--blue);">⚡ אנרגיה: ${Math.floor(energy)}%</small>
                <small style="display:block; color:var(--red);">🍗 רעב: ${Math.floor(hunger)}%</small>
            </div>
        </div>`;

    if (typeof isWorking !== 'undefined' && isWorking) {
        h += `<div class="work-active-box" style="padding:20px; text-align:center; background:rgba(0,0,0,0.2); border-radius:10px;">
                <p>עובד כרגע... נא לא לסגור ⏳</p>
                <div class="progress-container" style="background:#444; height:12px; border-radius:6px; overflow:hidden;">
                    <div id="work-bar" class="progress-bar" style="width:0%; height:100%; background:var(--green);"></div>
                </div>
              </div>`;
    } else {
        jobList.forEach(j => {
            const hasSkill = j.req ? skills.includes(j.req) : true;
            const lvl = getLevelData(lifeXP).level;
            const canDo = lvl >= j.minLvl && hasSkill && energy >= j.energy && hunger < 95;

            h += `<div class="card job-item" style="opacity:${canDo ? 1 : 0.6}; border-right: 4px solid ${canDo ? 'var(--blue)' : 'var(--red)'}; margin-bottom:10px; padding:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <b>${j.name}</b><br>
                        <small>💰 ${j.pay}₪ | ⭐ ${j.xp}XP | ⚡ ${j.energy}%</small>
                    </div>
                    <button onclick="startJob('${j.id}')" class="sys-btn" ${!canDo ? 'disabled' : ''}>בצע</button>
                </div>
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
    hunger = Math.min(100, hunger + 5); 
    
    let speedMult = 1;
    if (cars && cars.length > 0) {
        const bestCar = carDealer.filter(c => cars.includes(c.name)).sort((a,b) => b.speed - a.speed)[0];
        if (bestCar) speedMult = bestCar.speed;
    }

    const totalTime = j.time / speedMult;
    openTab('work');
    
    let elapsed = 0;
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

// --- 3. שוק ורכבים ---
function drawMarket(c) {
    const foods = [
        { n: 'סנדוויץ׳', p: 50, h: -20, e: 10, i: '🥪' },
        { n: 'ארוחה מלאה', p: 150, h: -60, e: 30, i: '🍱' }
    ];
    let h = `<div class="card fade-in"><h3>🛒 שוק ומזון</h3>`;
    foods.forEach(f => {
        h += `<div class="card" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span>${f.i} ${f.n}</span>
            <button onclick="eat('${f.n}', ${f.p}, ${f.h}, ${f.e})" class="action">אכול (${f.p}₪)</button>
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
        showMsg(`אכלת ${n}!`, "var(--green)");
        saveGame();
        updateUI();
        openTab('market');
    } else {
        showMsg("אין לך מספיק כסף!", "var(--red)");
    }
}

function drawCars(c) {
    let h = `<div class="card fade-in"><h3>🏎️ סוכנות רכבים</h3>`;
    carDealer.forEach(car => {
        const owned = cars.includes(car.name);
        h += `<div class="card" style="margin-bottom:10px; border-right: 4px solid ${owned ? 'var(--green)' : 'var(--border)'}">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span>${car.icon} <b>${car.name}</b> (x${car.speed})</span>
                <button onclick="buyCar('${car.id}')" class="sys-btn" ${owned ? 'disabled' : ''}>
                    ${owned ? 'בבעלותך' : car.price.toLocaleString() + '₪'}
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
        showMsg(`תתחדש על ה${car.name}!`, "var(--green)");
        saveGame();
        updateUI();
        openTab('cars');
    }
}

function drawSkills(c) {
    let h = `<div class="card fade-in"><h3>🎓 הכשרה ולימודים</h3>`;
    skillTree.forEach(s => {
        const owned = skills.includes(s.name);
        h += `<div class="card" style="margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span>${s.icon} <b>${s.name}</b></span>
                <button onclick="buySkill('${s.id}')" class="sys-btn" ${owned ? 'disabled' : ''}>
                    ${owned ? 'נרכש' : s.price.toLocaleString() + '₪'}
                </button>
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
        showMsg(`סיימת קורס ${s.name}!`, "var(--blue)");
        saveGame();
        updateUI();
        openTab('skills');
    }
}
