/* Smart Money Pro - js/events.js - v9.9.9
   תיקונים סופיים:
   - כל האירועים משפיעים רק על כסף ישיר (money/bank/blackMoney)
   - אין אירועים שמשנים passive (למעט כלא)
   - timestamps אמיתיים לאירועי אופליין
   - יומן מציג שעה אמיתית של האירוע
   - אין popups באופליין
   - 40 אירועים חיוביים + 40 שליליים (סה"כ 80)
*/

window.eventLog = JSON.parse(localStorage.getItem('eventLog') || '[]');

function addEventLog(title, resultMsg, type, ts) {
    const entry = {
        title,
        msg: resultMsg,
        type,
        ts: ts || Date.now()
    };
    window.eventLog.unshift(entry);
    const cutoff = Date.now() - 12 * 60 * 60 * 1000;
    window.eventLog = window.eventLog.filter(e => e.ts >= cutoff);
    localStorage.setItem('eventLog', JSON.stringify(window.eventLog));
    if (typeof window.renderEventLog === 'function') {
        window.renderEventLog();
    }
}

function getLevelScale() {
    const level = (typeof getLevelData === 'function')
        ? getLevelData(window.lifeXP || 0).level : 1;
    return Math.max(1, 1 + (level - 1) * 0.3);
}
function scaled(base) { return Math.floor(base * getLevelScale()); }
function scaledPct(total, pct, minBase, maxBase) {
    const s = getLevelScale();
    const fromPct = Math.floor(total * pct);
    return Math.min(Math.floor(maxBase * s), Math.max(Math.floor(minBase * s), fromPct));
}

window.jailUntil        = parseInt(localStorage.getItem('jailUntil'))         || 0;
window.jailPassiveSaved = parseFloat(localStorage.getItem('jailPassiveSaved')) || 0;
window.lastJailTime     = parseInt(localStorage.getItem('lastJailTime'))       || 0;

const JAIL_COOLDOWN_MS = 12 * 60 * 60 * 1000;

function canBeArrested() {
    if (checkJailStatus()) return false;
    return (Date.now() - (window.lastJailTime || 0)) >= JAIL_COOLDOWN_MS;
}

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

function calcBailCost() {
    const level = (typeof getLevelData === 'function')
        ? getLevelData(window.lifeXP || 0).level : 1;
    const totalWealth = (window.money || 0) + (window.bank || 0);
    const bail = Math.floor((level * 5000) + (totalWealth * 0.02));
    return Math.max(10000, Math.min(50000000, bail));
}

function goToJail(hours) {
    if (!canBeArrested()) {
        let fine = Math.min(scaled(5000), window.money);
        window.money -= fine;
        window.eventLosses = (window.eventLosses || 0) + fine;
        return 'בריחה מהמשטרה! קנס ' + fine.toLocaleString() + ' ₪';
    }
    const bailCost = calcBailCost();
    window.jailUntil    = Date.now() + hours * 60 * 60 * 1000;
    window.lastJailTime = Date.now();
    localStorage.setItem('jailUntil',    window.jailUntil);
    localStorage.setItem('lastJailTime', window.lastJailTime);
    window.jailPassiveSaved = window.passive || 0;
    localStorage.setItem('jailPassiveSaved', window.jailPassiveSaved);
    window.passive = 0;
    if (typeof saveGame === 'function') saveGame();
    if (typeof updateUI === 'function') updateUI();
    if (!window._offlineMode) {
        showJailModal(hours, bailCost);
    }
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
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
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
        const bc = calcBailCost();
        if ((window.bank || 0) < bc) {
            if (typeof showMsg === 'function') showMsg('❌ אין מספיק כסף בבנק! (' + bc.toLocaleString() + ' ₪ דרוש)', 'var(--red)');
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

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (checkJailStatus()) {
            showJailModal(4, calcBailCost());
        }
    }, 600);
});

window.randomEvents = [

    // ========== 40 אירועים חיוביים ==========
    
    // אירועים קיימים (30)
    { id: 'ev_bonus', title: 'בונוס הצטיינות', type: 'positive', action: () => {
        let amount = scaledPct(window.money, 0.15, 8000, 800000);
        window.money += amount;
        return { msg: 'קיבלת בונוס של ' + amount.toLocaleString() + ' ₪', amount };
    }},
    { id: 'ev_inheritance', title: 'ירושה מפתיעה', type: 'positive', action: () => {
        let gain = scaled(25000);
        window.money += gain;
        return { msg: 'קיבלת ' + gain.toLocaleString() + ' ₪ ירושה', amount: gain };
    }},
    { id: 'ev_lottery', title: 'זכייה בלוטו', type: 'positive', action: () => {
        let gain = scaled(15000);
        window.money += gain;
        return { msg: 'זכית ב-' + gain.toLocaleString() + ' ₪ בלוטו', amount: gain };
    }},
    { id: 'ev_tax_refund', title: 'החזר מס', type: 'positive', action: () => {
        let gain = scaled(8000);
        window.money += gain;
        return { msg: 'קיבלת החזר מס ' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_black_market_deal', title: 'עסקת שוק שחור', type: 'positive', action: () => {
        let gain = scaled(18000);
        window.blackMoney = (window.blackMoney || 0) + gain;
        return { msg: 'עסקה הצליחה +' + gain.toLocaleString() + ' ₪ שחור', amount: gain };
    }},
    { id: 'ev_insider', title: 'מידע פנימי', type: 'positive', action: () => {
        let gain = scaled(22000);
        window.money += gain;
        return { msg: 'מידע פנימי — רווח ' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_car_sell', title: 'מכירת רכב', type: 'positive', action: () => {
        let profit = scaled(12000) + Math.floor(Math.random() * scaled(8000));
        window.money += profit;
        return { msg: 'מכרת רכב ברווח ' + profit.toLocaleString() + ' ₪', amount: profit };
    }},
    { id: 'ev_realestate_boom', title: 'בום נדל"ן', type: 'positive', action: () => {
        const cnt = Object.values(window.estateData || {}).reduce((s, e) => s + (e.count || 0), 0);
        let gain = scaled(cnt * 3000 + 8000);
        window.money += gain;
        return { msg: 'שוק נדל"ן עלה +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_risky_deal_win', title: 'עסקה מסוכנת', type: 'positive', action: () => {
        let gain = scaled(20000);
        window.money += gain;
        return { msg: 'עסקה מסוכנת הצליחה +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_passive_boost', title: 'עלייה בהכנסות', type: 'positive', action: () => {
        let gain = scaled(18000) + Math.floor(Math.random() * scaled(10000));
        window.money += gain;
        return { msg: 'הכנסות עלו — רווח ' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_crypto_pump', title: 'עלייה בקריפטו', type: 'positive', action: () => {
        let gain = scaledPct(window.money, 0.08, 8000, 600000);
        window.money += gain;
        return { msg: 'ניצלת עלייה בקריפטו +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_business_contract', title: 'חוזה עסקי גדול', type: 'positive', action: () => {
        let gain = scaled(40000);
        window.money += gain;
        return { msg: 'חתמת על חוזה חדש +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_found_cash', title: 'מצאת שטרות', type: 'positive', action: () => {
        let gain = scaled(5000) + Math.floor(Math.random() * scaled(5000));
        window.money += gain;
        return { msg: 'מצאת ' + gain.toLocaleString() + ' ₪ במזרן', amount: gain };
    }},
    { id: 'ev_bank_interest', title: 'ריבית על פיקדון', type: 'positive', action: () => {
        let interest = scaledPct(window.bank, 0.04, 500, 500000);
        window.bank += interest;
        return { msg: 'קיבלת ' + interest.toLocaleString() + ' ₪ ריבית', amount: interest };
    }},
    { id: 'ev_staff_bonus', title: 'הצלחת הצוות', type: 'positive', action: () => {
        let gain = scaled(18000);
        window.money += gain;
        return { msg: 'הצוות שלך השיג יעדים +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_jackpot', title: 'ג\'קפוט מפתיע', type: 'positive', action: () => {
        let gain = scaled(50000) + Math.floor(Math.random() * scaled(50000));
        window.money += gain;
        return { msg: 'פגעת בג\'קפוט! +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_passive_perm_boost', title: 'שיפור תשתית', type: 'positive', action: () => {
        let gain = scaled(20000) + Math.floor(Math.random() * scaled(10000));
        window.money += gain;
        return { msg: 'שיפרת תשתית — חיסכון ' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_dividend', title: 'דיבידנד מניות', type: 'positive', action: () => {
        let gain = scaled(30000) + Math.floor(Math.random() * scaled(20000));
        window.money += gain;
        return { msg: 'קיבלת דיבידנד +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_tip', title: 'טיפ ענק מלקוח', type: 'positive', action: () => {
        let gain = scaled(6000) + Math.floor(Math.random() * scaled(4000));
        window.money += gain;
        return { msg: 'לקוח שילם טיפ ' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_startup_win', title: 'יציאה מסטארטאפ', type: 'positive', action: () => {
        let gain = scaled(80000) + Math.floor(Math.random() * scaled(60000));
        window.money += gain;
        return { msg: 'מכרת חלקך בסטארטאפ +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_grant', title: 'מענק ממשלתי', type: 'positive', action: () => {
        let gain = scaled(12000);
        window.money += gain;
        return { msg: 'אושר מענק עסקי ' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_poker_win', title: 'זכייה בפוקר', type: 'positive', action: () => {
        let gain = scaled(9000) + Math.floor(Math.random() * scaled(8000));
        window.money += gain;
        return { msg: 'ניצחת משחק פוקר +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_promotion', title: 'קידום בעבודה', type: 'positive', action: () => {
        let bonus = scaled(22000) + Math.floor(Math.random() * scaled(8000));
        window.money += bonus;
        return { msg: 'קודמת! בונוס ' + bonus.toLocaleString() + ' ₪', amount: bonus };
    }},
    { id: 'ev_crypto_airdrop', title: 'אוויר דרופ קריפטו', type: 'positive', action: () => {
        let gain = scaled(25000) + Math.floor(Math.random() * scaled(15000));
        window.blackMoney = (window.blackMoney || 0) + gain;
        return { msg: 'קיבלת אוויר דרופ +' + gain.toLocaleString() + ' ₪ שחור', amount: gain };
    }},
    { id: 'ev_rental_bonus', title: 'שוכר שילם מראש', type: 'positive', action: () => {
        const cnt = Object.values(window.estateData || {}).reduce((s, e) => s + (e.count || 0), 0);
        let gain = scaled((cnt * 2000) + 5000);
        window.money += gain;
        return { msg: 'שוכר שילם 3 חודשים מראש +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_consulting', title: 'שכר ייעוץ', type: 'positive', action: () => {
        let gain = scaled(18000) + Math.floor(Math.random() * scaled(10000));
        window.money += gain;
        return { msg: 'שולם שכר ייעוץ +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_car_insurance', title: 'פיצוי ביטוח רכב', type: 'positive', action: () => {
        let gain = scaled(7000);
        window.money += gain;
        return { msg: 'ביטוח שילם פיצוי +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_art_sell', title: 'מכירת произведение אמנות', type: 'positive', action: () => {
        let gain = scaled(45000) + Math.floor(Math.random() * scaled(30000));
        window.money += gain;
        return { msg: 'מכרת אמנות ברווח +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_energy_savings', title: 'חיסכון בחשמל', type: 'positive', action: () => {
        let gain = scaled(8000) + Math.floor(Math.random() * scaled(5000));
        window.money += gain;
        return { msg: 'פנלים סולאריים חסכו ' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_influencer', title: 'הכנסה מרשתות חברתיות', type: 'positive', action: () => {
        let gain = scaled(11000) + Math.floor(Math.random() * scaled(8000));
        window.money += gain;
        return { msg: 'הרווחת מתוכן ויראלי +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},

    // 10 אירועים חיוביים חדשים
    { id: 'ev_casino_win', title: 'זכייה בקזינו', type: 'positive', action: () => {
        let gain = scaled(12000) + Math.floor(Math.random() * scaled(15000));
        window.money += gain;
        return { msg: 'ניצחת בקזינו! +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_insurance_payout', title: 'פיצוי מביטוח', type: 'positive', action: () => {
        let gain = scaled(25000);
        window.money += gain;
        return { msg: 'תביעת ביטוח אושרה! קיבלת ' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_refund', title: 'החזר כספי', type: 'positive', action: () => {
        let gain = scaled(4000) + Math.floor(Math.random() * scaled(6000));
        window.money += gain;
        return { msg: 'קיבלת החזר על מוצר שקנית +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_find_wallet', title: 'מציאת ארנק', type: 'positive', action: () => {
        let gain = scaled(800) + Math.floor(Math.random() * scaled(2000));
        window.money += gain;
        return { msg: 'מצאת ארנק עם ' + gain.toLocaleString() + ' ₪ והחזרת לבעלים שנתן לך פרס', amount: gain };
    }},
    { id: 'ev_birthday_gift', title: 'מתנת יום הולדת', type: 'positive', action: () => {
        let gain = scaled(10000) + Math.floor(Math.random() * scaled(10000));
        window.money += gain;
        let xpBonus = Math.floor(gain / 100);
        window.lifeXP += xpBonus;
        return { msg: 'חברים נתנו לך מתנה! +' + gain.toLocaleString() + ' ₪ ו-' + xpBonus + ' XP', amount: gain };
    }},
    { id: 'ev_contest_win', title: 'זכייה בתחרות', type: 'positive', action: () => {
        let gain = scaled(7000);
        window.money += gain;
        let xpBonus = scaled(150);
        window.lifeXP += xpBonus;
        return { msg: 'זכית בתחרות אינטרנט +' + gain.toLocaleString() + ' ₪ ו-' + xpBonus + ' XP', amount: gain };
    }},
    { id: 'ev_big_tip', title: 'טיפ נדיב', type: 'positive', action: () => {
        let gain = scaled(3000) + Math.floor(Math.random() * scaled(4000));
        window.money += gain;
        return { msg: 'לקוח השאיר לך טיפ ענק! +' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_sell_old_item', title: 'מכירת חפץ ישן', type: 'positive', action: () => {
        let gain = scaled(5000) + Math.floor(Math.random() * scaled(7000));
        window.money += gain;
        return { msg: 'מכרת חפץ ישן באיביי ב-' + gain.toLocaleString() + ' ₪', amount: gain };
    }},
    { id: 'ev_sports_win', title: 'ניצחון בתחרות ספורט', type: 'positive', action: () => {
        let gain = scaled(15000);
        window.money += gain;
        let xpBonus = scaled(250);
        window.lifeXP += xpBonus;
        return { msg: 'ניצחת בטורניר! +' + gain.toLocaleString() + ' ₪ ו-' + xpBonus + ' XP', amount: gain };
    }},
    { id: 'ev_old_coin', title: 'מטבע עתיק', type: 'positive', action: () => {
        let gain = scaled(20000) + Math.floor(Math.random() * scaled(30000));
        window.money += gain;
        return { msg: 'מצאת מטבע עתיק שווה ' + gain.toLocaleString() + ' ₪', amount: gain };
    }},

    // ========== 40 אירועים שליליים ==========
    
    // אירועים קיימים (30)
    { id: 'ev_tax_fine', title: 'ביקורת מס הכנסה', type: 'negative', action: () => {
        let fine = scaledPct(window.money, 0.08, 500, 400000);
        fine = Math.min(fine, window.money);
        window.money -= fine;
        window.eventLosses = (window.eventLosses || 0) + fine;
        return { msg: 'קנס מס הכנסה ' + fine.toLocaleString() + ' ₪', amount: -fine };
    }},
    { id: 'ev_appliance_broken', title: 'תקלה בבית', type: 'negative', action: () => {
        let cost = Math.min(scaled(1200), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'תיקון בית עלה ' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},
    { id: 'ev_passive_drop', title: 'משבר ניהולי', type: 'negative', action: () => {
        let fine = scaledPct(window.money, 0.08, 3000, 200000);
        fine = Math.min(fine, window.money);
        window.money -= fine;
        window.eventLosses = (window.eventLosses || 0) + fine;
        return { msg: 'משבר ניהולי — עלות ' + fine.toLocaleString() + ' ₪', amount: -fine };
    }},
    { id: 'ev_dentist', title: 'טיפול שיניים', type: 'negative', action: () => {
        let cost = Math.min(scaled(1500), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'טיפול שיניים עלה ' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},
    { id: 'ev_police_raid', title: 'פשיטה משטרתית', type: 'negative', action: () => {
        let lost = Math.floor((window.blackMoney || 0) * 0.3);
        window.blackMoney = Math.max(0, (window.blackMoney || 0) - lost);
        return { msg: 'הוחרמו ' + lost.toLocaleString() + ' ₪ מהכסף השחור', amount: -lost };
    }},
    { id: 'ev_car_crash', title: 'תאונת רכב', type: 'negative', action: () => {
        let cost = Math.min(scaled(4000), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'תאונת רכב עלתה ' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},
    { id: 'ev_realestate_crash', title: 'קריסת נדל"ן', type: 'negative', action: () => {
        const cnt = Object.values(window.estateData || {}).reduce((s, e) => s + (e.count || 0), 0);
        let loss = Math.min(scaled(cnt * 800 + 1000), window.money);
        window.money -= loss;
        window.eventLosses = (window.eventLosses || 0) + loss;
        return { msg: 'שוק נדל"ן קרס -' + loss.toLocaleString() + ' ₪', amount: -loss };
    }},
    { id: 'ev_hacker', title: 'מתקפת סייבר', type: 'negative', action: () => {
        let lost = scaledPct(window.bank, 0.05, 500, 250000);
        lost = Math.min(lost, window.bank);
        window.bank -= lost;
        window.eventLosses = (window.eventLosses || 0) + lost;
        return { msg: 'האקרים גנבו ' + lost.toLocaleString() + ' ₪ מהבנק', amount: -lost };
    }},
    { id: 'ev_fine_traffic', title: 'דוח תנועה', type: 'negative', action: () => {
        let fine = Math.min(scaled(750), window.money);
        window.money -= fine;
        window.eventLosses = (window.eventLosses || 0) + fine;
        return { msg: 'קיבלת דוח תנועה ' + fine.toLocaleString() + ' ₪', amount: -fine };
    }},
    { id: 'ev_flood', title: 'נזקי שיטפון', type: 'negative', action: () => {
        let cost = Math.min(scaled(3000), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'שיטפון גרם נזק ' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},
    { id: 'ev_lawsuit', title: 'תביעה משפטית', type: 'negative', action: () => {
        let cost = scaledPct(window.money, 0.06, 2000, 300000);
        cost = Math.min(cost, window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'תביעה משפטית עלתה ' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},
    { id: 'ev_robbery', title: 'שוד מזומנים', type: 'negative', action: () => {
        let lost = scaledPct(window.money, 0.07, 1000, 350000);
        lost = Math.min(lost, window.money);
        window.money -= lost;
        window.eventLosses = (window.eventLosses || 0) + lost;
        return { msg: 'נשדדת! אבדת ' + lost.toLocaleString() + ' ₪ מזומן', amount: -lost };
    }},
    { id: 'ev_market_crash', title: 'קריסת שוק', type: 'negative', action: () => {
        let lost = scaledPct(window.money, 0.04, 1000, 200000);
        lost = Math.min(lost, window.money);
        window.money -= lost;
        window.eventLosses = (window.eventLosses || 0) + lost;
        return { msg: 'קריסת שוק הפסידה ' + lost.toLocaleString() + ' ₪', amount: -lost };
    }},
    { id: 'ev_employee_quit', title: 'עובד מפתח התפטר', type: 'negative', action: () => {
        let fine = scaledPct(window.money, 0.08, 5000, 180000);
        fine = Math.min(fine, window.money);
        window.money -= fine;
        window.eventLosses = (window.eventLosses || 0) + fine;
        return { msg: 'עובד מפתח עזב — פיצויים ' + fine.toLocaleString() + ' ₪', amount: -fine };
    }},
    { id: 'ev_fine_noise', title: 'קנס רעש', type: 'negative', action: () => {
        let fine = Math.min(scaled(800), window.money);
        window.money -= fine;
        window.eventLosses = (window.eventLosses || 0) + fine;
        return { msg: 'שכנים הגישו תלונת רעש — קנס ' + fine.toLocaleString() + ' ₪', amount: -fine };
    }},
    { id: 'ev_phone_stolen', title: 'גניבת טלפון', type: 'negative', action: () => {
        let cost = Math.min(scaled(2500), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'טלפון נגנב — רכשת חדש ' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},
    { id: 'ev_medical', title: 'הוצאה רפואית', type: 'negative', action: () => {
        let cost = Math.min(scaled(3500), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'ניתוח דחוף עלה ' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},
    { id: 'ev_pipe_burst', title: 'צינור פרץ', type: 'negative', action: () => {
        let cost = Math.min(scaled(2000), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'צינור פרץ בבית — תיקון ' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},
    { id: 'ev_scam', title: 'נפלת על הונאה', type: 'negative', action: () => {
        let lost = scaledPct(window.money, 0.05, 1000, 150000);
        lost = Math.min(lost, window.money);
        window.money -= lost;
        window.eventLosses = (window.eventLosses || 0) + lost;
        return { msg: 'נפלת על הונאת פישינג — אבדת ' + lost.toLocaleString() + ' ₪', amount: -lost };
    }},
    { id: 'ev_parking_tickets', title: 'דוחות חניה', type: 'negative', action: () => {
        let fine = Math.min(scaled(500), window.money);
        window.money -= fine;
        window.eventLosses = (window.eventLosses || 0) + fine;
        return { msg: 'צבר דוחות חניה — ' + fine.toLocaleString() + ' ₪', amount: -fine };
    }},
    { id: 'ev_fire_damage', title: 'נזק שריפה', type: 'negative', action: () => {
        let cost = Math.min(scaled(8000), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'שריפה קטנה גרמה נזק ' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},
    { id: 'ev_bad_investment', title: 'השקעה כושלת', type: 'negative', action: () => {
        let lost = scaledPct(window.money, 0.06, 2000, 250000);
        lost = Math.min(lost, window.money);
        window.money -= lost;
        window.eventLosses = (window.eventLosses || 0) + lost;
        return { msg: 'השקעה בחברה שקרסה — אבדת ' + lost.toLocaleString() + ' ₪', amount: -lost };
    }},
    { id: 'ev_power_outage', title: 'הפסקת חשמל', type: 'negative', action: () => {
        let fine = Math.min(scaled(4500), window.money);
        window.money -= fine;
        window.eventLosses = (window.eventLosses || 0) + fine;
        return { msg: 'הפסקת חשמל — נזק ציוד ' + fine.toLocaleString() + ' ₪', amount: -fine };
    }},
    { id: 'ev_tenant_damage', title: 'נזק מדייר', type: 'negative', action: () => {
        const cnt = Object.values(window.estateData || {}).reduce((s, e) => s + (e.count || 0), 0);
        if (cnt === 0) {
            let fine = Math.min(scaled(500), window.money);
            window.money -= fine; window.eventLosses = (window.eventLosses || 0) + fine;
            return { msg: 'קנס קטן ' + fine.toLocaleString() + ' ₪', amount: -fine };
        }
        let cost = Math.min(scaled(cnt * 1500 + 2000), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'דייר הרס נכס — תיקון ' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},
    { id: 'ev_bank_fee', title: 'עמלות בנק', type: 'negative', action: () => {
        let fee = scaledPct(window.bank, 0.02, 200, 50000);
        fee = Math.min(fee, window.bank);
        window.bank -= fee;
        window.eventLosses = (window.eventLosses || 0) + fee;
        return { msg: 'הבנק גבה עמלות ' + fee.toLocaleString() + ' ₪ מחשבונך', amount: -fee };
    }},
    { id: 'ev_supplier_raise', title: 'ספק העלה מחיר', type: 'negative', action: () => {
        let fine = Math.min(scaled(5500), window.money);
        window.money -= fine;
        window.eventLosses = (window.eventLosses || 0) + fine;
        return { msg: 'ספק העלה מחירים — עלות נוספת ' + fine.toLocaleString() + ' ₪', amount: -fine };
    }},
    { id: 'ev_competition', title: 'תחרות עסקית', type: 'negative', action: () => {
        let fine = scaledPct(window.money, 0.08, 3000, 200000);
        fine = Math.min(fine, window.money);
        window.money -= fine;
        window.eventLosses = (window.eventLosses || 0) + fine;
        return { msg: 'מתחרה חדש גנב לקוחות — הפסד ' + fine.toLocaleString() + ' ₪', amount: -fine };
    }},
    { id: 'ev_laptop_broken', title: 'מחשב התקלקל', type: 'negative', action: () => {
        let cost = Math.min(scaled(3000), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'מחשב נשרף — רכשת חדש ' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},
    { id: 'ev_penalty_contract', title: 'קנס חוזה', type: 'negative', action: () => {
        let fine = scaledPct(window.money, 0.03, 1000, 100000);
        fine = Math.min(fine, window.money);
        window.money -= fine;
        window.eventLosses = (window.eventLosses || 0) + fine;
        return { msg: 'הפרת חוזה — קנס ' + fine.toLocaleString() + ' ₪', amount: -fine };
    }},
    { id: 'ev_insurance_rise', title: 'ביטוח התייקר', type: 'negative', action: () => {
        let cost = Math.min(scaled(1800), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'פרמיית ביטוח עלתה — שילמת ' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},

    // 10 אירועים שליליים חדשים
    { id: 'ev_parking_fine_big', title: 'קנס חנייה מוגזם', type: 'negative', action: () => {
        let fine = Math.min(scaled(2500), window.money);
        window.money -= fine;
        window.eventLosses = (window.eventLosses || 0) + fine;
        return { msg: 'קיבלת קנס חנייה כפול! -' + fine.toLocaleString() + ' ₪', amount: -fine };
    }},
    { id: 'ev_lost_phone', title: 'איבדת טלפון', type: 'negative', action: () => {
        let cost = Math.min(scaled(4000), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'הטלפון שלך נגנב! רכשת חדש ב-' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},
    { id: 'ev_sudden_car_repair', title: 'תקלה ברכב', type: 'negative', action: () => {
        let cost = Math.min(scaled(6000), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'הרכב התקלקל פתאום! תיקון עלה ' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},
    { id: 'ev_card_fraud_small', title: 'הונאת אשראי', type: 'negative', action: () => {
        let lost = Math.min(scaled(8000), window.bank);
        window.bank -= lost;
        window.eventLosses = (window.eventLosses || 0) + lost;
        return { msg: 'מישהו השתמש בכרטיס שלך! איבדת ' + lost.toLocaleString() + ' ₪ מהבנק', amount: -lost };
    }},
    { id: 'ev_emergency_dentist', title: 'טיפול שיניים דחוף', type: 'negative', action: () => {
        let cost = Math.min(scaled(3500), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'טיפול שורש דחוף עלה ' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},
    { id: 'ev_neighbor_damage', title: 'נזק מהשכנים', type: 'negative', action: () => {
        let cost = Math.min(scaled(1800), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'דליפה מהשכן גרמה נזק -' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},
    { id: 'ev_library_fine', title: 'קנס ספרייה', type: 'negative', action: () => {
        let fine = Math.min(scaled(300), window.money);
        window.money -= fine;
        window.eventLosses = (window.eventLosses || 0) + fine;
        return { msg: 'החזרת ספר באיחור של שנה! קנס ' + fine.toLocaleString() + ' ₪', amount: -fine };
    }},
    { id: 'ev_online_gambling', title: 'הפסד בהימור', type: 'negative', action: () => {
        let lost = Math.min(scaled(5000), window.money);
        window.money -= lost;
        window.eventLosses = (window.eventLosses || 0) + lost;
        return { msg: 'הפסדת בהימור אונליין -' + lost.toLocaleString() + ' ₪', amount: -lost };
    }},
    { id: 'ev_small_claim', title: 'תביעה קטנה', type: 'negative', action: () => {
        let cost = Math.min(scaled(12000), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'הפסדת בתביעה קטנה! שילמת ' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},
    { id: 'ev_water_bill', title: 'חשבון מים מפתיע', type: 'negative', action: () => {
        let cost = Math.min(scaled(1000), window.money);
        window.money -= cost;
        window.eventLosses = (window.eventLosses || 0) + cost;
        return { msg: 'קיבלת חשבון מים גבוה במיוחד -' + cost.toLocaleString() + ' ₪', amount: -cost };
    }},

    // ========== אירוע כלא ==========
    { id: 'ev_jail', title: 'נכנסת לכלא', type: 'negative', action: () => {
        const msg = goToJail(4);
        return { msg, amount: 0 };
    }}
];

window.triggerRandomEvent = function(forcedTs) {
    const eventTs  = forcedTs || Date.now();
    const isOffline = window._offlineMode || false;

    const positiveEvents = window.randomEvents.filter(e => e.type === 'positive');
    const negativeEvents = window.randomEvents.filter(e => e.type === 'negative' && e.id !== 'ev_jail');

    if (!isOffline && canBeArrested() && Math.random() < 0.05) {
        const jailEvent = window.randomEvents.find(e => e.id === 'ev_jail');
        if (jailEvent) {
            const result    = jailEvent.action();
            const resultMsg = typeof result === 'object' ? result.msg : result;
            addEventLog(jailEvent.title, resultMsg, jailEvent.type, eventTs);
            if (typeof showMsgLong === 'function')
                showMsgLong('⚠️ ' + jailEvent.title + ': ' + resultMsg, 'var(--red)');
            if (typeof updateUI === 'function') updateUI();
            if (typeof saveGame === 'function') saveGame();
            return;
        }
    }

    const usePositive = Math.random() < 0.60;
    const pool = (usePositive && positiveEvents.length > 0) ? positiveEvents
               : (negativeEvents.length > 0)               ? negativeEvents
               : window.randomEvents.filter(e => e.id !== 'ev_jail');

    if (pool.length === 0) return;

    const event  = pool[Math.floor(Math.random() * pool.length)];
    const result = event.action();

    const resultMsg = typeof result === 'object' ? result.msg : result;
    const amount    = (typeof result === 'object' && result.amount) ? result.amount : 0;

    let logMsg = resultMsg;
    if (amount !== 0) {
        const sign = amount > 0 ? '+' : '';
        logMsg += ' | ' + sign + Math.abs(amount).toLocaleString() + ' ₪';
    }

    addEventLog(event.title, logMsg, event.type, eventTs);

    if (!isOffline) {
        const color = event.type === 'positive' ? 'var(--green)' : 'var(--red)';
        const icon  = event.type === 'positive' ? '🎉' : '⚠️';
        if (typeof showMsgLong === 'function')
            showMsgLong(icon + ' ' + event.title + ': ' + resultMsg, color);
        else if (typeof showMsg === 'function')
            showMsg(icon + ' ' + event.title + ': ' + resultMsg, color);
    }

    if (typeof updateUI === 'function') updateUI();
    if (typeof saveGame === 'function') saveGame();
};
