/* Smart Money Pro - js/core.js - v5.7.6 */

const load = (k, d) => { 
    try { 
        const s = localStorage.getItem(k); 
        return s !== null ? JSON.parse(s) : d; 
    } catch(e) { return d; } 
};

// משתנים גלובליים
window.money = load('money', 5000);
window.bank = load('bank', 0);
window.passive = load('passive', 0);
window.loan = load('loan', 0);
window.lastGift = load('lastGift', 0);
window.theme = load('theme', 'dark');
window.skills = load('skills', []);
window.cars = load('cars', []);
window.lifeXP = load('lifeXP', 0);
window.totalEarned = load('totalEarned', 5000);
window.totalSpent = load('totalSpent', 0);
window.carSpeed = load('carSpeed', 1);
window.invOwned = load('invOwned', { AAPL:0, TSLA:0, NVDA:0, BTC:0, GOOG:0, AMZN:0, MSFT:0, NFLX:0, META:0, ELAL:0 });

window.save = function() {
    const data = { 
        money, bank, passive, loan, lastGift, theme, 
        skills, cars, lifeXP, totalEarned, totalSpent, 
        invOwned, carSpeed 
    };
    Object.keys(data).forEach(key => localStorage.setItem(key, JSON.stringify(data[key])));
};

window.updateUI = function() {
    const level = Math.floor(lifeXP / 5000) + 1;
    if(document.getElementById("money")) document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    if(document.getElementById("bank")) document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    if(document.getElementById("life-level-ui")) document.getElementById("life-level-ui").innerText = level;
    document.getElementById("app-body").className = theme + "-theme";
    window.save();
};

window.showMsg = function(t, c = "var(--blue)") {
    const b = document.getElementById("status-bar");
    if(b) { 
        b.innerText = t; 
        b.style.color = c; 
        b.style.opacity = "1"; 
        setTimeout(() => b.style.opacity = "0", 3000); 
    }
};

// פונקציות מערכת לכפתורים
window.resetGame = function() {
    if(confirm("לאפס את כל המשחק?")) {
        localStorage.clear();
        window.location.reload(true);
    }
};

window.forceUpdate = function() {
    window.location.reload(true);
};

window.toggleTheme = function() {
    theme = (theme === 'dark' ? 'light' : 'dark');
    window.updateUI();
};

setInterval(() => { if(passive > 0) { money += (passive / 10); window.updateUI(); } }, 100);
document.addEventListener("DOMContentLoaded", window.updateUI);
