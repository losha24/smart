const VERSION = "3.4.11";

function load(k, d) { try { return localStorage[k] ? JSON.parse(localStorage[k]) : d; } catch { return d; } }

let money = load('money', 1500), bank = load('bank', 0), xp = load('xp', 0), level = load('level', 1);
let stocks = load('stocks', 0), passive = load('passive', 0), totalWorkDone = load('totalWorkDone', 0);
let lastGiftTime = load('lastGiftTime', 0), myProperties = load('myProperties', []), myItems = load('myItems', []);
let mySkills = load('mySkills', []), jobExp = load('jobExp', {}), stockPrice = 100;
let currentTaskId = load('currentTaskId', 0);

const skillsData = [
    { n: "רישיון נשק", cost: 2500, i: "🔫" }, { n: "רישיון נהיגה", cost: 4500, i: "🚗" },
    { n: "קורס טכנאי", cost: 7500, i: "💻" }, { n: "ניהול מערכות", cost: 15000, i: "🖥️" },
    { n: "תואר אקדמי", cost: 35000, i: "🎓" }, { n: "שיווק דיגיטלי", cost: 5500, i: "📢" }
];

const worksData = [
    { id: "cleaner", n: "שוטף כלים", p: 130, t: 4, x: 15, req: null },
    { id: "delivery", n: "שליח", p: 250, t: 6, x: 25, req: "רישיון נהיגה" },
    { id: "guard", n: "מאבטח", p: 680, t: 10, x: 65, req: "רישיון נשק" },
    { id: "tech", n: "טכנאי", p: 1500, t: 15, x: 130, req: "קורס טכנאי" }
];

const estateData = [
    { n: "מחסן", cost: 8500, p: 70, i: "📦" }, { n: "דוכן", cost: 20000, p: 180, i: "🌭" },
    { n: "חניה", cost: 45000, p: 400, i: "🅿️" }, { n: "דירה", cost: 150000, p: 1200, i: "🏠" },
    { n: "משרד", cost: 550000, p: 4800, i: "🏢" }, { n: "מגדל מגורים", cost: 2500000, p: 25000, i: "🏙️" },
    { n: "קניון", cost: 8000000, p: 90000, i: "🏬" }
];

const marketData = [
    { n: "שעון", price: 900, p: 15, i: "⌚" }, { n: "טאבלט", price: 2800, p: 50, i: "📱" },
    { n: "מחשב", price: 7500, p: 150, i: "💻" }, { n: "רכב ספורט", price: 450000, p: 3500, i: "🏎️" },
    { n: "יאכטה", price: 1200000, p: 12000, i: "🛥️" }, { n: "מטוס פרטי", price: 10000000, p: 110000, i: "🛩️" }
];

const tasksData = [
    { id: 0, n: "מתחילים לעבוד", desc: "בצע 5 עבודות", goal: 5, prize: 2000 },
    { id: 1, n: "חוסך מתחיל", desc: "צבור 10,000₪ בבנק", goal: 10000, prize: 5000 },
    { id: 2, n: "אימפריית נדלן", desc: "קנה 2 נכסים", goal: 2, prize: 10000 },
    { id: 3, n: "מקצוען", desc: "הגע לרמה 5", goal: 5, prize: 15000 }
];

function notify(t, c = '') {
    const el = document.getElementById("msg-text");
    el.innerText = t; el.className = c;
}

function save() {
    const d = { money, bank, xp, level, stocks, passive, totalWorkDone, lastGiftTime, myProperties, myItems, mySkills, jobExp, currentTaskId };
    for (let k in d) localStorage[k] = JSON.stringify(d[k]);
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("level").innerText = level;
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.getElementById("xpfill").style.width = (xp % 100) + "%";
    save();
}

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        c.innerHTML = `<div class="card"><h3>🏠 לוח בקרה</h3>
        <p style="font-size:10px">גרסה: ${VERSION}</p>
        <div class="stats-grid">
            <p>הכנסה פסיבית: <b>${passive}₪</b></p>
            <p>עבודות שבוצעו: <b>${totalWorkDone}</b></p>
            <p>נכסים: <b>${myProperties.length}</b></p>
            <p>פריטים: <b>${myItems.length}</b></p>
        </div>
        <div id="gift-box"></div>
        <div class="inventory-section">
            <h4>📦 האוסף שלך:</h4>
            <div class="inv-items">
                ${myProperties.map(p=>`<span>${p.i} ${p.n}</span>`).join("")}
                ${myItems.map(i=>`<span>${i.i} ${i.n}</span>`).join("")}
            </div>
        </div></div>`;
        renderGift();
    } else if (tab === 'work') {
        let h = `<h3>💼 עבודה</h3><div class="xpbar"><div id="wb" style="width:0%; background:#22c55e; height:100%;"></div></div>`;
        worksData.forEach(w => {
            const locked = w.req && !mySkills.includes(w.req);
            h += `<div class="card"><b>${w.n}</b> (${w.p}₪) <br> <small>בונוס פסיבי קבוע: +0.1₪</small>
            <button class="action ${locked?'disabled':''}" onclick="${locked?'':`runWork('${w.id}',${w.p},${w.t},${w.x})`}">
            ${locked?'🔒 דרוש '+w.req:'בצע עבודה'}</button></div>`;
        });
        c.innerHTML = h;
    } else if (tab === 'skills') {
        skillsData.forEach(s => {
            const owned = mySkills.includes(s.n);
            c.innerHTML += `<div class="card">${s.i} <b>${s.n}</b> - ${s.cost}₪
            <button class="action ${owned?'disabled':''}" onclick="buySkill('${s.n}',${s.cost})">${owned?'נרכש':'למד'}</button></div>`;
        });
    } else if (tab === 'realestate') {
        estateData.forEach(p => {
            c.innerHTML += `<div class="card">${p.i} <b>${p.n}</b> - ${p.cost.toLocaleString()}₪<br>+${p.p}₪ פסיבי
            <button class="action" onclick="buyProp('${p.n}',${p.cost},${p.p},'${p.i}')">קנה נכס</button></div>`;
        });
    } else if (tab === 'market') {
        marketData.forEach(m => {
            c.innerHTML += `<div class="card">${m.i} <b>${m.n}</b> - ${m.price.toLocaleString()}₪<br>+${m.p}₪ פסיבי
            <button class="action" onclick="buyItem('${m.n}',${m.price},${m.p},'${m.i}')">קנה פריט</button></div>`;
        });
    } else if (tab === 'tasks') {
        const t = tasksData[currentTaskId] || {n: "סיימת הכל!", desc: "אין משימות חדשות", goal: 0, prize: 0};
        let prog = 0;
        if(currentTaskId === 0) prog = totalWorkDone;
        if(currentTaskId === 1) prog = bank;
        if(currentTaskId === 2) prog = myProperties.length;
        if(currentTaskId === 3) prog = level;

        const canClaim = prog >= t.goal && t.goal > 0;
        c.innerHTML = `<div class="card"><h3>🎯 משימה: ${t.n}</h3><p>${t.desc}</p>
        <p>התקדמות: ${prog}/${t.goal}</p>
        <button class="action ${!canClaim?'disabled':''}" onclick="claimTask(${t.prize})">קבל פרס (${t.prize}₪)</button></div>`;
    } else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input id="bAmt" type="number" placeholder="סכום">
        <button class="action" onclick="bankOp('dep')">הפקדה</button>
        <button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button></div>`;
    } else if (tab === 'stock') {
        c.innerHTML = `<div class="card"><h3>💹 בורסה</h3><h1 id="s-price">₪${stockPrice}</h1>
        <button class="action" onclick="tradeStock('buy')">קנה מניה</button>
        <button class="action" style="background:#475569" onclick="tradeStock('sell')">מכור מניה</button></div>`;
    } else if (tab === 'install') {
        c.innerHTML = `<div class="card"><h3>📲 התקנה</h3><p>לחץ על "הוסף למסך הבית" בדפדפן.</p></div>`;
    }
}

let working = false;
function runWork(id, p, t, x) {
    if (working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let inter = setInterval(() => {
        s++; if(bar) bar.style.width = (s/t*100) + "%";
        if (s >= t) { 
            clearInterval(inter); working = false; 
            money += p; passive += 0.1; totalWorkDone++; addXP(x); 
            notify(`הרווחת ${p}₪ ו-+0.1₪ פסיבי!`, "gain"); updateUI(); openTab('work');
        }
    }, 1000);
}

function buySkill(n, c) { if(money>=c){ money-=c; mySkills.push(n); notify(`למדת ${n}`, "gain"); updateUI(); openTab('skills'); } else notify("חסר כסף!", "loss"); }
function buyProp(n, c, p, i) { if(money>=c){ money-=c; myProperties.push({n,i}); passive+=p; notify(`קנית ${n}`, "gain"); updateUI(); } else notify("חסר כסף!", "loss"); }
function buyItem(n, c, p, i) { if(money>=c){ money-=c; myItems.push({n,i}); passive+=p; notify(`קנית ${n}`, "gain"); updateUI(); } else notify("חסר כסף!", "loss"); }

function addXP(v) { 
    xp += v; if(xp >= 100) { xp -= 100; level++; let b = level*2000; money += b; notify(`עלית לרמה ${level}! בונוס ${b}₪`, "event"); } 
}

function claimTask(prize) { money += prize; currentTaskId++; notify("משימה הושלמה!", "event"); updateUI(); openTab('tasks'); }

function renderGift() {
    const area = document.getElementById("gift-box");
    if (Date.now() - lastGiftTime >= 8*60*60*1000) {
        area.innerHTML = `<button class="action" style="background:#fbbf24; color:black" onclick="claimGift()">🎁 קח מתנה (4,000₪)</button>`;
    } else area.innerHTML = `<button class="action disabled">מתנה תחזור בקרוב</button>`;
}
function claimGift() { money += 4000; lastGiftTime = Date.now(); updateUI(); openTab('home'); }

function bankOp(t) {
    let a = Number(document.getElementById("bAmt").value);
    if(t==='dep' && money>=a) { money-=a; bank+=a; notify("הפקדה הצליחה", "gain"); }
    else if(t==='wit' && bank>=a) { bank-=a; money+=a; notify("משיכה הצליחה", "gain"); }
    updateUI();
}

function tradeStock(t) {
    if(t==='buy' && money>=stockPrice) { money-=stockPrice; stocks++; }
    else if(t==='sell' && stocks>0) { money+=stockPrice; stocks--; }
    updateUI();
}

setInterval(() => { if (passive > 0) { money += (passive/10); updateUI(); } }, 1000);
setInterval(() => { stockPrice = Math.max(10, Math.floor(stockPrice + (Math.random()*30-15))); const el = document.getElementById("s-price"); if(el) el.innerText = "₪"+stockPrice; }, 4000);

function checkUpdate() { caches.keys().then(ns => ns.forEach(n => caches.delete(n))); location.reload(true); }
function resetGame() { if(confirm("לאפס הכל?")) { localStorage.clear(); location.reload(); } }

document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
