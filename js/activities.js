const skPool = [{n:"רישיון נהיגה", c:5000}, {n:"רישיון לנשק", c:8000}, {n:"תכנות JS", c:45000}];
const jobs = [{n:"שליח", p:400, t:4, s:null}, {n:"מאבטח", p:1200, t:10, s:"רישיון לנשק"}, {n:"מתכנת", p:15000, t:35, s:"תכנות JS"}];

let working = false;
let activeTasks = load('activeTasks', []);
const taskPool = [{n: "עבודה 3 פעמים", goal: 3, r: 5000, type: 'work'}, {n: "הפקדה לבנק", goal: 10000, r: 4000, type: 'bank'}, {n: "קניית מוצר", goal: 1, r: 10000, type: 'buy'}];

function initTasks() {
    if (activeTasks.length === 0) {
        activeTasks = [{...taskPool[0], id: 1, cur: 0}, {...taskPool[1], id: 2, cur: 0}, {id: 'gold', n: "משימת זהב: 100K", goal: 100000, cur: 0, r: 50000, type: 'earn', isGold: true}];
    }
}

function triggerTask(type, amt) {
    activeTasks.forEach((t, i) => {
        if(t.type === type) t.cur += amt;
        if(t.cur >= t.goal) {
            money += t.r; alert(`הושלם! +${t.r}₪`);
            if(t.isGold) activeTasks.splice(i, 1);
            else activeTasks[i] = {...taskPool[Math.floor(Math.random()*taskPool.length)], id:Math.random(), cur:0};
        }
    });
}

function drawWork(c) {
    c.innerHTML = `<div class="card"><div class="xpbar"><div id="wb"></div></div></div><div class="grid-2"></div>`;
    jobs.forEach(j => {
        const has = !j.s || skills.includes(j.s);
        c.querySelector(".grid-2").innerHTML += `<div class="card" style="opacity:${has?1:0.5}"><b>${j.n}</b><button class="action" onclick="startWork(${j.p},${j.t})" ${!has||working?'disabled':''}>${has?j.p+'₪':'חסר '+j.s}</button></div>`;
    });
}

function startWork(p, t) {
    if(working) return; working = true;
    let s = 0; const bar = document.getElementById("wb");
    let i = setInterval(() => {
        s += 0.1; if(bar) bar.style.width = (s/t*100) + "%";
        if(s >= t) {
            clearInterval(i); working = false; money += p; totalEarned += p;
            triggerTask('work', 1); triggerTask('earn', p); updateUI(); openTab('work');
        }
    }, 100);
}

function drawTasks(c) {
    c.innerHTML = `<h3>🎯 משימות</h3>`;
    activeTasks.forEach(t => {
        c.innerHTML += `<div class="card ${t.isGold?'gold-task':''}"><b>${t.n}</b><br>${Math.floor(t.cur).toLocaleString()} / ${t.goal.toLocaleString()}</div>`;
    });
}
