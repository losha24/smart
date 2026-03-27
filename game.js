const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };

// משתני ליבה
let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let level = load('level', 1), xp = load('xp', 0), loan = load('loan', 0);
let lastGift = load('lastGift', 0), theme = load('theme', 'dark'), working = false;
let skills = load('skills', []), inventory = load('inventory', []);
let totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0);

// --- מערכת משימות חדשה ---
let activeTasks = load('activeTasks', []);
const taskPool = [
    {n: "לעבוד קצת", goal: 3, r: 5000, type: 'work'},
    {n: "משמרת כפולה", goal: 8, r: 15000, type: 'work'},
    {n: "להרוויח שקלים", goal: 20000, r: 10000, type: 'earn'},
    {n: "צבירת הון", goal: 100000, r: 40000, type: 'earn'},
    {n: "קניית כישור", goal: 1, r: 12000, type: 'skill'},
    {n: "השקעה בבורסה", goal: 10, r: 25000, type: 'invest'},
    {n: "הפקדה לבנק", goal: 5000, r: 2000, type: 'bank'}
];

function initTasks() {
    if (activeTasks.length === 0) {
        // 2 משימות רגילות מהפול
        activeTasks.push(generateRandomTask());
        activeTasks.push(generateRandomTask());
        // משימת זהב (מתאפסת כל 4 שעות ב-openTab)
        activeTasks.push({id: 'gold', n: "משימת זהב: רווח ענק", goal: 500000, cur: 0, r: 250000, type: 'earn', isGold: true});
    }
}

function generateRandomTask() {
    const t = taskPool[Math.floor(Math.random() * taskPool.length)];
    return { ...t, id: Math.random(), cur: 0 };
}

// --- ניהול התקנה (PWA) ---
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

// --- פונקציות עזר ---
function save() {
    const data = { money, bank, passive, level, xp, loan, lastGift, theme, skills, inventory, activeTasks, totalEarned, totalSpent };
    Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    save();
}

function showMsg(txt, type) {
    const b = document.getElementById("status-bar");
    if(!b) return;
    b.innerText = txt; b.className = (type === "pos" ? "pos show" : "neg show");
    setTimeout(() => b.className = "", 3000);
}

// --- ניהול טאבים ---
function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if(btn) btn.classList.add("active");

    const c = document.getElementById("content");
    if(!c) return;
    c.innerHTML = "";
    initTasks();

    if (tab === 'tasks') {
        c.innerHTML = `<h3>🎯 משימות פעילות</h3>`;
        activeTasks.forEach((t, index) => {
            const isGold = t.isGold;
            c.innerHTML += `
                <div class="card ${isGold ? 'gold-task' : ''}">
                    <b>${isGold ? '👑 ' : ''}${t.n}</b><br>
                    התקדמות: ${Math.floor(t.cur).toLocaleString()} / ${t.goal.toLocaleString()}<br>
                    <div class="xpbar"><div style="width:${(t.cur/t.goal)*100}%; background:var(--green); height:100%;"></div></div>
                    <small>פרס: ${t.r.toLocaleString()} ₪</small>
                </div>`;
        });
    }
    else if (tab === 'install') {
        c.innerHTML = `
            <div class="card fade-in">
                <h3>📲 הוראות התקנה</h3>
                <p>כדי להשתמש באפליקציה במסך מלא:</p>
                <ol style="text-align:right; padding-right:20px;">
                    <li>לחץ על כפתור ה-<b>"התקן"</b> למטה.</li>
                    <li>אם לא קופץ חלון: לחץ על <b>שלוש הנקודות</b> בדפדפן (או כפתור השיתוף ב-iPhone).</li>
                    <li>בחר ב-<b>"הוספה למסך הבית"</b>.</li>
                </ol>
                <button class="action" onclick="installApp()" style="background:var(--blue)">התקן עכשיו</button>
            </div>`;
    }
    // ... (שאר הטאבים: home, work, business וכו' נשארים אותו דבר)
}

async function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
    } else {
        showMsg("השתמש בתפריט הדפדפן (הוסף למסך הבית)", "neg");
    }
}

function startWork(p, t) {
    if(working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => {
        s += 0.1; if(bar) bar.style.width = (s/t*100) + "%";
        if(s >= t) {
            clearInterval(i); working = false; 
            money += p; totalEarned += p;
            // עדכון משימות עבודה
            activeTasks.forEach(task => {
                if(task.type === 'work') task.cur++;
                if(task.type === 'earn') task.cur += p;
            });
            checkTasksStatus();
            updateUI(); openTab('work');
        }
    }, 100);
}

function checkTasksStatus() {
    activeTasks.forEach((t, i) => {
        if (t.cur >= t.goal) {
            money += t.r;
            showMsg("משימה הושלמה! +" + t.r, "pos");
            if (t.isGold) {
                // משימת זהב לא מתחלפת מיד, היא פשוט נגמרת
                activeTasks.splice(i, 1); 
            } else {
                // משימה רגילה מתחלפת באחת חדשה מיד
                activeTasks[i] = generateRandomTask();
            }
        }
    });
}

// ... (המשך פונקציות bankOp, buyProp, learn מהגרסה הקודמת)

document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
