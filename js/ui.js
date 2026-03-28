function openTab(t) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + t.charAt(0).toUpperCase() + t.slice(1));
    if(btn) btn.classList.add("active");
    const c = document.getElementById("content");
    c.innerHTML = "";
    if(t === 'home') drawHome(c);
    else if(t === 'work') drawWork(c);
    else if(t === 'tasks') drawCasino(c);
    else if(t === 'invest') drawInvest(c);
    else if(t === 'bank') drawBank(c);
    else drawMarket(c, t);
    window.scrollTo(0,0);
}

function drawHome(c) {
    c.innerHTML = `<div class="card fade-in"><div style="display:flex; justify-content:space-between; align-items:center;"><h3>🏠 מרכז שליטה</h3><div id="gift-container"></div></div><div id="live-stats"></div><hr style="opacity:0.1; margin:10px 0;"><p><small>🚗 רכבים: ${cars.length} | 🎓 כישורים: ${skills.length}</small></p></div>`;
    renderGiftBtn();
    updateUI();
}
document.addEventListener("DOMContentLoaded", () => setTimeout(()=>openTab('home'), 150));
