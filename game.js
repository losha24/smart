const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };

// משתני ליבה
let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let level = load('level', 1), xp = load('xp', 0), loan = load('loan', 0);
let lastGift = load('lastGift', 0), theme = load('theme', 'dark'), working = false;
let skills = load('skills', []), inventory = load('inventory', []);
let activeTasks = load('activeTasks', []), totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0);

// בורסה
let stocks = load('stocks', [
    {id:'AAPL', n:'Apple', p:180, change:0}, {id:'TSLA', n:'Tesla', p:240, change:0},
    {id:'NVDA', n:'Nvidia', p:120, change:0}, {id:'BTC', n:'Bitcoin', p:65000, change:0},
    {id:'ETH', n:'Ethereum', p:3500, change:0}, {id:'GOLD', n:'זהב', p:2300, change:0}
]);
let invOwned = load('invOwned', { AAPL:0, TSLA:0, NVDA:0, BTC:0, ETH:0, GOLD:0 });

// --- פונקציות עזר ---
function save() {
    const data = { money, bank, passive, level, xp, loan, lastGift, theme, invOwned, skills, inventory, activeTasks, totalEarned, totalSpent, stocks };
    Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    save();
}

function showMsg(txt, type) {
    const b = document.getElementById("status-bar");
    if(!b) return;
    b.innerText = txt;
    b.className = (type === "pos" ? "pos show" : "neg show");
    setTimeout(() => { b.className = ""; }, 3000);
}

// --- ניהול טאבים (לוודא שכל כפתור ב-NAV עובד) ---
function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if(activeBtn) activeBtn.classList.add("active");

    const c = document.getElementById("content");
    if(!c) return;
    c.innerHTML = "";

    if (tab === 'home') {
        const nextGift = 14400000 - (Date.now() - lastGift);
        let stockValue = 0;
        stocks.forEach(s => stockValue += (invOwned[s.id] || 0) * s.p * 4);
        c.innerHTML = `<div class="card">
            <h3>📊 סיכום חשבון</h3>
            <p>💰 הכנסות: <span class="pos-text">${totalEarned.toLocaleString()}₪</span></p>
            <p>💸 הוצאות: <span class="neg-text">${totalSpent.toLocaleString()}₪</span></p>
            <p>📈 שווי בורסה: <b>${Math.floor(stockValue).toLocaleString()}₪</b></p>
            <hr>
            <button class="action gift-btn" onclick="claimGift()" ${nextGift>0?'disabled':''}>🎁 מתנה</button>
        </div>`;
    }
    else if (tab === 'work') {
        const jobs = [
            {n:"שליח", p:400, t:4, s:null}, {n:"מאבטח", p:1200, t:10, s:"רישיון לנשק"}, 
            {n:"נהג", p:1800, t:12, s:"רישיון נהיגה"}, {n:"מתכנת", p:15000, t:40, s:"תכנות JS"}
        ];
        c.innerHTML = `<div class="card"><div class="xpbar"><div id="wb"></div></div></div><div class="grid-2"></div>`;
        jobs.forEach(j => {
            const has = !j.s || skills.includes(j.s);
            c.querySelector(".grid-2").innerHTML += `<div class="card" style="opacity:${has?1:0.5}">
                <b>${j.n}</b><br><button class="action" onclick="startWork(${j.p},${j.t})" ${!has||working?'disabled':''}>${has?j.p+'₪':'חסר '+j.s}</button>
            </div>`;
        });
    }
    else if (tab === 'invest') {
        stocks.forEach(s => {
            c.innerHTML += `<div class="card">
                <b>${s.n}</b>: ${s.p.toFixed(2)}$ <small>(${invOwned[s.id]||0})</small>
                <div class="nav-row">
                    <button class="action" onclick="buyStock('${s.id}',${s.p})">קנה</button>
                    <button class="action" style="background:var(--main)" onclick="sellStock('${s.id}',${s.p})">מכור</button>
                </div>
            </div>`;
        });
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card">
            <h3>🏦 בנק</h3>
            <input type="number" id="bankAmt" placeholder="סכום...">
            <div class="nav-row">
                <button class="action" onclick="bankOp('dep')">הפקדה</button>
                <button class="action" onclick="bankOp('wit')">משיכה</button>
            </div>
            <button class="action" onclick="bankOp('loan')" style="background:var(--main)">הלוואה</button>
            <button class="action" onclick="bankOp('pay')" style="background:var(--green)">החזר חוב</button>
        </div>`;
    }
    else if (tab === 'tasks') {
        if(activeTasks.length === 0) {
            activeTasks = [{id:1, n:"עבודה", goal:5, cur:0, r:10000}, {id:3, n:"זהב", goal:1000000, cur:totalSpent, r:250000}];
        }
        activeTasks.forEach(t => {
            c.innerHTML += `<div class="card"><b>${t.n}</b>: ${Math.floor(t.cur)}/${t.goal}</div>`;
        });
    }
}

// --- לוגיקה של כפתורים ---
function startWork(p, t) {
    if(working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => {
        s += 0.1; if(bar) bar.style.width = (s/t*100) + "%";
        if(s >= t) {
            clearInterval(i); working = false; money += p; totalEarned += p; updateUI(); openTab('work');
        }
    }, 100);
}

function bankOp(type) {
    const a = parseInt(document.getElementById("bankAmt")?.value) || 0;
    if(type==='dep' && money>=a) { money-=a; bank+=a; showMsg("הופקד", "pos"); }
    else if(type==='wit' && bank>=a) { bank-=a; money+=a; showMsg("נמשך", "pos"); }
    else if(type==='loan') { loan+=5000; money+=5000; }
    else if(type==='pay' && money>=5000) { money-=5000; loan-=5000; }
    updateUI(); openTab('bank');
}

function buyStock(id, p) { if(money >= p*4) { money -= p*4; invOwned[id]++; updateUI(); openTab('invest'); } }
function sellStock(id, p) { if(invOwned[id] > 0) { invOwned[id]--; money += p*4; updateUI(); openTab('invest'); } }

function claimGift() {
    if(Date.now() - lastGift >= 14400000) {
        money += 5000; lastGift = Date.now(); showMsg("קיבלת מתנה", "pos"); updateUI(); openTab('home');
    }
}

function toggleTheme() { theme = (theme === 'dark' ? 'light' : 'dark'); updateUI(); }
function resetGame() { if(confirm("איפוס?")) { localStorage.clear(); location.reload(); } }

setInterval(() => { if(passive > 0) { money += (passive/10); updateUI(); } }, 1000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
