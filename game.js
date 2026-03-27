const VERSION = "3.5";

function load(k, d) { try { return localStorage[k] ? JSON.parse(localStorage[k]) : d; } catch { return d; } }

let money = load('money', 1500), bank = load('bank', 0), xp = load('xp', 0), level = load('level', 1);
let stocks = load('stocks', 0), passive = load('passive', 0), totalWorkDone = load('totalWorkDone', 0);
let lastGiftTime = load('lastGiftTime', 0), myProperties = load('myProperties', []), myItems = load('myItems', []);
let mySkills = load('mySkills', []), jobExp = load('jobExp', {}), stockPrice = 100;
let currentTaskId = load('currentTaskId', 0);

// 6 כישורים מורחבים
const skillsData = [
    { n: "רישיון נשק", cost: 2500, i: "🔫" },
    { n: "רישיון נהיגה", cost: 4500, i: "🚗" },
    { n: "קורס טכנאי", cost: 7500, i: "💻" },
    { n: "ניהול מערכות", cost: 15000, i: "🖥️" },
    { n: "שיווק שותפים", cost: 22000, i: "🔗" },
    { n: "ניהול השקעות", cost: 40000, i: "📈" }
];

// 6 עבודות מורחבות
const worksData = [
    { id: "cleaner", n: "שוטף כלים", p: 130, t: 4, x: 15, req: null },
    { id: "taxi", n: "נהג מונית", p: 320, t: 6, x: 30, req: "רישיון נהיגה" },
    { id: "guard", n: "מאבטח", p: 750, t: 10, x: 70, req: "רישיון נשק" },
    { id: "tech", n: "טכנאי רשתות", p: 1600, t: 15, x: 140, req: "קורס טכנאי" },
    { id: "marketing", n: "מנהל קמפיינים", p: 3500, t: 25, x: 250, req: "שיווק שותפים" },
    { id: "cyber", n: "אנליסט סייבר", p: 8500, t: 45, x: 700, req: "ניהול מערכות" }
];

const estateData = [
    { n: "מחסן", cost: 8500, p: 70, i: "📦" }, { n: "דוכן", cost: 20000, p: 180, i: "🌭" },
    { n: "חניה", cost: 45000, p: 400, i: "🅿️" }, { n: "דירה", cost: 150000, p: 1200, i: "🏠" },
    { n: "בניין משרדים", cost: 2500000, p: 28000, i: "🏙️" }, { n: "קניון", cost: 8000000, p: 95000, i: "🏬" }
];

const marketData = [
    { n: "שעון", price: 900, p: 15, i: "⌚" }, { n: "טאבלט", price: 2800, p: 50, i: "📱" },
    { n: "מחשב גיימינג", price: 9500, p: 180, i: "💻" }, { n: "רכב ספורט", price: 450000, p: 3500, i: "🏎️" },
    { n: "יאכטה", price: 1500000, p: 14000, i: "🛥️" }, { n: "מטוס פרטי", price: 12000000, p: 130000, i: "🛩️" }
];

const tasksData = [
    { id: 0, n: "התחלה מבטיחה", desc: "בצע 5 עבודות", goal: 5, prize: 2000 },
    { id: 1, n: "חיסכון ראשון", desc: "צבור 5,000₪ בבנק", goal: 5000, prize: 4000 },
    { id: 2, n: "בעל בית", desc: "קנה נכס נדלן ראשון", goal: 1, prize: 8000 },
    { id: 3, n: "משקיע כבד", desc: "קנה 5 מניות בבורסה", goal: 5, prize: 10000 }
];

function notify(txt, cls = '') {
    const el = document.getElementById("msg-text");
    if(el) { el.innerText = txt; el.className = cls; }
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
        <p style="font-size:10px; color:#64748b">גרסה מועדפת ${VERSION}</p>
        <div class="stats-grid">
            <p>הכנסה פסיבית: <b>${passive}₪</b></p>
            <p>עבודות: <b>${totalWorkDone}</b></p>
            <p>נכסים: <b>${myProperties.length}</b></p>
            <p>פריטים: <b>${myItems.length}</b></p>
        </div>
        <div id="gift-box"></div>
        <div class="inventory-section">
            <h4>📦 הרכוש שלך:</h4>
            <div class="inv-items">
                ${myProperties.map(p=>`<span>${p.i} ${p.n}</span>`).join("")}
                ${myItems.map(i=>`<span>${i.i} ${i.n}</span>`).join("")}
                ${mySkills.map(s=>`<span style="border-color:#fbbf24">${s}</span>`).join("")}
            </div>
        </div></div>`;
        renderGift();
    } else if (tab === 'work') {
        let h = `<h3>💼 עבודה</h3><div class="xpbar"><div id="wb" style="width:0%; background:#22c55e; height:100%;"></div></div>`;
        worksData.forEach(w => {
            const locked = w.req && !mySkills.includes(w.req);
            h += `<div class="card"><b>${w.n}</b> (${w.p}₪) <br> <small>+0.1₪ פסיבי לכל ביצוע</small>
            <button class="action ${locked?'disabled':''}" onclick="${locked?'':`runWork('${w.id}',${w.p},${w.t},${w.x})`}">
            ${locked?'🔒 דרוש '+w.req:'בצע עבודה'}</button></div>`;
        });
        c.innerHTML = h;
    } else if (tab === 'skills') {
        skillsData.forEach(s => {
            const owned = mySkills.includes(s.n);
            c.innerHTML += `<div class="card">${s.i} <b>${s.n}</b> - ${s.cost}₪<br>
            <button class="action ${owned?'disabled':''}" onclick="buySkill('${s.n}',${s.cost})">${owned?'נרכש':'למד כלי'}</button></div>`;
        });
    } else if (tab === 'realestate') {
        estateData.forEach(p => {
            c.innerHTML += `<div class="card">${p.i} <b>${p.n}</b> - ${p.cost.toLocaleString()}₪<br>+${p.p}₪ לשעה פסיבי
            <button class="action" onclick="buyProp('${p.n}',${p.cost},${p.p},'${p.i}')">קנה נכס</button></div>`;
        });
    } else if (tab === 'market') {
        marketData.forEach(m => {
            c.innerHTML += `<div class="card">${m.i} <b>${m.n}</b> - ${m.price.toLocaleString()}₪<br>+${m.p}₪ פסיבי
            <button class="action" onclick="buyItem('${m.n}',${m.price},${m.p},'${m.i}')">קנה פריט</button></div>`;
        });
    } else if (tab === 'tasks') {
        const t = tasksData[currentTaskId] || {n: "אלוף!", desc: "סיימת את כל המשימות!", goal: 0, prize: 0};
        let prog = 0;
        if(currentTaskId === 0) prog = totalWorkDone;
        if(currentTaskId === 1) prog = bank;
        if(currentTaskId === 2) prog = myProperties.length;
        if(currentTaskId === 3) prog = stocks;

        const canClaim = prog >= t.goal && t.goal > 0;
        c.innerHTML = `<div class="card"><h3>🎯 משימה: ${t.n}</h3><p>${t.desc}</p>
        <p>התקדמות: ${prog}/${t.goal}</p>
        <button class="action ${!canClaim?'disabled':''}" onclick="claimTask(${t.prize})">קבל פרס (${t.prize}₪)</button></div>`;
    } else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק השקעות</h3><input id="bAmt" type="number" placeholder="סכום">
        <button class="action" onclick="bankOp('dep')">הפקדה</button>
        <button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button></div>`;
    } else if (tab === 'stock') {
        c.innerHTML = `<div class="card"><h3>💹 בורסה לניירות ערך</h3><h1 id="s-price">₪${stockPrice}</h1>
        <p>מניות שברשותך: <b id="s-own">${stocks}</b></p>
        <button class="action" onclick="tradeStock('buy')">קנה מניה</button>
        <button class="action" style="background:#475569" onclick="tradeStock('sell')">מכור מניה</button></div>`;
    } else if (tab === 'install') {
        c.innerHTML = `<div class="card"><h3>📲 התקנה על מסך הבית</h3><p>1. פתח תפריט דפדפן (3 נקודות)<br>2. בחר "הוסף למסך הבית"<br>3. האפליקציה תפעל כמסך מלא!</p></div>`;
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
            notify(`הרווחת ${p}₪! +0.1₪ פסיבי נוסף`, "gain"); updateUI(); openTab('work');
        }
    }, 1000);
}

function buySkill(n, c) { if(money>=c){ money-=c; mySkills.push(n); notify(`למדת ${n}!`, "gain"); updateUI(); openTab('skills'); } else notify("אין מספיק מזומן!", "loss"); }
function buyProp(n, c, p, i) { if(money>=c){ money-=c; myProperties.push({n,i}); passive+=p; notify(`קנית ${n}`, "gain"); updateUI(); } else notify("אין מספיק מזומן!", "loss"); }
function buyItem(n, c, p, i) { if(money>=c){ money-=c; myItems.push({n,i}); passive+=p; notify(`קנית ${n}`, "gain"); updateUI(); } else notify("אין מספיק מזומן!", "loss"); }

function addXP(v) { 
    xp += v; if(xp >= 100) { xp -= 100; level++; let b = level*2000; money += b; notify(`LEVEL UP! בונוס ${b}₪`, "event"); } 
}

function claimTask(prize) { money += prize; currentTaskId++; notify("משימה הושלמה! הבאה נפתחה", "event"); updateUI(); openTab('tasks'); }

function renderGift() {
    const area = document.getElementById("gift-box");
    if (Date.now() - lastGiftTime >= 8*60*60*1000) {
        area.innerHTML = `<button class="action" style="background:#fbbf24; color:black" onclick="claimGift()">🎁 קבל מתנה (4,000₪)</button>`;
    } else area.innerHTML = `<button class="action disabled">המתנה תחזור בקרוב</button>`;
}
function claimGift() { money += 4000; lastGiftTime = Date.now(); updateUI(); openTab('home'); }

function bankOp(t) {
    let a = Number(document.getElementById("bAmt").value);
    if(t==='dep' && money>=a) { money-=a; bank+=a; notify("הפקדה הצליחה", "gain"); }
    else if(t==='wit' && bank>=a) { bank-=a; money+=a; notify("משיכה הצליחה", "gain"); }
    else notify("פעולה נכשלה - בדוק יתרה", "loss");
    updateUI();
}

function tradeStock(t) {
    if(t==='buy' && money>=stockPrice) { money-=stockPrice; stocks++; notify("מניה נרכשה", "gain"); }
    else if(t==='sell' && stocks>0) { money+=stockPrice; stocks--; notify("מניה נמכרה", "gain"); }
    else notify("פעולה נכשלה", "loss");
    updateUI(); openTab('stock');
}

setInterval(() => { if (passive > 0) { money += (passive/10); updateUI(); } }, 1000);
setInterval(() => { stockPrice = Math.max(10, Math.floor(stockPrice + (Math.random()*30-15))); const el = document.getElementById("s-price"); if(el) el.innerText = "₪"+stockPrice; }, 4000);

function checkUpdate() { caches.keys().then(ns => ns.forEach(n => caches.delete(n))); location.reload(true); }
function resetGame() { if(confirm("לאפס הכל?")) { localStorage.clear(); location.reload(); } }

document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
