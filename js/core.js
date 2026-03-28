/* Smart Money Pro - js/core.js - v5.7.2 */
const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };

let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let loan = load('loan', 0), lastGift = load('lastGift', 0), theme = load('theme', 'dark');
let skills = load('skills', []), inventory = load('inventory', []), cars = load('cars', []);
let totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0), carSpeed = load('carSpeed', 1);
let invOwned = load('invOwned', { AAPL:0, TSLA:0, NVDA:0, BTC:0 });

function save() {
    const data = { money, bank, passive, loan, lastGift, theme, skills, inventory, totalEarned, totalSpent, invOwned, cars, carSpeed };
    Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
}

function showMsg(txt, color = "var(--blue)") {
    const sb = document.getElementById("status-bar");
    if(!sb) return;
    sb.innerText = txt; sb.style.color = color; sb.style.opacity = "1";
    setTimeout(() => { sb.style.opacity = "0"; }, 3000);
}

function updateUI() {
    if(document.getElementById("money")) document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    if(document.getElementById("bank")) document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    if(document.getElementById("passive-ui")) document.getElementById("passive-ui").innerText = passive.toFixed(1);
    document.getElementById("app-body").className = theme + "-theme";

    const statsDiv = document.getElementById("live-stats");
    if(statsDiv) {
        statsDiv.innerHTML = `
            <div class="grid-2">
                <p>💰 הכנסות: <br><b>${Math.floor(totalEarned).toLocaleString()}₪</b></p>
                <p>💸 הוצאות: <br><b>${Math.floor(totalSpent).toLocaleString()}₪</b></p>
                <p>📈 פסיבי: <br><b>${passive.toFixed(2)}₪/ש</b></p>
                <p>🏦 חוב: <br><b style="color:var(--red)">${loan.toLocaleString()}₪</b></p>
            </div>`;
    }
    save();
}

function resetGame() {
    if (confirm("האם לאפס את המשחק מהתחלה?")) {
        localStorage.clear();
        location.reload();
    }
}

function forceUpdate() { location.reload(true); }
function toggleTheme() { theme = (theme === 'dark' ? 'light' : 'dark'); updateUI(); }

setInterval(() => { if(passive > 0) { money += (passive/10); updateUI(); } }, 100);
