const VERSION = "3.8";

function load(k, d) { try { return localStorage[k] ? JSON.parse(localStorage[k]) : d; } catch { return d; } }

let money = load('money', 1500), bank = load('bank', 0), xp = load('xp', 0), level = load('level', 1);
let rep = load('rep', 0), passive = load('passive', 0), totalWorkDone = load('totalWorkDone', 0);
let debt = load('debt', 0), theme = load('theme', 'dark');
let myProperties = load('myProperties', []), mySkills = load('mySkills', []), myBusiness = load('myBusiness', []);
let currentTaskId = load('currentTaskId', 0);
let stockPrices = load('stockPrices', { tech: 100, reit: 250, crypto: 50 });
let myStocks = load('myStocks', { tech: 0, reit: 0, crypto: 0 });

const tasksData = Array.from({length: 20}, (_, i) => ({
    n: `שלב ${i+1}`, g: (i+1)*12, p: (i+1)*3000, t: 'work', d: `בצע ${(i+1)*12} עבודות לקידום הקריירה`
}));

const businessData = [
    { n: "דוכן פלאפל", cost: 5000, income: 200, icon: "🧆" },
    { n: "חנות בגדים", cost: 25000, income: 1200, icon: "👕" },
    { n: "מוסך רכבים", cost: 120000, income: 6500, icon: "🔧" },
    { n: "חברת הייטק", cost: 850000, income: 45000, icon: "💻" }
];

function notify(t, c = '') {
    const el = document.getElementById("msg-text");
    if(el) { el.innerText = t; el.className = c; }
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("rep-ui").innerText = Math.floor(rep);
    document.getElementById("debt-ui").innerText = Math.floor(debt).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.getElementById("xpfill").style.width = (xp % 100) + "%";
    document.getElementById("level").innerText = level;
    document.body.className = theme + "-theme";
    save();
}

function save() {
    const d = { money, bank, xp, level, rep, passive, totalWorkDone, myProperties, mySkills, currentTaskId, stockPrices, myStocks, debt, theme, myBusiness };
    for (let k in d) localStorage[k] = JSON.stringify(d[k]);
}

// מעבר בין יום ללילה
function toggleTheme() {
    theme = (theme === 'dark') ? 'light' : 'dark';
    updateUI();
}

// לוגיקת ריבית על חוב (כל דקה)
setInterval(() => {
    if (debt > 0) {
        let interest = debt * 0.01; // 1% ריבית
        money -= interest;
        notify(`שילמת ${Math.floor(interest)}₪ ריבית על ההלוואה`, "loss");
        updateUI();
    }
}, 60000);

// בורסה ודיבידנדים
setInterval(() => {
    stockPrices.tech = Math.max(10, Math.floor(stockPrices.tech + (Math.random() * 10 - 5)));
    stockPrices.crypto = Math.max(5, Math.floor(stockPrices.crypto + (Math.random() * 40 - 20)));
    if(document.getElementById("s-tech")) {
        document.getElementById("s-tech").innerText = stockPrices.tech;
        document.getElementById("s-crypto").innerText = stockPrices.crypto;
    }
    if(myStocks.reit > 0) money += (myStocks.reit * 0.5);
    updateUI();
}, 5000);

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        c.innerHTML = `<div class="card"><h3>📊 מצב חשבון</h3>
        <p>מוניטין: ${rep} | עבודות: ${totalWorkDone}</p>
        <div class="inventory-section"><h4>עסקים בבעלות:</h4>
        ${myBusiness.length ? myBusiness.map(b=>`<span>${b.icon} ${b.n}</span>`).join("") : "אין עסקים"}</div></div>`;
    } else if (tab === 'business') {
        c.innerHTML = `<h3>🏢 מרכז עסקים</h3>`;
        businessData.forEach(b => {
            const owned = myBusiness.find(x => x.n === b.n);
            if(!owned) {
                c.innerHTML += `<div class="card">${b.icon} <b>${b.n}</b><br>מחיר: ${b.cost.toLocaleString()}₪
                <button class="action" onclick="buyBusiness('${b.n}',${b.cost},${b.income},'${b.icon}')">פתח עסק</button></div>`;
            } else {
                c.innerHTML += `<div class="card">${b.icon} <b>${b.n} פעיל</b><br>רווח פוטנציאלי: ${b.income}₪
                <button class="action" style="background:#22c55e" onclick="manageBusiness('${b.n}',${b.income})">נהל ואסוף רווח</button></div>`;
            }
        });
    } else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק והלוואות</h3>
        <input id="bAmt" type="number" placeholder="סכום">
        <button class="action" onclick="bankOp('dep')">הפקדה</button>
        <button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button>
        <hr><h4>💳 הלוואות (ריבית 1% לדקה)</h4>
        <button class="action" style="background:#ef4444" onclick="takeLoan()">קח הלוואה של 50,000₪</button>
        <button class="action" style="background:#10b981" onclick="payLoan()">החזר 10,000₪ מהחוב</button></div>`;
    } else if (tab === 'work') {
        let h = `<h3>💼 עבודה</h3><div class="xpbar"><div id="wb" style="width:0%; background:#22c55e; height:100%;"></div></div>`;
        const works = [{id:"c",n:"שוטף כלים",p:130,t:4,x:15,r:1,req:null},{id:"t",n:"נהג מונית",p:380,t:6,x:35,r:4,req:"רישיון נהיגה"}];
        works.forEach(w => {
            const locked = w.req && !mySkills.includes(w.req);
            h += `<div class="card"><b>${w.n}</b> | ${w.p}₪<button class="action ${locked?'disabled':''}" onclick="${locked?'':`runWork('${w.id}',${w.p},${w.t},${w.x},${w.r})`}">עבוד</button></div>`;
        });
        c.innerHTML = h;
    } else if (tab === 'stock') {
        c.innerHTML = `<div class="card"><h3>💹 בורסה</h3>
        <div class="stock-item">💻 Tech: <b id="s-tech">${stockPrices.tech}</b> <button onclick="trade('tech','buy')">קנה</button></div>
        <div class="stock-item">🪙 Crypto: <b id="s-crypto">${stockPrices.crypto}</b> <button onclick="trade('crypto','buy')">קנה</button></div></div>`;
    } else if (tab === 'realestate') {
        const estates = [{n:"מחסן",c:15000,p:150,i:"📦"},{n:"דירה",c:200000,p:1800,i:"🏠"}];
        estates.forEach(e => {
            c.innerHTML += `<div class="card">${e.i} <b>${e.n}</b><button class="action" onclick="buyProp('${e.n}',${e.c},${e.p},'${e.i}')">קנה</button></div>`;
        });
    } else if (tab === 'tasks') {
        const t = tasksData[currentTaskId];
        c.innerHTML = `<div class="card"><h3>🎯 ${t.n}</h3><p>${t.d}</p><button class="action ${totalWorkDone<t.g?'disabled':''}" onclick="claimTask(${t.p})">קבל פרס</button></div>`;
    }
}

function buyBusiness(n,c,inc,icon) { if(money>=c){ money-=c; myBusiness.push({n,inc,icon}); updateUI(); openTab('business'); } }
function manageBusiness(n, inc) { money += inc; rep += 2; notify(`אספת ${inc}₪ מהעסק ${n}`, "gain"); updateUI(); }
function takeLoan() { debt += 50000; money += 50000; notify("לקחת הלוואה. שים לב לריבית!", "event"); updateUI(); }
function payLoan() { if(money>=10000 && debt>=10000){ money-=10000; debt-=10000; notify("החזרת חלק מהחוב", "gain"); updateUI(); } }
function runWork(id,p,t,x,r) { 
    if(working) return; working=true; let s=0; const bar=document.getElementById("wb");
    let i=setInterval(()=>{ s++; if(bar) bar.style.width=(s/t*100)+"%"; if(s>=t){ clearInterval(i); working=false; money+=p; rep+=r; totalWorkDone++; addXP(x); updateUI(); openTab('work'); } },1000);
}
function buyProp(n,c,p,i) { if(money>=c){ money-=c; myProperties.push({n,i,lvl:1}); passive+=p; updateUI(); openTab('realestate'); } }
function trade(type,act) { let p=stockPrices[type]; if(act==='buy'&&money>=p){money-=p;myStocks[type]++;} updateUI(); openTab('stock'); }
function addXP(v) { xp+=v; if(xp>=100){ xp-=100; level++; notify("LEVEL UP!", "event"); } }
function claimTask(p) { money+=p; currentTaskId++; updateUI(); openTab('tasks'); }
function bankOp(t) { let a=Number(document.getElementById("bAmt").value); if(t==='dep'&&money>=a){money-=a;bank+=a;}else if(t==='wit'&&bank>=a){bank-=a;money+=a;} updateUI(); }

let working = false;
setInterval(() => { if(passive>0){ money+=(passive/10); updateUI(); } }, 1000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
function resetGame() { if(confirm("לאפס?")) { localStorage.clear(); location.reload(); } }
function checkUpdate() { location.reload(true); }
