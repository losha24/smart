const VERSION = "3.4.6";

// משתני ליבה
let money = Number(localStorage.money) || 1200;
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
let jobExp = JSON.parse(localStorage.jobExp || "{}"); // ניסיון בקריירה

// --- דאטה ---
const skillsData = [
    { n: "רישיון נשק", cost: 2500, i: "🔫" }, { n: "רישיון נהיגה", cost: 4500, i: "🚗" },
    { n: "קורס טכנאי", cost: 7500, i: "💻" }, { n: "ניהול מערכות", cost: 15000, i: "🖥️" },
    { n: "תואר אקדמי", cost: 35000, i: "🎓" }, { n: "שיווק דיגיטלי", cost: 5500, i: "📢" },
    { n: "ניהול פיננסי", cost: 18000, i: "📊" }, { n: "רישיון מלגזה", cost: 6000, i: "🚜" },
    { n: "אנגלית עסקית", cost: 4000, i: "🌎" }, { n: "עיצוב גרפי", cost: 9000, i: "🎨" }
];

const worksData = [
    { id: "cleaner", n: "שוטף כלים", p: 130, t: 4, x: 15, req: null, next: "טבח מיומן" },
    { id: "delivery", n: "שליח", p: 250, t: 6, x: 25, req: "רישיון נהיגה", next: "נהג הפצה" },
    { id: "guard", n: "מאבטח", p: 680, t: 10, x: 65, req: "רישיון נשק", next: "קצין ביטחון" },
    { id: "tech", n: "טכנאי", p: 1500, t: 15, x: 130, req: "קורס טכנאי", next: "ראש צוות טכני" },
    { id: "dev", n: "מתכנת PWA", p: 6500, t: 40, x: 650, req: "תואר אקדמי", next: "ארכיטקט תוכנה" }
];

const estateData = [
    { n: "מחסן", cost: 8500, p: 70, i: "📦" }, { n: "דוכן מיץ", cost: 20000, p: 180, i: "🌭" },
    { n: "חניה", cost: 40000, p: 400, i: "🅿️" }, { n: "דירת סטודיו", cost: 150000, p: 1200, i: "🏠" },
    { n: "חנות", cost: 600000, p: 5800, i: "🏬" }, { n: "וילה", cost: 1600000, p: 18000, i: "🏡" },
    { n: "בניין", cost: 3500000, p: 45000, i: "🏢" }, { n: "מפעל", cost: 6000000, p: 85000, i: "🏭" },
    { n: "קניון", cost: 10000000, p: 160000, i: "🏗️" }, { n: "מלון בוטיק", cost: 20000000, p: 350000, i: "🏨" }
];

const marketData = [
    { n: "שעון חכם", price: 900, p: 15, i: "⌚" }, { n: "טאבלט", price: 2800, p: 50, i: "📱" },
    { n: "מחשב נייד", price: 7500, p: 150, i: "💻" }, { n: "אוזניות", price: 1400, p: 30, i: "🎧" },
    { n: "קורקינט", price: 4500, p: 100, i: "🛴" }, { n: "מצלמה", price: 6000, p: 180, i: "📷" },
    { n: "VR", price: 3800, p: 85, i: "🥽" }, { n: "רמקול", price: 1800, p: 40, i: "🔊" },
    { n: "טלוויזיה 4K", price: 8500, p: 250, i: "📺" }, { n: "אופניים", price: 5500, p: 130, i: "🚲" }
];

// --- לוגיקה ---

function save() {
    const s = { money, bank, xp, level, passive, totalWorkDone, lastGiftTime, myProperties, myItems, mySkills, jobExp };
    for (let k in s) localStorage[k] = JSON.stringify(s[k]);
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
    const btn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (btn) btn.classList.add("active");

    const c = document.getElementById("content");
    c.innerHTML = "";

    if (tab === 'home') {
        c.innerHTML = `
            <div class="card">
                <h3>🏠 לוח בקרה</h3>
                <div class="stats-grid">
                    <p>הכנסה פסיבית: <b class="gain">${passive}₪</b></p>
                    <p>דרגה: ${level}</p>
                    <p>נכסים: ${myProperties.length}</p>
                    <p>כישורים: ${mySkills.length}</p>
                </div>
                <div id="gift-box"></div>
                <div class="inventory-box">
                    <b>נדל"ן:</b> ${myProperties.map(p=>p.i).join(" ") || "🏠"} <br>
                    <b>חפצים:</b> ${myItems.map(i=>i.i).join(" ") || "📦"}
                </div>
            </div>`;
        checkGift();
    }
    else if (tab === 'work') {
        let h = `<h3>💼 עבודה וקריירה</h3><div class="xpbar"><div id="wb" style="width:0%; background:#22c55e; height:100%;"></div></div>`;
        worksData.forEach(w => {
            const exp = jobExp[w.id] || 0;
            const locked = w.req && !mySkills.includes(w.req);
            const canPromo = exp >= 15 && w.next;
            h += `<div class="card">
                <b>${w.n}</b> (${w.p}₪) <br>
                <small>ניסיון: ${exp}/15</small>
                <button class="action ${locked?'disabled':''}" onclick="${locked?'':`runWork('${w.id}',${w.p},${w.t},${w.x})`}">
                    ${locked?'🔒 נעול':(working?'עובד...':'עבוד')}</button>
                ${canPromo ? `<button class="action" style="background:#16a34a; margin-top:2px" onclick="promote('${w.id}')">⬆️ קבל קידום!</button>` : ''}
            </div>`;
        });
        c.innerHTML = h;
    }
    else if (tab === 'skills') {
        skillsData.forEach(s => {
            const owned = mySkills.includes(s.n);
            c.innerHTML += `<div class="card">${s.i} <b>${s.n}</b> - ${s.cost}₪<br>
            <button class="action ${owned?'disabled':''}" onclick="buySkill('${s.n}',${s.cost})">${owned?'נרכש':'למד'}</button></div>`;
        });
    }
    else if (tab === 'realestate') {
        estateData.forEach(p => {
            c.innerHTML += `<div class="card">${p.i} <b>${p.n}</b> - ${p.cost.toLocaleString()}₪<br>שכירות: +${p.p}₪
            <button class="action" onclick="buyProp('${p.n}',${p.cost},${p.p},'${p.i}')">קנה נכס</button></div>`;
        });
    }
    else if (tab === 'market') {
        marketData.forEach(m => {
            c.innerHTML += `<div class="card">${m.i} <b>${m.n}</b> - ${m.price.toLocaleString()}₪<br>פסיבי: +${m.p}₪
            <button class="action" onclick="buyItem('${m.n}',${m.price},${m.p},'${m.i}')">קנה פריט</button></div>`;
        });
    }
    else if (tab === 'stock') {
        c.innerHTML = `<div class="card"><h3>💹 בורסה</h3><h1 id="s-price">₪${stockPrice}</h1>
        <p>מניות: <span id="s-own">${stocks}</span></p>
        <button class="action" onclick="tradeStock('buy')">קנה</button>
        <button class="action" style="background:#475569" onclick="tradeStock('sell')">מכור</button></div>`;
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input id="bAmt" type="number" placeholder="סכום">
        <button class="action" onclick="bankOp('dep')">הפקדה</button>
        <button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button></div>`;
    }
    else if (tab === 'tasks') {
        c.innerHTML = `<div class="card"><h3>🎯 משימות</h3><p>בצע עבודות כדי לקבל קידום בקריירה!</p></div>`;
    }
    else if (tab === 'install') {
        c.innerHTML = `<div class="card"><h3>📲 התקנה</h3><p>לחץ על "הוסף למסך הבית" בדפדפן.</p></div>`;
    }
}

// --- פעולות ---
let working = false;
function runWork(id, p, t, x) {
    if (working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let inter = setInterval(() => {
        s++; if(bar) bar.style.width = (s/t*100) + "%";
        if (s >= t) { 
            clearInterval(inter); working = false; 
            money += p; jobExp[id] = (jobExp[id] || 0) + 1;
            addXP(x); if(bar) bar.style.width = "0%"; updateUI(); openTab('work');
        }
    }, 1000);
}

function promote(id) {
    const w = worksData.find(x => x.id === id);
    if (!w.next) return;
    w.n = w.next; w.p = Math.floor(w.p * 1.7);
    jobExp[id] = 0; w.next = null; // קידום חד פעמי לכל עבודה בגרסה זו
    alert("מזל טוב על הקידום!"); updateUI(); openTab('work');
}

function buySkill(n, c) { if (money >= c && !mySkills.includes(n)) { money -= c; mySkills.push(n); updateUI(); openTab('skills'); } }
function buyProp(n, c, p, i) { if (money >= c) { money -= c; myProperties.push({n,i}); passive += p; updateUI(); } }
function buyItem(n, c, p, i) { if (money >= c) { money -= c; myItems.push({n,i}); passive += p; updateUI(); } }

function tradeStock(type) {
    if (type === 'buy' && money >= stockPrice) { money -= stockPrice; stocks++; }
    else if (type === 'sell' && stocks > 0) { money += stockPrice; stocks--; }
    document.getElementById("s-own").innerText = stocks; updateUI();
}

function bankOp(type) {
    let a = Number(document.getElementById("bAmt").value);
    if (type === 'dep' && money >= a) { money -= a; bank += a; }
    else if (type === 'wit' && bank >= a) { bank -= a; money += a; }
    updateUI();
}

function addXP(v) { xp += v; if (xp >= 100) { xp -= 100; level++; money += 2500; alert("עלית רמה! +2,500₪"); } }

function checkGift() {
    const area = document.getElementById("gift-box");
    const wait = 8 * 60 * 60 * 1000;
    const now = Date.now();
    if (now - lastGiftTime >= wait) {
        area.innerHTML = `<button class="action" style="background:#fbbf24; color:black" onclick="claimGift()">🎁 קח בונוס 8 שעות (3,500₪)</button>`;
    } else {
        const left = new Date(wait - (now - lastGiftTime));
        area.innerHTML = `<button class="action disabled">מתנה בעוד ${left.getUTCHours()}ש' ו-${left.getUTCMinutes()}ד'</button>`;
    }
}

function claimGift() { money += 3500; lastGiftTime = Date.now(); updateUI(); openTab('home'); }

// --- טיימרים ---
setInterval(() => { if (passive > 0) { money += (passive/10); updateUI(); } }, 1000);
setInterval(() => {
    stockPrice = Math.max(10, Math.floor(stockPrice + (Math.random() * 24 - 12)));
    const el = document.getElementById("s-price"); if (el) el.innerText = "₪" + stockPrice;
}, 3000);

function checkUpdate() { caches.keys().then(k => k.forEach(x => caches.delete(x))); location.reload(true); }
function resetGame() { if(confirm("לאפס?")) { localStorage.clear(); location.reload(); } }

document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
