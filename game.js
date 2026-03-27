const load = (k, d) => JSON.parse(localStorage.getItem(k)) || d;
let money = load('money', 1000), bank = load('bank', 0), passive = load('passive', 0);
let totalEarned = load('totalEarned', 1000), totalSpent = load('totalSpent', 0);
let level = load('level', 1), xp = load('xp', 0), loan = load('loan', 0);
let theme = load('theme', 'dark'), working = false;

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.body.className = theme + "-theme";
    saveAll();
}

function saveAll() {
    const d = { money, bank, passive, totalEarned, totalSpent, level, xp, loan, theme };
    Object.keys(d).forEach(k => localStorage.setItem(k, JSON.stringify(d[k])));
}

function showMsg(txt, type) {
    const b = document.getElementById("status-bar"), s = document.getElementById("msg-text");
    s.innerText = txt; b.className = "active-msg " + type;
    setTimeout(() => { b.className = ""; s.innerText = ""; }, 3500);
}

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        c.innerHTML = `<div class="card"><h3>📊 סטטיסטיקה v3.9.0</h3><p>רמה: ${level}</p><p>רווחים: ${totalEarned.toLocaleString()}₪</p><p>בזבוזים: ${totalSpent.toLocaleString()}₪</p><p>חוב לבנק: ${loan.toLocaleString()}₪</p></div>`;
    } 
    else if (tab === 'work') {
        const jobs = [
            {n:"שליח", p:150, t:3, r:1, i:"🛵"}, {n:"מאבטח", p:450, t:6, r:2, i:"🛡️"},
            {n:"טכנאי", p:900, t:10, r:4, i:"🔧"}, {n:"מנהל", p:2200, t:15, r:7, i:"👔"},
            {n:"מתכנת", p:5000, t:20, r:10, i:"💻"}, {n:"מנכ\"ל", p:12000, t:30, r:15, i:"🏢"}
        ];
        c.innerHTML = `<div class="card"><div class="xpbar"><div id="wb"></div></div></div><div class="grid-2"></div>`;
        jobs.forEach(j => {
            const locked = level < j.r;
            c.querySelector(".grid-2").innerHTML += `
            <div class="card" style="${locked?'opacity:0.5':''}">
                <b>${j.i} ${j.n}</b><br><small>${locked ? 'רמה '+j.r : j.p+'₪'}</small>
                <button class="action" onclick="startWork(${j.p},${j.t})" ${locked||working?'disabled':''}>עבוד</button>
            </div>`;
        });
    }
    else if (tab === 'business') {
        const bz = [
            {n:"קיוסק", c:15000, p:150, i:"🏪"}, {n:"מכבסה", c:35000, p:400, i:"🧺"},
            {n:"פיצריה", c:120000, p:1400, i:"🍕"}, {n:"חדר כושר", c:450000, p:5200, i:"💪"},
            {n:"מלון בוטיק", c:1500000, p:18000, i:"🏨"}, {n:"חברת תעופה", c:25000000, p:320000, i:"✈️"}
        ];
        c.innerHTML = `<div class="grid-2"></div>`;
        bz.forEach(b => {
            c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${b.i} ${b.n}</b><br><small>${b.c}₪</small><button class="action" onclick="buy('${b.n}',${b.c},${b.p})">קנה</button></div>`;
        });
    }
    else if (tab === 'bank') {
        c.innerHTML = `
        <div class="card">
            <h3>🏦 בנק & הלוואות</h3>
            <p>חוב נוכחי: <span style="color:red">${loan.toLocaleString()}₪</span></p>
            <button class="action" onclick="takeLoan()">קח הלוואה (10,000₪)</button>
            <button class="action" style="background:var(--green)" onclick="payLoan()">החזר הלוואה (5,000₪)</button>
            <hr style="opacity:0.1; margin:15px 0;">
            <button class="action" style="background:#475569" onclick="bankOp('dep')">הפקד 5,000₪</button>
            <button class="action" style="background:#475569" onclick="bankOp('wit')">משוך 5,000₪</button>
        </div>`;
    }
}

function startWork(p, t) {
    working = true; openTab('work');
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => {
        s += 0.1; bar.style.width = (s/t*100) + "%";
        if(s >= t) {
            clearInterval(i); working = false; money += p; totalEarned += p; xp += 15;
            if(xp>=100){ xp=0; level++; showMsg("עלית רמה!", "event-positive"); }
            showMsg(`הרווחת ${p}₪!`, "event-positive"); updateUI(); openTab('work');
        }
    }, 100);
}

function buy(n, c, p) {
    if(money >= c) { money -= c; totalSpent += c; passive += p; showMsg(`קנית ${n}!`, "event-positive"); updateUI(); openTab('business'); }
    else { showMsg("אין לך מספיק כסף!", "event-negative"); }
}

function takeLoan() {
    if(loan < 50000) { loan += 10000; money += 10000; showMsg("לקחת הלוואה של 10,000₪", "event-positive"); updateUI(); openTab('bank'); }
    else { showMsg("הגעת לתקרת ההלוואות!", "event-negative"); }
}

function payLoan() {
    if(money >= 5000 && loan > 0) { money -= 5000; loan -= 5000; totalSpent += 5000; showMsg("החזרת 5,000₪ מהחוב", "event-positive"); updateUI(); openTab('bank'); }
    else { showMsg("אין מספיק כסף או חוב!", "event-negative"); }
}

function bankOp(t) {
    if(t==='dep' && money>=5000){ money-=5000; bank+=5000; showMsg("הפקדת 5,000₪", "event-positive"); }
    else if(t==='wit' && bank>=5000){ bank-=5000; money+=5000; showMsg("משכת 5,000₪", "event-positive"); }
    else { showMsg("פעולה נכשלה!", "event-negative"); }
    updateUI(); openTab('bank');
}

function toggleTheme() { theme = (theme==='dark'?'light':'dark'); updateUI(); openTab('home'); }
function checkUpdate() { location.reload(true); }
function resetGame() { if(confirm("לאפס הכל?")) { localStorage.clear(); location.reload(); } }

setInterval(() => { if(passive > 0) { money += (passive/10); updateUI(); } }, 1000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
