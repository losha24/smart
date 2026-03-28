/* Smart Money Pro - js/activities.js - v5.7.6 */
let working = false;
const jobs = [
    {n:"שליח קורקינט", r:180, req:"קורקינט", type:"car"},
    {n:"מאבטח", r:320, req:"רישיון נשק", type:"skill"},
    {n:"נהג מונית", r:500, req:"משפחתית", type:"car"},
    {n:"מתכנת", r:1100, req:"תכנות", type:"skill"},
    {n:"מנהל מכירות", r:2200, req:"מכירות", type:"skill"},
    {n:"טייס", r:12000, req:"מטוס", type:"car"},
    {n:"מנכלית", r:35000, req:"מנהיגות", type:"skill"}
];

function drawWork(c) {
    let h = `<div class="card fade-in"><h3>⚒️ לוח דרושים (2 בשורה)</h3><div class="progress-container"><div id="work-progress" class="progress-bar"></div></div><div class="grid-2">`;
    jobs.forEach(j => {
        const has = (j.type==="skill" ? skills.includes(j.req) : cars.includes(j.req));
        h += `<div class="card" style="text-align:center; padding:10px;">
                <b>${j.n}</b><br><small>${j.r}₪</small><br>
                <button class="action" style="font-size:12px;" ${!has?'disabled':''} onclick="startWork(${j.r})">${has?'עבוד':'נעול'}</button>
              </div>`;
    });
    c.innerHTML = h + `</div></div>`;
}

function startWork(reward) {
    if(working) return; working = true;
    const bar = document.getElementById("work-progress");
    let w = 0;
    let i = setInterval(() => {
        w += (4 * carSpeed); bar.style.width = w + "%";
        if(w >= 100) {
            clearInterval(i); working = false; bar.style.width = "0%";
            money += reward; totalEarned += reward; lifeXP += (reward * 0.01);
            showMsg(`+${reward}₪`, "var(--green)"); updateUI();
        }
    }, 50);
}

function renderGiftBtn() {
    const cont = document.getElementById("gift-container");
    const diff = Date.now() - lastGift;
    if(diff < 4*60*60*1000) cont.innerHTML = `<button class="action no-money" style="width:auto; padding:5px 10px; font-size:11px;" disabled>🎁 נעול</button>`;
    else cont.innerHTML = `<button class="action" style="width:auto; padding:5px 10px; font-size:11px;" onclick="claimGift()">🎁 בונוס</button>`;
}

function claimGift() {
    lastGift = Date.now();
    const r = Math.floor(Math.random() * 23501) + 1500;
    money += r; showMsg(`זכית ב-${r.toLocaleString()}₪!`, "var(--green)");
    updateUI(); openTab('home');
}

function drawCasino(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🎰 קזינו</h3><input type="number" id="bet-amt" placeholder="סכום הימור..."><button class="action" onclick="playCasino()">המר (x3)</button></div>`;
}

function playCasino() {
    const a = parseInt(document.getElementById('bet-amt').value);
    if(!a || a <= 0 || money < a) return showMsg("סכום לא תקין", "var(--red)");
    money -= a;
    if(Math.random() < 0.35) { money += a*3; showMsg("זכית פי 3!", "var(--green)"); }
    else showMsg("הפסדת", "var(--red)");
    updateUI();
}
