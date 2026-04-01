/* Smart Money Pro - activities.js - FULL VERSION */

const jobList = [
    { id: 'j1', name: 'ניקיון משרדים', pay: 200, xp: 20, time: 3000, icon: '🧹' },
    { id: 'j2', name: 'שליח וולט', pay: 550, xp: 45, time: 5000, icon: '🛵' },
    { id: 'j3', name: 'מאבטח מתקנים', pay: 1400, xp: 95, time: 7000, icon: '👮' },
    { id: 'j4', name: 'נהג מונית', pay: 3200, xp: 190, time: 9000, icon: '🚕' },
    { id: 'j5', name: 'מפקח עבודה', pay: 7500, xp: 420, time: 12000, icon: '📋' },
    { id: 'j6', name: 'סוהר שב"ס', pay: 16000, xp: 850, time: 15000, icon: '🚔' },
    { id: 'j7', name: 'טכנאי שטח', pay: 35000, xp: 1800, time: 18000, icon: '🔧' },
    { id: 'j8', name: 'מפתח תוכנה', pay: 85000, xp: 4500, time: 22000, icon: '💻' },
    { id: 'j9', name: 'מנהל חטיבה', pay: 220000, xp: 11000, time: 30000, icon: '🏢' },
    { id: 'j10', name: 'טייקון נדל"ן', pay: 600000, xp: 28000, time: 45000, icon: '💎' }
];

function drawWork(c) {
    if (!c) return;
    let h = `<h3 style="margin-bottom:15px;">⚒️ מרכז תעסוקה</h3>
             <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">`; // תוכן ב-2 בשורה
    
    jobList.forEach(j => {
        h += `
        <div class="card fade-in" style="text-align:center; padding:15px; background:#161616; border:1px solid #222; border-radius:12px;">
            <div style="font-size:32px; margin-bottom:8px;">${j.icon}</div>
            <b style="font-size:14px; display:block; height:35px; overflow:hidden;">${j.name}</b>
            <div style="color:var(--green); font-weight:bold; font-size:15px; margin-bottom:10px;">₪${j.pay.toLocaleString()}</div>
            
            <button class="sys-btn" id="job-${j.id}" style="width:100%; padding:8px 0; font-size:12px;" onclick="startWork('${j.id}')">
                בצע עבודה
            </button>
            
            <div id="prog-cont-${j.id}" style="display:none; height:5px; background:#000; margin-top:10px; border-radius:10px; overflow:hidden;">
                <div id="bar-${j.id}" style="height:100%; background:linear-gradient(90deg, var(--blue), #00d4ff); width:0%;"></div>
            </div>
        </div>`;
    });
    
    c.innerHTML = h + "</div>";
}

function startWork(id) {
    const j = jobList.find(x => x.id === id);
    const btn = document.getElementById(`job-${j.id}`);
    const bar = document.getElementById(`bar-${j.id}`);
    const cont = document.getElementById(`prog-cont-${j.id}`);
    
    if (!btn || !bar) return;

    // נטרול כפתור והצגת פס התקדמות
    btn.disabled = true;
    btn.innerText = "עובד...";
    cont.style.display = "block";
    
    // חישוב זמן לפי מהירות הרכב (carSpeed מגיע מ-core.js)
    let finalTime = j.time / carSpeed;
    
    // הפעלת האנימציה
    setTimeout(() => { 
        bar.style.transition = `width ${finalTime}ms linear`; 
        bar.style.width = "100%"; 
    }, 50);

    // סיום העבודה
    setTimeout(() => {
        // הוספת שכר ו-XP
        money += j.pay;
        lifeXP += j.xp;
        
        // חישוב בונוס פסיבי (40-50% מהשכר מתווסף להכנסה הפסיבית הקבועה)
        let pBonus = j.pay * (0.4 + Math.random() * 0.1);
        passive += pBonus;
        
        // איפוס כפתור וממשק
        btn.disabled = false;
        btn.innerText = "בצע עבודה";
        cont.style.display = "none";
        bar.style.width = "0%"; 
        bar.style.transition = "none";
        
        // הודעה למשתמש
        showMsg(`+₪${j.pay.toLocaleString()} | בונוס פסיבי: +₪${pBonus.toFixed(0)}`, "var(--green)");
        
        // עדכון UI ושמירה
        updateUI(); 
        saveGame();
    }, finalTime);
}

// פונקציית עזר לכישורים - גם ב-2 בשורה
function drawSkills(c) {
    const skills = [
        { n: 'ניהול זמן', p: 5000, i: '⏳', s: 1.1 },
        { n: 'תואר אקדמי', p: 25000, i: '🎓', s: 1.3 },
        { n: 'קורס תכנות', p: 100000, i: '💾', s: 1.6 },
        { n: 'יחסי ציבור', p: 500000, i: '📢', s: 2.0 }
    ];
    
    let h = `<h3>🎓 כישורים ולימודים</h3><div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">`;
    skills.forEach(s => {
        const owned = inventory.some(inv => inv.name === s.n);
        h += `
        <div class="card" style="text-align:center; padding:15px;">
            <div style="font-size:24px;">${s.i}</div>
            <b>${s.n}</b>
            <button class="sys-btn" style="width:100%; margin-top:10px;" ${owned ? 'disabled' : ''} onclick="buySkill('${s.n}', ${s.p}, ${s.s}, '${s.i}')">
                ${owned ? 'נלמד' : '₪' + s.p.toLocaleString()}
            </button>
        </div>`;
    });
    c.innerHTML = h + "</div>";
}

function buySkill(n, p, s, i) {
    if (money >= p) {
        money -= p;
        inventory.push({ name: n, icon: i, type: 'skill' });
        // שיפור מהירות עבודה גלובלי
        carSpeed *= s; 
        showMsg(`למדת ${n}! המהירות עלתה.`, "var(--purple)");
        updateUI(); saveGame(); openTab('skills');
    } else showMsg("אין מספיק כסף!", "var(--red)");
}
