/* Smart Money Pro - js/tasks.js - v6.3.0 - Casino & Games */

function drawTasks(c) {
    if(!c) return;
    c.innerHTML = `
    <div class="card fade-in" style="border: 2px solid #f59e0b; background: rgba(245, 158, 11, 0.05);">
        <h2 style="text-align:center; color:#f59e0b; margin-top:0;">🎰 קזינו מזל וברכה</h2>
        <p style="text-align:center; font-size:12px; opacity:0.8;">הימורים הם על אחריותך בלבד! (סיכוי זכייה: 45%)</p>
        
        <div class="card" style="background: rgba(0,0,0,0.2); border: 1px solid #444;">
            <h4 style="margin:0 0 10px 0;">🔴 רולטה מהירה</h4>
            <div class="grid-2">
                <button class="action" onclick="playRoulette('red')" style="background:#ef4444; color:white;">אדום (x2)</button>
                <button class="action" onclick="playRoulette('black')" style="background:#1e293b; color:white; border:1px solid #fff;">שחור (x2)</button>
            </div>
            <input type="number" id="bet-roulette" placeholder="סכום הימור..." style="width:100%; margin-top:10px; padding:8px; border-radius:8px; text-align:center; background:#111; color:#fff; border:1px solid #555;">
        </div>

        <div class="card" style="background: rgba(0,0,0,0.2); border: 1px solid #444; text-align:center;">
            <h4 style="margin:0 0 10px 0;">🎰 מכונת המזל</h4>
            <div id="slots-display" style="font-size:40px; letter-spacing:15px; margin:10px 0; min-height:50px;">❓ ❓ ❓</div>
            <button class="action" onclick="playSlots()" style="width:100%; background:var(--blue); color:white;">משוך בידית (500₪)</button>
            <small style="display:block; margin-top:5px; opacity:0.7;">שלישייה זהה = 5,000₪ | זוג = 750₪</small>
        </div>

        <div class="card" style="background: rgba(0,0,0,0.2); border: 1px solid #444; text-align:center;">
            <h4 style="margin:0 0 10px 0;">🃏 גבוה או נמוך</h4>
            <p>הקלף שיצא: <b id="card-val" style="font-size:20px; color:var(--yellow);">?</b></p>
            <div class="grid-2">
                <button class="action" onclick="playHiLo('hi')" style="background:var(--green); color:white;">יהיה גבוה מ-5</button>
                <button class="action" onclick="playHiLo('lo')" style="background:var(--red); color:white;">יהיה נמוך מ-5</button>
            </div>
            <small style="display:block; margin-top:5px; opacity:0.7;">הימור קבוע: 200₪ | זכייה: 400₪</small>
        </div>
    </div>`;
}

// לוגיקה: רולטה
function playRoulette(choice) {
    const amt = parseInt(document.getElementById('bet-roulette').value);
    if(!amt || amt <= 0 || money < amt) return showStatus("אין לך מספיק כסף להימור!", "red");
    
    money -= amt;
    const win = Math.random() > 0.55; // 45% סיכוי לזכות
    if(win) {
        const prize = amt * 2;
        money += prize;
        showStatus(`זכית ב-${prize}₪! המזל איתך.`, "green");
    } else {
        showStatus("הפסדת... אולי פעם הבאה.", "red");
    }
    updateUI(); saveGame();
}

// לוגיקה: מכונת מזל
function playSlots() {
    if(money < 500) return showStatus("חסר לך כסף לסלוטס!", "red");
    money -= 500;
    
    const icons = ['🍎', '💎', '🔔', '7️⃣', '🍒'];
    const r1 = icons[Math.floor(Math.random() * icons.length)];
    const r2 = icons[Math.floor(Math.random() * icons.length)];
    const r3 = icons[Math.floor(Math.random() * icons.length)];
    
    document.getElementById('slots-display').innerText = `${r1} ${r2} ${r3}`;
    
    if(r1 === r2 && r2 === r3) {
        money += 5000;
        showStatus("ג'קפוט! זכית ב-5,000₪!", "green");
    } else if(r1 === r2 || r2 === r3 || r1 === r3) {
        money += 750;
        showStatus("זוג! קיבלת 750₪", "blue");
    } else {
        showStatus("לא זכית הפעם.", "white");
    }
    updateUI(); saveGame();
}

// לוגיקה: קלפים
function playHiLo(guess) {
    if(money < 200) return showStatus("ההימור עולה 200₪", "red");
    money -= 200;
    
    const card = Math.floor(Math.random() * 10) + 1;
    document.getElementById('card-val').innerText = card;
    
    const isHi = card > 5;
    if((guess === 'hi' && isHi) || (guess === 'lo' && !isHi)) {
        money += 400;
        showStatus("צדקת! הרווחת 400₪", "green");
    } else {
        showStatus("טעות... הכסף הלך.", "red");
    }
    updateUI(); saveGame();
}
