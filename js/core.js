/* Smart Money Pro - js/core.js - v5.7.6 */
const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } };

let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let loan = load('loan', 0), lastGift = load('lastGift', 0), theme = load('theme', 'dark');
let skills = load('skills', []), inventory = load('inventory', []), cars = load('cars', []);
let totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0), carSpeed = load('carSpeed', 1);
let lifeXP = load('lifeXP', 0);
let invOwned = load('invOwned', { AAPL:0, TSLA:0, NVDA:0, BTC:0, GOOG:0, AMZN:0, MSFT:0, NFLX:0, META:0, ELAL:0 });

function save() {
    const d = { money, bank, passive, loan, lastGift, theme, skills, inventory, totalEarned, totalSpent, invOwned, cars, carSpeed, lifeXP };
    Object.keys(d).forEach(k => localStorage.setItem(k, JSON.stringify(d[k])));
}

function updateUI() {
    const level = Math.floor(lifeXP / 5000) + 1;
    if(document.getElementById("money")) document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    if(document.getElementById("bank")) document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    if(document.getElementById("life-level-ui")) document.getElementById("life-level-ui").innerText = level;
    document.getElementById("app-body").className = theme + "-theme";
    save();
}

function triggerRandomEvent() {
    if (Math.random() > 0.15) return;
    const evs = [
        { t: "מצאת שטר של 200₪!", v: 200, c: "var(--green)" },
        { t: "קנס על מהירות: 350₪", v: -350, c: "var(--red)" },
        { t: "בונוס חג: 1,500₪", v: 1500, c: "var(--green)" },
        { t: "תיקון בבית: 600₪", v: -600, c: "var(--red)" }
    ];
    const e = evs[Math.floor(Math.random()*evs.length)];
    money += e.v; if(money < 0) money = 0;
    showMsg(e.t, e.c); updateUI();
}

function showMsg(t, c = "var(--blue)") {
    const b = document.getElementById("status-bar");
    if(b) { b.innerText = t; b.style.color = c; b.style.opacity = "1"; setTimeout(()=> b.style.opacity="0", 4000); }
}

function resetGame() { if(confirm("האם לאפס את המשחק מהתחלה?")) { localStorage.clear(); location.reload(); } }
function forceUpdate() { location.reload(true); }
function toggleTheme() { theme = (theme === 'dark' ? 'light' : 'dark'); updateUI(); }

setInterval(() => { if(passive > 0) { money += (passive/10); updateUI(); } }, 100);
setInterval(triggerRandomEvent, 30000);
