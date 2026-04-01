/* Smart Money Pro - economy.js - v7.2.1 FINAL */

// --- 1. מערכת הבנק והלוואות ---
function drawBank(c) {
    if(!c) return;
    if (typeof window.loan === 'undefined') window.loan = 0;
    
    c.innerHTML = `
    <div class="card fade-in" style="border: 1px solid var(--blue); background: rgba(0, 100, 255, 0.05);">
        <h3 style="margin:0 0 10px 0; color:var(--blue); font-size:16px; text-align:center;">🏦 בנק הפועלים - ניהול הון</h3>
        <div class="grid-2" style="margin-bottom:10px; gap:8px;">
            <div class="card" style="margin:0; text-align:center; padding:10px; border:1px solid var(--blue);">
                <small style="font-size:10px; opacity:0.7;">יתרה בבנק</small><br>
                <b id="bank-display" style="font-size:16px; color:var(--blue);">₪${Math.floor(bank).toLocaleString()}</b>
            </div>
            <div class="card" style="margin:0; text-align:center; padding:10px; border:1px solid var(--red);">
                <small style="font-size:10px; opacity:0.7;">חוב הלוואות</small><br>
                <b style="font-size:16px; color:var(--red);">₪${(window.loan).toLocaleString()}</b>
            </div>
        </div>
        
        <input type="number" id="bank-amt" placeholder="הזן סכום לפעולה..." 
               style="width:100%; padding:12px; border-radius:10px; border:1px solid #333; background:#000; color:#fff; margin-bottom:10px; text-align:center; font-size:16px;">
        
        <div class="grid-2" style="gap:8px;">
            <button class="action" onclick="bankOp('dep')" style="background:var(--green); color:black; font-size:12px; padding:10px;">הפקדה 📥</button>
            <button class="action" onclick="bankOp('wd')" style="background:var(--blue); color:black; font-size:12px; padding:10px;">משיכה 📤</button>
        </div>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-top:10px;">
            <button class="sys-btn" style="color:var(--yellow); border-color:var(--yellow); font-size:10px;" onclick="takeLoan()">💰 בקש ₪50K</button>
            <button class="sys-btn" style="color:var(--red); border-color:var(--red); font-size:10px;" onclick="repayLoan()">📉 החזר ₪10K</button>
        </div>
    </div>`;
}

function bankOp(type) {
    const amt = parseInt(document.getElementById('bank-amt').value);
    if (!amt || amt <= 0) return showMsg("נא להזין סכום תקין", "var(--red)");

    if (type === 'dep') {
        if (money >= amt) { money -= amt; bank += amt; showMsg("הפקדה בוצעה", "var(--green)"); }
        else showMsg("אין מספיק מזומן", "var(--red)");
    } else {
        if (bank >= amt) { bank -= amt; money += amt; showMsg("משיכה בוצעה", "var(--blue)"); }
        else showMsg("אין מספיק יתרה", "var(--red)");
    }
    updateUI(); saveGame(); drawBank(document.getElementById('content'));
}

function takeLoan() {
    if (typeof window.loan === 'undefined') window.loan = 0;
    window.loan += 50000;
    money += 50000;
    showMsg("הלוואה אושרה: +₪50,000", "var(--yellow)");
    updateUI(); saveGame(); drawBank(document.getElementById('content'));
}

function repayLoan() {
    if (window.loan >= 10000 && money >= 10000) {
        window.loan -= 10000;
        money -= 10000;
        showMsg("החזרת ₪10,000", "var(--green)");
    } else showMsg("אין מספיק כסף/חוב", "var(--red)");
    updateUI(); saveGame(); drawBank(document.getElementById('content'));
}

// --- 2. בורסה דינמית ---
const stockMarket = [
    { id: 'AAPL', name: 'Apple', price: 180 },
    { id: 'TSLA', name: 'Tesla', price: 240 },
    { id: 'NVDA', name: 'Nvidia', price: 450 },
    { id: 'BTC',  name: 'Bitcoin', price: 68000 },
    { id: 'ELAL', name: 'אל-על', price: 60 }
];

function drawInvest(c) {
    if(!c) return;
    let h = `<h3>📈 בורסת טורבו</h3><div style="display:grid; grid-template-columns: 1fr; gap:8px;">`;
    stockMarket.forEach(s => {
        if (typeof window.invOwned === 'undefined') window.invOwned = {};
        const owned = window.invOwned[s.id] || 0;
        const currentPrice = Math.floor(s.price * (0.6 + Math.random() * 0.8));
        
        h += `
        <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center; padding:10px;">
            <div style="font-size:12px;"><b>${s.name}</b><br><small style="opacity:0.6;">בבעלותך: ${owned}</small></div>
            <div style="font-weight:900; color:var(--yellow); font-size:14px;">₪${currentPrice.toLocaleString()}</div>
            <div style="display:flex; gap:5px;">
                <button class="sys-btn" style="font-size:10px; padding:5px 10px;" onclick="stockOp('buy','${s.id}',${currentPrice})">קנה</button>
                <button class="sys-btn" style="color:var(--red); border-color:var(--red); font-size:10px; padding:5px 10px;" onclick="stockOp('sell','${s.id}',${currentPrice})">מכור</button>
            </div>
        </div>`;
    });
    c.innerHTML = h + "</div>";
}

function stockOp(type, id, price) {
    if (typeof window.invOwned === 'undefined') window.invOwned = {};
    if (type === 'buy') {
        if (money >= price) { money -= price; window.invOwned[id] = (window.invOwned[id] || 0) + 1; showMsg(`קנית ${id}`, "var(--green)"); }
        else showMsg("חסר מזומן", "var(--red)");
    } else {
        if (window.invOwned[id] > 0) { money += price; window.invOwned[id]--; showMsg(`מכרת ${id}`, "var(--yellow)"); }
        else showMsg("אין מניות!", "var(--red)");
    }
    updateUI(); saveGame(); drawInvest(document.getElementById('content'));
}

// --- 3. נדל"ן, עסקים ושוק (10 פריטים כל אחד) ---
function drawEstate(c) {
    const list = [
        {n:"אוהל משופר", c:3500, p:280, i:"⛺"}, {n:"דירת סטודיו", c:75000, p:6500, i:"🏢"},
        {n:"דירת 4 חדרים", c:280000, p:25000, i:"🏠"}, {n:"דירת גן", c:1100000, p:110000, i:"🏡"},
        {n:"פנטהאוז", c:3800000, p:420000, i:"🏙️"}, {n:"וילה יוקרתית", c:14000000, p:1600000, i:"🏰"},
        {n:"בניין מגורים", c:68000000, p:7800000, i:"🏢"}, {n:"אי פרטי", c:380000000, p:45000000, i:"🌴"},
        {n:"מושבה במאדים", c:1900000000, p:240000000, i:"🚀"}, {n:"כוכב לכת", c:14000000000, p:2100000000, i:"🌌"}
    ];
    renderEconomyGrid(c, "🏠 נכסי נדל\"ן", list, 'estate');
}

function drawBusiness(c) {
    const list = [
        {n:"דוכן קפה", c:14000, p:1400, i:"☕"}, {n:"קיוסק", c:45000, p:5200, i:"🏪"},
        {n:"פיצריה", c:180000, p:22000, i:"🍕"}, {n:"מוסך", c:650000, p:85000, i:"🔧"},
        {n:"אולם אירועים", c:3200000, p:450000, i:"🥂"}, {n:"סופרמרקט", c:16000000, p:2200000, i:"🛒"},
        {n:"חברת הייטק", c:85000000, p:12000000, i:"💻"}, {n:"קניון ענק", c:450000000, p:65000000, i:"🏢"},
        {n:"חברת תעופה", c:2200000000, p:350000000, i:"✈️"}, {n:"אימפריה", c:9500000000, p:1800000000, i:"🌎"}
    ];
    renderEconomyGrid(c, "🏢 אימפריית עסקים", list, 'business');
}

function drawMarket(c) {
    const list = [
        {n:"אייפון 17", c:7500, p:600, i:"📱"}, {n:"רולקס", c:75000, p:7000, i:"⌚"},
        {n:"טבעת יהלום", c:220000, p:22000, i:"💍"}, {n:"פסל זהב", c:650000, p:68000, i:"🗿"},
        {n:"מכונית על", c:3500000, p:400000, i:"🏎️"}, {n:"ציור מקורי", c:18000000, p:2200000, i:"🖼️"},
        {n:"כתר מלכות", c:95000000, p:12000000, i:"👑"}, {n:"ביצת זהב", c:550000000, p:75000000, i:"🥚"},
        {n:"גביע קדוש", c:2200000000, p:320000000, i:"🏆"}, {n:"תיבת פנדורה", c:9900000000, p:1800000000, i:"📦"}
    ];
    renderEconomyGrid(c, "🛒 מוצרי פרימיום", list, 'market');
}

function renderEconomyGrid(c, title, pool, type) {
    let h = `<h3>${title}</h3><div class="grid-4" style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px;">`;
    pool.forEach(item => {
        const valLabel = type === 'market' ? `+${item.p.toLocaleString()} XP` : `+₪${item.p.toLocaleString()}/ש`;
        h += `
        <div class="card fade-in" style="text-align:center; padding:8px; font-size:10px; border: 1px solid #222;">
            <div style="font-size:22px; margin-bottom:5px;">${item.i}</div>
            <b style="display:block; height:24px; overflow:hidden;">${item.n}</b>
            <div style="color:${type === 'market' ? 'var(--purple)' : 'var(--green)'}; font-weight:bold; margin-bottom:5px;">${valLabel}</div>
            <button class="sys-btn" style="width:100%; font-size:9px; padding:5px 0;" onclick="executeBuy('${type}','${item.n}',${item.c},${item.p},'${item.i}')">
                ₪${item.c.toLocaleString()}
            </button>
        </div>`;
    });
    c.innerHTML = h + "</div>";
}

function executeBuy(type, name, cost, value, icon) {
    if(money >= cost) {
        money -= cost;
        if(type === 'business' || type === 'estate') {
            passive += value; 
            showMsg(`נרכש! פסיבי: +₪${value.toLocaleString()}`, "var(--green)");
        } else if(type === 'market') {
            lifeXP += value; 
            showMsg(`תתחדש! +${value.toLocaleString()} XP`, "var(--purple)");
        }
        inventory.push({name, icon, type});
        updateUI(); saveGame();
        
        // רענון הטאב
        const cont = document.getElementById("content");
        if(type === 'business') drawBusiness(cont);
        else if(type === 'estate') drawEstate(cont);
        else if(type === 'market') drawMarket(cont);
    } else showMsg(", חסר לך כסף!", "var(--red)");
}
