const VERSION = "3.2.4";

let money = Number(localStorage.money) || 100;
let bank = Number(localStorage.bank) || 0;
let xp = Number(localStorage.xp) || 0;
let level = Number(localStorage.level) || 1;
let stocks = Number(localStorage.stocks) || 0;
let passive = Number(localStorage.passive) || 0;
let totalWorkDone = Number(localStorage.totalWorkDone) || 0;
let stockPrice = 100;
let myProperties = JSON.parse(localStorage.myProperties || "[]");
let myItems = JSON.parse(localStorage.myItems || "[]");
let activeTasks = JSON.parse(localStorage.activeTasks || "[]");
let working = false;

// רשימות מידע
const worksList = [
    { n: "אבטחה", p: 150, t: 5, x: 20 },
    { n: "משלוחים", p: 250, t: 8, x: 30 },
    { n: "תמיכה טכנית", p: 450, t: 12, x: 55 },
    { n: "תכנות PWA", p: 900, t: 20, x: 110 }
];

const propertiesList = [
    { id: 1, n: "דירת סטודיו", cost: 50000, p: 250 },
    { id: 2, n: "דירת 4 חדרים", cost: 150000, p: 900 },
    { id: 3, n: "וילה יוקרתית", cost: 600000, p: 4000 }
];

const marketItems = [
    { id: 101, n: "אופניים חשמליים", price: 2000, p: 30 },
    { id: 102, n: "מחשב גיימינג", price: 8000, p: 120 }
];

const allTasks = [
    { id: 1, desc: "בצע 3 עבודות", goal: 3, type: "work", reward: 400, xp: 40 },
    { id: 2, desc: "צבור 1,000₪ מזומן", goal: 1000, type: "cash", reward: 200, xp: 30 },
    { id: 3, desc: "הפקד כסף לבנק", goal: 1, type: "bank", reward: 150, xp: 20 }
];

function save() {
    localStorage.money = money;
    localStorage.bank = bank;
    localStorage.xp = xp;
    localStorage.level = level;
    localStorage.stocks = stocks;
    localStorage.passive = passive;
    localStorage.totalWorkDone = totalWorkDone;
    localStorage.myProperties = JSON.stringify(myProperties);
    localStorage.myItems = JSON.stringify(myItems);
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

function message(t, cls = '') {
    const m = document.getElementById("message");
    m.innerText = t; m.className = cls;
}

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (activeBtn) activeBtn.classList.add("active");

    const c = document.getElementById("content");
    c.innerHTML = "";

    if (tab === 'home') {
        c.innerHTML = `
            <div class="card">
                <h3>🏠 לוח בקרה</h3>
                <p>💰 מזומן: ${Math.floor(money)}₪</p>
                <p>🏦 בנק: ${bank}₪</p>
                <p>📈 הכנסה פסיבית: <b class="gain">${passive}₪</b></p>
                <p>🏗️ נכסים בבעלות: ${myProperties.length}</p>
                <p>💼 סה"כ עבודות: ${totalWorkDone}</p>
            </div>`;
    }
    else if (tab === 'work') {
        let h = `<h3>💼 עבודה</h3><div class="xpbar"><div id="wb" style="width:0%; height:100%; background:#22c55e;"></div></div>`;
        worksList.forEach(w => {
            h += `<button class="action" onclick="runWork('${w.n}', ${w.p}, ${w.t}, ${w.x})">${w.n} (${w.p}₪)</button>`;
        });
        c.innerHTML = h;
    }
    else if (tab === 'tasks') {
        if (activeTasks.length === 0) activeTasks = allTasks.slice(0, 3);
        let h = `<h3>🎯 משימות</h3>`;
        activeTasks.forEach((t, i) => {
            let prog = (t.type === "work") ? totalWorkDone : (t.type === "cash" ? money : 0);
            let ready = prog >= t.goal;
            h += `<div class="card">
                <p><b>${t.desc}</b> (${Math.floor(prog)}/${t.goal})</p>
                <button class="action" style="background:${ready?'#16a34a':'#475569'}" onclick="${ready?`finishTask(${i})`:`message('טרם הושלם','loss')`}">
                ${ready?'קבל פרס':'בביצוע'}</button>
            </div>`;
        });
        c.innerHTML = h;
    }
    else if (tab === 'realestate') {
        propertiesList.forEach(p => {
            c.innerHTML += `<div class="card"><b>${p.n}</b><br>מחיר: ${p.cost}₪ | שכירות: ${p.p}₪<br>
            <button class="action" onclick="buyProperty(${p.id})">קנה נכס</button></div>`;
        });
    }
    else if (tab === 'market') {
        marketItems.forEach(i => {
            const owned = myItems.some(it => it.id === i.id);
            c.innerHTML += `<div class="card"><b>${i.n}</b> - ${i.price}₪<br>
            <button class="action ${owned?'disabled':''}" onclick="buyItem(${i.id})">${owned?'בבעלותך':'קנה'}</button></div>`;
        });
    }
    else if (tab === 'stock') {
        stockPrice = Math.max(10, Math.floor(stockPrice + (Math.random()*40-20)));
        c.innerHTML = `<div class="card"><h3>💹 בורסה</h3><h2>₪${stockPrice}</h2>
        <button class="action" onclick="buyStock()">קנה מניה</button>
        <button class="action" style="background:#475569" onclick="sellStock()">מכור מניה</button></div>`;
    }
    else if (tab === 'install') {
        c.innerHTML = `<div class="card"><h3>📲 התקנה</h3><p>לחץ על "הוסף למסך הבית" בתפריט הדפדפן כדי להשתמש באפליקציה.</p></div>`;
    }
}

function runWork(n, p, t, x) {
    if (working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let inter = setInterval(() => {
        s++; if(bar) bar.style.width = (s/t*100) + "%";
        if (s >= t) {
            clearInterval(inter); working = false;
            money += p; totalWorkDone++; passive += 1;
            addXP(x); if(bar) bar.style.width = "0%";
            message(`הרווחת ${p}₪!`, "gain"); updateUI();
        }
    }, 1000);
}

function buyProperty(id) {
    const p = propertiesList.find(x => x.id === id);
    if (money < p.cost) return message("אין מספיק כסף!", "loss");
    money -= p.cost; myProperties.push(p); passive += p.p;
    message("תתחדש!", "gain"); updateUI();
}

function buyItem(id) {
    const i = marketItems.find(x => x.id === id);
    if (money < i.price) return message("אין מספיק כסף!", "loss");
    money -= i.price; myItems.push(i); passive += i.p;
    message("נקנה בהצלחה!", "gain"); updateUI(); openTab('market');
}

function buyStock() {
    if (money < stockPrice) return message("אין מספיק מזומן!", "loss");
    money -= stockPrice; stocks++; updateUI(); openTab('stock');
}

function sellStock() {
    if (stocks <= 0) return message("אין מניות!", "loss");
    money += stockPrice; stocks--; updateUI(); openTab('stock');
}

function addXP(v) {
    xp += v;
    if (xp >= 100) {
        xp -= 100; level++;
        let bonus = Math.floor(Math.random() * 2000) + 500;
        money += bonus; message(`רמה ${level}! קיבלת ${bonus}₪`, "event");
    }
    updateUI();
}

function finishTask(i) {
    money += activeTasks[i].reward; addXP(activeTasks[i].xp);
    activeTasks[i] = allTasks[Math.floor(Math.random()*allTasks.length)];
    message("משימה הושלמה!", "gain"); updateUI(); openTab('tasks');
}

function resetGame() {
    if(confirm("לאפס הכל?")) { localStorage.clear(); location.reload(); }
}

function checkUpdate() {
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
    setTimeout(() => location.reload(true), 1000);
}

setInterval(() => { if (passive > 0) { money += passive; updateUI(); } }, 10000);

document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
