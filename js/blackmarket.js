// Smart Money - Black Market System v9.3.1 - Full Economy Balance Pass
// ============================================================
// v9.3.1: אחוזי הזכייה במבצעי הזהב הועלו לפי בקשה - רמה 1 = 5% (היה 0.02%),
// עולה בהדרגה עד רמה 50 = 45% (הסיכוי הגבוה ביותר). ראה הגדרת goldMissions למטה.
// v9.3.0 שינויים:
//  1. תגמול פרוגרסיבי ל-17 משימות השוד (מ-v9.2.0) - ללא שינוי בלוגיקה
//  2. איזון כלכלי מלא ל-17 משימות השוד: מחיר/שלל/סיכון/חום חושבו מחדש כך שלכולן
//     תוחלת רווח (EV) חיובית וסבירה (במקום חלק מהן EV שלילי וחלק EV של 900%+)
//  3. שירותי המשטרה (4): מחיר אחיד לפי 900₪/נק' חום + 700₪/נק' פשע, עם הנחת "מבצע" ל"ביעור ראיות"
//  4. נכסים (4): מחירים תואמים לאותו תעריף; "קשרים" מתמחר דינמית לפי החום/פשע בפועל;
//     תוקן באג ב"חווה" שנתן רווח מובטח של 150% על כל לחיצה (ללא סיכון, ללא קירור)
//  5. "🕶️ מבצעי זהב" (היו "⛏️ חציבת זהב") - שונה שם כדי לא להתנגש עם כפתור החציבה בדף הבית;
//     הסיכויים חושבו מחדש כך שכל 10 הרמות יהיו ב-EV דומה (בעבר: רמה 1 הייתה EV מטורף,
//     רמה 10 הייתה EV שלילי, כי לבנת זהב = 2,000,000,000₪ והמחירים לא התאימו לזה)
// ============================================================
if (typeof window.crimeLevel === 'undefined') window.crimeLevel = 0;
if (typeof window.policeHeat === 'undefined') window.policeHeat = 0;
if (typeof window.blackMoney === 'undefined') window.blackMoney = 0;
window.gang = window.gang || localStorage.getItem('gangName') || null;
window.currentLaunderFee = window.currentLaunderFee || parseInt(localStorage.getItem('launderFee')) || 25;
window.isActionRunning = false;

// ודא ש-money קיים
if (typeof window.money === 'undefined') window.money = 0;
// goldBricks מנוהל במלואו על ידי core.js (הצהרה, שמירה/טעינה, המרה). כאן רק רשת ביטחון.
if (typeof window.goldBricks === 'undefined') window.goldBricks = 0;

// ============================================================
// מערכת תגמול פרוגרסיבי למשימות שוד
// כל אחת מ-17 משימות השוד עוקבת אחרי התגמול הנוכחי שלה בנפרד:
//   הצלחה  -> התגמול הבא עולה ב-20% (עד תקרה של 100,000,000 ₪)
//   כישלון -> התגמול הבא יורד ב-10%
// מחיר הכניסה למשימה גדל/קטן ביחס לגידול התגמול, כדי לשמור על איזון.
// ============================================================
function safeParseJSON(str, fallback) {
    try {
        const v = JSON.parse(str);
        return (v && typeof v === 'object') ? v : fallback;
    } catch (e) { return fallback; }
}

window.bmMissionBase    = window.bmMissionBase    || safeParseJSON(localStorage.getItem('bmMissionBase'), {});
window.bmMissionRewards = window.bmMissionRewards || safeParseJSON(localStorage.getItem('bmMissionRewards'), {});
window.bmGoldMissions   = window.bmGoldMissions   || safeParseJSON(localStorage.getItem('bmGoldMissions'), {});

const MISSION_REWARD_CAP  = 100000000; // 100 מיליון - תקרת תגמול למשימת שוד
const MISSION_GROWTH_RATE = 1.20;      // +20% בכל הצלחה
const MISSION_DECAY_RATE  = 0.90;      // -10% בכל כישלון

function getMissionReward(missionKey, baseLootRaw, lvl) {
    if (window.bmMissionBase[missionKey] === undefined) {
        const scaled = Math.max(1, Math.floor(baseLootRaw * (1 + (lvl - 1) * 0.12)));
        window.bmMissionBase[missionKey] = scaled;
        window.bmMissionRewards[missionKey] = scaled;
    }
    return window.bmMissionRewards[missionKey];
}

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
    localStorage.setItem('bmMissionBase', JSON.stringify(window.bmMissionBase || {}));
    localStorage.setItem('bmMissionRewards', JSON.stringify(window.bmMissionRewards || {}));
    localStorage.setItem('bmGoldMissions', JSON.stringify(window.bmGoldMissions || {}));
    if (window.gang) localStorage.setItem('gangName', window.gang);
    else localStorage.removeItem('gangName');
    if (typeof saveGame === 'function') saveGame(); // goldBricks נשמר כאן ע"י core.js
    if (typeof updateUI === 'function') updateUI();
}

function applyVolatility(num, percent = 20) {
    if (num === 0) return 0;
    const variation = (Math.random() * (percent * 2) - percent) / 100;
    return Math.floor(num * (1 + variation));
}

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
        #black-market-section .btn-gold { background: linear-gradient(160deg, #3a2b06, #1e293b) !important; border: 1px solid #facc15 !important; }
        
        #black-market-section .btn-work-bm:disabled { opacity: 0.4; filter: grayscale(1); cursor: not-allowed; }
        #black-market-section .progress-overlay-bm { position: absolute; bottom: 0; left: 0; height: 4px; background: #3b82f6; width: 0%; transition: width linear; }
        #black-market-section .btn-launder { width: 100%; background: linear-gradient(135deg, #166534, #15803d); color: #fff; padding: 14px; border-radius: 10px; border: none; cursor:pointer; font-weight:800; margin-top: 10px; }
        #black-market-section .btn-launder:disabled { opacity: 0.4; cursor: not-allowed; }
        .bm-label { font-size: 13px; color: #94a3b8; margin: 15px 0 8px 0; font-weight: bold; border-right: 3px solid #3b82f6; padding-right: 8px; text-align: right; }
        .price-tag { color: #facc15; font-size: 9px; margin-top: 4px; font-weight: bold; }
        .risk-tag { font-size: 8px; font-weight: bold; margin-top: 2px; }
        .fee-tag { color: #ffaa00; font-size: 8px; margin-top: 2px; }
        .growth-tag { color: #4ade80; font-size: 8px; margin-top: 2px; font-weight:bold; }
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

// ============================================================
// 🕶️ מבצעי זהב (בעבר "חציבת זהב" - שונה שם כדי לא להתנגש עם כפתור
// החציבה הפשוט בדף הבית). 10 רמות, נפתחות כל 5 רמות (5,10...50),
// קירור עצמאי של 4 שעות למבצע.
// הסיכויים חושבו כך שתוחלת הרווח (EV) דומה בכל הרמות: לבנת זהב שווה
// 2,000,000,000 ₪, אז ROI-יעד של כ-25% בכל רמה => chance ≈ cost*1.25 / 2e9
// ============================================================
// v9.3.1: הסיכויים הועלו לפי בקשה מפורשת - רמה 1 מתחילה ב-5% לפחות, עולה עם הרמות
// עד לסיכוי הגבוה ביותר ברמה 50. שים לב: זה הופך את התוחלת (EV) לחיובית מאוד
// בכל הרמות (עדיף מבחינת שחקן, פחות "מאוזן" מתמטית מול שווי הלבנה - 2,000,000,000₪).
const goldMissions = [
    { tier: 1,  level: 5,  name: '🕶️ מבצע זהב I',    cost: 300000,     chance: 5,   dur: '5s'  },
    { tier: 2,  level: 10, name: '🕶️ מבצע זהב II',   cost: 800000,     chance: 7,   dur: '7s'  },
    { tier: 3,  level: 15, name: '🕶️ מבצע זהב III',  cost: 2000000,    chance: 9,   dur: '9s'  },
    { tier: 4,  level: 20, name: '🕶️ מבצע זהב IV',   cost: 5000000,    chance: 12,  dur: '11s' },
    { tier: 5,  level: 25, name: '🕶️ מבצע זהב V',    cost: 12000000,   chance: 15,  dur: '13s' },
    { tier: 6,  level: 30, name: '🕶️ מבצע זהב VI',   cost: 28000000,   chance: 19,  dur: '16s' },
    { tier: 7,  level: 35, name: '🕶️ מבצע זהב VII',  cost: 60000000,   chance: 24,  dur: '19s' },
    { tier: 8,  level: 40, name: '🕶️ מבצע זהב VIII', cost: 130000000,  chance: 30,  dur: '22s' },
    { tier: 9,  level: 45, name: '🕶️ מבצע זהב IX',   cost: 280000000,  chance: 37,  dur: '26s' },
    { tier: 10, level: 50, name: '🕶️ מבצע זהב X',    cost: 600000000,  chance: 45,  dur: '30s' }
];
const GOLD_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 שעות

function renderGoldMissionBtn(g, lvl) {
    const now = Date.now();
    const lastRun = window.bmGoldMissions['g' + g.tier] || 0;
    const remaining = GOLD_COOLDOWN_MS - (now - lastRun);
    const isLockedLevel = lvl < g.level;
    const onCooldown = !isLockedLevel && remaining > 0;
    const disabled = isLockedLevel || onCooldown;

    let statusHtml;
    if (isLockedLevel) {
        statusHtml = `<div class="risk-tag" style="color:#64748b;">🔒 נדרשת רמה ${g.level}</div>`;
    } else if (onCooldown) {
        const h = Math.floor(remaining / 3600000), m = Math.floor((remaining % 3600000) / 60000);
        statusHtml = `<div class="risk-tag gold-cd" data-tier="${g.tier}" style="color:#facc15;">⏳ ${h}ש ${m}ד</div>`;
    } else {
        const chanceDisplay = g.chance < 1 ? g.chance.toFixed(2) : g.chance.toFixed(1);
        statusHtml = `<div class="risk-tag" style="color:#4ade80;">🎲 סיכוי: ${chanceDisplay}%</div>`;
    }

    return `
    <button class="btn-work-bm btn-gold" ${disabled ? 'disabled' : ''} onclick="handleBMAction(this, ${parseFloat(g.dur) * 1000}, () => goldMineAction(${g.tier}, ${g.cost}, ${g.chance}))">
        <span class="progress-overlay-bm"></span>
        <div style="position:relative; z-index:2;">
            <b style="font-size:11px; display:block;">${g.name}</b>
            <small class="price-tag">${g.cost.toLocaleString()} ₪</small>
            ${statusHtml}
        </div>
    </button>`;
}

function goldMineAction(tier, cost, chancePercent) {
    const key = 'g' + tier;
    const now = Date.now();
    const lastRun = window.bmGoldMissions[key] || 0;
    if (now - lastRun < GOLD_COOLDOWN_MS) {
        bmNotify('⏳ המבצע בקירור', 'עוד לא עברו 4 שעות מהפעם האחרונה', 'orange');
        return;
    }
    if (window.money < cost) {
        bmNotify('❌ שגיאה', `אין מספיק כסף למבצע (חסר ${(cost - window.money).toLocaleString()} ₪)`, 'red');
        return;
    }

    window.money -= cost;
    window.bmGoldMissions[key] = now;

    if (Math.random() * 100 < chancePercent) {
        window.goldBricks = (window.goldBricks || 0) + 1;
        bmNotify('🏅 מציאה נדירה!', `השגת לבנת זהב! סה"כ: ${window.goldBricks}`, 'var(--yellow)');
    } else {
        const consolation = Math.floor(cost * 0.25);
        window.blackMoney = (window.blackMoney || 0) + consolation;
        bmNotify('🕶️ המבצע נכשל', `קיבלת ${consolation.toLocaleString()} ₪ כסף שחור כפיצוי`, 'gray');
    }
}

function renderBlackMarket() {
    const mainDiv = document.getElementById("content");
    if (!mainDiv) return;
    
    const lvl = typeof getLevelData === 'function' ? getLevelData(window.lifeXP).level : 1;
    const isLocked = window.policeHeat >= 200;
    
    const baseScale = (base) => Math.floor(base * (1 + (lvl - 1) * 0.12));
    
    const renderAction = (name, basePrice, baseLoot, baseCrime, baseHeat, baseRisk, dur) => {
        const currentReward = getMissionReward(name, baseLoot, lvl);
        const baseRef = window.bmMissionBase[name] || currentReward;
        const growthRatio = baseRef > 0 ? (currentReward / baseRef) : 1;

        const vPrice = Math.floor(applyVolatility(baseScale(basePrice)) * growthRatio);
        const vRisk = Math.max(5, Math.min(95, applyVolatility(baseRisk, 30)));
        const feePercent = getRandomFee();
        const feeCost = Math.floor(currentReward * (feePercent / 100));

        const growthPct = Math.round((growthRatio - 1) * 100);
        const growthHtml = growthPct !== 0
            ? `<div class="growth-tag">${growthPct > 0 ? '📈 +' + growthPct : '📉 ' + growthPct}%</div>`
            : '';

        return renderBMBtn(name, `+${currentReward.toLocaleString()} ₪`, `() => crimeAction('${name}', ${vPrice + feeCost}, ${baseCrime}, ${baseHeat}, ${vRisk})`, dur, isLocked, false, vRisk, feePercent, feeCost, growthHtml);
    };
    
    // ⚖️ v9.3.0: כל 17 המשימות אוזנו מחדש כך שתוחלת הרווח (EV) חיובית וסבירה
    // בכולן (בעבר: משימות חינמיות היו EV של 900%+, "הברחה"/"ממשלה" היו EV שלילי)
    let content = `
    <div class="bm-label">⚡ פשיטות (התגמול עולה 20% בכל הצלחה, עד 100,000,000 ₪, ויורד 10% בכל כישלון)</div>
    <div class="bm-grid">
        ${renderAction("סמים", 8000, 18000, 5, 20, 20, "3s")}
        ${renderAction("כספומט", 4800, 12000, 10, 30, 25, "4s")}
        ${renderAction("רכב", 14000, 38000, 20, 45, 30, "5s")}
        ${renderAction("יהלומים", 47000, 185000, 50, 70, 45, "8s")}
        ${renderAction("יאכטה", 38000, 130000, 45, 80, 40, "10s")}
        ${renderAction("כופר", 38000, 95000, 35, 40, 25, "12s")}
        ${renderAction("אמנות", 91000, 280000, 60, 50, 35, "15s")}
        ${renderAction("בנק", 85000, 650000, 120, 150, 65, "20s")}
    </div>
    
    <div class="bm-label">💎 פשיטות מתקדמות</div>
    <div class="bm-grid">
        ${renderAction("🔫 נשק", 24000, 75000, 30, 55, 35, "6s")}
        ${renderAction("💳 כרטיסים", 20000, 45000, 15, 35, 20, "5s")}
        ${renderAction("📱 סייבר", 40000, 110000, 40, 50, 30, "7s")}
        ${renderAction("💊 מעבדה", 61000, 320000, 70, 90, 55, "12s")}
        ${renderAction("🚚 משאית", 21000, 55000, 25, 50, 28, "6s")}
        ${renderAction("🏦 מזוודה", 13000, 28000, 12, 25, 18, "3s")}
        ${renderAction("🥷 שוד", 83000, 520000, 90, 110, 60, "18s")}
        ${renderAction("✈️ הברחה", 75000, 380000, 100, 110, 55, "12s")}
        ${renderAction("🏛️ ממשלה", 180000, 950000, 150, 160, 45, "25s")}
    </div>

    <div class="bm-label">🚨 שירותי חירום (אדום) — תעריף אחיד: 900₪/נק' חום, 700₪/נק' פשע</div>
    <div class="bm-grid">
        ${renderBMBtn("🚔 שוחד", `${baseScale(63000).toLocaleString()} ₪`, `() => policeAction('שוחד', ${baseScale(63000)}, 70, 0)`, "3s", false, true)}
        ${renderBMBtn("🎭 מתחזה", `${baseScale(113000).toLocaleString()} ₪`, `() => policeAction('מתחזה', ${baseScale(113000)}, 110, 20)`, "5s", false, true)}
        ${renderBMBtn("📁 ניקוי", `${baseScale(97000).toLocaleString()} ₪`, `() => policeAction('ניקוי', ${baseScale(97000)}, 30, 100)`, "6s", false, true)}
        ${renderBMBtn("🔥 ראיות", `${baseScale(218000).toLocaleString()} ₪`, `() => policeAction('ביעור', ${baseScale(218000)}, 160, 140)`, "8s", false, true)}
    </div>

    <div class="bm-label">🏢 נכסים ושיפורים</div>
    <div class="bm-grid">
        ${renderBMBtn("🏠 מקלט - מוריד 80 חום", `${baseScale(72000).toLocaleString()} ₪`, `() => assetAction('מקלט', ${baseScale(72000)}, 'heat')`, "6s", false)}
        ${renderBMBtn("⛏️ חווה - ממירה כסף לשחור", `${baseScale(150000).toLocaleString()} ₪`, `() => assetAction('חווה', ${baseScale(150000)}, 'money')`, "5s", false)}
        ${renderBMBtn("🕵️ מודיע - מוריד 50 פשע", `${baseScale(45000).toLocaleString()} ₪`, `() => assetAction('מודיע', ${baseScale(45000)}, 'crime')`, "4s", false)}
        ${renderBMBtn("🤝 קשרים - מאפס חום ופשע", `${Math.floor(baseScale(50000) + window.policeHeat * 900 + window.crimeLevel * 700).toLocaleString()} ₪`, `() => assetAction('קשרים', ${Math.floor(baseScale(50000) + window.policeHeat * 900 + window.crimeLevel * 700)}, 'all')`, "7s", false)}
    </div>

    <div class="bm-label">🕶️ מבצעי זהב (לבנות שברשותך: ${window.goldBricks || 0}) — נפתח כל 5 רמות, קירור 4 שעות למבצע</div>
    <div class="bm-grid">
        ${goldMissions.map(function(g) { return renderGoldMissionBtn(g, lvl); }).join('')}
    </div>`;
    
    mainDiv.innerHTML = getBMTemplate(content, "שוק שחור");
}

function renderBMBtn(name, desc, func, dur, locked, isPolice, risk = null, feePercent = null, feeCost = null, growthHtml = '') {
    let riskColor = risk > 50 ? "#ef4444" : (risk > 30 ? "#facc15" : "#4ade80");
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
            ${growthHtml}
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
        bar.style.transition = `width ${durationMs}ms linear`;
        bar.style.width = "100%";
    }
    
    setTimeout(() => {
        if (bar) {
            bar.style.transition = "none";
            bar.style.width = "0%";
        }
        window.isActionRunning = false;
        
        if (typeof callback === 'function') {
            callback();
        } else {
            console.error("Callback is not a function:", callback);
        }
        
        saveBlackMarketData();
        renderBlackMarket();
    }, durationMs);
}

function crimeAction(type, totalCost, crimeAdd, heatAdd, risk) {
    if (window.money < totalCost) {
        bmNotify("❌ שגיאה", `אין לך מספיק מזומן (חסר ${(totalCost - window.money).toLocaleString()} ₪)`, "red");
        return;
    }
    
    window.money -= totalCost;
    const currentReward = window.bmMissionRewards[type] || 0;
    
    if (Math.random() * 100 < risk) {
        window.policeHeat = Math.min(200, window.policeHeat + Math.floor(heatAdd * 1.5));
        window.crimeLevel += 2;
        const newReward = Math.max(1, Math.floor(currentReward * MISSION_DECAY_RATE));
        window.bmMissionRewards[type] = newReward;
        bmNotify("❌ נכשלת", `הפעולה ב'${type}' נכשלה! הפסדת ${totalCost.toLocaleString()} ₪. התגמול הבא ירד ל-${newReward.toLocaleString()} ₪`, "red");
    } else {
        window.blackMoney += currentReward;
        window.crimeLevel += crimeAdd;
        window.policeHeat = Math.min(200, window.policeHeat + heatAdd);
        const newReward = Math.min(MISSION_REWARD_CAP, Math.floor(currentReward * MISSION_GROWTH_RATE));
        window.bmMissionRewards[type] = newReward;
        bmNotify("💰 הצלחה", `שלל מ'${type}': ${currentReward.toLocaleString()} ₪ (שילמת ${totalCost.toLocaleString()} ₪ דמי כניסה) | התגמול הבא: ${newReward.toLocaleString()} ₪`, "green");
    }
    
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
            // v9.3.0: תוקן באג - היה bonus=cost*1.5 (רווח מובטח של 50% בלי סיכון, ניתן לחזור כל 5 שניות).
            // עכשיו זו המרה של כסף נקי לכסף שחור בעלות של 10% (כמו עמלת המרה), לא מדפסת כסף.
            const bonus = Math.floor(cost * 0.9);
            window.blackMoney += bonus;
            bmNotify("🏢 נכס", `רכשת '${name}' - המרת ${cost.toLocaleString()} ₪ ל-${bonus.toLocaleString()} ₪ כסף שחור.`, "yellow");
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

// עדכון תזמוני של טיימרי קירור למבצעי זהב (בלי לרנדר את כל העמוד מחדש)
setInterval(function() {
    const section = document.getElementById('black-market-section');
    if (!section) return;
    let needsFullRerender = false;
    section.querySelectorAll('.gold-cd').forEach(function(el) {
        const tier = el.getAttribute('data-tier');
        const lastRun = (window.bmGoldMissions && window.bmGoldMissions['g' + tier]) || 0;
        const remaining = GOLD_COOLDOWN_MS - (Date.now() - lastRun);
        if (remaining <= 0) {
            needsFullRerender = true;
        } else {
            const h = Math.floor(remaining / 3600000), m = Math.floor((remaining % 3600000) / 60000);
            el.innerText = '⏳ ' + h + 'ש ' + m + 'ד';
        }
    });
    if (needsFullRerender) renderBlackMarket();
}, 30000);

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById("content")) {
        renderBlackMarket();
    }
});
