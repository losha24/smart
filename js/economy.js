/* Smart Money Pro - js/economy.js - v5.7.2 */
function drawBank(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <h3>🏦 בנק</h3>
            <p>יתרה בבנק: <b>${bank.toLocaleString()}₪</b></p>
            <input type="number" id="bank-amt" placeholder="סכום..." class="card" style="width:100%;">
            <div class="grid-2">
                <button class="action" onclick="bankOp('dep')">הפקד</button>
                <button class="action" onclick="bankOp('wd')">משוך</button>
            </div>
            <hr>
            <button class="action" style="background:var(--blue)" onclick="loanOp()">קח הלוואה (10K)</button>
        </div>`;
}

function bankOp(type) {
    const amt = parseInt(document.getElementById('bank-amt').value);
    if (!amt || amt <= 0) return;
    if (type === 'dep' && money >= amt) { money -= amt; bank += amt; }
    else if (type === 'wd' && bank >= amt) { bank -= amt; money += amt; }
    else { return showMsg("אין מספיק כסף", "var(--red)"); }
    updateUI(); openTab('bank');
}

function drawInvest(c) {
    let h = `<div class="card fade-in"><h3>📈 בורסה</h3><div class="grid-2">`;
    const stocks = [{id:'AAPL', n:'Apple', p:150}, {id:'TSLA', n:'Tesla', p:200}, {id:'NVDA', n:'Nvidia', p:450}, {id:'BTC', n:'Bitcoin', p:65000}];
    stocks.forEach(s => {
        h += `<div class="card" style="padding:10px;">
                <b>${s.n}</b><br><small>${s.p}₪</small><br>
                <button class="action" onclick="buyStk('${s.id}',${s.p})">קנה</button>
                <button class="action" style="background:var(--red)" onclick="sellStk('${s.id}',${s.p})">מכור</button>
              </div>`;
    });
    c.innerHTML = h + `</div></div>`;
}

function buyStk(id, p) { if(money>=p){money-=p; invOwned[id]++; updateUI(); openTab('invest');} }
function sellStk(id, p) { if(invOwned[id]>0){money+=p; invOwned[id]--; updateUI(); openTab('invest');} }

// פונקציית drawMarket המורחבת מגרסה קודמת (עם 10 פריטים) צריכה להישאר כאן.
