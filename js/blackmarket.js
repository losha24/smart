// Smart Money - Black Market System v9.0.0 - The Volatile Syndicate
// ============================================================

window.crimeLevel = parseInt(localStorage.getItem('crimeLevel')) || 0;
window.policeHeat = parseInt(localStorage.getItem('policeHeat')) || 0;
window.blackMoney = parseInt(localStorage.getItem('blackMoney')) || 0;
window.gang = localStorage.getItem('gangName') || null;
window.currentLaunderFee = parseInt(localStorage.getItem('launderFee')) || 25;
window.isActionRunning = false;

// ודא ש-money קיים
if (typeof window.money === 'undefined') window.money = 0;

function bmNotify(title, detail, color) {
    if (typeof showMsg === 'function') {
        showMsg(`${title} | ${detail}`, color);
    } else {
        console.log(`${title}: ${detail}`);
    }
}

function saveBlackMarketData() {
    localStorage.setItem('crimeLevel', window.crimeLevel);
    localStorage.setItem('policeHeat', window.policeHeat);
    localStorage.setItem('blackMoney', window.blackMoney);
    localStorage.setItem('launderFee', window.currentLaunderFee);
    if (window.gang) localStorage.setItem('gangName', window.gang);
    else localStorage.removeItem('gangName');
    if (typeof saveGame === 'function') saveGame();
    if (typeof updateUI === 'function') updateUI();
}

// פונקציית עזר ליצירת תנודתיות (משנה מספר בטווח של אחוזים)
function applyVolatility(num, percent = 20) {
    if (num === 0) return 0;
    const variation = (Math.random() * (percent * 2) - percent) / 100;
    return Math.floor(num * (1 + variation));
}

// פונקציה לחישוב עמלה אקראית בין 1-10 אחוז
function getRandomFee() {
    return Math.floor(Math.random() * 10) + 1; // 1-10%
}

function getBMTemplate(contentHTML, title) {
    const isLocked = window.policeHeat >= 200;
    return `
    <style>
        #black-market-section { background: #0a0f1e; color: #fff; padding: 15px; border-radius: 12px; font-family: sans-serif; direction: rtl; }
        #black-market-section .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
        #black-market-section .stat-box { background: rgba(30, 41, 59, 0.8); border-radius: 8px; padding: 10px; text-align: center; border-bottom: 2px solid #475569; }
        #black-market-section .bm-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        #black-market-section .btn-work-bm { position: relative; background: #1e293b; border-radius: 10px; padding: 12px 4px; text-align: center; cursor: pointer; overflow: hidden; color: #fff; min-height: 100px; width: 100%; border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; justify-content: center; align-items: center; transition: transform 0.1s; }
        #black-market-section .btn-work-bm:active { transform: scale(0.95); }
        
        #black-market-section .btn-police { background: #7f1d1d !important; border: 1px solid #ef4444 !important; }
        #black-market-section .btn-police:hover { background: #991b1b !important; }
        
        #black-market-section .btn-work-bm:disabled { opacity: 0.4; filter: grayscale(1); cursor: not-allowed; }
        #black-market-section .progress-overlay-bm { position: absolute; bottom: 0; left: 0; height: 4px; background: #3b82f6; width: 0%; transition: width linear; }
        #black-market-section .btn-launder { width: 100%; background: linear-gradient(135deg, #166534, #15803d); color: #fff; padding: 14px; border-radius: 10px; border: none; cursor:pointer; font-weight:800; margin-top: 10px; }
        #black-market-section .btn-launder:disabled { opacity: 0.4; cursor: not-allowed; }
        .bm-label { font-size: 13px; color: #94a3b8; margin: 15px 0 8px 0; font-weight: bold; border-right: 3px solid #3b82f6; padding-right: 8px; text-align: right; }
        .price-tag { color: #facc15; font-size: 9px; margin-top: 4px; font-weight: bold; }
        .risk-tag { font-size: 8px; font-weight: bold; margin-top: 2px; }
        .fee-tag { color: #ffaa00; font-size: 8px; margin-top: 2px; }
    </style>
    <div id="black-market-section" class="fade-in">
        <div class="section-header" style="text-align:center; margin-bottom:15px;"><h2>${title}</h2></div>

        ${isLocked ? `<div style="background:rgba(239,68,68,0.2); border:1px solid #ef4444; color:#ef4444; padding:8px; border-radius:8px; text-align:center; margin-bottom:12px; font-size:13px;">🚨 האזור תחת מצור משטרתי!</div>` : ''}

        <div class="stats-grid">
            <div class="stat-box"><small style="color:#94a3b8;">רמת פשע</small><br><b style="color:#ef4444;">${window.crimeLevel}</b></div>
            <div class="stat-box"><small style="color:#94a3b8;">חום משטרה</small><br><b style="color:${isLocked?'#ef4444':'#ffaa00'};">${window.policeHeat.toFixed(0)}/200</b></div>
        </div>

        <div style="background:rgba(34,197,94,0.1); padding:12px; border-radius:10px; text-align:center; border: 1px solid rgba(34,197,94,0.2); margin-bottom:15px;">
            <small style="color:#cbd5e1;">💰 מזומן שחור להלבנה</small><br>
            <b style="font-size: 22px; color:#22c55e;">${Math.floor(window.blackMoney).toLocaleString()} ₪</b>
        </div>

        <div class="card" style="background:rgba(255,255,255,0.02); padding:12px; border-radius:10px; margin-bottom:15px;">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:14px;">
                <span>🧼 עמלה: <b style="color:${window.currentLaunderFee > 30 ? '#ef4444':'#4ade80'}">${window.currentLaunderFee}%</b></span>
                <button onclick="launderMoney()" class="btn-launder" style="width:auto; margin:0; padding:8px 15px; font-size:13px;" ${isLocked || window.blackMoney <= 0 ? 'disabled' : ''}>הלבן הון</button>
            </div>
        </div>

        ${contentHTML}
    </div>`;
}

function renderBlackMarket() {
    const mainDiv = document.getElementById("content");
    if (!mainDiv) return;
    
    const lvl = typeof getLevelData === 'function' ? getLevelData(window.lifeXP).level : 1;
    const isLocked = window.policeHeat >= 200;
    
    // בסיס סקיילינג לפי רמה
    const baseScale = (base) => Math.floor(base * (1 + (lvl - 1) * 0.12));
    
    // פונקציית עזר ליצירת כפתור עם נתונים משתנים (Volatility)
    const renderAction = (name, basePrice, baseLoot, baseCrime, baseHeat, baseRisk, dur) => {
        const vPrice = applyVolatility(baseScale(basePrice));
        const vLoot = applyVolatility(baseScale(baseLoot));
        const vRisk = Math.max(5, Math.min(95, applyVolatility(baseRisk, 30))); // סיכון משתנה ב-30%
        const feePercent = getRandomFee(); // עמלה אקראית 1-10%
        const feeCost = Math.floor(vLoot * (feePercent / 100)); // עלות לפי אחוז מהשלל הפוטנציאלי
        
        return renderBMBtn(name, `+${vLoot.toLocaleString()} ₪`, `() => crimeAction('${name}', ${vPrice + feeCost}, ${vLoot}, ${baseCrime}, ${baseHeat}, ${vRisk})`, dur, isLocked, false, vRisk, feePercent, feeCost);
    };
    
    let content = `
    <div class="bm-label">⚡ פשיטות (מחירים וסיכונים משתנים)</div>
    <div class="bm-grid">
        ${renderAction("סמים", 5000, 18000, 5, 20, 20, "3s")}
        ${renderAction("כספומט", 0, 12000, 10, 30, 25, "4s")}
        ${renderAction("רכב", 0, 38000, 20, 45, 30, "5s")}
        ${renderAction("יהלומים", 40000, 185000, 50, 70, 45, "8s")}
        ${renderAction("יאכטה", 0, 130000, 45, 80, 40, "10s")}
        ${renderAction("כופר", 0, 95000, 35, 40, 25, "12s")}
        ${renderAction("אמנות", 60000, 280000, 60, 50, 35, "15s")}
        ${renderAction("בנק", 80000, 650000, 120, 180, 65, "20s")}
    </div>
    
    <div class="bm-label">💎 פשיטות מתקדמות</div>
    <div class="bm-grid">
        ${renderAction("🔫 נשק", 25000, 75000, 30, 55, 35, "6s")}
        ${renderAction("💳 כרטיסים", 15000, 45000, 15, 35, 20, "5s")}
        ${renderAction("📱 סייבר", 30000, 110000, 40, 50, 30, "7s")}
        ${renderAction("💊 מעבדה", 100000, 320000, 70, 90, 55, "12s")}
        ${renderAction("🚚 משאית", 0, 55000, 25, 50, 28, "6s")}
        ${renderAction("🏦 מזוודה", 0, 28000, 12, 25, 18, "3s")}
        ${renderAction("💎 שוד", 120000, 520000, 90, 110, 60, "18s")}
        ${renderAction("✈️ הברחה", 75000, 380000, 100, 140, 75, "12s")}
        ${renderAction("🏛️ ממשלה", 250000, 950000, 150, 200, 80, "25s")}
    </div>

    <div class="bm-label">🚨 שירותי חירום (אדום)</div>
    <div class="bm-grid">
        ${renderBMBtn("🚔 שוחד", `${baseScale(25000).toLocaleString()} ₪`, `() => policeAction('שוחד', ${baseScale(25000)}, 120, 0)`, "3s", false, true)}
        ${renderBMBtn("📁 ניקוי", `${baseScale(150000).toLocaleString()} ₪`, `() => policeAction('ניקוי', ${baseScale(150000)}, 100, 50)`, "6s", false, true)}
        ${renderBMBtn("🎭 מתחזה", `${baseScale(110000).toLocaleString()} ₪`, `() => policeAction('מתחזה', ${baseScale(110000)}, 100, 40)`, "5s", false, true)}
        ${renderBMBtn("🔥 ראיות", `${baseScale(180000).toLocaleString()} ₪`, `() => policeAction('ביעור', ${baseScale(180000)}, 150, 150)`, "8s", false, true)}
    </div>

    <div class="bm-label">🏢 נכסים<div class="bm-label">🏢 נכסים ושיפורים</div>
    <div class="bm-grid">
        ${renderBMBtn("🏠 מקלט - מוריד 80 חום", `${baseScale(250000).toLocaleString()} ₪`, `() => assetAction('מקלט', ${baseScale(250000)}, 'heat')`, "6s", false)}
        ${renderBMBtn("⛏️ חווה - מפיקה כסף שחור", `${baseScale(150000).toLocaleString()} ₪`, `() => assetAction('חווה', ${baseScale(150000)}, 'money')`, "5s", false)}
        ${renderBMBtn("🕵️ מודיע - מוריד 50 פשע", `${baseScale(200000).toLocaleString()} ₪`, `() => assetAction('מודיע', ${baseScale(200000)}, 'crime')`, "4s", false)}
        ${renderBMBtn("🤝 קשרים - מאפס חום ופשע", `${baseScale(350000).toLocaleString()} ₪`, `() => assetAction('קשרים', ${baseScale(350000)}, 'all')`, "7s", false)}
    </div>`;
    
    mainDiv.innerHTML = getBMTemplate(content, "שוק שחור");
}

function renderBMBtn(name, desc, func, dur, locked, isPolice, risk = null, feePercent = null, feeCost = null) {
    let riskColor = risk > 50 ? "#ef4444" : (risk > 30 ? "#facc15" : "#4ade80");
    
    // המרת משך זמן למספר מילישניות
    const durationMs = parseFloat(dur) * 1000;
    
    let feeHtml = '';
    if (feePercent !== null && feeCost !== null) {
        feeHtml = `<div class="fee-tag">💰 דמי כניסה: ${feePercent}% (${feeCost.toLocaleString()} ₪)</div>`;
    }
    
    return `
    <button class="btn-work-bm ${isPolice ? 'btn-police' : ''}" ${locked ? 'disabled' : ''} onclick="handleBMAction(this, ${durationMs}, ${func})">
        <span class="progress-overlay-bm"></span>
        <div style="position:relative; z-index:2;">
            <b style="font-size:11px; display:block;">${name}</b>
            <small class="price-tag">${desc}</small>
            ${feeHtml}
            ${risk ? `<div class="risk-tag" style="color:${riskColor}">⚠️ סיכון: ${risk}%</div>` : ''}
        </div>
    </button>`;
}

function handleBMAction(btn, durationMs, callback) {
    if (window.isActionRunning) {
        bmNotify("⏳ המתן", "פעולה כבר מתבצעת", "orange");
        return;
    }
    
    window.isActionRunning = true;
    let bar = btn.querySelector('.progress-overlay-bm');
    
    if (bar) {
        // אנימציית התקדמות
        bar.style.transition = `width ${durationMs}ms linear`;
        bar.style.width = "100%";
    }
    
    setTimeout(() => {
        if (bar) {
            bar.style.transition = "none";
            bar.style.width = "0%";
        }
        window.isActionRunning = false;
        
        // הפעלת הקולבק
        if (typeof callback === 'function') {
            callback();
        } else {
            console.error("Callback is not a function:", callback);
        }
        
        saveBlackMarketData();
        renderBlackMarket(); // רנדור מחדש כדי לעדכן מחירים וסיכונים משתנים
    }, durationMs);
}

function crimeAction(type, totalCost, loot, crimeAdd, heatAdd, risk) {
    if (window.money < totalCost) {
        bmNotify("❌ שגיאה", `אין לך מספיק מזומן (חסר ${(totalCost - window.money).toLocaleString()} ₪)`, "red");
        return;
    }
    
    window.money -= totalCost;
    
    if (Math.random() * 100 < risk) {
        // כישלון - יותר חום משטרה
        window.policeHeat = Math.min(200, window.policeHeat + Math.floor(heatAdd * 1.5));
        window.crimeLevel += 2;
        bmNotify("❌ נכשלת", `הפעולה ב'${type}' נכשלה! הפסדת ${totalCost.toLocaleString()} ₪ והמשטרה הגבירה כוחות.`, "red");
    } else {
        // הצלחה
        window.blackMoney += loot;
        window.crimeLevel += crimeAdd;
        window.policeHeat = Math.min(200, window.policeHeat + heatAdd);
        bmNotify("💰 הצלחה", `שלל מ'${type}': ${loot.toLocaleString()} ₪ (שילמת ${totalCost.toLocaleString()} ₪ דמי כניסה)`, "green");
    }
    
    // הגבלת ערכים
    window.policeHeat = Math.min(200, Math.max(0, window.policeHeat));
    window.crimeLevel = Math.max(0, window.crimeLevel);
}

function policeAction(name, cost, heatDown, crimeDown) {
    if (window.money < cost) {
        bmNotify("❌ שגיאה", `אין מספיק כסף לשוחד/שירות (חסר ${(cost - window.money).toLocaleString()} ₪)`, "red");
        return;
    }
    
    window.money -= cost;
    window.policeHeat = Math.max(0, window.policeHeat - heatDown);
    window.crimeLevel = Math.max(0, window.crimeLevel - crimeDown);
    
    let msg = "";
    if (name === "מתחזה") {
        msg = `התחפשת לשוטר והפחתת חום ב-${heatDown} נקודות! (חום עכשיו: ${window.policeHeat.toFixed(0)})`;
    } else {
        msg = `שירות '${name}' בוצע. החום ירד ל-${window.policeHeat.toFixed(0)}.`;
    }
    bmNotify("🚨 משטרה", msg, "cyan");
    
    // שמירה ורענון
    saveBlackMarketData();
    renderBlackMarket();
}

function assetAction(name, cost, effect) {
    if (window.money < cost) {
        bmNotify("❌ שגיאה", `חסר הון לרכישת הנכס (חסר ${(cost - window.money).toLocaleString()} ₪)`, "red");
        return;
    }
    
    window.money -= cost;
    
    switch (effect) {
        case 'heat':
            window.policeHeat = Math.max(0, window.policeHeat - 80);
            bmNotify("🏢 נכס", `רכשת '${name}' - חום המשטרה ירד ב-80 נקודות. (חום עכשיו: ${window.policeHeat.toFixed(0)})`, "yellow");
            break;
        case 'money':
            const bonus = Math.floor(cost * 1.5);
            window.blackMoney += bonus;
            bmNotify("🏢 נכס", `רכשת '${name}' - קיבלת ${bonus.toLocaleString()} ₪ כסף שחור.`, "yellow");
            break;
        case 'crime':
            window.crimeLevel = Math.max(0, window.crimeLevel - 50);
            bmNotify("🏢 נכס", `רכשת '${name}' - רמת הפשע ירדה ב-50 נקודות. (פשע עכשיו: ${window.crimeLevel})`, "yellow");
            break;
        case 'all':
            window.policeHeat = 0;
            window.crimeLevel = 0;
            bmNotify("🏢 נכס", `רכשת '${name}' - כל החום ורמת הפשע אופסו!`, "yellow");
            break;
    }
    
    // שמירה ורענון
    saveBlackMarketData();
    renderBlackMarket();
}

function launderMoney() {
    if (window.blackMoney <= 0) {
        bmNotify("🧼 הלבנה", "אין כסף שחור להלבנה", "red");
        return;
    }
    
    if (window.policeHeat >= 200) {
        bmNotify("🧼 הלבנה", "לא ניתן להלבין תחת מצור משטרתי!", "red");
        return;
    }
    
    const fee = window.currentLaunderFee || 25;
    const tax = window.blackMoney * (fee / 100);
    const clean = window.blackMoney - tax;
    
    window.money += clean;
    
    bmNotify("🧼 הלבנה", `הולבן ${Math.floor(clean).toLocaleString()} ₪ (עמלה: ${fee}%)`, "green");
    
    window.blackMoney = 0;
    window.currentLaunderFee = Math.floor(Math.random() * 31) + 5; // 5-35%
    
    saveBlackMarketData();
    renderBlackMarket();
}

// אתחול ראשוני
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById("content")) {
        renderBlackMarket();
    }
});
