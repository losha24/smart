const VERSION = "3.2";

// מנגנון הגנה ועדכון גרסה
if (localStorage.appVersion !== VERSION) {
    // שומרים רק את הכסף והרמה במעבר גרסה אם רוצים, או מאפסים הכל ליציבות
    localStorage.appVersion = VERSION;
}

let money = Number(localStorage.money) || 100;
let bank = Number(localStorage.bank) || 0;
let xp = Number(localStorage.xp) || 0;
let level = Number(localStorage.level) || 1;
let stocks = Number(localStorage.stocks) || 0;
let passive = Number(localStorage.passive) || 0;
let stockPrice = 100;
let myItems = JSON.parse(localStorage.myItems || "[]");
let working = false;

// נתוני מערכת
const worksList = [
    { n: "אבטחה", p: 150, t: 8, x: 25 },
    { n: "מתכנת PWA", p: 500, t: 20, x: 70 },
    { n: "ניהול פרויקט", p: 1200, t: 45, x: 150 }
];

const marketItems = [
    { id: 1, name: "מחשב על", price: 1000, desc: "מקצר זמן עבודה ב-30%", type: 'speed' },
    { id: 2, name: "נדל\"ן מניב", price: 5000, desc: "הכנסה פסיבית 100₪", type: 'passive', val: 100 }
];

function save() {
    localStorage.money = money;
    localStorage.bank = bank;
    localStorage.xp = xp;
    localStorage.level = level;
    localStorage.stocks = stocks;
    localStorage.passive = passive;
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
    const activeBtn = document.getElementById("btn" + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (activeBtn) activeBtn.classList.add("active");

    const container = document.getElementById("content");
    container.innerHTML = "";

    if (tabName === 'home') {
        container.innerHTML = `
            <div class="card">
                <h3>לוח בקרה</h3>
                <p>הכנסה פסיבית: <span class="gain">${passive}₪</span></p>
                <p>מניות בבעלותך: ${stocks}</p>
                <p>גרסת מערכת: ${VERSION}</p>
            </div>`;
    } 
    else if (tabName === 'work') {
        let h = `<h3>מרכז תעסוקה</h3><div class="xpbar" style="margin-bottom:15px;"><div id="workbar" style="width:0%; height:100%; background:#22c55e;"></div></div>`;
        worksList.forEach(w => {
            h += `<button class="action" onclick="runWork('${w.n}', ${w.p}, ${w.t}, ${w.x})">${w.n} (${w.p}₪)</button>`;
        });
        container.innerHTML = h;
    }
    else if (tabName === 'stock') {
        let change = (Math.random() * 40 - 20);
        stockPrice = Math.max(10, Math.floor(stockPrice + change));
        container.innerHTML = `
            <div class="card">
                <h3>בורסה חיה</h3>
                <div style="font-size:28px; font-weight:bold; color:${change >=0 ? '#4ade80' : '#f87171'}">₪${stockPrice}</div>
                <p>מניות ברשותך: ${stocks}</p>
                <button class="action" onclick="buyStock()">קנה</button>
                <button class="action" style="background:#475569" onclick="sellStock()">מכור</button>
            </div>`;
    }
    else if (tabName === 'market') {
        let h = `<h3>השוק</h3>`;
        marketItems.forEach(item => {
            const owned = myItems.some(i => i.id === item.id);
            h += `
                <div class="card" style="text-align:right;">
                    <strong>${item.name}</strong> | ${item.price}₪
                    <p><small>${item.desc}</small></p>
                    <button class="action ${owned ? 'disabled' : ''}" onclick="buyItem(${item.id})">${owned ? 'בבעלותך' : 'קנה'}</button>
                </div>`;
        });
        container.innerHTML = h;
    }
    else if (tabName === 'bank') {
        container.innerHTML = `
            <div class="card">
                <h3>בנק דיגיטלי</h3>
                <input id="bankAmt" type="number" placeholder="סכום" style="width:80%; padding:10px; margin-bottom:10px;">
                <button class="action" onclick="handleBank('dep')">הפקדה</button>
                <button class="action" style="background:#475569" onclick="handleBank('wit')">משיכה</button>
            </div>`;
    }
    else if (tabName === 'install') {
        container.innerHTML = `
            <div class="card" style="text-align:right;">
                <h3>📲 התקנה למסך הבית</h3>
                <p>1. לחץ על כפתור השיתוף בדפדפן.</p>
                <p>2. בחר "הוספה למסך הבית".</p>
                <button class="action" onclick="tryInstall()">התקן עכשיו</button>
            </div>`;
    }
}

function runWork(name, pay, time, xpGain) {
    if (working) return message("עבודה כבר מתבצעת", "loss");
    working = true;
    let s = 0;
    let finalTime = myItems.some(i => i.id === 1) ? time * 0.7 : time;
    const bar = document.getElementById("workbar");
    
    let inter = setInterval(() => {
        s += 0.1;
        if (bar) bar.style.width = (s / finalTime * 100) + "%";
        if (s >= finalTime) {
            clearInterval(inter);
            working = false;
            money += pay;
            addXP(xpGain);
            message(`הרווחת ${pay}₪`, "gain");
            if (bar) bar.style.width = "0%";
            updateUI();
        }
    }, 100);
}

function addXP(v) {
    xp += v;
    if (xp >= 100) {
        xp -= 100;
        level++;
        money += 1000;
        message("רמה חדשה! קיבלת 1000₪", "event");
    }
    updateUI();
}

function buyStock() {
    if (money >= stockPrice) { money -= stockPrice; stocks++; updateUI(); openTab('stock'); }
    else message("אין לך מספיק כסף", "loss");
}

function sellStock() {
    if (stocks > 0) { money += stockPrice; stocks--; updateUI(); openTab('stock'); }
}

function buyItem(id) {
    const item = marketItems.find(i => i.id === id);
    if (money >= item.price && !myItems.some(i => i.id === id)) {
        money -= item.price;
        myItems.push(item);
        if (item.type === 'passive') passive += item.val;
        message("תתחדש!", "gain");
        updateUI();
        openTab('market');
    }
}

function handleBank(type) {
    let a = Math.floor(Number(document.getElementById("bankAmt").value));
    if (a <= 0) return;
    if (type === 'dep' && money >= a) { money -= a; bank += a; }
    else if (type === 'wit' && bank >= a) { bank -= a; money += a; }
    updateUI();
}

async function checkUpdate() {
    message("מנקה מטמון ומעדכן...", "event");
    if ('caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) await caches.delete(key);
    }
    setTimeout(() => { window.location.reload(true); }, 1000);
}

function resetGame() {
    if(confirm("לאפס את כל ההתקדמות?")) { localStorage.clear(); location.reload(); }
}

document.addEventListener("DOMContentLoaded", () => {
    updateUI();
    openTab('home');
});

// הכנסה פסיבית
setInterval(() => {
    if (passive > 0) { money += passive; updateUI(); }
}, 10000);
