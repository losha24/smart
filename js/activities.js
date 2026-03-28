/* Smart Money Pro - js/activities.js - v5.7.6 */

let working = false;
const jobs = [
    {n:"שליח", r:180, req:"קורקינט", type:"car"},
    {n:"מאבטח", r:350, req:"רישיון נשק", type:"skill"},
    {n:"מתכנת", r:1500, req:"תכנות", type:"skill"},
    {n:"מנכ\"ל", r:15000, req:"מנהיגות", type:"skill"}
];

window.drawWork = function(c) {
    let h = `<div class="card fade-in"><h3>⚒️ עבודה</h3>
             <div class="progress-container"><div id="work-progress" class="progress-bar"></div></div>
             <div class="grid-2">`;
    jobs.forEach(j => {
        const has = (j.type==="skill" ? skills.includes(j.req) : cars.includes(j.req));
        h += `
            <div class="card" style="text-align:center; padding:10px;">
                <b>${j.n}</b><br><small style="color:var(--green);">${j.r}₪</small><br>
                <button class="action" style="font-size:12px; margin-top:8px;" 
                        ${!has?'disabled':''} onclick="window.startWork(${j.r})">${has?'התחל':'נעול'}</button>
            </div>`;
    });
    c.innerHTML = h + `</div></div>`;
};

window.startWork = function(reward) {
    if(working) return; working = true;
    const bar = document.getElementById("work-progress");
    let w = 0;
    let i = setInterval(() => {
        w += (4 * carSpeed); 
        if(bar) bar.style.width = w + "%";
        if(w >= 100) {
            clearInterval(i); working = false; 
            if(bar) bar.style.width = "0%";
            money += reward; totalEarned += reward; lifeXP += (reward * 0.02);
            window.showMsg(`הרווחת ${reward}₪!`, "var(--green)"); 
            window.updateUI();
        }
    }, 50);
};

window.renderGiftBtn = function() {
    const cont = document.getElementById("gift-container");
    if(!cont) return;
    const diff = Date.now() - lastGift;
    if(diff < 4*60*60*1000) {
        cont.innerHTML = `<button class="action" style="width:auto; padding:5px 10px; font-size:11px; background:#64748b" disabled>🎁 בקרוב</button>`;
    } else {
        cont.innerHTML = `<button class="action" style="width:auto; padding:5px 10px; font-size:11px; background:#f59e0b" onclick="window.claimGift()">🎁 בונוס!</button>`;
    }
};

window.claimGift = function() {
    window.lastGift = Date.now();
    const r = Math.floor(Math.random() * 15000) + 2000;
    money += r; lifeXP += 150;
    window.showMsg(`קיבלת ${r}₪!`, "var(--green)");
    window.updateUI(); window.openTab('home');
};

window.drawCasino = function(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <h3>🎰 קזינו</h3>
            <input type="number" id="bet-amt" placeholder="סכום הימור...">
            <button class="action" style="background:#8b5cf6" onclick="window.playCasino()">המר (X3)</button>
        </div>`;
};

window.playCasino = function() {
    const a = parseInt(document.getElementById('bet-amt').value);
    if(!a || a <= 0 || money < a) return window.showMsg("אין מספיק כסף", "var(--red)");
    money -= a;
    if(Math.random() < 0.33) { 
        money += (a * 3); lifeXP += 50;
        window.showMsg("זכית ב-" + (a*3) + "₪!", "var(--green)"); 
    } else window.showMsg("הפסדת...", "var(--red)");
    window.updateUI();
};
