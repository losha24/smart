/* Smart Money Pro - economy.js - v6.5.2 TURBO - FULL & FINAL */

// --- 1. מערכת הבנק (Bank) ---
function drawBank(c) {
    if(!c) return;
    c.innerHTML = `
    <div class="card fade-in">
        <h3 style="margin:0 0 15px 0;">🏦 בנק הפועלים - ניהול עו"ש</h3>
        <div class="grid-2" style="margin-bottom:15px;">
            <div class="card" style="margin:0; text-align:center; border:1px solid var(--blue); background: rgba(0, 210, 255, 0.05);">
                <small style="opacity:0.7;">יתרה בבנק</small><br>
                <b id="bank-display" style="font-size:18px; color:var(--blue);">₪${Math.floor(bank).toLocaleString()}</b>
            </div>
            <div class="card" style="margin:0; text-align:center; border:1px solid var(--red); background: rgba(255, 49, 49, 0.05);">
                <small style="opacity:0.7;">חוב הלוואות</small><br>
                <b style="font-size:18px; color:var(--red);">₪${(loan || 0).toLocaleString()}</b>
            </div>
        </div>
        
        <input type="number" id="bank-amt" placeholder="הזן סכום לפעולה..." 
               style="width:100%; padding:15px; border-radius:12px; border:1px solid var(--border); background:#000; color:#fff; margin-bottom:15px; text-align:center; font-size:18px;">
        
        <div class="grid-2">
            <button class="action" onclick="bankOp('dep')" style="background:var(--green); color:black; font-size:14px;">הפקדה 📥</button>
            <button class="action" onclick="bankOp('wd')" style="background:var(--blue); color:black; font-size:14px;">משיכה 📤</button>
        </div>
        
        <button class="sys-btn" style="width:100%; margin-top:15px; color:var(--yellow); border:1px solid var(--yellow); padding:12px; background:transparent; border-radius:10px; font-weight:bold;" 
                onclick="takeLoan()">💰 בקש הלוואה מיידית (₪10,000)</button>
    </div>`;
}

function bankOp(type) {
    const amt = parseInt(document.getElementById('bank-amt').value);
    if (!amt || amt <= 0) return showMsg("נא להזין סכום תקין", "var(--red)");

    if (type === 'dep') {
        if (money >= amt) {
            money -= amt;
            bank += amt;
            showMsg("הפקדה בוצעה בהצלחה", "var(--green)");
        } else showMsg("אין לך מספיק מזומן פנוי", "var(--red)");
    } else {
        if (bank >= amt) {
            bank -= amt;
            money += amt;
            showMsg("משיכה בוצעה בהצלחה", "var(--blue)");
        } else showMsg("אין מספיק יתרה בבנק", "var(--red)");
    }
    updateUI();
    saveGame();
    drawBank(document.getElementById('content'));
}

function takeLoan() {
    if (typeof loan === 'undefined') window.loan = 0;
    loan += 10000;
    money += 10000;
    showMsg("הלוואה אושרה והועברה למזומן", "var(--yellow)");
    updateUI();
    saveGame();
    drawBank(document.getElementById('content'));
}

// --- 2. בורסה דינמית (Stocks) ---
const stockMarket = [
    { id: 'AAPL', name: 'Apple Inc', price: 180 },
    { id: 'TSLA', name: 'Tesla Motor', price: 240 },
    { id: 'NVDA', name: 'NVIDIA AI', price: 450 },
    { id: 'BTC',  name: 'Bitcoin', price: 68000 },
    { id: 'ELAL', name: 'אל-על נתיבים', price: 25 }
];

function drawInvest(c) {
    if(!c) return;
    let html = `<h3>📈 בורסת ניירות ערך</h3><div class="grid-1">`;
    stockMarket.forEach(s => {
        if (typeof invOwned === 'undefined') window.invOwned = {};
        const owned = invOwned[s.id] || 0;
        // תנודתיות מחירים רנדומלית בטורבו
        const currentPrice = Math.floor(s.price * (0.85 + Math.random() * 0.3));
        
        html += `
        <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <b style="font-size:16px; color:var(--text);">${s.name}</b><br>
                <small style="opacity:0.6;">בבעלותך: ${owned}</small>
            </div>
            <div style="text-align:center; font-weight:900; color:var(--yellow); font-size:18px;">
                ₪${currentPrice.toLocaleString()}
            </div>
            <div style="display:flex; gap:8px;">
                <button class="sys-btn" onclick="stockOp('buy','${s.id}',${currentPrice})">קנה</button>
                <button class="sys-btn" style="color:var(--red); border-color:var(--red);" onclick="stockOp('sell','${s.id}',${currentPrice})">מכור</button>
            </div>
        </div>`;
    });
    c.innerHTML = html + "</div>";
}

function stockOp(type, id, price) {
    if (type === 'buy') {
        if (money >= price) {
            money -= price;
            invOwned[id] = (invOwned[id] || 0) + 1;
            showMsg(`רכשת מניית ${id}`, "var(--green)");
        } else showMsg("חסר מזומן לקנייה", "var(--red)");
    } else {
        if (invOwned[id] > 0) {
            money += price;
            invOwned[id]--;
            showMsg(`מכרת מניית ${id}`, "var(--yellow)");
        } else showMsg("אין לך מניות למכירה", "var(--red)");
    }
    updateUI();
    saveGame();
    drawInvest(document.getElementById('content'));
}

// --- 3. מנגנון רכישה מאוחד (נדל"ן, עסקים ושוק) ---
function drawEstate(c) {
    const list = [
        {n:"דירת סטודיו", c:250000, p:800, i:"🏢"}, 
        {n:"דירת גן", c:900000, p:3500, i:"🏡"}, 
        {n:"פנטהאוז", c:2800000, p:12000, i:"🏙️"},
        {n:"אחוזה", c:8500000, p:40000, i:"🏰"}
    ];
    renderEconomyTab(c, "🏠 נכסי נדל\"ן", list, 'estate');
}

function drawBusiness(c) {
    const list = [
        {n:"דוכן קפה", c:15000, p:45, i:"☕"}, 
        {n:"פיצריה", c:250000, p:850, i:"🍕"}, 
        {n:"מוסך", c:1200000, p:4200, i:"🔧"}, 
        {n:"קניון", c:25000000, p:95000, i:"🏢"}
    ];
    renderEconomyTab(c, "🏢 השקעה בעסקים", list, 'business');
}

function drawMarket(c) {
    const list = [
        {n:"אייפון 15", c:6200, p:300, i:"📱"}, 
        {n:"רולקס", c:135000, p:6000, i:"⌚"}, 
        {n:"פסל זהב", c:450000, p:25000, i:"🗿"}
    ];
    renderEconomyTab(c, "🛒 מוצרי פרימיום", list, 'market');
}

function renderEconomyTab(c, title, pool, type) {
    let html = `<h3>${title}</h3><div class="grid-2">`;
    pool.forEach(item => {
        const valLabel = type === 'market' ? `+${item.p.toLocaleString()} XP` : `+₪${item.p.toLocaleString()}/ש`;
        html += `
        <div class="card fade-in" style="text-align:center; border:1px solid var(--border);">
            <div style="font-size:35px; margin-bottom:8px;">${item.i}</div>
            <b style="display:block; min-height:40px;">${item.n}</b>
            <div style="color:${type === 'market' ? 'var(--purple)' : 'var(--green)'}; font-weight:bold; margin-bottom:12px;">${valLabel}</div>
            <button class="sys-btn" style="width:100%;" onclick="executeBuy('${type}','${item.n}',${item.c},${item.p},'${item.i}')">
                ₪${item.c.toLocaleString()}
            </button>
        </div>`;
    });
    c.innerHTML = html + "</div>";
}

function executeBuy(type, name, cost, value, icon) {
    if(money >= cost) {
        money -= cost;
        if(type === 'business' || type === 'estate') {
            passive += value; 
            showMsg(`ההכנסה הפסיבית עלתה ב-₪${value.toLocaleString()}!`, "var(--green)");
        } else if(type === 'market') {
            lifeXP += value; 
            showMsg(`תתחדש! קיבלת ${value.toLocaleString()} XP`, "var(--purple)");
        }
        inventory.push({name, icon, type});
        updateUI();
        saveGame();
        
        // רענון הטאב הנוכחי
        const cont = document.getElementById("content");
        if(type === 'business') drawBusiness(cont);
        else if(type === 'estate') drawEstate(cont);
        else if(type === 'market') drawMarket(cont);
    } else showMsg("אין לך מספיק מזומן פנוי!", "var(--red)");
}
