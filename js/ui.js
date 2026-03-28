function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if(btn) btn.classList.add("active");

    const c = document.getElementById("content");
    c.innerHTML = "";

    if (tab === 'home') {
        c.innerHTML = `
            <div class="card fade-in">
                <h3>🏠 מרכז שליטה</h3>
                <div id="live-stats"></div> <hr>
                <p><b>כישורים:</b> ${skills.length > 0 ? skills.join(", ") : "אין"}</p>
                <p><b>רכבים:</b> ${cars.length > 0 ? cars.join(", ") : "אין"}</p>
                <button class="action" onclick="claimGift()">🎁 מתנה יומית</button>
            </div>`;
        updateUI(); // לעדכון מיידי של הסטטיסטיקה בבית
    }
    else if (tab === 'work') drawWork(c);
    else if (tab === 'bank') drawBank(c);
    else if (tab === 'invest') drawInvest(c);
    else drawMarket(c, tab);
}
