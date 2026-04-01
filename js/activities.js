/* Smart Money Pro - js/activities.js - v6.5.2 TURBO - ALIGNED & UPDATED */

// --- 1. מאגרי נתונים (מעודכן ל-10 פריטים עם רווחים משופרים) ---
const jobList = [
    { id: 'j1', name: 'מנקה רחובות', pay: 150, xp: 25, time: 3000, icon: '🧹', req: null },
    { id: 'j2', name: 'שליח פיצה', pay: 350, xp: 45, time: 5000, icon: '🍕', req: null },
    { id: 'j3', name: 'מאבטח טיולים', pay: 850, xp: 80, time: 7500, icon: '🛡️', req: 'כושר קרבי' },
    { id: 'j4', name: 'נהג מונית', pay: 1800, xp: 150, time: 9000, icon: '🚕', req: 'רישיון נהיגה' },
    { id: 'j5', name: 'מפקח עירוני', pay: 4200, xp: 300, time: 11000, icon: '📋', req: 'קורס פיקוח' },
    { id: 'j6', name: 'סוהר שב"ס', pay: 8500, xp: 600, time: 13500, icon: '👮', req: 'קורס פיקודי' },
    { id: 'j7', name: 'טכנאי רשתות', pay: 18000, xp: 1200, time: 17000, icon: '🔧', req: 'טכנאי מוסמך' },
    { id: 'j8', name: 'מתכנת PWA', pay: 45000, xp: 2500, time: 22000, icon: '💻', req: 'פיתוח תוכנה' },
    { id: 'j9', name: 'ארכיטקט מערכות', pay: 120000, xp: 6000, time: 35000, icon: '🏗️', req: 'תואר ראשון' },
    { id: 'j10', name: 'מנכ"ל אימפריה', pay: 350000, xp: 15000, time: 50000, icon: '🏢', req: 'ניהול בכיר' }
];

const skillList = [
    { id: 's1', name: 'כושר קרבי', price: 5000, icon: '💪' },
    { id: 's2', name: 'רישיון נהיגה', price: 15000, icon: '🚗' },
    { id: 's3', name: 'קורס פיקוח', price: 45000, icon: '📜' },
    { id: 's4', name: 'קורס פיקודי', price: 120000, icon: '🎖️' },
    { id: 's5', name: 'טכנאי מוסמך', price: 350000, icon: '🛠️' },
    { id: 's6', name: 'פיתוח תוכנה', price: 950000, icon: '🖥️' },
    { id: 's7', name: 'תואר ראשון', price: 2500000, icon: '🎓' },
    { id: 's8', name: 'ניהול בכיר', price: 7000000, icon: '📈' },
    { id: 's9', name: 'דיפלומטיה', price: 25000000, icon: '🌍' },
    { id: 's10', name: 'שליטה עולמית', price: 100000000, icon: '👑' }
];

const carList = [
    { id: 'c1', name: 'אופניים חשמליים', price: 3500, speed: 1.2, icon: '🚲' },
    { id: 'c2', name: 'קטנוע 125', price: 12000, speed: 1.5, icon: '🛵' },
    { id: 'c3', name: 'מאזדה 3 משומשת', price: 45000, speed: 2.0, icon: '🚗' },
    { id: 'c4', name: 'טסלה מודל 3', price: 220000, speed: 3.0, icon: '⚡' },
    { id: 'c5', name: 'מרצדס S-Class', price: 750000, speed: 4.5, icon: '🚘' },
    { id: 'c6', name: 'פורשה 911', price: 1800000, speed: 7.0, icon: '🏎️' },
    { id: 'c7', name: 'מטוס פרטי', price: 25000000, speed: 15.0, icon: '🛩️' },
    { id: 'c8', name: 'יאכטה', price: 120000000, speed: 20.0, icon: '🚤' },
    { id: 'c9', name: 'חללית', price: 950000000, speed: 80.0, icon: '🚀' },
    { id: 'c10', name: 'פורטל קוונטי', price: 5000000000, speed: 300.0, icon: '🌀' }
];

// --- 2. עבודה (Work) עם Progress Bar ובונוס פסיבי ---
function drawWork(c) {
    let html = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-2">`;
    jobList.forEach(j => {
        const hasSkill = !j.req || inventory.some(i => i.name === j.req);
        const opacity = hasSkill ? 1 : 0.5;

        html += `
        <div class="card fade-in" style="opacity: ${opacity}; border-bottom: 3px solid ${hasSkill ? 'var(--blue)' : '#444'}">
            <div style="font-size:32px;">${j.icon}</div>
            <b>${!hasSkill ? '🔒 ' : ''}${j.name}</b>
            <div style="color:var(--green); font-weight:bold;">${j.pay.toLocaleString()}₪</div>
            <div style="font-size:10px; margin-bottom:10px; opacity:0.7;">דרישה: ${j.req || 'ללא'}</div>
            
            <div id="prog-cont-${j.id}" style="display:none; height:8px; background:#111; border-radius:10px; margin-bottom:10px; overflow:hidden; border:1px solid #333;">
                <div id="bar-${j.id}" style="height:100%; background:linear-gradient(90deg, var(--blue), var(--purple)); width:0%;"></div>
            </div>
            
            <button class="sys-btn" id="job-${j.id}" style="width:100%" 
                onclick="${hasSkill ? `startWork('${j.id}')` : `showMsg('חסר לך כישור: ${j.req}', 'var(--red)')`}">
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
    
    const finalTime = j.time / carSpeed;
    btn.disabled = true;
    cont.style.display = "block";
    
    // הפעלת האנימציה של הבר
    setTimeout(() => {
        bar.style.transition = `width ${finalTime}ms linear`;
        bar.style.width = "100%";
    }, 50);

    setTimeout(() => {
        money += j.pay;
        lifeXP += j.xp;
        passive += (j.pay * 0.01); // בונוס פסיבי של 1% מכל עבודה שבוצעה!
        
        btn.disabled = false;
        cont.style.display = "none";
        bar.style.width = "0%";
        bar.style.transition = "none";
        
        showMsg(`+₪${j.pay.toLocaleString()} | +${j.xp} XP | +₪${(j.pay*0.01).toFixed(1)} פסיבי`, "var(--green)");
        updateUI();
        saveGame();
    }, finalTime);
}

// --- 3. כישורים (Skills) ---
function drawSkills(c) {
    let html = `<h3>🎓 כישורים ולימודים (10 שלבים)</h3><div class="grid-1">`;
    skillList.forEach(s => {
        const owned = inventory.some(i => i.name === s.name);
        html += `
        <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center; background: ${owned ? 'rgba(255,255,255,0.02)' : ''}">
            <div><span>${s.icon}</span> <b style="${owned ? 'color:var(--blue)' : ''}">${s.name}</b></div>
            <button class="sys-btn" style="min-width:100px;" ${owned ? 'disabled' : ''} onclick="buySkill('${s.name}', ${s.price}, '${s.icon}')">
                ${owned ? 'נרכש ✅' : s.price.toLocaleString() + ' ₪'}
            </button>
        </div>`;
    });
    c.innerHTML = html + "</div>";
}

function buySkill(name, price, icon) {
    if(money >= price) {
        money -= price;
        inventory.push({ name, icon, type: 'skill' });
        showMsg(`למדת ${name}! נפתחו עבודות חדשות.`, "var(--purple)");
        updateUI();
        saveGame();
        drawSkills(document.getElementById('content'));
    } else showMsg("אלכסיי, חסר לך כסף ללימודים!", "var(--red)");
}

// --- 4. רכבים (Cars) ---
function drawCars(c) {
    let html = `<h3>🚗 סוכנות רכב (משפיע על מהירות העבודה)</h3><div class="grid-2">`;
    carList.forEach(car => {
        const owned = inventory.some(i => i.name === car.name);
        html += `
        <div class="card fade-in" style="text-align:center; border: 1px solid ${owned ? 'var(--blue)' : 'transparent'}">
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
        showMsg(`תתחדש על ה${name}! עכשיו תעבוד מהר יותר.`, "var(--blue)");
        updateUI();
        saveGame();
        drawCars(document.getElementById('content'));
    } else showMsg("אין מספיק כסף!", "var(--red)");
}

// --- 5. קזינו (Gamble) ---
function drawCasino(c) {
    c.innerHTML = `
    <div class="card fade-in" style="text-align:center; border: 1px solid var(--yellow);">
        <h3 style="color:var(--yellow)">🎰 קזינו Grand Royal</h3>
        <p>הכנס סכום הימור:</p>
        <input type="number" id="gamble-amt" value="1000" style="width:100%; padding:15px; border-radius:12px; background:#000; color:#fff; text-align:center; font-size:20px; margin-bottom:15px; border:1px solid #333;">
        <div class="grid-2">
            <button class="action" onclick="playGamble(2, 48)" style="background:var(--blue);">פי 2 <br><small>(48%)</small></button>
            <button class="action" onclick="playGamble(10, 8)" style="background:var(--purple);">פי 10 <br><small>(8%)</small></button>
        </div>
    </div>`;
}

function playGamble(mult, chance) {
    const amt = parseInt(document.getElementById('gamble-amt').value);
    if (!amt || amt <= 0 || amt > money) return showMsg("אין מספיק מזומן להימור!", "var(--red)");

    money -= amt;
    if (Math.random() * 100 < chance) {
        const win = amt * mult;
        money += win;
        showMsg(`🎉 זכית ב-${win.toLocaleString()}₪!`, "var(--green)");
    } else {
        showMsg("הפסדת... הבית תמיד מנצח.", "var(--red)");
    }
    updateUI();
    saveGame();
    drawCasino(document.getElementById('content'));
}
