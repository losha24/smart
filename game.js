const VERSION = "3.2.6";

// מאגרי פריטים גדולים להחלפה
const itemPool = [
    { n: "אוזניות", price: 500, p: 5 }, { n: "טאבלט", price: 2500, p: 40 },
    { n: "טלוויזיה 4K", price: 6000, p: 100 }, { n: "שעון חכם", price: 1200, p: 15 },
    { n: "מכונת קפה", price: 3000, p: 50 }, { n: "קורקינט", price: 4500, p: 70 }
];

const propertyPool = [
    { n: "מחסן קטן", cost: 5000, p: 30 }, { n: "דוכן רחוב", cost: 15000, p: 100 },
    { n: "דירת סטודיו", cost: 65000, p: 450 }, { n: "דירת 4 חדרים", cost: 220000, p: 1300 },
    { n: "חנות בגדים", cost: 400000, p: 2500 }, { n: "מגרש חניה", cost: 100000, p: 700 }
];

const taskPool = [
    { desc: "בצע 10 עבודות", goal: 10, type: "work", reward: 800, xp: 80 },
    { desc: "צבור 5,000₪ מזומן", goal: 5000, type: "cash", reward: 1000, xp: 100 },
    { desc: "הפקד 2,000₪ בבנק", goal: 2000, type: "bank", reward: 500, xp: 50 },
    { desc: "קנה 2 נכסים", goal: 2, type: "prop", reward: 1500, xp: 120 }
];

// משתני תצוגה נוכחיים (מה שמוצג למשתמש כרגע)
let currentMarket = JSON.parse(localStorage.currentMarket || "[]");
let currentProperties = JSON.parse(localStorage.currentProperties || "[]");

function initPools() {
    if (currentMarket.length === 0) currentMarket = itemPool.slice(0, 3);
    if (currentProperties.length === 0) currentProperties = propertyPool.slice(0, 3);
    if (activeTasks.length === 0) activeTasks = taskPool.slice(0, 3);
}

// פונקציית החלפה אוטומטית
function replaceItem(type, index) {
    let pool = type === 'market' ? itemPool : (type === 'prop' ? propertyPool : taskPool);
    let currentList = type === 'market' ? currentMarket : (type === 'prop' ? currentProperties : activeTasks);
    
    let newItem;
    do {
        newItem = pool[Math.floor(Math.random() * pool.length)];
    } while (currentList.some(item => item.n === newItem.n || item.desc === newItem.desc));
    
    currentList[index] = newItem;
    save();
}

function buyItem(index) {
    const i = currentMarket[index];
    if (money < i.price) return message("אין לך מספיק כסף!", "loss");
    money -= i.price;
    myItems.push(i);
    passive += i.p;
    message(`קנית ${i.n}! פריט חדש נכנס לשוק.`, "gain");
    
    replaceItem('market', index); // החלפה מיידית
    updateUI();
    openTab('market');
}

function buyProperty(index) {
    const p = currentProperties[index];
    if (money < p.cost) return message("אין לך מספיק כסף!", "loss");
    money -= p.cost;
    myProperties.push(p);
    passive += p.p;
    message(`רכשת ${p.n}! נכס חדש זמין למכירה.`, "gain");
    
    replaceItem('prop', index); // החלפה מיידית
    updateUI();
    openTab('realestate');
}

function finishTask(index) {
    const t = activeTasks[index];
    money += t.reward;
    addXP(t.xp);
    message(`משימה הושלמה! בונוס: ${t.reward}₪. משימה חדשה הופיעה.`, "gain");
    
    replaceItem('task', index); // החלפה מיידית
    updateUI();
    openTab('tasks');
}

// עדכון פונקציית השמירה כדי לכלול את המלאי הנוכחי
function save() {
    localStorage.money = money;
    localStorage.bank = bank;
    localStorage.xp = xp;
    localStorage.level = level;
    localStorage.passive = passive;
    localStorage.totalWorkDone = totalWorkDone;
    localStorage.myProperties = JSON.stringify(myProperties);
    localStorage.myItems = JSON.stringify(myItems);
    localStorage.activeTasks = JSON.stringify(activeTasks);
    localStorage.currentMarket = JSON.stringify(currentMarket);
    localStorage.currentProperties = JSON.stringify(currentProperties);
    localStorage.appVersion = VERSION;
}

// בשליפה הראשונית (DOMContentLoaded)
document.addEventListener("DOMContentLoaded", () => {
    initPools();
    updateUI();
    openTab('home');
});
