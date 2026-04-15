/* Smart Money Pro - js/events.js - Random Events System (Clean Version) */

window.randomEvents = [
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
        id: 'ev_market_boom',
        title: 'גאות בבורסה 📈',
        type: 'positive',
        action: () => {
            if(window.stockPrices) {
                for (let s in window.stockPrices) { window.stockPrices[s] *= 1.15; }
            }
            return `המניות זינקו ב-15%!`;
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
            window.money -= fine;
            // עדכון משתנה ההפסדים לסיכום הכניסה
            window.eventLosses = (window.eventLosses || 0) + fine; 
            return `שילמת קנס בסך ${fine.toLocaleString()} ₪`;
        }
    },
    {
        id: 'ev_market_crash',
        title: 'קריסה בבורסה 📉',
        type: 'negative',
        action: () => {
            // כאן קשה לחשב הפסד מדויק בשקלים כי זה שווי תיק, אז נשאיר כהודעה
            if(window.stockPrices) {
                for (let s in window.stockPrices) { window.stockPrices[s] *= 0.90; }
            }
            return `הפסד של 10% בערך המניות.`;
        }
    },
    {
        id: 'ev_appliance_broken',
        title: 'תקלה בבית',
        type: 'negative',
        action: () => {
            let cost = 1200;
            window.money -= cost;
            // עדכון משתנה ההפסדים
            window.eventLosses = (window.eventLosses || 0) + cost;
            return `התיקון עלה לך 1,200 ₪`;
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
    }
];

// פונקציה מרכזית להפעלת אירוע
window.triggerRandomEvent = function() {
    const event = window.randomEvents[Math.floor(Math.random() * window.randomEvents.length)];
    const resultMsg = event.action();
    
    const color = event.type === 'positive' ? 'var(--green)' : 'var(--red)';
    const icon = event.type === 'positive' ? '🎉' : '⚠️';
    const fullMessage = `${icon} ${event.title}: ${resultMsg}`;

    if (typeof showMsgLong === 'function') {
        showMsgLong(fullMessage, color);
    } else if (typeof showMsg === 'function') {
        showMsg(fullMessage, color);
    }
    
    if(window.updateUI) window.updateUI();
};
