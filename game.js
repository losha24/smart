const VERSION = "3.1.3";

// טעינת נתונים
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
let working = false;

const works = [
    { name: "שטיפת כלים", pay: 60, time: 5, xp: 15 },
    { name: "אבטחה", pay: 180, time: 10, xp: 30 },
    { name: "מתכנת PWA", pay: 550, time: 25, xp: 80 }
];

const marketItems = [
    { id: 1, name: "נעלי ריצה", price: 500, desc: "+20% שכר", type: 'bonus' },
    { id: 2, name: "משרד פרטי", price: 5000, desc: "+50 לשעה", type: 'passive', val: 50 }
];

function save() {
    localStorage.money = money;
    localStorage.bank = bank;
    localStorage.xp = xp;
    localStorage.level = level;
    localStorage.passive = passive;
    localStorage.myItems = JSON.stringify(myItems);
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("level").innerText = level;
    document.getElementById("passive").innerText = passive;
    document.getElementById("xpfill").style.width = (xp % 100) + "%";
    save();
}

function message(t, cls = '') {
    const m = document.getElementById("message");
    m.innerText = t;
    m.className = cls;
}

function openTab(tabName) {
    // עדכון עיצוב כפתורים
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById("btn" + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (activeBtn) activeBtn.classList.add("active");

    const container = document.getElementById("content");
    container.innerHTML = ""; // ניקוי

    if (tabName === 'home') {
        container.innerHTML = `<div class="card"><h3>סטטיסטיקה</h3><p>רווח פסיבי: ${passive}₪</p><p>סה"כ בבנק: ${bank}₪</p></div>`;
    } 
    else if (tabName === 'work') {
        let h = `<h3>מרכז תעסוקה</h3><div class="xpbar" style="margin-bottom:15px;"><div id="workbar" style="width:0%; height:100%; background:#22c55e;"></div></div>`;
        works.forEach((w, i) => {
            h += `<button class="action" onclick="startWork(${i})">${w.name} (${w.pay}₪)</button>`;
        });
        container.innerHTML = h;
    }
    else if (tabName === 'bank') {
        container.innerHTML = `<h3>בנק ישראל</h3>
            <input id="bankAmt" type="number" placeholder="סכום" style="padding:12px; width:70%; border-radius:8px; border:none; margin-bottom:10px;">
            <button class="action" onclick="handleBank('dep')">הפקדה</button>
            <button class="action" style="background:#475569" onclick="handleBank('wit')">משיכה</button>`;
    }
    else if (tabName === 'market') {
        let h = `<h3>שוק</h3>`;
        marketItems.forEach(item => {
            const owned = myItems.some(it => it.id === item.id);
            h += `<button class="action ${owned ? 'disabled' : ''}" onclick="buyItem(${item.id})">${item.name} - ${item.price}₪<br><small>${item.desc}</small></button>`;
        });
        container.innerHTML = h;
    }
}

function startWork(i) {
    if (working) return message("עבודה בתהליך...", "loss");
    working = true;
    let w = works[i];
    let step = 0;
    const bar = document.getElementById("workbar");
    let inter = setInterval(() => {
        step++;
        if (bar) bar.style.width = (step / w.time * 100) + "%";
        if (step >= w.time) {
            clearInterval(inter);
            working = false;
            let finalPay = w.pay * (myItems.some(it => it.id === 1) ? 1.2 : 1);
            money += finalPay;
            addXP(w.xp);
            message(`הרווחת ${finalPay}₪!`, "gain");
            if (bar) bar.style.width = "0%";
            updateUI();
        }
    }, 1000);
}

function addXP(v) {
    xp += v;
    if (xp >= 100) {
        xp -= 100;
        level++;
        money += 500;
        message("רמה חדשה! קיבלת 500₪", "event");
    }
    updateUI();
}

function handleBank(type) {
    let a = Math.floor(Number(document.getElementById("bankAmt").value));
    if (a <= 0 || isNaN(a)) return message("הכנס סכום תקין", "loss");
    if (type === 'dep') {
        if (money >= a) { money -= a; bank += a; message("הפקדה בוצעה", "gain"); }
        else message("אין מספיק מזומן", "loss");
    } else {
        if (bank >= a) { bank -= a; money += a; message("משיכה בוצעה", "gain"); }
        else message("אין מספיק בבנק", "loss");
    }
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
        message("תתחדש על הרכישה!", "gain");
    }
}

// לולאות רקע
setInterval(() => { money += passive; updateUI(); }, 5000);
setInterval(() => { if(Math.random() < 0.05) { money += 150; message("🎁 מצאת בונוס של 150₪!", "event"); updateUI(); } }, 40000);

function resetGame() { if(confirm("למחוק הכל?")) { localStorage.clear(); location.reload(); } }

function checkUpdate() {
    fetch("version.json?t=" + Date.now()).then(r => r.json()).then(v => {
        if (v.version !== VERSION) { localStorage.clear(); location.reload(); }
        else message("הגרסה מעודכנת", "gain");
    });
}

// הפעלה ראשונית
document.addEventListener("DOMContentLoaded", () => {
    updateUI();
    openTab('home');
});
