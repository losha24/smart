/* Smart Money Pro - js/economy.js - v5.7.1 */

// --- מאגרי נתונים מורחבים ---
const bzPool = [
    {n:"דוכן קפה", c:15000, p:12}, {n:"קיוסק", c:45000, p:40}, {n:"מכבסה", c:120000, p:110},
    {n:"פיצריה", c:350000, p:320}, {n:"מכון כושר", c:850000, p:850}, {n:"חנות בגדים", c:1200000, p:1300},
    {n:"מסעדה יוקרתית", c:2800000, p:3100}, {n:"אולם אירועים", c:5500000, p:6200},
    {n:"מרכז קניות", c:12000000, p:14500}, {n:"חברת הייטק", c:50000000, p:65000}
];

const rePool = [
    {n:"חניה", c:85000, p:40}, {n:"מחסן לוגיסטי", c:220000, p:120}, {n:"דירת סטודיו", c:750000, p:450},
    {n:"דירת 3 חדרים", c:1600000, p:1100}, {n:"דירת גג", c:3200000, p:2400}, {n:"וילה פרטית", c:6500000, p:5200},
    {n:"בניין משרדים", c:15000000, p:14000}, {n:"קניון אזורי", c:45000000, p:48000},
    {n:"מלון בוטיק", c:80000000, p:90000}, {n:"אי פרטי", c:250000000, p:320000}
];

const carPool = [
    {n:"קורקינט חשמלי", c:2500, s:1.1}, {n:"אופנוע 125 סמ\"ק", c:15000, s:1.3}, {n:"רכב משומש", c:45000, s:1.5},
    {n:"רכב משפחתי", c:140000, s:2}, {n:"ג'יפ עירוני", c:280000, s:2.5}, {n:"רכב חשמלי", c:450000, s:3},
    {n:"רכב יוקרה", c:850000, s:4}, {n:"מכונית ספורט", c:1800000, s:6}, {n:"רכב אספנות", c:3500000, s:8}, {n:"מטוס פרטי", c:15000000, s:15}
];

const mkPool = [
    {n:"סמארטפון חדש", c:4500}, {n:"מחשב גיימינג", c:12000}, {n:"טלוויזיה 85 אינץ'", c:18000},
    {n:"שעון יוקרה", c:55000}, {n:"ריהוט מעצבים", c:35000}, {n:"מקרר חכם", c:15000},
    {n:"קולנוע ביתי", c:85000}, {n:"בריכה בחצר", c:120000}, {n:"תכשיט יהלום", c:250000}, {n:"יצירת אמנות", c:1000000}
];

const skPool = [
    {n:"ניהול זמן", c:5000, s:0.2}, {n:"קורס מכירות", c:12000, s:0.5}, {n:"עזרה ראשונה", c:18000, s:0.8},
    {n:"רישיון נשק", c:25000, s:1.2}, {n:"תכנות בסיסי", c:45000, s:2}, {n:"ניהול השקעות", c:85000, s:4},
    {n:"תואר אקדמי", c:150000, s:8}, {n:"קורס יזמות", c:300000, s:15}, {n:"יחסי ציבור", c:650000, s:35}, {n:"מנהיגות עסקית", c:1500000, s:100}
];

// --- פונקציית שוק מאוחדת לכל הטאבים ---
function drawMarket(c, tab) {
    let list = [];
    if (tab === 'business') list = bzPool;
    else if (tab === 'realestate') list = rePool;
    else if (tab === 'market') list = mkPool;
    else if (tab === 'skills') list = skPool;
    else if (tab === 'cars') list = carPool;

    c.innerHTML = `<div class="grid-2 fade-in"></div>`;
    list.forEach(i => {
        const has = (tab === 'skills' && skills.includes(i.n)) || (tab === 'cars' && cars.includes(i.n));
        const canAfford = money >= i.c;
        let btnClass = has ? 'disabled' : (!canAfford ? 'no-money' : '');
        let action = has ? '' : (canAfford ? `executeBuy('${tab}', '${i.n}', ${i.c}, ${i.p||i.s||0})` : `showMsg('אין מספיק כסף!', 'var(--red)')`);

        c.querySelector(".grid-2").innerHTML += `
            <div class="card">
                <b>${i.n}</b><br><small>${i.c.toLocaleString()}₪</small>
                <button class="action ${btnClass}" onclick="${action}">${has ? 'בבעלותך' : 'קנה'}</button>
            </div>`;
    });
}

// --- בנק עם אפשרות הלוואה ---
function drawBank(c) {
    c.innerHTML = `
        <div class="card fade-in">
            <h3>🏦 ניהול בנק</h3>
            <p>יתרה: <b>${bank.toLocaleString()}₪</b></p>
            <p>חוב הלוואה: <b style="color:var(--red)">${loan.toLocaleString()}₪</b></p>
            <div class="grid-2">
                <button class="action" onclick="bankAction('dep')">הפקד 1K</button>
                <button class="action" onclick="bankAction('wd')">משוך 1K</button>
            </div>
            <hr>
            <h4>הלוואות</h4>
            <div class="grid-2">
                <button class="action" style="background:#6366f1" onclick="takeLoan()">קח הלוואה (10K)</button>
                <button class="action" style="background:#ec4899" onclick="payLoan()">החזר הלוואה (10K)</button>
            </div>
            <p><small>* ריבית הלוואה: 5% בכל הפקדה/משיכה.</small></p>
        </div>`;
}

function takeLoan() {
    loan += 10000;
    money += 10000;
    showMsg("לקחת הלוואה של 10,000₪", "var(--blue)");
    updateUI(); openTab('bank');
}

function payLoan() {
    if (money >= 10500 && loan >= 10000) {
        money -= 10500;
        loan -= 10000;
        showMsg("החזרת 10,000₪ + ריבית", "var(--green)");
    } else {
        showMsg("אין מספיק כסף להחזר!", "var(--red)");
    }
    updateUI(); openTab('bank');
}
