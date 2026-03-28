/* Smart Money Pro - js/activities.js - v5.7.2 */
function drawWork(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <h3>⚒️ עבודה אקטיבית</h3>
            <div class="progress-container"><div id="work-progress" class="progress-bar"></div></div>
            <button class="action" id="work-btn" onclick="startWork()">בצע משמרת (150₪)</button>
        </div>`;
}

function startWork() {
    if (working) return; working = true;
    const btn = document.getElementById("work-btn");
    const bar = document.getElementById("work-progress");
    btn.disabled = true;
    let width = 0;
    let interval = setInterval(() => {
        width += (1.5 * carSpeed);
        bar.style.width = width + "%";
        if (width >= 100) {
            clearInterval(interval); working = false;
            bar.style.width = "0%"; btn.disabled = false;
            money += 150; totalEarned += 150;
            showMsg("+150₪", "var(--green)"); updateUI();
        }
    }, 50);
}

function renderGiftBtn() {
    const container = document.getElementById("gift-container");
    const now = Date.now();
    const wait = 4 * 60 * 60 * 1000;
    if (now - lastGift < wait) {
        container.innerHTML = `<button class="action no-money" style="width:auto; padding:5px 10px; font-size:11px;" disabled>🎁 נעול</button>`;
    } else {
        container.innerHTML = `<button class="action" style="width:auto; padding:5px 10px; font-size:11px;" onclick="claimGift()">🎁 קבל בונוס</button>`;
    }
}

function claimGift() {
    lastGift = Date.now();
    const rand = Math.floor(Math.random() * (25000 - 1500 + 1)) + 1500;
    money += rand; totalEarned += rand;
    showMsg(`זכית ב-${rand.toLocaleString()}₪!`, "var(--green)");
    updateUI(); openTab('home');
}

function drawCasino(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <h3>🎰 קזינו</h3>
            <input type="number" id="bet-amt" placeholder="סכום הימור..." class="card" style="width:100%; border:1px solid var(--border);">
            <button class="action" onclick="playCasino()">המר (זכייה פי 3)</button>
        </div>`;
}

function playCasino() {
    const amt = parseInt(document.getElementById('bet-amt').value);
    if (!amt || money < amt) return showMsg("סכום לא תקין", "var(--red)");
    money -= amt;
    if (Math.random() < 0.4) {
        money += amt * 3; showMsg("זכית!", "var(--green)");
    } else { showMsg("הפסדת", "var(--red)"); }
    updateUI();
}
