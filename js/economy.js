/* Smart Money Pro - js/economy.js - v6.8.9 - Full Sync */

// --- הגדרות פנימיות למנוע ---
let lastUpdate = Date.now();
let taxRate = 0.1; 

// --- מאגר מניות (Stock Market Data) ---
const stockMarket = [
    { id: 'AAPL', name: 'Apple', price: 150, vol: 0.02, history: [] },
    { id: 'TSLA', name: 'Tesla', price: 700, vol: 0.05, history: [] },
    { id: 'NVDA', name: 'Nvidia', price: 400, vol: 0.04, history: [] },
    { id: 'BTC',  name: 'Bitcoin', price: 60000, vol: 0.08, history: [] },
    { id: 'ELAL', name: 'אל-על', price: 15, vol: 0.01, history: [] },
    { id: 'AMZN', name: 'Amazon', price: 180, vol: 0.03, history: [] },
    { id: 'META', name: 'Meta', price: 480, vol: 0.04, history: [] }
];

// --- 1. מנוע רמות ו-XP (נוסחת ה-1.28 המקורית) ---
function getLevelData(xp) {
    let level = 1;
    let xpForNext = 1000;
    let totalThreshold = 0;
    while (xp >= totalThreshold + xpForNext) {
        totalThreshold += xpForNext;
        level++;
        xpForNext = Math.floor(xpForNext * 1.28); 
    }
    // חישוב מס הכנסה לפי רמה
    taxRate = Math.max(0.05, 0.15 - (level * 0.01));
    
    return {
        level,
        xpInCurrentLevel: xp - totalThreshold,
        xpForNext,
        progressPercent: Math.min(100, ((xp - totalThreshold) / xpForNext) * 100),
        taxRate: (taxRate * 100).toFixed(0)
    };
}

// --- 2. מנוע בורסה (Market Simulator) ---
function simulateMarket() {
    stockMarket.forEach(s => {
        const change = (Math.random() * (s.vol * 2)) - s.vol;
        s.price *= (1 + change);
        if (s.price < 1) s.price = 1;
        
        s.history.push(s.price);
        if (s.history.length > 20) s.history.shift();
    });
    
    // רענון ויזואלי של טאב הבורסה אם הוא פתוח
    if (typeof currentTab !== 'undefined' && currentTab === 'market') {
        const content = document.getElementById('content');
        if (content && typeof drawMarket === 'function') drawMarket(content);
    }
}
setInterval(simulateMarket, 10000); // עדכון כל 10 שניות

// --- 3. מנוע הזמן (The Game Tick) ---
function gameTick() {
    const now = Date.now();
    const dt = (now - lastUpdate) / 1000; // זמן בשניות מאז העדכון האחרון
    lastUpdate = now;

    // א) הכנסה פסיבית נטו (אחרי מס)
    if (typeof passive !== 'undefined' && passive > 0) {
        const netPerSec = (passive / 3600) * (1 - taxRate);
        money += netPerSec * dt;
    }

    // ב) ריבית הלוואה (6% לשעה)
    if (typeof loan !== 'undefined' && loan > 0) {
        loan += (loan * 0.06 / 3600) * dt;
    }

    // ג) ריבית בנק (2% לשעה)
    if (typeof bank !== 'undefined' && bank > 0) {
        bank += (bank * 0.02 / 3600) * dt;
    }

    // ד) רעב ואנרגיה (יורד/עולה לאט)
    if (typeof hunger !== 'undefined' && hunger < 100) hunger += (0.1 / 60) * dt;
    if (typeof energy !== 'undefined' && energy < 100 && hunger < 80) energy += (0.5 / 60) * dt;

    updateUI();
}
setInterval(gameTick, 1000);

// --- 4. פונקציות מסחר (Trading) ---
function buyStock(id) {
    const s = stockMarket.find(x => x.id === id);
    if (money >= s.price) {
        money -= s.price;
        invOwned[id] = (invOwned[id] || 0) + 1;
        showMsg(`קנית מניית ${s.name}`, "var(--green)");
        saveGame();
    } else {
        showMsg("אין לך מספיק כסף!", "var(--red)");
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

// --- 5. בנק והלוואות (Bank Services) ---
function deposit(amount) {
    if (amount === 'all') amount = money;
    if (money >= amount && amount > 0) {
        money -= amount;
        bank += amount;
        showMsg(`הפקדת ${Math.floor(amount).toLocaleString()}₪`);
        saveGame();
    }
}

function withdraw(amount) {
    if (amount === 'all') amount = bank;
    if (bank >= amount && amount > 0) {
        bank -= amount;
        money += amount;
        showMsg(`משכת ${Math.floor(amount).toLocaleString()}₪`);
        saveGame();
    }
}

function takeLoan(amt) {
    if (loan > 500000) return showMsg("הבנק לא מאשר הלוואה נוספת!", "var(--red)");
    loan += amt;
    money += amt;
    showMsg(`קיבלת הלוואה של ${amt.toLocaleString()}₪`, "var(--yellow)");
    saveGame();
}

function payLoan(amt) {
    if (amt === 'all') amt = loan;
    const toPay = Math.min(amt, money, loan);
    if (toPay > 0) {
        money -= toPay;
        loan -= toPay;
        showMsg(`שילמת ${Math.floor(toPay).toLocaleString()}₪ מהחוב`);
        saveGame();
    }
}

// --- 6. מתנה יומית (Daily Gift) ---
function claimDailyGift() {
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000;
    if (now - lastGift >= cooldown) {
        const prize = 2500 + (lifeXP / 5);
        money += prize;
        lastGift = now;
        showMsg(`🎁 מתנה יומית: ${Math.floor(prize).toLocaleString()}₪`, "var(--purple)");
        saveGame();
    } else {
        const left = cooldown - (now - lastGift);
        const h = Math.floor(left / 3600000);
        showMsg(`תחזור בעוד ${h} שעות למתנה נוספת`, "var(--yellow)");
    }
}

// --- 7. אירועים אקראיים (Random Events) ---
setInterval(() => {
    if (Math.random() < 0.02) { 
        const events = [
            { n: "קיבלת דיבידנד!", v: 1500, c: "var(--green)" },
            { n: "דו''ח חניה", v: -250, c: "var(--red)" },
            { n: "בונוס רבעוני", v: 3000, c: "var(--blue)" }
        ];
        const e = events[Math.floor(Math.random() * events.length)];
        money = Math.max(0, money + e.v);
        showMsg(e.n, e.c);
        saveGame();
    }
}, 60000);

// אתחול המנוע
console.log("Economy Engine v6.8.9 Ready.");
