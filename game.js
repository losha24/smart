const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };

let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0);
let level = load('level', 1), xp = load('xp', 0), loan = load('loan', 0);
let lastGift = load('lastGift', 0), theme = load('theme', 'dark'), working = false;
let invOwned = load('invOwned', { AAPL:0, TSLA:0, BTC:0, ETH:0 });
let skills = load('skills', []), inventory = load('inventory', []);
let activeTasks = load('activeTasks', []), completedCount = load('completedCount', 0);

const regularTasks = [
    { id: 1, desc: "הרווח 20,000₪ סך הכל", goal: 20000, type: "earned", reward: 5000 },
    { id: 2, desc: "בזבז 10,000₪ בשוק", goal: 10000, type: "spent", reward: 3000 },
    { id: 3, desc: "הגע לרמה 5", goal: 5, type: "level", reward: 8000 },
    { id: 4, desc: "חסוך 50,000₪ בבנק", goal: 50000, type: "bank", reward: 10000 }
];

const epicTasks = [
    { id: 100, desc: "משימת על: הגע לרמה 15", goal: 15, type: "level", reward: 100000 },
    { id: 101, desc: "משימת על: רווח של 500,000₪", goal: 500000, type: "earned", reward: 100000 }
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
        activeTasks.push(epicTasks[Math.floor(Math.random() * epicTasks.length)]);
    }
}

function checkTask(t) {
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
            <h3>📊 נתונים</h3>
            <p>🎭 רמה: ${level} | 📈 פסיבי: ${(passive/10).toFixed(1)}/s</p>
            <p>💰 רווח: ${totalEarned.toLocaleString()}₪ | 🏦 חוב: ${loan}₪</p>
            <hr><h4>🎒 הפריטים שלי:</h4>
            <div class="item-list">${allItems.map(i => `<span>${i}</span>`).join('') || 'ריק'}</div>
            <button class="action" onclick="claimGift()" ${nextGift > 0 ? 'disabled' : ''}>🎁 מתנה (${5000+(level*500)}₪)</button>
        </div>`;
    }
    else if (tab === 'work') {
        const jobs = [{n:"שליח", p:400, t:4, s:null}, {n:"מאבטח", p:1200, t:10, s:"רישיון לנשק"}, {n:"מתכנת", p:15000, t:40, s:"תכנות"}];
        c.innerHTML = `<div class="card"><div class="xpbar"><div id="wb"></div></div></div><div class="grid-2"></div>`;
        jobs.forEach(j => {
            const ok = !j.s || skills.includes(j.s) || inventory.includes(j.s);
            c.querySelector(".grid-2").innerHTML += `<div class="card" style="opacity:${ok?1:0.5}"><b>${j.n}</b><br><button class="action" onclick="startWork(${j.p},${j.t})" ${!ok||working?'disabled':''}>${ok?j.p+'₪':'צריך '+j.s}</button></div>`;
        });
    }
    else if (tab === 'tasks') {
        refreshTasks();
        activeTasks.forEach((t, i) => {
            const done = checkTask(t);
            c.innerHTML += `<div class="card" style="border: 2px solid ${i==2?'#ffd700':'#334155'}">
                <b>${t.desc}</b><br><small>פרס: ${t.reward.toLocaleString()}₪</small>
                <button class="action" onclick="finishTask(${t.id})" style="background:${done?'var(--green)':'#334155'}">${done?'קבל פרס':'בביצוע'}</button>
            </div>`;
        });
    }
    else if (tab === 'market') {
        const items = [{n:"רישיון לנשק", c:5000}, {n:"אייפון 15", c:4500}, {n:"רכב יוקרה", c:150000}];
        c.innerHTML = `<div class="grid-2"></div>`;
        items.forEach(m => c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${m.n}</b><br>${m.c}₪<button class="action" onclick="buyItem('${m.n}',${m.c})">קנה</button></div>`);
    }
    else if (tab === 'skills') {
        const sks = [{n:"תכנות", c:50000}, {n:"רישיון נהיגה", c:5000}];
        c.innerHTML = `<div class="grid-2"></div>`;
        sks.forEach(s => c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${s.n}</b><br>${s.c}₪<button class="action" onclick="learn('${s.n}',${s.c})">למד</button></div>`);
    }
}

function startWork(p, t) {
    if(working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => {
        s += 0.1; if(bar) bar.style.width = (s/t*100) + "%";
        if(s >= t) { 
            clearInterval(i); working = false; money += p; totalEarned += p; xp += 25;
            if(xp >= 100) { xp = 0; level++; passive += 50; money += 5000; }
            updateUI(); openTab('work'); 
        }
    }, 100);
}

function buyItem(n, c) { if(money >= c) { money -= c; totalSpent += c; inventory.push(n); passive += 10; updateUI(); openTab('market'); } }
function learn(n, c) { if(money >= c && !skills.includes(n)) { money -= c; skills.push(n); updateUI(); openTab('skills'); } }
function finishTask(id) { 
    const idx = activeTasks.findIndex(t => t.id === id);
    if(idx > -1 && checkTask(activeTasks[idx])) {
        money += activeTasks[idx].reward; totalEarned += activeTasks[idx].reward;
        activeTasks.splice(idx, 1); completedCount++; refreshTasks(); openTab('tasks'); updateUI();
    }
}
function claimGift() { const g = 5000 + (level * 500); if(Date.now() - lastGift >= 14400000) { money += g; totalEarned += g; lastGift = Date.now(); updateUI(); openTab('home'); } }
function toggleTheme() { theme = (theme === 'dark' ? 'light' : 'dark'); updateUI(); openTab(document.querySelector('.topbar .active').id.replace('btn','').toLowerCase()); }
function resetGame() { if(confirm("לאפס?")) { localStorage.clear(); location.reload(); } }

setInterval(() => { if(passive > 0) { money += (passive/10); updateUI(); } }, 1000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
