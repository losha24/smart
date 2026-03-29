/* Smart Money Pro - js/activities.js - v6.0.5 - Work Progress & Dynamic Casino */

// --- מאגרי נתונים ---
const jobList = [
    { id: 'j1', name: 'מנקה', pay: 55, xp: 20, time: 3000, icon: '🧹' },
    { id: 'j2', name: 'שליח', pay: 95, xp: 45, time: 5000, icon: '🛵' },
    { id: 'j3', name: 'מאבטח', pay: 145, xp: 65, time: 8000, icon: '🏢' },
    { id: 'j4', name: 'מאבטח חמוש', pay: 290, xp: 140, time: 10000, icon: '🔫', req: 'רישיון נשק' },
    { id: 'j5', name: 'נהג מונית', pay: 340, xp: 110, time: 12000, icon: '🚕', reqCar: true },
    { id: 'j6', name: 'סוהר', pay: 420, xp: 190, time: 14000, icon: '👮', req: 'קורס פיקודי' },
    { id: 'j7', name: 'נהג משאית', pay: 650, xp: 250, time: 16000, icon: '🚛', req: 'רישיון משאית', reqCar: true },
    { id: 'j8', name: 'מתכנת PWA', pay: 900, xp: 480, time: 20000, icon: '💻', req: 'תכנות' },
    { id: 'j9', name: 'מנהל רשת', pay: 1750, xp: 850, time: 25000, icon: '🌐', req: 'ניהול רשת' },
    { id: 'j10', name: 'ארכיטקט', pay: 3500, xp: 1500, time: 35000, icon: '🏛️', req: 'ניהול טכנולוגי' }
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

// --- פונקציות ציור ---

function drawWork(c) {
    let html = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-2">`;
    jobList.forEach(j => {
        const hasSkill = !j.req || skills.includes(j.req);
        const hasCar = !j.reqCar || cars.length > 0;
        const canWork = hasSkill && hasCar;

        html += `
            <div class="card fade-in" style="text-align:center; opacity:${canWork ? 1 : 0.6}; border-top: 3px solid ${canWork ? 'var(--blue)' : '#444'}">
                <div style="font-size:26px; margin-bottom:5px;">${j.icon}</div>
                <div style="font-weight:bold; font-size:13px; min-height:32px;">${j.name}</div>
                <div style="color:var(--green); font-size:12px; margin-bottom:8px;">${j.pay.toLocaleString()}₪</div>
                
                <div id="prog-cont-${j.id}" style="display:none; width:100%; background:#1e293b; height:6px; border-radius:3px; margin-bottom:10px; overflow:hidden;">
                    <div id="bar-${j.id}" style="width:0%; height:100%; background:var(--blue); transition: width linear;"></div>
                </div>

                <button class="sys-btn" id="job-${j.id}" style="width:100%;" onclick="startWork('${j.id}')" ${canWork ? '' : 'disabled'}>
                    ${canWork ? 'בצע עבודה' : 'נעול'}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function startWork(id) {
    const j = jobList.find(x => x.id === id);
    if (!j) return;
    
    const btn = document.getElementById(`job-${j.id}`);
    const container = document.getElementById(`prog-cont-${j.id}`);
    const bar = document.getElementById(`bar-${j.id}`);
    
    // חישוב זמן לפי מהירות רכב
    const actualTime = j.time / (carSpeed || 1);

    if(btn) btn.disabled = true;
    if(container) container.style.display = "block";
    
    // אנימציה של הפס
    setTimeout(() => { if(bar) bar.style.transition = `width ${actualTime}ms linear`; if(bar) bar.style.width = "100%"; }, 50);

    setTimeout(() => {
        money += j.pay;
        lifeXP += j.xp;
        
        // בונוס פסיבי של 1% משווי העבודה
        const passiveBonus = Math.floor(j.pay * 0.01);
        passive += passiveBonus;

        showMsg(`סיימת! +${j.pay}₪ ו-+${passiveBonus}₪ הכנסה פסיבית`, "var(--green)");
        
        // איפוס תצוגה
        if(btn) btn.disabled = false;
        if(container) container.style.display = "none";
        if(bar) { bar.style.transition = "none"; bar.style.width = "0%"; }
        
        updateUI();
        saveGame();
    }, actualTime);
}

function drawTasks(c) {
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center; padding:20px; border: 2px dashed var(--yellow);">
            <div style="font-size:50px; margin-bottom:10px;">🎰</div>
            <h3 style="color:var(--yellow); margin-top:0;">Smart-Luck Casino</h3>
            <p style="font-size:12px; opacity:0.8;">הזן סכום להימור:</p>
            <input type="number" id="gamble-amt" placeholder="סכום הימור..." 
                style="width:80%; padding:12px; margin-bottom:15px; border-radius:8px; text-align:center; background:rgba(0,0,0,0.3); color:white; border:1px solid var(--border);">
            <div id="casino-anim" style="height:30px; margin-bottom:15px; font-weight:bold;"></div>
            <button class="action" style="background:var(--yellow); color:black; font-weight:bold; width:100%;" onclick="playCasino()">שלח הימור!</button>
        </div>`;
}

function playCasino() {
    const input = document.getElementById('gamble-amt');
    const amt = parseInt(input.value);
    
    if(!amt || amt <= 0 || amt > money) return showMsg("סכום לא חוקי או חסר כסף", "var(--red)");

    money -= amt;
    updateUI();
    
    const res = document.getElementById('casino-anim');
    res.innerText = "🎲 מסובב את הגלגל...";
    
    setTimeout(() => {
        if (Math.random() > 0.55) {
            const win = amt * 2;
            money += win;
            res.innerText = `💰 זכית ב-${win.toLocaleString()}₪!`;
            res.style.color = "var(--green)";
        } else {
            res.innerText = "❌ הפסדת, נסה שוב...";
            res.style.color = "var(--red)";
        }
        input.value = '';
        updateUI(); saveGame();
    }, 1000);
}

// שאר הפונקציות נשארות זהות
function drawSkills(c) {
    let html = `<h3>🎓 הכשרה ולימודים</h3><div class="grid-2">`;
    skillList.forEach(s => {
        const has = skills.includes(s.name);
        html += `
            <div class="card fade-in" style="text-align:center; border: 1px solid ${has ? 'var(--green)' : 'var(--border)'}">
                <div style="font-size:26px; margin-bottom:5px;">${s.icon}</div>
                <div style="font-size:12px; font-weight:bold; min-height:30px;">${s.name}</div>
                <button class="sys-btn" style="width:100%; margin-top:5px;" onclick="buySkill('${s.name}', ${s.price})" ${has ? 'disabled' : ''}>
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

function buySkill(name, price) {
    if (money >= price) {
        money -= price;
        skills.push(name);
        showMsg(`למדת: ${name}`, "var(--green)");
        saveGame(); updateUI(); drawSkills(document.getElementById('content'));
    } else { showMsg("אין מספיק כסף!", "var(--red)"); }
}

function buyCar(name, price, speed) {
    if (money >= price) {
        money -= price;
        cars.push(name);
        carSpeed = speed; 
        showMsg(`תתחדש על ה${name}!`, "var(--green)");
        saveGame(); updateUI(); drawCars(document.getElementById('content'));
    } else { showMsg("אין מספיק כסף!", "var(--red)"); }
}

function getDailyGift() {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    if (now - lastGift > day) {
        money += 2000;
        lastGift = now;
        showMsg(`מתנה יומית: 2,000₪`, "var(--yellow)");
        saveGame(); updateUI(); openTab('home');
    } else { showMsg("כבר קיבלת מתנה היום", "var(--white)"); }
}
