const load = (k, d) => JSON.parse(localStorage.getItem(k)) || d;
const save = () => {
    const data = { money, bank, passive, totalEarned, totalSpent, level, xp, rep, theme, version: "3.8.6" };
    Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
};

let money = load('money', 2000), bank = load('bank', 0), passive = load('passive', 0);
let totalEarned = load('totalEarned', 2000), totalSpent = load('totalSpent', 0);
let level = load('level', 1), xp = load('xp', 0), rep = load('rep', 0);
let theme = load('theme', 'dark'), working = false;

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.getElementById("rep-ui").innerText = rep;
    document.body.className = theme + "-theme";
    save();
}

function showMsg(txt, type) {
    const b = document.getElementById("status-bar"), s = document.getElementById("msg-text");
    s.innerText = txt; b.className = type;
    setTimeout(() => { b.className = ""; s.innerText = "Smart Money AI v3.8.6"; }, 4000);
}

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        c.innerHTML = `
        <div class="card fade-in">
            <h3>📊 סטטיסטיקה אישית</h3>
            <div class="home-stat-row"><span>מספר גרסה:</span> <span class="val">3.8.6</span></div>
            <div class="home-stat-row"><span>רמה נוכחית:</span> <span class="val">${level}</span></div>
            <div class="home-stat-row"><span>סך הכל הרווחתי:</span> <span class="val plus">${totalEarned.toLocaleString()}₪</span></div>
            <div class="home-stat-row"><span>סך הכל בזבזתי:</span> <span class="val minus">${totalSpent.toLocaleString()}₪</span></div>
            <div class="home-stat-row"><span>כסף בבנק:</span> <span class="val">${bank.toLocaleString()}₪</span></div>
            <div class="home-stat-row"><span>הכנסה פסיבית (לשעה):</span> <span class="val">${(passive * 360).toLocaleString()}₪</span></div>
        </div>
        <div class="card">
            <small>ניסיון (XP): ${xp}%</small>
            <div style="width:100%; height:8px; background:#334155; border-radius:4px; margin-top:5px;">
                <div style="width:${xp}%; height:100%; background:#f59e0b; border-radius:4px;"></div>
            </div>
        </div>`;
    } 
    else if (tab === 'work') {
        c.innerHTML = `<div class="card"><h3>💼 עבודה</h3><button class="action" onclick="doWork(500, 20)">עבוד (רווח: 500₪)</button></div>`;
    }
    else if (tab === 'market') {
        c.innerHTML = `<div class="card"><h3>🛒 שוק</h3><button class="action" onclick="buyItem('דירה קטנה', 50000, 150)">קנה דירה (50,000₪ | פסיבי: 15₪)</button></div>`;
    }
}

function doWork(p, x) {
    money += p; totalEarned += p; xp += x;
    if(xp >= 100) { xp = 0; level++; showMsg("עלית רמה!", "event-positive"); }
    showMsg(`הרווחת ${p}₪!`, "event-positive");
    updateUI();
    if(document.getElementById("btnHome").classList.contains("active")) openTab('home');
}

function buyItem(n, c, p) {
    if(money >= c) {
        money -= c; totalSpent += c; passive += p;
        showMsg(`קנית ${n}!`, "event-positive");
        updateUI();
        if(document.getElementById("btnHome").classList.contains("active")) openTab('home');
    } else {
        showMsg("אין לך מספיק כסף!", "event-negative");
    }
}

// אירועים אקראיים
setInterval(() => {
    if(Math.random() > 0.7) {
        const isPos = Math.random() > 0.5;
        const amt = isPos ? 1000 : -500;
        money += amt;
        if(isPos) totalEarned += amt; else totalSpent += Math.abs(amt);
        if(money < 0) money = 0;
        showMsg(isPos ? "מצאת כסף!" : "הפסדת כסף...", isPos ? "event-positive" : "event-negative");
        updateUI();
    }
}, 120000); // כל 2 דקות

setInterval(() => { if(passive > 0) { money += (passive/10); updateUI(); } }, 1000);

document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
