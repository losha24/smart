/* Smart Money Pro - js/activities.js - v6.0.2 - Synced with Core Engine */
let working = false;

const jobs = [
    {n:"עובד כללי", r:250, req:null, type:null, xp:50},
    {n:"שליח קורקינט", r:400, req:"קורקינט", type:"car", xp:80},
    {n:"מאבטח", r:650, req:"רישיון נשק", type:"skill", xp:150},
    {n:"נהג מונית", r:900, req:"משפחתית", type:"car", xp:200},
    {n:"מתכנת", r:1800, req:"תכנות", type:"skill", xp:450},
    {n:"מנהל מכירות", r:3500, req:"מכירות", type:"skill", xp:800},
    {n:"טייס", r:16000, req:"מטוס", type:"car", xp:2500},
    {n:"מנכ״ל/ית", r:50000, req:"מנהיגות", type:"skill", xp:6000}
];

function drawWork(c) {
    let h = `
    <div class="card fade-in">
        <h3 style="margin-top:0;">⚒️ לוח עבודות</h3>
        <p style="font-size:12px; opacity:0.7;">השלם עבודה כדי להרוויח כסף וניסיון (XP)</p>
        <div class="progress-container" style="height:12px; margin-bottom:15px;">
            <div id="work-progress" class="progress-bar" style="width: 0%; transition: width 0.1s linear;"></div>
        </div>
        <div class="grid-2">`;
    
    jobs.forEach(j => {
        const hasReq = !j.req || (j.type === "skill" ? skills.includes(j.req) : cars.includes(j.req));
        
        h += `
        <div class="card" style="text-align:center; padding:12px; border: 1px solid var(--border); background: rgba(255,255,255,0.02);">
            <b style="font-size:14px; display:block; margin-bottom:5px;">${j.n}</b>
            <span style="color:var(--green); font-weight:bold;">${j.r.toLocaleString()}₪</span><br>
            <button class="action" 
                style="font-size:11px; padding:8px 0; margin-top:10px; height:auto;" 
                ${!hasReq || working ? 'disabled' : ''} 
                onclick="startWork(${j.r}, ${j.xp})">
                ${hasReq ? 'צא לעבודה' : '🔒 ' + j.req}
            </button>
        </div>`;
    });
    
    c.innerHTML = h + `</div></div>`;
}

function startWork(reward, xpGain) {
    if(working) return;
    working = true;
    
    document.querySelectorAll('.action').forEach(btn => btn.disabled = true);
    
    const bar = document.getElementById("work-progress");
    let w = 0;
    const speedBoost = Math.max(1, carSpeed); 
    
    let i = setInterval(() => {
        w += (2.5 * speedBoost); 
        if(bar) bar.style.width = w + "%";
        
        if(w >= 100) {
            clearInterval(i);
            working = false;
            if(bar) bar.style.width = "0%";
            
            // עדכון נתונים
            money += reward;
            lifeXP += xpGain;
            
            // בונוס וותק (Passive)
            passive += (reward * 0.005);
            
            showMsg(`💸 +${reward.toLocaleString()}₪ | ⭐ +${xpGain} XP`, "var(--green)");
            
            updateUI();
            openTab('work'); 
        }
    }, 60);
}

function renderGiftBtn() {
    const cont = document.getElementById("gift-container");
    if(!cont) return;
    
    const cooldown = 4 * 60 * 60 * 1000;
    const diff = Date.now() - lastGift;
    
    if(diff < cooldown) {
        const remainingMin = Math.ceil((cooldown - diff) / (60 * 1000));
        cont.innerHTML = `<button class="action" style="width:auto; padding:5px 10px; font-size:11px; background:rgba(255,255,255,0.05); color:gray;" disabled>🎁 ${remainingMin} ד'</button>`;
    } else {
        cont.innerHTML = `<button class="action" style="width:auto; padding:8px 15px; font-size:12px; background:var(--yellow); color:black; font-weight:bold; border:none;" onclick="claimGift()">🎁 קבל בונוס!</button>`;
    }
}

function claimGift() {
    lastGift = Date.now();
    const r = Math.floor(Math.random() * 25001) + 5000;
    money += r;
    lifeXP += 500;
    
    showMsg(`🎁 קיבלת ${r.toLocaleString()}₪ ובונוס XP!`, "var(--blue)");
    
    updateUI();
    openTab('home');
}

function drawCasino(c) {
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center;">
            <h2 style="margin-top:0; color:var(--yellow);">🎰 קזינו רויאל</h2>
            <div style="background:rgba(0,0,0,0.3); padding:25px; border-radius:20px; margin:20px 0; border:1px solid var(--border);">
                <label style="display:block; margin-bottom:10px; font-size:12px; opacity:0.8;">סכום ההימור שלך:</label>
                <input type="number" id="bet-amt" placeholder="0" 
                    style="width:100%; padding:15px; font-size:1.5em; border-radius:12px; border:none; background:var(--bg); color:var(--text); text-align:center; font-weight:bold;">
            </div>
            <button id="casino-btn" class="action" style="background:var(--yellow); color:black; font-size:18px; font-weight:bold; border:none;" onclick="playCasino()">🎰 סובב וזכה (x3)</button>
        </div>`;
}

function playCasino() {
    const input = document.getElementById('bet-amt');
    const amt = parseInt(input.value);
    
    if(!amt || amt <= 0 || money < amt) {
        showMsg("אין לך מספיק כסף להימור כזה!", "var(--red)");
        return;
    }
    
    const btn = document.getElementById('casino-btn');
    btn.disabled = true;
    money -= amt;
    updateUI();
    
    showMsg("🎰 המכונה מסתובבת...", "var(--yellow)");
    
    setTimeout(() => {
        if(Math.random() < 0.35) { 
            const win = amt * 3;
            money += win;
            lifeXP += 200;
            showMsg(`💰 בום! זכית ב-${win.toLocaleString()}₪!`, "var(--green)");
        } else { 
            showMsg("אופס... המזל לא איתך הפעם.", "var(--red)");
        }
        btn.disabled = false;
        updateUI();
        drawCasino(document.getElementById("content"));
    }, 1200);
}
