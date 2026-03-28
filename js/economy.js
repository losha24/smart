/* Smart Money Pro - js/economy.js - v5.7.0 */

// נתוני מניות (בורסה)
const stocks = [
    { id: 'AAPL', n: 'Apple', p: 150 },
    { id: 'TSLA', n: 'Tesla', p: 200 },
    { id: 'NVDA', n: 'Nvidia', p: 450 },
    { id: 'BTC', n: 'Bitcoin', p: 65000 }
];

// --- ניהול בנק ---
function drawBank(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <h3>🏦 בנק הפועלים</h3>
            <p>כסף בבנק: <b>${bank.toLocaleString()}₪</b></p>
            <div class="grid-2">
                <button class="action" onclick="bankAction('dep')">הפקד 1,000₪</button>
                <button class="action" onclick="bankAction('wd')">משוך 1,000₪</button>
            </div>
            <p style="font-size:0.8em; margin-top:10px;">* ריבית יומית של 0.1% מתווספת כל 24 שעות.</p>
        </div>`;
}

function bankAction(type) {
    if (type === 'dep' && money >= 1000) {
        money -= 1000; bank += 1000;
        showMsg("הופקדו 1,000₪", "var(--green)");
    } else if (type === 'wd' && bank >= 1000) {
        bank -= 1000; money += 1000;
        showMsg("נמשכו 1,000₪", "var(--blue)");
    } else {
        showMsg("אין מספיק כסף!", "var(--red)");
    }
    updateUI();
    openTab('bank');
}

// --- ניהול בורסה ---
function drawInvest(c) {
    let html = `<div class="card fade-in"><h3>📈 בורסה לניירות ערך</h3><div class="grid-2">`;
    stocks.forEach(s => {
        const owned = invOwned[s.id] || 0;
        const canAfford = money >= s.p;
        html += `
            <div class="card" style="margin:5px; padding:10px; border:1px solid var(--border);">
                <b>${s.n}</b><br><small>${s.p}₪</small><br>
                <small>בבעלותך: ${owned}</small>
                <button class="action ${canAfford ? '' : 'no-money'}" onclick="buyStock('${s.id}', ${s.p})">קנה</button>
                <button class="action" style="background:var(--red)" onclick="sellStock('${s.id}', ${s.p})">מכור</button>
            </div>`;
    });
    html += `</div></div>`;
    c.innerHTML = html;
}

function buyStock(id, price) {
    if (money >= price) {
        money -= price; totalSpent += price;
        invOwned[id] = (invOwned[id] || 0) + 1;
        showMsg(`קנית מניית ${id}`);
        updateUI();
        openTab('invest');
    } else {
        showMsg("אין מספיק כסף!", "var(--red)");
    }
}

function sellStock(id, price) {
    if (invOwned[id] > 0) {
        money += price;
        invOwned[id]--;
        showMsg(`מכרת מניית ${id}`);
        updateUI();
        openTab('invest');
    }
}

// --- פונקציית שוק ונדל"ן (drawMarket) ---
function drawMarket(c, tab) {
    let list = [];
    if (tab === 'business') list = bzPool;
    else if (tab === 'realestate') list = rePool;
    else if (tab === 'market') list = mkPool;
    else if (tab === 'skills') list = skPool;
    else if (tab === 'cars') list = carPool;

    c.innerHTML = `<div class="grid-2 fade-in"></div>`;
    list.forEach(i => {
        const has = (tab === 'skills' && skills.includes(i.n)) || (tab === 'cars' && cars.includes(i.n));
        const canAfford = money >= i.c;
        let btnStatus = has ? 'disabled' : (!canAfford ? 'no-money' : '');
        let action = has ? '' : (canAfford ? `executeBuy('${tab}', '${i.n}', ${i.c}, ${i.p||i.s||0})` : `showMsg('אין מספיק כסף!', 'var(--red)')`);

        c.querySelector(".grid-2").innerHTML += `
            <div class="card">
                <b>${i.n}</b><br><small>${i.c.toLocaleString()}₪</small>
                <button class="action ${btnStatus}" onclick="${action}">${has ? 'בבעלותך' : 'קנה'}</button>
            </div>`;
    });
}
