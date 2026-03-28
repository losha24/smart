let working = false;
function drawWork(c) {
    c.innerHTML = `<div class="card fade-in"><h3>⚒️ עבודה</h3><div class="progress-container"><div id="work-progress" class="progress-bar"></div></div><button class="action" id="work-btn" onclick="startWork()">בצע משמרת (150₪)</button></div>`;
}

function startWork() {
    if(working) return; working = true;
    const btn = document.getElementById("work-btn"), bar = document.getElementById("work-progress");
    btn.disabled = true; let w = 0;
    let i = setInterval(() => {
        w += (2 * carSpeed); bar.style.width = w + "%";
        if(w >= 100) { clearInterval(i); working = false; bar.style.width = "0%"; btn.disabled = false; money += 150; totalEarned += 150; showMsg("+150₪", "var(--green)"); updateUI(); }
    }, 50);
}

function renderGiftBtn() {
    const cont = document.getElementById("gift-container");
    const diff = Date.now() - lastGift;
    if(diff < 4*60*60*1000) cont.innerHTML = `<button class="action no-money" style="width:auto; padding:5px 10px; font-size:11px;" disabled>🎁 נעול</button>`;
    else cont.innerHTML = `<button class="action" style="width:auto; padding:5px 10px; font-size:11px;" onclick="claimGift()">🎁 קבל בונוס</button>`;
}

function claimGift() {
    lastGift = Date.now();
    const r = Math.floor(Math.random() * (25000 - 1500 + 1)) + 1500;
    money += r; totalEarned += r;
    showMsg(`בונוס: ${r.toLocaleString()}₪`, "var(--green)");
    updateUI(); openTab('home');
}

function drawCasino(c) {
    c.innerHTML = `<div class="card fade-in"><h3>🎰 קזינו</h3><input type="number" id="bet-amt" placeholder="סכום..." class="card" style="width:100%; text-align:center;"><button class="action" onclick="playCasino()">המר (x3)</button></div>`;
}

function playCasino() {
    const a = parseInt(document.getElementById('bet-amt').value);
    if(!a || a <= 0 || money < a) return showMsg("סכום לא תקין", "var(--red)");
    money -= a;
    if(Math.random() < 0.4) { money += a*3; showMsg("זכית!", "var(--green)"); }
    else showMsg("הפסדת", "var(--red)");
    updateUI();
}
