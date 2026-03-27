const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };
const save = () => {
    const d = { money, bank, xp, level, rep, passive, totalWorkDone, debt, theme, myProperties, mySkills, myBusiness, currentTaskId, stockPrices, myStocks, myInventory, lastDaily };
    Object.keys(d).forEach(k => localStorage.setItem(k, JSON.stringify(d[k])));
};

// States
let money = load('money', 2000), bank = load('bank', 0), xp = load('xp', 0), level = load('level', 1);
let rep = load('rep', 0), passive = load('passive', 0), totalWorkDone = load('totalWorkDone', 0);
let debt = load('debt', 0), theme = load('theme', 'dark'), currentTaskId = load('currentTaskId', 0);
let myProperties = load('myProperties', []), mySkills = load('mySkills', []), myBusiness = load('myBusiness', []);
let myInventory = load('myInventory', []), myStocks = load('myStocks', { tech: 0, gold: 0, ai: 0, oil: 0, crypto: 0 });
let stockPrices = load('stockPrices', { tech: 120, gold: 1850, ai: 310, oil: 65, crypto: 42000 });
let lastDaily = load('lastDaily', 0);
let working = false;

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.getElementById("rep-ui").innerText = rep;
    save();
}

function showMessage(msg, type = '') {
    const bar = document.getElementById("status-bar");
    const txt = document.getElementById("msg-text");
    txt.innerText = msg;
    bar.className = type; 
    setTimeout(() => { bar.className = ''; txt.innerText = "Smart Money AI v4.2"; }, 5000);
}

// Random Events System
function triggerRandomEvent() {
    const events = [
        { m: "מצאת 500₪ בארנק ישן!", v: 500, r: 0, t: 'event-positive' },
        { m: "קיבלת דוח חניה... 250₪ פחות.", v: -250, r: -2, t: 'event-negative' },
        { m: "בונוס מהעבודה על הצטיינות! 1,200₪", v: 1200, r: 5, t: 'event-positive' },
        { m: "הייתה הצפה בבית, התיקון עלה 2,000₪", v: -2000, r: 0, t: 'event-negative' },
        { m: "השקעה ישנה הניבה רווח של 3,000₪", v: 3000, r: 10, t: 'event-positive' },
        { m: "הפסדת 1,000₪ בהימור לא מוצלח.", v: -1000, r: -5, t: 'event-negative' }
    ];
    const e = events[Math.floor(Math.random() * events.length)];
    money += e.v; rep += e.r;
    if(money < 0) money = 0;
    showMessage(e.m, e.t);
    updateUI();
}

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        const canClaim = Date.now() - lastDaily > 86400000;
        const invTags = [...mySkills.map(s=>`🎓 ${s}`), ...myInventory.map(i=>`${i.i} ${i.n}`), ...myProperties.map(p=>`${p.i} ${p.n} (שלב ${p.lvl || 1})`)].map(t=>`<span class="tag">${t}</span>`).join("");
        c.innerHTML = `
        <div class="card home-grid">
            <div class="stat-box">⭐ רמה: <b>${level}</b></div>
            <div class="stat-box">🎭 מוניטין: <b>${rep}</b></div>
            <div class="stat-box">💼 עבודות: <b>${totalWorkDone}</b></div>
            <div class="stat-box">🏢 עסקים: <b>${myBusiness.length}</b></div>
        </div>
        <div class="card"><button class="action ${!canClaim?'disabled':''}" style="background:#10b981" onclick="claimDaily()">🎁 מתנה יומית (5,000₪)</button></div>
        <div class="card"><h4>🎒 רכוש וכישורים:</h4><div class="inv-list">${invTags || 'ריק...'}</div></div>
        <div class="card"><small>XP: ${xp}%</small><div class="xpbar"><div id="xpfill" style="width:${xp}%"></div></div></div>`;
    }
    else if (tab === 'work') {
        const wks = [
            {n:"שליח", p:160, t:4, r:1, x:15}, {n:"מחסנאי", p:220, t:5, r:2, x:20},
            {n:"נהג", p:480, t:7, r:4, x:35, s:"רישיון נהיגה"}, {n:"מאבטח", p:1150, t:12, r:10, x:85, s:"רישיון נשק"},
            {n:"שוטר", p:2200, t:15, r:30, x:160, s:"כושר קרבי"}, {n:"מתכנת", p:4500, t:25, r:50, x:350, s:"קורס AI"}
        ];
        c.innerHTML = `<div class="xpbar"><div id="wb" style="width:0%"></div></div><div class="grid-2" id="grid"></div>`;
        wks.forEach(w => {
            const l = w.s && !mySkills.includes(w.s);
            c.querySelector("#grid").innerHTML += `<div class="card small-card"><b>${w.n}</b><br>${w.p}₪<button class="action ${l?'disabled':''}" onclick="runWork(${w.p},${w.t},${w.x},${w.r})">${l?'🔒':'+'}</button></div>`;
        });
    }
    else if (tab === 'realestate') {
        const est = [{n:"מחסן", c:25000, p:200, i:"📦"}, {n:"דירה", c:450000, p:4000, i:"🏠"}, {n:"וילה", c:2500000, p:25000, i:"🏡"}];
        c.innerHTML = `<div class="grid-2" id="grid"></div>`;
        est.forEach(e => {
            const prop = myProperties.find(p => p.n === e.n);
            if(prop) {
                const upCost = Math.floor(e.c * 0.5 * (prop.lvl || 1));
                c.querySelector("#grid").innerHTML += `<div class="card small-card">${e.i} <b>${e.n}</b><br><small>שלב ${prop.lvl}</small><br>+${Math.floor(prop.p)}₪<button class="action upgrade-btn" onclick="upgradeProp('${e.n}',${upCost})">שדרג: ${upCost.toLocaleString()}₪</button></div>`;
            } else {
                c.querySelector("#grid").innerHTML += `<div class="card small-card">${e.i} <b>${e.n}</b><br>${e.c.toLocaleString()}₪<button class="action" onclick="buyProp('${e.n}',${e.c},${e.p},'${e.i}')">קנה</button></div>`;
            }
        });
    }
    else if (tab === 'stock') {
        c.innerHTML = `<h3>💹 בורסה</h3><div class="grid-2" id="grid"></div>`;
        Object.keys(myStocks).forEach(s => {
            c.querySelector("#grid").innerHTML += `<div class="card small-card"><b>${s.toUpperCase()}</b><br><span id="p-${s}">${stockPrices[s]}</span>₪<br><small>שלך: ${myStocks[s]}</small><div class="grid-2" style="padding:0; margin-top:5px;"><button class="action" onclick="trade('${s}','buy')">קנה</button><button class="action" style="background:#475569" onclick="trade('${s}','sell')">מכור</button></div></div>`;
        });
    }
    else if (tab === 'market') {
        const items = [{n:"אייפון 15", c:5200, r:15, i:"📱"}, {n:"מחשב גיימינג", c:8500, r:25, i:"💻"}, {n:"אופנוע", c:35000, r:80, i:"🏍️"}];
        c.innerHTML = `<div class="grid-2" id="grid"></div>`;
        items.forEach(m => {
            const has = myInventory.find(x => x.n === m.n);
            c.querySelector("#grid").innerHTML += `<div class="card small-card">${m.i} <b>${m.n}</b><br>${m.c}₪<button class="action ${has?'disabled':''}" onclick="buyMarket('${m.n}',${m.c},${m.r},'${m.i}')">${has?'✔️':'קנה'}</button></div>`;
        });
    }
    else if (tab === 'skills') {
        const sks = [{n:"רישיון נהיגה", c:5000}, {n:"רישיון נשק", c:8500}, {n:"קורס AI", c:25000}];
        c.innerHTML = `<div class="grid-2" id="grid"></div>`;
        sks.forEach(s => {
            const has = mySkills.includes(s.n);
            c.querySelector("#grid").innerHTML += `<div class="card small-card"><b>${s.n}</b><br>${s.c}₪<button class="action ${has?'disabled':''}" onclick="buySkill('${s.n}',${s.c})">${has?'✔️':'למד'}</button></div>`;
        });
    }
    else if (tab === 'tasks') {
        const t = {g:(currentTaskId+1)*12, p:(currentTaskId+1)*5000};
        c.innerHTML = `<div class="card"><h3>🎯 משימה ${currentTaskId+1}</h3><p>בצע ${t.g} עבודות</p><p>${totalWorkDone}/${t.g}</p><button class="action ${totalWorkDone<t.g?'disabled':''}" onclick="claimTask(${t.p})">קבל פרס</button></div>`;
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input id="bAmt" type="number" placeholder="סכום"><button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button></div>`;
    }
    else if (tab === 'business') {
        const bz = [{n:"בית קפה", c:15000, inc:800, i:"☕", t:40}, {n:"סוכנות רכב", c:500000, inc:25000, i:"🏎️", t:180}];
        bz.forEach(b => {
            const owned = myBusiness.find(x => x.n === b.n);
            c.innerHTML += `<div class="card">${b.i} <b>${b.n}</b><br>${owned?`<div class="cooldown-bar"><div id="cb-${b.n}"></div></div><button id="bb-${b.n}" class="action" onclick="manageBusiness('${b.n}',${b.inc},${b.t})">אסוף רווח</button>`:`<button class="action" onclick="buyBusiness('${b.n}',${b.c},${b.inc},'${b.i}',${b.t})">פתח ב-${b.c}₪</button>`}</div>`;
        });
    }
    else if (tab === 'install') {
        c.innerHTML = `<div class="card"><h3>📲 התקנה</h3><p>לחץ על "הוסף למסך הבית" בדפדפן.</p></div>`;
    }
}

// Logic functions
function runWork(p, t, x, r) {
    if (working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => { s++; if(bar) bar.style.width=(s/t*100)+"%"; if(s>=t){ clearInterval(i); working=false; money+=p; rep+=r; totalWorkDone++; addXP(x); updateUI(); openTab('work'); }}, 1000);
}
function addXP(v) { xp+=v; if(xp>=100){ xp-=100; level++; money+=level*1000; showMessage(`עלית לרמה ${level}! קיבלת בונוס.`); } updateUI(); }
function buyProp(n,c,p,i) { if(money>=c){ money-=c; myProperties.push({n,i,p,lvl:1}); passive+=p; updateUI(); openTab('realestate'); }}
function upgradeProp(name, cost) {
    if(money >= cost) {
        money -= cost; const p = myProperties.find(x => x.n === name);
        const oldP = p.p; p.lvl++; p.p *= 1.25; passive += (p.p - oldP);
        updateUI(); openTab('realestate'); showMessage("הנכס שודרג בהצלחה!");
    }
}
function buyMarket(n,c,r,i) { if(money>=c){ money-=c; rep+=r; myInventory.push({n,i}); updateUI(); openTab('market'); }}
function buySkill(n,c) { if(money>=c){ money-=c; mySkills.push(n); updateUI(); openTab('skills'); }}
function buyBusiness(n,c,inc,i,t) { if(money>=c){ money-=c; myBusiness.push({n,inc,icon:i,t}); updateUI(); openTab('business'); }}
function manageBusiness(n, inc, time) {
    const btn = document.getElementById(`bb-${n}`), bar = document.getElementById(`cb-${n}`);
    if(!btn || btn.classList.contains('disabled')) return;
    money+=inc; btn.classList.add('disabled'); let s=0;
    let i = setInterval(() => { s++; if(bar) bar.style.width=(s/time*100)+"%"; if(s>=time){ clearInterval(i); btn.classList.remove('disabled'); if(bar) bar.style.width="100%"; }}, 1000);
    updateUI();
}
function bankOp(t) { let a=Number(document.getElementById("bAmt").value); if(t==='dep'&&money>=a){money-=a;bank+=a;}else if(t==='wit'&&bank>=a){bank-=a;money+=a;} updateUI(); }
function trade(s, a) { let p=stockPrices[s]; if(a==='buy'&&money>=p){money-=p;myStocks[s]++;}else if(a==='sell'&&myStocks[s]>0){money+=p;myStocks[s]--;} updateUI(); openTab('stock'); }
function claimDaily() { if(Date.now()-lastDaily > 86400000){ money+=5000; lastDaily=Date.now(); updateUI(); openTab('home'); }}
function claimTask(p) { money+=p; currentTaskId++; updateUI(); openTab('tasks'); }

// Loops
setInterval(() => { if(passive>0){ money+=(passive/10); updateUI(); }}, 1000);
setInterval(() => { Object.keys(stockPrices).forEach(s => { stockPrices[s] += Math.floor(Math.random()*40-20); if(stockPrices[s]<1) stockPrices[s]=1; }); if(document.getElementById("p-tech")) updateUI(); }, 8000);
setInterval(triggerRandomEvent, 30000);

function toggleTheme() { theme=(theme==='dark'?'light':'dark'); updateUI(); }
const resetGame = () => { if(confirm("איפוס מלא?")) { localStorage.clear(); location.reload(); }};
const checkUpdate = () => location.reload(true);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
