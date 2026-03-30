/* Smart Money Pro - js/activities.js - v6.4.2 - Ultra Stable */

// 1. נתוני בסיס
const jobList = [
    { id: 'j1', name: 'מנקה', pay: 55, xp: 20, time: 3000, icon: '🧹' },
    { id: 'j2', name: 'שליח', pay: 95, xp: 45, time: 5000, icon: '🛵' },
    { id: 'j3', name: 'מתכנת', pay: 900, xp: 480, time: 10000, icon: '💻' }
];

const businessTypes = [
    { id: 'b1', name: 'דוכן פלאפל', basePrice: 50000, basePassive: 450, icon: '🥙' },
    { id: 'b2', name: 'מוסך רכב', basePrice: 250000, basePassive: 2800, icon: '🔧' }
];

// 2. פונקציות הציור (חייבות להיות קיימות כדי שהכפתורים ב-index יעבדו)
function drawWork(c) {
    let html = `<h3>⚒️ עבודה</h3>`;
    jobList.forEach(j => {
        html += `<button class="sys-btn" onclick="startWork('${j.id}')" style="width:100%; margin-bottom:10px;">
            ${j.icon} ${j.name} (${j.pay}₪)
        </button>
        <div id="prog-cont-${j.id}" style="display:none; width:100%; background:#444; height:10px; margin-bottom:10px;">
            <div id="bar-${j.id}" style="width:0%; height:100%; background:var(--blue);"></div>
        </div>`;
    });
    c.innerHTML = html;
}

function startWork(id) {
    const j = jobList.find(x => x.id === id);
    const container = document.getElementById(`prog-cont-${j.id}`);
    const bar = document.getElementById(`bar-${j.id}`);
    
    if(container) container.style.display = "block";
    if(bar) {
        bar.style.transition = `width ${j.time}ms linear`;
        setTimeout(() => bar.style.width = "100%", 50);
    }

    setTimeout(() => {
        money += j.pay;
        lifeXP += j.xp;
        showMsg(`+${j.pay}₪`);
        if(container) container.style.display = "none";
        if(bar) { bar.style.transition = "none"; bar.style.width = "0%"; }
        updateUI();
        saveGame();
    }, j.time);
}

function drawBusiness(c) {
    let html = `<h3>💼 עסקים</h3>`;
    businessTypes.forEach(b => {
        const myBiz = businesses.find(x => x.id === b.id);
        const lvl = myBiz ? myBiz.level : 0;
        const price = b.basePrice * (lvl + 1);
        html += `<div class="card" style="margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
            <span>${b.icon} ${b.name} (רמה ${lvl})</span>
            <button class="sys-btn" onclick="upgradeBusiness('${b.id}')">${price}₪</button>
        </div>`;
    });
    c.innerHTML = html;
}

function upgradeBusiness(id) {
    const b = businessTypes.find(x => x.id === id);
    const myBiz = businesses.find(x => x.id === id);
    const lvl = myBiz ? myBiz.level : 0;
    const price = b.basePrice * (lvl + 1);

    if (money >= price) {
        money -= price;
        passive += (b.basePassive * (lvl + 1));
        if (!myBiz) businesses.push({ id: id, level: 1 });
        else myBiz.level++;
        updateUI();
        saveGame();
        drawBusiness(document.getElementById('content'));
    } else {
        showMsg("אין מספיק כסף!", "var(--red)");
    }
}

// 3. פונקציות ריקות (כדי למנוע קריסה של שאר הכפתורים)
function drawMarket(c) { c.innerHTML = "<h3>📈 בורסה</h3><p>בקרוב...</p>"; }
function drawEstate(c) { c.innerHTML = "<h3>🏠 נדלן</h3><p>בקרוב...</p>"; }
function drawBank(c) { c.innerHTML = "<h3>🏦 בנק</h3><p>בקרוב...</p>"; }
function drawTasks(c) { c.innerHTML = "<h3>🎰 קזינו</h3><p>בקרוב...</p>"; }
function drawSkills(c) { c.innerHTML = "<h3>🎓 כישורים</h3><p>בקרוב...</p>"; }
function drawCars(c) { c.innerHTML = "<h3>🏎️ רכבים</h3><p>בקרוב...</p>"; }
function drawInvest(c) { c.innerHTML = "<h3>💰 השקעות</h3>"; }
