const VERSION = "3.8.1";
let working = false;

// טעינה ושמירה
const load = (k, d) => { try { return localStorage[k] ? JSON.parse(localStorage[k]) : d; } catch { return d; } };
const save = () => {
    const data = { money, bank, xp, level, rep, passive, totalWorkDone, debt, theme, myProperties, mySkills, myBusiness, currentTaskId, stockPrices, myStocks, myInventory };
    for (let k in data) localStorage[k] = JSON.stringify(data[k]);
};

// משתנים
let money = load('money', 1500), bank = load('bank', 0), xp = load('xp', 0), level = load('level', 1);
let rep = load('rep', 0), passive = load('passive', 0), totalWorkDone = load('totalWorkDone', 0);
let debt = load('debt', 0), theme = load('theme', 'dark'), currentTaskId = load('currentTaskId', 0);
let myProperties = load('myProperties', []), mySkills = load('mySkills', []), myBusiness = load('myBusiness', []);
let myInventory = load('myInventory', []), myStocks = load('myStocks', { tech: 0, reit: 0, crypto: 0 });
let stockPrices = load('stockPrices', { tech: 100, reit: 250, crypto: 50 });

// נתונים
const worksData = [
    { n: "שוטף כלים", p: 130, t: 4, x: 15, r: 1, req: null },
    { n: "נהג מונית", p: 350, t: 6, x: 30, r: 3, req: "רישיון נהיגה" },
    { n: "מאבטח", p: 850, t: 10, x: 70, r: 5, req: "רישיון נשק" },
    { n: "שוטר סיור", p: 1600, t: 14, x: 130, r: 15, req: "כושר קרבי" },
    { n: "טכנאי רשתות", p: 2500, t: 18, x: 200, r: 25, req: "קורס טכנאי" },
    { n: "אנליסט סייבר", p: 12000, t: 50, x: 1000, r: 100, req: "ניהול מערכות" }
];

const marketData = [
    { n: "אייפון 15", c: 4500, r: 10, i: "📱" },
    { n: "שעון רולקס", c: 45000, r: 150, i: "⌚" },
    { n: "מאזדה 3", c: 140000, r: 300, i: "🚗" },
    { n: "מרצדס S-Class", c: 850000, r: 1500, i: "🚘" },
    { n: "מטוס פרטי", c: 15000000, r: 10000, i: "🛩️" }
];

const estateData = [
    { n: "מחסן", c: 12000, p: 100, i: "📦" },
    { n: "דירה", c: 250000, p: 2000, i: "🏠" },
    { n: "בניין", c: 4000000, p: 45000, i: "🏙️" },
    { n: "קניון", c: 18000000, p: 220000, i: "🏬" }
];

const businessData = [
    { n: "דוכן פלאפל", c: 6000, inc: 350, i: "🧆", t: 40 },
    { n: "מוסך מרכזי", c: 85000, inc: 5000, i: "🔧", t: 150 },
    { n: "חברת הייטק", c: 1200000, inc: 75000, i: "💻", t: 400 }
];

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("debt-ui").innerText = Math.floor(debt).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.body.className = theme + "-theme";
    save();
}

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        c.innerHTML = `
        <div class="card home-grid">
            <div class="stat-box">⭐ רמה: <b>${level}</b></div>
            <div class="stat-box">🎭 מוניטין: <b>${rep}</b></div>
        </div>
        <div class="card">
            <h4>🎒 התיק שלי:</h4>
            <div class="inv-list">
                ${mySkills.map(s => `<span class="tag">🎓 ${s}</span>`).join("")}
                ${myInventory.map(i => `<span class="tag">${i.i} ${i.n}</span>`).join("")}
                ${myProperties.map(p => `<span class="tag">${p.i} ${p.n}</span>`).join("")}
            </div>
            ${mySkills.length + myInventory.length + myProperties.length === 0 ? '<small>אין פריטים עדיין...</small>' : ''}
        </div>
        <div class="xp-section card">
            <small>ניסיון לרמה הבאה: ${xp}%</small>
            <div class="xpbar"><div id="xpfill" style="width:${xp}%"></div></div>
        </div>`;
    } 
    else if (tab === 'work') {
        c.innerHTML = `<h3>💼 עבודה</h3><div class="xpbar"><div id="wb" style="width:0%; background:#22c55e; height:100%;"></div></div><div class="grid-2"></div>`;
        worksData.forEach(w => {
            const locked = w.req && !mySkills.includes(w.req);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card"><b>${w.n}</b><br><small>${w.p}₪</small><button class="action ${locked?'disabled':''}" onclick="runWork(${w.p},${w.t},${w.x},${w.r})">${locked?'🔒':'+'}</button></div>`;
        });
    }
    else if (tab === 'market') {
        c.innerHTML = `<div class="grid-2"></div>`;
        marketData.forEach(m => {
            const has = myInventory.find(x => x.n === m.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card">${m.i} <b>${m.n}</b><br><small>${m.c}₪</small><button class="action ${has?'disabled':''}" onclick="buyMarket('${m.n}',${m.c},${m.r},'${m.i}')">${has?'✔️':'קנה'}</button></div>`;
        });
    }
    else if (tab === 'business') {
        businessData.forEach(b => {
            const owned = myBusiness.find(x => x.n === b.n);
            c.innerHTML += `<div class="card">${b.i} <b>${b.n}</b><br>
            ${owned ? `<div class="cooldown-bar"><div id="cb-${b.n.replace(/\s/g,'')}" style="width:100%"></div></div><button id="bb-${b.n.replace(/\s/g,'')}" class="action" style="background:#22c55e" onclick="manageBusiness('${b.n}',${b.inc},${b.t})">אסוף רווח</button>` : 
            `<button class="action" onclick="buyBusiness('${b.n}',${b.c},${b.inc},'${b.i}',${b.t})">פתח ב-${b.c.toLocaleString()}₪</button>`}</div>`;
        });
    }
    else if (tab === 'realestate') {
        c.innerHTML = `<div class="grid-2"></div>`;
        estateData.forEach(e => {
            const has = myProperties.find(p => p.n === e.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card">${e.i} <b>${e.n}</b><br><small>+${e.p}₪</small><button class="action ${has?'disabled':''}" onclick="buyProp('${e.n}',${e.c},${e.p},'${e.i}')">${has?'✔️':'קנה'}</button></div>`;
        });
    }
    else if (tab === 'skills') {
        c.innerHTML = `<div class="grid-2"></div>`;
        const sks = [{n:"רישיון נהיגה", c:4500}, {n:"רישיון נשק", c:7500}, {n:"כושר קרבי", c:12000}, {n:"קורס טכנאי", c:18000}, {n:"שיווק שותפים", c:35000}, {n:"ניהול מערכות", c:65000}];
        sks.forEach(s => {
            const has = mySkills.includes(s.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card"><b>${s.n}</b><br><small>${s.c}₪</small><button class="action ${has?'disabled':''}" onclick="buySkill('${s.n}',${s.c})">${has?'✔️':'למד'}</button></div>`;
        });
    }
    else if (tab === 'stock') {
        c.innerHTML = `<h3>💹 בורסה</h3>`;
        ['tech', 'reit', 'crypto'].forEach(s => {
            c.innerHTML += `<div class="card"><b>${s.toUpperCase()}</b>: <span id="s-${s}">${stockPrices[s]}</span>₪ (שלך: ${myStocks[s]})<br><button onclick="trade('${s}','buy')">קנה</button> <button onclick="trade('${s}','sell')">מכור</button></div>`;
        });
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input id="bAmt" type="number" placeholder="סכום"><button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button><hr><h3>💳 הלוואות</h3><button class="action" style="background:#ef4444" onclick="loanOp('take')">קח 50,000₪</button></div>`;
    }
    else if (tab === 'tasks') {
        const t = Array.from({length:20},(_,i)=>({g:(i+1)*10,p:(i+1)*3500}))[currentTaskId] || {g:0,p:0};
        c.innerHTML = `<div class="card"><h3>🎯 משימה ${currentTaskId+1}</h3><p>בצע ${t.g} עבודות</p><p>התקדמות: ${totalWorkDone}/${t.g}</p><button class="action ${totalWorkDone<t.g?'disabled':''}" onclick="claimTask(${t.p})">קבל פרס</button></div>`;
    }
    else if (tab === 'install') {
        c.innerHTML = `<div class="card"><h3>📲 התקנה</h3><p>לחץ על "הוסף למסך הבית" בדפדפן כדי להשתמש באפליקציה כדף מלא.</p></div>`;
    }
}

// לוגיקה
function runWork(p, t, x, r) {
    if (working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => { s++; if(bar) bar.style.width = (s/t*100) + "%"; if(s>=t){ clearInterval(i); working=false; money+=p; rep+=r; totalWorkDone++; addXP(x); updateUI(); openTab('work'); }}, 1000);
}
function buyMarket(n,c,r,i) { if(money>=c){ money-=c; rep+=r; myInventory.push({n,i}); updateUI(); openTab('market'); }}
function buyBusiness(n,c,inc,i,t) { if(money>=c){ money-=c; myBusiness.push({n,inc,icon:i,t}); updateUI(); openTab('business'); }}
function manageBusiness(name, inc, time) {
    const id = name.replace(/\s/g,''), bar = document.getElementById(`cb-${id}`), btn = document.getElementById(`bb-${id}`);
    if (btn.classList.contains('disabled')) return;
    money+=inc; rep+=5; btn.classList.add('disabled'); let s=0;
    let i = setInterval(() => { s++; bar.style.width=(s/time*100)+"%"; if(s>=time){ clearInterval(i); btn.classList.remove('disabled'); bar.style.width="100%"; }}, 1000);
    updateUI();
}
function buyProp(n,c,p,i) { if(money>=c){ money-=c; myProperties.push({n,i}); passive+=p; updateUI(); openTab('realestate'); }}
function buySkill(n,c) { if(money>=c){ money-=c; mySkills.push(n); updateUI(); openTab('skills'); }}
function addXP(v) { xp+=v; if(xp>=100){ xp-=100; level++; money+=level*2000; } updateUI(); }
function claimTask(p) { money+=p; currentTaskId++; updateUI(); openTab('tasks'); }
function bankOp(t) { let a=Number(document.getElementById("bAmt").value); if(t==='dep'&&money>=a){money-=a;bank+=a;}else if(t==='wit'&&bank>=a){bank-=a;money+=a;} updateUI(); }
function loanOp(t) { if(t==='take'){debt+=50000;money+=50000;} updateUI(); }
function trade(s, a) { let p=stockPrices[s]; if(a==='buy'&&money>=p){money-=p;myStocks[s]++;}else if(a==='sell'&&myStocks[s]>0){money+=p;myStocks[s]--;} updateUI(); openTab('stock'); }

function toggleTheme() { theme = (theme==='dark'?'light':'dark'); updateUI(); }
setInterval(() => { if(passive>0){ money+=(passive/10); updateUI(); }}, 1000);
setInterval(() => { if(debt>0){ money-=(debt*0.01); updateUI(); }}, 60000);
setInterval(() => { stockPrices.tech = Math.max(10, stockPrices.tech+Math.floor(Math.random()*12-6)); updateUI(); }, 5000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
const resetGame = () => { if(confirm("איפוס מלא?")) { localStorage.clear(); location.reload(); }};
const checkUpdate = () => location.reload(true);
