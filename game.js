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
        container.innerHTML = `<div class="card"><h3>סטטוס אישי</h3><p>רמה: ${level}</p><p>מניות שברשותך: ${stocks}</p></div>`;
    } 
    else if (tabName === 'stock') {
        // שינוי מחיר מניה בכניסה לטאב
        let change = (Math.random() * 40 - 20); // -20 עד +20
        stockPrice = Math.max(10, Math.floor(stockPrice + change));
        let colorClass = change >= 0 ? 'up' : 'down';
        
        container.innerHTML = `
            <div class="stock-card">
                <h3>בורסת SmartMoney</h3>
                <div class="stock-price ${colorClass}">₪${stockPrice}</div>
                <p>מניות בתיק: ${stocks}</p>
                <button class="action" onclick="buyStock()">קנה מניה</button>
                <button class="action" style="background:#475569" onclick="sellStock()">מכור מניה</button>
            </div>`;
    }
    else if (tabName === 'work') {
        container.innerHTML = `<h3>עבודה</h3><button class="action" onclick="doWork()">צא לעבוד (5 שניות)</button><div class="xpbar"><div id="workbar" style="width:0%; height:100%; background:#22c55e;"></div></div>`;
    }
    else if (tabName === 'install') {
        container.innerHTML = `
            <div class="install-guide">
                <strong>איך להתקין על מסך הבית?</strong><br>
                1. לחץ על כפתור <strong>השיתוף</strong> (חץ למעלה ב-iPhone) או על <strong>3 הנקודות</strong> (ב-Android).<br>
                2. בחר באפשרות <strong>"הוספה למסך הבית"</strong> (Add to Home Screen).<br>
                3. אשר את ההוספה והאפליקציה תופיע בשולחן העבודה שלך!
                <button class="action" style="margin-top:15px;" onclick="tryNativeInstall()">נסה התקנה אוטומטית</button>
            </div>`;
    }
}

function buyStock() {
    if (money >= stockPrice) {
        money -= stockPrice;
        stocks++;
        message("קנית מניה!", "gain");
        openTab('stock');
        updateUI();
    } else message("אין מספיק כסף", "loss");
}

function sellStock() {
    if (stocks > 0) {
        money += stockPrice;
        stocks--;
        message("מכרת מניה!", "gain");
        openTab('stock');
        updateUI();
    } else message("אין לך מניות", "loss");
}

function doWork() {
    let t = 0;
    message("עובד...", "event");
    let inter = setInterval(() => {
        t++;
        document.getElementById("workbar").style.width = (t/5*100) + "%";
        if(t>=5) {
            clearInterval(inter);
            money += 100;
            xp += 20;
            message("הרווחת 100₪!", "gain");
            updateUI();
        }
    }, 1000);
}

// לוגיקת התקנה
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

function tryNativeInstall() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
    } else {
        message("השתמש במדריך הידני למעלה", "event");
    }
}

function checkUpdate() {
    message("מרענן גרסה...", "event");
    // מחיקת Cache כוחנית
    if ('serviceWorker' in navigator) {
        caches.keys().then(names => {
            for (let name of names) caches.delete(name);
        });
    }
    setTimeout(() => location.reload(true), 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    updateUI();
    openTab('home');
});
