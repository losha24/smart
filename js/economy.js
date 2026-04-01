/* Smart Money Pro - js/economy.js - v6.5.1
   Merged Economy Engine: Bank, Stocks, Estate, Business & Market
*/

// --- 1. מערכת הבנק (הפקדות, משיכות והלוואות) ---
function drawBank(c) {
    if(!c) return;
    c.innerHTML = `
    <div class="card fade-in">
        <h3 style="margin:0 0 15px 0;">🏦 בנק הפועלים</h3>
        <div class="grid-2" style="margin-bottom:15px;">
            <div class="card" style="margin:0; text-align:center; border:1px solid var(--blue); background: rgba(56, 189, 248, 0.05);">
                <small>בחשבון</small><br><b id="bank-display">${Math.floor(bank).toLocaleString()}₪</b>
            </div>
            <div class="card" style="margin:0; text-align:center; border:1px solid var(--red); background: rgba(239, 68, 68, 0.05);">
                <small>חוב</small><br><b>${loan.toLocaleString()}₪</b>
            </div>
        </div>
        <input type="number" id="bank-amt" placeholder="הזן סכום..." 
               style="width:100%; padding:15px; border-radius:12px; border:1px solid var(--border); background:#000; color:#fff; margin-bottom:15px; text-align:center; font-size:18px;">
        <div class="grid-2">
            <button class="action" onclick="bankOp('dep')" style="background:var(--green); color:white;">הפקד 📥</button>
            <button class="action" onclick="bankOp('wd')" style="background:var(--blue); color:white;">משוך 📤</button>
        </div>
        <button class="sys-btn" style="width:100%; margin-top:15px; color:var(--yellow); border-color:var(--yellow); padding:10px;" 
                onclick="takeLoan()">בקש הלוואה דחופה (10,000₪)</button>
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
        } else {
            showMsg("אין לך מספיק מזומן בקופה", "var(--red)");
        }
    } else {
        if (bank >= amt) {
            bank -= amt;
            money += amt;
            showMsg("משיכה בוצעה בהצלחה", "var(--blue)");
        } else {
            showMsg("אין מספיק כסף בחשבון הבנק", "var(--red)");
        }
    }
    updateUI();
    saveGame();
    drawBank(document.getElementById('content'));
}

function takeLoan() {
    loan += 10000;
    money += 10000;
    showMsg("הלוואה אושרה והועברה למזומן", "var(--yellow)");
    updateUI();
    saveGame();
    drawBank(document.getElementById('content'));
}

// --- 2. בורסה (מניות דינמיות) ---
const stocks = [
    { id: 'AAPL', name: 'Apple Inc', price: 180 },
    { id: 'TSLA', name: 'Tesla', price: 240 },
    { id: 'NVDA', name: 'NVIDIA', price: 450 },
    { id: 'BTC',  name: 'Bitcoin', price: 68000 },
    { id: 'ELAL', name: 'אל-על', price: 25 }
];

function drawInvest(c) {
    if(!c) return;
    let html = `<h3>📈 מסחר במניות וקריפטו</h3><div class="grid-1">`;
    stocks.forEach(s => {
        const owned = invOwned[s.id] || 0;
        // תנודתיות מחירים בכל טעינה
        const currentPrice = Math.floor(s.price * (0.92 + Math.random() * 0.16));
        html += `
        <div class="card fade-in" style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <b style="font-size:16px;">${s.name}</b><br>
                <small style="opacity:0.6;">בבעלותך: ${owned.toLocaleString()}</small>
            </div>
            <div style="text-align:center; font-weight:bold; color:var(--yellow); font-size:16px;">
                ${currentPrice.toLocaleString()}₪
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
            showMsg(`קנית יחידה של ${id}`, "var(--green)");
        } else showMsg("חסר מזומן לקנייה", "var(--red)");
    } else {
        if (invOwned[id] > 0) {
            money += price;
            invOwned[id]--;
            showMsg(`מכרת יחידה של ${id}`, "var(--yellow)");
        } else showMsg("אין לך יחידות למכירה", "var(--red)");
    }
    updateUI();
    saveGame();
    drawInvest(document.getElementById('content'));
}

// --- 3. נדל"ן (הכנסה פסיבית גבוהה) ---
function drawEstate(c) {
    if(!c) return;
    const estPool = [
        {n:"דירת סטודיו", c:250000, p:800, i:"🏢"}, 
        {n:"דירת 3 חדרים", c:550000, p:1800, i:"🏠"}, 
        {n:"דירת גן", c:900000, p:3500, i:"🏡"}, 
        {n:"בית פרטי", c:1200000, p:5000, i:"🏘️"},
        {n:"פנטהאוז יוקרתי", c:2800000, p:12000, i:"🏙️"},
        {n:"אחוזה כפרית", c:8500000, p:40000, i:"🏰"}
    ];

    let html = `<h3>🏠 נכסי נדל"ן</h3><div class="grid-2">`;
    estPool.forEach(item => {
        html += `
        <div class="card fade-in" style="text-align:center;">
            <div style="font-size:35px; margin-bottom:8px;">${item.i}</div>
            <b style="display:block; min-height:40px;">${item.n}</b>
            <div style="color:var(--green); font-weight:bold; margin-bottom:12px;">+${item.p.toLocaleString()}₪/ש</div>
            <button class="sys-btn" style="width:100%; font-size:12px;" onclick="executeBuy('estate','${item.n}',${item.c},${item.p},'${item.i}')">
                ${item.c.toLocaleString()}₪
            </button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

// --- 4. עסקים (הכנסה פסיבית בינונית) ---
function drawBusiness(c) {
    if(!c) return;
    const bzPool = [
        {n:"דוכן קפה", c:15000, p:45, i:"☕"}, 
        {n:"קיוסק", c:45000, p:120, i:"🏪"}, 
        {n:"פיצריה", c:250000, p:850, i:"🍕"}, 
        {n:"מוסך מורשה", c:1200000, p:4200, i:"🔧"}, 
        {n:"קניון אזורי", c:25000000, p:95000, i:"🏢"}
    ];

    let html = `<h3>🏢 השקעה בעסקים</h3><div class="grid-2">`;
    bzPool.forEach(item => {
        html += `
        <div class="card fade-in" style="text-align:center;">
            <div style="font-size:35px; margin-bottom:8px;">${item.i}</div>
            <b style="display:block; min-height:40px;">${item.n}</b>
            <div style="color:var(--green); font-weight:bold; margin-bottom:12px;">+${item.p.toLocaleString()}₪/ש</div>
            <button class="sys-btn" style="width:100%; font-size:12px;" onclick="executeBuy('business','${item.n}',${item.c},${item.p},'${item.i}')">
                ${item.c.toLocaleString()}₪
            </button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

// --- 5. שוק מוצרי יוקרה (מעלה XP ורמה) ---
function drawMarket(c) {
    if(!c) return;
    const mkPool = [
        {n:"אייפון 15 פרו", c:6200, p:300, i:"📱"}, 
        {n:"מחשב גיימינג", c:18000, p:850, i:"💻"}, 
        {n:"שעון רולקס", c:135000, p:6000, i:"⌚"}, 
        {n:"בריכת שחייה", c:220000, p:11000, i:"🏊"}, 
        {n:"פסל זהב", c:450000, p:25000, i:"🗿"}
    ];

    let html = `<h3>🛒 מוצרי פרימיום</h3><div class="grid-2">`;
    mkPool.forEach(item => {
        html += `
        <div class="card fade-in" style="text-align:center;">
            <div style="font-size:35px; margin-bottom:8px;">${item.i}</div>
            <b style="display:block; min-height:40px;">${item.n}</b>
            <div style="color:var(--purple); font-weight:bold; margin-bottom:12px;">+${item.p.toLocaleString()} XP</div>
            <button class="sys-btn" style="width:100%; font-size:12px;" onclick="executeBuy('market','${item.n}',${item.c},${item.p},'${item.i}')">
                ${item.c.toLocaleString()}₪
            </button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

// --- 6. מנגנון רכישה מאוחד ---
function executeBuy(type, name, cost, value, icon) {
    if(money >= cost) {
        money -= cost;
        
        if(type === 'business' || type === 'estate') {
            passive += value; // מגדיל הכנסה לשעה
            showMsg(`מזל טוב! ה${name} יכניס לך ${value}₪ בכל שעה`, "var(--green)");
        } else if(type === 'market') {
            lifeXP += value; // מעלה רמה ישירות
            showMsg(`תתחדש על ה${name}! קיבלת ${value} XP`, "var(--purple)");
        }
        
        inventory.push({name: name, icon: icon, type: type});
        updateUI();
        saveGame();
        
        // רענון אוטומטי של הטאב הפעיל
        const content = document.getElementById("content");
        if(type === 'business') drawBusiness(content);
        else if(type === 'estate') drawEstate(content);
        else if(type === 'market') drawMarket(content);
    } else {
        showMsg("אין לך מספיק כסף פנוי לרכישה הזו", "var(--red)");
    }
}
