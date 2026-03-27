// --- מערכת טעינה ושמירה ---
const load = (k, d) => { 
    try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } 
    catch(e) { return d; } 
};

// --- משתני ליבה ---
let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0);
let level = load('level', 1), xp = load('xp', 0), loan = load('loan', 0);
let lastGift = load('lastGift', 0), theme = load('theme', 'dark'), working = false;

// --- נכסים וכישורים ---
let invOwned = load('invOwned', { AAPL:0, TSLA:0, GOOG:0, AMZN:0, MSFT:0, NVDA:0, BTC:0, ETH:0, SOL:0, DOGE:0 });
let prices = { AAPL:185, TSLA:710, GOOG:2520, AMZN:175, MSFT:410, NVDA:920, BTC:64000, ETH:3450, SOL:145, DOGE:0.16 };
let skills = load('skills', []);
let inventory = load('inventory', []);

// --- עדכון ממשק משתמש ---
function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.getElementById("level-ui").innerText = level;
    document.body.className = theme + "-theme";
    save();
}

function save() {
    const data = { money, bank, passive, totalEarned, totalSpent, level, xp, loan, lastGift, theme, invOwned, skills, inventory };
    Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
}

function showMsg(txt, type) {
    const b = document.getElementById("status-bar"), s = document.getElementById("msg-text");
    s.innerText = txt; b.className = type;
    setTimeout(() => { b.className = ""; s.innerText = ""; }, 3000);
}

// --- עדכון מחירים בזמן אמת ---
setInterval(() => {
    Object.keys(prices).forEach(k => {
        let change = (Math.random() * 0.04 - 0.02); 
        prices[k] *= (1 + change);
    });
    if(document.getElementById("btnInvest")?.classList.contains("active")) openTab('invest');
}, 5000);

// --- ניהול טאבים ותוכן ---
function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if(btn) btn.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        const nextGift = 14400000 - (Date.now() - lastGift);
        c.innerHTML = `
        <div class="card fade-in">
            <h2 style="color:var(--blue)">שלום, Alexey</h2>
            <div style="text-align:right; font-size:14px; line-height:1.8">
                <p>🎭 רמה: <b>${level}</b> (${xp}/100 XP)</p>
                <p>📈 הכנסה פסיבית: <b>${(passive/10).toFixed(1)}₪/שנייה</b></p>
                <p>💰 סך רווחים: <span style="color:var(--green)">${totalEarned.toLocaleString()}₪</span></p>
                <p>💸 סך הוצאות: <span style="color:var(--main)">${totalSpent.toLocaleString()}₪</span></p>
                <p>🎓 כישורים שנלמדו: <b>${skills.length} / 10</b></p>
                <p>🎒 חפצים בבעלותך: <b>${inventory.length}</b></p>
                <p>🏦 חוב לבנק: <span style="color:red">${loan.toLocaleString()}₪</span></p>
            </div>
            <button class="action" onclick="claimGift()" ${nextGift > 0 ? 'disabled' : ''}>
                🎁 ${nextGift > 0 ? 'מתנה בעוד ' + Math.ceil(nextGift/60000) + ' דק\'' : 'קבל 5,000₪'}
            </button>
        </div>`;
    }
    else if (tab === 'work') {
        const jobs = [
            {n:"שליח", p:400, t:4, r:1, s:null, i:"🛵"},
            {n:"מאבטח", p:900, t:8, r:2, s:null, i:"🛡️"},
            {n:"נהג טקסי", p:1300, t:10, r:3, s:"רישיון נהיגה", i:"🚕"},
            {n:"טכנאי PC", p:2400, t:15, r:5, s:"תעודת טכנאי", i:"🔧"},
            {n:"מעצב", p:6500, t:25, r:8, s:"עיצוב גרפי", i:"🎨"},
            {n:"מתכנת", p:13000, t:35, r:10, s:"תכנות", i:"💻"},
            {n:"סוחר בורסה", p:19500, t:40, r:12, s:"כלכלה", i:"📊"},
            {n:"עורך דין", p:28000, t:50, r:15, s:"משפטים", i:"⚖️"},
            {n:"מנכ\"ל", p:60000, t:60, r:20, s:"תואר שני", i:"🏢"}
        ];
        c.innerHTML = `<div class="card"><div class="xpbar"><div id="wb"></div></div></div><div class="grid-2"></div>`;
        jobs.forEach(j => {
            const hasSkill = !j.s || skills.includes(j.s);
            const locked = level < j.r || !hasSkill;
            c.querySelector(".grid-2").innerHTML += `
            <div class="card" style="opacity:${locked?0.5:1}">
                <b>${j.i} ${j.n}</b><br><small>${locked ? (level < j.r ? 'רמה '+j.r : 'חסר: '+j.s) : j.p+'₪'}</small>
                <button class="action" onclick="startWork(${j.p},${j.t})" ${locked||working?'disabled':''}>עבוד</button>
            </div>`;
        });
    }
    else if (tab === 'invest') {
        c.innerHTML = `<div class="grid-2"></div>`;
        Object.keys(prices).forEach(k => {
            c.querySelector(".grid-2").innerHTML += `
            <div class="card"><b>${k}</b><br>${prices[k].toFixed(2)}₪<br><small>שלך: ${invOwned[k].toFixed(2)}</small>
            <button class="action" onclick="trade('${k}', 1)">קנה</button>
            <button class="action" style="background:var(--main)" onclick="trade('${k}', -1)">מכור</button></div>`;
        });
    }
    else if (tab === 'business') {
        const bz = [
            {n:"דוכן קפה", c:15000, p:120}, {n:"קיוסק", c:35000, p:350}, {n:"מכבסה", c:85000, p:900}, 
            {n:"בר", c:250000, p:2800}, {n:"מסעדה", c:650000, p:7200}, {n:"מוסך", c:1300000, p:15000},
            {n:"מלון", c:4800000, p:58000}, {n:"קניון", c:16000000, p:210000}, {n:"חברת תעופה", c:85000000, p:980000}, {n:"תחנת כוח", c:300000000, p:3500000}
        ];
        c.innerHTML = `<div class="grid-2"></div>`;
        bz.forEach(b => c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${b.n}</b><br><small>${b.c.toLocaleString()}₪</small><button class="action" onclick="buyBiz('${b.n}',${b.c},${b.p})">קנה</button></div>`);
    }
    else if (tab === 'realestate') {
        const re = [
            {n:"חניה", c:85000, p:650}, {n:"מחסן", c:160000, p:1300}, {n:"סטודיו", c:680000, p:5800},
            {n:"דירה", c:1900000, p:17000}, {n:"פנטהאוז", c:4800000, p:45000}, {n:"וילה", c:9500000, p:90000},
            {n:"בניין", c:55000000, p:580000}, {n:"מפעל", c:150000000, p:1600000}, {n:"מגדל", c:450000000, p:5200000}, {n:"אי", c:900000000, p:12000000}
        ];
        c.innerHTML = `<div class="grid-2"></div>`;
        re.forEach(r => c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${r.n}</b><br><small>${r.c.toLocaleString()}₪</small><button class="action" onclick="buyBiz('${r.n}',${r.c},${r.p})">קנה</button></div>`);
    }
    else if (tab === 'market') {
        const mk = ["אייפון 15", "שעון רולקס", "מחשב גיימינג", "אופנוע כביש", "רכב יד 2", "רכב יוקרה", "יאכטה", "מטוס פרטי", "חליפת מעצבים", "טבעת יהלום"];
        c.innerHTML = `<div class="grid-2"></div>`;
        mk.forEach((m, i) => {
            const cost = (i + 1) * 6000;
            c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${m}</b><br><small>${cost.toLocaleString()}₪</small><button class="action" onclick="buyItem('${m}',${cost})">קנה</button></div>`;
        });
    }
    else if (tab === 'skills') {
        const sk = [
            {n:"רישיון נהיגה", c:5500}, {n:"תעודת טכנאי", c:13000}, {n:"עיצוב גרפי", c:22000}, {n:"ניהול", c:38000}, 
            {n:"תכנות", c:65000}, {n:"כלכלה", c:90000}, {n:"משפטים", c:160000}, {n:"תואר שני", c:280000},
            {n:"שיווק", c:32000}, {n:"אנגלית עסקית", c:16000}
        ];
        c.innerHTML = `<div class="grid-2"></div>`;
        sk.forEach(s => {
            const owned = skills.includes(s.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${s.n}</b><br><small>${s.c.toLocaleString()}₪</small><button class="action" onclick="learn('${s.n}',${s.c})" ${owned?'disabled':''}>${owned?'נלמד':'למד'}</button></div>`;
        });
    }
    else if (tab === 'bank') {
        c.innerHTML = `
        <div class="card fade-in">
            <h3>🏦 בנק</h3>
            <input id="bAmt" type="number" placeholder="הכנס סכום...">
            <div style="display:flex; gap:5px;"><button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button></div>
            <hr style="opacity:0.1; margin:15px 0;">
            <p>חוב: <span style="color:red">${loan}₪</span></p>
            <button class="action" style="background:var(--main)" onclick="bankOp('loan')">הלוואה (10k)</button>
            <button class="action" style="background:var(--green)" onclick="bankOp('pay')">החזר חוב (5k)</button>
        </div>`;
    }
}

// --- פונקציות פעולה ---
function startWork(p, t) {
    if(working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => {
        s += 0.1; if(bar) bar.style.width = (s/t*100) + "%";
        if(s >= t) { 
            clearInterval(i); working = false; money += p; totalEarned += p; xp += 20;
            passive += 2; // בונוס פסיבי על כל עבודה
            if(xp>=100){xp=0;level++; showMsg("עלית רמה!", "event-positive");} 
            updateUI(); openTab('work'); 
        }
    }, 100);
}

function trade(asset, amt) {
    let p = prices[asset], cost = p * Math.abs(amt);
    if(amt > 0) {
        if(money >= cost) { money -= cost; totalSpent += cost; invOwned[asset] += amt; showMsg("נקנה!", "event-positive"); }
        else showMsg("אין כסף!", "event-negative");
    } else {
        if(invOwned[asset] >= Math.abs(amt)) { money += cost; totalEarned += cost; invOwned[asset] += amt; showMsg("נמכר!", "event-positive"); }
    }
    updateUI(); openTab('invest');
}

function buyBiz(n, c, p) {
    if(money >= c) { money -= c; totalSpent += c; passive += p; showMsg("תתחדש!", "event-positive"); updateUI(); }
    else showMsg("אין כסף!", "event-negative");
}

function buyItem(n, c) {
    if(money >= c) {
        money -= c; totalSpent += c; inventory.push(n);
        passive += 15; // בונוס פסיבי על קנייה בשוק
        showMsg("נרכש!", "event-positive"); updateUI(); openTab('market');
    } else showMsg("אין כסף!", "event-negative");
}

function learn(n, c) {
    if(money >= c && !skills.includes(n)) {
        money -= c; totalSpent += c; skills.push(n); xp += 50;
        if(xp>=100){xp=0;level++;} updateUI(); openTab('skills');
    }
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
function resetGame() { if(confirm("Alexey, למחוק הכל?")) { localStorage.clear(); location.reload(); } }

// --- הפעלה ---
setInterval(() => { if(passive > 0) { money += (passive/10); updateUI(); } }, 1000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
