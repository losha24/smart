/* Smart Money Pro - js/activities.js - v6.0.0 - Working & Rewards Update */
let working = false;

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
    let h = `
    <div class="card fade-in">
        <h3>⚒️ עבודות</h3>
        <div class="progress-container">
            <div id="work-progress" class="progress-bar" style="transition: width 0.1s linear; width: 0%;"></div>
        </div>
        <div class="grid-2">`;
    
    jobs.forEach(j => {
        // בדיקת דרישות (כישורים או רכבים)
        const hasReq = !j.req || (j.type === "skill" ? skills.includes(j.req) : cars.includes(j.req));
        
        h += `
        <div class="card" style="text-align:center; padding:10px; border: 1px solid var(--border);">
            <b style="font-size:14px;">${j.n}</b><br>
            <small style="color:var(--green)">${j.r.toLocaleString()}₪</small><br>
            <button class="action" 
                style="font-size:11px; padding:8px 2px; margin-top:10px;" 
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
    
    // רענון ה-UI כדי לחסום כפתורים מיד
    const buttons = document.querySelectorAll('.action');
    buttons.forEach(btn => btn.disabled = true);
    
    const bar = document.getElementById("work-progress");
    let w = 0;
    
    // המהירות מושפעת מהרכב (carSpeed) אבל מאוזנת לגרסה 6
    const speedBoost = Math.max(1, carSpeed / 2); 
    
    let i = setInterval(() => {
        w += (3 * speedBoost); 
        if(bar) bar.style.width = w + "%";
        
        if(w >= 100) {
            clearInterval(i);
            working = false;
            if(bar) bar.style.width = "0%";
            
            // עדכון נתונים
            money += reward;
            totalEarned += reward;
            lifeXP += xpGain;
            
            // בונוס וותק: כל עבודה מוסיפה 1% מהשכר להכנסה הפסיבית הקבועה
            const seniorityBonus = reward * 0.01;
            passive += seniorityBonus;
            
            showMsg(`💸 +${reward.toLocaleString()}₪ | ⭐ +${xpGain} XP | 📈 פסיבי עלה`, "var(--green)");
            
            updateUI();
            openTab('work'); // פותח מחדש כדי לשחרר את הכפתורים
            setTimeout(() => showMsg(""), 3000);
        }
    }, 60);
}

function renderGiftBtn() {
    const cont = document.getElementById("gift-container");
    if(!cont) return;
    
    const now = Date.now();
    const diff = now - lastGift;
    const cooldown = 4 * 60 * 60 * 1000; // 4 שעות
    
    if(diff < cooldown) {
        const remainingMin = Math.ceil((cooldown - diff) / (60 * 1000));
        cont.innerHTML = `<button class="action" style="width:auto; padding:5px 12px; font-size:11px; background:var(--card); color:var(--text); opacity:0.6;" disabled>🎁 ${remainingMin} ד'</button>`;
    } else {
        cont.innerHTML = `<button class="action" style="width:auto; padding:5px 12px; font-size:11px; animation: pulse 1.5s infinite;" onclick="claimGift()">🎁 בונוס!</button>`;
    }
}

function claimGift() {
    const cooldown = 4 * 60 * 60 * 1000;
    if(Date.now() - lastGift < cooldown) return;
    
    lastGift = Date.now();
    // בונוס רנדומלי משופר לגרסה 6
    const r = Math.floor(Math.random() * 25000) + 5000;
    money += r;
    lifeXP += 250;
    
    showMsg(`🎁 קיבלת מתנה: ${r.toLocaleString()}₪ ו-250 XP!`, "var(--blue)");
    
    updateUI();
    openTab('home');
    setTimeout(() => showMsg(""), 4000);
}

function drawCasino(c) {
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center;">
            <h2 style="margin-top:0;">🎰 קזינו מזל</h2>
            <p style="font-size:0.9em; opacity:0.8;">סיכוי זכייה: 35% | פרס: פי 3</p>
            
            <div style="background:rgba(0,0,0,0.2); padding:20px; border-radius:15px; margin:15px 0;">
                <input type="number" id="bet-amt" placeholder="כמה מהמרים?" 
                    style="width:80%; padding:15px; font-size:1.2em; border-radius:10px; border:1px solid var(--border); background:var(--bg); color:var(--text); text-align:center;">
            </div>
            
            <button id="casino-btn" class="action" style="background:var(--yellow); color:black;" onclick="playCasino()">🎰 סובב את המזל (x3)</button>
            <p id="casino-result" style="margin-top:15px; font-weight:bold;"></p>
        </div>`;
}

function playCasino() {
    const btn = document.getElementById('casino-btn');
    const input = document.getElementById('bet-amt');
    const amt = parseInt(input.value);
    
    if(!amt || amt <= 0 || money < amt) {
        showMsg("אין לך מספיק כסף להימור כזה!", "var(--red)");
        return;
    }
    
    btn.disabled = true;
    money -= amt;
    updateUI();
    
    showMsg("🎰 המכונה מסתובבת...", "var(--yellow)");
    
    setTimeout(() => {
        if(Math.random() < 0.35) { 
            const win = amt * 3;
            money += win;
            lifeXP += Math.floor(amt * 0.1); // בונוס XP קטן על זכייה
            showMsg(`💰 זכית ב-${win.toLocaleString()}₪!!!`, "var(--green)");
        } else { 
            showMsg("הפסדת... אולי בפעם הבאה?", "var(--red)");
        }
        
        btn.disabled = false;
        updateUI();
        // נשארים בטאב כדי שיוכל להמר שוב מהר
    }, 800);
}
