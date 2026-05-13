/* Smart Money Pro - js/events.js - v9.9.0 - Extended Events */

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
function getLevelScale() {
    const level = (typeof getLevelData === 'function')
        ? getLevelData(window.lifeXP || 0).level
        : 1;
    return Math.max(1, 1 + (level - 1) * 0.3);
}

function scaled(base) {
    return Math.floor(base * getLevelScale());
}

function scaledPct(total, pct, minBase, maxBase) {
    const s = getLevelScale();
    const fromPct = Math.floor(total * pct);
    return Math.min(Math.floor(maxBase * s), Math.max(Math.floor(minBase * s), fromPct));
}

// ============================================================
// רשימת אירועים — 30 חיוביים + 25 שליליים
// ============================================================
window.randomEvents = [

    // ========== ✅ חיוביים (30) ==========

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
    // ========== חיוביים חדשים (15 נוספים) ==========
    {
        id: 'ev_gift_from_fan',
        title: 'מתנה ממעריץ',
        type: 'positive',
        action: () => {
            let gain = scaled(3000) + Math.floor(Math.random() * scaled(2000));
            window.money += gain;
            return 'קיבלת מתנה מסתורית בשווי ' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_stock_dividend',
        title: 'דיבידנד ממניות',
        type: 'positive',
        action: () => {
            let gain = scaledPct(window.money, 0.03, 1000, 150000);
            window.money += gain;
            return 'קיבלת דיבידנד ' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_rent_income',
        title: 'הכנסה משכירות',
        type: 'positive',
        action: () => {
            let gain = scaled(3500);
            window.money += gain;
            return 'דמי שכירות התקבלו ' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_royalties',
        title: 'תמלוגים',
        type: 'positive',
        action: () => {
            let gain = scaled(4500);
            window.money += gain;
            return 'קיבלת תמלוגים ' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_side_hustle',
        title: 'פרויקט צדדי',
        type: 'positive',
        action: () => {
            let gain = scaled(2500);
            window.money += gain;
            return 'הרווחת מפרויקט צדדי ' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_investment_return',
        title: 'תשואה על השקעה',
        type: 'positive',
        action: () => {
            let gain = scaledPct(window.money, 0.08, 2000, 200000);
            window.money += gain;
            return 'השקעה הניבה תשואה ' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_scholarship',
        title: 'מלגת לימודים',
        type: 'positive',
        action: () => {
            let gain = scaled(8000);
            window.money += gain;
            return 'קיבלת מלגה ' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_cashback',
        title: 'החזר כספי',
        type: 'positive',
        action: () => {
            let gain = scaled(1200);
            window.money += gain;
            return 'קיבלת החזר כספי ' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_sold_old_item',
        title: 'מכרת חפץ ישן',
        type: 'positive',
        action: () => {
            let gain = scaled(800);
            window.money += gain;
            return 'מכרת חפץ ישן ב-' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_birthday_gift',
        title: 'מתנת יום הולדת',
        type: 'positive',
        action: () => {
            let gain = scaled(2000);
            window.money += gain;
            return 'קיבלת מתנת יום הולדת ' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_prize_win',
        title: 'זכייה בתחרות',
        type: 'positive',
        action: () => {
            let gain = scaled(5500);
            window.money += gain;
            return 'זכית בתחרות עם פרס ' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_freelance_job',
        title: 'פרויקט עצמאי',
        type: 'positive',
        action: () => {
            let gain = scaled(6000);
            window.money += gain;
            return 'סיימת פרויקט עצמאי +' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_airline_refund',
        title: 'פיצוי טיסה',
        type: 'positive',
        action: () => {
            let gain = scaled(1800);
            window.money += gain;
            return 'קיבלת פיצוי מחברת תעופה ' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_coupon_windfall',
        title: 'קופון זכייה',
        type: 'positive',
        action: () => {
            let gain = scaled(3200);
            window.money += gain;
            return 'קופון זכייה הביא לך ' + gain.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_referral_bonus',
        title: 'בונוס הפניות',
        type: 'positive',
        action: () => {
            let gain = scaled(2800);
            window.money += gain;
            return 'בונוס על הפניות +' + gain.toLocaleString() + ' ₪';
        }
    },

    // ========== ❌ שליליים (25) ==========

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
    // ========== שליליים חדשים (10 נוספים) ==========
    {
        id: 'ev_medical_emergency',
        title: 'חירום רפואי',
        type: 'negative',
        action: () => {
            let cost = Math.min(scaled(5000), window.money);
            window.money -= cost;
            window.eventLosses = (window.eventLosses || 0) + cost;
            return 'טיפול רפואי דחוף עלה ' + cost.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_scam',
        title: 'הונאה',
        type: 'negative',
        action: () => {
            let lost = scaledPct(window.money, 0.05, 1000, 100000);
            lost = Math.min(lost, window.money);
            window.money -= lost;
            window.eventLosses = (window.eventLosses || 0) + lost;
            return 'נפלת להונאה! הפסדת ' + lost.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_pet_illness',
        title: 'מחלת חיית מחמד',
        type: 'negative',
        action: () => {
            let cost = Math.min(scaled(2500), window.money);
            window.money -= cost;
            window.eventLosses = (window.eventLosses || 0) + cost;
            return 'טיפול וטרינרי עלה ' + cost.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_phone_broken',
        title: 'טלפון נשבר',
        type: 'negative',
        action: () => {
            let cost = Math.min(scaled(2000), window.money);
            window.money -= cost;
            window.eventLosses = (window.eventLosses || 0) + cost;
            return 'תיקון טלפון עלה ' + cost.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_wedding_gift',
        title: 'מתנת חתונה',
        type: 'negative',
        action: () => {
            let cost = Math.min(scaled(1800), window.money);
            window.money -= cost;
            window.eventLosses = (window.eventLosses || 0) + cost;
            return 'הוזמנת לחתונה + מתנה ' + cost.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_subscription_trap',
        title: 'מנוי יקר',
        type: 'negative',
        action: () => {
            let cost = Math.min(scaled(900), window.money);
            window.money -= cost;
            window.eventLosses = (window.eventLosses || 0) + cost;
            return 'התגלה מנוי ישן שחייב אותך ' + cost.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_identity_theft',
        title: 'גניבת זהות',
        type: 'negative',
        action: () => {
            let lost = scaledPct(window.bank, 0.08, 2000, 180000);
            lost = Math.min(lost, window.bank);
            window.bank -= lost;
            window.eventLosses = (window.eventLosses || 0) + lost;
            return 'גניבת זהות - נגנבו ' + lost.toLocaleString() + ' ₪ מהבנק';
        }
    },
    {
        id: 'ev_overdue_fine',
        title: 'קנס פיגורים',
        type: 'negative',
        action: () => {
            let fine = Math.min(scaled(1300), window.money);
            window.money -= fine;
            window.eventLosses = (window.eventLosses || 0) + fine;
            return 'קנס על איחור בתשלום ' + fine.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_burglary',
        title: 'פריצה לבית',
        type: 'negative',
        action: () => {
            let lost = scaledPct(window.money, 0.06, 1500, 120000);
            lost = Math.min(lost, window.money);
            window.money -= lost;
            window.eventLosses = (window.eventLosses || 0) + lost;
            return 'פרצו לביתך! נגנבו ' + lost.toLocaleString() + ' ₪';
        }
    },
    {
        id: 'ev_credit_card_fee',
        title: 'עמלת כרטיס אשראי',
        type: 'negative',
        action: () => {
            let fee = Math.min(scaled(600), window.money);
            window.money -= fee;
            window.eventLosses = (window.eventLosses || 0) + fee;
            return 'עמלות כרטיס אשראי ' + fee.toLocaleString() + ' ₪';
        }
    }
];

// ============================================================
// טריגר - גרסה מתוקנת ללא כלא
// ============================================================
window.triggerRandomEvent = function() {
    const positiveEvents = window.randomEvents.filter(function(e) { return e.type === 'positive'; });
    const negativeEvents = window.randomEvents.filter(function(e) { return e.type === 'negative'; });
    
    const usePositive = Math.random() < 0.55;
    const selectedPool = (usePositive && positiveEvents.length > 0) ? positiveEvents :
        (negativeEvents.length > 0) ? negativeEvents :
        window.randomEvents;
    
    const event = selectedPool[Math.floor(Math.random() * selectedPool.length)];
    
    let resultMsg = '';

try {
    resultMsg = event.action();
    
    if (typeof clampMoney === 'function') {
        clampMoney();
    }
    
} catch (err) {
    
    console.error('Event error:', err);
    
    resultMsg = 'אירעה שגיאה באירוע';
    
    if (typeof showMsgLong === 'function') {
        showMsgLong(
            '⚠️ שגיאה באירוע: ' + event.title,
            'var(--red)'
        );
    }
}
    if (typeof clampMoney === 'function') {
    clampMoney();
}
    const color = event.type === 'positive' ? 'var(--green)' : 'var(--red)';
    const icon = event.type === 'positive' ? '🎉' : '⚠️';
    
    addEventLog(event.title, resultMsg, event.type);
    
    if (typeof showMsgLong === 'function') showMsgLong(icon + ' ' + event.title + ': ' + resultMsg, color);
    else if (typeof showMsg === 'function') showMsg(icon + ' ' + event.title + ': ' + resultMsg, color);
    
    if (window.updateUI) window.updateUI();
    if (typeof saveGame === 'function') saveGame();
};

// נקיון localStorage מכלא ישן
localStorage.removeItem('jailUntil');
localStorage.removeItem('jailPassiveSaved');

// פונקציות ריקות למניעת שגיאות
window.checkJailStatus = function() { return false; };
window.goToJail = function() { return false; };
window.showJailModal = function() {};

console.log("✅ 55 אירועים טעונים (30 חיוביים + 25 שליליים)");
console.log("✅ מערכת הכלא הושבתה לחלוטין!");
