const VERSION = "3.6";

function load(k, d) { try { return localStorage[k] ? JSON.parse(localStorage[k]) : d; } catch { return d; } }

let money = load('money', 1500), bank = load('bank', 0), xp = load('xp', 0), level = load('level', 1);
let stocks = load('stocks', 0), passive = load('passive', 0), totalWorkDone = load('totalWorkDone', 0);
let lastGiftTime = load('lastGiftTime', 0), myProperties = load('myProperties', []), myItems = load('myItems', []);
let mySkills = load('mySkills', []), currentTaskId = load('currentTaskId', 0), stockPrice = load('stockPrice', 100);
let lastTaskReset = load('lastTaskReset', Date.now());

// מערך 20 משימות מדורגות
const tasksData = [
    { n: "מתחילים", g: 5, p: 1000, t: 'w' }, { n: "חיסכון", g: 2000, p: 1500, t: 'b' },
    { n: "נדלניסט", g: 1, p: 3000, t: 'r' }, { n: "סוחר יום", g: 5, p: 4000, t: 's' },
    { n: "חרוץ", g: 15, p: 5000, t: 'w' }, { n: "משקיע", g: 10000, p: 6000, t: 'b' },
    { n: "בעל נכסים", g: 3, p: 8000, t: 'r' }, { n: "לוויתן בורסה", g: 20, p: 10000, t: 's' },
    { n: "מקצוען", g: 30, p: 12000, t: 'w' }, { n: "עשיר", g: 50000, p: 15000, t: 'b' },
    { n: "טייקון", g: 5, p: 20000, t: 'r' }, { n: "קולקטור", g: 5, p: 10000, t: 'i' },
    { n: "מומחה", g: 50, p: 25000, t: 'w' }, { n: "מיליונר", g: 200000, p: 50000, t: 'b' },
    { n: "אימפריה", g: 10, p: 70000, t: 'r' }, { n: "סוחר על", g: 100, p: 100000, t: 's' },
    { n: "וורקהוליק", g: 150, p: 150000, t: 'w' }, { n: "מולטי", g: 1000000, p: 250000, t: 'b' },
    { n: "בעל העיר", g: 15, p: 500000, t: 'r' }, { n: "אגדה", g: 500, p: 1000000, t: 'w' }
];

const skillsData = [
    { n: "רישיון נשק", cost: 2500 }, { n: "רישיון נהיגה", cost: 4500 },
    { n: "קורס טכנאי", cost: 7500 }, { n: "ניהול מערכות", cost: 15000 },
    { n: "שיווק שותפים", cost: 22000 }, { n: "ניהול השקעות", cost: 40000 }
];

const worksData = [
    { id: "c", n: "שוטף כלים", p: 130, t: 4, x: 15, req: null },
    { id: "t", n: "נהג מונית", p: 320, t: 6, x: 30, req: "רישיון נהיגה" },
    { id: "g", n: "מאבטח", p: 750, t: 10, x: 70, req: "רישיון נשק" },
    { id: "tc", n: "טכנאי רשתות", p: 1600, t: 15, x: 140, req: "קורס טכנאי" },
    { id: "m", n: "מנהל קמפיינים", p: 3500, t: 25, x: 250, req: "שיווק שותפים" },
    { id: "cy", n: "אנליסט סייבר", p: 8500, t: 45, x: 700, req: "ניהול מערכות" }
];

const estateData = [
    { n: "מחסן", cost: 8500, p: 70, i: "📦" }, { n: "דירה", cost: 150000, p: 1200, i: "🏠" },
    { n: "בניין", cost: 2500000, p: 28000, i: "🏙️" }, { n: "קניון", cost: 8000000, p: 95000, i: "🏬" }
];

const marketData = [
    { n: "שעון", price: 900, p: 15, i: "⌚" }, { n: "מחשב", price: 9500, p: 180, i: "💻" },
    { n: "רכב", price: 450000, p: 3500, i: "🏎️" }, { n: "מטוס", price: 12000000, p: 130000, i: "🛩️" }
];

function notify(t, c = '') {
    const el = document.getElementById("msg-text");
    if(el) { el.innerText = t; el.className = c; }
}

function save() {
    const d = { money, bank, xp, level, stocks, passive, totalWorkDone, lastGiftTime, myProperties, myItems, mySkills, currentTaskId, stockPrice, lastTaskReset };
    for (let k in d) localStorage[k] = JSON.stringify(d[k]);
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("stocks-ui").innerText = stocks;
    document.getElementById("level").innerText = level;
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.getElementById("xpfill").style.width = (xp % 100) + "%";
    save();
}

// מנגנון אירועי חיים אקראיים (בזבוזים/מציאות)
setInterval(() => {
    const evs = [
        { t: "מצאת 50₪ בחניה!", a: 50, c: 'gain' },
        { t: "קנית קפה מוגזם", a: -35, c: 'loss' },
        { t: "הפסדת כסף בסיבוב בעיר", a: -100, c: 'loss' },
        { t: "מישהו החזיר לך חוב", a: 200, c: 'gain' }
    ];
    if (Math.random() < 0.15) {
        let e = evs[Math.floor(Math.random()*evs.length)];
        money += e.a; notify(e.t, e.c); updateUI();
    }
}, 45000);

// מנגנון בורסה עם קריסות
setInterval(() => {
    let vol = Math.random() * 20 - 10;
    if (Math.random() < 0.04) { vol = -(stockPrice * 0.4); notify("📉 השוק בקריסה! המניות צנחו", "loss"); }
    stockPrice = Math.max(10, Math.floor(stockPrice + vol));
    const el = document.getElementById("s-price"); if(el) el.innerText = "₪"+stockPrice;
}, 5000);

// איפוס משימות כל שעה
setInterval(() => {
    if (Date.now() - lastTaskReset > 3600000) {
        currentTaskId = 0; lastTaskReset = Date.now();
        notify("המשימות התאפסו!", "event"); save();
    }
}, 60000);

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        c.innerHTML = `<div class="card"><h3>🏠 בית</h3><div class="stats-grid">
        <p>פסיבי: <b>${passive}₪</b></p><p>עבודות: <b>${totalWorkDone}</b></p>
        <p>נכסים: <b>${myProperties.length}</b></p><p>משימה: <b>${currentTaskId+1}/20</b></p></div>
        <div id="gift-box"></div><div class="inventory-section"><h4>📦 רכוש:</h4><div class="inv-items">
        ${myProperties.map(p=>`<span>${p.i} ${p.n}</span>`).join("")} ${myItems.map(i=>`<span>${i.i} ${i.n}</span>`).join("")}</div></div></div>`;
        renderGift();
    } else if (tab === 'work') {
        let h = `<h3>💼 עבודה</h3><div class="xpbar"><div id="wb" style="width:0%; background:#22c55e; height:100%;"></div></div>`;
        worksData.forEach(w => {
            const locked = w.req && !mySkills.includes(w.req);
            h += `<div class="card"><b>${w.n}</b> (${w.p}₪) <button class="action ${locked?'disabled':''}" onclick="${locked?'':`runWork('${w.id}',${w.p},${w.t},${w.x})`}">
            ${locked?'🔒 '+w.req:'עבוד'}</button></div>`;
        });
        c.innerHTML = h;
    } else if (tab === 'skills') {
        skillsData.forEach(s => {
            const owned = mySkills.includes(s.n);
            c.innerHTML += `<div class="card"><b>${s.n}</b> - ${s.cost}₪<button class="action ${owned?'disabled':''}" onclick="buySkill('${s.n}',${s.cost})">${owned?'נרכש':'למד'}</button></div>`;
        });
    } else if (tab === 'realestate') {
        estateData.forEach(p => {
            c.innerHTML += `<div class="card">${p.i} <b>${p.n}</b> - ${p.cost.toLocaleString()}₪<button class="action" onclick="buyProp('${p.n}',${p.cost},${p.p},'${p.i}')">קנה</button></div>`;
        });
    } else if (tab === 'market') {
        marketData.forEach(m => {
            c.innerHTML += `<div class="card">${m.i} <b>${m.n}</b> - ${m.price.toLocaleString()}₪<button class="action" onclick="buyItem('${m.n}',${m.price},${m.p},'${m.i}')">קנה</button></div>`;
        });
    } else if (tab === 'tasks') {
        const t = tasksData[currentTaskId] || {n: "סיימת הכל!", g: 0, p: 0};
        let prog = 0;
        if(t.t==='w') prog = totalWorkDone; else if(t.t==='b') prog = bank; else if(t.t==='r') prog = myProperties.length; else if(t.t==='s') prog = stocks;
        const can = prog >= t.g && t.g > 0;
        c.innerHTML = `<div class="card"><h3>🎯 משימה ${currentTaskId+1}: ${t.n}</h3><p>${t.desc || 'הגע ליעד הנקוב'}</p>
        <p>התקדמות: ${prog}/${t.g}</p><button class="action ${!can?'disabled':''}" onclick="claimTask(${t.p})">קבל ${t.p}₪</button></div>`;
    } else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input id="bAmt" type="number" placeholder="סכום">
        <button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button></div>`;
    } else if (tab === 'stock') {
        c.innerHTML = `<div class="card"><h3>💹 בורסה</h3><h1 id="s-price">₪${stockPrice}</h1><p>ברשותך: ${stocks}</p>
        <button class="action" onclick="tradeStock('buy')">קנה</button><button class="action" style="background:#475569" onclick="tradeStock('sell')">מכור</button></div>`;
    }
}

let working = false;
function runWork(id, p, t, x) {
    if (working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let inter = setInterval(() => {
        s++; if(bar) bar.style.width = (s/t*100) + "%";
        if (s >= t) { 
            clearInterval(inter); working = false; money += p; passive += 0.1; totalWorkDone++; addXP(x); 
            notify(`רווח: ${p}₪`, "gain"); updateUI(); openTab('work');
        }
    }, 1000);
}

function buySkill(n, c) { if(money>=c){ money-=c; mySkills.push(n); updateUI(); openTab('skills'); } }
function buyProp(n, c, p, i) { if(money>=c){ money-=c; myProperties.push({n,i}); passive+=p; updateUI(); } }
function buyItem(n, c, p, i) { if(money>=c){ money-=c; myItems.push({n,i}); passive+=p; updateUI(); } }
function addXP(v) { xp += v; if(xp>=100){ xp-=100; level++; money+=level*2000; notify("רמה עלתה!", "event"); } }
function claimTask(p) { money+=p; currentTaskId++; notify("משימה הושלמה!", "event"); updateUI(); openTab('tasks'); }
function renderGift() {
    const a = document.getElementById("gift-box");
    if (Date.now() - lastGiftTime >= 28800000) a.innerHTML = `<button class="action" style="background:#fbbf24;color:000" onclick="claimGift()">🎁 קבל 4,000₪</button>`;
    else a.innerHTML = `<button class="action disabled">מתנה בדרך...</button>`;
}
function claimGift() { money+=4000; lastGiftTime=Date.now(); updateUI(); openTab('home'); }
function bankOp(t) {
    let a = Number(document.getElementById("bAmt").value);
    if(t==='dep'&&money>=a){money-=a;bank+=a;}else if(t==='wit'&&bank>=a){bank-=a;money+=a;}
    updateUI();
}
function tradeStock(t) {
    if(t==='buy'&&money>=stockPrice){money-=stockPrice;stocks++;}else if(t==='sell'&&stocks>0){money+=stockPrice;stocks--;}
    updateUI(); openTab('stock');
}

setInterval(() => { if(passive>0){ money+=(passive/10); updateUI(); } }, 1000);
function checkUpdate() { caches.keys().then(ns => ns.forEach(n => caches.delete(n))); location.reload(true); }
function resetGame() { if(confirm("לאפס?")) { localStorage.clear(); location.reload(); } }
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
