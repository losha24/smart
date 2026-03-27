const load = (k, d) => {
    const s = localStorage.getItem(k);
    try { return s ? JSON.parse(s) : d; } catch(e) { return d; }
};

let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0);
let level = load('level', 1), xp = load('xp', 0), loan = load('loan', 0);
let lastGift = load('lastGift', 0), theme = load('theme', 'dark'), working = false;

// השקעות
let stocksOwned = load('stocksOwned', { AAPL: 0, TSLA: 0 });
let cryptoOwned = load('cryptoOwned', { BTC: 0 });
let prices = { AAPL: 150, TSLA: 750, BTC: 65000 };

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.getElementById("level-ui").innerText = level;
    document.body.className = theme + "-theme";
    save();
}

function save() {
    const data = { money, bank, passive, totalEarned, totalSpent, level, xp, loan, lastGift, theme, stocksOwned, cryptoOwned };
    Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
}

function showMsg(txt, type) {
    const b = document.getElementById("status-bar"), s = document.getElementById("msg-text");
    s.innerText = txt; b.className = type;
    setTimeout(() => { b.className = ""; s.innerText = ""; }, 3000);
}

// עדכון מחירי בורסה/קריפטו בזמן אמת
setInterval(() => {
    prices.AAPL += (Math.random() * 4 - 2);
    prices.TSLA += (Math.random() * 12 - 6);
    prices.BTC += (Math.random() * 1200 - 600);
    if(prices.BTC < 5000) prices.BTC = 5000;
    
    // רענון טאבים פתוחים של מסחר
    if(document.getElementById("btnStock")?.classList.contains("active")) openTab('stock');
    if(document.getElementById("btnCrypto")?.classList.contains("active")) openTab('crypto');
}, 5000);

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        const nextGift = 14400000 - (Date.now() - lastGift);
        c.innerHTML = `
        <div class="card fade-in">
            <h2 style="color:var(--blue); margin-bottom:5px;">מצב חשבון</h2>
            <p>שלום, <b>Alexey Zavodisker</b></p>
            <p><small>גרסת מערכת: 4.1.0</small></p>
            <hr style="opacity:0.1">
            <div style="text-align:right; font-size:14px; line-height:1.8;">
                <p>💰 סך רווחים: <span style="color:var(--green)">${totalEarned.toLocaleString()}₪</span></p>
                <p>💸 סך הוצאות: <span style="color:var(--main)">${totalSpent.toLocaleString()}₪</span></p>
                <p>🏦 חוב לבנק: <span style="color:red">${loan.toLocaleString()}₪</span></p>
            </div>
            <button class="action" onclick="claimGift()" ${nextGift > 0 ? 'disabled' : ''}>
                ${nextGift > 0 ? '🎁 מתנה בעוד ' + Math.ceil(nextGift/60000) + ' דק\'' : '🎁 קבל מתנה (5,000₪)'}
            </button>
        </div>`;
    } 
    else if (tab === 'work') {
        const jobs = [
            {n:"שליח", p:350, t:4, r:1, i:"🛵"}, {n:"מאבטח", p:800, t:8, r:2, i:"🛡️"},
            {n:"טכנאי", p:1800, t:12, r:4, i:"🔧"}, {n:"מנכ\"ל", p:35000, t:45, r:15, i:"🏢"}
        ];
        c.innerHTML = `<div class="card"><div class="xpbar"><div id="wb"></div></div></div><div class="grid-2"></div>`;
        jobs.forEach(j => {
            const locked = level < j.r;
            c.querySelector(".grid-2").innerHTML += `
            <div class="card fade-in" style="opacity:${locked?0.5:1}">
                <b>${j.i} ${j.n}</b><br><small>${locked ? 'רמה '+j.r : j.p+'₪'}</small>
                <button class="action" onclick="startWork(${j.p},${j.t})" ${locked||working?'disabled':''}>עבוד</button>
            </div>`;
        });
    }
    else if (tab === 'stock') {
        c.innerHTML = `<div class="grid-2">
            <div class="card fade-in">🍏 <b>Apple</b><br>${Math.floor(prices.AAPL)}₪<br><small>בבעלותך: ${stocksOwned.AAPL}</small><button class="action" onclick="trade('S','AAPL',1)">קנה</button><button class="action" style="background:var(--main)" onclick="trade('S','AAPL',-1)">מכור</button></div>
            <div class="card fade-in">⚡ <b>Tesla</b><br>${Math.floor(prices.TSLA)}₪<br><small>בבעלותך: ${stocksOwned.TSLA}</small><button class="action" onclick="trade('S','TSLA',1)">קנה</button><button class="action" style="background:var(--main)" onclick="trade('S','TSLA',-1)">מכור</button></div>
        </div>`;
    }
    else if (tab === 'crypto') {
        c.innerHTML = `<div class="card fade-in">🟠 <b>Bitcoin</b><br>${Math.floor(prices.BTC)}₪<br><small>בבעלותך: ${cryptoOwned.BTC.toFixed(3)}</small><button class="action" onclick="trade('C','BTC',0.1)">קנה 0.1</button><button class="action" style="background:var(--main)" onclick="trade('C','BTC',-0.1)">מכור 0.1</button></div>`;
    }
    else if (tab === 'bank') {
        c.innerHTML = `
        <div class="card fade-in">
            <h3>🏦 ניהול בנק</h3>
            <input id="bAmt" type="number" placeholder="הכנס סכום (₪)">
            <div style="display:flex; gap:5px;"><button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button></div>
            <hr style="opacity:0.1; margin:15px 0;">
            <p>חוב נוכחי: <span style="color:red">${loan}₪</span></p>
            <button class="action" style="background:var(--main)" onclick="bankOp('loan')">קח הלוואה (10,000₪)</button>
            <button class="action" style="background:var(--green)" onclick="bankOp('pay')">החזר חוב (5,000₪)</button>
        </div>`;
    }
    else if (tab === 'business') {
        const bz = [{n:"קיוסק", c:25000, p:200, i:"🏪"}, {n:"מוסך", c:150000, p:1600, i:"🔧"}, {n:"פיצריה", c:450000, p:5200, i:"🍕"}, {n:"הייטק", c:5000000, p:65000, i:"🚀"}];
        c.innerHTML = `<div class="grid-2"></div>`;
        bz.forEach(b => c.querySelector(".grid-2").innerHTML += `<div class="card fade-in"><b>${b.i} ${b.n}</b><br><small>${b.c.toLocaleString()}₪</small><button class="action" onclick="buy('${b.n}',${b.c},${b.p})">קנה</button></div>`);
    }
    else if (tab === 'realestate') {
        const re = [{n:"חניה", c:120000, p:900, i:"🅿️"}, {n:"דירה", c:950000, p:7500, i:"🏢"}, {n:"וילה", c:5500000, p:48000, i:"🏡"}, {n:"בניין", c:25000000, p:220000, i:"🏙️"}];
        c.innerHTML = `<div class="grid-2"></div>`;
        re.forEach(r => c.querySelector(".grid-2").innerHTML += `<div class="card fade-in"><b>${r.i} ${r.n}</b><br><small>${r.c.toLocaleString()}₪</small><button class="action" onclick="buy('${r.n}',${r.c},${r.p})">קנה</button></div>`);
    }
    else if (tab === 'market') {
        const mk = [{n:"אייפון 15", c:4500, i:"📱"}, {n:"רכב", c:55000, i:"🚗"}, {n:"שעון", c:15000, i:"⌚"}];
        c.innerHTML = `<div class="grid-2"></div>`;
        mk.forEach(m => c.querySelector(".grid-2").innerHTML += `<div class="card fade-in"><b>${m.i} ${m.n}</b><br><small>${m.c.toLocaleString()}₪</small><button class="action" onclick="buy('${m.n}',${m.c},0)">קנה</button></div>`);
    }
    else if (tab === 'skills') {
        c.innerHTML = `<div class="card"><h3>🎓 כישורים</h3><p>לימוד כישורים מעלה את רמת הניסיון שלך (XP).</p></div><div class="grid-2">
            <div class="card">🇺🇸 <b>אנגלית</b><br>5,000₪<button class="action" onclick="buy('אנגלית',5000,0,true)">למד</button></div>
            <div class="card">⌨️ <b>תכנות</b><br>25,000₪<button class="action" onclick="buy('תכנות',25000,0,true)">למד</button></div>
        </div>`;
    }
    else if (tab === 'install') {
        c.innerHTML = `<div class="card fade-in"><h3>📲 התקנה על מסך הבית</h3><p>1. לחץ על כפתור ה<b>שיתוף</b> (ריבוע עם חץ).</p><p>2. בחר <b>"הוסף למסך הבית"</b>.</p><p>3. כעת תוכל לשחק באפליקציה במסך מלא!</p></div>`;
    }
}

function trade(type, asset, amt) {
    let p = prices[asset], cost = p * Math.abs(amt);
    if(amt > 0) { // קנייה
        if(money >= cost) { money -= cost; totalSpent += cost; if(type==='S') stocksOwned[asset]+=amt; else cryptoOwned[asset]+=amt; showMsg("בוצע!", "event-positive"); }
        else showMsg("אין מספיק כסף!", "event-negative");
    } else { // מכירה
        let owned = (type==='S') ? stocksOwned[asset] : cryptoOwned[asset];
        if(owned >= Math.abs(amt)) { money += cost; totalEarned += cost; if(type==='S') stocksOwned[asset]+=amt; else cryptoOwned[asset]+=amt; showMsg("נמכר!", "event-positive"); }
        else showMsg("אין מספיק יחידות!", "event-negative");
    }
    updateUI();
}

function bankOp(t) {
    const a = Math.abs(Number(document.getElementById("bAmt")?.value || 0));
    if(t==='dep' && money>=a) { money-=a; bank+=a; showMsg("הופקד בהצלחה", "event-positive"); }
    else if(t==='wit' && bank>=a) { bank-=a; money+=a; showMsg("נמשך בהצלחה", "event-positive"); }
    else if(t==='loan' && loan < 100000) { loan+=10000; money+=10000; showMsg("הלוואה אושרה", "event-positive"); }
    else if(t==='pay' && money>=5000 && loan>0) { money-=5000; loan-=5000; totalSpent+=5000; showMsg("חלק מהחוב הוחזר", "event-positive"); }
    else { showMsg("פעולה נכשלה!", "event-negative"); }
    updateUI(); openTab('bank');
}

function startWork(p, t) {
    if(working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => {
        s += 0.1; if(bar) bar.style.width = (s/t*100) + "%";
        if(s >= t) { 
            clearInterval(i); working = false; money += p; totalEarned += p; xp += 25; 
            if(xp>=100){ xp=0; level++; showMsg("עלית רמה!", "event-positive"); }
            updateUI(); openTab('work'); showMsg("עבדת והרווחת!", "event-positive"); 
        }
    }, 100);
}

function buy(n, c, p, isSkill = false) {
    if(money >= c) { money -= c; totalSpent += c; if(isSkill) xp += 40; else passive += p; showMsg("תתחדש!", "event-positive"); updateUI(); }
    else { showMsg("אין מספיק כסף!", "event-negative"); }
}

function claimGift() {
    if(Date.now() - lastGift >= 14400000) { money += 5000; totalEarned += 5000; lastGift = Date.now(); updateUI(); openTab('home'); showMsg("מתנה התקבלה!", "event-positive"); }
}

function toggleTheme() { theme = (theme==='dark'?'light':'dark'); updateUI(); openTab('home'); }
function resetGame() { if(confirm("Alexey, בטוח שאתה רוצה למחוק הכל?")) { localStorage.clear(); location.reload(); } }

setInterval(() => { if(passive > 0) { money += (passive/10); updateUI(); } }, 1000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
