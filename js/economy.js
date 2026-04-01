/* Smart Money Pro - economy.js - FULL & ALIGNED */

// --- 1. בורסה וניירות ערך (Stock Market) ---
const stocks = [
    { id: 'GOOG', name: 'Google', price: 150, icon: '🔍' },
    { id: 'AMZN', name: 'Amazon', price: 180, icon: '📦' },
    { id: 'TSLA', name: 'Tesla', price: 250, icon: '⚡' },
    { id: 'AAPL', name: 'Apple', price: 190, icon: '🍎' },
    { id: 'NVDA', name: 'Nvidia', price: 850, icon: '🎮' },
    { id: 'BTC',  name: 'Bitcoin', price: 65000, icon: '🪙' }
];

function drawInvest(c) {
    if (!c) return;
    let h = `<h3>📈 בורסת טורבו</h3><div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">`;
    
    stocks.forEach(s => {
        // מחיר דינמי שמשתנה בכל כניסה (תנודה של 20% למעלה או למטה)
        let currentPrice = Math.floor(s.price * (0.8 + Math.random() * 0.4));
        let owned = inventory.filter(i => i.name === s.id).length;
        
        h += `
        <div class="card fade-in" style="text-align:center; padding:12px; background:#161616; border:1px solid #333;">
            <div style="font-size:24px;">${s.icon}</div>
            <b style="font-size:13px;">${s.name}</b>
            <div style="color:var(--yellow); font-size:16px; margin:5px 0;">₪${currentPrice.toLocaleString()}</div>
            <div style="font-size:10px; opacity:0.6; margin-bottom:8px;">בבעלותך: ${owned}</div>
            <div style="display:flex; gap:5px;">
                <button class="sys-btn" style="flex:1; font-size:10px; padding:6px 0;" onclick="executeBuy('invest','${s.id}',${currentPrice},0,'${s.icon}')">קנה</button>
                <button class="sys-btn" style="flex:1; font-size:10px; color:var(--red); border-color:var(--red);" onclick="executeSell('${s.id}',${currentPrice})">מכור</button>
            </div>
        </div>`;
    });
    c.innerHTML = h + "</div>";
}

function executeSell(id, price) {
    const index = inventory.findIndex(i => i.name === id);
    if (index !== -1) {
        inventory.splice(index, 1);
        money += price;
        showMsg(`מכרת ${id} ב-₪${price.toLocaleString()}`, "var(--yellow)");
        updateUI(); saveGame(); drawInvest(document.getElementById('content'));
    } else {
        showMsg("אין לך מניות כאלו!", "var(--red)");
    }
}

// --- 2. נדל"ן ועסקים (Passive Income) ---
function drawBusiness(c) {
    const list = [
        {n:"דוכן קפה", c:18000, p:1800, i:"☕"}, {n:"קיוסק שכונתי", c:65000, p:6200, i:"🏪"},
        {n:"פיצרייה", c:250000, p:24000, i:"🍕"}, {n:"מוסך מורשה", c:850000, p:95000, i:"🔧"},
        {n:"אולם אירועים", c:4500000, p:550000, i:"🥂"}, {n:"רשת סופרים", c:18000000, p:2400000, i:"🛒"},
        {n:"חברת הייטק", c:95000000, p:14000000, i:"💻"}, {n:"קניון עזריאלי", c:650000000, p:85000000, i:"🏢"},
        {n:"חברת תעופה", c:3000000000, p:450000000, i:"✈️"}, {n:"אימפריה עולמית", c:12000000000, p:2000000000, i:"🌍"}
    ];
    renderEconomyGrid(c, "🏢 אימפריית עסקים", list, 'business');
}

function drawEstate(c) {
    const list = [
        {n:"דירת סטודיו", c:120000, p:11000, i:"🏢"}, {n:"דירת 4 חדרים", c:450000, p:45000, i:"🏠"},
        {n:"וילה עם בריכה", c:2200000, p:240000, i:"🏡"}, {n:"פנטהאוז", c:8500000, p:950000, i:"🏙️"},
        {n:"בניין מגורים", c:45000000, p:5200000, i:"🏢"}, {n:"אי פרטי", c:280000000, p:35000000, i:"🌴"}
    ];
    renderEconomyGrid(c, "🏠 נדל\"ן להשקעה", list, 'estate');
}

// --- 3. שוק מוצרי פרימיום (XP Boost) ---
function drawMarket(c) {
    const list = [
        {n:"אייפון 17 Pro", c:8500, p:750, i:"📱"}, {n:"רולקס זהב", c:95000, p:9000, i:"⌚"},
        {n:"מכונית ספורט", c:1200000, p:150000, i:"🏎️"}, {n:"מטוס פרטי", c:55000000, p:8000000, i:"🛩️"}
    ];
    renderEconomyGrid(c, "🛒 מוצרי יוקרה (בונוס XP)", list, 'market');
}

// פונקציית רינדור מרכזית (2 בשורה)
function renderEconomyGrid(c, title, pool, type) {
    let h = `<h3>${title}</h3><div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">`;
    pool.forEach(item => {
        const valText = (type === 'market') ? `+${item.p.toLocaleString()} XP` : `+₪${item.p.toLocaleString()}/ש`;
        h += `
        <div class="card fade-in" style="text-align:center; padding:15px; background:#161616; border:1px solid #222;">
            <div style="font-size:28px; margin-bottom:5px;">${item.i}</div>
            <b style="display:block; height:35px; overflow:hidden;">${item.n}</b>
            <div style="color:${type === 'market' ? 'var(--purple)' : 'var(--green)'}; font-weight:bold; margin-bottom:10px;">${valText}</div>
            <button class="sys-btn" style="width:100%; font-size:12px;" onclick="executeBuy('${type}','${item.n}',${item.c},${item.p},'${item.i}')">
                ₪${item.c.toLocaleString()}
            </button>
        </div>`;
    });
    c.innerHTML = h + "</div>";
}

function executeBuy(type, name, cost, value, icon) {
    if (money >= cost) {
        money -= cost;
        if (type === 'business' || type === 'estate') {
            passive += value;
            showMsg(`נרכש! ההכנסה עלתה ב-₪${value.toLocaleString()}`, "var(--green)");
        } else if (type === 'market') {
            lifeXP += value;
            showMsg(`תתחדש! קיבלת ${value.toLocaleString()} XP`, "var(--purple)");
        } else if (type === 'invest') {
            showMsg(`קנית מניית ${name}`, "var(--blue)");
        }
        
        inventory.push({ name, icon, type });
        updateUI(); 
        saveGame();
        
        // רענון אוטומטי של הטאב הנוכחי
        const cont = document.getElementById('content');
        if (type === 'business') drawBusiness(cont);
        else if (type === 'estate') drawEstate(cont);
        else if (type === 'market') drawMarket(cont);
        else if (type === 'invest') drawInvest(cont);
    } else {
        showMsg("אין לך מספיק כסף בקופה!", "var(--red)");
    }
}

// --- 4. בנק (ניהול מזומן) ---
function drawBank(c) {
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center; padding:25px; border:1px solid var(--blue); background:rgba(0,100,255,0.05);">
            <h3 style="color:var(--blue);">🏦 בנק לאומי - ניהול הון</h3>
            <div style="font-size:36px; font-weight:900; color:var(--blue); margin:20px 0;">₪${Math.floor(bank).toLocaleString()}</div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                <button class="action" onclick="bankOp('dep')" style="background:var(--green); color:#000; font-weight:bold;">הפקד הכל</button>
                <button class="action" onclick="bankOp('wd')" style="background:none; border:2px solid var(--blue); color:var(--blue); font-weight:bold;">משוך הכל</button>
            </div>
            <p style="font-size:10px; opacity:0.5; margin-top:15px;">הכסף בבנק מוגן מפני הפסדים בבורסה.</p>
        </div>`;
}

function bankOp(type) {
    if (type === 'dep') {
        bank += money;
        money = 0;
        showMsg("כל המזומן הופקד בבטחה", "var(--green)");
    } else {
        money += bank;
        bank = 0;
        showMsg("המשכת את כל ההון למזומן", "var(--blue)");
    }
    updateUI(); saveGame(); drawBank(document.getElementById('content'));
}
