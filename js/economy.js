/* Smart Money Pro - js/economy.js - v9.1.0 - Bank Only */

/* Smart Money Pro - js/economy.js - v6.0.5 - Full Expansion Update */

// --- מערכת הבנק המרכזית ---

function drawBank(c) {
    if (!c) return;
    c.innerHTML = `
    <div class="card fade-in">
        <h3 style="margin-top:0;">🏦 ניהול חשבון בנק</h3>
        <p style="font-size:12px; opacity:0.8;">כסף בבנק בטוח מפני הפסדים בקזינו.</p>
        
        <div class="grid-2">
            <div class="card" style="margin:0; text-align:center; padding:15px; border:1px solid var(--blue);">
                <small>יתרה בבנק</small><br>
                <b style="font-size:18px; color:var(--blue);">${bank.toLocaleString()}₪</b>
            </div>
            <div class="card" style="margin:0; text-align:center; padding:15px; border:1px solid var(--red);">
                <small>חוב קיים (הלוואות)</small><br>
                <b style="font-size:18px; color:var(--red);">${loan.toLocaleString()}₪</b>
            </div>
        </div>
        
        <div style="margin:20px 0;">
            <input type="number" id="bank-amt" placeholder="הכנס סכום להפקדה/משיכה..." 
                style="width:100%; padding:15px; border-radius:12px; border:1px solid var(--border); background:rgba(0,0,0,0.2); color:var(--text); text-align:center; font-size:16px;">
        </div>
        
        <div class="grid-2">
            <button class="action" onclick="executeBankOp('dep')" style="background:var(--green); color:white;">⬇️ הפקד לבנק</button>
            <button class="action" onclick="executeBankOp('wd')" style="background:var(--blue); color:white;">⬆️ משוך מזומן</button>
        </div>
        
        <hr style="opacity:0.1; margin:25px 0;">
        
        <h4 style="margin:0 0 10px 0;">מסגרת אשראי והלוואות</h4>
        <div class="grid-2">
            <button class="action" style="background:var(--yellow); color:black; font-size:13px;" onclick="executeLoanOp('take')">
                קח הלוואה: 10,000₪
            </button>
            <button class="action" style="background:#ec4899; color:white; font-size:13px;" onclick="executeLoanOp('pay')">
                החזר חוב: 10,500₪
            </button>
        </div>
        <p style="font-size:10px; color:var(--red); text-align:center; margin-top:8px;">* החזר הלוואה כולל עמלת ריבית של 5%.</p>
    </div>`;
}

function executeBankOp(type) {
    const input = document.getElementById('bank-amt');
    if (!input) return;
    const amt = parseInt(input.value);
    
    if (!amt || amt <= 0) {
        showMsg("אנא הזן סכום חוקי לפעולה", "var(--red)");
        return;
    }
    
    if (type === 'dep') {
        if (money >= amt) {
            money -= amt;
            bank += amt;
            showMsg(`הופקדו ${amt.toLocaleString()}₪ בהצלחה לחשבון`, "var(--green)");
        } else {
            // תיקון: הצגת סכום חסר
            const missing = (amt - money).toLocaleString();
            showMsg(`אין עליך מספיק מזומן! חסר לך ${missing}₪`, "var(--red)");
            return;
        }
    } else if (type === 'wd') {
        if (bank >= amt) {
            bank -= amt;
            money += amt;
            showMsg(`משכת ${amt.toLocaleString()}₪ מהבנק`, "var(--blue)");
        } else {
            // תיקון: הצגת סכום חסר בבנק
            const missing = (amt - bank).toLocaleString();
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
        loan += 10000;
        money += 10000;
        showMsg("ההלוואה אושרה! קיבלת 10,000₪ מזומן.", "var(--yellow)");
    } else if (type === 'pay') {
        if (loan === 0) {
            showMsg("אין לך חובות לבנק כרגע.", "var(--white)");
            return;
        }
        if (money >= 10500) {
            money -= 10500;
            loan = Math.max(0, loan - 10000);
            showMsg("שילמת 10,000₪ מהחוב + 500₪ ריבית.", "var(--green)");
        } else {
            // תיקון: הצגת סכום חסר להחזר הלוואה
            const missing = (10500 - money).toLocaleString();
            showMsg(`חסר לך ${missing}₪ מזומן להחזר החוב!`, "var(--red)");
            return;
        }
    }
    
    updateUI();
    saveGame();
    drawBank(document.getElementById("content"));
}
