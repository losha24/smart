const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };

// משתני ליבה
let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let level = load('level', 1), xp = load('xp', 0), loan = load('loan', 0);
let lastGift = load('lastGift', 0), theme = load('theme', 'dark'), working = false;
let skills = load('skills', []), inventory = load('inventory', []);
let totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0);

// מאגרי נתונים לטאבים
const bzPool = [{n:"דוכן קפה", c:15000, p:120}, {n:"קיוסק", c:35000, p:350}, {n:"מכבסה", c:85000, p:900}, {n:"חברת הייטק", c:25000000, p:400000}];
const rePool = [{n:"חניה", c:85000, p:650}, {n:"מחסן", c:160000, p:1300}, {n:"דירת סטודיו", c:680000, p:5800}, {n:"בית פרטי", c:4500000, p:42000}];
const skPool = [{n:"רישיון נהיגה", c:5000}, {n:"רישיון לנשק", c:8000}, {n:"תעודת חובש", c:12000}, {n:"קורס טיס", c:150000}, {n:"תכנות JS", c:45000}];
const mkPool = [{n:"אייפון 15", c:4500}, {n:"לפטופ גיימינג", c:12000}, {n:"רכב ספורט", c:450000}];
const jobs = [
    {n:"שליח", p:400, t:4, s:null}, {n:"מאבטח", p:1200, t:10, s:"רישיון לנשק"}, 
    {n:"חובש", p:4500, t:18, s:"תעודת חובש"}, {n:"מתכנת", p:15000, t:35, s:"תכנות JS"}, {n:"טייס", p:60000, t:60, s:"קורס טיס"}
];

// משימות
let activeTasks = load('activeTasks', []);
const taskPool = [
    {n: "לעבוד קצת", goal: 3, r: 5000, type: 'work'},
    {n: "להרוויח שקלים", goal: 20000, r: 10000, type: 'earn'},
    {n: "קניית כישור", goal: 1, r: 12000, type: 'skill'},
    {n: "השקעה בבורסה", goal: 5, r: 15000, type: 'invest'}
];

function initTasks() {
    if (activeTasks.length === 0) {
        activeTasks.push({...taskPool[0], id: Math.random(), cur: 0});
        activeTasks.push({...taskPool[1], id: Math.random(), cur: 0});
        activeTasks.push({id: 'gold', n: "משימת זהב: רווח ענק", goal: 500000, cur: 0, r: 250000, type: 'earn', isGold: true});
    }
}

// ניהול PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });

function save() {
    const data = { money, bank, passive, level, xp, loan, lastGift, theme, skills, inventory, activeTasks, totalEarned, totalSpent };
    Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    save();
}

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if(btn) btn.classList.add("active");
    const c = document.getElementById("content");
    if(!c) return;
    c.innerHTML = "";
    initTasks();

    if (tab === 'home') {
        const nextGift = 14400000 - (Date.now() - lastGift);
        c.innerHTML = `<div class="card"><h3>📊 סטטוס</h3><p>הכנסות: ${totalEarned.toLocaleString()}₪</p><p>הוצאות: ${totalSpent.toLocaleString()}₪</p><button class="action gift-btn" onclick="claimGift()" ${nextGift>0?'disabled':''}>🎁 ${nextGift>0?'בקרוב':'מתנה'}</button></div>`;
    }
    else if (tab === 'work') {
        c.innerHTML = `<div class="card"><div class="xpbar"><div id="wb"></div></div></div><div class="grid-2"></div>`;
        jobs.forEach(j => {
            const has = !j.s || skills.includes(j.s);
            c.querySelector(".grid-2").innerHTML += `<div class="card" style="opacity:${has?1:0.5}"><b>${j.n}</b><br><button class="action" onclick="startWork(${j.p},${j.t})" ${!has||working?'disabled':''}>${has?j.p+'₪':'צריך '+j.s}</button></div>`;
        });
    }
    else if (tab === 'tasks') {
        activeTasks.forEach(t => {
            c.innerHTML += `<div class="card ${t.isGold?'gold-task':''}"><b>${t.n}</b><br>${Math.floor(t.cur).toLocaleString()}/${t.goal.toLocaleString()}</div>`;
        });
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input type="number" id="bankAmt" placeholder="סכום..."><div class="nav-row"><button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" onclick="bankOp('wit')">משיכה</button></div><button class="action" onclick="bankOp('loan')">הלוואה</button><button class="action" onclick="bankOp('pay')">החזר חוב</button></div>`;
    }
    else if (tab === 'install') {
        c.innerHTML = `<div class="card"><h3>📲 התקנה</h3><p>הוסף למסך הבית למסלול מהיר</p><button class="action" onclick="installApp()">התקן עכשיו</button></div>`;
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

// לוגיקה של פעולות
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

function buyProp(n, c, p) { if(money>=c) { money-=c; totalSpent+=c; passive+=p; if(p===0) inventory.push(n); updateUI(); } }
function learn(n, c) { if(money>=c && !skills.includes(n)) { money-=c; totalSpent+=c; skills.push(n); updateUI(); openTab('skills'); } }
function bankOp(type) {
    const a = parseInt(document.getElementById("bankAmt")?.value) || 0;
    if(type==='dep' && money>=a) { money-=a; bank+=a; }
    else if(type==='wit' && bank>=a) { bank-=a; money+=a; }
    else if(type==='loan') { loan+=5000; money+=5000; }
    else if(type==='pay' && money>=5000) { money-=5000; loan-=5000; }
    updateUI(); openTab('bank');
}

async function installApp() { if(deferredPrompt) { deferredPrompt.prompt(); deferredPrompt = null; } }
function claimGift() { if(Date.now()-lastGift >= 14400000) { money+=5000; lastGift=Date.now(); updateUI(); openTab('home'); } }

setInterval(() => { if(passive>0) { money += (passive/10); updateUI(); } }, 1000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
