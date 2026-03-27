const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };

// משתני ליבה
let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let level = load('level', 1), xp = load('xp', 0), loan = load('loan', 0);
let lastGift = load('lastGift', 0), theme = load('theme', 'dark'), working = false;
let invOwned = load('invOwned', {}), skills = load('skills', []), inventory = load('inventory', []);
let activeTasks = load('activeTasks', []), completedCount = load('completedCount', 0);

// --- מאגרי נתונים (10 פריטים לכל קטגוריה) ---
const bzPool = [
    {n:"דוכן קפה", c:15000, p:120}, {n:"קיוסק", c:35000, p:350}, {n:"מכבסה", c:85000, p:900},
    {n:"מספרה", c:120000, p:1400}, {n:"חנות בגדים", c:250000, p:3000}, {n:"בר", c:450000, p:5500},
    {n:"מסעדה", c:850000, p:11000}, {n:"אולם אירועים", c:2500000, p:35000}, {n:"מרכז קניות", c:7500000, p:110000}, {n:"חברת הייטק", c:25000000, p:400000}
];

const rePool = [
    {n:"חניה", c:85000, p:650}, {n:"מחסן", c:160000, p:1300}, {n:"משרד קטן", c:350000, p:2900},
    {n:"דירת סטודיו", c:680000, p:5800}, {n:"דירת 3 חדרים", c:1400000, p:12500}, {n:"דירת 5 חדרים", c:2200000, p:21000},
    {n:"בית פרטי", c:4500000, p:42000}, {n:"פנטהאוז", c:8500000, p:85000}, {n:"בניין משרדים", c:18000000, p:200000}, {n:"בית מלון", c:55000000, p:650000}
];

const skPool = [
    {n:"רישיון נהיגה", c:5000}, {n:"רישיון לנשק", c:8000}, {n:"עזרה ראשונה", c:3500},
    {n:"אנגלית עסקית", c:12000}, {n:"תעודת טכנאי", c:15000}, {n:"ניהול צוות", c:25000},
    {n:"תכנות JS", c:45000}, {n:"ניתוח נתונים", c:60000}, {n:"שיווק דיגיטלי", c:30000}, {n:"ניהול בכיר", c:100000}
];

const mkPool = [
    {n:"אייפון 15", c:4500}, {n:"לפטופ גיימינג", c:12000}, {n:"שעון חכם", c:2500},
    {n:"אופניים חשמליים", c:6000}, {n:"מכונת קפה", c:3500}, {n:"מצלמה מקצועית", c:15000},
    {n:"טלוויזיה 85 אינץ'", c:18000}, {n:"טאבלט", c:5000}, {n:"קורקינט", c:4000}, {n:"אוזניות פרימיום", c:2200}
];

const jobs = [
    {n:"שליח", p:400, t:4, s:null}, 
    {n:"מאבטח", p:1200, t:10, s:"רישיון לנשק"}, 
    {n:"נהג טקסי", p:1800, t:12, s:"רישיון נהיגה"},
    {n:"חובש", p:2500, t:15, s:"עזרה ראשונה"},
    {n:"טכנאי שטח", p:4000, t:20, s:"תעודת טכנאי"},
    {n:"מנהל משמרת", p:6500, t:25, s:"ניהול צוות"},
    {n:"מתכנת ג'וניור", p:12000, t:35, s:"תכנות JS"},
    {n:"מרקטינג", p:15000, t:40, s:"שיווק דיגיטלי"},
    {n:"מנהל פרויקט", p:28000, t:50, s:"ניהול בכיר"},
    {n:"מנכ\"ל", p:65000, t:80, s:"ניהול בכיר"}
];

// --- מערכת משימות ---
function checkTasks() {
    if(activeTasks.length === 0) {
        activeTasks = [
            {id: 1, n: "תעבוד 3 פעמים", goal: 3, cur: 0, reward: 5000},
            {id: 2, n: "הכנסה פסיבית גבוהה", goal: 1000, cur: Math.floor(passive), reward: 15000}
        ];
    }
}

// --- פונקציות ליבה ---
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
    save();
}

function save() {
    const data = { money, bank, passive, level, xp, loan, lastGift, theme, invOwned, skills, inventory, activeTasks, completedCount };
    Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
}

// --- ניהול טאבים ---
function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1))?.classList.add("active");
    const c = document.getElementById("content"); c.innerHTML = "";

    if (tab === 'home') {
        const nextGift = 14400000 - (Date.now() - lastGift);
        const allItems = [...skills, ...inventory];
        c.innerHTML = `<div class="card fade-in"><h3>📊 סטטוס</h3><p>רמה: ${level} | פסיבי: ${(passive/10).toFixed(1)}/s</p><div class="item-list">${allItems.map(i=>`<span>${i}</span>`).join('') || 'אין פריטים'}</div><button class="action" onclick="claimGift()" ${nextGift>0?'disabled':''}>🎁 מתנה</button></div>`;
    }
    else if (tab === 'work') {
        c.innerHTML = `<div class="card"><div class="xpbar"><div id="wb"></div></div></div><div class="grid-2"></div>`;
        jobs.forEach(j => {
            const has = !j.s || skills.includes(j.s);
            c.querySelector(".grid-2").innerHTML += `<div class="card" style="opacity:${has?1:0.5}"><b>${j.n}</b><br><button class="action" onclick="startWork(${j.p},${j.t})" ${!has||working?'disabled':''}>${has?j.p+'₪':'חסר '+j.s}</button></div>`;
        });
    }
    else if (tab === 'tasks') {
        checkTasks();
        c.innerHTML = `<h3>🎯 משימות</h3>`;
        activeTasks.forEach(t => {
            c.innerHTML += `<div class="card"><b>${t.n}</b><br>התקדמות: ${t.cur}/${t.goal}<br><small>פרס: ${t.reward.toLocaleString()}₪</small></div>`;
        });
    }
    else if (tab === 'bank') {
        c.innerHTML = `<div class="card"><h3>🏦 בנק</h3><input type="number" id="bankAmt" placeholder="סכום..." style="width:90%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid var(--border);"><div class="nav-row"><button class="action" onclick="bankOp('dep')">הפקדה</button><button class="action" onclick="bankOp('wit')">משיכה</button></div><hr><button class="action" onclick="bankOp('loan')" style="background:var(--main)">הלוואה 5,000₪</button></div>`;
    }
    else if (tab === 'business' || tab === 'realestate' || tab === 'market' || tab === 'skills') {
        let list = (tab==='business')?bzPool : (tab==='realestate')?rePool : (tab==='market')?mkPool : skPool;
        c.innerHTML = `<div class="grid-2"></div>`;
        list.forEach(i => {
            const isSkill = tab === 'skills';
            const has = isSkill && skills.includes(i.n);
            c.querySelector(".grid-2").innerHTML += `<div class="card"><b>${i.n}</b><br>${i.c.toLocaleString()}₪<button class="action" onclick="${isSkill?'learn':'buyProp'}('${i.n}',${i.c},${i.p||0})" ${has?'disabled':''}>${has?'נלמד':'קנה'}</button></div>`;
        });
    }
    else if (tab === 'install') {
        c.innerHTML = `<div class="card fade-in"><h3>📲 התקנה</h3><p>לחץ על הכפתור למטה כדי להתקין את האפליקציה על מסך הבית שלך.</p><button class="action" onclick="installApp()">התקן עכשיו</button></div>`;
    }
}

// --- לוגיקת פעולות ---
function startWork(p, t) {
    if(working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => {
        s += 0.1; if(bar) bar.style.width = (s/t*100) + "%";
        if(s >= t) {
            clearInterval(i); working = false; money += p; xp += 20;
            if(activeTasks[0] && activeTasks[0].id === 1) { 
                activeTasks[0].cur++; 
                if(activeTasks[0].cur >= activeTasks[0].goal) { money += activeTasks[0].reward; activeTasks.shift(); showMsg("משימה הושלמה!", "pos"); } 
            }
            if(xp >= 100) { xp=0; level++; money += 5000; showMsg("עלית רמה!", "pos"); }
            updateUI(); openTab('work');
        }
    }, 100);
}

function buyProp(n, c, p) { if(money >= c) { money -= c; passive += p; if(p===0) inventory.push(n); showMsg("נרכש!", "pos"); updateUI(); } else showMsg("חסר כסף", "neg"); }
function learn(n, c) { if(money >= c && !skills.includes(n)) { money -= c; skills.push(n); showMsg("למדת כישור!", "pos"); updateUI(); openTab('skills'); } }
function bankOp(type) {
    const a = parseInt(document.getElementById("bankAmt")?.value) || 0;
    if(type==='dep' && money>=a && a>0) { money-=a; bank+=a; showMsg("הופקד", "pos"); }
    else if(type==='wit' && bank>=a && a>0) { bank-=a; money+=a; showMsg("נמשך", "pos"); }
    else if(type==='loan') { loan+=5000; money+=5000; showMsg("הלוואה התקבלה", "neg"); }
    updateUI(); openTab('bank');
}

// --- התקנת PWA ---
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); deferredPrompt = e;
});

async function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') deferredPrompt = null;
    } else {
        showMsg("השתמש בתפריט הדפדפן להתקנה", "neg");
    }
}

setInterval(() => { if(passive>0) { money += (passive/10); updateUI(); } }, 1000);
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
