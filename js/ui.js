/* Smart Money Pro - js/ui.js - v5.7.2 */
function openTab(tab) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById("btn" + tab.charAt(0).toUpperCase() + tab.slice(1));
    if(activeBtn) activeBtn.classList.add("active");

    const c = document.getElementById("content");
    c.innerHTML = "";

    switch(tab) {
        case 'home': drawHome(c); break;
        case 'work': drawWork(c); break;
        case 'tasks': drawCasino(c); break;
        case 'invest': drawInvest(c); break;
        case 'bank': drawBank(c); break;
        default: drawMarket(c, tab);
    }
    window.scrollTo(0,0);
}

function drawHome(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0;">🏠 מרכז שליטה</h3>
                <div id="gift-container"></div>
            </div>
            <div id="live-stats"></div>
            <hr style="opacity:0.1; margin:15px 0;">
            <p><small>🚗 רכבים: ${cars.length || "אין"}</small> | <small>🎓 כישורים: ${skills.length || "אין"}</small></p>
        </div>`;
    renderGiftBtn();
    updateUI();
}

document.addEventListener("DOMContentLoaded", () => { setTimeout(() => openTab('home'), 100); });
