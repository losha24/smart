function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if(btn) btn.classList.add("active");

    const c = document.getElementById("content");
    c.innerHTML = "";
    if (typeof initTasks === "function") initTasks();

    if (tab === 'home') {
        let stockVal = 0;
        stocks.forEach(s => stockVal += (invOwned[s.id] || 0) * s.p * 4);
        c.innerHTML = `<div class="card"><h3>📊 סטטוס</h3><p>💰 הכנסות: ${totalEarned.toLocaleString()}₪</p><p>📈 מניות: <b>${Math.floor(stockVal).toLocaleString()}₪</b></p><p>💳 חוב: <span class="neg-text">${loan.toLocaleString()}₪</span></p><hr><button class="action" onclick="claimGift()">🎁 מתנה יומית</button></div>`;
    }
    else if (tab === 'work') drawWork(c);
    else if (tab === 'tasks') drawTasks(c);
    else if (tab === 'invest') drawInvest(c);
    else if (tab === 'bank') drawBank(c);
    else if (['business', 'realestate', 'market', 'skills'].includes(tab)) drawMarket(c, tab);
    else if (tab === 'install') c.innerHTML = `<div class="card"><h3>📲 התקנה</h3><p>לחץ על "הוסף למסך הבית" בדפדפן.</p></div>`;
}

function claimGift() {
    if(Date.now() - lastGift >= 14400000) {
        money += 5000; lastGift = Date.now(); alert("קיבלת 5,000₪!"); updateUI(); openTab('home');
    } else { alert("חזור מאוחר יותר."); }
}
document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
