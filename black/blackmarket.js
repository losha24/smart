// Smart Money - Black Market System v1.5 - With Auto-Save
window.crimeLevel = Number(localStorage.getItem('crimeLevel')) || 0;
window.policeHeat = Number(localStorage.getItem('policeHeat')) || 0;
window.blackMoney = Number(localStorage.getItem('blackMoney')) || 0;
window.gang = localStorage.getItem('gangName') || null; 
window.isActionRunning = false;
window.activeShipments = window.activeShipments || [];

// פונקציית ליבה לשמירת נתונים
function saveBlackMarketData() {
    localStorage.setItem('crimeLevel', window.crimeLevel);
    localStorage.setItem('policeHeat', window.policeHeat);
    localStorage.setItem('blackMoney', window.blackMoney);
    if (window.gang) {
        localStorage.setItem('gangName', window.gang);
    } else {
        localStorage.removeItem('gangName');
    }
    
    // סנכרון עם מערכת השמירה הכללית
    if (typeof saveGame === 'function') saveGame();
}

function renderBlackMarket() {
    let mainContent = document.getElementById("content");
    if (!mainContent) return;

    const lvl = typeof getLevelData === 'function' ? getLevelData(window.lifeXP).level : 1;
    let docsPrice = 2000 + (window.crimeLevel * 150) + (lvl * 300);
    let bribePrice = 5000 + (window.crimeLevel * 200) + (lvl * 400);

    let html = `
    <style>
        .btn-work { position: relative; overflow: hidden; transition: all 0.2s; }
        .progress-overlay { position: absolute; bottom: 0; left: 0; height: 4px; background: var(--blue); width: 0%; transition: width linear; }
        .gang-card { border: 1px solid #444; padding: 10px; border-radius: 8px; margin-bottom: 10px; background: rgba(255,255,255,0.02); }
        .gang-active { border-color: var(--blue); background: rgba(59, 130, 246, 0.1); }
    </style>

    <div class="section-header fade-in">
        <h2 style="color: #ff4d4d; text-shadow: 0 0 10px rgba(255,77,77,0.3);">🕶️ שוק שחור</h2>
    </div>

    <div class="card fade-in" style="border-left: 4px solid #ff4d4d;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: center;">
            <div class="stat-box">
                <small>רמת פשע</small><br><b>${window.crimeLevel}</b>
            </div>
            <div class="stat-box">
                <small>חום משטרה</small><br><b style="color:#ffaa00;">${window.policeHeat}%</b>
            </div>
        </div>
        <div style="margin-top:10px; background:rgba(34,197,94,0.1); padding:10px; border-radius:8px; text-align:center;">
            <small>💰 כסף שחור: </small><b>${Math.floor(window.blackMoney).toLocaleString()} ₪</b>
        </div>
    </div>

    <div class="card fade-in">
        <h3 style="font-size:15px; margin-bottom:12px;">⚡ פעולות פליליות</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            ${renderCriminalButton("📄 מסמכים", docsPrice, "buyFakeDocuments()", "2s")}
            ${renderCriminalButton("💊 עסקת סמים", "סיכון גבוה", "smuggleDrugs()", "4s")}
            ${renderCriminalButton("🏦 שוד כספומט", "מזומן מהיר", "robATM()", "5s")}
            ${renderCriminalButton("🚗 גניבת רכב", "רמת פשע ++", "stealCar()", "6s")}
            ${renderCriminalButton("💻 פריצה לשרת", "כסף שחור +", "hackCrypto()", "8s")}
            ${renderCriminalButton("🎰 הימורים לא חוקיים", "50/50 סיכוי", "illegalGamble()", "3s")}
            ${renderCriminalButton("📦 מכירת נשק", "רווח ענק", "sellArms()", "10s")}
            ${renderCriminalButton("🚔 שוחד שוטר", bribePrice, "bribePolice()", "3s")}
        </div>
        <button class="btn-buy" onclick="launderMoney()" style="width:100%; margin-top:15px; background:#166534;">🧼 הלבנת הון (25% עמלה)</button>
    </div>

    <div class="card fade-in">
        <h3 style="font-size:15px; margin-bottom:12px;">👥 משפחות פשע</h3>
        <div id="gang-list">
            ${renderGang("הקוזה נוסטרה", "בונוס: +20% הלבנת הון", 10)}
            ${renderGang("היאקוזה", "בונוס: -15% חום משטרה", 15)}
            ${renderGang("הקרטל המקסיקני", "בונוס: +25% רווח מסמים", 20)}
            ${renderGang("המאפיה הרוסית", "בונוס: הגנה מפני קנסות", 25)}
        </div>
        ${window.gang ? `<button onclick="leaveGang()" style="width:100%; background:#451a1a; color:#ef4444; border:none; padding:8px; border-radius:5px; margin-top:5px; cursor:pointer;">עזוב משפחה (מאבד בונוסים)</button>` : ''}
    </div>
    `;

    mainContent.innerHTML = html;
}

function renderCriminalButton(name, desc, func, duration) {
    return `
        <button class="btn-work" onclick="handleAction(this, '${duration}', () => ${func})">
            <span class="progress-overlay"></span>
            <div style="position:relative; z-index:2;">
                <b>${name}</b><br><small style="font-size:9px; opacity:0.8;">${desc}</small>
            </div>
        </button>
    `;
}

function handleAction(btn, duration, callback) {
    if (window.isActionRunning) return;
    window.isActionRunning = true;
    
    let overlay = btn.querySelector('.progress-overlay');
    overlay.style.transition = `width ${duration} linear`;
    overlay.style.width = "100%";

    setTimeout(() => {
        overlay.style.transition = "none";
        overlay.style.width = "0%";
        window.isActionRunning = false;
        callback();
        saveBlackMarketData(); // שמירה אוטומטית אחרי כל פעולה
    }, parseFloat(duration) * 1000);
}

// --- לוגיקת פעולות ---

function buyFakeDocuments() {
    const lvl = typeof getLevelData === 'function' ? getLevelData(window.lifeXP).level : 1;
    let cost = 2000 + (window.crimeLevel * 150) + (lvl * 300);
    if(window.money < cost) { showMsg("אין כסף", "red"); return; }
    window.money -= cost;
    window.crimeLevel += 5;
    showMsg("📄 רכשת מסמכים. רמת פשע עלתה", "yellow");
    saveBlackMarketData();
    updateUI();
    renderBlackMarket();
}

function bribePolice() {
    const lvl = typeof getLevelData === 'function' ? getLevelData(window.lifeXP).level : 1;
    let cost = 5000 + (window.crimeLevel * 200) + (lvl * 400);
    if(window.money < cost) { showMsg("אין כסף לשוחד", "red"); return; }
    
    window.money -= cost;
    let failChance = Math.min(0.4, (window.crimeLevel / 200));
    
    if(Math.random() < failChance) {
        let penaltyPercent = (Math.floor(Math.random() * 50) + 1) / 100;
        let penalty = Math.floor(window.money * penaltyPercent);
        window.money -= penalty;
        showMsg(`🚓 נתפסת משחד! קנס: ${penalty.toLocaleString()} ₪`, "red");
    } else {
        window.policeHeat = Math.max(0, window.policeHeat - 25);
        showMsg("🚔 השוחד התקבל. חום המשטרה ירד", "green");
    }
    saveBlackMarketData();
    updateUI();
    renderBlackMarket();
}

function robATM() {
    if(Math.random() < 0.3) {
        window.policeHeat += 15;
        showMsg("🚨 האזעקה הופעלה! ברחת בקושי", "red");
    } else {
        let loot = 1500 + Math.floor(Math.random() * 3000);
        window.blackMoney += loot;
        window.crimeLevel += 3;
        showMsg(`💰 שדדת כספומט! רווח: ${loot} ₪`, "green");
    }
    saveBlackMarketData();
    updateUI();
    renderBlackMarket();
}

function hackCrypto() {
    let loot = 5000 + Math.floor(Math.random() * 10000);
    window.blackMoney += loot;
    window.crimeLevel += 8;
    window.policeHeat += 5;
    showMsg(`💻 פרצת לארנק קריפטו! רווח: ${loot} ₪`, "green");
    saveBlackMarketData();
    updateUI();
}

function stealCar() {
    if(Math.random() < 0.5) {
        window.policeHeat += 20;
        showMsg("🚓 המשטרה רדפה אחריך, הרכב ננטש", "red");
    } else {
        let loot = 8000 + (window.crimeLevel * 100);
        window.blackMoney += loot;
        window.crimeLevel += 10;
        showMsg(`🚗 הרכב נמכר לפירוק! רווח: ${loot} ₪`, "green");
    }
    saveBlackMarketData();
    updateUI();
}

function illegalGamble() {
    let bet = 2000;
    if(window.money < bet) { showMsg("אין מספיק להמשך", "red"); return; }
    window.money -= bet;
    if(Math.random() > 0.5) {
        window.money += bet * 2.5;
        showMsg("🎰 זכית בהימור!", "green");
    } else {
        showMsg("🎰 הפסדת את הכסף", "red");
    }
    saveBlackMarketData();
    updateUI();
}

function sellArms() {
    let loot = 25000;
    window.blackMoney += loot;
    window.crimeLevel += 20;
    window.policeHeat += 30;
    showMsg("📦 הנשק נמסר. המשטרה בעקבותיך!", "red");
    saveBlackMarketData();
    updateUI();
}

function renderGang(name, bonus, minLevel) {
    let isActive = window.gang === name;
    return `
        <div class="gang-card ${isActive ? 'gang-active' : ''}">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <b>${name}</b><br>
                    <small style="font-size:10px; opacity:0.7;">${bonus}</small>
                </div>
                ${!window.gang ? `<button onclick="joinGang('${name}')" class="sys-btn" style="font-size:10px;">הצטרף</button>` : (isActive ? '✅' : '')}
            </div>
        </div>
    `;
}

function joinGang(name) {
    window.gang = name;
    window.crimeLevel += 20;
    showMsg(`👥 ברוך הבא למשפחת ${name}`, "blue");
    saveBlackMarketData();
    renderBlackMarket();
}

function leaveGang() {
    window.gang = null;
    window.crimeLevel = Math.max(0, window.crimeLevel - 10);
    showMsg("🚪 עזבת את המשפחה. השפעתך ירדה", "red");
    saveBlackMarketData();
    renderBlackMarket();
}

function smuggleDrugs() {
    let cost = 3000;
    if(window.money < cost) { showMsg("אין כסף לעסקה", "red"); return; }
    
    window.money -= cost;
    showMsg("💊 העסקה יצאה לדרך...", "yellow");
    
    setTimeout(() => {
        if(Math.random() < 0.4) {
            window.policeHeat += 20;
            showMsg("🚓 המשטרה פשטה על העסקה! הכסף אבד", "red");
        } else {
            let profit = 6000 + Math.floor(Math.random() * 4000);
            window.blackMoney += profit;
            window.crimeLevel += 2;
            showMsg("💰 העסקה הצליחה! רווח: " + profit.toLocaleString() + " ₪ (שחור)", "green");
        }
        saveBlackMarketData();
        updateUI();
        renderBlackMarket();
    }, 2000);
}

function launderMoney() {
    if(!window.blackMoney || window.blackMoney <= 0) {
        showMsg("אין כסף שחור להלבנה", "red");
        return;
    }
    let feePercent = (window.gang === "הקוזה נוסטרה") ? 0.15 : 0.25;
    let fee = Math.floor(window.blackMoney * feePercent);
    let clean = window.blackMoney - fee;
    
    window.bank += clean;
    window.blackMoney = 0;
    showMsg("💰 הולבן " + clean.toLocaleString() + " ₪ לתוך הבנק", "green");
    saveBlackMarketData();
    updateUI();
    renderBlackMarket();
}

function smuggleGoods() {
    startShipment("משלוח סיגריות ויהלומים", 1500, 5500, 60000, 0.25);
}

function hireThugs() {
    let cost = 5000;
    if (window.money < cost) { showMsg("אין מספיק כסף", "red"); return; }
    window.money -= cost;
    window.crimeLevel += 15;
    showMsg("🥷 גייסת בריונים - הכוח שלך גדל");
    saveBlackMarketData();
    updateUI();
    renderBlackMarket();
}

// ---------- ניהול משלוחים ----------

function startShipment(name, cost, reward, time, risk) {
    if (window.money < cost) {
        showMsg("אין מספיק כסף להוצאת המשלוח", "red");
        return;
    }
    window.money -= cost;
    window.activeShipments.push({
        name: name,
        reward: reward,
        risk: risk,
        end: Date.now() + time
    });
    showMsg("📦 משלוח יצא לדרך - המתן לסיום");
    saveBlackMarketData();
    updateUI();
    updateShipmentUI();
}

function updateShipmentUI() {
    let el = document.getElementById("shipment-list");
    if (!el) return;
    if (window.activeShipments.length === 0) {
        el.innerHTML = `<p style="opacity:0.5; text-align:center;">אין משלוחים בדרכים...</p>`;
        return;
    }

    let html = "";
    window.activeShipments.forEach((s, index) => {
        let left = Math.max(0, Math.floor((s.end - Date.now()) / 1000));
        html += `
        <div class="list-item" style="background: rgba(255,255,255,0.05); margin-bottom: 8px;">
            <div style="display:flex; justify-content:space-between;">
                <span>${s.name}</span>
                <span style="color:var(--orange);">⏳ ${left} שניות</span>
            </div>
            <div style="width:100%; height:4px; background:#222; margin-top:5px;">
                <div style="width:${Math.min(100, (1 - (left / 60)) * 100)}%; height:100%; background:var(--blue);"></div>
            </div>
        </div>`;
    });
    el.innerHTML = html;
}

setInterval(() => {
    if (!window.activeShipments || window.activeShipments.length === 0) return;
    let now = Date.now();
    let changed = false;

    for (let i = window.activeShipments.length - 1; i >= 0; i--) {
        let s = window.activeShipments[i];
        if (now >= s.end) {
            let fail = Math.random() < s.risk;
            if (fail) {
                showMsg("🚓 המשטרה החרימה משלוח!", "red");
                window.policeHeat += 20;
            } else {
                window.blackMoney = (window.blackMoney || 0) + s.reward;
                showMsg("📦 משלוח הצליח! +" + s.reward.toLocaleString() + " ₪ כסף שחור", "green");
                window.crimeLevel += 2;
            }
            window.activeShipments.splice(i, 1);
            changed = true;
        }
    }

    if (changed) {
        saveBlackMarketData();
        updateUI();
        if (document.getElementById("shipment-list")) renderBlackMarket();
    } else {
        updateShipmentUI();
    }
}, 1000);

// ---------- רקע: בונוסים ופשיטות ----------

setInterval(() => {
    if (window.gang && window.crimeLevel > 0) {
        let bonus = window.crimeLevel * 2;
        window.blackMoney = (window.blackMoney || 0) + bonus;
        saveBlackMarketData();
    }
}, 60000);

setInterval(() => {
    if (window.policeHeat >= 40) {
        let chance = window.policeHeat / 200;
        if (Math.random() < chance) {
            let loss = Math.floor(window.money * 0.25);
            window.money -= loss;
            window.policeHeat = 15;
            window.crimeLevel = Math.floor(window.crimeLevel * 0.8);
            showMsg("🚓 פשיטת משטרה! הוחרמו " + loss.toLocaleString() + " ₪", "red");
            saveBlackMarketData();
            updateUI();
            if (document.getElementById("content")) renderBlackMarket();
        }
    }
    if (window.policeHeat > 0) {
        window.policeHeat -= 1;
        saveBlackMarketData();
    }
}, 300000);
