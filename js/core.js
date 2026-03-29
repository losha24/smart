/* Smart Money Pro - js/core.js - v6.0.7 - Master Core Engine */

const VERSION = "6.0.7";
const SAVE_KEY = "smartMoneySave_v6_main";

// --- משתנים גלובליים ---
let money = 1200; 
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

let msgTimer; 

// --- ניהול זיכרון ושמירה ---
function loadGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            money = data.money ?? 1200;
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
        }
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.className = savedTheme + '-theme';
    } catch (e) { console.error("Error loading:", e); }
}

function saveGame() {
    const data = { money, bank, loan, lifeXP, passive, lastGift, skills, cars, inventory, invOwned, carSpeed, totalEarned };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

// --- מערכת הודעות צבעונית ---
function showMsg(txt, color = "var(--blue)") {
    const bar = document.getElementById('status-bar');
    if (!bar) return;
    clearTimeout(msgTimer); 
    bar.innerText = txt;
    bar.style.opacity = "1";
    bar.style.transform = "translateY(0)";
    bar.style.color = color;
    bar.style.borderColor = color;
    const bgColor = color.includes("var") ? `rgba(56, 189, 248, 0.15)` : color.replace(')', ', 0.15)');
    bar.style.backgroundColor = color.includes("--green") ? "rgba(34, 197, 94, 0.15)" : 
                               color.includes("--red") ? "rgba(239, 68, 68, 0.15)" : 
                               color.includes("--purple") ? "rgba(168, 85, 247, 0.15)" : bgColor;
    msgTimer = setTimeout(() => {
        bar.style.opacity = "0";
        bar.style.transform = "translateY(-5px)";
    }, 3500);
}

function checkLevelUp() {
    const currentLevel = Math.floor(lifeXP / 5000) + 1;
    const displayedLevel = parseInt(document.getElementById('life-level-ui')?.innerText || "1");
    if (currentLevel > displayedLevel) {
        showMsg(`🎊 מזל טוב! רמה ${currentLevel}! 🎊`, "var(--purple)");
        money += currentLevel * 500;
        updateUI();
    }
}

function updateUI() {
    const mEl = document.getElementById('money');
    const bEl = document.getElementById('bank');
    const lEl = document.getElementById('life-level-ui');
    if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    if(bEl) bEl.innerText = Math.floor(bank).toLocaleString();
    if(lEl) lEl.innerText = Math.floor(lifeXP / 5000) + 1;
    checkLevelUp();
}

// --- מנועי זמן ---

// 1. מנוע הכנסה פסיבית - רץ 10 פעמים בשנייה לעדכון "רץ" של הכסף
setInterval(() => {
    if (passive > 0) {
        const tickIncome = passive / 36000; // חלוקה ל-3600 שניות * 10 פעמים בשנייה
        money += tickIncome;
        totalEarned += tickIncome;
        
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    }
}, 100);

setInterval(saveGame, 15000);

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
});
