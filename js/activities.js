/* Smart Money Pro - js/activities.js - v6.0.3 - Jobs, Market & Casino */

// --- נתוני העבודות ---
const jobs = [
    { id: 'cleaner', name: 'מנקה רחובות', pay: 40, xp: 10, time: 5, icon: '🧹' },
    { id: 'delivery', name: 'שליח פיצה', pay: 65, xp: 25, time: 8, icon: '🍕' },
    { id: 'security', name: 'מאבטח', pay: 90, xp: 40, time: 12, icon: '🛡️' },
    { id: 'driver', name: 'נהג מונית', pay: 150, xp: 60, time: 15, icon: '🚕', reqCar: true },
    { id: 'coder', name: 'מתכנת ג'וניור', pay: 350, xp: 120, time: 20, icon: '💻', reqSkill: 'תכנות' }
];

// --- נתוני השוק ---
const marketItems = [
    { id: 'coffee', name: 'קפה משובח', price: 50, xp: 20, icon: '☕' },
    { id: 'pizza_box', name: 'מגש פיצה משפחתי', price: 90, xp: 35, icon: '🍕' },
    { id: 'watch', name: 'שעון יד אלגנט', price: 2500, xp: 800, icon: '⌚' },
    { id: 'smartphone', name: 'סמארטפון דור 5', price: 4500, xp: 1500, icon: '📱' },
    { id: 'laptop', name: 'מחשב נייד חזק', price: 7500, xp: 2500, icon: '💻' },
    { id: 'gold_chain', name: 'שרשרת זהב', price: 12000, xp: 5000, icon: '⛓️' }
];

// --- פונקציות עבודה ---
function drawWork(c) {
    c.innerHTML = `<h3>⚒️ מרכז תעסוקה</h3>`;
    jobs.forEach(j => {
        const canWork = (!j.reqCar || cars.length > 0) && (!j.reqSkill || skills.includes(j.reqSkill));
        c.innerHTML += `
            <div class="card fade-in" style="opacity: ${canWork ? 1 : 0.6}">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <b>${j.icon} ${j.name}</b><br>
                        <small style="color:var(--green)">${j.pay}₪</small> | <small style="color:var(--blue)">+${j.xp} XP</small>
                    </div>
                    <button class="sys-btn" onclick="startWork('${j.id}')" ${canWork ? '' : 'disabled'}>
                        ${canWork ? 'עבוד' : 'נעול'}
                    </button>
                </div>
            </div>
        `;
    });
}

function startWork(id) {
    const j = jobs.find(x => x.id === id);
    showMsg(`עובד בתור ${j.name}...`, "var(--blue)");
    
    // כאן אפשר להוסיף פס התקדמות אם תרצה בעתיד
    setTimeout(() => {
        money += j.pay;
        lifeXP += j.xp;
        showMsg(`סיימת משמרת! הרווחת ${j.pay}₪`, "var(--green)");
        updateUI();
        saveGame();
        if (document.getElementById('btnHome').classList.contains('active')) drawHome(document.getElementById('content'));
    }, j.time * 100); 
}

// --- פונקציות שוק (Market) ---
function drawMarket(c) {
    c.innerHTML = `
        <div class="fade-in">
            <h3>🛒 שוק מוצרי צריכה</h3>
            <p style="font-size:12px; opacity:0.7;">קניית מוצרים מעלה את רמת החיים (XP) לצמיתות.</p>
            <div id="market-grid"></div>
        </div>
    `;
    const grid = document.getElementById('market-grid');
    marketItems.forEach(item => {
        grid.innerHTML += `
            <div class="card" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:24px;">${item.icon}</span>
                    <div>
                        <b>${item.name}</b><br>
                        <small style="color:var(--green)">${item.price.toLocaleString()}₪</small> | 
                        <small style="color:var(--purple)">+${item.xp} XP</small>
                    </div>
                </div>
                <button class="sys-btn" onclick="buyMarketItem('${item.id}')" style="padding:10px 15px;">קנה</button>
            </div>
        `;
    });
}

function buyMarketItem(id) {
    const item = marketItems.find(x => x.id === id);
    if (money >= item.price) {
        money -= item.price;
        lifeXP += item.xp;
        
        // הוספה למלאי (Inventory)
        inventory.push({ id: item.id, icon: item.icon, name: item.name });
        
        showMsg(`תתחדש! קנית ${item.name}`, "var(--green)");
        saveGame();
        updateUI();
        drawMarket(document.getElementById('content')); // רענון השוק
    } else {
        showMsg("אין לך מספיק כסף מזומן!", "var(--red)");
    }
}

// --- קזינו (Tasks/Casino) ---
function drawCasino(c) {
    c.innerHTML = `
        <div class="card fade-in" style="text-align:center; border:1px solid var(--yellow);">
            <h3 style="color:var(--yellow)">🎰 קזינו מזל</h3>
            <p>נסה את מזלך - הכפל את הכסף או הפסד הכל!</p>
            <input type="number" id="betAmount" placeholder="סכום הימור" style="width:100%; padding:12px; border-radius:10px; border:1px solid var(--border); background:rgba(0,0,0,0.2); color:white; margin-bottom:10px; text-align:center;">
            <div class="grid-2">
                <button class="action" onclick="playCasino(2)" style="background:var(--yellow); color:black;">פי 2 (50%)</button>
                <button class="action" onclick="playCasino(5)" style="background:var(--purple);">פי 5 (15%)</button>
            </div>
        </div>
    `;
}

function playCasino(mult) {
    const amt = parseInt(document.getElementById('betAmount').value);
    if (!amt || amt <= 0 || amt > money) {
        showMsg("סכום הימור לא תקין!", "var(--red)");
        return;
    }

    money -= amt;
    updateUI();
    
    const chance = mult === 2 ? 0.48 : 0.15; // סיכויי זכייה (קצת פחות מ-50% לבית)
    
    showMsg("מסובב את הרולטה...", "var(--yellow)");
    
    setTimeout(() => {
        if (Math.random() < chance) {
            const win = amt * mult;
            money += win;
            showMsg(`זכית ב-${win.toLocaleString()}₪! 🎉`, "var(--green)");
        } else {
            showMsg("הפסדת את ההימור. נסה שוב!", "var(--red)");
        }
        saveGame();
        updateUI();
    }, 1000);
}

// --- מתנה יומית ---
function getDailyGift() {
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000; // 24 שעות

    if (now - lastGift > cooldown) {
        const gift = 500 + Math.floor(Math.random() * 1000);
        money += gift;
        lastGift = now;
        showMsg(`קיבלת מתנה יומית: ${gift}₪!`, "var(--yellow)");
        saveGame();
        updateUI();
        if (document.getElementById('btnHome').classList.contains('active')) drawHome(document.getElementById('content'));
    } else {
        const remain = cooldown - (now - lastGift);
        const hours = Math.floor(remain / (60 * 60 * 1000));
        showMsg(`המתנה הבאה בעוד ${hours} שעות`, "var(--white)");
    }
}
