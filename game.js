const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };

// משתני ליבה
let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let loan = load('loan', 0), lastGift = load('lastGift', 0), theme = load('theme', 'dark');
let skills = load('skills', []), inventory = load('inventory', []);
let totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0);

// בורסה
let stocks = load('stocks', [
    {id:'AAPL', n:'Apple', p:180}, {id:'TSLA', n:'Tesla', p:240},
    {id:'NVDA', n:'Nvidia', p:120}, {id:'BTC', n:'Bitcoin', p:65000}
]);
let invOwned = load('invOwned', { AAPL:0, TSLA:0, NVDA:0, BTC:0 });

// מערכת משימות
let activeTasks = load('activeTasks', []);
const taskPool = [
    {n: "לעבוד 3 פעמים", goal: 3, r: 5000, type: 'work'},
    {n: "להרוויח 20,000₪", goal: 20000, r: 8000, type: 'earn'},
    {n: "לקנות מוצר/עסק", goal: 1, r: 10000, type: 'buy'},
    {n: "להפקיד לבנק", goal: 10000, r: 3000, type: 'bank'}
];

function initTasks() {
    if (activeTasks.length === 0 || activeTasks.some(t => t === null)) {
        activeTasks = [
            {...taskPool[Math.floor(Math.random()*taskPool.length)], id: Math.random(), cur: 0},
            {...taskPool[Math.floor(Math.random()*taskPool.length)], id: Math.random(), cur: 0},
            {id: 'gold', n: "משימת זהב: להוציא מיליון", goal: 1000000, cur: 0, r: 350000, type: 'spend', isGold: true}
        ];
    }
}

// נתונים
const bzPool = [{n:"דוכן קפה", c:15000, p:120}, {n:"קיוסק", c:35000, p:350}, {n:"מכבסה", c:85000, p:900}, {n:"חברת הייטק", c:25000000, p:400000}];
const rePool = [{n:"חניה", c:85000, p:650}, {n:"מחסן", c:160000, p:1300}, {n:"דירת סטודיו", c:680000, p:5800}, {n:"בית פרטי", c:4500000, p:42000}];
const skPool = [{n:"רישיון נהיגה", c:5000}, {n:"רישיון לנשק", c:8000}, {n:"תכנות JS", c:45000}, {n:"קורס טיס", c:150000}];
const mkPool = [{n:"אייפון 15", c:4500}, {n:"לפטופ גיימינג", c:12000}, {n:"רכב ספורט", c:450000}];
const jobs = [{n:"שליח", p:400, t:4, s:null}, {n:"מאבטח", p:1200, t:10, s:"רישיון לנשק"}, {n:"מתכנת", p:15000, t:35, s:"תכנות JS"}, {n:"טייס", p:60000, t:60, s:"קורס טיס"}];

function save() {
    const data = { money, bank, passive, loan, lastGift, theme, skills, inventory, activeTasks, totalEarned, totalSpent, invOwned };
    Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.getElementById("app-body").className = theme + "-theme";
    save();
}

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if(activeBtn) activeBtn.classList.add("active");

    const c = document.getElementById("content");
    if(!c) return;
    c.innerHTML = "";
    initTasks();

    if (tab === 'home') {
        let stockVal = 0;
        stocks.forEach(s => stockVal += (invOwned[s.id] || 0) * s.p * 4);
        c.innerHTML = `<div class="card"><h3>📊 סטטוס חשבון</h3><p>💰 הכנסות: ${totalEarned.toLocaleString()}₪</p><p>📉 הוצאות: ${totalSpent.toLocaleString()}₪</p><p>📈 שווי מניות: <b>${Math.floor(stockVal).toLocaleString()}₪</b></p><p>💳 חוב לבנק: <span class="neg-text">${loan.toLocaleString()}₪</span></p><hr><button class="action" onclick="claimGift()">🎁 קבל מתנה</button></div>`;
    }
    else if (tab === 'work') {
        c.innerHTML = `<div class="card"><div class="xpbar"><div id="wb"></div></div></div><div class="grid-2"></div>`;
        jobs.forEach(j => {
            const has = !j.s || skills.includes(j.s);
            c.querySelector(".grid-2").innerHTML += `<div class="card" style="opacity:${has?1:0.5}"><b>${j.n}</b><br><button class="action" onclick="startWork(${j.p},${j.t})" ${!has||working?'disabled':''}>${has?j.p+'₪':'צריך '+j.s}</button></div>`;
        });
    }
    else if (tab === 'tasks') {
        c.innerHTML = `<h3>🎯 משימות</h3>`;
        activeTasks.forEach(t => {
            c.innerHTML += `<div class="card ${t.isGold?'gold-task':''}"><b>${t.n}</b><br>${Math.floor(t.cur).toLocaleString()} / ${t.goal.toLocaleString()}</div>`;
        });
    }
    else if (tab === 'invest') {
        stocks.forEach(s => {
            c.innerHTML += `<div class="card"><b>${s.n}</b>: ${s.p.toFixed(2)}$ <small>(${invOwned[s.id]||0})</small><div class="nav-row"><button class="action" onclick="buyStock('${s.id}',${s.p})">קנה</button><button class="action" style="background:var(--main)" onclick="sellStock('${s.id}',${s.p})">מכור</button></div></div>`;
        });
    }
    else if (tab === 'install') {
        c.innerHTML = `<div class="card"><h3>📲 התקנה על המסך</h3><p><b>אנדרואיד:</b> תפריט דפדפן (3 נקודות) -> הוספה למסך הבית.</p><p><b>אייפון:</b> כפתור שיתוף (ריבוע עם חץ) -> הוספה למסך הבית.</p></div>`;
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input type="number" id="bankAmt" placeholder="סכום..."><div class="nav-row"><button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" onclick="bankOp('wit')">משיכה</button></div><button class="action" onclick="bankOp('loan')">הלוואה (5K)</button><button class="action" onclick="bankOp('pay')">החזר (5K)</button></div>`;
    }
    else if (['business', 'realestate', 'market', 'skills'].includes(tab)) {
        let list = (tab==='business')?bzPool : (tab==='realestate')?rePool : (tab==='market')?mkPool : skPool;
        c.innerHTML = `<div class="grid-2"></div>`;
        list.forEach(i => {
            const has = tab==='skills' && skills.includes(i.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${i.n}</b><br>${i.c.toLocaleString()}₪<button class="action" onclick="${tab==='skills'?'learn':'buyProp'}('${i.n}',${i.c},${i.p||0})" ${has?'disabled':''}>${has?'נלמד':'קנה'}</button></div>`;
        });
    }
}

let working = false;
function startWork(p, t) {
    if(working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => {
        s += 0.1; if(bar) bar.style.width = (s/t*100) + "%";
        if(s >= t) {
            clearInterval(i); working = false; money += p; totalEarned += p;
            activeTasks.forEach(tk => { if(tk.type==='work') tk.cur++; if(tk.type==='earn') tk.cur+=p; });
            checkTasks(); updateUI(); openTab('work');
        }
    }, 100);
}

function checkTasks() {
    activeTasks.forEach((t, i) => {
        if(t.cur >= t.goal) {
            money += t.r;
            if(t.isGold) activeTasks.splice(i, 1);
            else activeTasks[i] = {...taskPool[Math.floor(Math.random()*taskPool.length)], id:Math.random(), cur:0};
        }
    });
}

function toggleTheme() { theme = (theme === 'dark' ? 'light' : 'dark'); updateUI(); }
function buyStock(id, p) { if(money>=p*4) { money-=p*4; invOwned[id]++; updateUI(); openTab('invest'); } }
function sellStock(id, p) { if(invOwned[id]>0) { invOwned[id]--; money+=p*4; updateUI(); openTab('invest'); } }
function buyProp(n, c, p) { 
    if(money>=c) { money-=c; totalSpent+=c; passive+=p; 
    activeTasks.forEach(tk => { if(tk.type==='buy') tk.cur++; if(tk.type==='spend') tk.cur+=c; });
    updateUI(); } 
}
function learn(n, c) { 
    if(money>=c && !skills.includes(n)) { money-=c; totalSpent+=c; skills.push(n); 
    activeTasks.forEach(tk => { if(tk.type==='spend') tk.cur+=c; });
    updateUI(); openTab('skills'); } 
}
function bankOp(type) {
    const a = parseInt(document.getElementById("bankAmt")?.value) || 0;
    if(type==='dep' && money>=a) { money-=a; bank+=a; activeTasks.forEach(tk=>{if(tk.type==='bank') tk.cur+=a;}); }
    else if(type==='wit' && bank>=a) { bank-=a; money+=a; }
    else if(type==='loan') { loan+=5000; money+=5000; }
    else if(type==='pay' && money>=5000 && loan>=5000) { money-=5000; loan-=5000; }
    updateUI(); openTab('bank');
}
function claimGift() { if(Date.now()-lastGift >= 14400000) { money+=5000; lastGift=Date.now(); updateUI(); openTab('home'); } }
function resetGame() { if(confirm("לאפס הכל?")) { localStorage.clear(); location.reload(); } }

setInterval(() => { if(passive>0) { money+=(passive/10); updateUI(); } }, 1000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
