function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if(btn) btn.classList.add("active");

    const c = document.getElementById("content");
    c.innerHTML = "";

    if (tab === 'home') {
        let stockVal = 0;
        stocks.forEach(s => stockVal += (invOwned[s.id] || 0) * s.p);
        c.innerHTML = `
            <div class="card fade-in">
                <h3>📊 נכסים וכישורים</h3>
                <p><b>כישורים:</b> ${skills.length > 0 ? skills.join(", ") : "טרם נרכשו"}</p>
                <p><b>רכוש:</b> ${inventory.length > 0 ? inventory.join(", ") : "טרם נרכש"}</p>
                <p><b>רכבים:</b> ${cars.length > 0 ? cars.join(", ") : "אין רכב"}</p>
                <hr>
                <p>📈 שווי מניות: <b>${Math.floor(stockVal).toLocaleString()}₪</b></p>
                <p>💳 חוב בנק: <span class="neg-text">${loan.toLocaleString()}₪</span></p>
                <button class="action" onclick="claimGift()">🎁 מתנה יומית</button>
            </div>`;
    }
    else if (tab === 'work') drawWork(c);
    else if (tab === 'invest') drawInvest(c);
    else if (tab === 'bank') drawBank(c);
    else if (['business', 'realestate', 'market', 'skills', 'cars'].includes(tab)) drawMarket(c, tab);
}

function claimGift() {
    if(Date.now() - lastGift >= 14400000) {
        money += 5000; lastGift = Date.now();
        showMsg("קיבלת 5,000₪ מתנה!"); updateUI(); openTab('home');
    } else { showMsg("המתנה תהיה זמינה עוד מעט", "var(--red)"); }
}

document.addEventListener("DOMContentLoaded", () => { updateUI(); openTab('home'); });
