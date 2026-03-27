const VERSION = "3.4.9";

function load(k, d) { try { return localStorage[k] ? JSON.parse(localStorage[k]) : d; } catch { return d; } }

let money = load('money', 1500), bank = load('bank', 0), xp = load('xp', 0), level = load('level', 1);
let stocks = load('stocks', 0), passive = load('passive', 0), totalWorkDone = load('totalWorkDone', 0);
let lastGiftTime = load('lastGiftTime', 0), myProperties = load('myProperties', []), myItems = load('myItems', []);
let mySkills = load('mySkills', []), jobExp = load('jobExp', {}), stockPrice = 100;
let currentTaskId = load('currentTaskId', 0);

// דאטה מורחב
const estateData = [
    { n: "מחסן", cost: 8500, p: 70, i: "📦" }, { n: "דוכן", cost: 22000, p: 190, i: "🌭" },
    { n: "חניה", cost: 45000, p: 420, i: "🅿️" }, { n: "דירה", cost: 160000, p: 1300, i: "🏠" },
    { n: "משרד", cost: 450000, p: 4000, i: "🏢" }, { n: "חנות קניון", cost: 850000, p: 8500, i: "🏪" },
    { n: "וילה", cost: 2000000, p: 22000, i: "🏡" }, { n: "אי פרטי", cost: 15000000, p: 180000, i: "🏝️" }
];

const marketData = [
    { n: "שעון", price: 950, p: 15, i: "⌚" }, { n: "טאבלט", price: 2900, p: 55, i: "📱" },
    { n: "מחשב", price: 7800, p: 160, i: "💻" }, { n: "רמקול", price: 1500, p: 35, i: "🔊" },
    { n: "קורקינט", price: 4000, p: 90, i: "🛴" }, { n: "רכב ספורט", price: 350000, p: 2500, i: "🏎️" }
];

const tasksList = [
    { id: 0, txt: "בצע 5 עבודות", goal: 5, prize: 2000 },
    { id: 1, txt: "צבור 10,000₪ בבנק", goal: 10000, prize: 5000 },
    { id: 2, txt: "קנה 3 נכסי נדלן", goal: 3, prize: 10000 },
    { id: 3, txt: "הגע לרמה 5", goal: 5, prize: 20000 }
];

function notify(text, type = '') {
    const el = document.getElementById("msg-text");
    el.innerText = text;
    el.className = type; // gain, loss, event
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
    const c = document.getElementById("content");
    c.innerHTML = "";

    if (tab === 'home') {
        c.innerHTML = `
            <div class="card">
                <h3>🏠 לוח בקרה</h3>
                <p style="font-size:10px; color:#64748b">גרסה: ${VERSION}</p>
                <div class="stats-grid">
                    <p>סה"כ פסיבי: <b class="gain">${passive}₪</b></p>
                    <p>עבודות: ${totalWorkDone}</p>
                </div>
                <div id="gift-box"></div>
                <div class="inventory-section">
                    <h4>🏗️ נכסי נדל"ן (${myProperties.length}):</h4>
                    <div class="inv-items">${myProperties.map(p=>`<span>${p.i} ${p.n}</span>`).join("") || "אין"}</div>
                    <h4>🛒 פריטי שוק (${myItems.length}):</h4>
                    <div class="inv-items">${myItems.map(i=>`<span>${i.i} ${i.n}</span>`).join("") || "אין"}</div>
                </div>
            </div>`;
        renderGift();
    } 
    else if (tab === 'work') {
        let h = `<h3>💼 עבודה</h3><div class="xpbar"><div id="wb" style="width:0%; background:#22c55e; height:100%;"></div></div>`;
        const works = [
            { id: "cleaner", n: "שוטף כלים", p: 130, t: 4, x: 15, pass: 2 },
            { id: "delivery", n: "שליח", p: 250, t: 6, x: 25, pass: 5 },
            { id: "guard", n: "מאבטח", p: 680, t: 10, x: 65, pass: 15 }
        ];
        works.forEach(w => {
            h += `<div class="card"><b>${w.n}</b> (${w.p}₪) <br><small>בונוס פסיבי: +${w.pass}₪</small>
            <button class="action" onclick="runWork('${w.id}',${w.p},${w.t},${w.x},${w.pass})">בצע עבודה</button></div>`;
        });
        c.innerHTML = h;
    }
    else if (tab === 'tasks') {
        const t = tasksList[currentTaskId] || {txt: "כל המשימות הושלמו!", goal: 0, prize: 0};
        let prog = 0;
        if(currentTaskId === 0) prog = totalWorkDone;
        if(currentTaskId === 1) prog = bank;
        if(currentTaskId === 2) prog = myProperties.length;
        if(currentTaskId === 3) prog = level;

        const canClaim = prog >= t.goal && t.goal > 0;
        c.innerHTML = `<div class="card"><h3>🎯 משימה פעילה</h3>
            <p>${t.txt}</p>
            <p>התקדמות: ${prog}/${t.goal}</p>
            <button class="action ${!canClaim?'disabled':''}" onclick="claimTask(${t.prize})">קבל פרס (${t.prize}₪)</button>
        </div>`;
    }
    else if (tab === 'realestate') {
        estateData.forEach(p => {
            c.innerHTML += `<div class="card">${p.i} <b>${p.n}</b> - ${p.cost.toLocaleString()}₪<br>שכירות: +${p.p}₪
            <button class="action" onclick="buyProp('${p.n}',${p.cost},${p.p},'${p.i}')">קנה נכס</button></div>`;
        });
    }
    // שאר הטאבים (בורסה, בנק וכו') נשארים כמו בגרסה קודמת...
}

let working = false;
function runWork(id, p, t, x, passBonus) {
    if (working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let inter = setInterval(() => {
        s++; if(bar) bar.style.width = (s/t*100) + "%";
        if (s >= t) { 
            clearInterval(inter); working = false; 
            money += p; passive += passBonus; totalWorkDone++;
            addXP(x); if(bar) bar.style.width = "0%"; 
            notify(`סיימת עבודה! הרווחת ${p}₪ ובונוס פסיבי`, "gain");
            updateUI(); openTab('work');
        }
    }, 1000);
}

function buyProp(n, c, p, i) {
    if (money >= c) { money -= c; myProperties.push({n,i}); passive += p; notify(`רכשת ${n}!`, "gain"); updateUI(); }
    else { notify("אין לך מספיק כסף!", "loss"); }
}

function addXP(v) {
    xp += v; 
    if (xp >= 100) { 
        xp -= 100; level++; let bonus = level * 2000; money += bonus;
        notify(`עלית לרמה ${level}! בונוס: ${bonus}₪`, "event"); 
    }
}

function claimTask(prize) {
    money += prize; currentTaskId++; notify("משימה הושלמה! הבאה בתור פתוחה", "event"); updateUI(); openTab('tasks');
}

setInterval(() => { if (passive > 0) { money += (passive/10); updateUI(); } }, 1000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
