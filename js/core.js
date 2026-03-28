const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };

let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let loan = load('loan', 0), lastGift = load('lastGift', 0), theme = load('theme', 'dark');
let skills = load('skills', []), inventory = load('inventory', []), cars = load('cars', []);
let totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0);
let invOwned = load('invOwned', { AAPL:0, TSLA:0, NVDA:0, BTC:0 });
let carSpeed = load('carSpeed', 1);

const stocks = [{id:'AAPL', n:'Apple', p:650}, {id:'TSLA', n:'Tesla', p:820}, {id:'NVDA', n:'Nvidia', p:450}, {id:'BTC', n:'Bitcoin', p:240000}];

function save() {
    const data = { money, bank, passive, loan, lastGift, theme, skills, inventory, totalEarned, totalSpent, invOwned, cars, carSpeed };
    Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
}

function showMsg(txt, color = "var(--blue)") {
    const sb = document.getElementById("status-bar");
    if(!sb) return;
    sb.innerText = txt; sb.style.color = color;
    setTimeout(() => { sb.innerText = "מערכת תקינה"; sb.style.color = "gray"; }, 3000);
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive).toFixed(1);
    document.getElementById("app-body").className = theme + "-theme";
    save();
}

function forceUpdate() {
    showMsg("מרענן גרסה ומנקה זיכרון...");
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
            for(let r of regs) r.unregister();
            caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))));
            setTimeout(() => location.reload(true), 1000);
        });
    } else { location.reload(true); }
}

function toggleTheme() { theme = (theme === 'dark' ? 'light' : 'dark'); updateUI(); }
function resetGame() { if(confirm("לאפס את כל המשחק?")) { localStorage.clear(); location.reload(); } }

setInterval(() => { if(passive > 0) { money += (passive/10); updateUI(); } }, 100);
