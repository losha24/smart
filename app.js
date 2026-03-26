// --- נתוני משחק ---
let data = JSON.parse(localStorage.getItem("smartMoney")) || {
    money:100,
    bank:0,
    invested:0,
    lost:0,
    passive:0,
    level:1,
    xp:0,
    xpNeed:100,
    tasksDone:0
};

// --- שמירה ---
function save(){ localStorage.setItem("smartMoney",JSON.stringify(data)); }

// --- הודעה ---
function msg(t){ document.getElementById("message").innerText = t; }

// --- מעבר בין קטגוריות ---
function openTab(tab){
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    document.getElementById("btn"+tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add("active");
    let c = document.getElementById("content");
    c.innerHTML = "";

    switch(tab){
        case "home":
            c.innerHTML = `
            <div class="card">💰 כסף: ${data.money}</div>
            <div class="card">🏦 בבנק: ${data.bank}</div>
            <div class="card">📈 השקעות: ${data.invested}</div>
            <div class="card">❌ הפסדים: ${data.lost}</div>
            <div class="card">⏱ הכנסה פסיבית: ${data.passive}/10s</div>
            <div class="card">⭐ רמה: ${data.level}</div>
            <div class="card">XP: ${data.xp}/${data.xpNeed}
                <div class="progress"><div style="width:${data.xp/data.xpNeed*100}%"></div></div>
            </div>
            `;
            break;

        case "work":
            c.innerHTML = `
            <div class="card">💼 עבודה 1 (5s) → 40</div>
            <button onclick="work(5,40)">עבודה</button>
            <div class="card">💻 עבודה 2 (15s) → 120</div>
            <button onclick="work(15,120)">עבודה</button>
            <div class="card">🌐 עבודה 3 (30s) → 300</div>
            <button onclick="work(30,300)">עבודה</button>
            <div class="card">🏗 עבודה 4 (60s) → 900</div>
            <button onclick="work(60,900)">עבודה</button>
            <div class="progress"><div id="workBar" style="width:0%"></div></div>
            `;
            break;

        case "invest":
            c.innerHTML = `
            <div class="card">קריפטו → 200</div><button onclick="invest(200)">השקעה</button>
            <div class="card">סטארטאפ → 600</div><button onclick="invest(600)">השקעה</button>
            <div class="card">מסחר → 1500</div><button onclick="invest(1500)">השקעה</button>
            <div class="card">נדל״ן → 4000</div><button onclick="invest(4000)">השקעה</button>
            `;
            break;

        case "bank":
            c.innerHTML = `
            <button onclick="deposit()">הפקדה 100</button>
            <button onclick="withdraw()">משיכה 100</button>
            `;
            break;

        case "market":
            c.innerHTML = `
            <div class="card">TECH: משתנה</div>
            <div class="card">AI: משתנה</div>
            <div class="card">ENERGY: משתנה</div>
            `;
            break;

        case "tasks":
            c.innerHTML = `
            <div class="card">🎯 משימות יומיות</div>
            <button onclick="completeTask()">סיים משימה</button>
            `;
            break;
    }
}

// --- עבודה ---
function work(sec,reward){
    let bar = document.getElementById("workBar");
    let p = 0;
    let t = setInterval(()=>{
        p++;
        if(bar) bar.style.width = (p/sec*100)+"%";
        if(p>=sec){
            clearInterval(t);
            data.money += reward;
            data.xp += 20;
            checkLevel();
            save();
            msg("הרווחת "+reward);
        }
    },1000);
}

// --- השקעה ---
function invest(amount){
    if(data.money<amount){ msg("אין מספיק כסף"); return; }
    data.money -= amount;
    data.invested += amount;
    let result = Math.random();
    if(result>0.5){ data.passive += Math.floor(amount*0.05); msg("השקעה הצליחה"); }
    else{ data.lost += amount; msg("השקעה הפסידה"); }
    save();
}

// --- בנק ---
function deposit(){ if(data.money<100){msg("לא מספיק כסף");return;} data.money-=100; data.bank+=100; save(); }
function withdraw(){ if(data.bank<100){msg("אין מספיק כסף בבנק");return;} data.bank-=100; data.money+=100; save(); }

// --- רמות ---
function checkLevel(){
    if(data.xp>=data.xpNeed){
        data.level++;
        data.xp=0;
        data.xpNeed=Math.floor(data.xpNeed*1.5);
        data.money+=200;
        msg("עלית רמה! קיבלת 200");
        save();
    }
}

// --- משימות ---
function completeTask(){
    let rewards=[100,200,300];
    let r = rewards[Math.floor(Math.random()*rewards.length)];
    data.money += r;
    data.tasksDone++;
    msg("סיימת משימה וקיבלת "+r);
    save();
}

// --- הכנסה פסיבית כל 10 שניות ---
setInterval(()=>{
    data.money += data.passive;
    save();
},10000);

// --- איפוס ---
function resetGame(){ localStorage.removeItem("smartMoney"); location.reload(); }

// --- עדכון גרסה ---
function checkUpdate(){
    fetch("version.json").then(r=>r.json()).then(v=>{
        if(v.version!=="2.0"){ location.reload(true); }
        else{ location.reload(); }
    });
}

// --- התקנה ---
function installApp(){
    alert("כדי להתקין:\n1. לחץ על Share\n2. Add to Home Screen\n3. אשר");
}

// --- טעינת דף ראשוני ---
openTab("home");
