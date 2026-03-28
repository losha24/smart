const bzPool = [{n:"דוכן קפה", c:15000, p:120}, {n:"קיוסק", c:35000, p:350}, {n:"מכבסה", c:85000, p:900}, {n:"חברת הייטק", c:25000000, p:400000}];
const rePool = [{n:"חניה", c:85000, p:650}, {n:"מחסן", c:160000, p:1300}, {n:"דירת סטודיו", c:680000, p:5800}, {n:"בית פרטי", c:4500000, p:42000}];
const mkPool = [{n:"אייפון 15", c:4500}, {n:"לפטופ גיימינג", c:12000}, {n:"רכב ספורט", c:450000}];

function drawInvest(c) {
    stocks.forEach(s => {
        c.innerHTML += `<div class="card"><b>${s.n}</b>: ${s.p.toFixed(2)}$ <small>(${invOwned[s.id]||0})</small>
        <div class="nav-row"><button class="action" onclick="buyStock('${s.id}',${s.p})">קנה</button>
        <button class="action" style="background:var(--red)" onclick="sellStock('${s.id}',${s.p})">מכור</button></div></div>`;
    });
}

function buyStock(id, p) { if(money>=p*4) { money-=p*4; invOwned[id]++; updateUI(); openTab('invest'); } }
function sellStock(id, p) { if(invOwned[id]>0) { invOwned[id]--; money+=p*4; updateUI(); openTab('invest'); } }

function drawBank(c) {
    c.innerHTML = `<div class="card"><h3>🏦 בנק Smart</h3><input type="number" id="bankAmt" placeholder="סכום..."><div class="nav-row">
    <button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" onclick="bankOp('wit')">משיכה</button></div>
    <button class="action" onclick="bankOp('loan')" style="background:orange">הלוואה (5K)</button>
    <button class="action" onclick="bankOp('pay')" style="background:var(--blue)">החזר (5K)</button></div>`;
}

function bankOp(type) {
    const a = parseInt(document.getElementById("bankAmt")?.value) || 0;
    if(type==='dep' && money>=a) { money-=a; bank+=a; triggerTask('bank', a); }
    else if(type==='wit' && bank>=a) { bank-=a; money+=a; }
    else if(type==='loan') { loan+=5000; money+=5000; }
    else if(type==='pay' && money>=5000 && loan>=5000) { money-=5000; loan-=5000; }
    updateUI(); openTab('bank');
}

function drawMarket(c, tab) {
    let list = (tab==='business')?bzPool : (tab==='realestate')?rePool : (tab==='market')?mkPool : skPool;
    c.innerHTML = `<div class="grid-2"></div>`;
    list.forEach(i => {
        const has = tab==='skills' && skills.includes(i.n);
        c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${i.n}</b><br>${i.c.toLocaleString()}₪
        <button class="action" onclick="${tab==='skills'?'learn':'buyProp'}('${i.n}',${i.c},${i.p||0})" ${has?'disabled':''}>${has?'נלמד':'קנה'}</button></div>`;
    });
}

function buyProp(n, c, p) { if(money>=c) { money-=c; totalSpent+=c; passive+=p; triggerTask('buy', 1); updateUI(); } }
function learn(n, c) { if(money>=c && !skills.includes(n)) { money-=c; totalSpent+=c; skills.push(n); updateUI(); openTab('skills'); } }
