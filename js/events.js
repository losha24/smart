/* Smart Money Pro - js/events.js - v9.8.0 - Level Scaling + Jail System */

// ============================================================
// מערכת יומן אירועים - שומרת 12 שעות אחרונות
// ============================================================
window.eventLog = JSON.parse(localStorage.getItem('eventLog') || '[]');

function addEventLog(title, resultMsg, type) {
    const entry = { title, msg: resultMsg, type, ts: Date.now() };
    window.eventLog.unshift(entry);
    const cutoff = Date.now() - 12 * 60 * 60 * 1000;
    window.eventLog = window.eventLog.filter(e => e.ts >= cutoff);
    localStorage.setItem('eventLog', JSON.stringify(window.eventLog));
}

// ============================================================
// פונקציות סקיילינג לפי רמה
// ============================================================
// רמה 1=x1 | רמה 10=x3.7 | רמה 20=x6.7 | רמה 50=x15.7
function getLevelScale() {
    const level = (typeof getLevelData === 'function')
        ? getLevelData(window.lifeXP || 0).level
        : 1;
    return Math.max(1, 1 + (level - 1) * 0.3);
}

// סכום בסיס × מכפיל רמה
function scaled(base) {
    return Math.floor(base * getLevelScale());
}

// אחוז מסכום כלשהו, עם מינימום ומקסימום מסוקיילים
function scaledPct(total, pct, minBase, maxBase) {
    const s = getLevelScale();
    const fromPct = Math.floor(total * pct);
    return Math.min(Math.floor(maxBase * s), Math.max(Math.floor(minBase * s), fromPct));
}

// ============================================================
// מערכת כלא
// ============================================================
window.jailUntil        = parseInt(localStorage.getItem('jailUntil'))       || 0;
window.jailPassiveSaved = parseFloat(localStorage.getItem('jailPassiveSaved')) || 0;

function checkJailStatus() {
    if (!window.jailUntil || Date.now() >= window.jailUntil) {
        if (window.jailPassiveSaved > 0) {
            window.passive = (window.passive || 0) + window.jailPassiveSaved;
            window.jailPassiveSaved = 0;
            window.jailUntil = 0;
            localStorage.removeItem('jailUntil');
            localStorage.removeItem('jailPassiveSaved');
            if (typeof saveGame === 'function') saveGame();
            if (typeof showMsgLong === 'function') showMsgLong('🔓 שוחררת מהכלא! ההכנסה הפסיבית חזרה.', 'var(--green)');
        }
        return false;
    }
    return true;
}

// ערבות = (רמה × 5,000) + (2% מסך כל הכסף: מזומן + בנק)
// מינימום 10,000₪ | מקסימום 50,000,000₪
function calcBailCost() {
    const level = (typeof getLevelData === 'function')
        ? getLevelData(window.lifeXP || 0).level
        : 1;
    const totalWealth = (window.money || 0) + (window.bank || 0);
    const bail = Math.floor((level * 5000) + (totalWealth * 0.02));
    return Math.max(10000, Math.min(50000000, bail));
}

function goToJail(hours) {
    const bailCost = calcBailCost();
    window.jailUntil = Date.now() + hours * 60 * 60 * 1000;
    localStorage.setItem('jailUntil', window.jailUntil);
    window.jailPassiveSaved = window.passive || 0;
    localStorage.setItem('jailPassiveSaved', window.jailPassiveSaved);
    window.passive = 0;
    if (typeof saveGame === 'function') saveGame();
    if (typeof updateUI === 'function') updateUI();
    showJailModal(hours, bailCost);
    return 'נכנסת לכלא ל-' + hours + ' שעות! פסיבי הוקפא.';
}

function showJailModal(hours, bailCost) {
    const existing = document.getElementById('jailModal');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'jailModal';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);z-index:99999;display:flex;justify-content:center;align-items:center;';

    function getTimeLeft() {
        const ms = Math.max(0, window.jailUntil - Date.now());
        const h  = Math.floor(ms / 3600000);
        const m  = Math.floor((ms % 3600000) / 60000);
        const s  = Math.floor((ms % 60000) / 1000);
        return h + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
    }

    overlay.innerHTML =
        '<div style="width:88%;max-width:320px;background:#0f172a;border-radius:16px;border:2px solid #ef4444;padding:24px;text-align:center;">' +
        '<div style="font-size:48px;margin-bottom:8px;">🔒</div>' +
        '<div style="font-size:18px;font-weight:bold;color:#ef4444;margin-bottom:8px;">אתה בכלא!</div>' +
        '<div style="font-size:13px;color:#94a3b8;margin-bottom:16px;">כל ההכנסה הפסיבית הוקפאה.<br>ישוחרר אוטומטית בעוד:</div>' +
        '<div id="jailCountdown" style="font-size:30px;font-weight:bold;color:#fff;font-family:monospace;margin-bottom:20px;">' + getTimeLeft() + '</div>' +
        '<div style="font-size:12px;color:#64748b;margin-bottom:8px;">או שלם ערבות מהבנק:</div>' +
        '<div style="font-size:16px;font-weight:bold;color:#f59e0b;margin-bottom:16px;">' + bailCost.toLocaleString() + ' ₪</div>' +
        '<div style="display:flex;gap:10px;">' +
        '<button id="jailWait" style="flex:1;padding:12px;border-radius:8px;border:1px solid #475569;background:transparent;color:#94a3b8;font-size:13px;cursor:pointer;">המתן</button>' +
        '<button id="jailBail" style="flex:1;padding:12px;border-radius:8px;border:none;background:#f59e0b;color:#000;font-size:13px;font-weight:bold;cursor:pointer;">💳 שלם ערבות</button>' +
        '</div></div>';

    document.body.appendChild(overlay);

    const interval = setInterval(function() {
        const el = document.getElementById('jailCountdown');
        if (!el) { clearInterval(interval); return; }
        if (!checkJailStatus()) { clearInterval(interval); overlay.remove(); return; }
        el.innerText = getTimeLeft();
    }, 1000);

    document.getElementById('jailWait').onclick = function() { overlay.remove(); };

    document.getElementById('jailBail').onclick = function() {
        const bc = calcBailCost(); // מחשב מחדש בזמן לחיצה
        if ((window.bank || 0) < bc) {
            if (typeof showMsg === 'function') showMsg('❌ אין מספיק כסף בבנק לערבות! (' + bc.toLocaleString() + ' ₪ דרוש)', 'var(--red)');
            return;
        }
        window.bank -= bc;
        window.passive = (window.passive || 0) + (window.jailPassiveSaved || 0);
        window.jailPassiveSaved = 0;
        window.jailUntil = 0;
        localStorage.removeItem('jailUntil');
        localStorage.removeItem('jailPassiveSaved');
        clearInterval(interval);
        overlay.remove();
        if (typeof saveGame === 'function') saveGame();
        if (typeof updateUI === 'function') updateUI();
        addEventLog('שוחררת מהכלא', 'שילמת ערבות ' + bc.toLocaleString() + ' ₪ מהבנק', 'negative');
        if (typeof showMsgLong === 'function') showMsgLong('🔓 שוחררת! שילמת ערבות ' + bc.toLocaleString() + ' ₪', 'var(--yellow)');
    };
}

// בדיקה בטעינה — אם היה בכלא לפני רענון
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (checkJailStatus()) {
            showJailModal(4, calcBailCost());
        }
    }, 600);
});

// ============================================================
// רשימת אירועים — מסוקיילים לפי רמה
// ============================================================
window.randomEvents = [

    // ✅ חיוביים

    {
        id: 'ev_bonus',
        title: 'בונוס הצטיינות',
        type: 'positive',
        action: () => {
            let amount = scaledPct(window.money, 0.1, 500, 500000);
            window.money += amount;
            return 'קיבלת בונוס של ' + amount.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_inheritance',
        title: 'ירושה מפתיעה',
        type: 'positive',
        action: () => {
            let gain = scaled(10000);
            window.money += gain;
            return 'קיבלת ' + gain.toLocaleString() + ' ₪ ירושה';
        }
    },
    {
        id: 'ev_lottery',
        title: 'זכייה בלוטו',
        type: 'positive',
        action: () => {
            let gain = scaled(5000);
            window.money += gain;
            return 'זכית ב-' + gain.toLocaleString() + ' ₪ בלוטו';
        }
    },
    {
        id: 'ev_tax_refund',
        title: 'החזר מס',
        type: 'positive',
        action: () => {
            let gain = scaled(2000);
            window.money += gain;
            return 'קיבלת החזר מס ' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_black_market_deal',
        title: 'עסקת שוק שחור',
        type: 'positive',
        action: () => {
            let gain = scaled(6500);
            window.blackMoney = (window.blackMoney || 0) + gain;
            return 'עסקה הצליחה +' + gain.toLocaleString() + ' ₪ שחור';
        }
    },
    {
        id: 'ev_insider',
        title: 'מידע פנימי',
        type: 'positive',
        action: () => {
            let gain = scaled(9000);
            window.money += gain;
            return 'מידע פנימי — רווח ' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_car_sell',
        title: 'מכירת רכב',
        type: 'positive',
        action: () => {
            let profit = scaled(4000) + Math.floor(Math.random() * scaled(2500));
            window.money += profit;
            return 'מכרת רכב ברווח ' + profit.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_realestate_boom',
        title: 'בום נדל"ן',
        type: 'positive',
        action: () => {
            const cnt = Object.values(window.estateData || {}).reduce((s, e) => s + (e.count || 0), 0);
            let gain = scaled(cnt * 1000 + 2500);
            window.money += gain;
            return 'שוק נדל"ן עלה +' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_risky_deal_win',
        title: 'עסקה מסוכנת',
        type: 'positive',
        action: () => {
            let gain = scaled(8000);
            window.money += gain;
            return 'עסקה מסוכנת הצליחה +' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_passive_boost',
        title: 'עלייה בהכנסות',
        type: 'positive',
        action: () => {
            let boost = window.passive * 0.15;
            window.passive += boost;
            setTimeout(() => { window.passive = Math.max(0, window.passive - boost); }, 180000);
            return 'הכנסה פסיבית עלתה ב-' + boost.toFixed(1) + ' ₪/ד\' ל-3 דקות';
        }
    },
    {
        id: 'ev_crypto_pump',
        title: 'עלייה בקריפטו',
        type: 'positive',
        action: () => {
            let gain = scaledPct(window.money, 0.05, 3000, 300000);
            window.money += gain;
            return 'ניצלת עלייה בקריפטו +' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_business_contract',
        title: 'חוזה עסקי גדול',
        type: 'positive',
        action: () => {
            let gain = scaled(15000);
            window.money += gain;
            return 'חתמת על חוזה חדש +' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_found_cash',
        title: 'מצאת שטרות',
        type: 'positive',
        action: () => {
            let gain = scaled(1000) + Math.floor(Math.random() * scaled(2000));
            window.money += gain;
            return 'מצאת ' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_bank_interest',
        title: 'ריבית על פיקדון',
        type: 'positive',
        action: () => {
            let interest = scaledPct(window.bank, 0.02, 100, 200000);
            window.bank += interest;
            return 'קיבלת ' + interest.toLocaleString() + ' ₪ ריבית';
        }
    },
    {
        id: 'ev_staff_bonus',
        title: 'הצלחת הצוות',
        type: 'positive',
        action: () => {
            let gain = scaled(7000);
            window.money += gain;
            return 'הצוות שלך השיג יעדים +' + gain.toLocaleString() + ' ₪';
        }
    },

    // ❌ שליליים

    {
        id: 'ev_tax_fine',
        title: 'ביקורת מס הכנסה',
        type: 'negative',
        action: () => {
            let fine = scaledPct(window.money, 0.08, 500, 400000);
            fine = Math.min(fine, window.money);
            window.money -= fine;
            window.eventLosses = (window.eventLosses || 0) + fine;
            return 'קנס מס הכנסה ' + fine.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_appliance_broken',
        title: 'תקלה בבית',
        type: 'negative',
        action: () => {
            let cost = Math.min(scaled(1200), window.money);
            window.money -= cost;
            window.eventLosses = (window.eventLosses || 0) + cost;
            return 'תיקון בית עלה ' + cost.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_passive_drop',
        title: 'משבר ניהולי',
        type: 'negative',
        action: () => {
            let lost = window.passive * 0.2;
            window.passive -= lost;
            setTimeout(() => {
                window.passive += lost;
                if (typeof showMsgLong === 'function') showMsgLong('✅ המשבר הסתיים, ההכנסה חזרה', 'var(--green)');
            }, 120000);
            return 'שביתה! פסיבי ירד ב-' + lost.toFixed(1) + ' ₪/ד\' ל-2 דקות';
        }
    },
    {
        id: 'ev_dentist',
        title: 'טיפול שיניים',
        type: 'negative',
        action: () => {
            let cost = Math.min(scaled(1500), window.money);
            window.money -= cost;
            window.eventLosses = (window.eventLosses || 0) + cost;
            return 'טיפול שיניים עלה ' + cost.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_police_raid',
        title: 'פשיטה משטרתית',
        type: 'negative',
        action: () => {
            let lost = Math.floor((window.blackMoney || 0) * 0.3);
            window.blackMoney = Math.max(0, (window.blackMoney || 0) - lost);
            return 'הוחרמו ' + lost.toLocaleString() + ' ₪ מהכסף השחור';
        }
    },
    {
        id: 'ev_car_crash',
        title: 'תאונת רכב',
        type: 'negative',
        action: () => {
            let cost = Math.min(scaled(4000), window.money);
            window.money -= cost;
            window.eventLosses = (window.eventLosses || 0) + cost;
            return 'תאונת רכב עלתה ' + cost.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_realestate_crash',
        title: 'קריסת נדל"ן',
        type: 'negative',
        action: () => {
            const cnt = Object.values(window.estateData || {}).reduce((s, e) => s + (e.count || 0), 0);
            let loss = Math.min(scaled(cnt * 800 + 1000), window.money);
            window.money -= loss;
            window.eventLosses = (window.eventLosses || 0) + loss;
            return 'שוק נדל"ן קרס -' + loss.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_arrest',
        title: 'מעצר זמני',
        type: 'negative',
        action: () => {
            window.passive = (window.passive || 0) * 0.7;
            setTimeout(() => { window.passive = (window.passive || 1) * (1 / 0.7); }, 60000);
            return 'נעצרת זמנית — פסיבי ירד ל-1 דקה';
        }
    },
    {
        id: 'ev_hacker',
        title: 'מתקפת סייבר',
        type: 'negative',
        action: () => {
            let lost = scaledPct(window.bank, 0.05, 500, 250000);
            lost = Math.min(lost, window.bank);
            window.bank -= lost;
            window.eventLosses = (window.eventLosses || 0) + lost;
            return 'האקרים גנבו ' + lost.toLocaleString() + ' ₪ מהבנק';
        }
    },
    {
        id: 'ev_fine_traffic',
        title: 'דוח תנועה',
        type: 'negative',
        action: () => {
            let fine = Math.min(scaled(750), window.money);
            window.money -= fine;
            window.eventLosses = (window.eventLosses || 0) + fine;
            return 'קיבלת דוח תנועה ' + fine.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_flood',
        title: 'נזקי שיטפון',
        type: 'negative',
        action: () => {
            let cost = Math.min(scaled(3000), window.money);
            window.money -= cost;
            window.eventLosses = (window.eventLosses || 0) + cost;
            return 'שיטפון גרם נזק ' + cost.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_employee_quit',
        title: 'עובד מפתח התפטר',
        type: 'negative',
        action: () => {
            let lost = window.passive * 0.1;
            window.passive = Math.max(0, window.passive - lost);
            return 'עובד מפתח עזב — פסיבי ירד ב-' + lost.toFixed(1) + ' ₪/ד\'';
        }
    },
    {
        id: 'ev_lawsuit',
        title: 'תביעה משפטית',
        type: 'negative',
        action: () => {
            let cost = scaledPct(window.money, 0.06, 2000, 300000);
            cost = Math.min(cost, window.money);
            window.money -= cost;
            window.eventLosses = (window.eventLosses || 0) + cost;
            return 'תביעה משפטית עלתה ' + cost.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_robbery',
        title: 'שוד מזומנים',
        type: 'negative',
        action: () => {
            let lost = scaledPct(window.money, 0.07, 1000, 350000);
            lost = Math.min(lost, window.money);
            window.money -= lost;
            window.eventLosses = (window.eventLosses || 0) + lost;
            return 'נשדדת! אבדת ' + lost.toLocaleString() + ' ₪ מזומן';
        }
    },
    {
        id: 'ev_market_crash',
        title: 'קריסת שוק',
        type: 'negative',
        action: () => {
            let lost = scaledPct(window.money, 0.04, 1000, 200000);
            lost = Math.min(lost, window.money);
            window.money -= lost;
            window.eventLosses = (window.eventLosses || 0) + lost;
            return 'קריסת שוק הפסידה ' + lost.toLocaleString() + ' ₪';
        }
    },

    // 🔒 כלא

    {
        id: 'ev_jail',
        title: 'נכנסת לכלא',
        type: 'negative',
        action: () => {
            if (checkJailStatus()) return 'כבר בכלא — לא ניתן לאסור שוב';
            return goToJail(4);
        }
    }
];

// ============================================================
// טריגר
// ============================================================
window.triggerRandomEvent = function() {
    let pool = window.randomEvents;
    if (checkJailStatus()) {
        pool = pool.filter(function(e) { return e.id !== 'ev_jail'; });
    }
    const positiveEvents = pool.filter(function(e) { return e.type === 'positive'; });
const negativeEvents = pool.filter(function(e) { return e.type === 'negative'; });

// 15% סיכוי לכלא ישירות — ללא תלות בחלוקה
if (!checkJailStatus() && Math.random() < 0.15) {
    const jailEvent = window.randomEvents.find(function(e) { return e.id === 'ev_jail'; });
    if (jailEvent) {
        const resultMsg = jailEvent.action();
        addEventLog(jailEvent.title, resultMsg, jailEvent.type);
        if (typeof showMsgLong === 'function') showMsgLong('⚠️ ' + jailEvent.title + ': ' + resultMsg, 'var(--red)');
        if (window.updateUI) window.updateUI();
        if (typeof saveGame === 'function') saveGame();
        return;
    }
}

const usePositive = Math.random() < 0.55;
const selectedPool = (usePositive && positiveEvents.length > 0) ? positiveEvents
                   : (negativeEvents.length > 0) ? negativeEvents
                   : pool;

const event = selectedPool[Math.floor(Math.random() * selectedPool.length)];


    const resultMsg = event.action();
    const color = event.type === 'positive' ? 'var(--green)' : 'var(--red)';
    const icon  = event.type === 'positive' ? '🎉' : '⚠️';

    addEventLog(event.title, resultMsg, event.type);

    if (typeof showMsgLong === 'function') showMsgLong(icon + ' ' + event.title + ': ' + resultMsg, color);
    else if (typeof showMsg === 'function') showMsg(icon + ' ' + event.title + ': ' + resultMsg, color);

    if (window.updateUI) window.updateUI();
    if (typeof saveGame === 'function') saveGame();
};
// הטריגר מנוהל ב-core.js (startEventTimer) — כל ~60 שניות, 50% סיכוי
