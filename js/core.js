/* Smart Money Pro - js/core.js - v6.0.2 - Fixed Passive & Status */

const VERSION = "6.0.2";
const SAVE_KEY = `smartMoneySave_v${VERSION}`;

// משתנים גלובליים
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

let msgTimer; // טיימר להעלמת הודעות

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
        }
    } catch (e) { console.error("Load failed", e); }
}

function saveGame() {
    const data = { money, bank, loan, lifeXP, passive, lastGift, skills, cars, inventory, invOwned, carSpeed };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
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

// תיקון הודעות: נעלמות אחרי 3 שניות בוודאות
function showMsg(txt, color = "white") {
    const bar = document.getElementById('status-bar');
    if (!bar) return;

    clearTimeout(msgTimer); // מבטל טיימר קודם אם יש
    bar.innerText = txt;
    bar.style.color = color;
    bar.style.opacity = (txt === "") ? "0" : "1";

    if (txt !== "") {
        msgTimer = setTimeout(() => {
            bar.style.opacity = "0";
            setTimeout(() => { bar.innerText = ""; }, 300); // מנקה את המלל אחרי שהנראות ירדה
        }, 3000);
    }
}

// --- מנוע הכנסה פסיבית - עדכון כל 100 מילי-שנייה ---
setInterval(() => {
    if (passive > 0) {
        // מחלקים את ההכנסה השעתית ל-36,000 חלקים (כי יש 3600 שניות בשעה ועדכון 10 פעמים בשנייה)
        const incomeTick = passive / 36000;
        money += incomeTick;
        totalEarned += incomeTick;
        
        // עדכון המספר על המסך בלבד לביצועים מהירים
        const mEl = document.getElementById('money');
        if(mEl) mEl.innerText = Math.floor(money).toLocaleString();
    }
}, 100);

setInterval(saveGame, 10000);

document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    updateUI();
});
