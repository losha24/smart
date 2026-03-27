const load = (k, d) => JSON.parse(localStorage.getItem(k)) || d;
let money = load('money', 2000), bank = load('bank', 0), passive = load('passive', 0);
let totalEarned = load('totalEarned', 2000), totalSpent = load('totalSpent', 0);
let theme = load('theme', 'dark'), working = false;

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.body.className = theme + "-theme";
    localStorage.setItem('money', JSON.stringify(money));
    localStorage.setItem('bank', JSON.stringify(bank));
    localStorage.setItem('totalEarned', JSON.stringify(totalEarned));
    localStorage.setItem('totalSpent', JSON.stringify(totalSpent));
}

function showMsg(txt, type) {
    const b = document.getElementById("status-bar"), s = document.getElementById("msg-text");
    s.innerText = txt; b.className = type;
    setTimeout(() => { b.className = ""; s.innerText = "Smart Money AI v3.8.8"; }, 4000);
}

function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        c.innerHTML = `<div class="card"><h3>📊 סטטיסטיקה</h3><p>גרסה: 3.8.8</p><p>רווחים: <span style="color:var(--green)">${totalEarned.toLocaleString()}₪</span></p><p>בזבוזים: <span style="color:var(--main)">${totalSpent.toLocaleString()}₪</span></p></div>`;
    } 
    else if (tab === 'work') {
        c.innerHTML = `<div class="card"><h3>💼 עבודה</h3><div class="xpbar"><div id="wb"></div></div><button class="action" id="wBtn" onclick="startWork(600, 4)">עבוד (600₪ | 4 שנ')</button></div>`;
    }
    else if (tab === 'business') {
        const bz = [
            {n:"דוכן פלאפל", c:15000, p:120, i:"🥙"}, {n:"קיוסק", c:45000, p:400, i:"🏪"},
            {n:"מוסך רכבים", c:180000, p:1600, i:"🔧"}, {n:"אולם אירועים", c:1200000, p:11000, i:"🎭"}
        ];
        c.innerHTML = `<div class="grid-2"></div>`;
        bz.forEach(b => {
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card">${b.i} <b>${b.n}</b><br>${b.c}₪<button class="action" onclick="buyItem('${b.n}',${b.c},${b.p})">קנה</button></div>`;
        });
    }
    else if (tab === 'realestate') {
        const re = [
            {n:"חניה במרכז", c:85000, p:700, i:"🅿️"}, {n:"דירת 3 חדרים", c:650000, p:5500, i:"🏢"},
            {n:"וילה יוקרתית", c:4500000, p:42000, i:"🏡"}, {n:"בניין משרדים", c:15000000, p:155000, i:"🌆"}
        ];
        c.innerHTML = `<div class="grid-2"></div>`;
        re.forEach(r => {
            c.querySelector(".grid-2").innerHTML += `<div class="card small-card">${r.i} <b>${r.n}</b><br>${r.c}₪<button class="action" onclick="buyItem('${r.n}',${r.c},${r.p})">קנה</button></div>`;
        });
    }
    else if (tab === 'install') {
        c.innerHTML = `
        <div class="card">
            <h3>📲 מדריך התקנה לנייד</h3>
            <div class="install-step"><b>1.</b> לחץ על כפתור ה-<b>"שיתוף"</b> (Share) בדפדפן (אייקון של ריבוע עם חץ למעלה).</div>
            <div class="install-step"><b>2.</b> גלול למטה בתפריט שנפתח.</div>
            <div class="install-step"><b>3.</b> בחר באפשרות <b>"הוסף למסך הבית"</b> (Add to Home Screen).</div>
            <div class="install-step"><b>4.</b> לחץ על "הוסף" – וזהו! האפליקציה תופיע על המסך שלך.</div>
        </div>`;
    }
}

function startWork(p, t) {
    if(working) return; working = true;
    document.getElementById("wBtn").disabled = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => {
        s += 0.1; bar.style.width = (s/t*100) + "%";
        if(s >= t) { clearInterval(i); working = false; money += p; totalEarned += p; showMsg(`הרווחת ${p}₪!`, "event-positive"); updateUI(); openTab('work'); }
    }, 100);
}

function buyItem(n, c, p) {
    if(money >= c) { money -= c; totalSpent += c; passive += p; showMsg(`תתחדש על ה-${n}!`, "event-positive"); updateUI(); }
    else { showMsg("חסר לך כסף!", "event-negative"); }
}

function toggleTheme() { theme = (theme==='dark'?'light':'dark'); updateUI(); openTab('home'); }

// אירועים אקראיים כל 2 דקות
setInterval(() => {
    const isGood = Math.random() > 0.4;
    const amt = isGood ? 1500 : -750;
    money += amt; if(money < 0) money = 0;
    showMsg(isGood ? "זכית בהגרלה קטנה!" : "הוצאה בלתי צפויה...", isGood ? "event-positive" : "event-negative");
    updateUI();
}, 120000);

setInterval(() => { if(passive > 0) { money += (passive/10); updateUI(); } }, 1000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
