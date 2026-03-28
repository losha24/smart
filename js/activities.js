/* Smart Money Pro - js/activities.js - v5.7.1 */

function drawCasino(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <h3>🎰 קזינו מותאם אישית</h3>
            <p>הכנס סכום הימור (סיכוי זכייה: 40%):</p>
            <input type="number" id="bet-amount" class="card" style="width:80%; margin:10px auto; display:block; text-align:center;" placeholder="סכום הימור...">
            <button class="action" onclick="playCustomCasino()">סובב והמר!</button>
            <div id="casino-result" style="margin-top:10px; font-weight:bold;"></div>
        </div>`;
}

function playCustomCasino() {
    const amount = parseInt(document.getElementById('bet-amount').value);
    const resultDiv = document.getElementById('casino-result');
    
    if (isNaN(amount) || amount <= 0) return showMsg("הכנס סכום תקין!");
    if (money < amount) return showMsg("אין לך מספיק כסף!", "var(--red)");

    money -= amount;
    const isWin = Math.random() < 0.4;

    if (isWin) {
        const winAmount = amount * 3;
        money += winAmount;
        resultDiv.innerText = `זכית ב-${winAmount.toLocaleString()}₪!`;
        resultDiv.style.color = "var(--green)";
    } else {
        resultDiv.innerText = "הפסדת את ההימור...";
        resultDiv.style.color = "var(--red)";
    }
    updateUI();
}
