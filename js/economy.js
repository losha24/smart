/* Smart Money Pro - economy.js - v6.5.2 TURBO - FULL & UPDATED */

// --- 1. מערכת הבנק והלוואות (מעודכן) ---
function drawBank(c) {
    if(!c) return;
    if (typeof window.loan === 'undefined') window.loan = 0;
    
    c.innerHTML = `
    <div class="card fade-in">
        <h3 style="margin:0 0 15px 0; color:var(--blue);">🏦 בנק הפועלים - ניהול הון</h3>
        <div class="grid-2" style="margin-bottom:15px;">
            <div class="card" style="margin:0; text-align:center; border:1px solid var(--blue); background: rgba(0, 210, 255, 0.05);">
                <small style="opacity:0.7;">יתרה בבנק</small><br>
                <b id="bank-display" style="font-size:18px; color:var(--blue);">₪${Math.floor(bank).toLocaleString()}</b>
            </div>
            <div class="card" style="margin:0; text-align:center; border:1px solid var(--red); background: rgba(255, 49, 49, 0.05);">
                <small style="opacity:0.7;">חוב הלוואות</small><br>
                <b style="font-size:18px; color:var(--red);">₪${(window.loan).toLocaleString()}</b>
            </div>
        </div>
        
        <input type="number" id="bank-amt" placeholder="הזן סכום..." 
               style="width:100%; padding:12px; border-radius:10px; border:1px solid var(--border); background:#000; color:#fff; margin-bottom:10px; text-align:center;">
        
        <div class="grid-2">
            <button class="action" onclick="bankOp('dep')" style="background:var(--green); color:black;">הפקדה 📥</button>
            <button class="action" onclick="bankOp('wd')" style="background:var(--blue); color:black;">משיכה 📤</button>
        </div>
        
        <button class="sys-btn" style="width:100%; margin-top:15px; color:var(--yellow); border:1px solid var(--yellow); background:transparent;" 
                onclick="takeLoan()">💰 בקש הלוואה (₪50,000)</button>
        <button class="sys-btn" style="width:100%; margin-top:5px; color:var(--red); border:1px solid var(--red); background:transparent;" 
                onclick="repayLoan()">📉 החזר חוב (₪10,000)</button>
    </div>`;
}

function bankOp(type) {
    const amt = parseInt(document.getElementById('bank-amt').value);
    if (!amt || amt <= 0) return showMsg("נא להזין סכום תקין", "var(--red)");

    if (type === 'dep') {
        if (money >= amt) { money -= amt; bank += amt; showMsg("הופקד בהצלחה", "var(--green)"); }
        else showMsg("אין מספיק מזומן", "var(--red)");
    } else {
        if (bank >= amt) { bank -= amt; money += amt; showMsg("נמשך בהצלחה", "var(--blue)"); }
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
        showMsg("החזרת ₪10,000 מהחוב", "var(--green)");
    } else showMsg("אין מספיק כסף או חוב", "var(--red)");
    updateUI(); saveGame(); drawBank(document.getElementById('content'));
}

// --- 2. בורסה דינמית (Stocks) ---
const stockMarket = [
    { id: 'AAPL', name: 'Apple Inc', price: 180 },
    { id: 'TSLA', name: 'Tesla Motor', price: 240 },
    { id: 'NVDA', name: 'NVIDIA AI', price: 450 },
    { id: 'BTC',  name: 'Bitcoin', price: 68000 },
    { id: 'ELAL', name: 'אל-על', price: 50 }
];

function drawInvest(c) {
    if(!c) return;
    let html = `<h3>📈 בורסת ניירות ערך (טורבו)</h3><div class="grid-1">`;
    stockMarket.forEach(s => {
        if (typeof window.invOwned === 'undefined') window.invOwned = {};
        const owned = window.invOwned[s.id] || 0;
        const currentPrice = Math.floor(s.price * (0.7 + Math.random() * 0.6)); // תנודתיות גבוהה
        
        html += `
        <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center;">
            <div><b>${s.name}</b><br><small>בבעלותך: ${owned}</small></div>
            <div style="font-weight:900; color:var(--yellow);">₪${currentPrice.toLocaleString()}</div>
            <div style="display:flex; gap:5px;">
                <button class="sys-btn" onclick="stockOp('buy','${s.id}',${currentPrice})">קנה</button>
                <button class="sys-btn" style="color:var(--red); border-color:var(--red);" onclick="stockOp('sell','${s.id}',${currentPrice})">מכור</button>
            </div>
        </div>`;
    });
    c.innerHTML = html + "</div>";
}

function stockOp(type, id, price) {
    if (typeof window.invOwned === 'undefined') window.invOwned = {};
    if (type === 'buy') {
        if (money >= price) { money -= price; window.invOwned[id] = (window.invOwned[id] || 0) + 1; showMsg(`קנית ${id}`, "var(--green)"); }
        else showMsg("חסר מזומן", "var(--red)");
    } else {
        if (window.invOwned[id] > 0) { money += price; window.invOwned[id]--; showMsg(`מכרת ${id}`, "var(--yellow)"); }
        else showMsg("אין לך מניות!", "var(--red)");
    }
    updateUI(); saveGame(); drawInvest(document.getElementById('content'));
}

// --- 3. מנגנון רכישה 10 פריטים (נדל"ן, עסקים ושוק) ---
function drawEstate(c) {
    const list = [
        {n:"אוהל משופר", c:2500, p:150, i:"⛺"}, {n:"דירת סטודיו", c:65000, p:4500, i:"🏢"},
        {n:"דירת 4 חדרים", c:220000, p:18000, i:"🏠"}, {n:"דירת גן", c:950000, p:75000, i:"🏡"},
        {n:"פנטהאוז דופלקס", c:3200000, p:280000, i:"🏙️"}, {n:"וילה יוקרתית", c:12000000, p:1100000, i:"🏰"},
        {n:"בניין מגורים", c:55000000, p:5200000, i:"🏢"}, {n:"אחוזה פרטית", c:280000000, p:28000000, i:"👑"},
        {n:"מושבה במאדים", c:1500000000, p:165000000, i:"🚀"}, {n:"כוכב לכת", c:15000000000, p:1950000000, i:"🌌"}
    ];
    renderEconomyTab(c, "🏠 נכסי נדל\"ן (רווח פי 3)", list, 'estate');
}

function drawBusiness(c) {
    const list = [
        {n:"דוכן קפה", c:12000, p:950, i:"☕"}, {n:"קיוסק", c:35000, p:3200, i:"🏪"},
        {n:"פיצריה", c:150000, p:14500, i:"🍕"}, {n:"מוסך", c:550000, p:58000, i:"🔧"},
        {n:"אולם אירועים", c:2500000, p:280000, i:"🥂"}, {n:"סופרמרקט", c:12000000, p:1450000, i:"🛒"},
        {n:"חברת הייטק", c:65000000, p:8200000, i:"💻"}, {n:"קניון", c:350000000, p:48000000, i:"🏢"},
        {n:"חברת תעופה", c:1800000000, p:280000000, i:"✈️"}, {n:"אימפריה גלובלית", c:8000000000, p:1400000000, i:"🌎"}
    ];
    renderEconomyTab(c, "🏢 השקעה בעסקים (טורבו)", list, 'business');
}

function drawMarket(c) {
    const list = [
        {n:"אייפון 17 פרו", c:6500, p:500, i:"📱"}, {n:"שעון רולקס", c:68000, p:6000, i:"⌚"},
        {n:"טבעת יהלום", c:185000, p:18000, i:"💍"}, {n:"פסל זהב", c:550000, p:55000, i:"🗿"},
        {n:"מכונית אספנות", c:2800000, p:300000, i:"🏎️"}, {n:"ציור מקורי", c:15000000, p:1800000, i:"🖼️"},
        {n:"כתר יהלומים", c:85000000, p:10000000, i:"👑"}, {n:"ביצת פברז'ה", c:450000000, p:55000000, i:"🥚"},
        {n:"גביע הקודש", c:1800000000, p:250000000, i:"🏆"}, {n:"תיבת פנדורה", c:9000000000, p:1500000000, i:"📦"}
    ];
    renderEconomyTab(c, "🛒 מוצרי פרימיום (XP גבוה)", list, 'market');
}

function renderEconomyTab(c, title, pool, type) {
    let html = `<h3>${title}</h3><div class="grid-2">`;
    pool.forEach(item => {
        const valLabel = type === 'market' ? `+${item.p.toLocaleString()} XP` : `+₪${item.p.toLocaleString()}/ש`;
        html += `
        <div class="card fade-in" style="text-align:center; border:1px solid var(--border);">
            <div style="font-size:35px; margin-bottom:5px;">${item.i}</div>
            <b style="display:block; min-height:40px;">${item.n}</b>
            <div style="color:${type === 'market' ? 'var(--purple)' : 'var(--green)'}; font-weight:bold; margin-bottom:10px;">${valLabel}</div>
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
            showMsg(`הכנסה פסיבית: +₪${value.toLocaleString()}!`, "var(--green)");
        } else if(type === 'market') {
            lifeXP += value; 
            showMsg(`תתחדש! +${value.toLocaleString()} XP`, "var(--purple)");
        }
        inventory.push({name, icon, type});
        updateUI(); saveGame();
        
        // רענון אוטומטי של הטאב
        const cont = document.getElementById("content");
        if(type === 'business') drawBusiness(cont);
        else if(type === 'estate') drawEstate(cont);
        else if(type === 'market') drawMarket(cont);
    } else showMsg("אלכסיי, חסר לך מזומן!", "var(--red)");
}
