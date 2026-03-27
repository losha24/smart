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
    {id:'BTC', n:'Bitcoin', p:65000, change:0}, {id:'GOLD', n:'זהב', p:2300, change:0}
]);
let invOwned = load('invOwned', { AAPL:0, TSLA:0, BTC:0, GOLD:0 });

// מאגרי נתונים
const bzPool = [{n:"דוכן קפה", c:15000, p:120}, {n:"קיוסק", c:35000, p:350}, {n:"מכבסה", c:85000, p:900}, {n:"מספרה", c:120000, p:1400}, {n:"חברת הייטק", c:25000000, p:400000}];
const rePool = [{n:"חניה", c:85000, p:650}, {n:"מחסן", c:160000, p:1300}, {n:"דירת סטודיו", c:680000, p:5800}, {n:"בית פרטי", c:4500000, p:42000}];
const skPool = [{n:"רישיון נהיגה", c:5000}, {n:"רישיון לנשק", c:8000}, {n:"תעודת חובש", c:12000}, {n:"קורס טיס", c:150000}, {n:"תואר בכלכלה", c:80000}, {n:"תכנות JS", c:45000}];
const mkPool = [{n:"אייפון 15", c:4500}, {n:"לפטופ גיימינג", c:12000}, {n:"שעון רולקס", c:45000}, {n:"רכב ספורט", c:450000}];

// רשימת עבודות מורחבת
const jobs = [
    {n:"שליח", p:400, t:4, s:null}, 
    {n:"מאבטח", p:1200, t:10, s:"רישיון לנשק"}, 
    {n:"נהג מונית", p:1800, t:12, s:"רישיון נהיגה"},
    {n:"חובש בכיר", p:4500, t:18, s:"תעודת חובש"},
    {n:"מתכנת", p:15000, t:35, s:"תכנות JS"},
    {n:"מנהל תיק השקעות", p:22000, t:40, s:"תואר בכלכלה"},
    {n:"טייס פרטי", p:55000, t:60, s:"קורס טיס"}
];

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

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if(btn) btn.classList.add("active");

    const c = document.getElementById("content");
    if(!c) return;
    c.innerHTML = "";

    if (tab === 'home') {
        const nextGift = 14400000 - (Date.now() - lastGift);
        c.innerHTML = `<div class="card"><h3>📊 מצב חשבון</h3><p>הכנסות: <span class="pos-text">${totalEarned.toLocaleString()}₪</span></p><p>הוצאות: <span class="neg-text">${totalSpent.toLocaleString()}₪</span></p><p>חוב: <span class="neg-text">${loan.toLocaleString()}₪</span></p><hr><button class="action gift-btn" onclick="claimGift()" ${nextGift>0?'disabled':''}>🎁 ${nextGift>0?'זמין בעוד '+Math.ceil(nextGift/3600000)+' שעות':'קבל מתנה'}</button></div>`;
    }
    else if (tab === 'work') {
        c.innerHTML = `<div class="card"><div class="xpbar"><div id="wb"></div></div></div><div class="grid-2"></div>`;
        jobs.forEach(j => {
            const has = !j.s || skills.includes(j.s);
            c.querySelector(".grid-2").innerHTML += `<div class="card" style="opacity:${has?1:0.5}"><b>${j.n}</b><br><button class="action" onclick="startWork(${j.p},${j.t})" ${!has||working?'disabled':''}>${has?j.p+'₪':'צריך '+j.s}</button></div>`;
        });
    }
    else if (tab === 'invest') {
        stocks.forEach(s => {
            c.innerHTML += `<div class="card"><b>${s.n}</b>: ${s.p.toFixed(2)}$ <div class="nav-row"><button class="action" onclick="buyStock('${s.id}',${s.p})">קנה</button><button class="action" style="background:var(--main)" onclick="sellStock('${s.id}',${s.p})">מכור</button></div></div>`;
        });
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input type="number" id="bankAmt" placeholder="סכום..."><div class="nav-row"><button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" onclick="bankOp('wit')">משיכה</button></div><button class="action" onclick="bankOp('loan')" style="background:var(--main)">הלוואה</button><button class="action" onclick="bankOp('pay')" style="background:var(--green)">החזר חוב</button></div>`;
    }
    else if (tab === 'tasks') {
        if(activeTasks.length === 0) activeTasks = [{id:1, n:"עבודה", goal:5, cur:0, r:10000}, {id:3, n:"משימת זהב", goal:1000000, cur:totalSpent, r:250000, type:'gold'}];
        activeTasks.forEach(t => { c.innerHTML += `<div class="card ${t.type==='gold'?'gold-task':''}"><b>${t.n}</b><br>התקדמות: ${Math.floor(t.cur).toLocaleString()}/${t.goal.toLocaleString()}</div>`; });
    }
    else if (tab === 'business' || tab === 'realestate' || tab === 'market' || tab === 'skills') {
        let list = (tab==='business')?bzPool : (tab==='realestate')?rePool : (tab==='market')?mkPool : skPool;
        c.innerHTML = `<div class="grid-2"></div>`;
        list.forEach(i => {
            const has = tab==='skills' && skills.includes(i.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${i.n}</b><br>${i.c.toLocaleString()}₪<button class="action" onclick="${tab==='skills'?'learn':'buyProp'}('${i.n}',${i.c},${i.p||0})" ${has?'disabled':''}>${has?'נלמד':'קנה'}</button></div>`;
        });
    }
}

// פונקציות פעולה שחייבות להיות קיימות
function buyProp(n, c, p) {
    if(money >= c) {
        money -= c; totalSpent += c; passive += p;
        if(p === 0) inventory.push(n);
        showMsg("נרכש: " + n, "pos"); updateUI();
    } else showMsg("אין מספיק כסף", "neg");
}

function learn(n, c) {
    if(money >= c && !skills.includes(n)) {
        money -= c; totalSpent += c; skills.push(n);
        showMsg("למדת: " + n, "pos"); updateUI(); openTab('skills');
    } else if(skills.includes(n)) { showMsg("כבר למדת את זה", "neg"); 
    } else showMsg("אין מספיק כסף", "neg");
}

function startWork(p, t) {
    if(working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => {
        s += 0.1; if(bar) bar.style.width = (s/t*100) + "%";
        if(s >= t) {
            clearInterval(i); working = false; money += p; totalEarned += p;
            if(activeTasks[0] && activeTasks[0].n === "עבודה") {
                activeTasks[0].cur++;
                if(activeTasks[0].cur >= activeTasks[0].goal) { money += activeTasks[0].r; activeTasks.shift(); showMsg("משימה הושלמה!", "pos"); }
            }
            updateUI(); openTab('work');
        }
    }, 100);
}

function bankOp(type) {
    const a = parseInt(document.getElementById("bankAmt")?.value) || 0;
    if(type==='dep' && money>=a && a>0) { money-=a; bank+=a; showMsg("הופקד", "pos"); }
    else if(type==='wit' && bank>=a && a>0) { bank-=a; money+=a; showMsg("נמשך", "pos"); }
    else if(type==='loan') { loan+=5000; money+=5000; showMsg("הלוואה התקבלה", "neg"); }
    else if(type==='pay' && money>=5000 && loan>=5000) { money-=5000; loan-=5000; showMsg("החזרת חוב", "pos"); }
    updateUI(); openTab('bank');
}

function buyStock(id, p) { if(money >= p*4) { money -= p*4; invOwned[id]++; updateUI(); openTab('invest'); } }
function sellStock(id, p) { if(invOwned[id] > 0) { invOwned[id]--; money += p*4; updateUI(); openTab('invest'); } }
function claimGift() { if(Date.now() - lastGift >= 14400000) { money += 5000; lastGift = Date.now(); showMsg("מתנה התקבלה!", "pos"); updateUI(); openTab('home'); } }

setInterval(() => { if(passive > 0) { money += (passive/10); updateUI(); } }, 1000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
