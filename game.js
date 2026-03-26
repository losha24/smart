const VERSION = "3.1.6";

if (localStorage.appVersion !== VERSION) {
    localStorage.clear();
    localStorage.appVersion = VERSION;
}

let money = Number(localStorage.money) || 100;
let bank = Number(localStorage.bank) || 0;
let xp = Number(localStorage.xp) || 0;
let level = Number(localStorage.level) || 1;
let stocks = Number(localStorage.stocks) || 0;
let stockPrice = 100;

function save() {
    localStorage.money = money;
    localStorage.bank = bank;
    localStorage.xp = xp;
    localStorage.level = level;
    localStorage.stocks = stocks;
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
        container.innerHTML = `<div class="card"><h3>סטטוס אישי</h3><p>ברוך הבא לגרסה המעודכנת!</p><p>מניות בתיק: ${stocks}</p></div>`;
    } 
    else if (tabName === 'stock') {
        let volatility = (Math.random() * 40 - 20);
        stockPrice = Math.max(10, Math.floor(stockPrice + volatility));
        container.innerHTML = `
            <div class="card">
                <h2>📈 בורסה</h2>
                <div style="font-size:24px; color:${volatility >=0 ? '#4ade80' : '#f87171'}">${stockPrice}₪</div>
                <p>מניות ברשותך: ${stocks}</p>
                <button class="action" onclick="buyStock()">קנה מניה</button>
                <button class="action" style="background:#475569" onclick="sellStock()">מכור מניה</button>
            </div>`;
    }
    else if (tabName === 'work') {
        container.innerHTML = `<h3>עבודה</h3><button class="action" onclick="doWork()">צא לעבוד (בונוס XP)</button>`;
    }
    else if (tabName === 'install') {
        container.innerHTML = `
            <div class="card" style="text-align:right;">
                <h3>📲 איך מתקינים?</h3>
                <p><b>iPhone:</b> לחץ שיתוף > הוספה למסך הבית.</p>
                <p><b>Android:</b> לחץ 3 נקודות > התקן אפליקציה.</p>
                <button class="action" onclick="tryNativeInstall()">נסה התקנה אוטומטית</button>
            </div>`;
    }
}

function buyStock() {
    if (money >= stockPrice) {
        money -= stockPrice; stocks++;
        updateUI(); openTab('stock');
    } else message("אין מספיק מזומן", "loss");
}

function sellStock() {
    if (stocks > 0) {
        money += stockPrice; stocks--;
        updateUI(); openTab('stock');
    }
}

async function checkUpdate() {
    message("מנקה זיכרון ומעדכן...", "event");
    if ('caches' in window) {
        const keys = await caches.keys();
        for (const key of keys) await caches.delete(key);
    }
    if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) await reg.unregister();
    }
    setTimeout(() => { window.location.reload(true); }, 1000);
}

function resetGame() { if(confirm("לאפס הכל?")) { localStorage.clear(); location.reload(true); } }

document.addEventListener("DOMContentLoaded", () => {
    updateUI();
    openTab('home');
    message("המערכת מוכנה", "gain");
});
