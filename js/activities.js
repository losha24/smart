/* Smart Money Pro - activities.js - v7.2.1 FINAL */

// --- 1. מאגרי נתונים מלאים (10 פריטים בכל קטגוריה) ---
const jobList = [
    { id: 'j1', name: 'מנקה רחובות', pay: 150, xp: 20, time: 3000, icon: '🧹', req: null },
    { id: 'j2', name: 'שליח פיצה', pay: 450, xp: 45, time: 5000, icon: '🍕', req: null },
    { id: 'j3', name: 'מאבטח טיולים', pay: 1100, xp: 90, time: 7000, icon: '🛡️', req: 'כושר קרבי' },
    { id: 'j4', name: 'נהג מונית', pay: 2500, xp: 180, time: 9000, icon: '🚕', req: 'רישיון נהיגה' },
    { id: 'j5', name: 'מפקח עירוני', pay: 5500, xp: 400, time: 11000, icon: '📋', req: 'קורס פיקוח' },
    { id: 'j6', name: 'סוהר שב"ס', pay: 12000, xp: 800, time: 13500, icon: '👮', req: 'קורס פיקודי' },
    { id: 'j7', name: 'טכנאי רשתות', pay: 28000, xp: 1800, time: 17000, icon: '🔧', req: 'טכנאי מוסמך' },
    { id: 'j8', name: 'מתכנת PWA', pay: 65000, xp: 4000, time: 22000, icon: '💻', req: 'פיתוח תוכנה' },
    { id: 'j9', name: 'ארכיטקט מערכות', pay: 180000, xp: 9000, time: 35000, icon: '🏗️', req: 'תואר ראשון' },
    { id: 'j10', name: 'מנכ"ל חברה', pay: 550000, xp: 25000, time: 50000, icon: '🏢', req: 'ניהול בכיר' }
];

const skillList = [
    { id: 's1', name: 'כושר קרבי', price: 5000, icon: '💪' },
    { id: 's2', name: 'רישיון נהיגה', price: 15000, icon: '🚗' },
    { id: 's3', name: 'קורס פיקוח', price: 50000, icon: '📜' },
    { id: 's4', name: 'קורס פיקודי', price: 150000, icon: '🎖️' },
    { id: 's5', name: 'טכנאי מוסמך', price: 450000, icon: '🛠️' },
    { id: 's6', name: 'פיתוח תוכנה', price: 1200000, icon: '🖥️' },
    { id: 's7', name: 'תואר ראשון', price: 4000000, icon: '🎓' },
    { id: 's8', name: 'ניהול בכיר', price: 15000000, icon: '📈' },
    { id: 's9', name: 'דיפלומטיה', price: 50000000, icon: '🌍' },
    { id: 's10', name: 'שליטה עולמית', price: 250000000, icon: '👑' }
];

const carList = [
    { id: 'c1', name: 'אופניים', price: 1500, speed: 1.2, icon: '🚲' },
    { id: 'c2', name: 'קורקינט', price: 5500, speed: 1.5, icon: '🛴' },
    { id: 'c3', name: 'מאזדה 3', price: 55000, speed: 2.2, icon: '🚗' },
    { id: 'c4', name: 'טסלה 3', price: 250000, speed: 3.5, icon: '⚡' },
    { id: 'c5', name: 'מרצדס S', price: 850000, speed: 5.0, icon: '🚘' },
    { id: 'c6', name: 'פורשה 911', price: 2200000, speed: 9.0, icon: '🏎️' },
    { id: 'c7', name: 'מטוס פרטי', price: 35000000, speed: 25.0, icon: '🛩️' },
    { id: 'c8', name: 'יאכטה', price: 150000000, speed: 40.0, icon: '🚤' },
    { id: 'c9', name: 'חללית', price: 1200000000, speed: 150.0, icon: '🚀' },
    { id: 'c10', name: 'פורטל קוונטי', price: 8000000000, speed: 500.0, icon: '🌀' }
];

// --- 2. עבודה (Work) ---
function drawWork(c) {
    let h = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-4" style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px;">`;
    jobList.forEach(j => {
        const hasSkill = !j.req || inventory.some(i => i.name === j.req);
        h += `
        <div class="card fade-in" style="padding:8px; text-align:center; font-size:11px; opacity:${hasSkill ? 1 : 0.5};">
            <div style="font-size:20px;">${j.icon}</div>
            <b style="display:block; height:28px; overflow:hidden;">${!hasSkill ? '🔒 ' : ''}${j.name}</b>
            <div style="color:var(--green); font-weight:bold;">₪${j.pay.toLocaleString()}</div>
            
            <div id="prog-cont-${j.id}" style="display:none; height:4px; background:#000; margin:5px 0; border-radius:5px; overflow:hidden;">
                <div id="bar-${j.id}" style="height:100%; background:var(--blue); width:0%;"></div>
            </div>
            
            <button class="sys-btn" id="job-${j.id}" style="width:100%; font-size:10px; padding:5px 0;" 
                onclick="${hasSkill ? `startWork('${j.id}')` : `showMsg('חסר: ${j.req}', 'var(--red)')`}">
                ${hasSkill ? 'בצע' : 'נעול'}
            </button>
        </div>`;
    });
    c.innerHTML = h + "</div>";
}

function startWork(id) {
    const j = jobList.find(x => x.id === id);
    const btn = document.getElementById(`job-${j.id}`);
    const bar = document.getElementById(`bar-${j.id}`);
    const cont = document.getElementById(`prog-cont-${j.id}`);
    
    btn.disabled = true;
    cont.style.display = "block";
    let finalTime = j.time / carSpeed;
    
    setTimeout(() => { 
        bar.style.transition = `width ${finalTime}ms linear`; 
        bar.style.width = "100%"; 
    }, 50);

    setTimeout(() => {
        money += j.pay;
        lifeXP += j.xp;
        
        // הבונוס הפסיבי שביקשת (40% - 50%)
        let pBonus = j.pay * (0.4 + Math.random() * 0.1);
        passive += pBonus;
        
        btn.disabled = false;
        cont.style.display = "none";
        bar.style.width = "0%"; 
        bar.style.transition = "none";
        
        showMsg(`+₪${j.pay.toLocaleString()} | פסיבי +₪${pBonus.toFixed(0)}`, "var(--green)");
        updateUI(); 
        saveGame();
    }, finalTime);
}

// --- 3. כישורים (Skills) ---
function drawSkills(c) {
    let h = `<h3>🎓 כישורים (10 רמות)</h3><div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:10px;">`;
    skillList.forEach(s => {
        const owned = inventory.some(i => i.name === s.name);
        h += `
        <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center; padding:10px;">
            <div style="font-size:12px;">${s.icon} <b>${s.name}</b></div>
            <button class="sys-btn" style="font-size:10px;" ${owned ? 'disabled' : ''} onclick="buySkill('${s.name}', ${s.price}, '${s.icon}')">
                ${owned ? 'נרכש' : '₪' + s.price.toLocaleString()}
            </button>
        </div>`;
    });
    c.innerHTML = h + "</div>";
}

function buySkill(name, price, icon) {
    if(money >= price) {
        money -= price;
        inventory.push({ name, icon, type: 'skill' });
        showMsg(`למדת ${name}!`, "var(--purple)");
        updateUI(); saveGame(); drawSkills(document.getElementById('content'));
    } else showMsg("חסר כסף ללימודים!", "var(--red)");
}

// --- 4. רכבים (Cars) ---
function drawCars(c) {
    let h = `<h3>🚗 סוכנות רכב</h3><div class="grid-4" style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px;">`;
    carList.forEach(car => {
        const owned = inventory.some(i => i.name === car.name);
        h += `
        <div class="card fade-in" style="text-align:center; padding:8px; font-size:10px;">
            <div style="font-size:24px;">${car.icon}</div>
            <b style="display:block; height:24px;">${car.name}</b>
            <div style="color:var(--blue); margin-bottom:5px;">x${car.speed} מהירות</div>
            <button class="sys-btn" style="width:100%; font-size:9px;" ${owned ? 'disabled' : ''} onclick="buyCar('${car.name}', ${car.price}, ${car.speed}, '${car.icon}')">
                ${owned ? 'בבעלות' : '₪' + car.price.toLocaleString()}
            </button>
        </div>`;
    });
    c.innerHTML = h + "</div>";
}

function buyCar(name, price, speed, icon) {
    if(money >= price) {
        money -= price;
        inventory.push({ name, icon, type: 'car' });
        if(speed > carSpeed) carSpeed = speed; 
        showMsg(`תתחדש על ה${name}!`, "var(--blue)");
        updateUI(); saveGame(); drawCars(document.getElementById('content'));
    } else showMsg("אין מספיק כסף!", "var(--red)");
}
