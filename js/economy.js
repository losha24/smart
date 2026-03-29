/* Smart Money Pro - js/economy.js - v6.0.3 - Full Economy & Market Update */

// --- מערכת הבנק המרכזית ---

function drawBank(c) {
    c.innerHTML = `
    <div class="card fade-in">
        <h3 style="margin-top:0;">🏦 ניהול חשבון בנק</h3>
        <p style="font-size:12px; opacity:0.8;">כסף בבנק בטוח מפני הפסדים בקזינו.</p>
        
        <div class="grid-2">
            <div class="card" style="margin:0; text-align:center; padding:15px; border:1px solid var(--blue);">
                <small>יתרה בבנק</small><br>
                <b style="font-size:18px; color:var(--blue);">${bank.toLocaleString()}₪</b>
            </div>
            <div class="card" style="margin:0; text-align:center; padding:15px; border:1px solid var(--red);">
                <small>חוב קיים (הלוואות)</small><br>
                <b style="font-size:18px; color:var(--red);">${loan.toLocaleString()}₪</b>
            </div>
        </div>
        
        <div style="margin:20px 0;">
            <input type="number" id="bank-amt" placeholder="הכנס סכום להפקדה/משיכה..." 
                style="width:100%; padding:15px; border-radius:12px; border:1px solid var(--border); background:rgba(0,0,0,0.2); color:var(--text); text-align:center; font-size:16px;">
        </div>
        
        <div class="grid-2">
            <button class="action" onclick="executeBankOp('dep')" style="background:var(--green); color:white;">⬇️ הפקד לבנק</button>
            <button class="action" onclick="executeBankOp('wd')" style="background:var(--blue); color:white;">⬆️ משוך מזומן</button>
        </div>
        
        <hr style="opacity:0.1; margin:25px 0;">
        
        <h4 style="margin:0 0 10px 0;">מסגרת אשראי והלוואות</h4>
        <div class="grid-2">
            <button class="action" style="background:var(--yellow); color:black; font-size:13px;" onclick="executeLoanOp('take')">
                קח הלוואה: 10,000₪
            </button>
            <button class="action" style="background:#ec4899; color:white; font-size:13px;" onclick="executeLoanOp('pay')">
                החזר חוב: 10,500₪
            </button>
        </div>
        <p style="font-size:10px; color:var(--red); text-align:center; margin-top:8px;">* החזר הלוואה כולל עמלת ריבית של 5%.</p>
    </div>`;
}

function executeBankOp(type) {
    const input = document.getElementById('bank-amt');
    const amt = parseInt(input.value);
    
    if(!amt || amt <= 0) { 
        showMsg("אנא הזן סכום חוקי לפעולה", "var(--red)"); 
        return; 
    }
    
    if(type === 'dep') {
        if(money >= amt) {
            money -= amt; 
            bank += amt; 
            showMsg(`הופקדו ${amt.toLocaleString()}₪ בהצלחה לחשבון`, "var(--green)"); 
        } else {
            showMsg("אין עליך מספיק מזומן להפקדה זו!", "var(--red)");
            return;
        }
    } else if(type === 'wd') {
        if(bank >= amt) {
            bank -= amt; 
            money += amt; 
            showMsg(`משכת ${amt.toLocaleString()}₪ מהבנק`, "var(--blue)"); 
        } else {
            showMsg("אין מספיק יתרה בבנק למשיכה זו!", "var(--red)");
            return;
        }
    }
    
    input.value = ''; // ניקוי השדה
    updateUI(); 
    saveGame();
    drawBank(document.getElementById("content")); // רענון תצוגת הבנק
}

function executeLoanOp(type) {
    if(type === 'take') { 
        loan += 10000; 
        money += 10000; 
        showMsg("ההלוואה אושרה! קיבלת 10,000₪ מזומן.", "var(--yellow)");
    } else if (type === 'pay') {
        if (loan === 0) {
            showMsg("אין לך חובות לבנק כרגע.", "var(--white)");
            return;
        }
        if (money >= 10500) { 
            money -= 10500; 
            loan = Math.max(0, loan - 10000); // מונע ירידה של החוב מתחת לאפס
            showMsg("שילמת 10,000₪ מהחוב + 500₪ ריבית.", "var(--green)"); 
        } else {
            showMsg("אין לך 10,500₪ במזומן להחזר החוב!", "var(--red)");
            return;
        }
    }
    
    updateUI(); 
    saveGame();
    drawBank(document.getElementById("content"));
}


// --- מערכת בורסה דינמית (Stock Market) ---

// מחירי בסיס ראשוניים
const baseStocks = [
    { id: 'AAPL', name: 'Apple', basePrice: 150 },
    { id: 'TSLA', name: 'Tesla', basePrice: 200 },
    { id: 'NVDA', name: 'Nvidia', basePrice: 450 },
    { id: 'BTC',  name: 'Bitcoin', basePrice: 65000 },
    { id: 'GOOG', name: 'Google', basePrice: 140 },
    { id: 'AMZN', name: 'Amazon', basePrice: 175 },
    { id: 'MSFT', name: 'Microsoft', basePrice: 400 },
    { id: 'NFLX', name: 'Netflix', basePrice: 600 },
    { id: 'META', name: 'Meta', basePrice: 480 },
    { id: 'ELAL', name: 'El-Al', basePrice: 5 }
];

// מחירי מניות נוכחיים (מתעדכנים רנדומלית)
let currentStocks = JSON.parse(JSON.stringify(baseStocks));

// פונקציה לעדכון מחירי המניות (נקראת בכל פעם שנכנסים לטאב הבורסה)
function refreshStockPrices() {
    currentStocks.forEach(stock => {
        // תנודה של בין מינוס 15% לפלוס 15% מהמחיר הקודם
        const fluctuation = 1 + ((Math.random() * 0.3) - 0.15);
        let newPrice = stock.basePrice * fluctuation;
        
        // מונע מהמניה לקרוס לאפס
        stock.basePrice = Math.max(1, Math.floor(newPrice)); 
    });
}

function drawInvest(c) {
    refreshStockPrices(); // עדכון מחירים בכל כניסה לבורסה
    
    let html = `
    <div class="card fade-in">
        <h3 style="margin-top:0;">📈 מסחר בבורסה</h3>
        <p style="font-size:11px; opacity:0.8; margin-bottom:15px;">המחירים משתנים בכל פעם שאתה נכנס למסך זה. קנה בזול, מכור ביוקר!</p>
        <div class="grid-2">`;
        
    currentStocks.forEach(s => {
        const ownedCount = invOwned[s.id] || 0;
        const totalValue = ownedCount * s.basePrice;
        
        html += `
        <div class="card" style="padding:12px; font-size:12px; text-align:center; border:1px solid rgba(255,255,255,0.05);">
            <b style="font-size:14px;">${s.name} (${s.id})</b><br>
            <span style="color:var(--yellow); font-weight:bold; font-size:16px;">${s.basePrice.toLocaleString()}₪</span>
            
            <div class="grid-2" style="margin-top:10px; gap:8px;">
                <button class="action" style="padding:8px 0; height:auto; background:var(--green); color:white; font-size:12px;" onclick="executeStockOp('buy', '${s.id}', ${s.basePrice})">קנה</button>
                <button class="action" style="padding:8px 0; height:auto; background:var(--red); color:white; font-size:12px;" onclick="executeStockOp('sell', '${s.id}', ${s.basePrice})" ${ownedCount === 0 ? 'disabled' : ''}>מכור</button>
            </div>
            
            <div style="margin-top:8px; font-size:11px; background:rgba(0,0,0,0.2); padding:5px; border-radius:6px;">
                בתיק: <b>${ownedCount}</b> <br> שווי: <b style="color:var(--blue)">${totalValue.toLocaleString()}₪</b>
            </div>
        </div>`;
    });
    
    html += `</div></div>`;
    c.innerHTML = html;
}

function executeStockOp(type, id, price) {
    if(type === 'buy') {
        if(money >= price) { 
            money -= price; 
            invOwned[id] = (invOwned[id] || 0) + 1; 
            showMsg(`רכשת מניית ${id} ב-${price.toLocaleString()}₪`, "var(--green)"); 
        } else {
            showMsg("אין לך מספיק מזומן לקניית המניה!", "var(--red)");
            return;
        }
    } else if(type === 'sell') {
        if(invOwned[id] && invOwned[id] > 0) { 
            money += price; 
            invOwned[id]--; 
            showMsg(`מכרת מניית ${id} ב-${price.toLocaleString()}₪`, "var(--blue)"); 
        } else {
            showMsg("אין לך מניות מסוג זה למכור!", "var(--red)");
            return;
        }
    }
    
    updateUI(); 
    saveGame();
    // לא קוראים ל-drawInvest שוב מיד כדי לא לשנות את המחירים בזמן שהשחקן קונה רצוף.
    // אם נרצה לעדכן רק את הכפתורים/כמות נצטרך לעשות עדכון UI מקומי, 
    // אבל לשם הפשטות - נרענן את כל הטאב.
    openTab('invest'); 
}
