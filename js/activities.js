/* Smart Money Pro - js/activities.js - v6.5.1 */

const jobList = [
    { id: 'j1', name: 'מנקה', pay: 55, xp: 20, time: 3000, icon: '🧹' },
    { id: 'j2', name: 'שליח', pay: 95, xp: 45, time: 5000, icon: '🛵' },
    { id: 'j3', name: 'מאבטח', pay: 145, xp: 65, time: 8000, icon: '🏢' },
    { id: 'j4', name: 'מאבטח חמוש', pay: 290, xp: 140, time: 10000, icon: '🔫', req: 'רישיון נשק' },
    { id: 'j5', name: 'נהג מונית', pay: 340, xp: 110, time: 12000, icon: '🚕', reqCar: true },
    { id: 'j6', name: 'סוהר', pay: 420, xp: 190, time: 14000, icon: '👮', req: 'קורס פיקודי' },
    { id: 'j7', name: 'נהג משאית', pay: 650, xp: 250, time: 16000, icon: '🚛', req: 'רישיון משאית', reqCar: true },
    { id: 'j8', name: 'מתכנת PWA', pay: 900, xp: 480, time: 20000, icon: '💻', req: 'תכנות' }
];

const skillList = [
    { name: 'רישיון נשק', price: 4500, icon: '🔫' },
    { name: 'תכנות', price: 10000, icon: '📜' },
    { name: 'רישיון משאית', price: 12000, icon: '🚛' },
    { name: 'קורס פיקודי', price: 14500, icon: '🎖️' }
];

const carList = [
    { name: 'קורקינט', price: 3000, speed: 1.2, icon: '🛴' },
    { name: 'אופנוע', price: 16000, speed: 1.6, icon: '🛵' },
    { name: 'סקודה', price: 90000, speed: 2.3, icon: '🚗' },
    { name: 'טסלה S', price: 280000, speed: 4.5, icon: '⚡' }
];

function drawWork(c) {
    let html = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-2">`;
    jobList.forEach(j => {
        const hasSkill = !j.req || skills.includes(j.req);
        const hasCar = !j.reqCar || cars.length > 0;
        const canWork = hasSkill && hasCar;
        html += `<div class="card" style="opacity:${canWork ? 1 : 0.6}">
            <div style="font-size:24px;">${j.icon}</div>
            <div style="font-weight:bold;">${j.name}</div>
            <div style="color:var(--green);">${j.pay}₪</div>
            <div id="prog-cont-${j.id}" style="display:none; height:4px; background:#333; margin:10px 0;"><div id="bar-${j.id}" style="width:0%; height:100%; background:var(--blue);"></div></div>
            <button class="sys-btn" onclick="startWork('${j.id}')" ${canWork ? '' : 'disabled'}>${canWork ? 'בצע' : 'נעול'}</button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function startWork(id) {
    const j = jobList.find(x => x.id === id);
    const actualTime = j.time / (carSpeed || 1);
    document.getElementById(`prog-cont-${id}`).style.display = "block";
    const bar = document.getElementById(`bar-${id}`);
    bar.style.transition = `width ${actualTime}ms linear`;
    setTimeout(() => bar.style.width = "100%", 10);
    setTimeout(() => {
        money += j.pay; lifeXP += j.xp;
        showMsg(`💰 +${j.pay}₪ | ✨ +${j.xp} XP`, "var(--green)");
        updateUI(); saveGame(); openTab('work');
    }, actualTime);
}

function drawSkills(c) {
    let html = `<h3>🎓 כישורים</h3><div class="grid-2">`;
    skillList.forEach(s => {
        const has = skills.includes(s.name);
        html += `<div class="card"><div>${s.icon} ${s.name}</div>
        <button class="sys-btn" onclick="buySkill('${s.name}', ${s.price})" ${has ? 'disabled' : ''}>${has ? 'נרכש' : s.price+'₪'}</button></div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buySkill(name, price) {
    if (money >= price) { money -= price; skills.push(name); saveGame(); updateUI(); drawSkills(document.getElementById('content')); }
    else { showMsg("אין מספיק כסף!", "var(--red)"); }
}

function drawCars(c) {
    let html = `<h3>🏎️ סוכנות רכב</h3><div class="grid-2">`;
    carList.forEach(car => {
        const has = cars.includes(car.name);
        html += `<div class="card"><div>${car.icon} ${car.name}</div>
        <button class="sys-btn" onclick="buyCar('${car.name}', ${car.price}, ${car.speed})" ${has ? 'disabled' : ''}>${has ? 'בבעלותך' : car.price+'₪'}</button></div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyCar(name, price, speed) {
    if (money >= price) { money -= price; cars.push(name); carSpeed = speed; saveGame(); updateUI(); drawCars(document.getElementById('content')); }
}

function drawTasks(c) {
    c.innerHTML = `<div class="card" style="text-align:center;"><h3>🎰 Casino</h3><p>המר על כספך:</p>
    <input type="number" id="gamble-amt" placeholder="סכום" class="sys-btn" style="background:#000; margin-bottom:10px;">
    <button class="action" onclick="playCasino()">שחק!</button></div>`;
}

function playCasino() {
    const amt = parseInt(document.getElementById('gamble-amt').value);
    if(amt > 0 && money >= amt) {
        money -= amt;
        if(Math.random() > 0.6) { money += amt*2; showMsg("💎 זכית!", "var(--yellow)"); }
        else { showMsg("💀 הפסדת", "var(--red)"); }
        updateUI(); saveGame();
    }
}
