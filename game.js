const VERSION = "3.3.1";

let money = Number(localStorage.money) || 200;
let bank = Number(localStorage.bank) || 0;
let xp = Number(localStorage.xp) || 0;
let level = Number(localStorage.level) || 1;
let stocks = Number(localStorage.stocks) || 0;
let passive = Number(localStorage.passive) || 0;
let totalWorkDone = Number(localStorage.totalWorkDone) || 0;
let stockPrice = 100;
let lastDaily = localStorage.lastDaily || "";

let myProperties = JSON.parse(localStorage.myProperties || "[]");
let myItems = JSON.parse(localStorage.myItems || "[]");
let mySkills = JSON.parse(localStorage.mySkills || "[]");
let activeTasks = JSON.parse(localStorage.activeTasks || "[]");

// --- מאגרי נתונים מורחבים ---

const allWorks = [
    // ללא כישורים
    { n: "איסוף בקבוקים", p: 50, t: 3, x: 5, req: null },
    { n: "שוטף כלים", p: 120, t: 5, x: 15, req: null },
    { n: "מנקה רחובות", p: 180, t: 6, x: 20, req: null },
    { n: "סבל", p: 250, t: 8, x: 30, req: null },
    { n: "מוכר בדוכן", p: 300, t: 7, x: 25, req: null },
    // עם כישורים
    { n: "מאבטח טיולים", p: 500, t: 10, x: 50, req: "רישיון נשק" },
    { n: "נהג מונית", p: 700, t: 12, x: 65, req: "רישיון נהיגה" },
    { n: "טכנאי מחשבים", p: 1100, t: 15, x: 100, req: "קורס טכנאי" },
    { n: "מנהל רשת", p: 2500, t: 25, x: 250, req: "ניהול מערכות" },
    { n: "מפתח FullStack", p: 5000, t: 40, x: 500, req: "תואר במדעי המחשב" }
];

const allSkills = [
    { n: "רישיון נשק", cost: 2000 }, { n: "רישיון נהיגה", cost: 4000 },
    { n: "קורס טכנאי", cost: 6000 }, { n: "ניהול מערכות", cost: 12000 },
    { n: "תואר במדעי המחשב", cost: 25000 }, { n: "קורס שיווק", cost: 3000 },
    { n: "רישיון מלגזה", cost: 5000 }, { n: "ניהול פיננסי", cost: 15000 },
    { n: "אנגלית עסקית", cost: 3500 }, { n: "עיצוב גרפי", cost: 7000 }
];

const itemPool = [
    { n: "אוזניות", price: 300, p: 2 }, { n: "שעון", price: 900, p: 10 },
    { n: "טאבלט", price: 2500, p: 40 }, { n: "מחשב", price: 6000, p: 120 },
    { n: "קורקינט", price: 4000, p: 80 }, { n: "מקרן", price: 3500, p: 60 },
    { n: "קונסולה", price: 2800, p: 45 }, { n: "רמקול", price: 1200, p: 15 },
    { n: "מצלמה", price: 5000, p: 110 }, { n: "טאבלט גרפי", price: 4500, p: 95 }
];

const propPool = [
    { n: "מחסן", cost: 6000, p: 40 }, { n: "דוכן", cost: 14000, p: 110 },
    { n: "חניה", cost: 25000, p: 250 }, { n: "דירת חדר", cost: 80000, p: 700 },
    { n: "דירת 3 חדרים", cost: 250000, p: 2200 }, { n: "חנות", cost: 450000, p: 4500 },
    { n: "בניין", cost: 1800000, p: 19000 }, { n: "קניון", cost: 5000000, p: 60000 },
    { n: "מפעל", cost: 3500000, p: 40000 }, { n: "ווילה", cost: 900000, p: 9500 }
];

// --- לוגיקה ---

function save() {
    localStorage.money = money; localStorage.bank = bank;
    localStorage.xp = xp; localStorage.level = level;
    localStorage.passive = passive; localStorage.totalWorkDone = totalWorkDone;
    localStorage.myProperties = JSON.stringify(myProperties);
    localStorage.myItems = JSON.stringify(myItems);
    localStorage.mySkills = JSON.stringify(mySkills);
    localStorage.activeTasks = JSON.stringify(activeTasks);
    localStorage.appVersion = VERSION;
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("level").innerText = level;
    document.getElementById("propertyCount").innerText = myProperties.length;
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
                    <p>📈 הכנסה פסיבית: <b class="gain">${passive}₪</b></p>
                    <p>💼 עבודות: ${totalWorkDone}</p>
                    <p>🏘️ נכסים: ${myProperties.length}</p>
                    <p>🎓 כישורים: ${mySkills.length}</p>
                </div>
                <hr>
                <div class="inventory-box">
                    <b>החזקות:</b> ${myItems.map(i=>i.n).join(", ") || "אין פריטים"}
                </div>
            </div>`;
    }
    else if (tab === 'work') {
        let h = `<h3>💼 לוח דרושים</h3><div class="xpbar"><div id="wb" style="width:0%; height:100%; background:#22c55e;"></div></div>`;
        allWorks.forEach(w => {
            const locked = w.req && !mySkills.includes(w.req);
            h += `<button class="action ${locked?'disabled':''}" onclick="${locked?`message('דרוש: ${w.req}','loss')`:`runWork('${w.n}', ${w.p}, ${w.t}, ${w.x})`}">
                ${w.n} (${w.p}₪) ${locked?'🔒':''}</button>`;
        });
        c.innerHTML = h;
    }
    else if (tab === 'skills') {
        allSkills.forEach(s => {
            const owned = mySkills.includes(s.n);
            c.innerHTML += `<div class="card"><b>${s.n}</b> - ${s.cost}₪
            <button class="action ${owned?'disabled':''}" onclick="buySkill('${s.n}', ${s.cost})">${owned?'נלמד':'למד כעת'}</button></div>`;
        });
    }
    else if (tab === 'market') {
        itemPool.slice(0, 10).forEach((i, idx) => {
            c.innerHTML += `<div class="card"><b>${i.n}</b> - ${i.price}₪<br>
            <button class="action" onclick="buyItem(${idx})">קנה מוצר</button></div>`;
        });
    }
    else if (tab === 'realestate') {
        propPool.slice(0, 10).forEach((p, idx) => {
            c.innerHTML += `<div class="card"><b>${p.n}</b> - ${p.cost}₪<br>
            <button class="action" onclick="buyProp(${idx})">קנה נכס</button></div>`;
        });
    }
    else if (tab === 'install') {
        c.innerHTML = `<div class="card"><h3>📲 התקנה</h3><p>כדי להפוך את האתר לאפליקציה:<br>1. לחץ על כפתור השיתוף/אפשרויות.<br>2. בחר <b>"הוסף למסך הבית"</b>.</p></div>`;
    }
    // שאר הטאבים (בנק, בורסה, משימות) נשארים מהגרסה הקודמת...
    // הקוד המלא יכלול את התיקונים לבורסה ומשימות במקביל
}

let working = false;
function runWork(n, p, t, x) {
    if (working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let inter = setInterval(() => {
        s++; if(bar) bar.style.width = (s/t*100) + "%";
        if (s >= t) {
            clearInterval(inter); working = false;
            money += p; totalWorkDone++; passive += 1;
            addXP(x); if(bar) bar.style.width = "0%";
            updateUI();
        }
    }, 1000);
}

function buySkill(n, c) {
    if (money < c) return;
    money -= c; mySkills.push(n);
    updateUI(); openTab('skills');
}

function addXP(v) {
    xp += v;
    if (xp >= 100) {
        xp -= 100; level++;
        let prize = 1000 + (level * 200);
        money += prize;
        alert(`רמה ${level}! קיבלת בונוס: ${prize}₪`);
    }
    updateUI();
}

function checkUpdate() {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
    location.reload(true);
}

function resetGame() { if(confirm("לאפס הכל?")) { localStorage.clear(); location.reload(); } }

document.addEventListener("DOMContentLoaded", () => {
    updateUI(); openTab('home');
});
