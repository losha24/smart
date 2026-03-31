/* Smart Money Pro - js/economy.js - v6.1.1 - Full Logic Engine */

/**
 * מציג את מסך הבנק וההלוואות
 * @param {HTMLElement} c - אלמנט התוכן המרכזי
 */
function drawBank(c) {
    if(!c) return;
    c.innerHTML = `
    <div class="card fade-in">
        <h3 style="margin-top:0; color:var(--blue);">🏦 ניהול חשבון בנק</h3>
        <p style="font-size:12px; opacity:0.8;">הכסף בבנק מוגן ובטוח.</p>
        
        <div class="grid-2">
            <div class="card" style="margin:0; text-align:center; padding:15px; border:1px solid var(--blue); background:rgba(59,130,246,0.1);">
                <small>יתרה בבנק</small><br>
                <b style="font-size:18px; color:var(--blue);">${bank.toLocaleString()}₪</b>
            </div>
            <div class="card" style="margin:0; text-align:center; padding:15px; border:1px solid var(--red); background:rgba(239,68,68,0.1);">
                <small>חוב לבנק</small><br>
                <b style="font-size:18px; color:var(--red);">${loan.toLocaleString()}₪</b>
            </div>
        </div>
        
        <div style="margin:20px 0;">
            <input type="number" id="bank-amt" placeholder="הכנס סכום..." 
                style="width:100%; padding:15px; border-radius:12px; border:1px solid var(--border); background:rgba(0,0,0,0.2); color:var(--text); text-align:center; font-size:16px;">
        </div>
        
        <div class="grid-2">
            <button class="action" onclick="executeBankOp('dep')" style="background:var(--green); color:white;">⬇️ הפקד</button>
            <button class="action" onclick="executeBankOp('wd')" style="background:var(--blue); color:white;">⬆️ משוך</button>
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
        <p style="font-size:10px; color:var(--red); text-align:center; margin-top:8px;">* החזר הלוואה כולל ריבית של 5%.</p>
    </div>`;
}

/**
 * מבצע פעולות הפקדה ומשיכה בבנק
 */
function executeBankOp(type) {
    const input = document.getElementById('bank-amt');
    if(!input) return;
    const amt = parseInt(input.value);
    
    if(!amt || amt <= 0) { 
        showMsg("אנא הזן סכום חוקי", "var(--red)"); 
        return; 
    }
    
    if(type === 'dep') {
        if(money >= amt) {
            money -= amt; 
            bank += amt; 
            showMsg(`הפקדת ${amt.toLocaleString()}₪ בהצלחה`, "var(--green)"); 
        } else {
            showMsg("אין לך מספיק מזומן בקופה!", "var(--red)");
            return;
        }
    } else if(type === 'wd') {
        if(bank >= amt) {
            bank -= amt; 
            money += amt; 
            showMsg(`משכת ${amt.toLocaleString()}₪ מהבנק`, "var(--blue)"); 
        } else {
            showMsg("אין מספיק יתרה בבנק למשיכה זו!", "var(--red)");
            return;
        }
    }
    
    input.value = '';
    updateUI(); 
    saveGame();
    drawBank(document.getElementById("content"));
}

/**
 * מבצע פעולות הלוואה (לקיחה או החזר)
 */
function executeLoanOp(type) {
    if(type === 'take') { 
        loan += 10000; 
        money += 10000; 
        showMsg("קיבלת הלוואה של 10,000₪", "var(--yellow)");
    } else if (type === 'pay') {
        if (loan <= 0) {
            showMsg("אין לך חובות פעילים.", "var(--white)");
            return;
        }
        if (money >= 10500) { 
            money -= 10500; 
            loan = Math.max(0, loan - 10000); 
            showMsg("שילמת 10,000₪ מהחוב + ריבית.", "var(--green)"); 
        } else {
            showMsg("חסרים לך 10,500₪ להחזר חוב!", "var(--red)");
            return;
        }
    }
    
    updateUI(); 
    saveGame();
    drawBank(document.getElementById("content"));
}

/**
 * פונקציית רכישה אחודה לנכסים, עסקים ומוצרי יוקרה
 */
function executeBuy(type, name, cost, value, icon) {
    if(money >= cost) {
        money -= cost;
        
        // עדכון הכנסה פסיבית או נקודות ניסיון
        if(type === 'business' || type === 'estate') {
            passive += value;
        } else if(type === 'market') {
            lifeXP += value;
        }
        
        // הוספה למערך המלאי
        inventory.push(name);
        
        showMsg(`תתחדש! רכשת ${name} ${icon}`, "var(--green)");
        
        updateUI();
        saveGame();
        
        // רענון אוטומטי של הטאב שבו המשתמש נמצא
        const content = document.getElementById("content");
        if(type === 'business') drawBusiness(content);
        else if(type === 'estate') drawEstate(content);
        else if(type === 'market') drawMarket(content);
    } else {
        showMsg("אין לך מספיק מזומן לרכישה הזו!", "var(--red)");
    }
}

/**
 * ניהול פעולות קנייה ומכירה בבורסה
 */
function executeStockOp(type, id, price) {
    if(type === 'buy') {
        if(money >= price) { 
            money -= price; 
            invOwned[id] = (invOwned[id] || 0) + 1; 
            showMsg(`קנית יחידה של ${id}`, "var(--green)"); 
        } else {
            showMsg("אין לך מספיק מזומן!", "var(--red)");
            return;
        }
    } else if(type === 'sell') {
        if(invOwned[id] && invOwned[id] > 0) { 
            money += price; 
            invOwned[id]--; 
            showMsg(`מכרת יחידה של ${id}`, "var(--blue)"); 
        } else {
            showMsg("אין לך יחידות למכירה!", "var(--red)");
            return;
        }
    }
    
    updateUI(); 
    saveGame();
    drawInvest(document.getElementById("content")); 
}
