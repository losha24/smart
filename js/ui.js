/* Smart Money Pro - js/ui.js - v5.7.6 */

function openTab(t) {
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById("btn" + t.charAt(0).toUpperCase() + t.slice(1));
    if(btn) btn.classList.add("active");
    
    const c = document.getElementById("content"); 
    c.innerHTML = "";
    
    // ניווט בין טאבים
    if(t === 'home') drawHome(c);
    else if(t === 'work') drawWork(c);
    else if(t === 'tasks') drawCasino(c);
    else if(t === 'invest') drawInvest(c);
    else if(t === 'bank') drawBank(c);
    else drawMarket(c, t); // מטפל בעסקים, נדל"ן, כישורים, רכבים ושוק
    
    window.scrollTo(0,0);
}

function drawHome(c) {
    const level = Math.floor(lifeXP / 5000) + 1;
    const nextXP = level * 5000;
    const currentLevelXP = lifeXP % 5000;
    const progress = (currentLevelXP / 5000) * 100;

    c.innerHTML = `
        <div class="card fade-in">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0;">🏠 מרכז שליטה</h3>
                <div id="gift-container"></div>
            </div>
            
            <div class="card" style="background: rgba(168, 85, 247, 0.1); border: 1px solid #a855f7;">
                <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                    <span style="font-size:0.9em; font-weight:bold;">⭐ רמת חיים: ${level}</span>
                    <span style="font-size:0.8em; opacity:0.8;">${Math.floor(currentLevelXP)} / 5,000 XP</span>
                </div>
                <div class="progress-container" style="height:12px; background: rgba(0,0,0,0.2);">
                    <div class="progress-bar" style="width:${progress}%; background:#a855f7; box-shadow: 0 0 10px #a855f7;"></div>
                </div>
            </div>

            <div class="grid-2" style="margin-top:15px;">
                <div class="card" style="margin:0; padding:12px; text-align:center;">
                    <small style="opacity:0.7;">הכנסה פסיבית</small><br>
                    <b style="color:var(--green); font-size:1.1em;">${passive.toFixed(2)}₪/ש</b>
                </div>
                <div class="card" style="margin:0; padding:12px; text-align:center;">
                    <small style="opacity:0.7;">חוב לבנק</small><br>
                    <b style="color:var(--red); font-size:1.1em;">${loan.toLocaleString()}₪</b>
                </div>
            </div>

            <div style="margin-top:20px; font-size:0.9em; line-height:1.6;">
                <p>🎓 <b>כישורים:</b> ${skills.length > 0 ? skills.join(", ") : "טרם נרכשו כישורים"}</p>
                <p>🚗 <b>צי רכבים:</b> ${cars.length > 0 ? cars.join(", ") : "אין בבעלותך רכב"}</p>
            </div>
        </div>`;
    
    renderGiftBtn();
    updateUI();
}

// הפעלה ראשונית של האפליקציה
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => openTab('home'), 100);
});
