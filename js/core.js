const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };

let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let loan = load('loan', 0), lastGift = load('lastGift', 0), theme = load('theme', 'dark');
let skills = load('skills', []), inventory = load('inventory', []);
let totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0);
let invOwned = load('invOwned', { AAPL:0, TSLA:0, NVDA:0, BTC:0 });

const stocks = [{id:'AAPL', n:'Apple', p:180}, {id:'TSLA', n:'Tesla', p:240}, {id:'NVDA', n:'Nvidia', p:120}, {id:'BTC', n:'Bitcoin', p:65000}];

function save() {
    const data = { money, bank, passive, loan, lastGift, theme, skills, inventory, totalEarned, totalSpent, invOwned, activeTasks };
    Object.keys(data).forEach(k => localStorage.setItem(k, JSON.stringify(data[k])));
}

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    document.getElementById("passive-ui").innerText = (passive/10).toFixed(1);
    document.getElementById("app-body").className = theme + "-theme";
    save();
}

function toggleTheme() { theme = (theme === 'dark' ? 'light' : 'dark'); updateUI(); }
function resetGame() { if(confirm("לאפס הכל?")) { localStorage.clear(); location.reload(); } }

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(reg => {
        reg.onupdatefound = () => { location.reload(); }; // רענון אוטומטי כשנמצא עדכון
    });
}

setInterval(() => { if(passive > 0) { money += (passive/10); updateUI(); } }, 1000);
