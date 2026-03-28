/* Smart Money Pro - js/ui.js - v5.7.6 */

window.openTab = function(t) {
    // עדכון כפתורים פעילים
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + t.charAt(0).toUpperCase() + t.slice(1));
    if(btn) btn.classList.add("active");
    
    const c = document.getElementById("content"); 
    if(!c) return;
    c.innerHTML = "";
    
    // ניווט לתוכן
    if(t === 'home') drawHome(c);
    else if(t === 'work') drawWork(c);
    else if(t === 'tasks') drawCasino(c);
    else if(t === 'invest') drawInvest(c);
    else if(t === 'bank') drawBank(c);
    else if(['business','realestate','skills','cars','market'].includes(t)) drawMarket(c, t);
    
    window.scrollTo(0,0);
};

function drawHome(c) {
    const level = Math.floor(lifeXP / 5000) + 1;
    const currentLevelXP = lifeXP % 5000;
    const progress = (currentLevelXP / 5000) * 100;

    c.innerHTML = `
        <div class="card fade-in">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0;">🏠 בית</h3>
                <div id="gift-container"></div>
            </div>
            <div class="card" style="background: rgba(168, 85, 247, 0.1); border: 1px solid #a855f7;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <b>⭐ רמת חיים: ${level}</b>
                    <small>${Math.floor(currentLevelXP)}/5000 XP</small>
                </div>
                <div class="progress-container" style="height:10px;"><div class="progress-bar" style="width:${progress}%; background:#a855f7;"></div></div>
            </div>
            <div class="grid-2" style="margin-top:15px;">
                <div class="card" style="text-align:center;"><small>פסיבי</small><br><b>${passive.toFixed(1)}₪</b></div>
                <div class="card" style="text-align:center;"><small>חוב</small><br><b>${loan.toLocaleString()}₪</b></div>
            </div>
        </div>`;
    if(window.renderGiftBtn) window.renderGiftBtn();
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => window.openTab('home'), 150);
});
