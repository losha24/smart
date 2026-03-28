/* Smart Money Pro - js/core.js - v5.7.1 */

const load = (k, d) => { 
    try { 
        const s = localStorage.getItem(k); 
        return s ? JSON.parse(s) : d; 
    } catch(e) { return d; } 
};

// משתנים גלובליים
let money = load('money', 5000);
let bank = load('bank', 0);
let passive = load('passive', 0);
let loan = load('loan', 0);
let lastGift = load('lastGift', 0);
let theme = load('theme', 'dark');
let skills = load('skills', []);
let inventory = load('inventory', []);
let cars = load('cars', []);
let totalEarned = load('totalEarned', 5000);
let totalSpent = load('totalSpent', 0);
let carSpeed = load('carSpeed', 1);
let invOwned = load('invOwned', { AAPL:0, TSLA:0, NVDA:0, BTC:0 });

function save() {
    const data = { money, bank, passive, loan, lastGift, theme, skills, inventory, totalEarned, totalSpent, invOwned, cars, carSpeed };
    Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
}

function showMsg(txt, color = "var(--blue)") {
    const sb = document.getElementById("status-bar");
    if(!sb) return;
    sb.innerText = txt; 
    sb.style.color = color;
    sb.style.opacity = "1";
    setTimeout(() => { sb.style.opacity = "0"; }, 3000);
}

function updateUI() {
    // עדכון אלמנטים קבועים בסרגל העליון
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = passive.toFixed(1);
    document.getElementById("app-body").className = theme + "-theme";

    // עדכון סטטיסטיקה בטאב הבית אם הוא פתוח
    const statsDiv = document.getElementById("live-stats");
    if(statsDiv) {
        statsDiv.innerHTML = `
            <div class="grid-2">
                <p>💰 הכנסות: <br><b>${Math.floor(totalEarned).toLocaleString()}₪</b></p>
                <p>💸 הוצאות: <br><b>${Math.floor(totalSpent).toLocaleString()}₪</b></p>
                <p>📈 פסיבי: <br><b>${passive.toFixed(2)}₪/ש</b></p>
                <p>🏦 חוב: <br><b style="color:var(--red)">${loan.toLocaleString()}₪</b></p>
            </div>
        `;
    }
    save();
}

// כפתורי מערכת
function forceUpdate() { location.reload(true); }
function toggleTheme() { theme = (theme === 'dark' ? 'light' : 'dark'); updateUI(); }

// פונקציית איפוס מתוקנת
function resetGame() {
    const confirmReset = confirm("אלכסיי, האם אתה בטוח שברצונך למחוק את כל ההתקדמות ולאפס את המשחק מהתחלה?");
    if (confirmReset) {
        localStorage.clear();
        // איפוס משתנים בזיכרון
        money = 5000; bank = 0; passive = 0; loan = 0; lastGift = 0;
        skills = []; inventory = []; cars = [];
        totalEarned = 5000; totalSpent = 0; carSpeed = 1;
        invOwned = { AAPL:0, TSLA:0, NVDA:0, BTC:0 };
        
        showMsg("המשחק אופס בהצלחה!", "var(--green)");
        setTimeout(() => { location.reload(); }, 1000);
    }
}

// רווח פסיבי כל 0.1 שניות
setInterval(() => { 
    if(passive > 0) { 
        money += (passive / 10); 
        updateUI(); 
    } 
}, 100);
