const bzPool = [ {n:"דוכן קפה", c:15000, p:12}, {n:"קיוסק", c:45000, p:40}, {n:"מכבסה", c:120000, p:110}, {n:"פיצריה", c:350000, p:320} ];
const rePool = [ {n:"חניה", c:85000, p:40}, {n:"מחסן", c:180000, p:90}, {n:"סטודיו", c:750000, p:400} ];
const carPool = [ {n:"קורקינט", c:2500, s:1.2}, {n:"אופנוע", c:15000, s:1.5}, {n:"רכב משומש", c:45000, s:2}, {n:"משפחתית", c:140000, s:3} ];

function drawMarket(c, tab) {
    let list = (tab==='business')?bzPool : (tab==='realestate')?rePool : (tab==='cars')?carPool : (tab==='skills')?skPool : mkPool;
    c.innerHTML = `<div class="grid-2 fade-in"></div>`;
    
    list.forEach(i => {
        const has = (tab==='skills' && skills.includes(i.n)) || (tab==='cars' && cars.includes(i.n));
        const canAfford = money >= i.c;
        let btnStatus = has ? 'disabled' : (!canAfford ? 'no-money' : '');
        let action = has ? '' : (canAfford ? `executeBuy('${tab}', '${i.n}', ${i.c}, ${i.p||i.s||0})` : `showMsg('אין מספיק כסף!', 'var(--red)')`);

        c.querySelector(".grid-2").innerHTML += `
            <div class="card">
                <b>${i.n}</b><br><small>${i.c.toLocaleString()}₪</small>
                <button class="action ${btnStatus}" onclick="${action}">${has ? 'נרכש' : 'קנה'}</button>
            </div>`;
    });
}

function executeBuy(type, name, cost, val) {
    if(money < cost) return;
    money -= cost; totalSpent += cost;
    if(type === 'skills') skills.push(name);
    else if(type === 'cars') { cars.push(name); if(val > carSpeed) carSpeed = val; }
    else { inventory.push(name); passive += val; }
    showMsg(`בוצע! קנית ${name}`); updateUI(); openTab(type);
}
