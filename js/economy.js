function drawBank(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🏦 בנק</h3><p>יתרה: <b>${bank.toLocaleString()}₪</b></p><input type="number" id="bank-amt" placeholder="סכום..." class="card" style="width:100%; text-align:center;"><div class="grid-2"><button class="action" onclick="bankOp('dep')">הפקד</button><button class="action" onclick="bankOp('wd')">משוך</button></div><hr><button class="action" style="background:var(--blue)" onclick="loanOp()">הלוואה (10K)</button></div>`;
}

function bankOp(t) {
    const a = parseInt(document.getElementById('bank-amt').value);
    if(!a || a <= 0) return;
    if(t === 'dep' && money >= a) { money -= a; bank += a; }
    else if(t === 'wd' && bank >= a) { bank -= a; money += a; }
    else return showMsg("אין מספיק כסף", "var(--red)");
    updateUI(); openTab('bank');
}

function loanOp() { loan += 10000; money += 10000; showMsg("הלוואה אושרה"); updateUI(); openTab('bank'); }

function drawInvest(c) {
    let h = `<div class="card fade-in"><h3>📈 בורסה</h3><div class="grid-2">`;
    const st = [{id:'AAPL', n:'Apple', p:150}, {id:'TSLA', n:'Tesla', p:200}, {id:'NVDA', n:'Nvidia', p:450}, {id:'BTC', n:'Bitcoin', p:65000}];
    st.forEach(s => {
        h += `<div class="card" style="padding:10px; text-align:center;"><b>${s.n}</b><br><small>${s.p}₪</small><br><button class="action" onclick="buyStk('${s.id}',${s.p})">קנה</button><button class="action" style="background:var(--red)" onclick="sellStk('${s.id}',${s.p})">מכור</button><br><small>בבעלותך: ${invOwned[s.id]||0}</small></div>`;
    });
    c.innerHTML = h + `</div></div>`;
}

function buyStk(i, p) { if(money>=p){money-=p; invOwned[i]=(invOwned[i]||0)+1; updateUI(); openTab('invest');} }
function sellStk(i, p) { if(invOwned[i]>0){money+=p; invOwned[i]--; updateUI(); openTab('invest');} }

// רשימות (דוגמה מצומצמת - ניתן להרחיב ל-10)
const bzPool = [{n:"דוכן קפה", c:15000, p:12}, {n:"קיוסק", c:45000, p:40}, {n:"פיצריה", c:350000, p:320}];
const rePool = [{n:"חניה", c:85000, p:40}, {n:"מחסן", c:220000, p:120}, {n:"דירה", c:1600000, p:1100}];
const skPool = [{n:"ניהול זמן", c:5000, s:0.2}, {n:"תכנות", c:45000, s:2}, {n:"יזמות", c:300000, s:15}];
const carPool = [{n:"קורקינט", c:2500, s:1.1}, {n:"רכב משפחתי", c:140000, s:2}, {n:"יוקרה", c:850000, s:4}];
const mkPool = [{n:"סמארטפון", c:4500}, {n:"מחשב", c:12000}, {n:"שעון", c:55000}];

function drawMarket(c, t) {
    let l = [];
    if(t==='business') l=bzPool; else if(t==='realestate') l=rePool; else if(t==='skills') l=skPool; else if(t==='cars') l=carPool; else l=mkPool;
    let h = `<div class="grid-2 fade-in">`;
    l.forEach(i => {
        const has = (t==='skills'&&skills.includes(i.n))||(t==='cars'&&cars.includes(i.n));
        h += `<div class="card"><b>${i.n}</b><br><small>${i.c.toLocaleString()}₪</small><button class="action ${has||money<i.c?'no-money':''}" onclick="executeBuy('${t}','${i.n}',${i.c},${i.p||i.s||0})" ${has?'disabled':''}>${has?'בבעלותך':'קנה'}</button></div>`;
    });
    c.innerHTML = h + `</div>`;
}

function executeBuy(t, n, c, v) {
    if(money >= c) {
        money -= c; totalSpent += c;
        if(t==='skills') skills.push(n);
        else if(t==='cars') { cars.push(n); carSpeed = v; }
        else if(t==='business' || t==='realestate') passive += v;
        updateUI(); openTab(t);
    }
}
