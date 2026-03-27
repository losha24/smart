const VERSION = "3.3.5";

// משתני ליבה
let money = Number(localStorage.money) || 250;
let bank = Number(localStorage.bank) || 0;
let xp = Number(localStorage.xp) || 0;
let level = Number(localStorage.level) || 1;
let stocks = Number(localStorage.stocks) || 0;
let passive = Number(localStorage.passive) || 0;
let totalWorkDone = Number(localStorage.totalWorkDone) || 0;
let stockPrice = 100;

// נתונים שמורים
let myProperties = JSON.parse(localStorage.myProperties || "[]");
let myItems = JSON.parse(localStorage.myItems || "[]");
let mySkills = JSON.parse(localStorage.mySkills || "[]");
let activeTasks = JSON.parse(localStorage.activeTasks || "[]");
let jobExperience = JSON.parse(localStorage.jobExperience || "{}"); // ניסיון בכל עבודה

// --- מאגרי נתונים ---
const allWorks = [
    { id: "cleaner", n: "שוטף כלים", p: 120, t: 4, x: 15, req: null, next: "טבח" },
    { id: "delivery", n: "שליח", p: 200, t: 6, x: 25, req: null, next: "ראש צוות שליחים" },
    { id: "collector", n: "איסוף בקבוקים", p: 60, t: 3, x: 5, req: null, next: "קבלן מחזור" },
    { id: "cleaner_street", n: "מנקה רחובות", p: 180, t: 5, x: 20, req: null, next: "אחראי משמרת" },
    { id: "sales", n: "מוכר בדוכן", p: 300, t: 7, x: 30, req: null, next: "מנהל חנות" },
    // עם כישורים
    { id: "security", n: "מאבטח", p: 600, t: 10, x: 60, req: "רישיון נשק", next: "קצין ביטחון" },
    { id: "taxi", n: "נהג מונית", p: 850, t: 12, x: 80, req: "רישיון נהיגה", next: "נהג VIP" },
    { id: "it", n: "טכנאי מחשבים", p: 1300, t: 15, x: 120, req: "קורס טכנאי", next: "מנהל IT" },
    { id: "admin", n: "מנהל מערכות", p: 3000, t: 25, x: 300, req: "ניהול מערכות", next: "סמנכ\"ל טכנולוגיות" },
    { id: "dev", n: "מפתח PWA", p: 5500, t: 40, x: 600, req: "תואר במדעי המחשב", next: "ארכיטקט תוכנה" }
];

const allSkills = [
    { n: "רישיון נשק", cost: 2500 }, { n: "רישיון נהיגה", cost: 4500 },
    { n: "קורס טכנאי", cost: 7000 }, { n: "ניהול מערכות", cost: 14000 },
    { n: "תואר במדעי המחשב", cost: 30000 }, { n: "אנגלית עסקית", cost: 4000 },
    { n: "שיווק דיגיטלי", cost: 5500 }, { n: "ניהול פיננסי", cost: 18000 },
    { n: "עיצוב UX", cost: 8500 }, { n: "רישיון מלגזה", cost: 6000 }
];

const itemPool = [
    { n: "שעון", price: 800, p: 10 }, { n: "טאבלט", price: 2400, p: 45 },
    { n: "מחשב", price: 6500, p: 130 }, { n: "אוזניות", price: 1200, p: 25 },
    { n: "קורקינט", price: 3800, p: 85 }, { n: "מקרן", price: 4200, p: 90 },
    { n: "מצלמה", price: 5500, p: 150 }, { n: "רמקול", price: 1500, p: 35 },
    { n: "משקפי VR", price: 3200, p: 70 }, { n: "סמארטפון", price: 4800, p: 110 }
];

const propPool = [
    { n: "מחסן", cost: 8000, p: 60 }, { n: "דוכן", cost: 18000, p: 150 },
    { n: "חניה", cost: 35000, p: 350 }, { n: "דירה", cost: 95000, p: 850 },
    { n: "חנות", cost: 500000, p: 5000 }, { n: "וילה", cost: 1200000, p: 14000 },
    { n: "בניין", cost: 2500000, p: 35000 }, { n: "מפעל", cost: 4000000, p: 60000 },
    { n: "קניון", cost: 8000000, p: 120000 }, { n: "אי פרטי", cost: 25000000, p: 500000 }
];

const taskPool = [
    { desc: "בצע 10 עבודות", goal: 10, type: "work", reward: 1000, xp: 100 },
    { desc: "הפקד 5,000₪ בבנק", goal: 5000, type: "bank", reward: 800, xp: 80 },
    { desc: "קנה מוצר בשוק", goal: 1, type: "item", reward: 500, xp: 50 }
];

// --- פונקציות ליבה ---

function save() {
    const data = { money, bank, xp, level, passive, totalWorkDone, myProperties, myItems, mySkills, activeTasks, jobExperience };
    Object.keys(data).forEach(k => localStorage[k] = JSON.stringify(data[k]));
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("level").innerText = level;
    document.getElementById("propertyCount").innerText = myProperties.length;
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
                <h3>🏠 מצב חשבון</h3>
                <div class="stats-grid">
                    <p>📈 פסיבי: <b class="gain">${passive}₪</b></p>
                    <p>💼 סה"כ עבודות: ${totalWorkDone}</p>
                    <p>🏘️ נכסים: ${myProperties.length}</p>
                    <p>🎓 כישורים: ${mySkills.length}</p>
                </div>
                <div class="inventory-box">
                    <b>חפצים:</b> ${myItems.map(i=>i.n).join(", ") || "אין"}
                </div>
            </div>`;
    }
    else if (tab === 'work') {
        let h = `<h3>💼 עבודה וקריירה</h3><div class="xpbar"><div id="wb" style="width:0%;"></div></div>`;
        allWorks.forEach(w => {
            const exp = jobExperience[w.id] || 0;
            const locked = w.req && !mySkills.includes(w.req);
            const canPromote = exp >= 20;
            h += `<div class="card">
                <b>${w.n}</b> (${w.p}₪) <br>
                <small>ניסיון: ${exp}/20</small>
                <button class="action ${locked?'disabled':''}" onclick="${locked?'':`runWork('${w.id}')`}" style="width:70%">${locked?'🔒 נעול':(working?'מבצע...':'עבוד')}</button>
                ${canPromote ? `<button class="action" style="background:#16a34a; width:25%" onclick="promote('${w.id}')">⬆️</button>` : ''}
            </div>`;
        });
        c.innerHTML = h;
    }
    else if (tab === 'skills') {
        allSkills.forEach(s => {
            const owned = mySkills.includes(s.n);
            c.innerHTML += `<div class="card"><b>${s.n}</b> - ${s.cost}₪
            <button class="action ${owned?'disabled':''}" onclick="buySkill('${s.n}', ${s.cost})">${owned?'נרמד':'למד'}</button></div>`;
        });
    }
    else if (tab === 'realestate') {
        propPool.forEach((p, i) => {
            c.innerHTML += `<div class="card"><b>${p.n}</b> - ${p.cost}₪<br>
            <button class="action" onclick="buyProp(${i})">קנה נכס</button></div>`;
        });
    }
    else if (tab === 'market') {
        itemPool.forEach((p, i) => {
            c.innerHTML += `<div class="card"><b>${p.n}</b> - ${p.price}₪<br>
            <button class="action" onclick="buyItem(${i})">קנה</button></div>`;
        });
    }
    else if (tab === 'stock') {
        stockPrice = Math.max(10, Math.floor(stockPrice + (Math.random()*40-20)));
        c.innerHTML = `<div class="card"><h3>💹 בורסה</h3><h1>₪${stockPrice}</h1><p>מניות: ${stocks}</p>
        <button class="action" onclick="buyStock()">קנה</button><button class="action" onclick="sellStock()">מכור</button></div>`;
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input id="bAmt" type="number" placeholder="סכום">
        <button class="action" onclick="doBank('dep')">הפקדה</button><button class="action" onclick="doBank('wit')">משיכה</button></div>`;
    }
    else if (tab === 'tasks') {
        if (activeTasks.length === 0) activeTasks = taskPool.slice(0, 3);
        activeTasks.forEach((t, i) => {
            let prog = (t.type === 'work' ? totalWorkDone : (t.type === 'bank' ? bank : 0));
            let ready = prog >= t.goal;
            c.innerHTML += `<div class="card"><p>${t.desc} (${prog}/${t.goal})</p>
            <button class="action" style="background:${ready?'#16a34a':'#475569'}" onclick="finishTask(${i})">${ready?'קבל פרס':'בביצוע'}</button></div>`;
        });
    }
    else if (tab === 'install') {
        c.innerHTML = `<div class="card"><h3>📲 התקנה</h3><p>לחץ על "הוסף למסך הבית" בדפדפן.</p></div>`;
    }
}

let working = false;
function runWork(id) {
    if (working) return;
    const w = allWorks.find(x => x.id === id);
    working = true; let s = 0; const bar = document.getElementById("wb");
    let inter = setInterval(() => {
        s++; if(bar) bar.style.width = (s/w.t*100) + "%";
        if (s >= w.t) {
            clearInterval(inter); working = false;
            money += w.p; totalWorkDone++;
            jobExperience[id] = (jobExperience[id] || 0) + 1;
            addXP(w.x); if(bar) bar.style.width = "0%";
            message(`הרווחת ${w.p}₪!`, "gain"); updateUI(); openTab('work');
        }
    }, 1000);
}

function promote(id) {
    const w = allWorks.find(x => x.id === id);
    if (!w.next) return;
    w.n = w.next; w.p = Math.floor(w.p * 1.8);
    jobExperience[id] = 0;
    message(`קודמת ל${w.n}! המשכורת עלתה.`, "event");
    updateUI(); openTab('work');
}

function buySkill(n, c) {
    if (money < c) return message("אין מספיק כסף", "loss");
    money -= c; mySkills.push(n); updateUI(); openTab('skills');
}

function buyProp(i) {
    const p = propPool[i]; if (money < p.cost) return;
    money -= p.cost; myProperties.push(p); passive += p.p; updateUI(); openTab('realestate');
}

function buyItem(i) {
    const p = itemPool[i]; if (money < p.price) return;
    money -= p.price; myItems.push(p); passive += p.p; updateUI(); openTab('market');
}

function doBank(type) {
    let a = Number(document.getElementById("bAmt").value);
    if (type === 'dep' && money >= a) { money -= a; bank += a; }
    else if (type === 'wit' && bank >= a) { bank -= a; money += a; }
    updateUI();
}

function addXP(v) {
    xp += v; if (xp >= 100) { xp -= 100; level++; money += 1000; message(`רמה ${level}! +1000₪`, "event"); }
}

function finishTask(i) {
    money += activeTasks[i].reward; addXP(activeTasks[i].xp);
    activeTasks[i] = taskPool[Math.floor(Math.random()*taskPool.length)];
    updateUI(); openTab('tasks');
}

function checkUpdate() { caches.keys().then(k => k.forEach(x => caches.delete(x))); location.reload(true); }
function resetGame() { if(confirm("לאפס?")) { localStorage.clear(); location.reload(); } }

setInterval(() => { if (passive > 0) { money += passive; updateUI(); } }, 10000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
