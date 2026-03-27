const VERSION = "3.4.0";

// משתני ליבה
let money = Number(localStorage.money) || 500;
let bank = Number(localStorage.bank) || 0;
let xp = Number(localStorage.xp) || 0;
let level = Number(localStorage.level) || 1;
let stocks = Number(localStorage.stocks) || 0;
let passive = Number(localStorage.passive) || 0;
let totalWorkDone = Number(localStorage.totalWorkDone) || 0;
let stockPrice = 100;
let lastGiftTime = Number(localStorage.lastGiftTime) || 0;

let myProperties = JSON.parse(localStorage.myProperties || "[]");
let myItems = JSON.parse(localStorage.myItems || "[]");
let mySkills = JSON.parse(localStorage.mySkills || "[]");
let activeTasks = JSON.parse(localStorage.activeTasks || "[]");

// --- מאגרי נתונים עם אייקונים ---
const allSkills = [
    { n: "רישיון נשק", cost: 2500, i: "🔫" }, { n: "רישיון נהיגה", cost: 4500, i: "🚗" },
    { n: "קורס טכנאי", cost: 7000, i: "💻" }, { n: "ניהול מערכות", cost: 14000, i: "🖥️" },
    { n: "תואר אקדמי", cost: 30000, i: "🎓" }, { n: "שיווק", cost: 5000, i: "📢" },
    { n: "פיננסים", cost: 15000, i: "📊" }, { n: "בישול", cost: 3000, i: "🍳" },
    { n: "עיצוב", cost: 8000, i: "🎨" }, { n: "מכירות", cost: 4000, i: "🤝" }
];

const itemPool = [
    { n: "שעון", price: 800, p: 10, i: "⌚" }, { n: "טאבלט", price: 2400, p: 45, i: "📱" },
    { n: "מחשב", price: 6500, p: 130, i: "💻" }, { n: "אוזניות", price: 1200, p: 25, i: "🎧" },
    { n: "קורקינט", price: 3800, p: 85, i: "🛴" }, { n: "מצלמה", price: 5500, p: 150, i: "📷" },
    { n: "VR", price: 3200, p: 70, i: "🥽" }, { n: "רמקול", price: 1500, p: 35, i: "🔊" },
    { n: "טלוויזיה", price: 7000, p: 200, i: "📺" }, { n: "אופניים", price: 5000, p: 110, i: "🚲" }
];

const propPool = [
    { n: "מחסן", cost: 8000, p: 60, i: "📦" }, { n: "דוכן", cost: 18000, p: 150, i: "🌭" },
    { n: "חניה", cost: 35000, p: 350, i: "🅿️" }, { n: "דירה", cost: 120000, p: 950, i: "🏠" },
    { n: "חנות", cost: 550000, p: 5200, i: "🏬" }, { n: "וילה", cost: 1400000, p: 15000, i: "🏡" },
    { n: "בניין", cost: 3000000, p: 40000, i: "🏢" }, { n: "מפעל", cost: 5000000, p: 75000, i: "🏭" },
    { n: "קניון", cost: 9500000, p: 140000, i: "🏗️" }, { n: "מלון", cost: 15000000, p: 250000, i: "🏨" }
];

const allWorks = [
    { n: "שוטף כלים", p: 120, t: 4, x: 15, req: null },
    { n: "שליח", p: 220, t: 6, x: 25, req: "רישיון נהיגה" },
    { n: "מאבטח", p: 650, t: 10, x: 60, req: "רישיון נשק" },
    { n: "טכנאי", p: 1400, t: 15, x: 120, req: "קורס טכנאי" },
    { n: "מתכנת", p: 6000, t: 40, x: 600, req: "תואר אקדמי" }
];

// --- לוגיקה מרכזית ---

function save() {
    localStorage.money = money; localStorage.bank = bank;
    localStorage.xp = xp; localStorage.level = level;
    localStorage.passive = passive; localStorage.totalWorkDone = totalWorkDone;
    localStorage.lastGiftTime = lastGiftTime;
    localStorage.myProperties = JSON.stringify(myProperties);
    localStorage.myItems = JSON.stringify(myItems);
    localStorage.mySkills = JSON.stringify(mySkills);
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("level").innerText = level;
    document.getElementById("passive-ui").innerText = passive.toLocaleString();
    document.getElementById("xpfill").style.width = (xp % 100) + "%";
    save();
}

function message(t, cls = '') {
    const m = document.getElementById("message");
    m.innerText = t; m.className = cls;
}

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (btn) btn.classList.add("active");

    const c = document.getElementById("content");
    c.innerHTML = "";

    if (tab === 'home') {
        c.innerHTML = `
            <div class="card">
                <h3>🏠 לוח בקרה</h3>
                <p>📈 הכנסה פסיבית כל 10 שניות: <b class="gain">${passive}₪</b></p>
                <div id="gift-section"></div>
                <div class="inventory-box">
                    <b>חפצים:</b> ${myItems.map(i=>i.i).join(" ")} <br>
                    <b>נדל"ן:</b> ${myProperties.map(p=>p.i).join(" ")}
                </div>
            </div>`;
        updateGiftButton();
    }
    else if (tab === 'work') {
        let h = `<h3>💼 עבודה</h3><div class="xpbar"><div id="wb" style="width:0%; background:#22c55e; height:100%;"></div></div>`;
        allWorks.forEach(w => {
            const locked = w.req && !mySkills.includes(w.req);
            h += `<button class="action ${locked?'disabled':''}" onclick="${locked?'':`runWork(${w.p},${w.t},${w.x})`}">
                ${w.n} (${w.p}₪) ${locked?'🔒':''}</button>`;
        });
        c.innerHTML = h;
    }
    else if (tab === 'skills') {
        allSkills.forEach(s => {
            const owned = mySkills.includes(s.n);
            c.innerHTML += `<div class="card"> ${s.i} <b>${s.n}</b> - ${s.cost}₪
            <button class="action ${owned?'disabled':''}" onclick="buySkill('${s.n}', ${s.cost})">${owned?'נרכש':'למד כעת'}</button></div>`;
        });
    }
    else if (tab === 'realestate') {
        propPool.forEach(p => {
            c.innerHTML += `<div class="card"> ${p.i} <b>${p.n}</b> - ${p.cost}₪ <br> שכירות: ${p.p}₪
            <button class="action" onclick="buyProp('${p.n}',${p.cost},${p.p})">קנה נכס</button></div>`;
        });
    }
    else if (tab === 'market') {
        itemPool.forEach(p => {
            c.innerHTML += `<div class="card"> ${p.i} <b>${p.n}</b> - ${p.price}₪ <br> בונוס: ${p.p}₪
            <button class="action" onclick="buyItem('${p.n}',${p.price},${p.p})">קנה מוצר</button></div>`;
        });
    }
    else if (tab === 'stock') {
        c.innerHTML = `<div class="card"><h3>💹 בורסה חיה</h3><h1 id="stock-price">₪${stockPrice}</h1>
        <p>מניות ברשותך: <span id="my-stocks">${stocks}</span></p>
        <button class="action" onclick="buyStock()">קנה</button>
        <button class="action" style="background:#475569" onclick="sellStock()">מכור</button></div>`;
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input id="bAmt" type="number" placeholder="סכום"><br>
        <button class="action" onclick="doBank('dep')">הפקדה</button>
        <button class="action" style="background:#475569" onclick="doBank('wit')">משיכה</button></div>`;
    }
}

// --- פעולות ---

let working = false;
function runWork(p, t, x) {
    if (working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let inter = setInterval(() => {
        s++; if(bar) bar.style.width = (s/t*100) + "%";
        if (s >= t) { clearInterval(inter); working = false; money += p; totalWorkDone++; addXP(x); if(bar) bar.style.width = "0%"; updateUI(); }
    }, 1000);
}

function buySkill(n, c) {
    if (money >= c && !mySkills.includes(n)) { money -= c; mySkills.push(n); updateUI(); openTab('skills'); }
}

function buyProp(n, c, p) {
    if (money >= c) { money -= c; myProperties.push({n,i:''}); passive += p; updateUI(); }
}

function buyItem(n, c, p) {
    if (money >= c) { money -= c; myItems.push({n,i:''}); passive += p; updateUI(); }
}

function buyStock() {
    if (money >= stockPrice) { money -= stockPrice; stocks++; updateUI(); document.getElementById("my-stocks").innerText = stocks; }
}

function sellStock() {
    if (stocks > 0) { money += stockPrice; stocks--; updateUI(); document.getElementById("my-stocks").innerText = stocks; }
}

function doBank(type) {
    let a = Number(document.getElementById("bAmt").value);
    if (type === 'dep' && money >= a) { money -= a; bank += a; }
    else if (type === 'wit' && bank >= a) { bank -= a; money += a; }
    updateUI();
}

function addXP(v) {
    xp += v; if (xp >= 100) { xp -= 100; level++; money += 1500; message(`רמה ${level}! +1500₪`, "event"); }
}

// --- מערכת מתנה 8 שעות ---
function updateGiftButton() {
    const sec = document.getElementById("gift-section");
    if (!sec) return;
    const now = Date.now();
    const diff = (8 * 60 * 60 * 1000) - (now - lastGiftTime);
    
    if (diff <= 0) {
        sec.innerHTML = `<button class="action" style="background:#fbbf24; color:black;" onclick="claimGift()">🎁 קח מתנה (2,500₪)</button>`;
    } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        sec.innerHTML = `<button class="action disabled">עוד ${hours} שעות ו-${mins} דקות</button>`;
    }
}

function claimGift() {
    money += 2500; lastGiftTime = Date.now();
    message("קיבלת 2,500₪ מתנה!", "gain"); updateUI(); openTab('home');
}

// --- לופים של המערכת ---

// הכנסה פסיבית כל 10 שניות
setInterval(() => {
    if (passive > 0) { money += passive; updateUI(); }
}, 10000);

// עדכון בורסה כל 5 שניות
setInterval(() => {
    stockPrice = Math.max(10, Math.floor(stockPrice + (Math.random() * 40 - 20)));
    const spUI = document.getElementById("stock-price");
    if (spUI) spUI.innerText = "₪" + stockPrice;
}, 5000);

function checkUpdate() { caches.keys().then(k => k.forEach(x => caches.delete(x))); location.reload(true); }
function resetGame() { if(confirm("לאפס?")) { localStorage.clear(); location.reload(); } }

document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
