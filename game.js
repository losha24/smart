const VERSION = "3.8";
let working = false;

// טעינה ושמירה
const load = (k, d) => { try { return localStorage[k] ? JSON.parse(localStorage[k]) : d; } catch { return d; } };
const save = () => {
    const data = { money, bank, xp, level, rep, passive, totalWorkDone, debt, theme, myProperties, mySkills, myBusiness, currentTaskId, stockPrices, myStocks };
    for (let k in data) localStorage[k] = JSON.stringify(data[k]);
};

// משתני משחק
let money = load('money', 1500), bank = load('bank', 0), xp = load('xp', 0), level = load('level', 1);
let rep = load('rep', 0), passive = load('passive', 0), totalWorkDone = load('totalWorkDone', 0);
let debt = load('debt', 0), theme = load('theme', 'dark'), currentTaskId = load('currentTaskId', 0);
let myProperties = load('myProperties', []), mySkills = load('mySkills', []), myBusiness = load('myBusiness', []);
let myStocks = load('myStocks', { tech: 0, reit: 0, crypto: 0 });
let stockPrices = load('stockPrices', { tech: 100, reit: 250, crypto: 50 });

// נתוני עבודה (שחזור מ-3.6)
const worksData = [
    { id: "c", n: "שוטף כלים", p: 130, t: 4, x: 15, r: 1, req: null },
    { id: "t", n: "נהג מונית", p: 350, t: 6, x: 30, r: 3, req: "רישיון נהיגה" },
    { id: "g", n: "מאבטח", p: 800, t: 10, x: 70, r: 5, req: "רישיון נשק" },
    { id: "tc", n: "טכנאי רשתות", p: 1800, t: 15, x: 150, r: 10, req: "קורס טכנאי" },
    { id: "m", n: "מנהל קמפיינים", p: 4200, t: 25, x: 300, r: 25, req: "שיווק שותפים" },
    { id: "cy", n: "אנליסט סייבר", p: 9500, t: 45, x: 800, r: 60, req: "ניהול מערכות" }
];

// נתוני נדל"ן (שחזור מ-3.6)
const estateData = [
    { n: "מחסן", c: 12000, p: 100, i: "📦" },
    { n: "דירה", c: 180000, p: 1500, i: "🏠" },
    { n: "בניין", c: 3000000, p: 35000, i: "🏙️" },
    { n: "קניון", c: 12000000, p: 150000, i: "🏬" }
];

// 20 משימות
const tasksData = Array.from({length: 20}, (_, i) => ({
    n: `משימה ${i+1}`, g: (i+1)*10, p: (i+1)*3000, d: `בצע ${(i+1)*10} עבודות`
}));

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

function toggleTheme() {
    theme = (theme === 'dark' ? 'light' : 'dark');
    updateUI();
}

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    const c = document.getElementById("content");
    c.innerHTML = "";

    if (tab === 'home') {
        c.innerHTML = `<div class="card"><h3>🏠 פרופיל</h3><p>מוניטין: ${rep}</p><p>עבודות שבוצעו: ${totalWorkDone}</p><p>נכסים: ${myProperties.length}</p></div>`;
    } 
    else if (tab === 'work') {
        c.innerHTML = `<h3>💼 עבודה</h3><div class="xpbar"><div id="wb" style="width:0%; background:#22c55e; height:100%;"></div></div>`;
        worksData.forEach(w => {
            const locked = w.req && !mySkills.includes(w.req);
            c.innerHTML += `<div class="card"><b>${w.n}</b><br><small>שכר: ${w.p}₪ | מוניטין: +${w.r}</small><button class="action ${locked?'disabled':''}" onclick="runWork(${w.p},${w.t},${w.x},${w.r})">${locked?'🔒 '+w.req:'עבוד'}</button></div>`;
        });
    }
    else if (tab === 'business') {
        const bus = [{n:"דוכן פלאפל", c:5000, inc:250, i:"🧆"}, {n:"מוסך", c:60000, inc:3500, i:"🔧"}];
        bus.forEach(b => {
            const owned = myBusiness.find(x => x.n === b.n);
            c.innerHTML += `<div class="card">${b.i} <b>${b.n}</b><br>${owned ? `<button class="action" style="background:#22c55e" onclick="manageBusiness('${b.n}',${b.inc})">אסוף ${b.inc}₪</button>` : `<button class="action" onclick="buyBusiness('${b.n}',${b.c},${b.inc},'${b.i}')">פתח ב-${b.c.toLocaleString()}₪</button>`}</div>`;
        });
    }
    else if (tab === 'realestate') {
        estateData.forEach(e => {
            const has = myProperties.find(p => p.n === e.n);
            c.innerHTML += `<div class="card">${e.i} <b>${e.n}</b><br><small>הכנסה: ${e.p}₪/ש'</small><button class="action ${has?'disabled':''}" onclick="buyProp('${e.n}',${e.c},${e.p},'${e.i}')">${has?'בבעלותך':'קנה ב-'+e.c.toLocaleString()+'₪'}</button></div>`;
        });
    }
    else if (tab === 'stock') {
        c.innerHTML = `<h3>💹 בורסה</h3>`;
        ['tech', 'reit', 'crypto'].forEach(s => {
            c.innerHTML += `<div class="card"><b>${s.toUpperCase()}</b>: <span id="s-${s}">${stockPrices[s]}</span>₪ (ברשותך: ${myStocks[s]})<br><button onclick="trade('${s}','buy')">קנה</button> <button onclick="trade('${s}','sell')">מכור</button></div>`;
        });
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק והלוואות</h3><input id="bAmt" type="number" placeholder="סכום"><button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button><hr><h3>💳 הלוואות</h3><button class="action" style="background:#ef4444" onclick="loanOp('take')">קח הלוואה (50k)</button><button class="action" style="background:#10b981" onclick="loanOp('pay')">החזר חלק מהחוב (10k)</button></div>`;
    }
    else if (tab === 'tasks') {
        const t = tasksData[currentTaskId] || {n:"הכל הושלם!", g:0, p:0, d:"אין משימות נוספות"};
        const can = totalWorkDone >= t.g;
        c.innerHTML = `<div class="card"><h3>🎯 ${t.n}</h3><p>${t.d}</p><p>התקדמות: ${totalWorkDone}/${t.g}</p><button class="action ${!can?'disabled':''}" onclick="claimTask(${t.p})">קבל ${t.p.toLocaleString()}₪</button></div>`;
    }
    else if (tab === 'skills') {
        const sks = [{n:"רישיון נהיגה", c:4500}, {n:"רישיון נשק", c:6500}, {n:"קורס טכנאי", c:12000}, {n:"שיווק שותפים", c:25000}, {n:"ניהול מערכות", c:50000}];
        sks.forEach(s => {
            const has = mySkills.includes(s.n);
            c.innerHTML += `<div class="card"><b>${s.n}</b><button class="action ${has?'disabled':''}" onclick="buySkill('${s.n}',${s.c})">${has?'נרכש':'למד ב-'+s.c.toLocaleString()}</button></div>`;
        });
    }
}

function runWork(p, t, x, r) {
    if (working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => {
        s++; if(bar) bar.style.width = (s/t*100) + "%";
        if(s >= t) { clearInterval(i); working = false; money += p; rep += r; totalWorkDone++; addXP(x); updateUI(); openTab('work'); }
    }, 1000);
}

function buyBusiness(n,c,inc,i) { if(money>=c){ money-=c; myBusiness.push({n,inc,icon:i}); updateUI(); openTab('business'); } }
function manageBusiness(n, inc) { money += inc; rep += 2; notify(`רווח מהעסק: ${inc}₪`, "gain"); updateUI(); }
function buyProp(n, c, p, i) { if(money>=c){ money-=c; myProperties.push({n,i}); passive+=p; notify(`קנית ${n}!`, "gain"); updateUI(); openTab('realestate'); } }
function buySkill(n, c) { if(money>=c){ money-=c; mySkills.push(n); updateUI(); openTab('skills'); } }
function trade(s, a) { let p=stockPrices[s]; if(a==='buy'&&money>=p){money-=p;myStocks[s]++;}else if(a==='sell'&&myStocks[s]>0){money+=p;myStocks[s]--;} updateUI(); openTab('stock'); }
function bankOp(t) { let a = Number(document.getElementById("bAmt").value); if(t==='dep'&&money>=a){money-=a;bank+=a;}else if(t==='wit'&&bank>=a){bank-=a;money+=a;} updateUI(); }
function loanOp(t) { if(t==='take'){debt+=50000;money+=50000;}else if(debt>=10000&&money>=10000){debt-=10000;money-=10000;} updateUI(); }
function addXP(v) { xp+=v; if(xp>=100){ xp-=100; level++; money+=level*1500; notify("רמה עלתה!", "event"); } }
function claimTask(p) { money+=p; currentTaskId++; notify("משימה הושלמה!", "gain"); updateUI(); openTab('tasks'); }

// לופים אוטומטיים
setInterval(() => { if(passive>0){ money+=(passive/10); updateUI(); } }, 1000);
setInterval(() => { if(debt>0){ money-=(debt*0.01); updateUI(); } }, 60000);
setInterval(() => {
    stockPrices.tech = Math.max(10, stockPrices.tech + Math.floor(Math.random()*12-6));
    stockPrices.crypto = Math.max(5, stockPrices.crypto + Math.floor(Math.random()*40-20));
    updateUI();
}, 5000);

document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
const resetGame = () => { if(confirm("לאפס את כל המשחק?")) { localStorage.clear(); location.reload(); } };
const checkUpdate = () => location.reload(true);
