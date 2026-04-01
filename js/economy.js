/* Smart Money Pro - economy.js - FULL & FINAL */

// --- 1. בורסה (Stock Market) ---
const stocks = [
    { id: 'GOOG', name: 'Google', price: 150, icon: '🔍' },
    { id: 'AMZN', name: 'Amazon', price: 180, icon: '📦' },
    { id: 'TSLA', name: 'Tesla', price: 250, icon: '⚡' },
    { id: 'AAPL', name: 'Apple', price: 190, icon: '🍎' },
    { id: 'NVDA', name: 'Nvidia', price: 850, icon: '🎮' },
    { id: 'META', name: 'Meta', price: 450, icon: '📱' },
    { id: 'NFLX', name: 'Netflix', price: 600, icon: '🎬' },
    { id: 'MSFT', name: 'Microsoft', price: 400, icon: '💻' },
    { id: 'DIS',  name: 'Disney', price: 110, icon: '🏰' },
    { id: 'BTC',  name: 'Bitcoin', price: 65000, icon: '🪙' }
];

function drawInvest(c) {
    let h = `<h3>📈 בורסת מניות</h3><div class="grid-2">`;
    stocks.forEach(s => {
        let currentPrice = Math.floor(s.price * (0.7 + Math.random() * 0.6));
        let owned = inventory.filter(i => i.name === s.id).length;
        h += `
        <div class="card fade-in">
            <div style="font-size:24px;">${s.icon}</div>
            <b>${s.name}</b>
            <div style="color:var(--yellow); font-size:15px; margin:5px 0;">₪${currentPrice.toLocaleString()}</div>
            <div style="font-size:9px; opacity:0.5; margin-bottom:5px;">בבעלותך: ${owned}</div>
            <div style="display:flex; gap:4px; width:100%;">
                <button class="sys-btn" style="flex:1; font-size:10px;" onclick="executeBuy('invest','${s.id}',${currentPrice},0,'${s.icon}')">קנה</button>
                <button class="sys-btn" style="flex:1; font-size:10px; color:var(--red); border-color:var(--red);" onclick="executeSell('${s.id}',${currentPrice})">מכור</button>
            </div>
        </div>`;
    });
    c.innerHTML = h + "</div>";
}

// --- 2. עסקים ונדל"ן (Passive Income - 10 רמות) ---
function drawBusiness(c) {
    const list = [
        {n:"דוכן קפה", c:25000, p:2200, i:"☕"}, {n:"קיוסק", c:75000, p:6800, i:"🏪"},
        {n:"פיצרייה", c:280000, p:26000, i:"🍕"}, {n:"מוסך", c:950000, p:110000, i:"🔧"},
        {n:"חדר כושר", c:2500000, p:320000, i:"💪"}, {n:"סופרמרקט", c:12000000, p:1600000, i:"🛒"},
        {n:"מפעל הייטק", c:55000000, p:7500000, i:"🏭"}, {n:"חברת תעופה", c:250000000, p:38000000, i:"✈️"},
        {n:"בנק פרטי", c:1500000000, p:240000000, i:"🏦"}, {n:"תאגיד עולמי", c:8000000000, p:1300000000, i:"🌍"}
    ];
    renderEconomyGrid(c, "🏢 אימפריית עסקים", list, 'business');
}

function drawEstate(c) {
    const list = [
        {n:"מחסן", c:150000, p:14000, i:"📦"}, {n:"דירת 2 חדרים", c:550000, p:52000, i:"🏢"},
        {n:"דירת גן", c:1800000, p:190000, i:"🏠"}, {n:"וילה יוקרתית", c:4500000, p:510000, i:"🏡"},
        {n:"פנטהאוז", c:12000000, p:1450000, i:"🏙️"}, {n:"בניין משרדים", c:65000000, p:8200000, i:"🏢"},
        {n:"מרכז מסחרי", c:350000000, p:48000000, i:"🏬"}, {n:"שכונת מגורים", c:1200000000, p:170000000, i:"🏘️"},
        {n:"גורד שחקים", c:5500000000, p:820000000, i:"🏙️"}, {n:"עיר פרטית", c:25000000000, p:4100000000, i:"🏙️"}
    ];
    renderEconomyGrid(c, "🏠 נדל\"ן להשקעה", list, 'estate');
}

// --- 3. שוק מוצרי יוקרה (XP Boost) ---
function drawMarket(c) {
    const list = [
        {n:"אייפון 17", c:8000, p:800, i:"📱"}, {n:"מחשב גיימינג", c:25000, p:2800, i:"🖥️"},
        {n:"שעון רולקס", c:120000, p:15000, i:"⌚"}, {n:"טבעת יהלום", c:450000, p:60000, i:"💍"},
        {n:"פסל מזהב", c:1500000, p:210000, i:"🗿"}, {n:"יאכטה", c:8500000, p:1200000, i:"🛥️"},
        {n:"ציור מקורי", c:35000000, p:5500000, i:"🎨"}, {n:"גביע היסטורי", c:150000000, p:25000000, i:"🏆"},
        {n:"כתר מלכות", c:750000000, p:140000000, i:"👑"}, {n:"פסל החירות", c:5000000000, p:950000000, i:"🗽"}
    ];
    renderEconomyGrid(c, "🛒 שוק היוקרה (בונוס XP)", list, 'market');
}

// --- 4. קזינו (שחור-לבן) ---
function drawCasino(c) {
    c.innerHTML = `
        <div class="card fade-in" style="border:1px solid var(--purple); background:rgba(188,19,254,0.05);">
            <h3 style="color:var(--purple);">🎰 קזינו אנדרגרעונד</h3>
            <p style="font-size:12px; opacity:0.8;">המר על הצבע הנכון והכפל את כספך!</p>
            <input type="number" id="bet-amt" placeholder="סכום ההימור..." style="width:100%; padding:12px; background:#000; color:#fff; border:1px solid #333; border-radius:8px; text-align:center; margin:15px 0;">
            <div class="grid-2">
                <button class="action" onclick="playGame('black')" style="background:#111; color:#fff; border:1px solid #444;">שחור</button>
                <button class="action" onclick="playGame('white')" style="background:#eee; color:#000;">לבן</button>
            </div>
        </div>`;
}

function playGame(choice) {
    let amt = parseInt(document.getElementById('bet-amt').value);
    if (!amt || amt <= 0 || amt > money) return showMsg("סכום לא תקין או שאין לך מספיק כסף!", "var(--red)");

    money -= amt;
    let result = Math.random() > 0.5 ? 'black' : 'white';
    
    if (choice === result) {
        let win = amt * 2;
        money += win;
        showMsg(`זכית! הצבע היה ${result === 'black' ? 'שחור' : 'לבן'}. ₪${win.toLocaleString()} אצלך!`, "var(--green)");
    } else {
        showMsg(`הפסדת! הצבע היה ${result === 'black' ? 'שחור' : 'לבן'}.`, "var(--red)");
    }
    updateUI(); saveGame(); drawCasino(document.getElementById('content'));
}

// --- פונקציות תשתית ---

function renderEconomyGrid(c, title, pool, type) {
    let h = `<h3>${title}</h3><div class="grid-2">`;
    pool.forEach(item => {
        const valText = (type === 'market') ? `+${item.p.toLocaleString()} XP` : `+₪${item.p.toLocaleString()}/ש`;
        h += `
        <div class="card fade-in">
            <div style="font-size:28px;">${item.i}</div>
            <b style="font-size:13px; height:32px; overflow:hidden;">${item.n}</b>
            <div style="color:${type === 'market' ? 'var(--purple)' : 'var(--green)'}; font-weight:bold; font-size:12px; margin-bottom:8px;">${valText}</div>
            <button class="sys-btn" onclick="executeBuy('${type}','${item.n}',${item.c},${item.p},'${item.i}')">₪${item.c.toLocaleString()}</button>
        </div>`;
    });
    c.innerHTML = h + "</div>";
}

function executeBuy(type, name, cost, value, icon) {
    if (money >= cost) {
        money -= cost;
        if (type === 'business' || type === 'estate') passive += value;
        if (type === 'market') lifeXP += value;
        inventory.push({ name, icon, type });
        showMsg("רכישה בוצעה!", "var(--green)");
        updateUI(); saveGame();
        // רענון טאב
        const cont = document.getElementById('content');
        if (type === 'business') drawBusiness(cont);
        else if (type === 'estate') drawEstate(cont);
        else if (type === 'market') drawMarket(cont);
        else if (type === 'invest') drawInvest(cont);
    } else showMsg("אין לך מספיק מזומן!", "var(--red)");
}

function executeSell(id, price) {
    const idx = inventory.findIndex(i => i.name === id);
    if (idx !== -1) {
        inventory.splice(idx, 1);
        money += price;
        showMsg(`מכרת ${id} תמורת ₪${price.toLocaleString()}`, "var(--yellow)");
        updateUI(); saveGame(); drawInvest(document.getElementById('content'));
    } else showMsg("אין לך מניות כאלו!", "var(--red)");
}

function drawBank(c) {
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center; padding:25px; border:1px solid var(--blue);">
            <h3>🏦 ניהול הון בנקאי</h3>
            <div style="font-size:32px; color:var(--blue); margin:15px 0;">₪${Math.floor(bank).toLocaleString()}</div>
            <div class="grid-2">
                <button class="action" onclick="bankOp('dep')" style="background:var(--green); color:#000;">הפקד הכל</button>
                <button class="action" onclick="bankOp('wd')" style="background:none; border:1px solid var(--blue); color:var(--blue);">משוך הכל</button>
            </div>
        </div>`;
}

function bankOp(type) {
    if (type === 'dep') { bank += money; money = 0; }
    else { money += bank; bank = 0; }
    updateUI(); saveGame(); drawBank(document.getElementById('content'));
}
