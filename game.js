const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };
const save = () => {
    const d = { money, bank, xp, level, rep, passive, totalWorkDone, theme, myProperties, mySkills, myBusiness, currentTaskId, stockPrices, myStocks, myInventory, lastDaily, loan };
    Object.keys(d).forEach(k => localStorage.setItem(k, JSON.stringify(d[k])));
};

let money = load('money', 2000), bank = load('bank', 0), xp = load('xp', 0), level = load('level', 1);
let rep = load('rep', 0), passive = load('passive', 0), totalWorkDone = load('totalWorkDone', 0);
let theme = load('theme', 'dark'), currentTaskId = load('currentTaskId', 0), loan = load('loan', 0);
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

function floatMoney(e, amt) {
    const el = document.createElement("div"); el.className = "floating-money";
    el.innerText = (amt > 0 ? "+" : "") + amt + "₪";
    const x = e.clientX || window.innerWidth/2, y = e.clientY || window.innerHeight/2;
    el.style.left = `${x}px`; el.style.top = `${y}px`;
    document.body.appendChild(el); setTimeout(() => el.remove(), 800);
}

function showEvent(m, t) {
    const b = document.getElementById("status-bar"); const s = document.getElementById("msg-text");
    s.innerText = m; b.className = t; setTimeout(() => { b.className = ''; s.innerText = "Smart Money AI v4.4.2"; }, 6000);
}

function scheduleEvent() {
    const time = Math.floor(Math.random() * (300000 - 120000 + 1)) + 120000;
    setTimeout(() => {
        const evs = [
            {m:"ירושה מדוד רחוק! 15,000₪+", v:15000, t:'event-positive'},
            {m:"גנבו לך את הארנק! 1,200₪-", v:-1200, t:'event-negative'},
            {m:"בונוס חג מהעבודה! 3,500₪+", v:3500, t:'event-positive'},
            {m:"השקעה כושלת בשוק: 5,000₪-", v:-5000, t:'event-negative'}
        ];
        const e = evs[Math.floor(Math.random()*evs.length)];
        money += e.v; updateUI(); showEvent(e.m, e.t); scheduleEvent();
    }, time);
}

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        const canDaily = Date.now() - lastDaily > 86400000;
        const inv = [...mySkills.map(s=>`🎓 ${s}`), ...myInventory.map(i=>`${i.i} ${i.n}`), ...myProperties.map(p=>`${p.i} ${p.n} (L${p.lvl})`)].map(t=>`<span class="tag">${t}</span>`).join("");
        c.innerHTML = `<div class="card">⭐ רמה: ${level} | 🎭 מוניטין: ${rep}</div>
        <div class="card"><small>XP: ${xp}%</small><div class="xpbar"><div id="xpfill" style="width:${xp}%"></div></div>
        <button class="action ${!canDaily?'disabled':''}" style="background:var(--green)" onclick="claimDaily()">🎁 מתנה יומית (5,000₪)</button></div>
        <div class="card"><h4>🎒 רכוש וכישורים:</h4>${inv || 'אין כלום'}</div>`;
    }
    else if (tab === 'work') {
        const wks = [
            {n:"שליח", p:160, t:4, i:"🛵"}, {n:"מאבטח", p:1100, t:10, i:"🛡️", s:"רישיון נשק"},
            {n:"נהג מונית", p:1800, t:12, i:"🚕", s:"רישיון נהיגה"}, {n:"מתכנת", p:5500, t:25, i:"💻", s:"קורס AI"},
            {n:"סוכן נדל\"ן", p:12000, t:40, i:"🏢", s:"ניהול"}, {n:"יהלומן", p:45000, t:90, i:"💎", s:"מומחה שוק"}
        ];
        c.innerHTML = `<div class="xpbar"><div id="wb" style="width:0%"></div></div><div class="grid-2"></div>`;
        wks.forEach(w => {
            const l = w.s && !mySkills.includes(w.s);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card"><b>${w.i} ${w.n}</b><br>${w.p}₪<button class="action ${l?'disabled':''}" onclick="runWork(event,${w.p},${w.t},25,10)">${l?'🔒':'לעבודה'}</button></div>`;
        });
    }
    else if (tab === 'realestate') {
        const est = [
            {n:"מחסן", c:30000, p:300, i:"📦"}, {n:"חניה", c:75000, p:800, i:"🅿️"},
            {n:"דירה", c:550000, p:4800, i:"🏠"}, {n:"וילה", c:3500000, p:35000, i:"🏡"},
            {n:"פנטהאוז", c:8000000, p:90000, i:"🏙️"}, {n:"בניין", c:25000000, p:280000, i:"🏢"}
        ];
        c.innerHTML = `<div class="grid-2"></div>`;
        est.forEach(e => {
            const p = myProperties.find(x => x.n === e.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card">${e.i} <b>${e.n}</b><br>${p?`+${Math.floor(p.p)}₪`:`${e.c}₪`}<button class="action ${p?'upgrade-btn':''}" onclick="${p?`upgradeProp('${e.n}',${Math.floor(e.c*0.4)})`:`buyProp('${e.n}',${e.c},${e.p},'${e.i}')`}">${p?'שדרג':'קנה'}</button></div>`;
        });
    }
    else if (tab === 'market') {
        const items = [
            {n:"אייפון", c:6200, i:"📱"}, {n:"מחשב", c:11000, i:"💻"}, {n:"זהב", c:35000, i:"🪙"},
            {n:"רכב", c:190000, i:"🚗"}, {n:"ג'יפ", c:450000, i:"🚙"}, {n:"שעון", c:85000, i:"⌚"},
            {n:"סירה", c:950000, i:"🚤"}, {n:"מטיל זהב", c:1500000, i:"🧱"}, {n:"אי פרטי", c:120000000, i:"🏝️"}
        ];
        c.innerHTML = `<div class="grid-2"></div>`;
        items.forEach(m => {
            const has = myInventory.find(x => x.n === m.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card">${m.i} <b>${m.n}</b><br>${m.c}₪<button class="action ${has?'disabled':''}" onclick="buyMarket('${m.n}',${m.c},20,'${m.i}')">${has?'✔️':'קנה'}</button></div>`;
        });
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק והלוואות</h3>
        <input id="bAmt" type="number" placeholder="סכום">
        <div class="grid-2" style="padding:0"><button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button></div>
        <div class="loan-box">
            <p>חוב נוכחי: <b>${loan}₪</b></p>
            <button class="action" style="background:var(--purple)" onclick="takeLoan()">קח הלוואה (10,000₪)</button>
            <button class="action" style="background:var(--main)" onclick="payLoan()">החזר הלוואה (10,000₪)</button>
        </div></div>`;
    }
}

// לוגיקה חדשה
function takeLoan() { if(loan < 50000) { loan += 10000; money += 10000; showEvent("הלוואה אושרה!", "event-positive"); updateUI(); openTab('bank'); } else { alert("חרגת מגבול ההלוואה!"); } }
function payLoan() { if(money >= 10000 && loan > 0) { money -= 10000; loan -= 10000; updateUI(); openTab('bank'); } }

function runWork(e, p, t, x, r) { if(working) return; working=true; let s=0; const b=document.getElementById("wb"); let i=setInterval(()=>{s++; if(b) b.style.width=(s/t*100)+"%"; if(s>=t){clearInterval(i); working=false; money+=p; totalWorkDone++; addXP(x); floatMoney(e, p); updateUI(); openTab('work');}}, 1000); }
function addXP(v) { xp+=v; if(xp>=100){ xp-=100; level++; money+=level*2000; showEvent("עלית רמה!", "event-positive"); } updateUI(); }
function bankOp(t) { let a=Number(document.getElementById("bAmt").value); if(t==='dep'&&money>=a){money-=a;bank+=a;}else if(t==='wit'&&bank>=a){bank-=a;money+=a;} updateUI(); }
function buyProp(n,c,p,i) { if(money>=c){ money-=c; myProperties.push({n,i,p,lvl:1}); passive+=p; updateUI(); openTab('realestate'); }}
function upgradeProp(n, cost) { if(money>=cost){ money-=cost; const p=myProperties.find(x=>x.n===n); const old=p.p; p.lvl++; p.p*=1.35; passive+=(p.p-old); updateUI(); openTab('realestate'); }}
function buyMarket(n,c,r,i) { if(money>=c){ money-=c; myInventory.push({n,i}); rep+=r; updateUI(); openTab('market'); }}
function buySkill(n,c) { if(money>=c){ money-=c; mySkills.push(n); updateUI(); openTab('skills'); }}
function trade(e, s, a) { let p=stockPrices[s]; if(a==='buy'&&money>=p){money-=p;myStocks[s]++;}else if(a==='sell'&&myStocks[s]>0){money+=p;myStocks[s]--;} updateUI(); openTab('stock'); }
function claimDaily() { if(Date.now()-lastDaily > 86400000){ money+=5000; lastDaily=Date.now(); updateUI(); openTab('home'); }}
function toggleTheme() { theme=(theme==='dark'?'light':'dark'); updateUI(); openTab('home'); }
function resetGame() { if(confirm("לאפס הכל?")) { localStorage.clear(); location.reload(); } }

// לופים ברקע
setInterval(() => { 
    if(passive>0) money += (passive/10); 
    if(loan>0) { money -= (loan * 0.001); if(money < 0) money = 0; } // ריבית דקה
    updateUI(); 
}, 1000);

setInterval(() => { Object.keys(stockPrices).forEach(s => { stockPrices[s] += Math.floor(Math.random()*60-30); if(stockPrices[s]<10) stockPrices[s]=10; }); }, 10000);

document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); scheduleEvent(); });
