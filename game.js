// פונקציות עזר לטעינה ושמירה
const load = (key, def) => {
    const saved = localStorage.getItem(key);
    try {
        return saved ? JSON.parse(saved) : def;
    } catch (e) { return def; }
};

const save = () => {
    const data = { money, bank, passive, totalEarned, totalSpent, level, xp, rep, theme, version: "3.8.9" };
    Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
};

// משתני המשחק
let money = load('money', 2000), 
    bank = load('bank', 0), 
    passive = load('passive', 0);
let totalEarned = load('totalEarned', 2000), 
    totalSpent = load('totalSpent', 0);
let level = load('level', 1), 
    xp = load('xp', 0), 
    rep = load('rep', 0);
let theme = load('theme', 'dark'), 
    working = false;

// עדכון ממשק המשתמש (UI)
function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.getElementById("rep-ui").innerText = rep;
    document.body.className = theme + "-theme";
    save();
}

// הצגת הודעות בשורת הסטטוס מתחת ללוגו
function showMsg(txt, type) {
    const bar = document.getElementById("status-bar");
    const span = document.getElementById("msg-text");
    span.innerText = txt;
    bar.className = type; // משנה צבע (event-positive / event-negative)
    
    setTimeout(() => {
        bar.className = "";
        span.innerText = "Smart Money AI v3.8.9";
    }, 4500);
}

// ניהול טאבים
function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if(btn) btn.classList.add("active");
    
    const content = document.getElementById("content");
    content.innerHTML = ""; // ניקוי תוכן קיים

    if (tab === 'home') {
        content.innerHTML = `
        <div class="card fade-in">
            <h3>📊 סטטיסטיקה אישית</h3>
            <div style="text-align:right; line-height: 1.8;">
                <p>גרסת מערכת: <b>3.8.9</b></p>
                <p>סך הכל הרווחתי: <span style="color:var(--green); font-weight:bold;">${totalEarned.toLocaleString()}₪</span></p>
                <p>סך הכל בזבזתי: <span style="color:var(--main); font-weight:bold;">${totalSpent.toLocaleString()}₪</span></p>
                <p>כסף בבנק: <b>${bank.toLocaleString()}₪</b></p>
                <p>הכנסה פסיבית נוכחית: <b>${(passive * 360).toLocaleString()}₪ / שעה</b></p>
            </div>
        </div>
        <div class="card fade-in">
            <small>ניסיון (Level ${level}): ${xp}%</small>
            <div style="width:100%; height:8px; background:var(--border); border-radius:4px; margin-top:5px;">
                <div style="width:${xp}%; height:100%; background:#f59e0b; border-radius:4px;"></div>
            </div>
        </div>`;
    } 
    else if (tab === 'work') {
        content.innerHTML = `
        <div class="card fade-in">
            <h3>💼 מרכז עבודה</h3>
            <div class="xpbar"><div id="wb"></div></div>
            <button class="action" id="workBtn" onclick="startWork(750, 4)">בצע עבודה (750₪ | 4 שניות)</button>
        </div>`;
    }
    else if (tab === 'business') {
        const businesses = [
            {n:"דוכן מזון", c:12000, p:100, i:"🌭"}, {n:"חנות בגדים", c:35000, p:320, i:"👕"},
            {n:"מוסך אופנועים", c:120000, p:1200, i:"🏍️"}, {n:"חברת הייטק", c:2500000, p:22000, i:"🚀"}
        ];
        content.innerHTML = `<div class="grid-2"></div>`;
        businesses.forEach(b => {
            content.querySelector(".grid-2").innerHTML += `
            <div class="card small-card fade-in">${b.i}<br><b>${b.n}</b><br><small>${b.c}₪</small><br><button class="action" onclick="buyItem('${b.n}',${b.c},${b.p})">קנה</button></div>`;
        });
    }
    else if (tab === 'realestate') {
        const houses = [
            {n:"דירת סטודיו", c:450000, p:3800, i:"🏙️"}, {n:"וילה גדולה", c:3200000, p:28000, i:"🏡"},
            {n:"בניין מגורים", c:12000000, p:110000, i:"🏢"}, {n:"קניון", c:55000000, p:520000, i:"🛍️"}
        ];
        content.innerHTML = `<div class="grid-2"></div>`;
        houses.forEach(h => {
            content.querySelector(".grid-2").innerHTML += `
            <div class="card small-card fade-in">${h.i}<br><b>${h.n}</b><br><small>${h.c}₪</small><br><button class="action" onclick="buyItem('${h.n}',${h.c},${h.p})">רכוש</button></div>`;
        });
    }
    else if (tab === 'market') {
        content.innerHTML = `<div class="card fade-in"><h3>🛒 שוק מוצרים</h3><p>בקרוב יתווספו מוצרים נוספים לרכישה בשוק.</p></div>`;
    }
    else if (tab === 'install') {
        content.innerHTML = `
        <div class="card fade-in" style="text-align: right;">
            <h3>📲 הסבר התקנה (PWA)</h3>
            <p>1. לחץ על כפתור ה<b>שיתוף</b> בתחתית הדפדפן (אייקון ריבוע עם חץ).</p>
            <p>2. גלול למטה ובחר ב-<b>"הוסף למסך הבית"</b>.</p>
            <p>3. אשר את ההוספה והאפליקציה תופיע כקיצור דרך במסך שלך.</p>
        </div>`;
    }
    else if (tab === 'bank') {
        content.innerHTML = `
        <div class="card fade-in">
            <h3>🏦 ניהול חשבון בנק</h3>
            <p>יתרה בבנק: ${bank.toLocaleString()}₪</p>
            <button class="action" onclick="bankOp('dep')">הפקד 1,000₪</button>
            <button class="action" style="background:#475569" onclick="bankOp('wit')">משוך 1,000₪</button>
        </div>`;
    }
}

// לוגיקת עבודה עם פס התקדמות
function startWork(pay, time) {
    if(working) return;
    working = true;
    const btn = document.getElementById("workBtn");
    btn.classList.add("disabled");
    
    let progress = 0;
    const bar = document.getElementById("wb");
    const interval = setInterval(() => {
        progress += 0.1;
        bar.style.width = (progress / time * 100) + "%";
        if (progress >= time) {
            clearInterval(interval);
            working = false;
            money += pay;
            totalEarned += pay;
            xp += 25;
            if(xp >= 100) { xp = 0; level++; showMsg("כל הכבוד! עלית רמה!", "event-positive"); }
            showMsg(`עבדת בהצלחה! קיבלת ${pay}₪`, "event-positive");
            updateUI();
            openTab('work');
        }
    }, 100);
}

// קניית פריטים (נדל"ן / עסקים)
function buyItem(name, cost, passiveIncome) {
    if (money >= cost) {
        money -= cost;
        totalSpent += cost;
        passive += passiveIncome;
        showMsg(`תתחדש! קנית ${name}`, "event-positive");
        updateUI();
        if(document.getElementById("btnHome").classList.contains("active")) openTab('home');
    } else {
        showMsg("אין לך מספיק מזומן!", "event-negative");
    }
}

// פעולות בנק
function bankOp(type) {
    if(type === 'dep' && money >= 1000) { money -= 1000; bank += 1000; showMsg("הפקדת 1,000₪ לבנק", "event-positive"); }
    else if(type === 'wit' && bank >= 1000) { bank -= 1000; money += 1000; showMsg("משכת 1,000₪ מהבנק", "event-positive"); }
    else { showMsg("פעולה נכשלה - חסר כסף", "event-negative"); }
    updateUI();
    openTab('bank');
}

// החלפת נושא (בהיר/כהה)
function toggleTheme() {
    theme = (theme === 'dark' ? 'light' : 'dark');
    updateUI();
}

// מערכת אירועים אקראיים (כל 2.5 דקות בממוצע)
function initRandomEvents() {
    const time = Math.floor(Math.random() * (180000 - 120000)) + 120000;
    setTimeout(() => {
        const events = [
            { m: "מצאת שטר של 200₪ במכנסיים!", v: 200, t: "event-positive" },
            { m: "קנס מהעירייה... שילמת 350₪", v: -350, t: "event-negative" },
            { m: "בונוס חג מהעבודה! 1,200₪+", v: 1200, t: "event-positive" },
            { m: "הלך המטען לטלפון, קנית חדש ב-150₪", v: -150, t: "event-negative" }
        ];
        const e = events[Math.floor(Math.random() * events.length)];
        money += e.v;
        if (e.v > 0) totalEarned += e.v; else totalSpent += Math.abs(e.v);
        if (money < 0) money = 0;
        showMsg(e.m, e.t);
        updateUI();
        initRandomEvents();
    }, time);
}

// לופ הכנסה פסיבית (כל שנייה)
setInterval(() => {
    if(passive > 0) {
        money += (passive / 10); // חלוקה ל-10 כדי שזה יתעדכן לאט ובצורה יפה
        updateUI();
    }
}, 1000);

// אתחול המשחק בטעינה
document.addEventListener("DOMContentLoaded", () => {
    updateUI();
    openTab('home');
    initRandomEvents();
});

function resetGame() {
    if(confirm("אלכסיי, בטוח שאתה רוצה לאפס את כל ההתקדמות?")) {
        localStorage.clear();
        location.reload();
    }
}
