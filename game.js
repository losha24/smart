const VERSION = "3.2.2";

// נתונים ראשוניים
let money = Number(localStorage.money) || 100;
let bank = Number(localStorage.bank) || 0;
let xp = Number(localStorage.xp) || 0;
let level = Number(localStorage.level) || 1;
let stocks = Number(localStorage.stocks) || 0;
let passive = Number(localStorage.passive) || 0;
let totalEarned = Number(localStorage.totalEarned) || 0;
let totalSpent = Number(localStorage.totalSpent) || 0;
let stockPrice = 100;
let myItems = JSON.parse(localStorage.myItems || "[]");
let activeTasks = JSON.parse(localStorage.activeTasks || "[]");

const allTasks = [
    { id: 1, desc: "עבוד פעם אחת", goal: 1, type: "work", reward: 150, xp: 20 },
    { id: 2, desc: "הפקד כסף לבנק", goal: 1, type: "bank", reward: 100, xp: 15 },
    { id: 3, desc: "קנה מניה אחת", goal: 1, type: "stock", reward: 200, xp: 30 },
    { id: 4, desc: "צבור 500₪ מזומן", goal: 500, type: "cash", reward: 250, xp: 40 },
    { id: 5, desc: "עבוד 3 פעמים", goal: 3, type: "work", reward: 400, xp: 50 }
];

const marketItems = [
    { id: 101, n: "סמארטפון", price: 1000, desc: "+10₪ הכנסה פסיבית", p: 10 },
    { id: 102, n: "מחשב נייד", price: 5000, desc: "+60₪ הכנסה פסיבית", p: 60 },
    { id: 103, n: "רכב חשמלי", price: 20000, desc: "+300₪ הכנסה פסיבית", p: 300 }
];

function save() {
    localStorage.money = money;
    localStorage.bank = bank;
    localStorage.xp = xp;
    localStorage.level = level;
    localStorage.stocks = stocks;
    localStorage.passive = passive;
    localStorage.totalEarned = totalEarned;
    localStorage.totalSpent = totalSpent;
    localStorage.myItems = JSON.stringify(myItems);
    localStorage.activeTasks = JSON.stringify(activeTasks);
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
                <h3>🏠 לוח בקרה</h3>
                <p>💰 מזומן בכיס: ${Math.floor(money)}₪</p>
                <p>🏦 חיסכון בבנק: ${bank}₪</p>
                <p>📈 הכנסה פסיבית: ${passive}₪</p>
                <hr>
                <p>סה"כ הרווחת: <span class="gain">${totalEarned}₪</span></p>
                <p>סה"כ בזבת: <span class="loss">${totalSpent}₪</span></p>
            </div>`;
    }
    else if (tab === 'tasks') {
        if (activeTasks.length < 3) refreshTasks();
        let h = `<h3>🎯 משימות פעילות</h3>`;
        activeTasks.forEach((t, index) => {
            h += `
                <div class="card" style="border-right: 5px solid #fbbf24;">
                    <p><b>${t.desc}</b></p>
                    <small>פרס: ${t.reward}₪ | XP: ${t.xp}</small>
                    <button class="action" style="background:#1e293b; font-size:12px;" onclick="completeTask(${index})">דווח סיום</button>
                </div>`;
        });
        c.innerHTML = h;
    }
    else if (tab === 'market') {
        let h = `<h3>🛒 שוק השקעות</h3>`;
        marketItems.forEach(i => {
            const owned = myItems.some(it => it.id === i.id);
            h += `
                <div class="card">
                    <b>${i.n}</b> - ${i.price}₪
                    <p><small>${i.desc}</small></p>
                    <button class="action ${owned ? 'disabled' : ''}" onclick="buyItem(${i.id})">
                        ${owned ? 'בבעלותך' : 'קנה עכשיו'}
                    </button>
                </div>`;
        });
        c.innerHTML = h;
    }
    else if (tab === 'work') {
        c.innerHTML = `
            <div class="card">
                <h3>💼 עבודה מהירה</h3>
                <button class="action" id="workBtn" onclick="doWork()">התחל לעבוד (5 שניות)</button>
                <div class="xpbar"><div id="wb" style="width:0%; height:100%; background:#22c55e;"></div></div>
            </div>`;
    }
    else if (tab === 'stock') {
        stockPrice = Math.max(10, Math.floor(stockPrice + (Math.random() * 40 - 20)));
        c.innerHTML = `
            <div class="card">
                <h3>💹 בורסה</h3>
                <h2>₪${stockPrice}</h2>
                <button class="action" onclick="buyStock()">קנה</button>
                <button class="action" style="background:#475569" onclick="sellStock()">מכור</button>
            </div>`;
    }
    else if (tab === 'bank') {
        c.innerHTML = `
            <div class="card">
                <h3>🏦 בנק</h3>
                <input id="bAmt" type="number" placeholder="סכום לשירות..." style="width:85%; padding:10px; margin-bottom:10px; border-radius:5px;">
                <button class="action" onclick="bankOp('dep')">הפקדה</button>
                <button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button>
            </div>`;
    }
    else if (tab === 'install') {
        c.innerHTML = `
            <div class="card" style="text-align:right;">
                <h3>📲 איך להתקין?</h3>
                <p><b>בטלפון:</b> לחץ על אפשרויות הדפדפן (3 נקודות או חץ שיתוף) ובחר <b>"הוסף למסך הבית"</b>.</p>
                <p>זה יהפוך את האתר לאפליקציה מלאה באדום!</p>
            </div>`;
    }
}

function refreshTasks() {
    activeTasks = [];
    let shuffled = [...allTasks].sort(() => 0.5 - Math.random());
    activeTasks = shuffled.slice(0, 3);
    save();
}

function completeTask(idx) {
    const t = activeTasks[idx];
    // בדיקה בסיסית - כאן אפשר להוסיף לוגיקה שבודקת אם המטרה באמת הושגה
    money += t.reward;
    totalEarned += t.reward;
    addXP(t.xp);
    message(`משימה הושלמה! +${t.reward}₪`, "gain");
    
    // החלפת המשימה הספציפית באחת חדשה
    let newItem;
    do {
        newItem = allTasks[Math.floor(Math.random() * allTasks.length)];
    } while (activeTasks.some(at => at.id === newItem.id));
    
    activeTasks[idx] = newItem;
    updateUI();
    openTab('tasks');
}

function doWork() {
    const btn = document.getElementById("workBtn");
    if (btn.disabled) return;
    btn.disabled = true;
    let s = 0;
    const bar = document.getElementById("wb");
    let inter = setInterval(() => {
        s++; bar.style.width = (s/5*100) + "%";
        if (s >= 5) {
            clearInterval(inter);
            btn.disabled = false;
            money += 250; totalEarned += 250;
            addXP(30);
            message("הרווחת 250₪ בעבודה!", "gain");
            bar.style.width = "0%";
            updateUI();
        }
    }, 1000);
}

function addXP(v) {
    xp += v;
    if (xp >= 100) {
        xp -= 100; level++;
        let bonus = Math.floor(Math.random() * 2000) + 500;
        money += bonus;
        message(`עלית לרמה ${level}! קיבלת בונוס של ${bonus}₪`, "event");
    }
    updateUI();
}

function buyItem(id) {
    const item = marketItems.find(i => i.id === id);
    if (money < item.price) return message("אין לך מספיק מזומן לקנייה!", "loss");
    if (myItems.some(it => it.id === id)) return;
    
    money -= item.price; totalSpent += item.price;
    passive += item.p;
    myItems.push(item);
    message("תתחדש! ההכנסה הפסיבית גדלה", "gain");
    updateUI();
    openTab('market');
}

function bankOp(type) {
    let a = Math.floor(Number(document.getElementById("bAmt").value));
    if (a <= 0) return;
    if (type === 'dep') {
        if (money < a) return message("אין לך מספיק מזומן להפקדה", "loss");
        money -= a; bank += a;
    } else {
        if (bank < a) return message("אין לך מספיק כסף בבנק למשיכה", "loss");
        bank -= a; money += a;
    }
    updateUI();
}

function buyStock() {
    if (money < stockPrice) return message("אין לך מספיק כסף למניה", "loss");
    money -= stockPrice; stocks++; updateUI(); openTab('stock');
}

function sellStock() {
    if (stocks <= 0) return message("אין לך מניות למכור", "loss");
    money += stockPrice; stocks--; updateUI(); openTab('stock');
}

function resetGame() {
    if(confirm("אתה בטוח שברצונך לאפס הכל? כל ההתקדמות תימחק.")) {
        localStorage.clear();
        caches.keys().then(names => { for (let n of names) caches.delete(n); });
        location.reload(true);
    }
}

function checkUpdate() {
    message("בודק גרסה חדשה...", "event");
    caches.keys().then(names => { for (let n of names) caches.delete(n); });
    setTimeout(() => location.reload(true), 1000);
}

// הכנסה פסיבית כל 10 שניות
setInterval(() => {
    if (passive > 0) {
        money += passive;
        totalEarned += passive;
        updateUI();
    }
}, 10000);

document.addEventListener("DOMContentLoaded", () => {
    if (activeTasks.length === 0) refreshTasks();
    updateUI();
    openTab('home');
});
