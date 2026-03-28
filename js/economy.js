function drawMarket(c, tab) {
    let list = (tab==='business')?bzPool : (tab==='realestate')?rePool : (tab==='cars')?carPool : (tab==='skills')?skPool : mkPool;
    c.innerHTML = `<div class="grid-2 fade-in"></div>`;
    
    list.forEach(i => {
        const has = (tab==='skills' && skills.includes(i.n)) || (tab==='cars' && cars.includes(i.n));
        const canAfford = money >= i.c;
        
        // קביעת עיצוב הכפתור
        let btnStatus = has ? 'disabled' : (!canAfford ? 'no-money' : '');
        let onClickAction = has ? '' : (canAfford ? `executeBuy('${tab}', '${i.n}', ${i.c}, ${i.p||i.s||0})` : `showMsg('אין לך מספיק כסף!', 'var(--red)')`);

        c.querySelector(".grid-2").innerHTML += `
            <div class="card">
                <b>${i.n}</b><br><small>${i.c.toLocaleString()}₪</small>
                <button class="action ${btnStatus}" onclick="${onClickAction}">
                    ${has ? 'נרכש' : 'קנה'}
                </button>
            </div>`;
    });
}

function executeBuy(type, name, cost, val) {
    if(money < cost) return;
    money -= cost;
    totalSpent += cost;
    
    if(type === 'skills') skills.push(name);
    else if(type === 'cars') { cars.push(name); if(val > carSpeed) carSpeed = val; }
    else { inventory.push(name); passive += val; }
    
    showMsg(`תתחדש! קנית ${name}`);
    updateUI();
    openTab(type);
}
