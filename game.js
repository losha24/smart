const VERSION = "3.8.3";

// טעינה בטוחה
const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };
const save = () => {
    const d = { money, bank, xp, level, rep, passive, totalWorkDone, debt, theme, myProperties, mySkills, myBusiness, currentTaskId, stockPrices, myStocks, myInventory };
    Object.keys(d).forEach(k => localStorage.setItem(k, JSON.stringify(d[k])));
};

// אתחול משתנים
let money = load('money', 1500), bank = load('bank', 0), xp = load('xp', 0), level = load('level', 1);
let rep = load('rep', 0), passive = load('passive', 0), totalWorkDone = load('totalWorkDone', 0);
let debt = load('debt', 0), theme = load('theme', 'dark'), currentTaskId = load('currentTaskId', 0);
let myProperties = load('myProperties', []), mySkills = load('mySkills', []), myBusiness = load('myBusiness', []);
let myInventory = load('myInventory', []), myStocks = load('myStocks', { tech: 0, reit: 0, crypto: 0 });
let stockPrices = load('stockPrices', { tech: 100, reit: 250, crypto: 50 });
let working = false;

// פונקציית עדכון תצוגה
function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("debt-ui").innerText = Math.floor(debt).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.body.className = theme + "-theme";
    save();
}

// ניווט וטאבים
function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        const items = [...mySkills.map(s=>`🎓 ${s}`), ...myInventory.map(i=>`${i.i} ${i.n}`), ...myProperties.map(p=>`${p.i} ${p.n}`)].map(t=>`<span class="tag">${t}</span>`).join("");
        c.innerHTML = `
        <div class="card home-grid">
            <div class="stat-box">⭐ רמה: <b>${level}</b></div>
            <div class="stat-box">🎭 מוניטין: <b>${rep}</b></div>
            <div class="stat-box">🏢 עסקים: <b>${myBusiness.length}</b></div>
            <div class="stat-box">🎯 משימה: <b>${currentTaskId + 1}</b></div>
        </div>
        <div class="card"><h4>🎒 רכוש וכישורים:</h4><div class="inv-list">${items || 'ריק...'}</div></div>
        <div class="card"><small>XP: ${xp}%</small><div class="xpbar"><div id="xpfill" style="width:${xp}%"></div></div></div>`;
    }
    else if (tab === 'work') {
        const works = [
            { n: "שוטף כלים", p: 130, t: 4, x: 15, r: 1, req: null },
            { n: "נהג מונית", p: 400, t: 7, x: 40, r: 4, req: "רישיון נהיגה" },
            { n: "מאבטח", p: 950, t: 12, x: 80, r: 8, req: "רישיון נשק" },
            { n: "שוטר", p: 1800, t: 15, x: 150, r: 20, req: "כושר קרבי" }
        ];
        c.innerHTML = `<h3>💼 עבודה</h3><div class="xpbar"><div id="wb" style="width:0%"></div></div><div class="grid-2"></div>`;
        works.forEach(w => {
            const locked = w.req && !mySkills.includes(w.req);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card"><b>${w.n}</b><br>${w.p}₪<button class="action ${locked?'disabled':''}" onclick="runWork(${w.p},${w.t},${w.x},${w.r})">${locked?'🔒':'+'}</button></div>`;
        });
    }
    else if (tab === 'stock') {
        c.innerHTML = `<h3>💹 בורסה</h3><div id="stock-list"></div>`;
        Object.keys(myStocks).forEach(s => {
            c.querySelector("#stock-list").innerHTML += `<div class="card">
                <b>${s.toUpperCase()}</b>: <span id="price-${s}">${stockPrices[s]}</span>₪ (שלך: ${myStocks[s]})<br>
                <div class="grid-2" style="padding:0; margin-top:10px;">
                    <button class="action" onclick="trade('${s}','buy')">קנה</button>
                    <button class="action" style="background:#475569" onclick="trade('${s}','sell')">מכור</button>
                </div>
            </div>`;
        });
    }
    else if (tab === 'tasks') {
        const tasks = Array.from({length:20}, (_,i)=>({g:(i+1)*15, p:(i+1)*4000}));
        const t = tasks[currentTaskId] || {g:999, p:0};
        c.innerHTML = `<div class="card"><h3>🎯 משימה ${currentTaskId+1}</h3><p>בצע ${t.g} עבודות</p>
        <p>התקדמות: ${totalWorkDone}/${t.g}</p>
        <button class="action ${totalWorkDone < t.g ? 'disabled' : ''}" onclick="claimTask(${t.p})">קבל ${t.p}₪</button></div>`;
    }
    else if (tab === 'market') {
        const mkt = [{n:"אייפון 15", c:4500, r:10, i:"📱"}, {n:"רולקס", c:50000, r:200, i:"⌚"}, {n:"רכב ספורט", c:250000, r:500, i:"🏎️"}];
        c.innerHTML = `<div class="grid-2"></div>`;
        mkt.forEach(m => {
            const has = myInventory.find(x => x.n === m.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card">${m.i} <b>${m.n}</b><br>${m.c}₪<button class="action ${has?'disabled':''}" onclick="buyMarket('${m.n}',${m.c},${m.r},'${m.i}')">${has?'✔️':'קנה'}</button></div>`;
        });
    }
    else if (tab === 'business') {
        const bz = [{n:"פלאפל", c:7000, inc:500, i:"🧆", t:30}, {n:"הייטק", c:2000000, inc:90000, i:"💻", t:300}];
        bz.forEach(b => {
            const owned = myBusiness.find(x => x.n === b.n);
            c.innerHTML += `<div class="card">${b.i} <b>${b.n}</b><br>
            ${owned ? `<div class="cooldown-bar"><div id="cb-${b.n}" style="width:100%"></div></div><button id="bb-${b.n}" class="action" onclick="manageBusiness('${b.n}',${b.inc},${b.t})">אסוף רווח</button>` : 
            `<button class="action" onclick="buyBusiness('${b.n}',${b.c},${b.inc},'${b.i}',${b.t})">פתח ב-${b.c}₪</button>`}</div>`;
        });
    }
    else if (tab === 'realestate') {
        const est = [{n:"דירה", c:300000, p:2500, i:"🏠"}, {n:"בניין", c:5000000, p:55000, i:"🏙️"}];
        c.innerHTML = `<div class="grid-2"></div>`;
        est.forEach(e => {
            const has = myProperties.find(p => p.n === e.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card">${e.i} <b>${e.n}</b><br>+${e.p}₪<button class="action ${has?'disabled':''}" onclick="buyProp('${e.n}',${e.c},${e.p},'${e.i}')">${has?'✔️':'קנה'}</button></div>`;
        });
    }
    else if (tab === 'skills') {
        const sks = [{n:"רישיון נהיגה", c:5000}, {n:"רישיון נשק", c:8000}, {n:"כושר קרבי", c:15000}];
        c.innerHTML = `<div class="grid-2"></div>`;
        sks.forEach(s => {
            const has = mySkills.includes(s.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card"><b>${s.n}</b><br>${s.c}₪<button class="action ${has?'disabled':''}" onclick="buySkill('${s.n}',${s.c})">${has?'✔️':'למד'}</button></div>`;
        });
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input id="bAmt" type="number" placeholder="סכום"><button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button></div>`;
    }
    else if (tab === 'install') {
        c.innerHTML = `<div class="card"><h3>📲 התקנה</h3><p>לחץ על "הוסף למסך הבית" בדפדפן.</p></div>`;
    }
}

// לוגיקת פעולות
function runWork(p, t, x, r) {
    if (working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => { s++; if(bar) bar.style.width=(s/t*100)+"%"; if(s>=t){ clearInterval(i); working=false; money+=p; rep+=r; totalWorkDone++; addXP(x); updateUI(); openTab('work'); }}, 1000);
}
function addXP(v) { xp+=v; if(xp>=100){ xp-=100; level++; } updateUI(); }
function claimTask(p) { money+=p; currentTaskId++; updateUI(); openTab('tasks'); }
function buyMarket(n,c,r,i) { if(money>=c){ money-=c; rep+=r; myInventory.push({n,i}); updateUI(); openTab('market'); }}
function buyProp(n,c,p,i) { if(money>=c){ money-=c; myProperties.push({n,i}); passive+=p; updateUI(); openTab('realestate'); }}
function buySkill(n,c) { if(money>=c){ money-=c; mySkills.push(n); updateUI(); openTab('skills'); }}
function buyBusiness(n,c,inc,i,t) { if(money>=c){ money-=c; myBusiness.push({n,inc,icon:i,t}); updateUI(); openTab('business'); }}
function manageBusiness(n, inc, time) {
    const btn = document.getElementById(`bb-${n}`), bar = document.getElementById(`cb-${n}`);
    if(btn.classList.contains('disabled')) return;
    money+=inc; btn.classList.add('disabled'); let s=0;
    let i = setInterval(() => { s++; bar.style.width=(s/time*100)+"%"; if(s>=time){ clearInterval(i); btn.classList.remove('disabled'); bar.style.width="100%"; }}, 1000);
    updateUI();
}
function bankOp(t) { let a=Number(document.getElementById("bAmt").value); if(t==='dep'&&money>=a){money-=a;bank+=a;}else if(t==='wit'&&bank>=a){bank-=a;money+=a;} updateUI(); }
function trade(s, a) { let p=stockPrices[s]; if(a==='buy'&&money>=p){money-=p;myStocks[s]++;}else if(a==='sell'&&myStocks[s]>0){money+=p;myStocks[s]--;} updateUI(); openTab('stock'); }

// לופים ועדכונים
setInterval(() => { if(passive>0){ money+=(passive/10); updateUI(); }}, 1000);
setInterval(() => { Object.keys(stockPrices).forEach(s => { stockPrices[s] += Math.floor(Math.random()*10-5); if(stockPrices[s]<5) stockPrices[s]=5; }); if(document.getElementById("price-tech")) openTab('stock'); }, 10000);

function toggleTheme() { theme=(theme==='dark'?'light':'dark'); updateUI(); }
const resetGame = () => { if(confirm("לאפס?")) { localStorage.clear(); location.reload(); }};
const checkUpdate = () => location.reload(true);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
