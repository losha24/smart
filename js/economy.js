/* Smart Money Pro - js/economy.js - v9.1.0 - Bank Only */

// הערה: drawBank מוגדרת ב-activities.js - כאן רק פונקציות עזר לבנק

function executeBankOp(type) {
    const input = document.getElementById('bank-amt');
    if (!input) return;
    const amt = parseInt(input.value);
    
    if (!amt || amt <= 0) {
        showMsg("אנא הזן סכום חוקי לפעולה", "var(--red)");
        return;
    }
    
    if (type === 'dep') {
        if (window.money >= amt) {
            window.money -= amt;
            window.bank += amt;
            showMsg(`הופקדו ${amt.toLocaleString()}₪ בהצלחה לחשבון`, "var(--green)");
        } else {
            const missing = (amt - window.money).toLocaleString();
            showMsg(`אין עליך מספיק מזומן! חסר לך ${missing}₪`, "var(--red)");
            return;
        }
    } else if (type === 'wd') {
        if (window.bank >= amt) {
            window.bank -= amt;
            window.money += amt;
            showMsg(`משכת ${amt.toLocaleString()}₪ מהבנק`, "var(--blue)");
        } else {
            const missing = (amt - window.bank).toLocaleString();
            showMsg(`אין מספיק יתרה בבנק! חסר לך ${missing}₪`, "var(--red)");
            return;
        }
    }
    
    input.value = '';
    updateUI();
    saveGame();
    drawBank(document.getElementById("content"));
}

function executeLoanOp(type) {
    if (type === 'take') {
        window.loan += 10000;
        window.money += 10000;
        showMsg("ההלוואה אושרה! קיבלת 10,000₪ מזומן.", "var(--yellow)");
    } else if (type === 'pay') {
        if (window.loan === 0) {
            showMsg("אין לך חובות לבנק כרגע.", "var(--blue)");
            return;
        }
        if (window.money >= 10500) {
            window.money -= 10500;
            window.loan = Math.max(0, window.loan - 10000);
            showMsg("שילמת 10,000₪ מהחוב + 500₪ ריבית.", "var(--green)");
        } else {
            const missing = (10500 - window.money).toLocaleString();
            showMsg(`חסר לך ${missing}₪ מזומן להחזר החוב!`, "var(--red)");
            return;
        }
    }
    updateUI();
    saveGame();
    drawBank(document.getElementById("content"));
}
