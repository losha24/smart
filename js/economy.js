/* Smart Money Pro - js/economy.js - v6.3.2 - Final Production */

// --- 1. מערכת הבנק והלוואות ---
function drawBank(c) {
    if(!c) return;
    
    const debtWarning = (typeof loan !== 'undefined' && loan > 0) ? `<p style="color:var(--red); font-size:11px;">⚠️ שים לב: החוב גדל ב-0.01% בכל דקה</p>` : "";

    c.innerHTML = `
    <div class="card fade-in">
        <h3 style="margin-top:0;">🏦 ניהול חשבון בנק</h3>
        ${debtWarning}
        
        <div class="grid-2">
            <div class="card" style="margin:0; text-align:center; padding:15px; border:1px solid var(--blue);">
                <small>יתרה בבנק</small><br>
                <b style="font-size:18px; color:var(--blue);">${Math.floor(typeof bank !== 'undefined' ? bank : 0).toLocaleString()}₪</b>
            </div>
            <div class="card" style="margin:0; text-align:center; padding:15px; border:1px solid var(--red);">
                <small>חוב קיים</small><br>
                <b style="font-size:18px; color:var(--red);">${Math.floor(typeof loan !== 'undefined' ? loan : 0).toLocaleString()}₪</b>
            </div>
        </div>
        
        <div style="margin:20px 0;">
            <input type="number" id="bank-amt" placeholder="הכנס סכום..." 
                style="width:100%; padding:15px; border-radius:12px; border:1px solid var(--border); background:rgba(0,0,0,0.2); color:#fff; text-align:center;">
        </div>
        
        <div class="grid-2">
            <button class="action" onclick="bankAction('dep')">הפקדה</button>
            <button class="action" style="background:none; border:1px solid var(--blue); color:var(--blue);" onclick="bankAction('wd')">משיכה</button>
        </div>
        
        <button class="action" style="margin-top:10px; background:var(--red); color:#fff;" onclick="bankAction('loan')">קח הלוואה (ריבית 15%)</button>
        <button class="action" style="margin-top:10px; background:var(--green); color:#fff;" onclick="bankAction('payLoan')">החזר חוב מהמזומן</button>
    </div>`;
}

function bankAction(type) {
    const input = document.getElementById('bank-amt');
    if (!input) return;
    const val = parseInt(input.value) || 0;

    if(type === 'dep') {
        if(val > 0 && money >= val) { money -= val; bank += val; showMsg("הפקדה בוצעה", "var(--green)"); }
        else showMsg("אין מספיק מזומן", "var(--red)");
    } 
    else if(type === 'wd') {
        if(val > 0 && bank >= val) { bank -= val; money += val; showMsg("משיכה בוצעה", "var(--green)"); }
        else showMsg("אין מספיק בבנק", "var(--red)");
    } 
    else if(type === 'loan') {
        const amt = parseInt(prompt("סכום הלוואה (עד 100,000₪):", "10000"));
        if(amt > 0 && amt <= 100000) {
            loan = (typeof loan !== 'undefined' ? loan : 0) + (amt * 1.15);
            money += amt;
            showMsg(`הלוואה אושרה: +${amt}₪`, "var(--yellow)");
        }
    }
    else if(type === 'payLoan') {
        if(loan <= 0) return showMsg("אין לך חובות", "var(--green)");
        const payAmt = val > 0 ? Math.min(val, money, loan) : Math.min(money, loan);
        money -= payAmt;
        loan -= payAmt;
        showMsg(`שילמת ${Math.floor(payAmt).toLocaleString()}₪ מהחוב`, "var(--green)");
    }
    
    input.value = "";
    updateUI(); 
    if(typeof saveGame === 'function') saveGame(); 
    drawBank(document.getElementById('content'));
}

// --- 2. אימפריית עסקים ---
function drawBusiness(c) {
    const bizPool = [
        {n:"דוכן קפה", c:25000, p:1200, i:"☕"}, {n:"קיוסק", c:75000, p:4200, i:"🏪"},
        {n:"פיצרייה", c:300000, p:18000, i:"🍕"}, {n:"מוסך", c:900000, p:65000, i:"🔧"},
        {n:"חדר כושר", c:2500000, p:190000, i:"💪"}, {n:"סופרמרקט", c:12000000, p:950000, i:"🛒"},
        {n:"מפעל", c:55000000, p:4800000, i:"🏭"}, {n:"חברת תעופה", c:250000000, p:24000000, i:"✈️"},
        {n:"בנק פרטי", c:1500000000, p:160000000, i:"🏦"}, {n:"תאגיד", c:8000000000, p:950000000, i:"🌍"}
    ];
    renderGrid(c, "🏢 אימפריית עסקים", bizPool, 'business');
}

// --- 3. נדל"ן להשקעה ---
function drawEstate(c) {
    const estPool = [
        {n:"מחסן", c:150000, p:8500, i:"📦"}, {n:"דירת 2 חדרים", c:550000, p:32000, i:"🏢"},
        {n:"דירת גן", c:1800000, p:115000, i:"🏠"}, {n:"וילה", c:4500000, p:310000, i:"🏡"},
        {n:"פנטהאוז", c:12000000, p:880000, i:"🏙️"}, {n:"בניין משרדים", c:65000000, p:5200000, i:"🏢"},
        {n:"מרכז מסחרי", c:350000000, p:31000000, i:"🏬"}, {n:"שכונה", c:1200000000, p:110000000, i:"🏘️"},
        {n:"גורד שחקים", c:5500000000, p:550000000, i:"🏙️"}, {n:"עיר פרטית", c:25000000000, p:2800000000, i:"🏙️"}
    ];
    renderGrid(c, "🏠 נדל\"ן להשקעה", estPool, 'estate');
}

// --- 4. שוק מוצרי יוקרה ---
function drawMarket(c) {
    const mkPool = [
        {n:"אייפון 17", c:8500, p:450, i:"📱"}, {n:"מחשב גיימינג", c:22000, p:1200, i:"🖥️"},
        {n:"שעון רולקס", c:110000, p:6500, i:"⌚"}, {n:"טבעת יהלום", c:450000, p:28000, i:"💍"},
        {n:"פסל זהב", c:1500000, p:110000, i:"🗿"}, {n:"יאכטה", c:9500000, p:750000, i:"🛥️"},
        {n:"ציור מקורי", c:45000000, p:3800000, i:"🎨"}, {n:"גביע", c:180000000, p:16000000, i:"🏆"},
        {n:"כתר", c:850000000, p:85000000, i:"👑"}, {n:"אי פרטי", c:6500000000, p:720000000, i:"🏝️"}
    ];
    renderGrid(c, "🛒 שוק היוקרה", mkPool, 'market');
}

// --- פונקציות עזר ---
function renderGrid(c, title, pool, type) {
    let html = `<h3 style="margin:15px;">${title}</h3><div class="grid-2">`;
    pool.forEach(item => {
        const desc = (type === 'market') ? `+${item.p.toLocaleString()} XP` : `+₪${item.p.toLocaleString()}/ש`;
        html += `
        <div class="card fade-in" style="text-align:center; padding:15px; border:1px solid var(--border);">
            <div style="font-size:30px; margin-bottom:5px;">${item.i}</div>
            <b style="display:block; font-size:14px; min-height:35px;">${item.n}</b>
            <div style="color:${type==='market'?'var(--purple)':'var(--green)'}; font-size:12px; margin-bottom:10px; font-weight:bold;">${desc}</div>
            <button class="sys-btn" style="width:100%; padding:10px;" onclick="executeBuy('${type}','${item.n}',${item.c},${item.p},'${item.i}')">
                ${item.c.toLocaleString()}₪
            </button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function executeBuy(type, name, cost, value, icon) {
    if(typeof money !== 'undefined' && money >= cost) {
        money -= cost;
        
        if(type === 'business' || type === 'estate') {
            passive = (typeof passive !== 'undefined' ? passive : 0) + value;
        }
        else if(type === 'market') {
            lifeXP = (typeof lifeXP !== 'undefined' ? lifeXP : 0) + value;
            if(typeof checkLevelUp === 'function') checkLevelUp();
        }
        
        if(typeof inventory !== 'undefined') {
            inventory.push({name: name, icon: icon, type: type});
        }
        
        showMsg(`רכשת ${name}! ${icon}`, "var(--green)");
        updateUI(); 
        if(typeof saveGame === 'function') saveGame();
        
        const cont = document.getElementById('content');
        if(type === 'business') drawBusiness(cont);
        else if(type === 'estate') drawEstate(cont);
        else if(type === 'market') drawMarket(cont);
    } else {
        showMsg("אין לך מספיק מזומן!", "var(--red)");
    }
}

// לוגיקה להגדלת חוב פסיבית
setInterval(() => {
    if(typeof loan !== 'undefined' && loan > 0) {
        loan += (loan * 0.0001); 
    }
}, 10000);
