/* Smart Money Pro - js/ui.js - v5.7.0 */

function openTab(tab) {
    // 1. עדכון ויזואלי של הכפתור הפעיל בתפריט
    document.querySelectorAll(".topbar button").forEach(b => b.classList.remove("active"));
    
    // מציאת הכפתור לפי ה-ID (למשל btnHome, btnWork)
    const btnId = "btn" + tab.charAt(0).toUpperCase() + tab.slice(1);
    const activeBtn = document.getElementById(btnId);
    if(activeBtn) activeBtn.classList.add("active");

    // 2. ניקוי התוכן הקיים והכנה להצגת הטאב החדש
    const contentArea = document.getElementById("content");
    contentArea.innerHTML = "";
    
    // 3. ניתוב לטאב המתאים
    switch(tab) {
        case 'home':
            drawHome(contentArea);
            break;
        case 'work':
            drawWork(contentArea); // נמצא ב-activities.js
            break;
        case 'tasks':
            drawCasino(contentArea); // נמצא ב-activities.js
            break;
        case 'invest':
            drawInvest(contentArea); // נמצא ב-economy.js
            break;
        case 'bank':
            drawBank(contentArea); // נמצא ב-economy.js
            break;
        case 'business':
        case 'realestate':
        case 'market':
        case 'skills':
        case 'cars':
            drawMarket(contentArea, tab); // נמצא ב-economy.js
            break;
        default:
            contentArea.innerHTML = `<div class="card">בקרוב...</div>`;
    }
    
    // גלילה לראש העמוד במעבר טאב
    window.scrollTo(0, 0);
}

// פונקציית דף הבית - מציגה נתונים מיד
function drawHome(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <h3>🏠 מרכז שליטה</h3>
            <div id="live-stats">
                <p>טוען נתונים...</p>
            </div>
            <hr style="opacity: 0.1; margin: 15px 0;">
            <div class="inventory-summary">
                <p><b>🎓 כישורים:</b> ${skills.length > 0 ? skills.join(", ") : "טרם נרכשו"}</p>
                <p><b>🚗 רכבים:</b> ${cars.length > 0 ? cars.join(", ") : "אין בבעלותך"}</p>
            </div>
            <div id="gift-container">
                </div>
        </div>
        
        <div class="card">
            <h4>💡 המלצה יומית</h4>
            <p id="daily-tip" style="font-size: 0.9em; opacity: 0.8;"></p>
        </div>
    `;
    
    // הפעלת הפונקציות המשלימות
    if(typeof renderGiftBtn === 'function') renderGiftBtn();
    if(typeof updateUI === 'function') updateUI();
    setDailyTip();
}

function setDailyTip() {
    const tips = [
        "השקעה בעסקים נותנת הכנסה פסיבית גבוהה יותר מנדל\"ן בטווח הקצר.",
        "אל תשכח להפקיד כסף בבנק כדי לצבור ריבית יומית!",
        "רכישת רכב משפרת משמעותית את המהירות שבה אתה מסיים עבודה.",
        "לימודי 'ניהול זמן' בטאב כישורים יתנו לך בונוס קבוע לכל הכנסה."
    ];
    const tipDiv = document.getElementById("daily-tip");
    if(tipDiv) tipDiv.innerText = tips[Math.floor(Math.random() * tips.length)];
}

// הפעלה ראשונית של טאב הבית בטעינת האפליקציה
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        openTab('home');
    }, 100);
});
