/* Smart Money Pro - js/events.js - v9.5.0 - Random Events System (Clean Version) */
window.randomEvents = [
    // --- אירועים קיימים ---
    {
        id: 'ev_bonus',
        title: 'בונוס הצטיינות!',
        type: 'positive',
        action: () => {
            let amount = Math.floor(window.money * 0.1) + 500;
            window.money += amount;
            return `קיבלת בונוס של ${amount.toLocaleString()} ₪`;
        }
    },
    {
        id: 'ev_inheritance',
        title: 'ירושה מפתיעה',
        type: 'positive',
        action: () => {
            window.money += 5000;
            return `קיבלת 5,000 ₪ לחשבון.`;
        }
    },
    {
        id: 'ev_tax_fine',
        title: 'ביקורת מס הכנסה',
        type: 'negative',
        action: () => {
            let fine = Math.floor(window.money * 0.08);
            fine = Math.min(fine, window.money);
            window.money -= fine;
            window.eventLosses = (window.eventLosses || 0) + fine;
            return `שילמת קנס בסך ${fine.toLocaleString()} ₪`;
        }
    },
    {
        id: 'ev_appliance_broken',
        title: 'תקלה בבית',
        type: 'negative',
        action: () => {
            let cost = Math.min(1200, window.money);
            window.money -= cost;
            window.eventLosses = (window.eventLosses || 0) + cost;
            return `התיקון עלה לך ${cost.toLocaleString()} ₪`;
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
                if (typeof showMsgLong === 'function') {
                    showMsgLong("✅ המשבר הסתיים, ההכנסה חזרה לסדרה", "var(--green)");
                }
            }, 120000);
            return `שביתה! ההכנסה ירדה ב-${lost.toFixed(1)} ₪ לדקה.`;
        }
    },
    // --- אירועים חדשים שהוספתי (בפורמט המקורי שלך) ---
    {
        id: 'ev_lottery',
        title: 'זכייה בלוטו',
        type: 'positive',
        action: () => {
            window.money += 2500;
            return `זכית ב-2,500 ₪ בלוטו!`;
        }
    },
    {
        id: 'ev_tax_refund',
        title: 'החזר מס',
        type: 'positive',
        action: () => {
            window.money += 1200;
            return `קיבלת החזר מס על סך 1,200 ₪.`;
        }
    },
    {
        id: 'ev_dentist',
        title: 'טיפול שיניים',
        type: 'negative',
        action: () => {
            let cost = Math.min(1500, window.money);
            window.money -= cost;
            window.eventLosses = (window.eventLosses || 0) + cost;
            return `הטיפול עלה לך ${cost.toLocaleString()} ₪.`;
        }
    },
    {
        id: 'ev_black_market_deal',
        title: 'עסקת שוק שחור',
        type: 'positive',
        action: () => {
            let gain = 4000;
            window.blackMoney = (window.blackMoney || 0) + gain;
            return `העסקה הצליחה! +${gain.toLocaleString()} ₪ לכסף שחור.`;
        }
    },
    {
        id: 'ev_police_raid',
        title: 'פשיטה משטרתית',
        type: 'negative',
        action: () => {
            let lost = Math.floor((window.blackMoney || 0) * 0.3);
            window.blackMoney = Math.max(0, (window.blackMoney || 0) - lost);
            return `הוחרמו לך ${lost.toLocaleString()} ₪ מהכסף השחור!`;
        }
    }
];

window.triggerRandomEvent = function() {
    const event = window.randomEvents[Math.floor(Math.random() * window.randomEvents.length)];
    const resultMsg = event.action();
    const color = event.type === 'positive' ? 'var(--green)' : 'var(--red)';
    const icon = event.type === 'positive' ? '🎉' : '⚠️';
    // חזרה למבנה המקורי שלך בדיוק:
    const fullMessage = `${icon} ${event.title}: ${resultMsg}`;
    
    if (typeof showMsgLong === 'function') showMsgLong(fullMessage, color);
    else if (typeof showMsg === 'function') showMsg(fullMessage, color);
    
    if (window.updateUI) window.updateUI();
};
