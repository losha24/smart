/* Smart Money Pro - js/activities.js - v5.7.0 */

// מאגר הכישורים (Skills)
const skPool = [
    {n:"ניהול זמן", c:5000, s:0.2},
    {n:"נשק (אבטחה)", c:12000, s:0.5},
    {n:"עזרה ראשונה", c:18000, s:0.8},
    {n:"ניהול צוות", c:35000, s:1.2},
    {n:"תכנות JS", c:60000, s:2.5},
    {n:"כלכלה מתקדמת", c:120000, s:5}
];

// --- לוגיקת עבודה אקטיבית עם בר התקדמות ---
let working = false;

function drawWork(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <h3>⚒️ עבודה אקטיבית</h3>
            <p>לחץ כדי להתחיל משמרת ולהרוויח כסף.</p>
            <div class="progress-container">
                <div id="work-progress" class="progress-bar"></div>
            </div>
            <p><small>מהירות נוכחית: x${carSpeed.toFixed(1)} (בונוס רכב)</small></p>
            <button class="action" id="work-btn" onclick="startWork()">
                התחל עבודה (150₪)
            </button>
        </div>
        <div class="card">
            <h3>💡 טיפ מהיר</h3>
            <p style="font-size: 0.9em; opacity: 0.8;">רכישת רכב בחנות תשפר את מהירות מילוי הבר ותאפשר לך להרוויח יותר כסף בפחות זמן!</p>
        </div>`;
}

function startWork() {
    if (working) return;
    working = true;
    
    const btn = document.getElementById("work-btn");
    const bar = document.getElementById("work-progress");
    if (btn) btn.disabled = true;
    
    let width = 0;
    // המהירות מושפעת מהרכב שברשות המשתמש
    const speedMultiplier = 1.5 * carSpeed; 
    
    let interval = setInterval(() => {
        width += speedMultiplier;
        if (bar) bar.style.width = width + "%";
        
        if (width >= 100) {
            clearInterval(interval);
            working = false;
            if (bar) bar.style.width = "0%";
            if (btn) btn.disabled = false;
            
            // מתן תגמול
            money += 150;
            totalEarned += 150;
            showMsg("הרווחת 150₪ על עבודה!", "var(--green)");
            updateUI();
        }
    }, 50);
}

// --- לוגיקת מתנה יומית (כל 4 שעות) ---
function renderGiftBtn() {
    const container = document.getElementById("gift-container");
    if (!container) return;
    
    const now = Date.now();
    const waitTime = 4 * 60 * 60 * 1000; // 4 שעות
    const diff = now - lastGift;

    if (diff < waitTime) {
        // חישוב זמן נותר להצגה
        const remainingMs = waitTime - diff;
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        
        container.innerHTML = `
            <button class="action no-money" disabled style="font-size: 12px;">
                🎁 זמין עוד ${hours}ש' ו-${minutes}ד'
            </button>`;
    } else {
        container.innerHTML = `
            <button class="action" onclick="claimGift()">
                🎁 קבל מתנה (2,000₪)
            </button>`;
    }
}

function claimGift() {
    lastGift = Date.now();
    money += 2000;
    totalEarned += 2000;
    showMsg("בונוס של 2,000₪ נוסף לחשבון!", "var(--green)");
    updateUI();
    renderGiftBtn(); // רינדור מחדש למצב חסום
}

// --- לוגיקת קזינו (במקום משימות) ---
function drawCasino(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <h3>🎰 קזינו הכל או כלום</h3>
            <p>המר על 500₪. יש לך סיכוי של 40% לשלש את הכסף!</p>
            <hr>
            <div id="casino-result" style="margin-bottom: 10px; font-weight: bold; min-height: 20px;"></div>
            <button class="action ${money < 500 ? 'no-money' : ''}" onclick="playCasino()">
                סובב את המזל (500₪)
            </button>
        </div>
        <div class="card" style="opacity: 0.7;">
            <p><small>*ההימורים במשחק הם בכסף וירטואלי בלבד.</small></p>
        </div>`;
}

function playCasino() {
    if (money < 500) {
        return showMsg("אין לך מספיק כסף להמר!", "var(--red)");
    }
    
    money -= 500;
    totalSpent += 500;
    const resultDiv = document.getElementById("casino-result");
    
    // סיכוי של 40% לזכייה
    const isWin = Math.random() < 0.4;
    
    if (isWin) {
        const winAmount = 1500;
        money += winAmount;
        totalEarned += winAmount;
        if (resultDiv) {
            resultDiv.innerText = "🎊 זכית ב-1,500₪! 🎊";
            resultDiv.style.color = "var(--green)";
        }
        showMsg("זכייה מטורפת!", "var(--green)");
    } else {
        if (resultDiv) {
            resultDiv.innerText = "💔 אולי בפעם הבאה...";
            resultDiv.style.color = "var(--red)";
        }
        showMsg("הפסדת 500₪", "var(--red)");
    }
    
    updateUI();
    // עדכון כפתור הקזינו אם נגמר הכסף
    const casinoBtn = document.querySelector(".card .action");
    if (money < 500 && casinoBtn) {
        casinoBtn.classList.add("no-money");
    }
}

// לוגיקה ללמידת כישורים (Skills)
function learn(n, c, p) {
    if (money >= c && !skills.includes(n)) {
        money -= c;
        totalSpent += c;
        skills.push(n);
        passive += p; // כישורים נותנים בונוס פסיבי קטן
        showMsg(`למדת ${n}!`, "var(--blue)");
        updateUI();
        openTab('skills');
    }
}
