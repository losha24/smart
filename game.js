const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };

let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0);
let level = load('level', 1), xp = load('xp', 0), loan = load('loan', 0);
let lastGift = load('lastGift', 0), theme = load('theme', 'dark'), working = false;
let invOwned = load('invOwned', { AAPL:0, TSLA:0, GOOG:0, AMZN:0, MSFT:0, BTC:0, ETH:0 });
let skills = load('skills', []), inventory = load('inventory', []);
let activeTasks = load('activeTasks', []), completedCount = load('completedCount', 0);

const bzPool = [
    {n:"דוכן קפה", c:15000, p:120}, {n:"קיוסק", c:35000, p:350}, {n:"מכבסה", c:85000, p:900}, 
    {n:"בר", c:250000, p:2800}, {n:"מסעדה", c:650000, p:7200}, {n:"מוסך", c:1300000, p:15000},
    {n:"מלון", c:4800000, p:58000}, {n:"קניון", c:16000000, p:210000}, {n:"חברת תעופה", c:85000000, p:980000}, {n:"תחנת כוח", c:300000000, p:3500000}
];

const rePool = [
    {n:"חניה", c:85000, p:650}, {n:"מחסן", c:160000, p:1300}, {n:"סטודיו", c:680000, p:5800},
    {n:"דירה", c:1900000, p:17000}, {n:"פנטהאוז", c:4800000, p:45000}, {n:"וילה", c:9500000, p:90000},
    {n:"בניין", c:55000000, p:580000}, {n:"מפעל", c:150000000, p:1600000}, {n:"מגדל", c:450000000, p:5200000}, {n:"אי פרטי", c:900000000, p:12000000}
];

const mkPool = [
    {n:"אייפון 15", c:4500}, {n:"רישיון לנשק", c:5000}, {n:"שעון רולקס", c:45000}, 
    {n:"מחשב גיימינג", c:12000}, {n:"אופנוע", c:35000}, {n:"רכב יוקרה", c:250000}, 
    {n:"יאכטה", c:1200000}, {n:"מטוס פרטי", c:15000000}, {n:"חליפת מעצבים", c:8000}, {n:"טבעת יהלום", c:25000}
];

const skPool = [
    {n:"רישיון נהיגה", c:5000}, {n:"תעודת טכנאי", c:13000}, {n:"עיצוב גרפי", c:22000}, 
    {n:"ניהול", c:38000}, {n:"תכנות", c:65000}, {n:"כלכלה", c:90000}, 
    {n:"משפטים", c:160000}, {n:"תואר שני", c:280000}, {n:"שיווק", c:32000}, {n:"אנגלית עסקית", c:16000}
];

const regularTasks = [
    { id: 1, desc: "הרווח 20,000₪ סה\"כ", goal: 20000, type: "earned", reward: 5000 },
    { id: 2, desc: "בזבז 10,000₪ בשוק", goal: 10000, type: "spent", reward: 3000 },
    { id: 3, desc: "הגע לרמה 5", goal: 5, type: "level", reward: 8000 }
];

const epicTasks = [
    { id: 100, desc: "משימת על: רמה 15", goal: 15, type: "level", reward: 100000 },
    { id: 101, desc: "משימת על: רווח 500k", goal: 500000, type: "earned", reward: 100000 }
];

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.body.className = theme + "-theme";
    save();
}

function save() {
    const data = { money, bank, passive, totalEarned, totalSpent, level, xp, loan, lastGift, theme, invOwned, skills, inventory, activeTasks, completedCount };
    Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
}

function refreshTasks() {
    while (activeTasks.length < 2) {
        let r = regularTasks[Math.floor(Math.random() * regularTasks.length)];
        if (!activeTasks.find(t => t.id === r.id)) activeTasks.push(r);
    }
    if (activeTasks.length < 3) {
        let e = epicTasks[Math.floor(Math.random() * epicTasks.length)];
        activeTasks.push(e);
    }
}

function checkTaskProgress(t) {
    if (t.type === "earned") return totalEarned >= t.goal;
    if (t.type === "level") return level >= t.goal;
    if (t.type === "bank") return bank >= t.goal;
    if (t.type === "spent") return totalSpent >= t.goal;
    return false;
}

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        const nextGift = 14400000 - (Date.now() - lastGift);
        const allItems = [...skills, ...inventory];
        c.innerHTML = `<div class="card fade-in">
            <h3>📊 נתוני חשבון</h3>
            <p>🎭 רמה: ${level} (${xp}/100 XP) | 📈 פסיבי: ${(passive/10).toFixed(1)}/s</p>
            <p>💰 רווח: ${totalEarned.toLocaleString()}₪ | 🏦 חוב: ${loan.toLocaleString()}₪</p>
            <hr><h4>🎒 הפריטים שלי (${allItems.length}):</h4>
            <div class="item-list">${allItems.map(i => `<span>${i}</span>`).join('') || 'אין פריטים עדיין'}</div>
            <button class="action" onclick="claimGift()" ${nextGift > 0 ? 'disabled' : ''}>
                🎁 מתנה (${(5000+(level*500)).toLocaleString()}₪)
            </button>
        </div>`;
    }
    else if (tab === 'work') {
        const jobs = [
            {n:"שליח", p:400, t:4, s:null}, 
            {n:"מאבטח", p:1200, t:10, s:"רישיון לנשק"}, 
            {n:"נהג", p:1800, t:12, s:"רישיון נהיגה"},
            {n:"מתכנת", p:15000, t:40, s:"תכנות"}
        ];
        c.innerHTML = `<div class="card"><div class="xpbar"><div id="wb"></div></div></div><div class="grid-2"></div>`;
        jobs.forEach(j => {
            const ok = !j.s || skills.includes(j.s) || inventory.includes(j.s);
            c.querySelector(".grid-2").innerHTML += `<div class="card" style="opacity:${ok?1:0.5}">
                <b>${j.n}</b><br><button class="action" onclick="startWork(${j.p},${j.t})" ${!ok||working?'disabled':''}>${ok?j.p+'₪':'צריך '+j.s}</button>
            </div>`;
        });
    }
    else if (tab === 'tasks') {
        refreshTasks();
        activeTasks.forEach((t, i) => {
            const done = checkTaskProgress(t);
            c.innerHTML += `<div class="card" style="border: 2px solid ${i==2?'#ffd700':'#334155'}">
                <b>${t.desc}</b><br><small>פרס: ${t.reward.toLocaleString()}₪</small>
                <button class="action" onclick="completeTask(${t.id})" style="background:${done?'var(--green)':'#334155'}">${done?'קבל פרס':'בביצוע'}</button>
            </div>`;
        });
    }
    else if (tab === 'business') {
        c.innerHTML = `<div class="grid-2"></div>`;
        bzPool.forEach(b => c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${b.n}</b><br><small>${b.c.toLocaleString()}₪</small><button class="action" onclick="buyBiz('${b.n}',${b.c},${b.p})">קנה</button></div>`);
    }
    else if (tab === 'realestate') {
        c.innerHTML = `<div class="grid-2"></div>`;
        rePool.forEach(r => c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${r.n}</b><br><small>${r.c.toLocaleString()}₪</small><button class="action" onclick="buyBiz('${r.n}',${r.c},${r.p})">קנה</button></div>`);
    }
    else if (tab === 'market') {
        c.innerHTML = `<div class="grid-2"></div>`;
        mkPool.forEach(m => c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${m.n}</b><br><small>${m.c.toLocaleString()}₪</small><button class="action" onclick="buyItem('${m.n}',${m.c})">קנה</button></div>`);
    }
    else if (tab === 'skills') {
        c.innerHTML = `<div class="grid-2"></div>`;
        skPool.forEach(s => {
            const owned = skills.includes(s.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${s.n}</b><br><small>${s.c.toLocaleString()}₪</small><button class="action" onclick="learn('${s.n}',${s.c})" ${owned?'disabled':''}>${owned?'נלמד':'למד'}</button></div>`;
        });
    }
    else if (tab === 'install') {
        c.innerHTML = `<div class="card fade-in"><h3>📲 התקנה</h3><p>כדי להתקין:</p><ol><li>לחץ על 'שתף'</li><li>בחר 'הוסף למסך הבית'</li></ol></div>`;
    }
}

function startWork(p, t) {
    if(working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => {
        s += 0.1; if(bar) bar.style.width = (s/t*100) + "%";
        if(s >= t) { 
            clearInterval(i); working = false; money += p; totalEarned += p; xp += 25;
            if(xp >= 100) { xp = 0; level++; passive += 50; money += 5000; showMsg("עלית רמה! +5,000₪", "event-positive"); }
            updateUI(); openTab('work'); 
        }
    }, 100);
}

function buyBiz(n, c, p) { if(money >= c) { money -= c; totalSpent += c; passive += p; updateUI(); showMsg("נרכש!", "event-positive"); } }
function buyItem(n, c) { if(money >= c) { money -= c; totalSpent += c; inventory.push(n); passive += 10; updateUI(); showMsg("קנית " + n, "event-positive"); } }
function learn(n, c) { if(money >= c && !skills.includes(n)) { money -= c; skills.push(n); updateUI(); openTab('skills'); } }
function completeTask(id) {
    const idx = activeTasks.findIndex(t => t.id === id);
    if(idx > -1 && checkTaskProgress(activeTasks[idx])) {
        money += activeTasks[idx].reward; activeTasks.splice(idx, 1); refreshTasks(); openTab('tasks'); updateUI();
    }
}
function claimGift() { 
    const g = 5000 + (level * 500); 
    if(Date.now() - lastGift >= 14400000) { money += g; lastGift = Date.now(); updateUI(); openTab('home'); } 
}
function toggleTheme() { theme = (theme === 'dark' ? 'light' : 'dark'); updateUI(); }
function showMsg(txt, type) { const b = document.getElementById("status-bar"); b.innerText = txt; b.className = type; setTimeout(() => b.className = "", 3000); }
function resetGame() { if(confirm("לאפס?")) { localStorage.clear(); location.reload(); } }

setInterval(() => { if(passive > 0) { money += (passive/10); updateUI(); } }, 1000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
