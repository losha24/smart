const VERSION = "3.2";

// טעינת נתונים
if (localStorage.appVersion !== VERSION) {
    localStorage.appVersion = VERSION;
}

let money = Number(localStorage.money) || 100;
let bank = Number(localStorage.bank) || 0;
let xp = Number(localStorage.xp) || 0;
let level = Number(localStorage.level) || 1;
let stocks = Number(localStorage.stocks) || 0;
let totalEarned = Number(localStorage.totalEarned) || 0;
let totalSpent = Number(localStorage.totalSpent) || 0;
let stockPrice = 100;
let myItems = JSON.parse(localStorage.myItems || "[]");
let working = false;

// רשימות נתונים מורחבות
const worksList = [
    { n: "אבטחת מתקנים", p: 180, t: 7, x: 20 },
    { n: "שליחויות אקספרס", p: 250, t: 10, x: 35 },
    { n: "בדיקת תוכנה", p: 450, t: 15, x: 60 },
    { n: "פיתוח אפליקציות", p: 900, t: 30, x: 120 },
    { n: "ניהול שרתים", p: 1500, t: 50, x: 250 }
];

const investments = [
    { n: "קרן השתלמות", cost: 2000, daily: 50 },
    { n: "נדל\"ן מסחרי", cost: 10000, daily: 300 },
    { n: "סטארטאפ טכנולוגי", cost: 50000, daily: 2000 }
];

const marketItems = [
    { id: 1, n: "סמארטפון חדש", price: 1200, desc: "בונוס 10% ל-XP", type: 'xp' },
    { id: 2, n: "רכב עבודה", price: 15000, desc: "מקצר זמן עבודה ב-20%", type: 'speed' },
    { id: 3, n: "משרד פרטי", price: 30000, desc: "הכנסה פסיבית קבועה", type: 'passive', val: 500 }
];

function save() {
    localStorage.money = money;
    localStorage.bank = bank;
    localStorage.xp = xp;
    localStorage.level = level;
    localStorage.stocks = stocks;
    localStorage.totalEarned = totalEarned;
    localStorage.totalSpent = totalSpent;
    localStorage.myItems = JSON.stringify(myItems);
    localStorage.appVersion = VERSION;
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("level").innerText = level;
    document.getElementById("stocksCount").innerText = stocks;
    document.getElementById("xpfill").style.width = (xp % 100) + "%";
    save();
}

function message(t, cls = '') {
    const m = document.getElementById("message");
    if (m) { m.innerText = t; m.className = cls; }
}

function openTab(tabName) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (btn) btn.classList.add("active");

    const container = document.getElementById("content");
    container.innerHTML = "";

    if (tabName === 'home') {
        container.innerHTML = `
            <div class="card">
                <h3>🏠 דף בית</h3>
                <p>💰 כסף בבנק: <b>${bank}₪</b></p>
                <p>📈 סה"כ הרווחתי: <span class="gain">${totalEarned}₪</span></p>
                <p>📉 סה"כ בזבזתי: <span class="loss">${totalSpent}₪</span></p>
                <p>⭐ רמה נוכחית: ${level}</p>
            </div>`;
    } 
    else if (tabName === 'work') {
        let h = `<h3>💼 עבודות זמינות</h3><div class="xpbar"><div id="workbar" style="width:0%; height:100%; background:#22c55e;"></div></div>`;
        worksList.forEach(w => {
            h += `<button class="action" onclick="runWork('${w.n}', ${w.p}, ${w.t}, ${w.x})">${w.n} (${w.p}₪)</button>`;
        });
        container.innerHTML = h;
    }
    else if (tabName === 'stock') {
        let change = (Math.random() * 50 - 25);
        stockPrice = Math.max(10, Math.floor(stockPrice + change));
        container.innerHTML = `
            <div class="card">
                <h3>💹 בורסה</h3>
                <div style="font-size:30px; color:${change >=0 ? '#4ade80' : '#f87171'}">₪${stockPrice}</div>
                <p>מניות בתיק: ${stocks}</p>
                <button class="action" onclick="buyStock()">קנה</button>
                <button class="action" style="background:#475569" onclick="sellStock()">מכור</button>
            </div>`;
    }
    else if (tabName === 'invest') {
        let h = `<h3>📈 השקעות ארוכות טווח</h3>`;
        investments.forEach(i => {
            h += `<div class="card"><b>${i.n}</b><br>עלות: ${i.cost}₪ | רווח יומי: ${i.daily}₪<br><button class="action" onclick="buyInvest(${i.cost}, ${i.daily})">השקע</button></div>`;
        });
        container.innerHTML = h;
    }
    else if (tabName === 'market') {
        let h = `<h3>🛒 חנות פריטים</h3>`;
        marketItems.forEach(item => {
            const owned = myItems.some(i => i.id === item.id);
            h += `<div class="card"><b>${item.n}</b> - ${item.price}₪<br><small>${item.desc}</small><br><button class="action ${owned ? 'disabled' : ''}" onclick="buyItem(${item.id})">${owned ? 'בבעלותך' : 'קנה'}</button></div>`;
        });
        container.innerHTML = h;
    }
    else if (tabName === 'bank') {
        container.innerHTML = `
            <div class="card">
                <h3>🏦 בנק</h3>
                <input id="bankAmt" type="number" placeholder="סכום" style="width:80%; padding:10px;">
                <button class="action" onclick="bankOp('dep')">הפקדה</button>
                <button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button>
            </div>`;
    }
}

function runWork(name, pay, time, xpGain) {
    if (working) return;
    working = true;
    let s = 0;
    let finalTime = myItems.some(i => i.id === 2) ? time * 0.8 : time;
    const bar = document.getElementById("workbar");
    message(`עובד ב${name}...`, "event");
    
    let inter = setInterval(() => {
        s += 0.1;
        if (bar) bar.style.width = (s / finalTime * 100) + "%";
        if (s >= finalTime) {
            clearInterval(inter);
            working = false;
            money += pay;
            totalEarned += pay;
            addXP(myItems.some(i => i.id === 1) ? xpGain * 1.1 : xpGain);
            updateUI();
            if (bar) bar.style.width = "0%";
            message(`סיימת! הרווחת ${pay}₪`, "gain");
        }
    }, 100);
}

function addXP(v) {
    xp += v;
    if (xp >= 100) {
        xp -= 100;
        level++;
        money += 1000;
        message(`עלית לרמה ${level}! קיבלת בונוס 1000₪`, "event");
    }
    updateUI();
}

function buyItem(id) {
    const item = marketItems.find(i => i.id === id);
    if (money >= item.price && !myItems.some(i => i.id === id)) {
        money -= item.price;
        totalSpent += item.price;
        myItems.push(item);
        message("תתחדש!", "gain");
        updateUI();
        openTab('market');
    }
}

function bankOp(type) {
    let a = Math.floor(Number(document.getElementById("bankAmt").value));
    if (a <= 0) return;
    if (type === 'dep' && money >= a) { money -= a; bank += a; }
    else if (type === 'wit' && bank >= a) { bank -= a; money += a; }
    updateUI();
}

async function checkUpdate() {
    message("מנקה זיכרון ומעדכן...", "event");
    if ('caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) await caches.delete(key);
    }
    setTimeout(() => { window.location.reload(true); }, 1000);
}

function resetGame() {
    if(confirm("לאפס הכל?")) { localStorage.clear(); location.reload(); }
}

document.addEventListener("DOMContentLoaded", () => {
    updateUI();
    openTab('home');
});
