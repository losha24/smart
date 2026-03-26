// נתוני משחק
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

// שמירה
function save(){ localStorage.setItem("smartMoney",JSON.stringify(data)); }

// הודעה
function msg(t){ document.getElementById("message").innerText = t; }

// מעבר בין קטגוריות
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

        case "work": renderWork(); break;
        case "invest": renderInvest(); break;
        case "bank": renderBank(); break;
        case "market": renderMarket(); break;
        case "tasks": renderTasks(); break;
    }
}

// --- טעינת דף ראשוני ---
openTab("home");
