/* Smart Money Pro - js/economy/* Smart Money Pro - js/economy.js - v5.7.6 */

// מאגרי פריטים
const bzPool = [{n:"דוכן קפה", c:15000, p:25}, {n:"קיוסק", c:45000, p:85}, {n:"פיצריה", c:250000, p:450}, {n:"מספרה", c:80000, p:140}, {n:"חנות בגדים", c:550000, p:1100}, {n:"מוסך", c:1200000, p:2500}, {n:"מסעדה", c:3500000, p:7000}, {n:"סופרמרקט", c:9500000, p:18000}, {n:"קניון", c:30000000, p:55000}, {n:"מפעל", c:75000000, p:140000}];
const rePool = [{n:"חניה", c:95000, p:50}, {n:"מחסן", c:280000, p:160}, {n:"דירת 2 חדרים", c:1400000, p:850}, {n:"דירת 4 חדרים", c:2600000, p:1700}, {n:"וילה", c:6500000, p:4200}, {n:"בניין מגורים", c:22000000, p:18000}, {n:"מגדל משרדים", c:55000000, p:50000}, {n:"מרכז לוגיסטי", c:110000000, p:105000}, {n:"מלון יוקרה", c:250000000, p:240000}, {n:"אי פרטי", c:650000000, p:700000}];
const skPool = [{n:"ניהול זמן", c:5000, s:8}, {n:"מכירות", c:18000, s:25}, {n:"רישיון נשק", c:35000, s:45}, {n:"תכנות", c:65000, s:100}, {n:"שיווק", c:110000, s:180}, {n:"ניהול פיננסי", c:220000, s:400}, {n:"יזמות", c:500000, s:950}, {n:"בינה מלאכותית", c:1200000, s:2200}, {n:"מנהיגות", c:3500000, s:6500}, {n:"פוליטיקה", c:15000000, s:35000}];
const carPool = [{n:"קורקינט", c:3500, v:1.2}, {n:"אופנוע", c:32000, v:1.6}, {n:"רכב יד 2", c:120000, v:2.1}, {n:"ג'יפ", c:380000, v:2.8}, {n:"טסלה", c:650000, v:3.5}, {n:"פורשה", c:1500000, v:5}, {n:"יאכטה", c:7500000, v:8}, {n:"מסוק", c:18000000, v:12}, {n:"מטוס פרטי", c:55000000, v:20}, {n:"מעבורת חלל", c:450000000, v:50}];
const mkPool = [{n:"אייפון 15", c:5800, p:5}, {n:"מחשב גיימינג", c:18000, p:15}, {n:"שעון רולקס", c:145000, p:150}, {n:"מערכת קול", c:42000, p:35}, {n:"ריהוט יוקרה", c:85000, p:70}, {n:"בריכה ביתית", c:250000, p:200}, {n:"ג'קוזי", c:55000, p:40}, {n:"פסנתר כנף", c:120000, p:100}, {n:"ציור אמנות", c:2000000, p:1500}, {n:"יהלום נדיר", c:8000000, p:6000}];

function drawBank(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <h3>🏦 בנק לאומי</h3>
            <p>יתרה בבנק: <b>${bank.toLocaleString()}₪</b></p>
            <p>חוב הלוואות: <b style="color:var(--red)">${loan.toLocaleString()}₪</b></p>
            <input type="number" id="bank-amt" placeholder="הכנס סכום...">
            <div class="grid-2">
                <button class="action" onclick="bankOp('dep')">הפקד</button>
                <button class="action" onclick="bankOp('wd')">משוך</button>
            </div>
            <hr style="opacity:0.1; margin:15px 0;">
            <div class="grid-2">
                <button class="action" style="background:#0ea5e9" onclick="loanOp('take')">קח הלוואה (10K)</button>
                <button class="action" style="background:#f43f5e" onclick="loanOp('pay')">החזר הלוואה (10K)</button>
            </div>
        </div>`;
}

function bankOp(t) {
    const a = parseInt(document.getElementById('bank-amt').value);
    if(!a || a <= 0) return;
    if(t==='dep' && money >= a) { money -= a; bank += a; }
    else if(t==='wd' && bank >= a) { bank -= a; money += a; }
    else return showMsg("אין מספיק יתרה", "var(--red)");
    updateUI(); openTab('bank');
}

function loanOp(t) {
    if(t==='take') { loan += 10000; money += 10000; showMsg("הלוואה נוספה"); }
    else if(money >= 10500 && loan >= 10000) { money -= 10500; loan -= 10000; showMsg("הלוואה הוחזרה"); }
    else return showMsg("אין מספיק מזומן");
    updateUI(); openTab('bank');
}

function drawMarket(c, t) {
    let list = [];
    if(t==='business') list=bzPool; 
    else if(t==='realestate') list=rePool; 
    else if(t==='skills') list=skPool; 
    else if(t==='cars') list=carPool; 
    else list=mkPool;

    let h = `<div class="grid-2 fade-in">`;
    list.forEach(i => {
        const has = (t==='skills' && skills.includes(i.n)) || (t==='cars' && cars.includes(i.n));
        h += `
            <div class="card" style="text-align:center; padding:12px; font-size:0.85em;">
                <b style="display:block; height:35px;">${i.n}</b>
                <span style="color:var(--blue);">${i.c.toLocaleString()}₪</span>
                <button class="action ${has?'disabled':(money<i.c?'no-money':'')}" 
                        style="margin-top:10px; padding:8px 2px;"
                        onclick="executeBuy('${t}','${i.n}',${i.c},${i.p||i.s||i.v||0})" 
                        ${has?'disabled':''}>
                    ${has ? 'נרכש' : 'קנה'}
                </button>
            </div>`;
    });
    c.innerHTML = h + `</div>`;
}

function executeBuy(t, n, c, v) {
    if(money >= c) {
        money -= c;
        totalSpent += c;
        lifeXP += (c * 0.05); // קבלת XP: 5% ממחיר הרכישה
        
        if(t==='skills') skills.push(n);
        else if(t==='cars') { cars.push(n); carSpeed = v; }
        else if(t==='business' || t==='realestate' || t==='market') passive += v;
        
        showMsg("רכישה בוצעה! +" + Math.floor(c*0.05) + " XP", "var(--green)");
        updateUI(); 
        openTab(t);
    } else {
        showMsg("חסר לך כסף!", "var(--red)");
    }
}

function drawInvest(c) {
    let h = `<div class="card fade-in"><h3>📈 בורסה וקריפטו</h3><div class="grid-2">`;
    const stocks = [
        {id:'AAPL', n:'Apple', p:185}, {id:'TSLA', n:'Tesla', p:170}, 
        {id:'NVDA', n:'Nvidia', p:820}, {id:'BTC', n:'Bitcoin', p:68000},
        {id:'GOOG', n:'Google', p:150}, {id:'ELAL', n:'אל-על', p:6}
    ];
    stocks.forEach(s => {
        h += `
            <div class="card" style="padding:10px; text-align:center;">
                <b>${s.n}</b><br><small>${s.p}₪</small><br>
                <div style="display:flex; gap:4px; margin-top:8px;">
                    <button class="action" style="padding:5px;" onclick="buyStk('${s.id}',${s.p})">קנה</button>
                    <button class="action" style="background:var(--red); padding:5px;" onclick="sellStk('${s.id}',${s.p})">מכור</button>
                </div>
                <small style="display:block; margin-top:5px;">בבעלותך: ${invOwned[s.id]||0}</small>
            </div>`;
    });
    c.innerHTML = h + `</div></div>`;
}

function buyStk(i, p) { if(money>=p){money-=p; invOwned[i]++; updateUI(); openTab('invest');} }
function sellStk(i, p) { if(invOwned[i]>0){money+=p; invOwned[i]--; updateUI(); openTab('invest');} }
.js - v5.7.6 */

// מאגרים (10 פריטים לכל קטגוריה)
const bzPool = [{n:"דוכן קפה", c:15000, p:20}, {n:"קיוסק", c:45000, p:60}, {n:"פיצריה", c:250000, p:350}, {n:"מספרה", c:80000, p:110}, {n:"חנות בגדים", c:550000, p:800}, {n:"מוסך", c:1200000, p:1800}, {n:"מסעדה", c:3000000, p:4500}, {n:"סופרמרקט", c:8000000, p:12000}, {n:"קניון", c:25000000, p:40000}, {n:"מפעל", c:60000000, p:100000}];
const rePool = [{n:"חניה", c:90000, p:45}, {n:"מחסן", c:250000, p:130}, {n:"דירת 2 חדרים", c:1200000, p:650}, {n:"דירת 4 חדרים", c:2400000, p:1400}, {n:"וילה", c:5500000, p:3500}, {n:"בניין", c:18000000, p:15000}, {n:"קומה במגדל", c:45000000, p:42000}, {n:"מרכז לוגיסטי", c:90000000, p:85000}, {n:"מלון", c:200000000, p:200000}, {n:"אי פרטי", c:500000000, p:550000}];
const skPool = [{n:"ניהול זמן", c:5000, s:5}, {n:"מכירות", c:15000, s:15}, {n:"רישיון נשק", c:30000, s:30}, {n:"תכנות", c:50000, s:60}, {n:"שיווק", c:85000, s:120}, {n:"ניהול השקעות", c:150000, s:250}, {n:"יזמות", c:400000, s:700}, {n:"קריפטו", c:750000, s:1500}, {n:"מנהיגות", c:2000000, s:5000}, {n:"פוליטיקה", c:10000000, s:25000}];
const carPool = [{n:"קורקינט", c:3000, v:1.2}, {n:"אופנוע", c:25000, v:1.5}, {n:"משפחתית", c:150000, v:2}, {n:"ג'יפ", c:350000, v:2.5}, {n:"חשמלית יוקרה", c:600000, v:3.2}, {n:"ספורט", c:1200000, v:4.5}, {n:"יאכטה", c:5000000, v:7}, {n:"מסוק", c:12000000, v:10}, {n:"מטוס", c:45000000, v:15}, {n:"חללית", c:250000000, v:30}];
const mkPool = [{n:"אייפון", c:5500, p:2}, {n:"מחשב גיימינג", c:15000, p:6}, {n:"טלוויזיה 8K", c:25000, p:12}, {n:"שעון יוקרה", c:120000, p:50}, {n:"ריהוט מעצבים", c:45000, p:20}, {n:"מערכת קול", c:35000, p:15}, {n:"בריכה", c:180000, p:100}, {n:"ג'קוזי", c:40000, p:18}, {n:"פסל אמנות", c:1000000, p:500}, {n:"יהלום", c:2500000, p:1200}];

function drawBank(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🏦 בנק</h3><p>בנק: <b>${bank.toLocaleString()}₪</b></p><p>חוב: <b style="color:var(--red)">${loan.toLocaleString()}₪</b></p><input type="number" id="bank-amt" placeholder="סכום..."><div class="grid-2"><button class="action" onclick="bankOp('dep')">הפקד</button><button class="action" onclick="bankOp('wd')">משוך</button></div><hr><div class="grid-2"><button class="action" style="background:var(--blue)" onclick="loanOp('take')">קח 10K</button><button class="action" style="background:#ec4899" onclick="loanOp('pay')">החזר 10K</button></div></div>`;
}

function bankOp(t) {
    const a = parseInt(document.getElementById('bank-amt').value);
    if(!a || a <= 0) return;
    if(t==='dep' && money>=a) { money-=a; bank+=a; }
    else if(t==='wd' && bank>=a) { bank-=a; money+=a; }
    else return showMsg("אין מספיק כסף", "var(--red)");
    updateUI(); openTab('bank');
}

function loanOp(t) {
    if(t==='take') { loan+=10000; money+=10000; }
    else if(money>=10500 && loan>=10000) { money-=10500; loan-=10000; showMsg("הלוואה הוחזרה"); }
    else return showMsg("אין מספיק כסף");
    updateUI(); openTab('bank');
}

function drawMarket(c, t) {
    let l = [];
    if(t==='business') l=bzPool; else if(t==='realestate') l=rePool; else if(t==='skills') l=skPool; else if(t==='cars') l=carPool; else l=mkPool;
    let h = `<div class="grid-2 fade-in">`;
    l.forEach(i => {
        const has = (t==='skills'&&skills.includes(i.n))||(t==='cars'&&cars.includes(i.n));
        h += `<div class="card" style="font-size:12px; text-align:center;"><b>${i.n}</b><br>${i.c.toLocaleString()}₪<br><button class="action ${has?'disabled':(money<i.c?'no-money':'')}" onclick="executeBuy('${t}','${i.n}',${i.c},${i.p||i.s||i.v||0})" ${has?'disabled':''}>${has?'יש':'קנה'}</button></div>`;
    });
    c.innerHTML = h + `</div>`;
}

function executeBuy(t, n, c, v) {
    if(money >= c) {
        money -= c; totalSpent += c; lifeXP += (c * 0.05);
        if(t==='skills') skills.push(n);
        else if(t==='cars') { cars.push(n); carSpeed = v; }
        else if(t==='business' || t==='realestate' || t==='market') passive += v;
        updateUI(); openTab(t);
    } else showMsg("חסר כסף!", "var(--red)");
}

function drawInvest(c) {
    let h = `<div class="card fade-in"><h3>📈 בורסה</h3><div class="grid-2">`;
    const st = [{id:'AAPL', n:'Apple', p:150}, {id:'TSLA', n:'Tesla', p:200}, {id:'NVDA', n:'Nvidia', p:450}, {id:'BTC', n:'Bitcoin', p:65000}, {id:'GOOG', n:'Google', p:140}, {id:'AMZN', n:'Amazon', p:175}, {id:'MSFT', n:'Microsoft', p:400}, {id:'NFLX', n:'Netflix', p:600}, {id:'META', n:'Meta', p:480}, {id:'ELAL', n:'El-Al', p:5}];
    st.forEach(s => {
        h += `<div class="card" style="padding:10px; font-size:12px;"><b>${s.n}</b><br>${s.p}₪<br><button class="action" style="padding:5px;" onclick="buyStk('${s.id}',${s.p})">קנה</button><button class="action" style="background:var(--red); padding:5px;" onclick="sellStk('${s.id}',${s.p})">מכור</button><br><small>יש: ${invOwned[s.id]||0}</small></div>`;
    });
    c.innerHTML = h + `</div></div>`;
}

function buyStk(i, p) { if(money>=p){money-=p; invOwned[i]++; updateUI(); openTab('invest');} }
function sellStk(i, p) { if(invOwned[i]>0){money+=p; invOwned[i]--; updateUI(); openTab('invest');} }
