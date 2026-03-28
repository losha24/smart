/* Smart Money Pro - js/activities.js - v5.7.6 */

let working = false;
const jobs = [
    {n:"שליח", r:180, req:"קורקינט", type:"car"},
    {n:"מאבטח", r:350, req:"רישיון נשק", type:"skill"},
    {n:"נהג מונית", r:550, req:"רכב יד 2", type:"car"},
    {n:"מתכנת", r:1500, req:"תכנות", type:"skill"},
    {n:"מנכ\"ל", r:15000, req:"מנהיגות", type:"skill"}
];

function drawWork(c) {
    let h = `
        <div class="card fade-in">
            <h3>⚒️ לוח עבודות</h3>
            <div class="progress-container" style="margin-bottom:15px;"><div id="work-progress" class="progress-bar"></div></div>
            <div class="grid-2">`;
    
    jobs.forEach(j => {
        const has = (j.type==="skill" ? skills.includes(j.req) : cars.includes(j.req));
        h += `
            <div class="card" style="text-align:center; padding:10px; border: ${has?'1px solid var(--green)':'1px solid var(--border)'}">
                <b style="font-size:0.9em;">${j.n}</b><br>
                <small style="color:var(--green);">${j.r}₪ למשמרת</small><br>
                <button class="action" style="font-size:12px; margin-top:8px;" 
                        ${!has?'disabled':''} onclick="startWork(${j.r})">
                    ${has ? 'התחל' : 'נעול'}
                </button>
                <div style="font-size:9px; opacity:0.6; margin-top:4px;">דרישה: ${j.req}</div>
            </div>`;
    });
    c.innerHTML = h + `</div></div>`;
}

function startWork(reward) {
    if(working) return; 
    working = true;
    const bar = document.getElementById("work-progress");
    let w = 0;
    
    // מהירות העבודה מושפעת מהרכב שלך (carSpeed)
    let i = setInterval(() => {
        w += (3 * carSpeed); 
        bar.style.width = w + "%";
        if(w >= 100) {
            clearInterval(i); 
            working = false; 
            bar.style.width = "0%";
            money += reward; 
            totalEarned += reward; 
            lifeXP += (reward * 0.02); // בונוס XP קטן על עבודה
            showMsg(`הרווחת ${reward}₪ ו-XP!`, "var(--green)"); 
            updateUI();
        }
    }, 50);
}

function renderGiftBtn() {
    const cont = document.getElementById("gift-container");
    const diff = Date.now() - lastGift;
    // מתנה זמינה כל 4 שעות
    if(diff < 4*60*60*1000) {
        cont.innerHTML = `<button class="action" style="width:auto; padding:5px 10px; font-size:11px; background:#64748b" disabled>🎁 בקרוב</button>`;
    } else {
        cont.innerHTML = `<button class="action" style="width:auto; padding:5px 10px; font-size:11px; background:#f59e0b" onclick="claimGift()">🎁 בונוס!</button>`;
    }
}

function claimGift() {
    lastGift = Date.now();
    const r = Math.floor(Math.random() * 20000) + 2000;
    money += r; 
    lifeXP += 100; // בונוס XP על איסוף מתנה
    showMsg(`קיבלת מתנה: ${r.toLocaleString()}₪!`, "var(--green)");
    updateUI(); 
    openTab('home');
}

function drawCasino(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <h3>🎰 הימורים וקזינו</h3>
            <p style="font-size:0.8em; opacity:0.7;">הימר על הכסף שלך - סיכוי לזכות פי 3!</p>
            <input type="number" id="bet-amt" placeholder="כמה להמר?">
            <button class="action" style="background:#8b5cf6" onclick="playCasino()">שחק (35% סיכוי)</button>
        </div>`;
}

function playCasino() {
    const a = parseInt(document.getElementById('bet-amt').value);
    if(!a || a <= 0 || money < a) return showMsg("אין מספיק כסף", "var(--red)");
    money -= a;
    if(Math.random() < 0.35) { 
        const win = a * 3;
        money += win; 
        lifeXP += 50;
        showMsg(`וואו! זכית ב-${win.toLocaleString()}₪!`, "var(--green)"); 
    } else { 
        showMsg("הפסדת הפעם...", "var(--red)"); 
    }
    updateUI();
}
