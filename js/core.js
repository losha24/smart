/* Smart Money Pro - js/core.js - v5.7.6 */

// פונקציית טעינה בטוחה מה-LocalStorage
const load = (k, d) => { 
    try { 
        const s = localStorage.getItem(k); 
        return s !== null ? JSON.parse(s) : d; 
    } catch(e) { 
        console.error("Error loading " + k, e);
        return d; 
    } 
};

// אתחול משתנים (מבוסס על הזיכרון המקומי או ערכי ברירת מחדל)
let money = load('money', 5000);
let bank = load('bank', 0);
let passive = load('passive', 0);
let loan = load('loan', 0);
let lastGift = load('lastGift', 0);
let theme = load('theme', 'dark');
let skills = load('skills', []);
let inventory = load('inventory', []);
let cars = load('cars', []);
let totalEarned = load('totalEarned', 5000);
let totalSpent = load('totalSpent', 0);
let carSpeed = load('carSpeed', 1);
let lifeXP = load('lifeXP', 0); // מערכת רמת חיים חדשה
let invOwned = load('invOwned', { AAPL:0, TSLA:0, NVDA:0, BTC:0, GOOG:0, AMZN:0, MSFT:0, NFLX:0, META:0, ELAL:0 });

// שמירת כל הנתונים בבת אחת
function save() {
    const data = { 
        money, bank, passive, loan, lastGift, theme, 
        skills, inventory, totalEarned, totalSpent, 
        invOwned, cars, carSpeed, lifeXP 
    };
    Object.keys(data).forEach(key => {
        localStorage.setItem(key, JSON.stringify(data[key]));
    });
}

// עדכון ממשק המשתמש (UI)
function updateUI() {
    // חישוב רמה: כל 5,000 XP עולים רמה
    const level = Math.floor(lifeXP / 5000) + 1;
    
    if(document.getElementById("money")) document.getElementById("money").innerText = Math.floor(money).toLocaleString();
    if(document.getElementById("bank")) document.getElementById("bank").innerText = Math.floor(bank).toLocaleString();
    if(document.getElementById("life-level-ui")) document.getElementById("life-level-ui").innerText = level;
    
    // החלת ערכת נושא
    document.getElementById("app-body").className = theme + "-theme";
    
    save(); // שמירה אוטומטית בכל עדכון UI
}

// הודעות סטטוס קופצות
function showMsg(t, c = "var(--blue)") {
    const b = document.getElementById("status-bar");
    if(b) { 
        b.innerText = t; 
        b.style.color = c; 
        b.style.opacity = "1"; 
        setTimeout(() => b.style.opacity = "0", 3000); 
    }
}

// אירועים אקראיים (פעם ב-45 שניות בממוצע)
function triggerRandomEvent() {
    if (Math.random() > 0.2) return;
    const events = [
        { t: "מצאת שטר של 200₪ ברחוב!", v: 200, c: "var(--green)" },
        { t: "דו\"ח חניה: 250₪", v: -250, c: "var(--red)" },
        { t: "קיבלת החזר מס: 1,200₪", v: 1200, c: "var(--green)" },
        { t: "קנית קפה ומאפה: 45₪", v: -45, c: "var(--red)" }
    ];
    const e = events[Math.floor(Math.random() * events.length)];
    money += e.v; 
    if(money < 0) money = 0;
    showMsg(e.t, e.c); 
    updateUI();
}

// פונקציות מערכת
function resetGame() { 
    if(confirm("האם לאפס את כל התקדמות המשחק? (לא ניתן לבטל)")) { 
        localStorage.clear(); 
        location.reload(true); 
    } 
}

function forceUpdate() { 
    if(confirm("לרענן ולבדוק אם יש עדכונים חדשים?")) {
        location.reload(true); 
    }
}

function toggleTheme() { 
    theme = (theme === 'dark' ? 'light' : 'dark'); 
    updateUI(); 
}

// לופים של המערכת
setInterval(() => { 
    if(passive > 0) { 
        money += (passive / 10); 
        updateUI(); 
    } 
}, 100); // הכנסה פסיבית כל עשירית שנייה

setInterval(triggerRandomEvent, 45000); // אירוע אקראי כל 45 שניות

// הפעלה ראשונית
document.addEventListener("DOMContentLoaded", updateUI);
