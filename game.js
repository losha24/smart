const VERSION = "3.2.3";

let money = Number(localStorage.money) || 100;
let bank = Number(localStorage.bank) || 0;
let xp = Number(localStorage.xp) || 0;
let level = Number(localStorage.level) || 1;
let stocks = Number(localStorage.stocks) || 0;
let passive = Number(localStorage.passive) || 0;
let totalWorkDone = Number(localStorage.totalWorkDone) || 0;
let myProperties = JSON.parse(localStorage.myProperties || "[]");
let activeTasks = JSON.parse(localStorage.activeTasks || "[]");
let working = false;

// רשימת עבודות מגוונת
const worksList = [
    { n: "אבטחה", p: 150, t: 5, x: 20 },
    { n: "משלוחים", p: 250, t: 8, x: 30 },
    { n: "תמיכה טכנית", p: 400, t: 12, x: 50 },
    { n: "תכנות PWA", p: 800, t: 20, x: 100 },
    { n: "ניהול רשת", p: 1500, t: 40, x: 250 }
];

// מערכת נדל"ן
const propertiesList = [
    { id: 1, n: "דירת סטודיו", cost: 50000, p: 200 },
    { id: 2, n: "דירת 4 חדרים", cost: 150000, p: 800 },
    { id: 3, n: "וילה יוקרתית", cost: 500000, p: 3000 },
    { id: 4, n: "בניין משרדים", cost: 2000000, p: 15000 }
];

const allTasks = [
    { id: 1, desc: "בצע 5 עבודות", goal: 5, type: "work", reward: 500, xp: 50 },
    { id: 2, desc: "צבור 2,000₪ מזומן", goal: 2000, type: "cash", reward: 300, xp: 40 },
    { id: 3, desc: "הפקד 1,000₪ לבנק", goal: 1000, type: "bank", reward: 400, xp: 60 }
];

function save() {
    localStorage.money = money;
    localStorage.bank = bank;
    localStorage.xp = xp;
    localStorage.level = level;
    localStorage.passive = passive;
    localStorage.totalWorkDone = totalWorkDone;
    localStorage.myProperties = JSON.stringify(myProperties);
    localStorage.activeTasks = JSON.stringify(activeTasks);
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

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const b = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (b) b.classList.add("active");

    const c = document.getElementById("content");
    c.innerHTML = "";

    if (tab === 'home') {
        c.innerHTML = `<div class="card"><h3>🏠 בית</h3><p>הכנסה פסיבית נוכחית: <b class="gain">${passive}₪</b></p><p>עבודות שבוצעו: ${totalWorkDone}</p></div>`;
    }
    else if (tab === 'work') {
        let h = `<h3>💼 עבודות זמינות</h3><div class="xpbar"><div id="wb" style="width:0%; height:100%; background:#22c55e;"></div></div>`;
        worksList.forEach(w => {
            h += `<button class="action" onclick="runWork('${w.n}', ${w.p}, ${w.t}, ${w.x})">${w.n} (${w.p}₪)</button>`;
        });
        c.innerHTML = h;
    }
    else if (tab === 'tasks') {
        if (activeTasks.length === 0) activeTasks = allTasks.slice(0, 3);
        let h = `<h3>🎯 משימות (דיווח רק בסיום)</h3>`;
        activeTasks.forEach((t, i) => {
            let progress = 0;
            if (t.type === "work") progress = totalWorkDone;
            if (t.type === "cash") progress = money;
            
            const isReady = progress >= t.goal;
            h += `<div class="card" style="opacity: ${isReady ? 1 : 0.7}">
                    <p><b>${t.desc}</b></p>
                    <p><small>סטטוס: ${Math.floor(progress)}/${t.goal}</small></p>
                    <button class="action" style="background:${isReady ? '#22c55e' : '#475569'}" 
                    onclick="${isReady ? `finishTask(${i})` : `message('המשימה טרם הושלמה','loss')`}">
                        ${isReady ? 'קבל פרס' : 'בביצוע...'}
                    </button>
                  </div>`;
        });
        c.innerHTML = h;
    }
    else if (tab === 'realestate') {
        let h = `<h3>🏘️ שוק הנדל"ן</h3>`;
        propertiesList.forEach(p => {
            h += `<div class="card"><b>${p.n}</b><br>מחיר: ${p.cost}₪ | שכירות: ${p.p}₪<br>
                  <button class="action" onclick="buyProperty(${p.id})">קנה נכס</button></div>`;
        });
        c.innerHTML = h;
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input id="bAmt" type="number" placeholder="סכום..."><button class="action" onclick="doBank('dep')">הפקדה</button><button class="action" style="background:#475569" onclick="doBank('wit')">משיכה</button></div>`;
    }
}

function runWork(name, pay, time, xpGain) {
    if (working) return;
    working = true;
    let s = 0;
    const bar = document.getElementById("wb");
    let inter = setInterval(() => {
        s++; bar.style.width = (s / time * 100) + "%";
        if (s >= time) {
            clearInterval(inter);
            working = false;
            totalWorkDone++;
            // הגדלת הכנסה פסיבית ככל שעובדים יותר (בונוס קטן על כל עבודה)
            passive += 1; 
            money += pay;
            addXP(xpGain);
            bar.style.width = "0%";
            message(`עבדת כ${name} והרווחת ${pay}₪. ההכנסה הפסיבית גדלה!`, "gain");
            updateUI();
        }
    }, 1000);
}

function buyProperty(id) {
    const p = propertiesList.find(x => x.id === id);
    if (money < p.cost) return message("אין לך מספיק כסף לנכס זה", "loss");
    money -= p.cost;
    myProperties.push(p);
    passive += p.p;
    message(`תתחדש! קנית ${p.n}`, "gain");
    updateUI();
}

function addXP(v) {
    xp += v;
    if (xp >= 100) {
        xp -= 100; level++;
        let prize = Math.floor(Math.random() * 2001) + 500;
        money += prize;
        message(`רמה ${level}! קיבלת מתנה: ${prize}₪`, "event");
    }
    updateUI();
}

function finishTask(i) {
    const t = activeTasks[i];
    money += t.reward;
    addXP(t.xp);
    message(`משימה הושלמה! +${t.reward}₪`, "gain");
    // החלפה במשימה חדשה
    activeTasks[i] = allTasks[Math.floor(Math.random() * allTasks.length)];
    updateUI();
    openTab('tasks');
}

function doBank(type) {
    let a = Math.floor(Number(document.getElementById("bAmt").value));
    if (a <= 0) return;
    if (type === 'dep') {
        if (money < a) return message("אין מספיק כסף!", "loss");
        money -= a; bank += a;
    } else {
        if (bank < a) return message("אין מספיק בבנק!", "loss");
        bank -= a; money += a;
    }
    updateUI();
}

function resetGame() {
    if(confirm("לאפס הכל?")) { localStorage.clear(); location.reload(); }
}

function checkUpdate() {
    message("מעדכן גרסה...", "event");
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
    setTimeout(() => location.reload(true), 1000);
}

// הכנסה פסיבית כל 10 שניות
setInterval(() => {
    if (passive > 0) { money += passive; updateUI(); }
}, 10000);

document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
