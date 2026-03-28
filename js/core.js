/* Smart Money Pro - js/core.js - v5.7.6 */

const load = (k, d) => { 
    try { 
        const s = localStorage.getItem(k); 
        return s !== null ? JSON.parse(s) : d; 
    } catch(e) { return d; } 
};

// משתנים
let money = load('money', 5000), bank = load('bank', 0), passive = load('passive', 0);
let loan = load('loan', 0), lastGift = load('lastGift', 0), theme = load('theme', 'dark');
let skills = load('skills', []), cars = load('cars', []), lifeXP = load('lifeXP', 0);
let totalEarned = load('totalEarned', 5000), totalSpent = load('totalSpent', 0), carSpeed = load('carSpeed', 1);
let invOwned = load('invOwned', { AAPL:0, TSLA:0, NVDA:0, BTC:0, GOOG:0, AMZN:0, MSFT:0, NFLX:0, META:0, ELAL:0 });

function save() {
    const data = { money, bank, passive, loan, lastGift, theme, skills, cars, lifeXP, totalEarned, totalSpent, invOwned, carSpeed };
    Object.keys(data).forEach(key => localStorage.setItem(key, JSON.stringify(data[key])));
}

function updateUI() {
    const level = Math.floor(lifeXP / 5000) + 1;
    if(document.getElementById("money")) document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    if(document.getElementById("bank")) document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    if(document.getElementById("life-level-ui")) document.getElementById("life-level-ui").innerText = level;
    document.getElementById("app-body").className = theme + "-theme";
    save();
}

function showMsg(t, c = "var(--blue)") {
    const b = document.getElementById("status-bar");
    if(b) { b.innerText = t; b.style.color = c; b.style.opacity = "1"; setTimeout(() => b.style.opacity = "0", 3000); }
}

// תיקון כפתורי המערכת
window.resetGame = function() {
    if(confirm("לאפס הכל? כל הכסף והרמות יימחקו!")) {
        localStorage.clear();
        window.location.href = window.location.pathname + "?" + Date.now();
    }
};

window.forceUpdate = function() {
    if(confirm("לרענן ולעדכן גרסה?")) {
        window.location.reload(true);
    }
};

window.toggleTheme = function() {
    theme = (theme === 'dark' ? 'light' : 'dark');
    updateUI();
};

setInterval(() => { if(passive > 0) { money += (passive / 10); updateUI(); } }, 100);
document.addEventListener("DOMContentLoaded", updateUI);
