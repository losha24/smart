const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };
const save = () => {
    const d = { money, bank, xp, level, rep, passive, totalWorkDone, theme, myProperties, mySkills, myBusiness, currentTaskId, stockPrices, myStocks, myInventory, lastDaily };
    Object.keys(d).forEach(k => localStorage.setItem(k, JSON.stringify(d[k])));
};

let money = load('money', 2000), bank = load('bank', 0), xp = load('xp', 0), level = load('level', 1);
let rep = load('rep', 0), passive = load('passive', 0), totalWorkDone = load('totalWorkDone', 0);
let theme = load('theme', 'dark'), currentTaskId = load('currentTaskId', 0);
let myProperties = load('myProperties', []), mySkills = load('mySkills', []), myBusiness = load('myBusiness', []);
let myInventory = load('myInventory', []), myStocks = load('myStocks', { tech: 0, gold: 0, ai: 0, crypto: 0 });
let stockPrices = load('stockPrices', { tech: 120, gold: 1850, ai: 310, crypto: 42000 });
let lastDaily = load('lastDaily', 0), working = false;

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.getElementById("rep-ui").innerText = rep;
    document.body.className = theme + "-theme";
    save();
}

function showEvent(m, t) {
    const b = document.getElementById("status-bar");
    const s = document.getElementById("msg-text");
    s.innerText = m; b.className = t;
    setTimeout(() => { b.className = ''; s.innerText = "Smart Money AI v4.3"; }, 6000);
}

// אירועים כל 2-5 דקות
function scheduleEvent() {
    const time = Math.floor(Math.random() * (300000 - 120000 + 1)) + 120000;
    setTimeout(() => {
        const evs = [
            {m:"מצאת כרטיס גירוד! זכית ב-1,500₪", v:1500, t:'event-positive'},
            {m:"דוח מהירות במנהרות: 750₪-", v:-750, t:'event-negative'},
            {m:"השקעה ב-AI הניבה רווח של 5,000₪", v:5000, t:'event-positive'},
            {m:"הכלב אכל את הכבל של המחשב: 400₪-", v:-400, t:'event-negative'}
        ];
        const e = evs[Math.floor(Math.random()*evs.length)];
        money += e.v; updateUI(); showEvent(e.m, e.t);
        scheduleEvent();
    }, time);
}

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        const canDaily = Date.now() - lastDaily > 86400000;
        const inv = [...mySkills.map(s=>`🎓 ${s}`), ...myInventory.map(i=>`${i.i} ${i.n}`), ...myProperties.map(p=>`${p.i} ${p.n} (L${p.lvl})`)].map(t=>`<span class="tag">${t}</span>`).join("");
        c.innerHTML = `
        <div class="card home-grid"><div class="stat-box">⭐ רמה: ${level}</div><div class="stat-box">🎭 מוניטין: ${rep}</div></div>
        <div class="card">
            <small>ניסיון: ${xp}%</small><div class="xpbar"><div id="xpfill" style="width:${xp}%"></div></div>
            <button class="action ${!canDaily?'disabled':''}" style="background:#10b981" onclick="claimDaily()">🎁 קבל מתנה יומית</button>
        </div>
        <div class="card"><h4>🎒 רכוש שלי:</h4><div class="inv-list">${inv || 'אין רכוש'}</div></div>`;
    }
    else if (tab === 'work') {
        const wks = [
            {n:"שליח", p:160, t:4, i:"🛵"}, {n:"מאבטח", p:1100, t:10, i:"🛡️", s:"רישיון נשק"},
            {n:"שוטר", p:2200, t:15, i:"🚓", s:"כושר קרבי"}, {n:"מתכנת", p:5000, t:25, i:"💻", s:"קורס AI"},
            {n:"מנהל", p:9500, t:40, i:"👔", s:"ניהול"}
        ];
        c.innerHTML = `<div class="xpbar"><div id="wb" style="width:0%"></div></div><div class="grid-2"></div>`;
        wks.forEach(w => {
            const l = w.s && !mySkills.includes(w.s);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card"><b>${w.i} ${w.n}</b><br>${w.p}₪<button class="action ${l?'disabled':''}" onclick="runWork(${w.p},${w.t},20,5)">${l?'🔒':'לעבודה'}</button></div>`;
        });
    }
    else if (tab === 'business') {
        const bzs = [{n:"דוכן פלאפל", c:12000, inc:900, i:"🧆", t:40}, {n:"קיוסק", c:25000, inc:1800, i:"🏪", t:60}, {n:"הייטק", c:1000000, inc:45000, i:"🚀", t:300}];
        c.innerHTML = `<div class="grid-2"></div>`;
        bzs.forEach(b => {
            const owned = myBusiness.find(x => x.n === b.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card">${b.i} <b>${b.n}</b><br>${owned?`<div class="cooldown-bar"><div id="cb-${b.n}"></div></div><button id="bb-${b.n}" class="action" onclick="manageBusiness('${b.n}',${b.inc},${b.t})">אסוף</button>`:`<button class="action" onclick="buyBusiness('${b.n}',${b.c},${b.inc},'${b.i}',${b.t})">${b.c}₪</button>`}</div>`;
        });
    }
    else if (tab === 'realestate') {
        const est = [{n:"מחסן", c:25000, p:250, i:"📦"}, {n:"חניה", c:60000, p:600, i:"🅿️"}, {n:"דירה", c:450000, p:4200, i:"🏠"}, {n:"וילה", c:2800000, p:28000, i:"🏡"}];
        c.innerHTML = `<div class="grid-2"></div>`;
        est.forEach(e => {
            const p = myProperties.find(x => x.n === e.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card">${e.i} <b>${e.n}</b><br>${p?`+${Math.floor(p.p)}₪`:`${e.c}₪`}<button class="action ${p?'upgrade-btn':''}" onclick="${p?`upgradeProp('${e.n}',${Math.floor(e.c*0.4)})`:`buyProp('${e.n}',${e.c},${e.p},'${e.i}')`}">${p?'שדרג':'קנה'}</button></div>`;
        });
    }
    else if (tab === 'market') {
        const items = [{n:"אייפון", c:5500, i:"📱"}, {n:"מחשב", c:9000, i:"💻"}, {n:"אופנוע", c:40000, i:"🏍️"}, {n:"רכב", c:160000, i:"🚗"}, {n:"שעון", c:60000, i:"⌚"}, {n:"סירה", c:700000, i:"🚤"}, {n:"זהב", c:25000, i:"🪙"}, {n:"טלוויזיה", c:12000, i:"📺"}, {n:"ג'יפ", c:350000, i:"🚙"}, {n:"מטוס", c:40000000, i:"🛩️"}];
        c.innerHTML = `<div class="grid-2"></div>`;
        items.forEach(m => {
            const has = myInventory.find(x => x.n === m.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card">${m.i} <b>${m.n}</b><br>${m.c}₪<button class="action ${has?'disabled':''}" onclick="buyMarket('${m.n}',${m.c},10,'${m.i}')">${has?'✔️':'קנה'}</button></div>`;
        });
    }
    else if (tab === 'stock') {
        c.innerHTML = `<div class="grid-2"></div>`;
        Object.keys(myStocks).forEach(s => {
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card"><b>${s.toUpperCase()}</b><br>${stockPrices[s]}₪<br><button class="action" onclick="trade('${s}','buy')">קנה</button><button class="action" style="background:#475569" onclick="trade('${s}','sell')">מכור</button></div>`;
        });
    }
    else if (tab === 'skills') {
        const sks = [{n:"רישיון נהיגה", c:5000}, {n:"רישיון נשק", c:9000}, {n:"קורס AI", c:28000}, {n:"ניהול", c:50000}];
        c.innerHTML = `<div class="grid-2"></div>`;
        sks.forEach(s => {
            const has = mySkills.includes(s.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card"><b>${s.n}</b><br>${s.c}₪<button class="action ${has?'disabled':''}" onclick="buySkill('${s.n}',${s.c})">${has?'✔️':'למד'}</button></div>`;
        });
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input id="bAmt" type="number" placeholder="סכום"><button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button></div>`;
    }
}

// Logic functions
function toggleTheme() { theme = (theme==='dark'?'light':'dark'); updateUI(); openTab('home'); }
function runWork(p, t, x, r) { if(working) return; working=true; let s=0; const b=document.getElementById("wb"); let i=setInterval(()=>{s++; if(b) b.style.width=(s/t*100)+"%"; if(s>=t){clearInterval(i); working=false; money+=p; rep+=r; totalWorkDone++; addXP(x); updateUI(); openTab('work');}}, 1000); }
function addXP(v) { xp+=v; if(xp>=100){ xp-=100; level++; money+=level*1500; showEvent("עלית רמה! בונוס הופקד.", "event-positive"); } updateUI(); }
function buyProp(n,c,p,i) { if(money>=c){ money-=c; myProperties.push({n,i,p,lvl:1}); passive+=p; updateUI(); openTab('realestate'); }}
function upgradeProp(n, cost) { if(money>=cost){ money-=cost; const p=myProperties.find(x=>x.n===n); const old=p.p; p.lvl++; p.p*=1.25; passive+=(p.p-old); updateUI(); openTab('realestate'); }}
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

setInterval(() => { if(passive>0){ money+=(passive/10); updateUI(); }}, 1000);
setInterval(() => { Object.keys(stockPrices).forEach(s => { stockPrices[s] += Math.floor(Math.random()*40-20); if(stockPrices[s]<1) stockPrices[s]=1; }); if(document.getElementById("btnStock").classList.contains('active')) openTab('stock'); }, 8000);

document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); scheduleEvent(); });
