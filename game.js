const VERSION = "3.1.5";

// אתחול נתונים וגרסה
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

// רשימת חפצים מיוחדים בשוק
const marketItems = [
    { id: 1, name: "מחשב גיימינג", price: 800, desc: "מזרז עבודה ב-20%", type: 'speed', boost: 0.8 },
    { id: 2, name: "קורס שיווק", price: 1500, desc: "בונוס 25% לשכר מכל עבודה", type: 'pay', boost: 1.25 },
    { id: 3, name: "דירת Airbnb", price: 8000, desc: "הכנסה פסיבית של 120₪", type: 'passive', val: 120 },
    { id: 4, name: "בוט למסחר", price: 20000, desc: "הכנסה פסיבית של 400₪", type: 'passive', val: 400 },
    { id: 5, name: "כרטיס VIP", price: 5000, desc: "מכפיל XP מכל פעולה", type: 'xp', boost: 2 }
];

// לוגיקת PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.getElementById('installBtn');
    if (btn) btn.style.display = 'block';
});

async function installPWA() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') document.getElementById('installBtn').style.display = 'none';
    deferredPrompt = null;
}

function save() {
    localStorage.money = money;
    localStorage.bank = bank;
    localStorage.xp = xp;
    localStorage.level = level;
    localStorage.passive = passive;
    localStorage.myItems = JSON.stringify(myItems);
    localStorage.appVersion = VERSION;
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
    if (m) { m.innerText = t; m.className = cls; }
}

function openTab(tabName) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById("btn" + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (activeBtn) activeBtn.classList.add("active");

    const container = document.getElementById("content");
    if (!container) return;

    if (tabName === 'home') {
        container.innerHTML = `
            <div class="card">
                <h3>ברוך הבא!</h3>
                <p>רמה נוכחית: ${level}</p>
                <p>הכנסה אוטומטית: <span class="gain">${passive}₪</span></p>
                <hr style="border:0; border-top:1px solid #334155;">
                <p>חפצים בבעלותך: ${myItems.length}</p>
            </div>`;
    } 
    else if (tabName === 'work') {
        let h = `<h3>מרכז עבודה</h3><div class="xpbar" style="margin-bottom:15px;"><div id="workbar" style="width:0%; height:100%; background:#22c55e;"></div></div>`;
        const jobs = [
            { n: "שליח פיצה", p: 50, t: 4, x: 12 },
            { n: "מאבטח", p: 140, t: 10, x: 25 },
            { n: "ראש צוות", p: 600, t: 25, x: 75 }
        ];
        jobs.forEach(j => {
            h += `<button class="action" onclick="doWork('${j.n}', ${j.p}, ${j.t}, ${j.x})">${j.n} (${j.p}₪)</button>`;
        });
        container.innerHTML = h;
    }
    else if (tabName === 'market') {
        let h = `<h3>השוק השחור</h3>`;
        marketItems.forEach(item => {
            const owned = myItems.some(i => i.id === item.id);
            h += `
                <div class="market-item">
                    <strong>${item.name}</strong> - <span class="gain">${item.price}₪</span>
                    <br><small>${item.desc}</small>
                    <button class="action ${owned ? 'disabled' : ''}" style="width:100px; margin:10px 0 0 0; padding:8px;" onclick="buyItem(${item.id})">
                        ${owned ? 'נרכש' : 'קנה'}
                    </button>
                </div>`;
        });
        container.innerHTML = h;
    }
    else if (tabName === 'bank') {
        container.innerHTML = `
            <div class="card">
                <h3>ניהול חשבון</h3>
                <input id="bankAmt" type="number" placeholder="סכום" style="width:70%; padding:10px; margin-bottom:10px;">
                <button class="action" onclick="bankOp('dep')">הפקדה</button>
                <button class="action" style="background:#475569" onclick="bankOp('wit')">משיכה</button>
            </div>`;
    }
}

function doWork(name, pay, time, xpVal) {
    if (working) return message("סבלנות, אתה כבר בעבודה", "loss");
    working = true;
    
    // החלת בונוסים מהשוק
    let finalTime = time;
    if (myItems.some(i => i.id === 1)) finalTime *= 0.8; // מחשב גיימינג מקצר זמן
    
    let step = 0;
    const bar = document.getElementById("workbar");
    message(`מבצע ${name}...`, "event");

    let inter = setInterval(() => {
        step += 0.1;
        if (bar) bar.style.width = (step / finalTime * 100) + "%";
        if (step >= finalTime) {
            clearInterval(inter);
            working = false;
            
            let finalPay = pay;
            if (myItems.some(i => i.id === 2)) finalPay *= 1.25; // קורס שיווק מעלה שכר
            
            let finalXP = xpVal;
            if (myItems.some(i => i.id === 5)) finalXP *= 2; // VIP מכפיל XP
            
            money += finalPay;
            addXP(finalXP);
            message(`הרווחת ${Math.floor(finalPay)}₪!`, "gain");
            if (bar) bar.style.width = "0%";
            updateUI();
        }
    }, 100);
}

function buyItem(id) {
    if (myItems.some(i => i.id === id)) return;
    const item = marketItems.find(i => i.id === id);
    if (money >= item.price) {
        money -= item.price;
        myItems.push(item);
        if (item.type === 'passive') passive += item.val;
        message(`תתחדש על ${item.name}!`, "gain");
        updateUI();
        openTab('market');
    } else {
        message("חסר לך כסף!", "loss");
    }
}

function addXP(v) {
    xp += v;
    if (xp >= 100) {
        xp -= 100;
        level++;
        money += 1000;
        message(`רמה ${level}! קיבלת 1000₪ בונוס`, "event");
    }
    updateUI();
}

function bankOp(type) {
    const a = Math.floor(Number(document.getElementById("bankAmt").value));
    if (!a || a <= 0) return;
    if (type === 'dep' && money >= a) { money -= a; bank += a; message("הפקדה עברה", "gain"); }
    else if (type === 'wit' && bank >= a) { bank -= a; money += a; message("משיכה עברה", "gain"); }
    else message("פעולה נכשלה", "loss");
    updateUI();
}

function checkUpdate() {
    message("בודק גרסה...", "event");
    fetch("version.json?t=" + Date.now()).then(r => r.json()).then(v => {
        if (v.version !== VERSION) {
            localStorage.clear();
            location.reload(true);
        } else {
            message("אין עדכון. מרענן נתונים...", "gain");
            setTimeout(() => location.reload(true), 1000);
        }
    }).catch(() => location.reload(true));
}

function resetGame() { if(confirm("לאפס הכל?")) { localStorage.clear(); location.reload(true); } }

document.addEventListener("DOMContentLoaded", () => {
    updateUI();
    openTab('home');
});

// הכנסה פסיבית קבועה
setInterval(() => {
    if (passive > 0) { money += (passive / 12); updateUI(); }
}, 5000);
