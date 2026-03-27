const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };

let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0);
let level = load('level', 1), xp = load('xp', 0), loan = load('loan', 0);
let lastGift = load('lastGift', 0), theme = load('theme', 'dark'), working = false;
let invOwned = load('invOwned', { AAPL:0, TSLA:0, GOOG:0, BTC:0 });
let skills = load('skills', []), inventory = load('inventory', []);
let activeTasks = load('activeTasks', []), completedCount = load('completedCount', 0);

const jobs = [
    {n:"שליח", p:400, t:4, s:null}, 
    {n:"מאבטח", p:1200, t:10, s:"רישיון לנשק"}, 
    {n:"נהג", p:1800, t:12, s:"רישיון נהיגה"},
    {n:"נהג משאית", p:3500, t:18, s:"רישיון נהיגה"},
    {n:"מתכנת", p:15000, t:40, s:"תכנות"},
    {n:"מנהל פרויקטים", p:25000, t:50, s:"ניהול"}
];

const stocks = [
    {id:'AAPL', n:'Apple', price:180}, {id:'TSLA', n:'Tesla', price:240}, 
    {id:'GOOG', n:'Google', price:140}, {id:'BTC', n:'Bitcoin', price:65000}
];

const bzPool = [{n:"דוכן קפה", c:15000, p:120}, {n:"קיוסק", c:35000, p:350}, {n:"מכבסה", c:85000, p:900}];
const rePool = [{n:"חניה", c:85000, p:650}, {n:"מחסן", c:160000, p:1300}, {n:"דירה", c:1900000, p:17000}];
const mkPool = [{n:"אייפון 15", c:4500}, {n:"רישיון לנשק", c:5000}, {n:"רכב", c:80000}];
const skPool = [{n:"רישיון נהיגה", c:5000}, {n:"תכנות", c:65000}, {n:"ניהול", c:38000}];

function showMsg(txt, type) {
    const b = document.getElementById("status-bar");
    b.innerText = txt;
    b.className = (type === "pos" ? "pos show" : "neg show");
    setTimeout(() => { b.className = ""; }, 3000);
}

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

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if(btn) btn.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        const nextGift = 14400000 - (Date.now() - lastGift);
        const allItems = [...skills, ...inventory];
        c.innerHTML = `<div class="card fade-in">
            <h3>📊 נתונים</h3>
            <p>🎭 רמה: ${level} | 📈 פסיבי: ${(passive/10).toFixed(1)}/s</p>
            <hr><h4>🎒 הפריטים שלי:</h4>
            <div class="item-list">${allItems.map(i => `<span>${i}</span>`).join('') || 'אין פריטים'}</div>
            <button class="action" onclick="claimGift()" ${nextGift > 0 ? 'disabled' : ''}>🎁 מתנה</button>
        </div>`;
    }
    else if (tab === 'work') {
        c.innerHTML = `<div class="card"><div class="xpbar"><div id="wb"></div></div></div><div class="grid-2"></div>`;
        jobs.forEach(j => {
            const ok = !j.s || skills.includes(j.s) || inventory.includes(j.s);
            c.querySelector(".grid-2").innerHTML += `<div class="card" style="opacity:${ok?1:0.5}">
                <b>${j.n}</b><br><button class="action" onclick="startWork(${j.p},${j.t})" ${!ok||working?'disabled':''}>${ok?j.p+'₪':'צריך '+j.s}</button>
            </div>`;
        });
    }
    else if (tab === 'invest') {
        stocks.forEach(s => {
            c.innerHTML += `<div class="card"><b>${s.n}</b>: ${s.price}$<br>
            <button class="action" style="width:45%" onclick="buyStock('${s.id}',${s.price})">קנה</button>
            <button class="action" style="width:45%; background:var(--main)" onclick="sellStock('${s.id}',${s.price})">מכור (${invOwned[s.id]||0})</button></div>`;
        });
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><p>יתרה: ${bank.toLocaleString()}₪</p>
            <input type="number" id="bankAmt" placeholder="סכום..." style="width:90%; padding:10px; margin-bottom:10px; border-radius:5px; border:1px solid var(--border);">
            <div class="nav-row"><button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" onclick="bankOp('wit')">משיכה</button></div>
            <hr><button class="action" onclick="bankOp('loan')" style="background:var(--main)">הלוואה 5,000₪</button></div>`;
    }
    else if (tab === 'business' || tab === 'realestate') {
        const list = (tab === 'business') ? bzPool : rePool;
        c.innerHTML = `<div class="grid-2"></div>`;
        list.forEach(p => {
            c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${p.n}</b><br>${p.c.toLocaleString()}₪<br><button class="action" onclick="buyProp('${p.n}',${p.c},${p.p})">קנה</button></div>`;
        });
    }
    else if (tab === 'market') {
        c.innerHTML = `<div class="grid-2"></div>`;
        mkPool.forEach(m => c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${m.n}</b><br>${m.c.toLocaleString()}₪<button class="action" onclick="buyItem('${m.n}',${m.c})">קנה</button></div>`);
    }
    else if (tab === 'skills') {
        c.innerHTML = `<div class="grid-2"></div>`;
        skPool.forEach(s => {
            const has = skills.includes(s.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${s.n}</b><br>${s.c.toLocaleString()}₪<button class="action" onclick="learn('${s.n}',${s.c})" ${has?'disabled':''}>${has?'נלמד':'למד'}</button></div>`;
        });
    }
}

function startWork(p, t) {
    if(working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => {
        s += 0.1; if(bar) bar.style.width = (s/t*100) + "%";
        if(s >= t) { 
            clearInterval(i); working = false; money += p; totalEarned += p; xp += 25;
            if(xp >= 100) { xp = 0; level++; passive += 50; money += 5000; showMsg("עלית רמה! +5000₪", "pos"); }
            updateUI(); openTab('work'); 
        }
    }, 100);
}

function buyStock(id, p) { if(money >= p*4) { money -= p*4; invOwned[id]++; showMsg("המניה נקנתה", "pos"); updateUI(); openTab('invest'); } else showMsg("אין מספיק כסף", "neg"); }
function sellStock(id, p) { if(invOwned[id] > 0) { invOwned[id]--; money += p*4; showMsg("המניה נמכרה", "pos"); updateUI(); openTab('invest'); } }
function bankOp(type) {
    const val = parseInt(document.getElementById("bankAmt")?.value) || 0;
    if(type === 'dep' && money >= val && val > 0) { money -= val; bank += val; showMsg("הופקד בהצלחה", "pos"); }
    else if(type === 'wit' && bank >= val && val > 0) { bank -= val; money += val; showMsg("נמשך בהצלחה", "pos"); }
    else if(type === 'loan') { loan += 5000; money += 5000; showMsg("הלוואה התקבלה", "neg"); }
    else showMsg("פעולה לא חוקית", "neg");
    updateUI(); openTab('bank');
}
function buyProp(n, c, p) { if(money >= c) { money -= c; passive += p; showMsg("תתחדש על הנכס!", "pos"); updateUI(); } else showMsg("חסר כסף", "neg"); }
function buyItem(n, c) { if(money >= c) { money -= c; inventory.push(n); passive += 10; showMsg("נקנה: " + n, "pos"); updateUI(); openTab('market'); } else showMsg("חסר כסף", "neg"); }
function learn(n, c) { if(money >= c && !skills.includes(n)) { money -= c; skills.push(n); showMsg("למדת: " + n, "pos"); updateUI(); openTab('skills'); } }
function claimGift() { const g = 5000+(level*500); if(Date.now()-lastGift>=14400000){ money+=g; lastGift=Date.now(); showMsg("קיבלת "+g+"₪", "pos"); updateUI(); openTab('home'); } }
function toggleTheme() { theme = (theme === 'dark' ? 'light' : 'dark'); updateUI(); }
function resetGame() { if(confirm("לאפס הכל?")) { localStorage.clear(); location.reload(); } }

setInterval(() => { if(passive > 0) { money += (passive/10); updateUI(); } }, 1000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
