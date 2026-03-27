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

// אפקט טקסט צף
function floatMoney(e, amt) {
    const el = document.createElement("div");
    el.className = "floating-money";
    el.innerText = `+${amt}₪`;
    el.style.left = `${e.clientX || window.innerWidth/2}px`;
    el.style.top = `${e.clientY || window.innerHeight/2}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

function showEvent(m, t) {
    const b = document.getElementById("status-bar");
    const s = document.getElementById("msg-text");
    s.innerText = m; b.className = t;
    setTimeout(() => { b.className = ''; s.innerText = "Smart Money AI v4.4"; }, 6000);
}

function scheduleEvent() {
    const time = Math.floor(Math.random() * (300000 - 120000 + 1)) + 120000;
    setTimeout(() => {
        const evs = [
            {m:"זכית בהגרלה מקומית! 2,500₪+", v:2500, t:'event-positive'},
            {m:"תיקון פנצ'ר באוטו: 350₪-", v:-350, t:'event-negative'},
            {m:"מצאת שטר של 200₪ ברחוב!", v:200, t:'event-positive'},
            {m:"קנס על רעש: 500₪-", v:-500, t:'event-negative'}
        ];
        const e = evs[Math.floor(Math.random()*evs.length)];
        money += e.v; updateUI(); showEvent(e.m, e.t);
        scheduleEvent();
    }, time);
}

function openTab(tab) {
    const c = document.getElementById("content");
    c.classList.remove("fade-in");
    setTimeout(() => {
        c.classList.add("fade-in");
        renderTab(tab);
    }, 10);
}

function renderTab(tab) {
    const c = document.getElementById("content");
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    c.innerHTML = "";

    if (tab === 'home') {
        const canDaily = Date.now() - lastDaily > 86400000;
        const inv = [...mySkills.map(s=>`🎓 ${s}`), ...myInventory.map(i=>`${i.i} ${i.n}`), ...myProperties.map(p=>`${p.i} ${p.n} (L${p.lvl})`)].map(t=>`<span class="tag">${t}</span>`).join("");
        c.innerHTML = `
        <div class="card home-grid"><div class="stat-box">⭐ רמה: ${level}</div><div class="stat-box">🎭 מוניטין: ${rep}</div></div>
        <div class="card">
            <small>ניסיון: ${xp}%</small><div class="xpbar"><div id="xpfill" style="width:${xp}%"></div></div>
            <button class="action ${!canDaily?'disabled':''}" style="background:var(--green)" onclick="claimDaily()">🎁 מתנה יומית (5,000₪)</button>
        </div>
        <div class="card"><h4>🎒 רכוש:</h4><div class="inv-list">${inv || 'אין פריטים'}</div></div>`;
    }
    else if (tab === 'work') {
        const wks = [{n:"שליח", p:160, t:4, i:"🛵"}, {n:"מאבטח", p:1100, t:10, i:"🛡️", s:"רישיון נשק"}, {n:"מתכנת", p:5500, t:25, i:"💻", s:"קורס AI"}];
        c.innerHTML = `<div class="xpbar"><div id="wb" style="width:0%"></div></div><div class="grid-2"></div>`;
        wks.forEach(w => {
            const l = w.s && !mySkills.includes(w.s);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card"><b>${w.i} ${w.n}</b><br>${w.p}₪<button class="action ${l?'disabled':''}" onclick="runWork(event,${w.p},${w.t},25,5)">${l?'🔒':'לעבודה'}</button></div>`;
        });
    }
    else if (tab === 'business') {
        const bzs = [{n:"דוכן פלאפל", c:15000, inc:1200, i:"🧆", t:45}, {n:"קיוסק", c:35000, inc:2500, i:"🏪", t:70}, {n:"סוכנות רכב", c:850000, inc:35000, i:"🏎️", t:240}];
        c.innerHTML = `<div class="grid-2"></div>`;
        bzs.forEach(b => {
            const owned = myBusiness.find(x => x.n === b.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card">${b.i} <b>${b.n}</b><br>${owned?`<button id="bb-${b.n}" class="action" onclick="manageBusiness(event,'${b.n}',${b.inc},${b.t})">אסוף רווח</button>`:`<button class="action" onclick="buyBusiness('${b.n}',${b.c},${b.inc},'${b.i}',${b.t})">${b.c}₪</button>`}</div>`;
        });
    }
    else if (tab === 'realestate') {
        const est = [{n:"מחסן", c:30000, p:300, i:"📦"}, {n:"דירה", c:500000, p:4500, i:"🏠"}, {n:"וילה", c:3000000, p:32000, i:"🏡"}];
        c.innerHTML = `<div class="grid-2"></div>`;
        est.forEach(e => {
            const p = myProperties.find(x => x.n === e.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card">${e.i} <b>${e.n}</b><br>${p?`+${Math.floor(p.p)}₪`:`${e.c}₪`}<button class="action ${p?'upgrade-btn':''}" onclick="${p?`upgradeProp('${e.n}',${Math.floor(e.c*0.4)})`:`buyProp('${e.n}',${e.c},${e.p},'${e.i}')`}">${p?'שדרג':'קנה'}</button></div>`;
        });
    }
    else if (tab === 'market') {
        const items = [{n:"אייפון", c:5800, i:"📱"}, {n:"מחשב", c:9500, i:"💻"}, {n:"אופנוע", c:45000, i:"🏍️"}, {n:"רכב", c:180000, i:"🚗"}, {n:"זהב", c:30000, i:"🪙"}, {n:"שעון יוקרה", c:75000, i:"⌚"}, {n:"סירה", c:850000, i:"🚤"}, {n:"ג'יפ", c:420000, i:"🚙"}, {n:"וילה ביוון", c:2500000, i:"🇬🇷"}, {n:"מטוס פרטי", c:55000000, i:"🛩️"}];
        c.innerHTML = `<div class="grid-2"></div>`;
        items.forEach(m => {
            const has = myInventory.find(x => x.n === m.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card">${m.i} <b>${m.n}</b><br>${m.c}₪<button class="action ${has?'disabled':''}" onclick="buyMarket('${m.n}',${m.c},15,'${m.i}')">${has?'✔️':'קנה'}</button></div>`;
        });
    }
    else if (tab === 'stock') {
        c.innerHTML = `<div class="grid-2"></div>`;
        Object.keys(myStocks).forEach(s => {
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card"><b>${s.toUpperCase()}</b><br>${stockPrices[s]}₪<br><div class="grid-2" style="padding:0;gap:4px;"><button class="action" onclick="trade(event,'${s}','buy')">קנה</button><button class="action" style="background:#475569" onclick="trade(event,'${s}','sell')">מכור</button></div></div>`;
        });
    }
}

// פונקציות לוגיקה
function runWork(e, p, t, x, r) { if(working) return; working=true; let s=0; const b=document.getElementById("wb"); let i=setInterval(()=>{s++; if(b) b.style.width=(s/t*100)+"%"; if(s>=t){clearInterval(i); working=false; money+=p; rep+=r; totalWorkDone++; addXP(x); floatMoney(e, p); updateUI(); openTab('work');}}, 1000); }
function addXP(v) { xp+=v; if(xp>=100){ xp-=100; level++; money+=level*2000; document.body.classList.add("level-up-flash"); setTimeout(()=>document.body.classList.remove("level-up-flash"),500); showEvent("עלית רמה!", "event-positive"); } updateUI(); }
function buyProp(n,c,p,i) { if(money>=c){ money-=c; myProperties.push({n,i,p,lvl:1}); passive+=p; updateUI(); openTab('realestate'); }}
function upgradeProp(n, cost) { if(money>=cost){ money-=cost; const p=myProperties.find(x=>x.n===n); const old=p.p; p.lvl++; p.p*=1.3; passive+=(p.p-old); updateUI(); openTab('realestate'); }}
function buyMarket(n,c,r,i) { if(money>=c){ money-=c; rep+=r; myInventory.push({n,i}); updateUI(); openTab('market'); }}
function buySkill(n,c) { if(money>=c){ money-=c; mySkills.push(n); updateUI(); openTab('skills'); }}
function buyBusiness(n,c,inc,i,t) { if(money>=c){ money-=c; myBusiness.push({n,inc,icon:i,t}); updateUI(); openTab('business'); }}
function manageBusiness(e, n, inc, time) { const btn=document.getElementById(`bb-${n}`); if(btn.classList.contains('disabled')) return; money+=inc; floatMoney(e, inc); btn.classList.add('disabled'); setTimeout(()=>btn.classList.remove('disabled'), time*1000); updateUI(); }
function bankOp(t) { let a=Number(document.getElementById("bAmt").value); if(t==='dep'&&money>=a){money-=a;bank+=a;}else if(t==='wit'&&bank>=a){bank-=a;money+=a;} updateUI(); }
function trade(e, s, a) { let p=stockPrices[s]; if(a==='buy'&&money>=p){money-=p;myStocks[s]++; floatMoney(e, -p);}else if(a==='sell'&&myStocks[s]>0){money+=p;myStocks[s]--; floatMoney(e, p);} updateUI(); openTab('stock'); }
function claimDaily() { if(Date.now()-lastDaily > 86400000){ money+=5000; lastDaily=Date.now(); updateUI(); openTab('home'); }}
function toggleTheme() { theme=(theme==='dark'?'light':'dark'); updateUI(); openTab('home'); }

setInterval(() => { if(passive>0){ money+=(passive/10); updateUI(); }}, 1000);
setInterval(() => { Object.keys(stockPrices).forEach(s => { stockPrices[s] += Math.floor(Math.random()*40-20); if(stockPrices[s]<1) stockPrices[s]=1; }); }, 8000);

document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); scheduleEvent(); });
