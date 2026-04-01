/* Smart Money Pro - activities.js - FULL & ALIGNED */

// --- 1. רשימת עבודות (10 רמות) ---
const jobList = [
    { id: 'j1', name: 'ניקיון משרדים', pay: 220, xp: 25, time: 3000, icon: '🧹' },
    { id: 'j2', name: 'שליח פיצה', pay: 600, xp: 50, time: 5000, icon: '🛵' },
    { id: 'j3', name: 'מאבטח טיולים', pay: 1500, xp: 110, time: 7000, icon: '👮' },
    { id: 'j4', name: 'נהג מונית', pay: 3500, xp: 220, time: 9000, icon: '🚕' },
    { id: 'j5', name: 'מפקח בנייה', pay: 8200, xp: 480, time: 11000, icon: '📋' },
    { id: 'j6', name: 'סוהר שב"ס', pay: 18500, xp: 950, time: 14000, icon: '🚔' },
    { id: 'j7', name: 'טכנאי רשתות', pay: 42000, xp: 2100, time: 18000, icon: '🔧' },
    { id: 'j8', name: 'מפתח Fullstack', pay: 95000, xp: 5200, time: 22000, icon: '💻' },
    { id: 'j9', name: 'מנהל פרויקטים', pay: 250000, xp: 12500, time: 28000, icon: '🏢' },
    { id: 'j10', name: 'מנכ"ל תאגיד', pay: 750000, xp: 35000, time: 40000, icon: '💎' }
];

// --- 2. רשימת רכבים (10 רמות) ---
const carList = [
    { n: "אופניים חשמליים", p: 2500, s: 1.2, i: "🚲" },
    { n: "קורקינט שיאומי", p: 6000, s: 1.4, i: "🛴" },
    { n: "מאזדה 3 משומשת", p: 45000, s: 1.8, i: "🚗" },
    { n: "יונדאי איוניק 5", p: 190000, s: 2.5, i: "⚡" },
    { n: "ג'יפ רנגלר", p: 420000, s: 3.2, i: "🚙" },
    { n: "מרצדס S-Class", p: 1100000, s: 4.5, i: "🏎️" },
    { n: "פורשה טייקן", p: 2800000, s: 6.8, i: "🏎️" },
    { n: "מסוק מנהלים", p: 15000000, s: 12.0, i: "🚁" },
    { n: "מטוס פרטי Gulfstream", p: 65000000, s: 25.0, i: "🛩️" },
    { n: "מעבורת חלל", p: 1200000000, s: 80.0, i: "🚀" }
];

// --- 3. רשימת כישורים (10 רמות) ---
const skillList = [
    { n: "ניהול זמן", p: 4500, i: "⏳" },
    { n: "שיווק דיגיטלי", p: 12000, i: "📢" },
    { n: "תכנות בסיסי", p: 55000, i: "💻" },
    { n: "ניתוח נתונים", p: 140000, i: "📊" },
    { n: "ניהול פיננסי", p: 400000, i: "👔" },
    { n: "השקעות קריפטו", p: 950000, i: "🪙" },
    { n: "דיני חברות", p: 2500000, i: "⚖️" },
    { n: "יזמות נדל\"ן", p: 8000000, i: "🏗️" },
    { n: "משא ומתן", p: 30000000, i: "🤝" },
    { n: "חזון אסטרטגי", p: 150000000, i: "🧠" }
];

// --- פונקציות רינדור ---

function drawWork(c) {
    let h = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-2">`;
    jobList.forEach(j => {
        let pBonus = (j.pay * 0.45).toFixed(0); // בונוס פסיבי (45% מהשכר)
        h += `
        <div class="card fade-in">
            <div style="font-size:28px;">${j.icon}</div>
            <b style="font-size:14px; margin-top:5px;">${j.name}</b>
            <div style="color:var(--green); font-weight:bold;">₪${j.pay.toLocaleString()}</div>
            <div style="font-size:9px; color:var(--blue); margin-bottom:8px;">בונוס פסיבי: +₪${pBonus}</div>
            <button class="sys-btn" id="job-${j.id}" onclick="startWork('${j.id}')">בצע עבודה</button>
            <div id="prog-cont-${j.id}" style="display:none; height:4px; width:100%; background:#000; margin-top:8px; border-radius:2px; overflow:hidden;">
                <div id="bar-${j.id}" style="height:100%; background:var(--blue); width:0%;"></div>
            </div>
        </div>`;
    });
    c.innerHTML = h + "</div>";
}

function drawCars(c) {
    let h = `<h3>🏎️ סוכנות רכבים (מאיץ עבודה)</h3><div class="grid-2">`;
    carList.forEach(car => {
        const owned = inventory.some(i => i.name === car.n);
        h += `
        <div class="card fade-in">
            <div style="font-size:28px;">${car.i}</div>
            <b>${car.n}</b>
            <div style="color:var(--yellow); font-size:12px;">מהירות: x${car.s}</div>
            <button class="sys-btn" style="margin-top:8px;" ${owned ? 'disabled' : ''} onclick="buyCar('${car.n}', ${car.p}, ${car.s}, '${car.i}')">
                ${owned ? 'בבעלותך' : '₪' + car.p.toLocaleString()}
            </button>
        </div>`;
    });
    c.innerHTML = h + "</div>";
}

function drawSkills(c) {
    let h = `<h3>🎓 מכללת הכישורים</h3><div class="grid-2">`;
    skillList.forEach(s => {
        const owned = inventory.some(i => i.name === s.n);
        h += `
        <div class="card fade-in">
            <div style="font-size:28px;">${s.i}</div>
            <b>${s.n}</b>
            <button class="sys-btn" style="margin-top:8px;" ${owned ? 'disabled' : ''} onclick="buySkill('${s.n}', ${s.p}, '${s.i}')">
                ${owned ? 'נלמד' : '₪' + s.p.toLocaleString()}
            </button>
        </div>`;
    });
    c.innerHTML = h + "</div>";
}

// --- לוגיקה עסקית ---

function startWork(id) {
    const j = jobList.find(x => x.id === id);
    const btn = document.getElementById(`job-${j.id}`);
    const bar = document.getElementById(`bar-${j.id}`);
    const cont = document.getElementById(`prog-cont-${j.id}`);
    
    btn.disabled = true;
    cont.style.display = "block";
    let finalTime = j.time / carSpeed; // השפעת מהירות הרכב
    
    setTimeout(() => { 
        bar.style.transition = `width ${finalTime}ms linear`; 
        bar.style.width = "100%"; 
    }, 50);

    setTimeout(() => {
        money += j.pay;
        lifeXP += j.xp;
        let pBonus = j.pay * 0.45;
        passive += pBonus;
        
        btn.disabled = false;
        cont.style.display = "none";
        bar.style.width = "0%"; bar.style.transition = "none";
        showMsg(`+₪${j.pay.toLocaleString()} | פסיבי +₪${pBonus.toFixed(0)}`, "var(--green)");
        updateUI(); saveGame();
    }, finalTime);
}

function buyCar(n, p, s, i) {
    if (money >= p) {
        money -= p;
        carSpeed = s; // מעדכן את המהירות הגלובלית
        inventory.push({ name: n, icon: i, type: 'car' });
        showMsg(`תתחדש! מהירות העבודה עלתה ל-x${s}`, "var(--blue)");
        updateUI(); saveGame(); openTab('cars');
    } else showMsg("אין לך מספיק מזומן!", "var(--red)");
}

function buySkill(n, p, i) {
    if (money >= p) {
        money -= p;
        lifeXP += (p / 10); // לימודים נותנים XP משמעותי
        inventory.push({ name: n, icon: i, type: 'skill' });
        showMsg(`למדת ${n}! קיבלת XP בונוס.`, "var(--purple)");
        updateUI(); saveGame(); openTab('skills');
    } else showMsg("אין לך מספיק מזומן!", "var(--red)");
}
