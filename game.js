const VERSION = "3.1.2";

// מנגנון עדכון וניקוי
if(localStorage.appVersion !== VERSION) {
    localStorage.clear();
    localStorage.appVersion = VERSION;
}

let money = Number(localStorage.money) || 100;
let bank = Number(localStorage.bank) || 0;
let xp = Number(localStorage.xp) || 0;
let level = Number(localStorage.level) || 1;
let passive = Number(localStorage.passive) || 0;
let myItems = JSON.parse(localStorage.myItems || "[]");
let working = false;

// שוק מורחב (המלצה 5)
const marketItems = [
    {id: 1, name: "נעלי עבודה", price: 300, type: "bonus", desc: "+20% שכר", val: 1.2},
    {id: 2, name: "קורס כלכלה", price: 1000, type: "bonus", desc: "+50% XP", val: 1.5},
    {id: 3, name: "משרד ביתי", price: 5000, type: "passive", desc: "+20 הכנסה פסיבית", val: 20},
    {id: 4, name: "דירת 3 חדרים", price: 25000, type: "passive", desc: "+150 הכנסה פסיבית", val: 150},
    {id: 5, name: "רכב ספורט", price: 100000, type: "luxury", desc: "סמל סטטוס (ליופי)", val: 0}
];

// אירועים אקראיים (המלצה 2)
function triggerRandomEvent() {
    const events = [
        {text: "מצאת שטר של 100₪ על המדרכה!", val: 100, type: 'gain'},
        {text: "קיבלת החזר מס מפתיע: 500₪", val: 500, type: 'gain'},
        {text: "אופס! קיבלת דוח מהעירייה: 250₪-", val: -250, type: 'loss'},
        {text: "השקעה ישנה הניבה פרי: 1000₪", val: 1000, type: 'gain'},
        {text: "הטלפון נשבר, תיקון עלה 400₪-", val: -400, type: 'loss'}
    ];
    
    if (Math.random() < 0.3) { // 30% סיכוי לאירוע בכל פעימה
        const ev = events[Math.floor(Math.random() * events.length)];
        money += ev.val;
        if (money < 0) money = 0;
        message("📢 אירוע: " + ev.text, ev.type === 'gain' ? 'event' : 'loss');
        updateUI();
    }
}
setInterval(triggerRandomEvent, 60000); // בדיקה כל דקה

function updateUI() {
    document.getElementById("money").innerText = Math.floor(money).toLocaleString() + "₪";
    document.getElementById("bank").innerText = Math.floor(bank).toLocaleString() + "₪";
    document.getElementById("level").innerText = level;
    document.getElementById("passive").innerText = passive + "₪";
    
    document.getElementById("xpfill").style.width = (xp % 100) + "%";
    save();
}

function save() {
    localStorage.money = money;
    localStorage.bank = bank;
    localStorage.xp = xp;
    localStorage.level = level;
    localStorage.passive = passive;
    localStorage.myItems = JSON.stringify(myItems);
}

function message(t, className = '') {
    const msg = document.getElementById("message");
    msg.innerText = t;
    msg.className = className;
}

// לוגיקת שוק משופרת
function marketPage() {
    let html = "<h3>חנות ושדרוגים</h3>";
    marketItems.forEach(item => {
        const isOwned = myItems.some(it => it.id === item.id);
        html += `
            <button class="action ${isOwned ? 'disabled' : ''}" onclick="buyItem(${item.id})">
                ${item.name} | ${item.price.toLocaleString()}₪
                <div style="font-size:12px; font-weight:normal;">${item.desc}</div>
            </button>`;
    });
    
    html += "<hr><h4>הנכסים שלי</h4><div class='inventory'>";
    myItems.forEach(it => html += `<span class='item-tag'>💎 ${it.name}</span>`);
    html += "</div>";
    
    document.getElementById("content").innerHTML = html;
}

function buyItem(id) {
    if (myItems.some(it => it.id === id)) return;
    const item = marketItems.find(it => it.id === id);
    if (money < item.price) return message("אין לך מספיק כסף!", "loss");

    money -= item.price;
    myItems.push(item);
    if (item.type === "passive") passive += item.val;
    
    updateUI();
    marketPage();
    message("תתחדש! רכשת " + item.name, "gain");
}

// פונקציות נוספות (כמו startWork, invest וכו') נשארות מהגרסה הקודמת עם התאמות קלות ל-UI
// ... (המשך פונקציות מהגרסה הקודמת)

function checkUpdate() {
    message("בודק עדכונים...", "event");
    fetch("version.json?t=" + Date.now()).then(r => r.json()).then(v => {
        if(v.version !== VERSION) {
            if(navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage("SKIP_WAITING");
            }
            localStorage.clear();
            alert("גרסה חדשה הותקנה! האפליקציה תתרענן.");
            location.reload();
        } else {
            message("הגרסה מעודכנת!", "gain");
        }
    });
}

// הפעלה ראשונית
updateUI();
openTab('home');
