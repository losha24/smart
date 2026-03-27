const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };

let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0);
let level = load('level', 1), xp = load('xp', 0), loan = load('loan', 0);
let lastGift = load('lastGift', 0), theme = load('theme', 'dark'), working = false;

// השקעות ומניות מורחבות
let invOwned = load('invOwned', { AAPL:0, TSLA:0, GOOG:0, AMZN:0, MSFT:0, NVDA:0, BTC:0, ETH:0, SOL:0, DOGE:0 });
let prices = { AAPL:180, TSLA:700, GOOG:2500, AMZN:170, MSFT:400, NVDA:900, BTC:65000, ETH:3500, SOL:140, DOGE:0.15 };

// כישורים שנלמדו
let skills = load('skills', []);

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.getElementById("level-ui").innerText = level;
    document.body.className = theme + "-theme";
    save();
}

function save() {
    const data = { money, bank, passive, totalEarned, totalSpent, level, xp, loan, lastGift, theme, invOwned, skills };
    Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
}

function showMsg(txt, type) {
    const b = document.getElementById("status-bar"), s = document.getElementById("msg-text");
    s.innerText = txt; b.className = type;
    setTimeout(() => { b.className = ""; s.innerText = ""; }, 3000);
}

// עדכון מחירים רנדומלי
setInterval(() => {
    Object.keys(prices).forEach(k => {
        let change = (Math.random() * 0.04 - 0.02); // +/- 2%
        prices[k] *= (1 + change);
    });
    if(document.getElementById("btnInvest")?.classList.contains("active")) openTab('invest');
}, 5000);

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if(btn) btn.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        const nextGift = 14400000 - (Date.now() - lastGift);
        c.innerHTML = `<div class="card fade-in"><h2>שלום, Alexey</h2><p>גרסה: 4.2.0</p><button class="action" onclick="claimGift()" ${nextGift > 0 ? 'disabled' : ''}>🎁 ${nextGift > 0 ? 'מתנה בעוד ' + Math.ceil(nextGift/60000) + ' דק\'' : 'קבל 5,000₪'}</button></div>`;
    }
    else if (tab === 'work') {
        const jobs = [
            {n:"שליח", p:350, t:4, r:1, s:null, i:"🛵"},
            {n:"מאבטח", p:850, t:8, r:2, s:null, i:"🛡️"},
            {n:"נהג טקסי", p:1200, t:10, r:3, s:"רישיון נהיגה", i:"🚕"},
            {n:"טכנאי PC", p:2200, t:15, r:5, s:"תעודת טכנאי", i:"🔧"},
            {n:"מנהל צוות", p:4500, t:20, r:7, s:"ניהול", i:"👔"},
            {n:"מעצב", p:6000, t:25, r:8, s:"עיצוב גרפי", i:"🎨"},
            {n:"מתכנת", p:12000, t:35, r:10, s:"תכנות", i:"💻"},
            {n:"סוחר בורסה", p:18000, t:40, r:12, s:"כלכלה", i:"📊"},
            {n:"עורך דין", p:25000, t:50, r:15, s:"משפטים", i:"⚖️"},
            {n:"מנכ\"ל", p:55000, t:60, r:20, s:"תואר שני", i:"🏢"}
        ];
        c.innerHTML = `<div class="card"><div class="xpbar"><div id="wb"></div></div></div><div class="grid-2"></div>`;
        jobs.forEach(j => {
            const hasSkill = !j.s || skills.includes(j.s);
            const locked = level < j.r || !hasSkill;
            c.querySelector(".grid-2").innerHTML += `<div class="card" style="opacity:${locked?0.5:1}"><b>${j.i} ${j.n}</b><br><small>${locked ? (level < j.r ? 'רמה '+j.r : 'חסר: '+j.s) : j.p+'₪'}</small><button class="action" onclick="startWork(${j.p},${j.t})" ${locked||working?'disabled':''}>עבוד</button></div>`;
        });
    }
    else if (tab === 'invest') {
        c.innerHTML = `<div class="grid-2"></div>`;
        Object.keys(prices).forEach(k => {
            c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${k}</b><br>${prices[k].toFixed(2)}₪<br><small>שלך: ${invOwned[k].toFixed(2)}</small><button class="action" onclick="trade('${k}', 1)">קנה</button><button class="action" style="background:var(--main)" onclick="trade('${k}', -1)">מכור</button></div>`;
        });
    }
    else if (tab === 'business') {
        const bz = [
            {n:"דוכן קפה", c:15000, p:120}, {n:"קיוסק", c:35000, p:300}, {n:"מכבסה", c:85000, p:800}, {n:"בר", c:250000, p:2400}, 
            {n:"מסעדה", c:600000, p:6500}, {n:"מוסך", c:1200000, p:14000}, {n:"בית מלון", c:4500000, p:55000}, {n:"קניון", c:15000000, p:190000},
            {n:"חברת תעופה", c:80000000, p:950000}, {n:"תחנת כוח", c:250000000, p:3200000}
        ];
        c.innerHTML = `<div class="grid-2"></div>`;
        bz.forEach(b => c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${b.n}</b><br><small>${b.c.toLocaleString()}₪</small><button class="action" onclick="buyBiz('${b.n}',${b.c},${b.p})">קנה</button></div>`);
    }
    else if (tab === 'realestate') {
        const re = [
            {n:"חניה", c:80000, p:600}, {n:"מחסן", c:150000, p:1200}, {n:"סטודיו", c:650000, p:5500}, {n:"דירת 3 חדרים", c:1800000, p:16000},
            {n:"פנטהאוז", c:4500000, p:42000}, {n:"וילה", c:9000000, p:85000}, {n:"מגרש חקלאי", c:15000000, p:150000}, {n:"בניין משרדים", c:50000000, p:550000},
            {n:"מרכז לוגיסטי", c:120000000, p:1400000}, {n:"אי פרטי", c:500000000, p:6000000}
        ];
        c.innerHTML = `<div class="grid-2"></div>`;
        re.forEach(r => c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${r.n}</b><br><small>${r.c.toLocaleString()}₪</small><button class="action" onclick="buyBiz('${r.n}',${r.c},${r.p})">קנה</button></div>`);
    }
    else if (tab === 'market') {
        const mk = ["אייפון 15", "שעון רולקס", "מחשב גיימינג", "אופנוע כביש", "רכב יד 2", "רכב יוקרה", "יאכטה", "מטוס פרטי", "חליפת מעצבים", "טבעת יהלום"];
        c.innerHTML = `<div class="grid-2"></div>`;
        mk.forEach((m, i) => c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${m}</b><br><small>${((i+1)*5000).toLocaleString()}₪</small><button class="action" onclick="buyBiz('${m}',${(i+1)*5000},0)">קנה</button></div>`);
    }
    else if (tab === 'skills') {
        const sk = [
            {n:"רישיון נהיגה", c:5000}, {n:"תעודת טכנאי", c:12000}, {n:"עיצוב גרפי", c:20000}, {n:"ניהול", c:35000}, 
            {n:"תכנות", c:60000}, {n:"כלכלה", c:85000}, {n:"משפטים", c:150000}, {n:"תואר שני", c:250000},
            {n:"שיווק דיגיטלי", c:30000}, {n:"אנגלית עסקית", c:15000}
        ];
        c.innerHTML = `<div class="grid-2"></div>`;
        sk.forEach(s => {
            const owned = skills.includes(s.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${s.n}</b><br><small>${s.c.toLocaleString()}₪</small><button class="action" onclick="learn('${s.n}',${s.c})" ${owned?'disabled':''}>${owned?'למדת':'למד'}</button></div>`;
        });
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input id="bAmt" type="number" placeholder="סכום..."><div style="display:flex; gap:5px;"><button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button></div><hr><p>חוב: ${loan}₪</p><button class="action" style="background:var(--main)" onclick="bankOp('loan')">הלוואה (10k)</button><button class="action" style="background:var(--green)" onclick="bankOp('pay')">החזר (5k)</button></div>`;
    }
    else if (tab === 'install') {
        c.innerHTML = `<div class="card"><h3>📲 התקנה</h3><p>שתף > הוסף למסך הבית</p></div>`;
    }
}

function trade(asset, amt) {
    let price = prices[asset], cost = price * Math.abs(amt);
    if(amt > 0) {
        if(money >= cost) { money -= cost; totalSpent += cost; invOwned[asset] += amt; showMsg("קנית " + asset, "event-positive"); }
        else showMsg("אין כסף!", "event-negative");
    } else {
        if(invOwned[asset] >= Math.abs(amt)) { money += cost; totalEarned += cost; invOwned[asset] += amt; showMsg("מכרת " + asset, "event-positive"); }
    }
    updateUI(); openTab('invest');
}

function buyBiz(n, c, p) {
    if(money >= c) { money -= c; totalSpent += c; passive += p; showMsg("קנית " + n, "event-positive"); updateUI(); }
    else showMsg("חסר כסף!", "event-negative");
}

function learn(n, c) {
    if(money >= c && !skills.includes(n)) { money -= c; skills.push(n); xp += 50; if(xp>=100){xp=0;level++;} showMsg("למדת " + n, "event-positive"); updateUI(); openTab('skills'); }
    else showMsg("לא ניתן ללמוד!", "event-negative");
}

function startWork(p, t) {
    if(working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => {
        s += 0.1; if(bar) bar.style.width = (s/t*100) + "%";
        if(s >= t) { clearInterval(i); working = false; money += p; totalEarned += p; xp += 20; if(xp>=100){xp=0;level++;} updateUI(); openTab('work'); }
    }, 100);
}

function bankOp(t) {
    const a = Math.abs(Number(document.getElementById("bAmt")?.value || 0));
    if(t==='dep' && money>=a) { money-=a; bank+=a; }
    else if(t==='wit' && bank>=a) { bank-=a; money+=a; }
    else if(t==='loan' && loan < 1000000) { loan+=10000; money+=10000; }
    else if(t==='pay' && money>=5000 && loan>0) { money-=5000; loan-=5000; }
    updateUI(); openTab('bank');
}

function claimGift() { if(Date.now() - lastGift >= 14400000) { money += 5000; lastGift = Date.now(); updateUI(); openTab('home'); } }
function toggleTheme() { theme = (theme==='dark'?'light':'dark'); updateUI(); openTab('home'); }
function resetGame() { if(confirm("Alexey, לאפס הכל?")) { localStorage.clear(); location.reload(); } }

setInterval(() => { if(passive > 0) { money += (passive/10); updateUI(); } }, 1000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
