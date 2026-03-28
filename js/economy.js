const bzPool = [
    {n:"דוכן קפה", c:15000, p:12}, {n:"קיוסק", c:45000, p:40}, {n:"מכבסה", c:120000, p:110}, 
    {n:"פיצריה", c:350000, p:320}, {n:"מוסך", c:850000, p:850}, {n:"סופרמרקט", c:2200000, p:2400},
    {n:"אולם אירועים", c:5000000, p:6000}, {n:"מפעל", c:12000000, p:15000}, {n:"קניון", c:50000000, p:70000}, {n:"חברת הייטק", c:150000000, p:250000}
];

const rePool = [
    {n:"חניה", c:85000, p:40}, {n:"מחסן", c:180000, p:90}, {n:"סטודיו", c:750000, p:400}, 
    {n:"דירה", c:1600000, p:1000}, {n:"פנטהאוז", c:4500000, p:3500}, {n:"וילה", c:8000000, p:7500},
    {n:"משרדים", c:25000000, p:28000}, {n:"מלון", c:60000000, p:75000}, {n:"מרכז לוגיסטי", c:120000000, p:160000}, {n:"גורד שחקים", c:500000000, p:800000}
];

const carPool = [
    {n:"קורקינט", c:2500, s:1.2}, {n:"אופנוע", c:15000, s:1.5}, {n:"רכב משומש", c:45000, s:2},
    {n:"משפחתית", c:140000, s:3}, {n:"ג'יפ", c:450000, s:4}, {n:"ספורט", c:950000, s:6},
    {n:"פורשה", c:1800000, s:10}, {n:"פרארי", c:3500000, s:15}, {n:"למבורגיני", c:6000000, s:25}, {n:"בוגאטי", c:15000000, s:50}
];

const mkPool = [
    {n:"אופניים", c:1200, p:0.1}, {n:"אייפון 15", c:4800, p:0.5}, {n:"מחשב", c:15000, p:2},
    {n:"שעון יוקרה", c:45000, p:5}, {n:"ריהוט", c:80000, p:10}
];

function drawInvest(c) {
    c.innerHTML = `<div class="grid-2 fade-in"></div>`;
    stocks.forEach(s => {
        c.querySelector(".grid-2").innerHTML += `
        <div class="card stock-card">
            <b>${s.n}</b><br>${s.p.toLocaleString()}₪
            <div class="nav-row" style="margin-top:10px">
                <button class="buy-btn" onclick="buyStock('${s.id}',${s.p})">קנה</button>
                <button class="sell-btn" onclick="sellStock('${s.id}',${s.p})">מכור</button>
            </div>
            <small>בבעלותך: ${invOwned[s.id]||0}</small>
        </div>`;
    });
}

function buyStock(id, p) { if(money>=p) { money-=p; invOwned[id]++; passive += (p*0.0001); showMsg(`קנית מניה`); updateUI(); openTab('invest'); } }
function sellStock(id, p) { if(invOwned[id]>0) { invOwned[id]--; money+=p; passive -= (p*0.0001); showMsg(`מכרת מניה`); updateUI(); openTab('invest'); } }

function drawBank(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🏦 בנק Smart</h3>
    <p>חוב: <b class="neg-text">${loan.toLocaleString()}₪</b></p>
    <input type="number" id="bankAmt" placeholder="סכום לביצוע...">
    <div class="nav-row"><button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" onclick="bankOp('wit')">משיכה</button></div>
    <button class="action" onclick="bankOp('loan')" style="background:orange">הלוואה (10K)</button>
    <button class="action" onclick="bankOp('pay')" style="background:var(--blue)">החזר (10K)</button></div>`;
}

function bankOp(t) {
    const a = parseInt(document.getElementById("bankAmt")?.value) || 0;
    if(t==='dep' && money>=a) { money-=a; bank+=a; showMsg("הופקד בהצלחה"); }
    else if(t==='wit' && bank>=a) { bank-=a; money+=a; showMsg("נמשך בהצלחה"); }
    else if(t==='loan') { loan+=10000; money+=10000; showMsg("הלוואה אושרה"); }
    else if(t==='pay' && money>=10000 && loan>=10000) { money-=10000; loan-=10000; showMsg("חלק מהחוב הוחזר"); }
    updateUI(); openTab('bank');
}

function drawMarket(c, tab) {
    let list = (tab==='business')?bzPool : (tab==='realestate')?rePool : (tab==='cars')?carPool : mkPool;
    if(tab==='skills') list = skPool;
    c.innerHTML = `<div class="grid-2 fade-in"></div>`;
    list.forEach(i => {
        const has = (tab==='skills' && skills.includes(i.n)) || (tab==='cars' && cars.includes(i.n));
        c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${i.n}</b><br>${i.c.toLocaleString()}₪
        <button class="action" onclick="${tab==='skills'?'learn':tab==='cars'?'buyCar':'buyProp'}('${i.n}',${i.c},${i.p||i.s||0})" ${has?'disabled':''}>${has?'בבעלותך':'קנה'}</button></div>`;
    });
}

function buyCar(n, c, s) { if(money>=c && !cars.includes(n)) { money-=c; cars.push(n); if(s>carSpeed) carSpeed=s; showMsg(`קנית ${n}`); updateUI(); openTab('cars'); } }
function buyProp(n, c, p) { if(money>=c) { money-=c; totalSpent+=c; passive+=p; inventory.push(n); showMsg(`קנית ${n}`); updateUI(); } }
