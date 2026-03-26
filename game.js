const VERSION = "3.1.2";

// אתחול נתונים
if (localStorage.appVersion !== VERSION) {
    localStorage.clear();
    localStorage.appVersion = VERSION;
}

let money = Number(localStorage.money) || 100;
let bank = Number(localStorage.bank) || 0;
let xp = Number(localStorage.xp) || 0;
let level = Number(localStorage.level) || 1;
let passive = Number(localStorage.passive) || 0;
let myItems = JSON.parse(localStorage.myItems || "[]");
let currentTask = JSON.parse(localStorage.currentTask || "null");
let working = false;

// רשימות
const works = [
    { name: "שטיפת כלים", pay: 50, time: 5, xp: 15 },
    { name: "אבטחה", pay: 150, time: 10, xp: 30 },
    { name: "פיתוח PWA", pay: 500, time: 25, xp: 70 }
];

const marketItems = [
    { id: 1, name: "נעלי עבודה", price: 300, desc: "+20% שכר", type: 'bonus' },
    { id: 2, name: "קורס השקעות", price: 1000, desc: "+50% XP", type: 'bonus' },
    { id: 3, name: "דירת משרד", price: 10000, desc: "+100 פסיבי", type: 'passive', val: 100 }
];

function save() {
    localStorage.money = money;
    localStorage.bank = bank;
    localStorage.xp = xp;
    localStorage.level = level;
    localStorage.passive = passive;
    localStorage.myItems = JSON.stringify(myItems);
    localStorage.currentTask = JSON.stringify(currentTask);
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("level").innerText = level;
    document.getElementById("passive").innerText = passive;
    document.getElementById("xpfill").style.width = (xp % 100) + "%";
    save();
}

function message(t, type = '') {
    const el = document.getElementById("message");
    el.innerText = t;
    el.className = type;
}

// ניווט - תיקון כפתורים
function openTab(tab) {
    // הסרת מחלקה פעילה מכל הכפתורים
    document.querySelectorAll(".topbar button").forEach(btn => btn.classList.remove("active"));
    
    // הוספת מחלקה לכפתור שנלחץ
    const activeBtn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if (activeBtn) activeBtn.classList.add("active");

    const content = document.getElementById("content");
    
    if (tab === 'home') {
        content.innerHTML = `<div class="card"><h3>מצב חשבון</h3><p>מזומן: ${Math.floor(money)}₪</p><p>בנק: ${bank}₪</p><p>הכנסה פסיבית: ${passive}₪</p></div>`;
    } 
    else if (tab === 'work') {
        let html = `<h3>לוח עבודות</h3><div class="progress" style="width:100%; height:10px; background:#334155; border-radius:5px; margin-bottom:10px;"><div id="workbar" style="width:0%; height:100%; background:#22c55e;"></div></div>`;
        works.forEach((w, i) => {
            html += `<button class="action" onclick="startWork(${i})">${w.name} (${w.pay}₪)</button>`;
        });
        content.innerHTML = html;
    }
    else if (tab === 'invest') {
        content.innerHTML = `<h3>השקעות</h3><button class="action" onclick="doInvest(500)">השקעה במניות (500₪)</button><button class="action" onclick="doInvest(2000)">קריפטו (2000₪)</button>`;
    }
    else if (tab === 'bank') {
        content.innerHTML = `<h3>בנק</h3><input id="bankAmt" type="number" placeholder="סכום" style="width:80%; padding:10px; margin-bottom:10px; border-radius:8px;"><button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" onclick="bankOp('wit')">משיכה</button>`;
    }
    else if (tab === 'market') {
        let html = `<h3>שוק</h3>`;
        marketItems.forEach(item => {
            const owned = myItems.some(it => it.id === item.id);
            html += `<button class="action ${owned ? 'disabled' : ''}" onclick="buyItem(${item.id})">${item.name} (${item.price}₪)<br><small>${item.desc}</small></button>`;
        });
        html += `<div class="inventory"><h4>החפצים שלי:</h4>`;
        myItems.forEach(it => html += `<span class="item-tag">📦 ${it.name} </span>`);
        html += `</div>`;
        content.innerHTML = html;
    }
    else if (tab === 'tasks') {
        if(!currentTask) currentTask = { name: "בצע 3 עבודות", type: 'work', goal: 3, progress: 0, reward: 500 };
        content.innerHTML = `<div class="card"><h3>משימה</h3><p>${currentTask.name}</p><p>התקדמות: ${currentTask.progress}/${currentTask.goal}</p><button class="action" onclick="claimTask()">אסוף פרס</button></div>`;
    }
}

// לוגיקת עבודה
function startWork(i) {
    if (working) return message("כבר עובד...", "loss");
    working = true;
    let w = works[i];
    let t = 0;
    const bar = document.getElementById("workbar");
    let interval = setInterval(() => {
        t++;
        bar.style.width = (t / w.time * 100) + "%";
        if (t >= w.time) {
            clearInterval(interval);
            let pay = w.pay * (myItems.some(it => it.id === 1) ? 1.2 : 1);
            money += pay;
            addXP(w.xp);
            working = false;
            if (currentTask && currentTask.type === 'work') currentTask.progress++;
            updateUI();
            message(`הרווחת ${pay}₪!`, "gain");
            bar.style.width = "0%";
        }
    }, 1000);
}

function addXP(v) {
    xp += v;
    if (xp >= 100) {
        xp -= 100;
        level++;
        money += 500;
        message("עליית רמה! קיבלת 500₪ בונוס", "gain");
    }
    updateUI();
}

function bankOp(type) {
    let amt = Math.floor(Number(document.getElementById("bankAmt").value));
    if (amt <= 0) return;
    if (type === 'dep' && money >= amt) { money -= amt; bank += amt; message("הפקדה הצליחה", "gain"); }
    else if (type === 'wit' && bank >= amt) { bank -= amt; money += amt; message("משיכה הצליחה", "gain"); }
    else { message("אין מספיק כסף", "loss"); }
    updateUI();
}

function buyItem(id) {
    const item = marketItems.find(it => it.id === id);
    if (money >= item.price && !myItems.some(it => it.id === id)) {
        money -= item.price;
        myItems.push(item);
        if (item.type === 'passive') passive += item.val;
        updateUI();
        openTab('market');
        message("תתחדש!", "gain");
    }
}

// אירועים אקראיים
setInterval(() => {
    if (Math.random() < 0.1) {
        let eventMoney = 200;
        money += eventMoney;
        message("🎁 מצאת 200₪ ברחוב!", "event");
        updateUI();
    }
}, 30000);

// הכנסה פסיבית
setInterval(() => {
    money += passive;
    updateUI();
}, 5000);

function resetGame() { if(confirm("לאפס הכל?")) { localStorage.clear(); location.reload(); } }

function checkUpdate() {
    fetch("version.json?t=" + Date.now()).then(r => r.json()).then(v => {
        if (v.version !== VERSION) {
            localStorage.clear();
            alert("מעדכן גרסה...");
            location.reload();
        } else {
            message("האפליקציה מעודכנת", "gain");
        }
    });
}

updateUI();
openTab('home');
