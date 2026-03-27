const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };

// משתני ליבה
let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let level = load('level', 1), xp = load('xp', 0), loan = load('loan', 0);
let lastGift = load('lastGift', 0), theme = load('theme', 'dark'), working = false;
let skills = load('skills', []), inventory = load('inventory', []);
let activeTasks = load('activeTasks', []), totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0);

// בורסה דינמית
let stocks = load('stocks', [
    {id:'AAPL', n:'Apple', p:180, change:0},
    {id:'TSLA', n:'Tesla', p:240, change:0},
    {id:'NVDA', n:'Nvidia', p:120, change:0},
    {id:'BTC', n:'Bitcoin', p:65000, change:0},
    {id:'ETH', n:'Ethereum', p:3500, change:0},
    {id:'GOLD', n:'זהב', p:2300, change:0}
]);
let invOwned = load('invOwned', { AAPL:0, TSLA:0, NVDA:0, BTC:0, ETH:0, GOLD:0 });

// עדכון מחירי בורסה כל 5 שניות
setInterval(() => {
    stocks.forEach(s => {
        let vol = s.p * 0.02; 
        let diff = (Math.random() * (vol * 2) - vol);
        s.p = Math.max(1, s.p + diff);
        s.change = diff;
    });
    save();
}, 5000);

// מערכת משימות מתחלפת
function checkTasks() {
    if(activeTasks.length === 0) {
        activeTasks = [
            {id: 1, n: "לעבוד 5 פעמים", goal: 5, cur: 0, r: 10000, type: 'reg'},
            {id: 2, n: "להרוויח 50,000₪ סה\"כ", goal: 50000, cur: totalEarned, r: 25000, type: 'reg'},
            {id: 3, n: "משימת זהב: נכס ב-1M₪", goal: 1000000, cur: totalSpent, r: 250000, type: 'gold'}
        ];
    }
}

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
    b.innerText = txt;
    b.className = (type === "pos" ? "pos show" : "neg show");
    setTimeout(() => { b.className = ""; }, 3000);
}

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        const nextGift = 14400000 - (Date.now() - lastGift);
        let stockValue = 0;
        stocks.forEach(s => stockValue += (invOwned[s.id] || 0) * s.p * 4);

        c.innerHTML = `<div class="card fade-in">
            <h3>📊 סיכום חשבון</h3>
            <p>💰 סה"כ הכנסות: <span class="pos-text">${totalEarned.toLocaleString()}₪</span></p>
            <p>💸 סה"כ הוצאות: <span class="neg-text">${totalSpent.toLocaleString()}₪</span></p>
            <p>📈 שווי תיק השקעות: <b>${Math.floor(stockValue).toLocaleString()}₪</b></p>
            <p>🏦 חוב לבנק: <span class="neg-text">${loan.toLocaleString()}₪</span></p>
            <hr>
            <button class="action gift-btn" onclick="claimGift()" ${nextGift>0?'disabled':''}>
                ${nextGift > 0 ? '🎁 זמין בעוד ' + Math.ceil(nextGift/3600000) + ' שעות' : '🎁 קבל מתנה'}
            </button>
        </div>`;
    }
    else if (tab === 'invest') {
        c.innerHTML = `<h3>📊 בורסה ומטבעות (Real-time)</h3>`;
        stocks.forEach(s => {
            const color = s.change >= 0 ? 'green' : 'red';
            c.innerHTML += `<div class="card">
                <b>${s.n}</b> <span style="color:${color}">${s.change >= 0 ? '▲' : '▼'} ${s.p.toFixed(2)}$</span><br>
                <small>בבעלותך: ${invOwned[s.id] || 0}</small>
                <div class="nav-row">
                    <button class="action" onclick="buyStock('${s.id}',${s.p})">קנה</button>
                    <button class="action" style="background:var(--main)" onclick="sellStock('${s.id}',${s.p})">מכור</button>
                </div>
            </div>`;
        });
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card">
            <h3>🏦 ניהול בנק</h3>
            <p>יתרה: ${bank.toLocaleString()}₪ | הלוואה: ${loan.toLocaleString()}₪</p>
            <input type="number" id="bankAmt" placeholder="סכום...">
            <div class="nav-row">
                <button class="action" onclick="bankOp('dep')">הפקדה</button>
                <button class="action" onclick="bankOp('wit')">משיכה</button>
            </div>
            <hr>
            <button class="action" onclick="bankOp('loan')" style="background:var(--main)">קח 5,000₪ הלוואה</button>
            <button class="action" onclick="bankOp('pay')" style="background:var(--green); margin-top:5px;">החזר 5,000₪ מהחוב</button>
        </div>`;
    }
    else if (tab === 'tasks') {
        checkTasks();
        c.innerHTML = `<h3>🎯 משימות</h3>`;
        activeTasks.forEach((t, i) => {
            const isGold = t.type === 'gold';
            c.innerHTML += `<div class="card ${isGold ? 'gold-task' : ''}">
                <b>${isGold ? '👑 ' : ''}${t.n}</b><br>
                התקדמות: ${Math.floor(t.cur)} / ${t.goal}<br>
                <small>פרס: ${t.r.toLocaleString()}₪</small>
            </div>`;
        });
    }
    // ... שאר הטאבים (work, business, וכו') נשארים מהגרסה הקודמת
}

function bankOp(type) {
    const a = parseInt(document.getElementById("bankAmt")?.value) || 0;
    if(type==='dep' && money>=a && a>0) { money-=a; bank+=a; showMsg("הופקד", "pos"); }
    else if(type==='wit' && bank>=a && a>0) { bank-=a; money+=a; showMsg("נמשך", "pos"); }
    else if(type==='loan') { loan+=5000; money+=5000; showMsg("הלוואה התקבלה", "neg"); }
    else if(type==='pay' && money>=5000 && loan>=5000) { money-=5000; loan-=5000; showMsg("החזרת חלק מהחוב", "pos"); }
    else { showMsg("פעולה נכשלה", "neg"); }
    updateUI(); openTab('bank');
}

function buyStock(id, p) {
    let cost = p * 4;
    if(money >= cost) { money -= cost; invOwned[id]++; showMsg("נקנה", "pos"); updateUI(); openTab('invest'); }
}

function sellStock(id, p) {
    if(invOwned[id] > 0) { invOwned[id]--; money += (p * 4); showMsg("נמכר", "pos"); updateUI(); openTab('invest'); }
}

function claimGift() {
    if(Date.now() - lastGift >= 14400000) {
        let g = 5000 + (level * 1000);
        money += g; totalEarned += g; lastGift = Date.now();
        showMsg("קיבלת מתנה!", "pos"); updateUI(); openTab('home');
    }
}

setInterval(() => { if(passive>0) { money += (passive/10); updateUI(); } }, 1000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
