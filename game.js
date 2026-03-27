const VERSION = "3.3";

// משתני ליבה
let money = Number(localStorage.money) || 150;
let bank = Number(localStorage.bank) || 0;
let xp = Number(localStorage.xp) || 0;
let level = Number(localStorage.level) || 1;
let stocks = Number(localStorage.stocks) || 0;
let passive = Number(localStorage.passive) || 0;
let totalWorkDone = Number(localStorage.totalWorkDone) || 0;
let stockPrice = 100;
let lastDaily = localStorage.lastDaily || "";

// נכסים וכישורים
let myProperties = JSON.parse(localStorage.myProperties || "[]");
let myItems = JSON.parse(localStorage.myItems || "[]");
let mySkills = JSON.parse(localStorage.mySkills || "[]");
let activeTasks = JSON.parse(localStorage.activeTasks || "[]");

// מאגרי נתונים (Pools)
const allWorks = [
    { n: "שוטף כלים", p: 100, t: 4, x: 15, req: null },
    { n: "אבטחה", p: 250, t: 6, x: 25, req: "רישיון נשק" },
    { n: "שליח", p: 400, t: 8, x: 40, req: "רישיון נהיגה" },
    { n: "מתכנת PWA", p: 1200, t: 15, x: 100, req: "תואר במדעי המחשב" }
];

const allSkills = [
    { n: "רישיון נשק", cost: 1500, desc: "פותח עבודות אבטחה" },
    { n: "רישיון נהיגה", cost: 3500, desc: "פותח עבודות שליחות" },
    { n: "תואר במדעי המחשב", cost: 10000, desc: "פותח עבודות הייטק" }
];

const itemPool = [
    { n: "שעון חכם", price: 800, p: 10 }, { n: "טאבלט", price: 2200, p: 35 },
    { n: "מחשב נייד", price: 5500, p: 90 }, { n: "אוזניות ביטול רעשים", price: 1100, p: 20 }
];

const propPool = [
    { n: "מחסן קטן", cost: 4000, p: 35 }, { n: "דוכן מיץ", cost: 12000, p: 110 },
    { n: "דירת חדר", cost: 75000, p: 550 }, { n: "בניין משרדים", cost: 1500000, p: 12000 }
];

const taskPool = [
    { desc: "בצע 5 עבודות", goal: 5, type: "work", reward: 400, xp: 50 },
    { desc: "צבור 3,000₪ מזומן", goal: 3000, type: "cash", reward: 600, xp: 70 },
    { desc: "הפקד 1,000₪ בבנק", goal: 1000, type: "bank", reward: 300, xp: 40 }
];

let currentMarket = JSON.parse(localStorage.currentMarket || "[]");
let currentProps = JSON.parse(localStorage.currentProps || "[]");

// פונקציות עזר
function save() {
    localStorage.money = money; localStorage.bank = bank;
    localStorage.xp = xp; localStorage.level = level;
    localStorage.passive = passive; localStorage.totalWorkDone = totalWorkDone;
    localStorage.myProperties = JSON.stringify(myProperties);
    localStorage.myItems = JSON.stringify(myItems);
    localStorage.mySkills = JSON.stringify(mySkills);
    localStorage.activeTasks = JSON.stringify(activeTasks);
    localStorage.currentMarket = JSON.stringify(currentMarket);
    localStorage.currentProps = JSON.stringify(currentProps);
    localStorage.appVersion = VERSION;
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("level").innerText = level;
    document.getElementById("propertyCount").innerText = myProperties.length;
    document.getElementById("xpfill").style.width = (xp % 100) + "%";
    save();
}

function message(t, cls = '') {
    const m = document.getElementById("message");
    m.innerText = t; m.className = cls;
}

// ניהול טאבים
function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (btn) btn.classList.add("active");

    const c = document.getElementById("content");
    c.innerHTML = "";

    if (tab === 'home') {
        const canDaily = lastDaily !== new Date().toLocaleDateString();
        c.innerHTML = `
            <div class="card">
                <h3>🏠 לוח בקרה</h3>
                <p>📈 הכנסה פסיבית: <b class="gain">${passive}₪</b></p>
                <button class="action" style="background:${canDaily?'#fbbf24':'#475569'}" onclick="claimDaily()">${canDaily?'🎁 בונוס יומי':'חזור מחר'}</button>
                <div class="inventory-box">
                    <p>📦 <b>רכוש:</b> ${myItems.map(i=>i.n).join(", ") || "אין"}</p>
                    <p>🏘️ <b>נדל"ן:</b> ${myProperties.map(p=>p.n).join(", ") || "אין"}</p>
                    <p>🎓 <b>כישורים:</b> ${mySkills.join(", ") || "אין"}</p>
                </div>
            </div>`;
    }
    else if (tab === 'work') {
        let h = `<h3>💼 עבודות</h3><div class="xpbar"><div id="wb" style="width:0%; height:100%; background:#22c55e;"></div></div>`;
        allWorks.forEach(w => {
            const locked = w.req && !mySkills.includes(w.req);
            h += `<button class="action ${locked?'disabled':''}" onclick="${locked?`message('דרוש: ${w.req}','loss')`:`runWork('${w.n}', ${w.p}, ${w.t}, ${w.x})`}">
                ${w.n} (${w.p}₪) ${locked?'🔒':''}</button>`;
        });
        c.innerHTML = h;
    }
    else if (tab === 'skills') {
        allSkills.forEach(s => {
            const owned = mySkills.includes(s.n);
            c.innerHTML += `<div class="card"><b>${s.n}</b><br><small>${s.desc}</small><br>
            <button class="action ${owned?'disabled':''}" onclick="buySkill('${s.n}', ${s.cost})">${owned?'נלמד':'למד ב-'+s.cost+'₪'}</button></div>`;
        });
    }
    else if (tab === 'tasks') {
        activeTasks.forEach((t, i) => {
            let prog = (t.type==="work"?totalWorkDone : (t.type==="cash"?money : bank));
            let ready = prog >= t.goal;
            c.innerHTML += `<div class="card"><p>${t.desc} (${Math.floor(prog)}/${t.goal})</p>
            <button class="action" style="background:${ready?'#16a34a':'#475569'}" onclick="finishTask(${i})">${ready?'קבל פרס':'בביצוע'}</button></div>`;
        });
    }
    else if (tab === 'market') {
        currentMarket.forEach((i, idx) => {
            c.innerHTML += `<div class="card"><b>${i.n}</b> - ${i.price}₪<br>
            <button class="action" onclick="buyItem(${idx})">קנה</button></div>`;
        });
    }
    else if (tab === 'realestate') {
        currentProps.forEach((p, idx) => {
            c.innerHTML += `<div class="card"><b>${p.n}</b><br>מחיר: ${p.cost}₪ | שכירות: ${p.p}₪<br>
            <button class="action" onclick="buyProp(${idx})">קנה נכס</button></div>`;
        });
    }
    else if (tab === 'stock') {
        let trend = Math.random() > 0.5 ? 1 : -1;
        stockPrice = Math.max(10, Math.floor(stockPrice + (trend * Math.random() * 30)));
        c.innerHTML = `<div class="card"><h3>💹 בורסה</h3><h1 class="${trend>0?'gain':'loss'}">₪${stockPrice}</h1>
        <p>מניות ברשותך: ${stocks}</p>
        <button class="action" onclick="buyStock()">קנה</button>
        <button class="action" style="background:#475569" onclick="sellStock()">מכור</button></div>`;
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input id="bAmt" type="number" placeholder="סכום..."><br>
        <button class="action" onclick="doBank('dep')">הפקדה</button>
        <button class="action" style="background:#475569" onclick="doBank('wit')">משיכה</button></div>`;
    }
}

// לוגיקת פעולות
let working = false;
function runWork(n, p, t, x) {
    if (working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let inter = setInterval(() => {
        s++; if(bar) bar.style.width = (s/t*100) + "%";
        if (s >= t) {
            clearInterval(inter); working = false;
            money += p; totalWorkDone++; passive += 1;
            addXP(x); if(bar) bar.style.width = "0%";
            message(`עבדת ב${n} והרווחת ${p}₪`, "gain"); updateUI();
        }
    }, 1000);
}

function buySkill(n, c) {
    if (money < c) return message("אין לך מספיק כסף ללימודים!", "loss");
    money -= c; mySkills.push(n);
    message(`למדת ${n}! עבודות חדשות נפתחו.`, "gain"); updateUI(); openTab('skills');
}

function finishTask(i) {
    const t = activeTasks[i];
    let prog = (t.type==="work"?totalWorkDone : (t.type==="cash"?money : bank));
    if (prog < t.goal) return message("המשימה לא הושלמה!", "loss");
    
    money += t.reward; addXP(t.xp);
    activeTasks[i] = taskPool[Math.floor(Math.random()*taskPool.length)];
    message("משימה הושלמה! משימה חדשה הופיעה.", "gain"); updateUI(); openTab('tasks');
}

function buyItem(idx) {
    const i = currentMarket[idx];
    if (money < i.price) return message("אין מספיק כסף!", "loss");
    money -= i.price; myItems.push(i); passive += i.p;
    currentMarket[idx] = itemPool[Math.floor(Math.random()*itemPool.length)];
    message(`קנית ${i.n}!`, "gain"); updateUI(); openTab('market');
}

function buyProp(idx) {
    const p = currentProps[idx];
    if (money < p.cost) return message("אין מספיק כסף!", "loss");
    money -= p.cost; myProperties.push(p); passive += p.p;
    currentProps[idx] = propPool[Math.floor(Math.random()*propPool.length)];
    message(`תתחדש על ${p.n}!`, "gain"); updateUI(); openTab('realestate');
}

function claimDaily() {
    let today = new Date().toLocaleDateString();
    if (lastDaily === today) return;
    let gift = 1000 + (level * 200);
    money += gift; lastDaily = today; localStorage.lastDaily = today;
    message(`קיבלת בונוס יומי: ${gift}₪`, "event"); updateUI(); openTab('home');
}

function buyStock() {
    if (money < stockPrice) return message("אין כסף למניה", "loss");
    money -= stockPrice; stocks++; updateUI(); openTab('stock');
}

function sellStock() {
    if (stocks <= 0) return;
    money += stockPrice; stocks--; updateUI(); openTab('stock');
}

function doBank(type) {
    let a = Math.floor(Number(document.getElementById("bAmt").value));
    if (a <= 0) return;
    if (type === 'dep') {
        if (money < a) return message("אין מספיק מזומן!", "loss");
        money -= a; bank += a;
    } else {
        if (bank < a) return message("אין מספיק בבנק!", "loss");
        bank -= a; money += a;
    }
    updateUI();
}

function addXP(v) {
    xp += v;
    if (xp >= 100) {
        xp -= 100; level++;
        let prize = Math.floor(Math.random()*2000)+500;
        money += prize; message(`עלית לרמה ${level}! מתנה: ${prize}₪`, "event");
    }
    updateUI();
}

// מערכת אירועים ותחזוקה
setInterval(() => { if (passive > 0) { money += passive; updateUI(); } }, 10000);
setInterval(() => {
    if (Math.random() < 0.1 && money > 1000) {
        let bill = 200 + (level * 50); money -= bill;
        message(`הוצאה פתאומית: תיקון/דו"ח (-${bill}₪)`, "loss"); updateUI();
    }
}, 60000);

function resetGame() { if(confirm("לאפס הכל?")) { localStorage.clear(); location.reload(); } }

document.addEventListener("DOMContentLoaded", () => {
    if (currentMarket.length === 0) currentMarket = itemPool.slice(0, 3);
    if (currentProps.length === 0) currentProps = propPool.slice(0, 3);
    if (activeTasks.length === 0) activeTasks = taskPool.slice(0, 3);
    updateUI(); openTab('home');
});
