const VERSION = "3.2.1";

let money = Number(localStorage.money) || 100;
let bank = Number(localStorage.bank) || 0;
let xp = Number(localStorage.xp) || 0;
let level = Number(localStorage.level) || 1;
let stocks = Number(localStorage.stocks) || 0;
let stockPrice = 100;
let workCount = Number(localStorage.workCount) || 0;
let currentTask = JSON.parse(localStorage.currentTask || 'null');

const tasksList = [
    { id: 1, desc: "עבוד 3 פעמים", goal: 3, type: "work", reward: 300, xp: 40 },
    { id: 2, desc: "הרווח 1000₪ בעבודה", goal: 1000, type: "earn", reward: 500, xp: 60 },
    { id: 3, desc: "בצע הפקדה לבנק", goal: 1, type: "bank", reward: 200, xp: 30 }
];

function save() {
    localStorage.money = money;
    localStorage.bank = bank;
    localStorage.xp = xp;
    localStorage.level = level;
    localStorage.stocks = stocks;
    localStorage.workCount = workCount;
    localStorage.currentTask = JSON.stringify(currentTask);
    localStorage.appVersion = VERSION;
}

function message(t, cls = '') {
    const m = document.getElementById("message");
    m.innerText = t; m.className = cls;
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("level").innerText = level;
    document.getElementById("stocksCount").innerText = stocks;
    document.getElementById("xpfill").style.width = (xp % 100) + "%";
    save();
}

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const b = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (b) b.classList.add("active");

    const c = document.getElementById("content");
    c.innerHTML = "";

    if (tab === 'tasks') {
        if (!currentTask) currentTask = tasksList[Math.floor(Math.random() * tasksList.length)];
        c.innerHTML = `
            <div class="card">
                <h3>🎯 משימה נוכחית</h3>
                <p>${currentTask.desc}</p>
                <button class="action" onclick="checkTaskManual()">בדוק סטטוס משימה</button>
            </div>`;
    }
    else if (tab === 'stock') {
        let vol = Math.floor(Math.random() * 40 - 20);
        stockPrice = Math.max(10, stockPrice + vol);
        c.innerHTML = `
            <div class="card">
                <h3>💹 בורסה</h3>
                <h2 style="color:${vol >= 0 ? '#4ade80' : '#f87171'}">₪${stockPrice}</h2>
                <p>מניות: ${stocks}</p>
                <button class="action" onclick="buyStock()">קנה מניה</button>
                <button class="action" style="background:#475569" onclick="sellStock()">מכור מניה</button>
            </div>`;
    }
    else if (tab === 'bank') {
        c.innerHTML = `
            <div class="card">
                <h3>🏦 בנק</h3>
                <input id="bAmt" type="number" placeholder="סכום..." style="width:80%; padding:10px; margin-bottom:10px;">
                <button class="action" onclick="doBank('dep')">הפקדה</button>
                <button class="action" style="background:#475569" onclick="doBank('wit')">משיכה</button>
            </div>`;
    }
    else if (tab === 'install') {
        c.innerHTML = `
            <div class="card" style="text-align:right;">
                <h3>📲 הוראות התקנה</h3>
                <p><b>אייפון:</b> לחץ על סמל השיתוף (מרובע עם חץ) ובחר "הוסף למסך הבית".</p>
                <p><b>אנדרואיד:</b> לחץ על 3 הנקודות ובחר "התקן אפליקציה".</p>
            </div>`;
    }
    else if (tab === 'work') {
        c.innerHTML = `<h3>💼 עבודה</h3><button class="action" onclick="work()">עבוד (5 שניות)</button><div class="xpbar"><div id="wb" style="width:0%; height:100%; background:#22c55e;"></div></div>`;
    }
}

function work() {
    let t = 0;
    let inter = setInterval(() => {
        t++; document.getElementById("wb").style.width = (t/5*100) + "%";
        if (t >= 5) {
            clearInterval(inter);
            money += 200; workCount++;
            if (currentTask && currentTask.type === "work") {
                currentTask.goal--;
                if (currentTask.goal <= 0) finishTask();
            }
            addXP(25); message("הרווחת 200₪", "gain"); updateUI();
        }
    }, 1000);
}

function addXP(v) {
    xp += v;
    if (xp >= 100) {
        xp -= 100; level++;
        let bonus = Math.floor(Math.random() * (2500 - 500 + 1)) + 500;
        money += bonus;
        message(`עלית לרמה ${level}! זוכת ב-${bonus}₪`, "event");
    }
    updateUI();
}

function doBank(type) {
    let a = Math.floor(Number(document.getElementById("bAmt").value));
    if (a <= 0) return;
    if (type === 'dep') {
        if (money < a) return message("אין לך מספיק מזומן להפקדה", "loss");
        money -= a; bank += a;
        if (currentTask && currentTask.type === "bank") finishTask();
    } else {
        if (bank < a) return message("אין לך מספיק כסף בבנק למשיכה", "loss");
        bank -= a; money += a;
    }
    updateUI(); message("הפעולה בוצעה", "gain");
}

function buyStock() {
    if (money < stockPrice) return message("אין לך מספיק כסף למניה", "loss");
    money -= stockPrice; stocks++; updateUI(); openTab('stock');
}

function sellStock() {
    if (stocks <= 0) return message("אין לך מניות למכור", "loss");
    money += stockPrice; stocks--; updateUI(); openTab('stock');
}

function finishTask() {
    money += currentTask.reward;
    addXP(currentTask.xp);
    message(`משימה הושלמה! קיבלת ${currentTask.reward}₪`, "gain");
    currentTask = tasksList[Math.floor(Math.random() * tasksList.length)];
    save();
}

function checkUpdate() {
    message("מעדכן...", "event");
    caches.keys().then(names => { for (let n of names) caches.delete(n); });
    setTimeout(() => location.reload(true), 1000);
}

document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
