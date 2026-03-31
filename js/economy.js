/* Smart Money Pro - js/economy.js - v6.1.2 - Financial Engine */

// --- מנוע הכנסה פסיבית אוטומטי ---
// מוסיף כסף לחשבון כל 60 שניות על סמך המשתנה passive
setInterval(() => {
    if (passive > 0) {
        const minuteProfit = passive / 60;
        money += minuteProfit;
        
        // עדכון UI שקט
        if (typeof renderUIUpdate === 'function') renderUIUpdate();
        
        // שמירה אוטומטית כל דקה אם יש רווח
        saveGame();
    }
}, 60000);

// --- מערכת הבנק המרכזית ---

function drawBank(c) {
    if(!c) return;
    c.innerHTML = `
    <div class="card fade-in">
        <h3 style="margin-top:0;">🏦 ניהול חשבון בנק</h3>
        <p style="font-size:12px; opacity:0.8;">כסף בבנק מוגן ובטוח מפני הפסדים.</p>
        
        <div class="grid-2">
            <div class="card" style="margin:0; text-align:center; padding:15px; border:1px solid var(--blue); background:rgba(59, 130, 246, 0.05);">
                <small>יתרה בבנק</small><br>
                <b style="font-size:18px; color:var(--blue);">${Math.floor(bank).toLocaleString()}₪</b>
            </div>
            <div class="card" style="margin:0; text-align:center; padding:15px; border:1px solid var(--red); background:rgba(239, 68, 68, 0.05);">
                <small>חוב הלוואות</small><br>
                <b style="font-size:18px; color:var(--red);">${Math.floor(loan).toLocaleString()}₪</b>
            </div>
        </div>
        
        <div style="margin:20px 0;">
            <input type="number" id="bank-amt" placeholder="סכום..." 
                style="width:100%; padding:15px; border-radius:12px; border:1px solid var(--border); background:rgba(0,0,0,0.2); color:#fff; text-align:center; font-size:20px;">
        </div>
        
        <div class="grid-2">
            <button class="action" onclick="executeBankOp('dep')" style="background:var(--green); color:white;">⬇️ הפקד</button>
            <button class="action" onclick="executeBankOp('wd')" style="background:var(--blue); color:white;">⬆️ משוך</button>
        </div>
        
        <div style="margin-top:20px;">
            <button class="action" style="background:var(--yellow); color:black; width:100%;" onclick="executeLoanOp('take')">💰 בקש הלוואה (10,000₪)</button>
            <button class="action" style="background:rgba(255,255,255,0.05); color:#fff; width:100%; margin-top:10px; font-size:12px;" onclick="executeLoanOp('pay')">החזר חוב (10,000₪ + 5% ריבית)</button>
        </div>
    </div>`;
}

function executeBankOp(type) {
    const input = document.getElementById('bank-amt');
    const amt = parseInt(input?.value);
    
    if(!amt || amt <= 0) return showStatus("הזן סכום תקין", "red");
    
    if(type === 'dep') {
        if(money >= amt) {
            money -= amt; 
            bank += amt;
            showStatus(`הופקדו ${amt.toLocaleString()}₪`, "green");
        } else showStatus("אין לך מספיק מזומן!", "red");
    } else {
        if(bank >= amt) {
            bank -= amt; 
            money += amt;
            showStatus(`נמשכו ${amt.toLocaleString()}₪`, "blue");
        } else showStatus("אין מספיק יתרה בבנק!", "red");
    }
    
    input.value = '';
    updateUI(); 
    saveGame(); 
    drawBank(document.getElementById("content"));
}

function executeLoanOp(type) {
    if(type === 'take') {
        loan += 10000; 
        money += 10000;
        showStatus("הלוואה אושרה!", "green");
    } else {
        const repayAmt = 10500; // חוב + ריבית
        if(loan >= 10000 && money >= repayAmt) {
            money -= repayAmt; 
            loan -= 10000;
            showStatus("החוב צומצם ב-10,000₪", "green");
        } else {
            showStatus("חסר מזומן להחזר (נדרש 10,500₪)", "red");
        }
    }
    updateUI(); 
    saveGame(); 
    drawBank(document.getElementById("content"));
}

// --- פונקציית רכישה אחודה ---
// משמשת את כל הטאבים ב-activities.js
function executeBuy(type, name, cost, value, icon) {
    if(money >= cost) {
        money -= cost;
        
        if(type === 'business' || type === 'estate') {
            passive += value;
        } else if(type === 'market') {
            lifeXP += value;
        }
        
        inventory.push(name);
        showStatus(`רכשת ${name}!`, "green");
        
        updateUI();
        saveGame();
        
        // רענון הטאב שבו השחקן נמצא
        const content = document.getElementById("content");
        if(type === 'business' && typeof drawBusiness === 'function') drawBusiness(content);
        else if(type === 'estate' && typeof drawEstate === 'function') drawEstate(content);
        else if(typeof drawMarket === 'function') drawMarket(content);
        
        return true;
    } else {
        showStatus("אין לך מספיק מזומן!", "red");
        return false;
    }
}
