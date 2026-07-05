/* Smart Money Pro - js/economy.js - v9.3.0 - Bank Only (deposit/withdraw only, loan removed) */

// --- מערכת הבנק המרכזית ---

function drawBank(c) {
    if (!c) return;
    c.innerHTML = `
    <div class="card fade-in">
        <h3 style="margin-top:0;">🏦 ניהול חשבון בנק</h3>
        <p style="font-size:12px; opacity:0.8;">כסף בבנק בטוח מפני הפסדים בקזינו.</p>
        
        <div class="card" style="margin:0 0 20px 0; text-align:center; padding:15px; border:1px solid var(--blue);">
            <small>יתרה בבנק</small><br>
            <b style="font-size:22px; color:var(--blue);">${bank.toLocaleString()}₪</b>
        </div>
        
        <div style="margin:20px 0;">
            <input type="number" id="bank-amt" placeholder="הכנס סכום להפקדה/משיכה..." 
                style="width:100%; padding:15px; border-radius:12px; border:1px solid var(--border); background:rgba(0,0,0,0.2); color:var(--text); text-align:center; font-size:16px;">
        </div>
        
        <div class="grid-2">
            <button class="action" onclick="executeBankOp('dep')" style="background:var(--green); color:white;">⬇️ הפקד לבנק</button>
            <button class="action" onclick="executeBankOp('wd')" style="background:var(--blue); color:white;">⬆️ משוך מזומן</button>
        </div>
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
