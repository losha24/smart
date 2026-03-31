/* Smart Money Pro - js/economy.js - v6.0.6 */

const stockList = [
    { id: 'AAPL', name: 'Apple', price: 580 },
    { id: 'TSLA', name: 'Tesla', price: 920 },
    { id: 'NVDA', name: 'Nvidia', price: 420 },
    { id: 'BTC',  name: 'Bitcoin', price: 65000 },
    { id: 'ELAL', name: 'אל-על', price: 12 }
];

const businessList = [
    { id: 'biz_falafel', name: 'דוכן פלאפל', price: 65000, passive: 550, icon: '🥙' },
    { id: 'biz_garage', name: 'מוסך רכב', price: 320000, passive: 3400, icon: '🔧' }
];

const estateList = [
    { id: 'e1', name: 'מחסן להשכרה', price: 15000, passive: 120, icon: '📦' },
    { id: 'e2', name: 'דירת סטודיו', price: 150000, passive: 950, icon: '🏠' }
];

// מנוע בורסה חי
setInterval(() => {
    stockList.forEach(s => { s.price *= (1 + (Math.random() * 0.04 - 0.02)); });
    if (typeof currentTab !== 'undefined' && (currentTab === 'invest' || currentTab === 'market')) {
        const content = document.getElementById('content');
        if (content) drawMarket(content);
    }
}, 3000);

function drawMarket(c) {
    let html = `<h3>📈 בורסה ושוק</h3><div class="grid-1">`;
    stockList.forEach(s => {
        const owned = invOwned[s.id] || 0;
        html += `<div class="card" style="display:flex; justify-content:space-between; align-items:center;">
            <div><b>${s.name}</b><br><small>בבעלותך: ${owned}</small></div>
            <div style="color:var(--blue); font-weight:bold;">${s.price.toFixed(2)}₪</div>
            <div>
                <button class="sys-btn" onclick="buyStock('${s.id}')">קנה</button>
                <button class="sys-btn" onclick="sellStock('${s.id}')">מכור</button>
            </div>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyStock(id) {
    const s = stockList.find(x => x.id === id);
    if(money >= s.price) { money -= s.price; invOwned[id] = (invOwned[id]||0)+1; updateUI(); saveGame(); drawMarket(document.getElementById('content')); }
}

function sellStock(id) {
    if(invOwned[id] > 0) {
        const s = stockList.find(x => x.id === id);
        money += s.price; invOwned[id]--; updateUI(); saveGame(); drawMarket(document.getElementById('content'));
    }
}

function drawBank(c) {
    c.innerHTML = `<div class="card" style="text-align:center;"><h3>🏦 בנק</h3>
    <div class="card" style="background:rgba(0,0,0,0.2);">יתרה: ${bank.toLocaleString()}₪</div>
    <p style="color:var(--red);">חוב: ${loan.toLocaleString()}₪</p>
    <button class="action" onclick="takeLoan()">קח הלוואה (50,000₪)</button></div>`;
}

function takeLoan() { loan += 50000; money += 50000; updateUI(); saveGame(); drawBank(document.getElementById('content')); }

function drawBusiness(c) {
    let html = `<h3>💼 עסקים</h3><div class="grid-1">`;
    businessList.forEach(b => {
        const level = inventory.filter(i => i === b.id).length;
        html += `<div class="card" style="display:flex; justify-content:space-between; align-items:center;">
            <div>${b.icon} <b>${b.name}</b> (רמה ${level})</div>
            <button class="sys-btn" onclick="buyBusiness('${b.id}', ${b.price}, ${b.passive})">${b.price}₪</button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyBusiness(id, price, passAdd) {
    if(money >= price) { money -= price; passive += passAdd; inventory.push(id); updateUI(); saveGame(); drawBusiness(document.getElementById('content')); }
}

function drawEstate(c) {
    let html = `<h3>🏠 נדל"ן</h3><div class="grid-2">`;
    estateList.forEach(e => {
        html += `<div class="card" style="text-align:center;"><div>${e.icon} ${e.name}</div>
        <button class="sys-btn" onclick="buyEstate('${e.id}')">${e.price}₪</button></div>`;
    });
    c.innerHTML = html + `</div>`;
}

function buyEstate(id) {
    const e = estateList.find(x => x.id === id);
    if(money >= e.price) { money -= e.price; passive += e.passive; inventory.push(e.name); updateUI(); saveGame(); drawEstate(document.getElementById('content')); }
}
