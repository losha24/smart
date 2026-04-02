/* Smart Money Pro - js/economy.js - v6.8.9 - Full Sync with v6.0.5 */

// --- משתני מערכת גלובליים ---
let money = 1250;
let bank = 0;
let loan = 0;
let lifeXP = 0;
let passive = 0;
let lastGift = 0;
let skills = [];
let cars = [];
let inventory = []; 
let invOwned = {}; 
let carSpeed = 1;
let lastUpdate = Date.now();
let taxRate = 0.1; // מס הכנסה בסיסי

// --- מאגר מניות מורחב (מסונכרן ל-6.0.5) ---
const stockMarket = [
    { id: 'AAPL', name: 'Apple', price: 580, vol: 0.02, history: [] },
    { id: 'TSLA', name: 'Tesla', price: 920, vol: 0.05, history: [] },
    { id: 'NVDA', name: 'Nvidia', price: 420, vol: 0.04, history: [] },
    { id: 'BTC',  name: 'Bitcoin', price: 65000, vol: 0.08, history: [] },
    { id: 'ELAL', name: 'אל-על', price: 12, vol: 0.01, history: [] },
    { id: 'AMZN', name: 'Amazon', price: 180, vol: 0.03, history: [] },
    { id: 'META', name: 'Meta', price: 490, vol: 0.04, history: [] }
];

// --- 1. מנוע רמות ו-XP (נוסחת ה-6.0.5 המקורית) ---
function getLevelData(xp) {
    let level = 1;
    let xpForNext = 1000;
    let totalThreshold = 0;
    while (xp >= totalThreshold + xpForNext) {
        totalThreshold += xpForNext;
        level++;
        xpForNext = Math.floor(xpForNext * 1.28); 
    }
    // ככל שהרמה עולה, המס יורד מעט (הטבת מס לותיקים)
    taxRate = Math.max(0.05, 0.15 - (level * 0.01));
    
    return {
        level,
        xpInCurrentLevel: xp - totalThreshold,
        xpForNext,
        progressPercent: ((xp - totalThreshold) / xpForNext) * 100,
        taxRate: (taxRate * 100).toFixed(0)
    };
}

// --- 2. מנוע בורסה בזמן אמת ---
function simulateMarket() {
    stockMarket.forEach(s => {
        const change = (Math.random() * (s.vol * 2)) - s.vol;
        s.price *= (1 + change);
        if (s.price < 0.5) s.price = 0.5;
        s.trend = change;
        
        // שמירת היסטוריה (לגרפים בעתיד)
        s.history.push(s.price);
        if (s.history.length > 20) s.history.shift();
    });
    
    if (typeof currentTab !== 'undefined' && currentTab === 'market') {
        const content = document.getElementById('content');
        if (content && typeof drawMarket === 'function') drawMarket(content);
    }
}
setInterval(simulateMarket, 5000);

// --- 3. חישוב רווחים והוצאות (The Tick Engine) ---
function gameTick() {
    const now = Date.now();
    const dt = (now - lastUpdate) / 1000; // דלתא בשניות
    lastUpdate = now;

    // א) הכנסה פסיבית נטו (אחרי מס)
    if (passive > 0) {
        const gross = (passive / 3600) * dt;
        const net = gross * (1 - taxRate);
        money += net;
    }

    // ב) ריבית הלוואה (Loan Interest)
    if (loan > 0) {
        const loanInterest = (loan * 0.06 / 3600) * dt; // 6% לשעה חוב
        loan += loanInterest;
    }

    // ג) ריבית בנק (Bank Interest)
    if (bank > 0) {
        const bankInterest = (bank * 0.02 / 3600) * dt; // 2% לשעה רווח
        bank += bankInterest;
    }

    updateUI();
}
setInterval(gameTick, 1000);

// --- 4. פונקציות מסחר (Trading) ---
function buyStock(id) {
    const s = stockMarket.find(x => x.id === id);
    if (money >= s.price) {
        money -= s.price;
        invOwned[id] = (invOwned[id] || 0) + 1;
        showMsg(`רכשת מניית ${s.name}`, "var(--green)");
        saveGame();
    } else {
        showMsg("אין מספיק מזומן!", "var(--red)");
    }
}

function sellStock(id) {
    if (invOwned[id] > 0) {
        const s = stockMarket.find(x => x.id === id);
        money += s.price;
        invOwned[id] -= 1;
        showMsg(`מכרת מניית ${s.name}`, "var(--blue)");
        saveGame();
    }
}

// --- 5. ניהול בנק והלוואות (Bank & Loans) ---
function deposit(amount) {
    if (amount === 'all') amount = money;
    if (money >= amount) {
        money -= amount;
        bank += amount;
        showMsg(`הפקדת ${Math.floor(amount).toLocaleString()}₪`, "var(--blue)");
        saveGame();
    }
}

function withdraw(amount) {
    if (amount === 'all') amount = bank;
    if (bank >= amount) {
        bank -= amount;
        money += amount;
        showMsg(`משכת ${Math.floor(amount).toLocaleString()}₪`, "var(--green)");
        saveGame();
    }
}

function takeLoan(amt = 50000) {
    if (loan > 200000) return showMsg("הבנק לא מאשר הלוואה נוספת!", "var(--red)");
    loan += amt;
    money += amt;
    showMsg(`קיבלת הלוואה של ${amt.toLocaleString()}₪`, "var(--yellow)");
    saveGame();
}

function payLoan(amt) {
    if (amt === 'all') amt = loan;
    const actualPay = Math.min(amt, money, loan);
    if (actualPay > 0) {
        money -= actualPay;
        loan -= actualPay;
        showMsg(`שילמת ${Math.floor(actualPay).toLocaleString()}₪ מהחוב`, "var(--green)");
        saveGame();
    }
}

// --- 6. שמירה וטעינה (Persistence) ---
function saveGame() {
    const state = {
        money, bank, loan, lifeXP, passive, lastGift,
        skills, cars, inventory, invOwned, carSpeed,
        ts: Date.now()
    };
    localStorage.setItem('SMP_Final_Save', JSON.stringify(state));
}

function loadGame() {
    const data = localStorage.getItem('SMP_Final_Save');
    if (data) {
        const obj = JSON.parse(data);
        money = obj.money;
        bank = obj.bank;
        loan = obj.loan;
        lifeXP = obj.lifeXP;
        passive = obj.passive;
        lastGift = obj.lastGift;
        skills = obj.skills || [];
        cars = obj.cars || [];
        inventory = obj.inventory || [];
        invOwned = obj.invOwned || {};
        carSpeed = obj.carSpeed || 1;

        // חישוב רווחים בזמן לא מקוון (Offline)
        const secondsOffline = (Date.now() - obj.ts) / 1000;
        if (secondsOffline > 60) {
            const offGain = (passive / 3600) * secondsOffline * (1 - taxRate);
            if (offGain > 5) {
                money += offGain;
                setTimeout(() => showMsg(`ברוך השב! הרווחת ${Math.floor(offGain).toLocaleString()}₪ בזמן שלא היית`, "var(--yellow)"), 1000);
            }
        }
    }
}

// --- 7. עדכון UI וסנכרון ---
function updateUI() {
    const ld = getLevelData(lifeXP);
    
    // Header Stats
    const mDisplay = document.getElementById('top-money');
    const bDisplay = document.getElementById('top-bank');
    const lDisplay = document.getElementById('life-level-ui');
    
    if (mDisplay) mDisplay.innerText = Math.floor(money).toLocaleString() + " ₪";
    if (bDisplay) bDisplay.innerText = Math.floor(bank).toLocaleString() + " ₪";
    if (lDisplay) lDisplay.innerText = ld.level;

    // קריאה ל-ui.js
    if (typeof renderUIUpdate === 'function') {
        renderUIUpdate(ld);
    }
}

// אירועים אקראיים (שחזור מ-6.0.5)
function triggerRandomEvent() {
    if (Math.random() < 0.03) { // 3% סיכוי
        const events = [
            { n: "בונוס חג!", v: 1500, c: "var(--green)" },
            { n: "תיקון פנצ'ר", v: -300, c: "var(--red)" },
            { n: "מתנה מהמשפחה", v: 1000, c: "var(--yellow)" },
            { n: "קנס מהירות", v: -750, c: "var(--red)" }
        ];
        const ev = events[Math.floor(Math.random() * events.length)];
        money += ev.v;
        if (money < 0) money = 0;
        showMsg(ev.n, ev.c);
        saveGame();
    }
}
setInterval(triggerRandomEvent, 60000);

// אתחול
function initGame() {
    loadGame();
    updateUI();
    console.log("Economy Engine v6.8.9 Fully Synced.");
}

function resetGame() {
    if(confirm("לאפס את כל החשבון?")) {
        localStorage.removeItem('SMP_Final_Save');
        location.reload();
    }
}

document.addEventListener('DOMContentLoaded', initGame);
