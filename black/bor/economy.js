/* Smart Money Pro - js/economy.js - v9.0.0 - Clean Version */

// --- מערכת הבנק המרכזית ---

function drawBank(c) {
    if(!c) return;
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
    if(!input) return;
    const amt = parseInt(input.value);
    
    if(!amt || amt <= 0) { 
        showMsg("אנא הזן סכום חוקי לפעולה", "var(--red)"); 
        return; 
    }
    
    if(type === 'dep') {
        if(money >= amt) {
            money -= amt; 
            bank += amt; 
            showMsg(`הופקדו ${amt.toLocaleString()}₪ בהצלחה לחשבון`, "var(--green)"); 
        } else {
            const missing = (amt - money).toLocaleString();
            showMsg(`אין עליך מספיק מזומן! חסר לך ${missing}₪`, "var(--red)");
            return;
        }
    } else if(type === 'wd') {
        if(bank >= amt) {
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

function executeLoanOp(type) {
    if(type === 'take') { 
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
            const missing = (10500 - money).toLocaleString();
            showMsg(`חסר לך ${missing}₪ מזומן להחזר החוב!`, "var(--red)");
            return;
        }
    }
    
    updateUI(); 
    saveGame();
    drawBank(document.getElementById("content"));
}

// --- נדל"ן ---

function drawEstate(c) {
    if(!c) return;
    const estPool = [
        {n:"דירת סטודיו", c:250000, p:800, i:"🏢"}, 
        {n:"דירת 3 חדרים", c:550000, p:1800, i:"🏠"}, 
        {n:"דירת גן", c:900000, p:3500, i:"🏡"}, 
        {n:"בית פרטי", c:1200000, p:5000, i:"🏘️"},
        {n:"פנטהאוז", c:1800000, p:7500, i:"🏙️"}, 
        {n:"דופלקס מעצבים", c:2500000, p:10500, i:"💎"},
        {n:"וילה יוקרתית", c:4500000, p:18000, i:"🏰"},
        {n:"אחוזה כפרית", c:8500000, p:35000, i:"🚜"},
        {n:"בניין מגורים", c:15000000, p:70000, i:"🏢"},
        {n:"אי פרטי", c:50000000, p:250000, i:"🏝️"}
    ];

    let html = `<h3>🏠 השקעות נדל"ן</h3><div class="grid-2">`;
    estPool.forEach(item => {
        html += `
        <div class="card fade-in" style="text-align:center; padding:12px;">
            <div style="font-size:28px; margin-bottom:5px;">${item.i}</div>
            <b style="display:block; font-size:13px; min-height:32px;">${item.n}</b>
            <div style="color:var(--green); font-size:11px; margin-bottom:8px;">+${item.p.toLocaleString()}₪/ש</div>
            <button class="sys-btn" style="width:100%;" onclick="executeBuy('estate','${item.n}',${item.c},${item.p},'${item.i}')">
                ${item.c.toLocaleString()}₪
            </button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

// --- עסקים ---

function drawBusiness(c) {
    if(!c) return;
    const bzPool = [
        {n:"דוכן קפה", c:15000, p:20, i:"☕"}, 
        {n:"קיוסק", c:45000, p:60, i:"🏪"}, 
        {n:"פיצריה", c:250000, p:350, i:"🍕"}, 
        {n:"מספרה", c:80000, p:110, i:"✂️"}, 
        {n:"חנות בגדים", c:550000, p:800, i:"👕"}, 
        {n:"מוסך", c:1200000, p:1800, i:"🔧"}, 
        {n:"מסעדה", c:3000000, p:4500, i:"🍽️"}, 
        {n:"סופרמרקט", c:8000000, p:12000, i:"🛒"}, 
        {n:"קניון", c:25000000, p:40000, i:"🏢"}, 
        {n:"מפעל", c:60000000, p:100000, i:"🏭"}
    ];

    let html = `<h3>🏢 השקעה בעסקים</h3><div class="grid-2">`;
    bzPool.forEach(item => {
        html += `
        <div class="card fade-in" style="text-align:center; padding:15px;">
            <div style="font-size:30px; margin-bottom:5px;">${item.i}</div>
            <b style="display:block; font-size:14px; min-height:35px;">${item.n}</b>
            <div style="color:var(--green); font-size:12px; margin-bottom:10px;">+${item.p.toLocaleString()}₪/ש</div>
            <button class="sys-btn" style="width:100%;" onclick="executeBuy('business','${item.n}',${item.c},${item.p},'${item.i}')">
                ${item.c.toLocaleString()}₪
            </button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

// --- שוק מוצרי יוקרה ---

function drawMarket(c) {
    if(!c) return;
    const mkPool = [
        {n:"אייפון 15", c:5500, p:250, i:"📱"}, 
        {n:"מחשב גיימינג", c:15000, p:700, i:"💻"}, 
        {n:"טלוויזיה 8K", c:25000, p:1200, i:"📺"}, 
        {n:"שעון יוקרה", c:120000, p:5000, i:"⌚"}, 
        {n:"ריהוט מעצבים", c:45000, p:2000, i:"🛋️"}, 
        {n:"בריכה פרטית", c:180000, p:8000, i:"🏊"}, 
        {n:"ג'קוזי", c:25000, p:1000, i:"🛁"}, 
        {n:"פסל אמנות", c:100000, p:4500, i:"🗿"}, 
        {n:"יהלום", c:250000, p:12000, i:"💎"}
    ];

    let html = `<h3>🛒 שוק מוצרי יוקרה</h3><div class="grid-2">`;
    mkPool.forEach(item => {
        html += `
        <div class="card fade-in" style="text-align:center; padding:15px;">
            <div style="font-size:30px; margin-bottom:5px;">${item.i}</div>
            <b style="display:block; font-size:14px; min-height:35px;">${item.n}</b>
            <div style="color:var(--blue); font-size:11px; margin-bottom:10px;">+${item.p.toLocaleString()} XP</div>
            <button class="sys-btn" style="width:100%;" onclick="executeBuy('market','${item.n}',${item.c},${item.p},'${item.i}')">
                ${item.c.toLocaleString()}₪
            </button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

// --- פונקציית רכישה אחודה ---

function executeBuy(type, name, cost, value, icon) {
    if(money >= cost) {
        money -= cost;
        
        if(type === 'business' || type === 'estate') {
            passive += value;
        } else if(type === 'market') {
            lifeXP += value;
        }
        
        inventory.push({name: name, icon: icon});
        showMsg(`רכשת ${name}!`, "var(--green)");
        
        updateUI();
        saveGame();
        
        const content = document.getElementById("content");
        if(type === 'business') drawBusiness(content);
        else if(type === 'estate') drawEstate(content);
        else drawMarket(content);
    } else {
        const missing = (cost - money).toLocaleString();
        showMsg(`אין לך מספיק מזומן! חסר לך ${missing}₪`, "var(--red)");
    }
}
