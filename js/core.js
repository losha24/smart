const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };

let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let loan = load('loan', 0), lastGift = load('lastGift', 0), theme = load('theme', 'dark');
let skills = load('skills', []), inventory = load('inventory', []), cars = load('cars', []);
let totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0), carSpeed = load('carSpeed', 1);
let invOwned = load('invOwned', { AAPL:0, TSLA:0, NVDA:0, BTC:0 });

function save() {
    const d = { money, bank, passive, loan, lastGift, theme, skills, inventory, totalEarned, totalSpent, invOwned, cars, carSpeed };
    Object.keys(d).forEach(k => localStorage.setItem(k, JSON.stringify(d[k])));
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = passive.toFixed(1);
    document.getElementById("app-body").className = theme + "-theme";
    const s = document.getElementById("live-stats");
    if(s) s.innerHTML = `<div class="grid-2"><p>💰 הכנסות:<br><b>${Math.floor(totalEarned).toLocaleString()}₪</b></p><p>🏦 חוב:<br><b style="color:var(--red)">${loan.toLocaleString()}₪</b></p></div>`;
    save();
}

function resetGame() {
    if (confirm("האם לאפס את המשחק מהתחלה?")) {
        localStorage.clear();
        window.location.replace(window.location.pathname);
    }
}

function showMsg(t, c = "var(--blue)") {
    const b = document.getElementById("status-bar");
    if(b) { b.innerText = t; b.style.color = c; b.style.opacity = "1"; setTimeout(()=> b.style.opacity="0", 3000); }
}

function forceUpdate() { location.reload(true); }
function toggleTheme() { theme = (theme === 'dark' ? 'light' : 'dark'); updateUI(); }
setInterval(() => { if(passive > 0) { money += (passive/10); updateUI(); } }, 100);
