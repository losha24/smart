/* Smart Money Pro - js/events.js - v9.8.0 - Level Scaling ף */

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
// רשימת אירועים — מסוקיילים לפי רמה
// ============================================================
window.randomEvents = [

    // ✅ חיוביים

    {
        id: 'ev_bonus',
        title: 'בונוס הצטיינות',
        type: 'positive',
        action: () => {
            let amount = scaledPct(window.money, 0.25, 2000, 1500000);
            window.money += amount;
            return 'קיבלת בונוס של ' + amount.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_inheritance',
        title: 'ירושה מפתיעה',
        type: 'positive',
        action: () => {
            let gain = scaled(35000);
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
            let gain = scaled(cnt * 8000 + 15000);
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
            let gain = scaledPct(window.money, 0.15, 3000, 300000);
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

];

// ============================================================
// טריגר
// ============================================================
window.triggerRandomEvent = function() {
    const pool = window.randomEvents;
    
    // סינון אירועים לפי סוג
    const positiveEvents = pool.filter(e => e.type === 'positive');
    const negativeEvents = pool.filter(e => e.type === 'negative');

    // הגרלה: 60% סיכוי לאירוע חיובי, 40% לשלילי
    const usePositive = Math.random() < 0.60;
    
    // בחירת מאגר האירועים המתאים
    const selectedPool = (usePositive && positiveEvents.length > 0) ? positiveEvents 
                       : (negativeEvents.length > 0) ? negativeEvents 
                       : pool;

    // הגרלת אירוע ספציפי מהמאגר
    const event = selectedPool[Math.floor(Math.random() * selectedPool.length)];
    const resultMsg = event.action();

    // הגדרת עיצוב להודעה
    const color = event.type === 'positive' ? 'var(--green)' : 'var(--red)';
    const icon  = event.type === 'positive' ? '💰' : '⚠️';

    // רישום ביומן האירועים
    addEventLog(event.title, resultMsg, event.type);

    // הצגת ההודעה לשחקן
    if (typeof showMsgLong === 'function') {
        showMsgLong(icon + ' ' + event.title + ': ' + resultMsg, color);
    }

    // עדכון הממשק ושמירת המשחק
    if (window.updateUI) window.updateUI();
    if (typeof saveGame === 'function') saveGame();
};
