/* Smart Money Pro - js/economy.js - v5.7.6 */

const bzPool = [{n:"דוכן קפה", c:15000, p:25}, {n:"קיוסק", c:45000, p:85}, {n:"פיצריה", c:250000, p:450}, {n:"חנות בגדים", c:550000, p:1100}, {n:"מוסך", c:1200000, p:2500}, {n:"מסעדה", c:3500000, p:7000}];
const rePool = [{n:"חניה", c:95000, p:50}, {n:"מחסן", c:280000, p:160}, {n:"דירת 2 חדרים", c:1400000, p:850}, {n:"וילה", c:6500000, p:4200}];
const skPool = [{n:"ניהול זמן", c:5000, s:8}, {n:"רישיון נשק", c:35000, s:45}, {n:"תכנות", c:65000, s:100}, {n:"מנהיגות", c:3500000, s:6500}];
const carPool = [{n:"קורקינט", c:3500, v:1.2}, {n:"אופנוע", c:32000, v:1.6}, {n:"רכב יד 2", c:120000, v:2.1}, {n:"טסלה", c:650000, v:3.5}];
const mkPool = [{n:"אייפון 15", c:5800, p:5}, {n:"שעון רולקס", c:145000, p:150}, {n:"יהלום נדיר", c:8000000, p:6000}];

window.drawBank = function(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <h3>🏦 בנק לאומי</h3>
            <p>יתרה: <b>${bank.toLocaleString()}₪</b> | חוב: <b style="color:var(--red)">${loan.toLocaleString()}₪</b></p>
            <input type="number" id="bank-amt" placeholder="סכום...">
            <div class="grid-2">
                <button class="action" onclick="window.bankOp('dep')">הפקד</button>
                <button class="action" onclick="window.bankOp('wd')">משוך</button>
            </div>
            <hr style="opacity:0.1; margin:15px 0;">
            <div class="grid-2">
                <button class="action" style="background:#0ea5e9" onclick="window.loanOp('take')">הלוואה (10K)</button>
                <button class="action" style="background:#f43f5e" onclick="window.loanOp('pay')">החזר (10.5K)</button>
            </div>
        </div>`;
};

window.bankOp = function(t) {
    const a = parseInt(document.getElementById('bank-amt').value);
    if(!a || a <= 0) return;
    if(t==='dep' && money >= a) { money -= a; bank += a; }
    else if(t==='wd' && bank >= a) { bank -= a; money += a; }
    else return window.showMsg("אין מספיק יתרה", "var(--red)");
    window.updateUI(); window.openTab('bank');
};

window.loanOp = function(t) {
    if(t==='take') { loan += 10000; money += 10000; window.showMsg("הלוואה התקבלה"); }
    else if(money >= 10500 && loan >= 10000) { money -= 10500; loan -= 10000; window.showMsg("הלוואה שולמה"); }
    else return window.showMsg("חסר מזומן להחזר");
    window.updateUI(); window.openTab('bank');
};

window.drawMarket = function(c, t) {
    let list = (t==='business')?bzPool:(t==='realestate')?rePool:(t==='skills')?skPool:(t==='cars')?carPool:mkPool;
    let h = `<div class="grid-2 fade-in">`;
    list.forEach(i => {
        const has = (t==='skills' && skills.includes(i.n)) || (t==='cars' && cars.includes(i.n));
        h += `
            <div class="card" style="text-align:center; padding:10px;">
                <b style="display:block; font-size:13px;">${i.n}</b>
                <span style="color:var(--blue); font-size:12px;">${i.c.toLocaleString()}₪</span>
                <button class="action ${has?'disabled':(money<i.c?'no-money':'')}" 
                        style="margin-top:8px; padding:8px 2px;"
                        onclick="window.executeBuy('${t}','${i.n}',${i.c},${i.p||i.s||i.v||0})" 
                        ${has?'disabled':''}>${has?'נרכש':'קנה'}</button>
            </div>`;
    });
    c.innerHTML = h + `</div>`;
};

window.executeBuy = function(t, n, c, v) {
    if(money >= c) {
        money -= c; totalSpent += c; lifeXP += (c * 0.05);
        if(t==='skills') skills.push(n);
        else if(t==='cars') { cars.push(n); window.carSpeed = v; }
        else if(t==='business'||t==='realestate'||t==='market') passive += v;
        window.showMsg("רכישה בוצעה! +" + Math.floor(c*0.05) + " XP", "var(--green)");
        window.updateUI(); window.openTab(t);
    } else window.showMsg("אין מספיק כסף", "var(--red)");
};

window.drawInvest = function(c) {
    let h = `<div class="card fade-in"><h3>📈 בורסה</h3><div class="grid-2">`;
    const stocks = [{id:'AAPL', n:'Apple', p:185}, {id:'TSLA', n:'Tesla', p:170}, {id:'BTC', n:'Bitcoin', p:68000}, {id:'ELAL', n:'אל-על', p:6}];
    stocks.forEach(s => {
        h += `
            <div class="card" style="padding:10px; text-align:center;">
                <b>${s.n}</b><br><small>${s.p}₪</small><br>
                <div style="display:flex; gap:4px; margin-top:8px;">
                    <button class="action" style="padding:5px;" onclick="window.buyStk('${s.id}',${s.p})">קנה</button>
                    <button class="action" style="background:var(--red); padding:5px;" onclick="window.sellStk('${s.id}',${s.p})">מכור</button>
                </div>
                <small style="display:block; margin-top:5px;">שלך: ${invOwned[s.id]||0}</small>
            </div>`;
    });
    c.innerHTML = h + `</div></div>`;
};

window.buyStk = function(i,p) { if(money>=p){money-=p; invOwned[i]++; window.updateUI(); window.openTab('invest');} };
window.sellStk = function(i,p) { if(invOwned[i]>0){money+=p; invOwned[i]--; window.updateUI(); window.openTab('invest');} };
