/* Smart Money Pro - js/activities.js - v5.7.7 */
let working = false;

// רשימת עבודות מעודכנת עם שכר חדש, עובד כללי ו-XP מוגדר
const jobs = [
    {n:"עובד כללי", r:200, req:null, type:null, xp:15},
    {n:"שליח קורקינט", r:300, req:"קורקינט", type:"car", xp:25},
    {n:"מאבטח", r:500, req:"רישיון נשק", type:"skill", xp:45},
    {n:"נהג מונית", r:700, req:"משפחתית", type:"car", xp:65},
    {n:"מתכנת", r:1100, req:"תכנות", type:"skill", xp:110},
    {n:"מנהל מכירות", r:2200, req:"מכירות", type:"skill", xp:250},
    {n:"טייס", r:12000, req:"מטוס", type:"car", xp:800},
    {n:"מנכלית", r:35000, req:"מנהיגות", type:"skill", xp:2000}
];

function drawWork(c) {
    let h = `<div class="card fade-in"><h3>⚒️ עבודות</h3><div class="progress-container"><div id="work-progress" class="progress-bar"></div></div><div class="grid-2">`;
    jobs.forEach(j => {
        // עובד כללי תמיד פתוח (req: null)
        const has = !j.req || (j.type==="skill" ? skills.includes(j.req) : cars.includes(j.req));
        h += `<div class="card" style="text-align:center; padding:10px;">
                <b>${j.n}</b><br><small>${j.r}₪</small><br>
                <button class="action" style="font-size:12px;" ${!has?'disabled':''} onclick="startWork(${j.r}, ${j.xp})">${has?'עבוד':'נעול'}</button>
              </div>`;
    });
    c.innerHTML = h + `</div></div>`;
}

function startWork(reward, xpGain) {
    if(working) return; working = true;
    const bar = document.getElementById("work-progress");
    let w = 0;
    let i = setInterval(() => {
        w += (4 * carSpeed); 
        if(bar) bar.style.width = w + "%";
        if(w >= 100) {
            clearInterval(i); working = false; 
            if(bar) bar.style.width = "0%";
            
            // תגמולים
            money += reward; 
            totalEarned += reward; 
            lifeXP += xpGain; 
            
            // בונוס הכנסה פסיבית - 1% מהשכר מתווסף לצמיתות
            const pBonus = reward * 0.01;
            passive += pBonus;
            
            showMsg(`+${reward}₪ | +${xpGain} XP | +${pBonus.toFixed(1)} פסיבי`, "var(--green)"); 
            updateUI();
        }
    }, 50);
}

function renderGiftBtn() {
    const cont = document.getElementById("gift-container");
    if(!cont) return;
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
    c.innerHTML = `
        <div class="card fade-in">
            <h3>🎰 קזינו</h3>
            <p style="font-size:0.8em; margin-bottom:10px;">35% סיכוי | פרס פי 3</p>
            <input type="number" id="bet-amt" placeholder="סכום הימור..." style="width:100%; margin-bottom:10px;">
            <button class="action" onclick="playCasino()">המר (x3)</button>
        </div>`;
}

function playCasino() {
    const a = parseInt(document.getElementById('bet-amt').value);
    if(!a || a <= 0 || money < a) return showMsg("סכום לא תקין או חסר כסף", "var(--red)");
    
    money -= a;
    updateUI();
    
    if(Math.random() < 0.35) { 
        const winAmt = a * 3;
        money += winAmt; 
        showMsg(`זכית ב-${winAmt.toLocaleString()}₪!`, "var(--green)"); 
    } else { 
        showMsg("הפסדת הפעם...", "var(--red)"); 
    }
    updateUI();
}
