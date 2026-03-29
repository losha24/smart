/* Smart Money Pro - js/activities.js - v6.0.1 - Working & Rewards Update */
let working = false;

const jobs = [
    {n:"עובד כללי", r:200, req:null, type:null, xp:15},
    {n:"שליח קורקינט", r:300, req:"קורקינט", type:"car", xp:25},
    {n:"מאבטח", r:500, req:"רישיון נשק", type:"skill", xp:45},
    {n:"נהג מונית", r:700, req:"משפחתית", type:"car", xp:65},
    {n:"מתכנת", r:1100, req:"תכנות", type:"skill", xp:110},
    {n:"מנהל מכירות", r:2200, req:"מכירות", type:"skill", xp:250},
    {n:"טייס", r:12000, req:"מטוס", type:"car", xp:800},
    {n:"מנכ״ל/ית", r:35000, req:"מנהיגות", type:"skill", xp:2000}
];

function drawWork(c) {
    let h = `
    <div class="card fade-in">
        <h3 style="margin-top:0;">⚒️ לוח עבודות</h3>
        <p style="font-size:12px; opacity:0.7;">השלם עבודה כדי להרוויח כסף וניסיון (XP)</p>
        <div class="progress-container">
            <div id="work-progress" class="progress-bar" style="width: 0%;"></div>
        </div>
        <div class="grid-2">`;
    
    jobs.forEach(j => {
        // בדיקת דרישות חכמה
        const hasSkill = j.type === "skill" && skills.includes(j.req);
        const hasCar = j.type === "car" && cars.includes(j.req);
        const hasReq = !j.req || hasSkill || hasCar;
        
        h += `
        <div class="card" style="text-align:center; padding:12px; border: 1px solid var(--border); background: rgba(0,0,0,0.1);">
            <b style="font-size:14px; display:block; margin-bottom:5px;">${j.n}</b>
            <span style="color:var(--green); font-weight:bold;">${j.r.toLocaleString()}₪</span><br>
            <button class="action" 
                style="font-size:11px; padding:8px 2px; margin-top:10px; height:auto;" 
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
    
    // חסימת כפתורים
    document.querySelectorAll('.action').forEach(btn => btn.disabled = true);
    
    const bar = document.getElementById("work-progress");
    let w = 0;
    
    // מהירות עבודה מושפעת מהרכב - מאוזן לגרסה 6
    const speedFactor = Math.max(1, carSpeed); 
    
    let i = setInterval(() => {
        w += (2 * speedFactor); 
        if(bar) bar.style.width = w + "%";
        
        if(w >= 100) {
            clearInterval(i);
            working = false;
            if(bar) bar.style.width = "0%";
            
            // עדכון נתונים גלובליים (מ-core.js)
            money += reward;
            totalEarned += reward;
            lifeXP += xpGain;
            
            // בונוס וותק: 0.5% מהשכר הופך להכנסה פסיבית קבועה
            passive += (reward * 0.005);
            
            showMsg(`💸 +${reward.toLocaleString()}₪ | ⭐ +${xpGain} XP`, "var(--green)");
            
            updateUI();
            openTab('work'); 
            setTimeout(() => showMsg(""), 3000);
        }
    }, 50);
}

function renderGiftBtn() {
    const cont = document.getElementById("gift-container");
    if(!cont) return;
    
    const cooldown = 4 * 60 * 60 * 1000; // 4 שעות
    const diff = Date.now() - lastGift;
    
    if(diff < cooldown) {
        const remainingMin = Math.ceil((cooldown - diff) / (60 * 1000));
        cont.innerHTML = `<button class="action" style="width:auto; padding:5px 10px; font-size:11px; background:var(--card); opacity:0.5;" disabled>🎁 ${remainingMin} ד'</button>`;
    } else {
        cont.innerHTML = `<button class="action" style="width:auto; padding:8px 15px; font-size:12px; background:var(--yellow); color:black;" onclick="claimGift()">🎁 קבל בונוס!</button>`;
    }
}

function claimGift() {
    lastGift = Date.now();
    // מתנה רנדומלית משופרת לגרסה 6 (בין 5K ל-30K)
    const r = Math.floor(Math.random() * 25001) + 5000;
    money += r;
    lifeXP += 300;
    
    showMsg(`🎁 קיבלת ${r.toLocaleString()}₪ ובונוס XP!`, "var(--blue)");
    
    updateUI();
    openTab('home');
    setTimeout(() => showMsg(""), 4000);
}

function drawCasino(c) {
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center;">
            <h2 style="margin-top:0; color:var(--yellow);">🎰 קזינו רויאל</h2>
            <p style="font-size:13px; opacity:0.8;">המר על הכסף שלך - סיכוי לזכות פי 3!</p>
            
            <div style="background:rgba(0,0,0,0.3); padding:25px; border-radius:20px; margin:20px 0; border:1px solid var(--border);">
                <label style="display:block; margin-bottom:10px; font-size:12px;">סכום ההימור שלך:</label>
                <input type="number" id="bet-amt" placeholder="0" 
                    style="width:100%; padding:15px; font-size:1.5em; border-radius:12px; border:none; background:var(--bg); color:var(--text); text-align:center; font-weight:bold;">
            </div>
            
            <button id="casino-btn" class="action" style="background:var(--yellow); color:black; font-size:18px;" onclick="playCasino()">🎰 סובב (x3)</button>
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
    
    showMsg("🎰 המכונה מסתובבת... בהצלחה!", "var(--yellow)");
    
    setTimeout(() => {
        if(Math.random() < 0.35) { 
            const win = amt * 3;
            money += win;
            lifeXP += 100;
            showMsg(`💰 בום! זכית ב-${win.toLocaleString()}₪!`, "var(--green)");
        } else { 
            showMsg("אופס... המזל לא איתך הפעם.", "var(--red)");
        }
        btn.disabled = false;
        updateUI();
    }, 1200);
}
