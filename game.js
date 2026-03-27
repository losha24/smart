const VERSION = "3.4.8";

// טעינה בטוחה
function load(k, d) { try { return localStorage[k] ? JSON.parse(localStorage[k]) : d; } catch { return d; } }

let money = load('money', 1500), bank = load('bank', 0), xp = load('xp', 0), level = load('level', 1);
let stocks = load('stocks', 0), passive = load('passive', 0), totalWorkDone = load('totalWorkDone', 0);
let lastGiftTime = load('lastGiftTime', 0), myProperties = load('myProperties', []), myItems = load('myItems', []);
let mySkills = load('mySkills', []), jobExp = load('jobExp', {}), stockPrice = 100;

// דאטה מלא עם אייקונים ותוכן
const skillsData = [
    { n: "רישיון נשק", cost: 2500, i: "🔫" }, { n: "רישיון נהיגה", cost: 4500, i: "🚗" },
    { n: "קורס טכנאי", cost: 7500, i: "💻" }, { n: "ניהול מערכות", cost: 15000, i: "🖥️" },
    { n: "תואר אקדמי", cost: 35000, i: "🎓" }, { n: "שיווק דיגיטלי", cost: 5500, i: "📢" }
];

const worksData = [
    { id: "cleaner", n: "שוטף כלים", p: 130, t: 4, x: 15, req: null, next: "טבח מיומן" },
    { id: "delivery", n: "שליח", p: 250, t: 6, x: 25, req: "רישיון נהיגה", next: "נהג הפצה" },
    { id: "guard", n: "מאבטח", p: 680, t: 10, x: 65, req: "רישיון נשק", next: "קצין ביטחון" },
    { id: "tech", n: "טכנאי", p: 1500, t: 15, x: 130, req: "קורס טכנאי", next: "ראש צוות טכני" }
];

const estateData = [
    { n: "מחסן", cost: 8500, p: 70, i: "📦" }, { n: "דוכן", cost: 20000, p: 180, i: "🌭" },
    { n: "חניה", cost: 40000, p: 400, i: "🅿️" }, { n: "דירה", cost: 150000, p: 1200, i: "🏠" }
];

const marketData = [
    { n: "שעון", price: 900, p: 15, i: "⌚" }, { n: "טאבלט", price: 2800, p: 50, i: "📱" },
    { n: "מחשב", price: 7500, p: 150, i: "💻" }
];

function save() {
    const d = { money, bank, xp, level, stocks, passive, totalWorkDone, lastGiftTime, myProperties, myItems, mySkills, jobExp };
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
    const c = document.getElementById("content");
    c.innerHTML = "";

    if (tab === 'home') {
        c.innerHTML = `<div class="card"><h3>🏠 בית</h3>
            <div class="stats-grid"><p>פסיבי: <b>${passive}₪</b></p><p>עבודות: ${totalWorkDone}</p></div>
            <div id="gift-box"></div>
            <div class="inventory-box">${myProperties.map(p=>p.i).join("")} ${myItems.map(i=>i.i).join("")}</div></div>`;
        renderGift();
    } else if (tab === 'work') {
        let h = `<h3>💼 עבודה</h3><div class="xpbar"><div id="wb" style="width:0%; background:#22c55e; height:100%;"></div></div>`;
        worksData.forEach(w => {
            const exp = jobExp[w.id] || 0; const locked = w.req && !mySkills.includes(w.req);
            h += `<div class="card"><b>${w.n}</b> (${w.p}₪) <br><small>ניסיון: ${exp}/15</small>
            <button class="action ${locked?'disabled':''}" onclick="${locked?'':`runWork('${w.id}',${w.p},${w.t},${w.x})`}">
            ${locked?'🔒 דרוש '+w.req:(working?'עובד...':'בצע עבודה')}</button></div>`;
        });
        c.innerHTML = h;
    } else if (tab === 'skills') {
        skillsData.forEach(s => {
            const owned = mySkills.includes(s.n);
            c.innerHTML += `<div class="card">${s.i} <b>${s.n}</b> - ${s.cost}₪<br>
            <button class="action ${owned?'disabled':''}" onclick="buySkill('${s.n}',${s.cost})">${owned?'נרכש':'למד'}</button></div>`;
        });
    } else if (tab === 'realestate') {
        estateData.forEach(p => {
            c.innerHTML += `<div class="card">${p.i} <b>${p.n}</b> - ${p.cost.toLocaleString()}₪<br>שכירות: +${p.p}₪
            <button class="action" onclick="buyProp('${p.n}',${p.cost},${p.p},'${p.i}')">קנה נכס</button></div>`;
        });
    } else if (tab === 'market') {
        marketData.forEach(m => {
            c.innerHTML += `<div class="card">${m.i} <b>${m.n}</b> - ${m.price.toLocaleString()}₪<br>בונוס: +${m.p}₪
            <button class="action" onclick="buyItem('${m.n}',${m.price},${m.p},'${m.i}')">קנה פריט</button></div>`;
        });
    } else if (tab === 'stock') {
        c.innerHTML = `<div class="card"><h3>💹 בורסה</h3><h1 id="s-price">₪${stockPrice}</h1><p>מניות: <span id="s-own">${stocks}</span></p>
        <button class="action" onclick="tradeStock('buy')">קנה</button><button class="action" style="background:#475569" onclick="tradeStock('sell')">מכור</button></div>`;
    } else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input id="bAmt" type="number" placeholder="סכום">
        <button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button></div>`;
    } else if (tab === 'tasks') {
        const goal = 10; const prog = totalWorkDone % goal;
        c.innerHTML = `<div class="card"><h3>🎯 משימות</h3><p>בצע ${goal} עבודות לבונוס 5,000₪</p>
        <p>התקדמות: ${prog}/${goal}</p><button class="action ${prog!==0 || totalWorkDone===0?'disabled':''}" onclick="claimTask()">קח בונוס</button></div>`;
    } else if (tab === 'install') {
        c.innerHTML = `<div class="card"><h3>📲 התקנה</h3><p>1. פתח תפריט דפדפן<br>2. בחר "הוסף למסך הבית"<br>3. האפליקציה תופיע כקיצור דרך!</p></div>`;
    }
}

// לוגיקת פעולות
let working = false;
function runWork(id, p, t, x) {
    if (working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let inter = setInterval(() => {
        s++; if(bar) bar.style.width = (s/t*100) + "%";
        if (s >= t) { clearInterval(inter); working = false; money += p; jobExp[id] = (jobExp[id] || 0) + 1; addXP(x); totalWorkDone++; updateUI(); openTab('work'); }
    }, 1000);
}

function buySkill(n, c) { if (money >= c && !mySkills.includes(n)) { money -= c; mySkills.push(n); updateUI(); openTab('skills'); } }
function buyProp(n, c, p, i) { if (money >= c) { money -= c; myProperties.push({n,i}); passive += p; updateUI(); } }
function buyItem(n, c, p, i) { if (money >= c) { money -= c; myItems.push({n,i}); passive += p; updateUI(); } }
function tradeStock(type) {
    if (type === 'buy' && money >= stockPrice) { money -= stockPrice; stocks++; }
    else if (type === 'sell' && stocks > 0) { money += stockPrice; stocks--; }
    updateUI(); document.getElementById("s-own").innerText = stocks;
}
function bankOp(t) {
    let a = Number(document.getElementById("bAmt").value);
    if (t === 'dep' && money >= a) { money -= a; bank += a; } else if (t === 'wit' && bank >= a) { bank -= a; money += a; } updateUI();
}
function addXP(v) { xp += v; if (xp >= 100) { xp -= 100; level++; money += 3000; alert("LEVEL UP!"); } }
function claimTask() { money += 5000; totalWorkDone++; updateUI(); openTab('tasks'); }
function renderGift() {
    const area = document.getElementById("gift-box"); if(!area) return;
    const now = Date.now(); if (now - lastGiftTime >= 8*60*60*1000) {
        area.innerHTML = `<button class="action" style="background:#fbbf24; color:black" onclick="claimGift()">🎁 מתנה יומית (4,000₪)</button>`;
    } else { area.innerHTML = `<button class="action disabled">המתנה תחזור בקרוב</button>`; }
}
function claimGift() { money += 4000; lastGiftTime = Date.now(); updateUI(); openTab('home'); }

setInterval(() => { if (passive > 0) { money += (passive/10); updateUI(); } }, 1000);
setInterval(() => {
    stockPrice = Math.max(10, Math.floor(stockPrice + (Math.random() * 30 - 15)));
    const el = document.getElementById("s-price"); if (el) el.innerText = "₪" + stockPrice;
}, 4000);

function checkUpdate() { caches.keys().then(ns => ns.forEach(n => caches.delete(n))); location.reload(true); }
function resetGame() { if(confirm("לאפס?")) { localStorage.clear(); location.reload(); } }
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
