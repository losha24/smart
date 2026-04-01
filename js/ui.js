function openTab(tabId) {
    const content = document.getElementById('content');
    document.querySelectorAll('.topbar button').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${tabId}`);
    if (activeBtn) activeBtn.classList.add('active');

    content.innerHTML = "";
    switch (tabId) {
        case 'home': drawHome(content); break;
        case 'work': drawWork(content); break;
        case 'business': drawBusiness(content); break;
        case 'estate': drawEstate(content); break;
        case 'market': drawMarket(content); break;
        case 'skills': drawSkills(content); break;
        case 'cars': drawCars(content); break;
        case 'bank': drawBank(content); break;
        case 'invest': drawInvest(content); break;
    }
}

function drawHome(c) {
    let ld = getLevelData(lifeXP);
    c.innerHTML = `
        <div class="main-card-hero fade-in" style="background: linear-gradient(135deg, #111, #000); border: 1px solid #333; padding: 15px;">
            <h2 style="text-align:center; color:var(--blue); font-size:14px; margin:0;">✉️ הודעת מנהל</h2>
            <p style="text-align:center; font-size:11px; opacity:0.6; margin: 5px 0 15px 0;">המערכת פעילה. ההכנסה הפסיבית נשמרת גם ביציאה.</p>
            
            <div style="text-align:center; margin-bottom:15px;">
                <div style="display:flex; justify-content: space-between; font-size:12px; margin-bottom:5px;">
                    <span>רמה ${ld.level}</span>
                    <span id="xp-detail" style="color:var(--purple);">${Math.floor(lifeXP).toLocaleString()} / ${ld.nextXP.toLocaleString()} XP</span>
                </div>
                <div class="xp-container-big" style="height:8px; background:#222; border-radius:10px; overflow:hidden;">
                    <div id="xp-progress-bar" class="xp-bar-fill" style="width:${ld.progressPercent}%; height:100%; background:linear-gradient(90deg, var(--blue), var(--purple)); transition:0.5s;"></div>
                </div>
            </div>

            <div class="grid-2" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                <div class="card" style="margin:0; padding:12px; text-align:center; background:rgba(0,255,150,0.05); border:1px solid rgba(0,255,150,0.1);">
                    <small style="font-size:10px; opacity:0.7;">הכנסה פסיבית</small><br>
                    <b style="color:var(--green); font-size:16px;">₪<span id="passive-val">${Math.floor(passive).toLocaleString()}</span></b>
                </div>
                <div class="card" style="margin:0; padding:12px; text-align:center; background:rgba(255,210,0,0.05); border:1px solid rgba(255,210,0,0.1);">
                    <small style="font-size:10px; opacity:0.7;">מזומן זמין</small><br>
                    <b style="color:var(--yellow); font-size:16px;">₪<span id="money">${Math.floor(money).toLocaleString()}</span></b>
                </div>
            </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; margin:15px 0;">
            <button class="action" onclick="getDailyGift()" style="font-size:11px; padding:12px 0;">🎁 בונוס (4ש')</button>
            <button class="action" onclick="saveGame()" style="background:var(--purple); font-size:11px; padding:12px 0;">💾 שמור</button>
            <button id="install-btn" class="action" style="background:var(--blue); font-size:11px; padding:12px 0;">📲 התקנה</button>
        </div>

        <div class="card fade-in" style="padding:12px; border:1px solid #222;">
            <h3 style="font-size:13px; margin:0 0 10px 0; border-bottom:1px solid #333; padding-bottom:5px;">📦 הנכסים שלי</h3>
            <div style="display:grid; grid-template-columns: repeat(6, 1fr); gap:6px;">
                ${inventory.length > 0 ? inventory.map(i => `<div class="inv-slot" style="width:35px; height:35px; background:#111; border:1px solid #333; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:18px;">${i.icon}</div>`).join('') : '<p style="grid-column:span 6; font-size:10px; opacity:0.3; text-align:center;">אין נכסים</p>'}
            </div>
        </div>
    `;
}

function getDailyGift() {
    let now = Date.now();
    let cooldown = 4 * 60 * 60 * 1000;
    if (now - lastDailyGift < cooldown) {
        let diff = cooldown - (now - lastDailyGift);
        let mins = Math.ceil(diff / 60000);
        return showMsg(`חזור בעוד ${mins} דקות`, "var(--red)");
    }
    let prize = 50000 * getLevelData(lifeXP).level;
    money += prize;
    lastDailyGift = now;
    showMsg(`בונוס התקבל! +₪${prize.toLocaleString()}`, "var(--yellow)");
    saveGame();
    openTab('home');
}
