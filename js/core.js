/* Smart Money Pro - js/core.js - v6.0.1 - Engine & Performance Update */

const VERSION = "6.0.1";
const SAVE_KEY = `smartMoneySave_v${VERSION}`;

let money = 1000;
let bank = 0;
let loan = 0;
let lifeXP = 0;
let passive = 0;
let lastGift = 0;
let skills = [];
let cars = [];
let inventory = []; 
let invOwned = { AAPL:0, TSLA:0, NVDA:0, BTC:0, GOOG:0, AMZN:0, MSFT:0, NFLX:0, META:0, ELAL:0 };
let carSpeed = 1;
let totalEarned = 0;
let totalSpent = 0;

function loadGame() {
    try {
        const data = JSON.parse(localStorage.getItem(SAVE_KEY));
        if (data) {
            money = data.money ?? 1000;
            bank = data.bank ?? 0;
            loan = data.loan ?? 0;
            lifeXP = data.lifeXP ?? 0;
            passive = data.passive ?? 0;
            lastGift = data.lastGift ?? 0;
            skills = data.skills ?? [];
            cars = data.cars ?? [];
            inventory = data.inventory ?? [];
            invOwned = data.invOwned ?? invOwned;
            carSpeed = data.carSpeed ?? 1;
            totalEarned = data.totalEarned ?? 0;
            totalSpent = data.totalSpent ?? 0;
        }
    } catch (e) { console.error("Load failed", e); }
}

function saveGame() {
    const data = { money, bank, loan, lifeXP, passive, lastGift, skills, cars, inventory, invOwned, carSpeed, totalEarned, totalSpent };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function resetGame() {
    if (confirm("⚠️ לאפס הכל? כל ההתקדמות תימחק!")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
}

function updateUI() {
    const mEl = document.getElementById('money');
    const bEl = document.getElementById('bank');
    const lEl = document.getElementById('life-level-ui');
    
    if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    if(bEl) bEl.innerText = Math.floor(bank).toLocaleString();
    if(lEl) lEl.innerText = Math.floor(lifeXP / 5000) + 1;
    
    const progress = ((lifeXP % 5000) / 5000) * 100;
    const xpBar = document.querySelector('.xp-bar');
    if(xpBar) xpBar.style.width = progress + "%";
}

function showMsg(txt, color = "white") {
    const bar = document.getElementById('status-bar');
    if (bar) {
        bar.innerText = txt;
        bar.style.color = color;
        bar.style.opacity = (txt === "") ? "0" : "1";
    }
}

function toggleTheme() {
    const body = document.getElementById('app-body');
    if(body) {
        body.classList.toggle('light-theme');
        const isDark = !body.classList.contains('light-theme');
        localStorage.setItem('theme_pref', isDark ? 'dark' : 'light');
    }
}

function forceUpdate() {
    saveGame();
    location.reload(true);
}

// מנוע הכסף הרץ (שנייה)
setInterval(() => {
    if (passive > 0) {
        const incomePerSec = passive / 3600;
        money += incomePerSec;
        totalEarned += incomePerSec;
        
        // עדכון UI קליל רק לכסף
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    }
}, 1000);

// שמירה אוטומטית פעם ב-10 שניות
setInterval(saveGame, 10000);

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem('theme_pref');
    if (savedTheme === 'light') document.getElementById('app-body')?.classList.add('light-theme');
    loadGame();
    updateUI();
});
