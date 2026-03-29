/* Smart Money Pro - js/economy.js - v6.0.4 - Full Economy & Market Update */

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
            showMsg("אין עליך מספיק מזומן להפקדה זו!", "var(--red)");
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
            showMsg("אין לך 10,500₪ במזומן להחזר החוב!", "var(--red)");
            return;
        }
    }
    
    updateUI(); 
    saveGame();
    drawBank(document.getElementById("content"));
}

// --- בורסה דינמית ---

const baseStocks = [
    { id: 'AAPL', name: 'Apple', basePrice: 150 },
    { id: 'TSLA', name: 'Tesla', basePrice: 200 },
    { id: 'NVDA', name: 'Nvidia', basePrice: 450 },
    { id: 'BTC',  name: 'Bitcoin', basePrice: 65000 },
    { id: 'GOOG', name: 'Google', basePrice: 140 },
    { id: 'AMZN', name: 'Amazon', basePrice: 175 },
    { id: 'MSFT', name: 'Microsoft', basePrice: 400 },
    { id: 'NFLX', name: 'Netflix', basePrice: 600 },
    { id: 'META', name: 'Meta', basePrice: 480 },
    { id: 'ELAL', name: 'El-Al', basePrice: 5 }
];

let currentStocks = JSON.parse(JSON.stringify(baseStocks));

function refreshStockPrices() {
    currentStocks.forEach(stock => {
        const fluctuation = 1 + ((Math.random() * 0.3) - 0.15);
        stock.basePrice = Math.max(1, Math.floor(stock.basePrice * fluctuation)); 
    });
}

function drawInvest(c) {
    if(!c) return;
    refreshStockPrices();
    
    let html = `
    <div class="card fade-in">
        <h3 style="margin-top:0;">📈 מסחר בבורסה</h3>
        <p style="font-size:11px; opacity:0.8; margin-bottom:15px;">המחירים משתנים בכל פעם שאתה נכנס למסך זה. קנה בזול, מכור ביוקר!</p>
        <div class="grid-2">`;
        
    currentStocks.forEach(s => {
        const ownedCount = invOwned[s.id] || 0;
        const totalValue = ownedCount * s.basePrice;
        
        html += `
        <div class="card" style="padding:12px; font-size:12px; text-align:center; border:1px solid rgba(255,255,255,0.05);">
            <b style="font-size:14px;">${s.name} (${s.id})</b><br>
            <span style="color:var(--yellow); font-weight:bold; font-size:16px;">${s.basePrice.toLocaleString()}₪</span>
            
            <div class="grid-2" style="margin-top:10px; gap:8px;">
                <button class="action" style="padding:8px 0; height:auto; background:var(--green); color:white; font-size:12px;" onclick="executeStockOp('buy', '${s.id}', ${s.basePrice})">קנה</button>
                <button class="action" style="padding:8px 0; height:auto; background:var(--red); color:white; font-size:12px;" onclick="executeStockOp('sell', '${s.id}', ${s.basePrice})" ${ownedCount === 0 ? 'disabled' : ''}>מכור</button>
            </div>
            
            <div style="margin-top:8px; font-size:11px; background:rgba(0,0,0,0.2); padding:5px; border-radius:6px;">
                בתיק: <b>${ownedCount}</b> <br> שווי: <b style="color:var(--blue)">${totalValue.toLocaleString()}₪</b>
            </div>
        </div>`;
    });
    
    html += `</div></div>`;
    c.innerHTML = html;
}

function executeStockOp(type, id, price) {
    if(type === 'buy') {
        if(money >= price) { 
            money -= price; 
            invOwned[id] = (invOwned[id] || 0) + 1; 
            showMsg(`רכשת ${id} ב-${price.toLocaleString()}₪`, "var(--green)"); 
        } else {
            showMsg("אין לך מספיק מזומן!", "var(--red)");
            return;
        }
    } else if(type === 'sell') {
        if(invOwned[id] && invOwned[id] > 0) { 
            money += price; 
            invOwned[id]--; 
            showMsg(`מכרת ${id} ב-${price.toLocaleString()}₪`, "var(--blue)"); 
        } else {
            showMsg("אין לך מה למכור!", "var(--red)");
            return;
        }
    }
    
    updateUI(); 
    saveGame();
    drawInvest(document.getElementById("content")); 
}

// --- עסקים ושוק (מעודכן עם כל הרשימה שלך) ---

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

function executeBuy(type, name, cost, value, icon) {
    if(money >= cost) {
        money -= cost;
        if(type === 'business') {
            passive += value;
        } else {
            lifeXP += value;
        }
        inventory.push({name: name, icon: icon});
        showMsg(`רכשת ${name}!`, "var(--green)");
        updateUI();
        saveGame();
        
        const content = document.getElementById("content");
        if(type === 'business') drawBusiness(content);
        else drawMarket(content);
    } else {
        showMsg("אין לך מספיק מזומן!", "var(--red)");
    }
}
