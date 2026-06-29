/* Smart Money Pro - js/activities.js - v9.0.0 - Full Update + Staff System (No Stocks) */

// ── נתונים ─────────────────────────────────────────────────

const jobList = [
    { id: 'j1',  name: 'מנקה',        pay: 55,   xp: 20,   time: 3000,  icon: '🧹' },
    { id: 'j2',  name: 'שליח',        pay: 95,   xp: 45,   time: 5000,  icon: '🛵' },
    { id: 'j3',  name: 'מאבטח',       pay: 145,  xp: 65,   time: 8000,  icon: '🏢' },
    { id: 'j4',  name: 'מאבטח חמוש', pay: 290,  xp: 140,  time: 10000, icon: '🔫', req: 'רישיון נשק' },
    { id: 'j5',  name: 'נהג מונית',   pay: 340,  xp: 110,  time: 12000, icon: '🚕', reqCar: true },
    { id: 'j6',  name: 'סוהר',        pay: 420,  xp: 190,  time: 14000, icon: '👮', req: 'קורס פיקודי' },
    { id: 'j7',  name: 'נהג משאית',   pay: 650,  xp: 250,  time: 16000, icon: '🚛', req: 'רישיון משאית', reqCar: true },
    { id: 'j8',  name: 'מתכנת PWA',   pay: 900,  xp: 480,  time: 20000, icon: '💻', req: 'תכנות' },
    { id: 'j9',  name: 'מנהל רשת',    pay: 1750, xp: 850,  time: 25000, icon: '🌐', req: 'ניהול רשת' },
    { id: 'j10', name: 'ארכיטקט',     pay: 3500, xp: 1500, time: 35000, icon: '🏛️', req: 'ניהול טכנולוגי' }
];

const estateList = [
    { id: 'e1', name: 'מחסן להשכרה',  price: 15000,    passive: 2,    icon: '📦', desc: 'שטח אחסון קטן לסחורה' },
    { id: 'e2', name: 'חניה במרכז',   price: 45000,    passive: 6,    icon: '🅿️', desc: 'נדל"ן מבוקש בלב העיר' },
    { id: 'e3', name: 'דירת סטודיו',  price: 150000,   passive: 16,   icon: '🏠', desc: 'דירה קטנה ליחיד' },
    { id: 'e4', name: 'דירת 4 חדרים', price: 320000,   passive: 35,   icon: '🏡', desc: 'נכס למשפחה צעירה' },
    { id: 'e5', name: 'חנות ברחוב',   price: 450000,   passive: 53,   icon: '🏪', desc: 'מיקום מסחרי אסטרטגי' },
    { id: 'e6', name: 'וילה עם בריכה',price: 1200000,  passive: 142,  icon: '🏰', desc: 'נכס יוקרה למעמד הגבוה' },
    { id: 'e7', name: 'בניין מגורים', price: 2500000,  passive: 308,  icon: '🏢', desc: 'השקעה מניבה לטווח ארוך' },
    { id: 'e8', name: 'מרכז מסחרי',   price: 12000000, passive: 1583, icon: '🏗️', desc: 'קניון ענק עם עשרות חנויות' }
];

const businessList = [
    { id: 'biz_gum',    name: 'מכונת מסטיקים', price: 1200,     passive: 0.5,  icon: '🍬' },
    { id: 'biz_lemon',  name: 'דוכן לימונדה',  price: 4500,     passive: 1.5,  icon: '🍋' },
    { id: 'biz_hotdog', name: 'דוכן נקניקיות', price: 9000,     passive: 3,    icon: '🌭' },
    { id: 'biz_stand',  name: 'דוכן פיצוחים',  price: 15000,    passive: 2.7,  icon: '🥜' },
    { id: 'biz_kiosk',  name: 'קיוסק שכונתי',  price: 45000,    passive: 9.3,  icon: '🏪' },
    { id: 'biz_falafel',name: 'דוכן פלאפל',    price: 85000,    passive: 21.7, icon: '🥙' },
    { id: 'biz_cafe',   name: 'בית קפה',        price: 250000,   passive: 70,   icon: '☕' },
    { id: 'biz_garage', name: 'מוסך רכב',       price: 650000,   passive: 193,  icon: '🔧' },
    { id: 'biz_hall',   name: 'אולם אירועים',   price: 2200000,  passive: 800,  icon: '🎊' },
    { id: 'biz_tech',   name: 'חברת הייטק',     price: 12000000, passive: 5000, icon: '🚀' }
];

const shopItems = [
    { id: 's1',  name: 'חולצת טי פשוטה',    price: 150,   xp: 25,    icon: '👕' },
    { id: 's2',  name: 'ג\'ינס אופנתי',       price: 450,   xp: 70,    icon: '👖' },
    { id: 's3',  name: 'נעלי ספורט',          price: 850,   xp: 130,   icon: '👟' },
    { id: 's4',  name: 'זקט עור',             price: 2200,  xp: 350,   icon: '🧥' },
    { id: 's5',  name: 'שעון חכם',            price: 3500,  xp: 550,   icon: '⌚' },
    { id: 's6',  name: 'משקפי שמש יוקרתיים', price: 1800,  xp: 280,   icon: '🕶️' },
    { id: 's7',  name: 'חליפת עסקים',         price: 6000,  xp: 1000,  icon: '👔' },
    { id: 's8',  name: 'תיק מעצבים',          price: 12000, xp: 2000,  icon: '👜' },
    { id: 's9',  name: 'טבעת יהלום',          price: 45000, xp: 8000,  icon: '💎' },
    { id: 's10', name: 'שעון רולקס זהב',      price: 85000, xp: 15000, icon: '👑' }
];

const skillList = [
    { name: 'רישיון נשק',     price: 4500,   icon: '🔫' },
    { name: 'תכנות',          price: 10000,  icon: '📜' },
    { name: 'רישיון משאית',   price: 12000,  icon: '🚛' },
    { name: 'קורס פיקודי',    price: 14500,  icon: '🎖️' },
    { name: 'ניהול רשת',      price: 22000,  icon: '🧠' },
    { name: 'שיווק דיגיטלי',  price: 28000,  icon: '📢' },
    { name: 'ניהול טכנולוגי', price: 45000,  icon: '🚀' },
    { name: 'תואר בכלכלה',    price: 120000, icon: '🎓' }
];

const carList = [
    { name: 'קורקינט',      price: 3000,     speed: 0.2, icon: '🛴' },
    { name: 'אופנוע',       price: 16000,    speed: 0.6, icon: '🛵' },
    { name: 'סקודה',        price: 90000,    speed: 1.3, icon: '🚗' },
    { name: 'גיפ מרצדס',   price: 450000,   speed: 2.8, icon: '🚙' },
    { name: 'טסלה S',       price: 280000,   speed: 3.5, icon: '⚡' },
    { name: 'משאית וולוו',  price: 550000,   speed: 0.8, icon: '🚛' },
    { name: 'פרארי',        price: 1800000,  speed: 7,   icon: '🏎️' },
    { name: 'מטוס פרטי',   price: 15000000, speed: 24,  icon: '🛩️' }
];

const staffList = [
    { id: 'st1', name: 'מנקה משרדים',   price: 500,      passive: 2,      icon: '🧹', desc: 'עובד בסיסי' },
    { id: 'st2', name: 'קופאי',          price: 2000,     passive: 8,      icon: '🏧', desc: 'מטפל בתשלומים' },
    { id: 'st3', name: 'מוכר',           price: 8000,     passive: 30,     icon: '🛍️', desc: 'מגדיל מכירות' },
    { id: 'st4', name: 'חשב',            price: 25000,    passive: 90,     icon: '📊', desc: 'מייעל הוצאות' },
    { id: 'st5', name: 'מנהל משמרת',    price: 80000,    passive: 280,    icon: '👔', desc: 'מנהל צוות' },
    { id: 'st6', name: 'מנהל שיווק',    price: 250000,   passive: 850,    icon: '📢', desc: 'מגדיל הכנסות' },
    { id: 'st7', name: 'מנכ"ל',         price: 800000,   passive: 2800,   icon: '💼', desc: 'מנהל כולל' },
    { id: 'st8', name: 'צוות הייטק',    price: 2500000,  passive: 9000,   icon: '💻', desc: 'אוטומציה מלאה' },
    { id: 'st9', name: 'יועץ חיצוני',   price: 5500000,  passive: 30000,  icon: '🌐', desc: 'קשרים בינלאומיים' },
    { id: 'st10',name: 'תאגיד עסקי',    price: 18000000, passive: 120000, icon: '🏢', desc: 'אימפריה שלמה' }
];

// ── אתחולים ────────────────────────────────────────────────
if (window.bankTaxRate === undefined) window.bankTaxRate = 0.01;
if (!window.itemLevels)   window.itemLevels   = {};
if (!window.carLevels)    window.carLevels    = {};
if (!window.estateData)   window.estateData   = {};
if (!window.invBuyPrice)  window.invBuyPrice  = {};
if (!window.staffData)    window.staffData    = {};

// ── תשלום חכם: מזומן + בנק ──────────────────────────────
// מנסה לשלם סכום: קודם ממזומן, אחר כך מבנק אם חסר.
// מחזיר true אם הצליח, false אם אין מספיק גם ביחד.
function spendMoney(amount) {
    if (window.money >= amount) {
        window.money -= amount;
        return true;
    }
    var fromBank = amount - window.money;
    if (window.bank >= fromBank) {
        window.bank -= fromBank;
        window.money = 0;
        return true;
    }
    return false;
}

function canAfford(amount) {
    return (window.money + window.bank) >= amount;
}

// ── דף הבית ────────────────────────────────────────────────
window.drawHome = function(c) {
    var hasItem = function(id, name) { return window.inventory.includes(id) || window.inventory.includes(name); };
    var itemIcons = shopItems.filter(function(si) { return hasItem(si.id, si.name); })
        .map(function(si) { return '<span title="' + si.name + '" style="font-size:32px;background:rgba(255,255,255,0.05);padding:8px;border-radius:10px;display:inline-block;margin:4px;">' + si.icon + '</span>'; }).join('');
    var carIcons = carList.filter(function(car) { return window.cars.includes(car.name); })
        .map(function(car) { return '<span title="' + car.name + '" style="font-size:32px;background:rgba(255,255,255,0.05);padding:8px;border-radius:10px;display:inline-block;margin:4px;">' + car.icon + '</span>'; }).join('');
    var skillIcons = skillList.filter(function(sk) { return window.skills.includes(sk.name); })
        .map(function(sk) { return '<span title="' + sk.name + '" style="font-size:32px;background:rgba(255,255,255,0.05);padding:8px;border-radius:10px;display:inline-block;margin:4px;">' + sk.icon + '</span>'; }).join('');
    c.innerHTML = '<div class="fade-in"><h3 style="margin-bottom:15px;text-align:center;">🏠 מרכז שליטה אישי</h3>' +
        '<div class="card" style="margin-bottom:12px;border-right:4px solid var(--purple);"><div style="font-weight:bold;color:var(--purple);font-size:14px;margin-bottom:10px;">📦 ארון ציוד וחפצים</div><div style="display:flex;flex-wrap:wrap;gap:5px;min-height:45px;">' + (itemIcons || '<small style="opacity:0.4;">הארון ריק...</small>') + '</div></div>' +
        '<div class="card" style="margin-bottom:12px;border-right:4px solid var(--blue);"><div style="font-weight:bold;color:var(--blue);font-size:14px;margin-bottom:10px;">🏎️ החניה שלי</div><div style="display:flex;flex-wrap:wrap;gap:5px;min-height:45px;">' + (carIcons || '<small style="opacity:0.4;">אין רכבים בחניה</small>') + '</div></div>' +
        '<div class="card" style="border-right:4px solid var(--green);"><div style="font-weight:bold;color:var(--green);font-size:14px;margin-bottom:10px;">🎓 הסמכות וכישורים</div><div style="display:flex;flex-wrap:wrap;gap:5px;min-height:45px;">' + (skillIcons || '<small style="opacity:0.4;">טרם נרכשו כישורים</small>') + '</div></div>' +
        '</div>';
};

// ── עבודות ─────────────────────────────────────────────────
window.drawWork = function(c) {
    var totalSpeed = (window.carSpeed || 1);
    var html = '<h3>⚒️ מרכז תעסוקה</h3>' +
        '<div class="card" style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.3);padding:10px;margin-bottom:12px;text-align:center;font-size:12px;">⚡ מהירות כוללת: <b style="color:var(--blue);">x' + totalSpeed.toFixed(2) + '</b>' +
        (window.cars.length > 0 ? '&nbsp;|&nbsp; 🚗 ' + window.cars.length + ' רכב' + (window.cars.length > 1 ? 'ים' : '') : '') + '</div>' +
        '<div class="grid-2">';
    jobList.forEach(function(j) {
        var hasSkill = !j.req || window.skills.includes(j.req);
        var hasCar   = !j.reqCar || window.cars.length > 0;
        var canWork  = hasSkill && hasCar;
        html += '<div class="card fade-in" style="text-align:center;opacity:' + (canWork ? 1 : 0.6) + ';border-top:3px solid ' + (canWork ? 'var(--blue)' : '#444') + '">' +
            '<div style="font-size:26px;margin-bottom:5px;">' + j.icon + '</div>' +
            '<div style="font-weight:bold;font-size:13px;min-height:32px;">' + j.name + (j.req ? '<br><small style="color:var(--red);font-size:9px;">דרוש: ' + j.req + '</small>' : '') + '</div>' +
            '<div style="color:var(--green);font-size:12px;">' + j.pay.toLocaleString() + '₪</div>' +
            '<div style="color:var(--purple);font-size:10px;margin-bottom:8px;">+' + (j.pay * 0.005).toFixed(3) + '₪/ד\'</div>' +
            '<div id="prog-cont-' + j.id + '" style="display:none;width:100%;background:#1e293b;height:6px;border-radius:3px;margin-bottom:10px;overflow:hidden;"><div id="bar-' + j.id + '" style="width:0%;height:100%;background:var(--blue);transition:width linear;"></div></div>' +
            '<button class="sys-btn" id="job-' + j.id + '" style="width:100%;" onclick="startWork(\'' + j.id + '\')" ' + (canWork ? '' : 'disabled') + '>' + (canWork ? 'בצע עבודה' : 'נעול') + '</button></div>';
    });
    c.innerHTML = html + '</div>';
};

window.startWork = function(id) {
    var j = jobList.find(function(x) { return x.id === id; });
    if (!j) return;
    var btn       = document.getElementById('job-' + j.id);
    var container = document.getElementById('prog-cont-' + j.id);
    var bar       = document.getElementById('bar-' + j.id);
    var actualTime = j.time / (window.carSpeed || 1);
    if (btn) btn.disabled = true;
    if (container) container.style.display = 'block';
    setTimeout(function() { if (bar) { bar.style.transition = 'width ' + actualTime + 'ms linear'; bar.style.width = '100%'; } }, 50);
    setTimeout(function() {
        var passiveAdd = parseFloat((j.pay * 0.005).toFixed(3));
        var passiveCap = 500;
        window.money += j.pay;
        window.lifeXP += j.xp;
        if (window.jobPassive < passiveCap) {
            window.jobPassive = Math.min(passiveCap, window.jobPassive + passiveAdd);
        }
        window.passive += passiveAdd;
        showMsg('💰 +' + j.pay + '₪ | ✨ +' + j.xp + ' XP | 🚀 +' + passiveAdd.toFixed(3) + '₪/ד\'', 'var(--green)');
        if (btn) btn.disabled = false;
        if (container) container.style.display = 'none';
        if (bar) { bar.style.transition = 'none'; bar.style.width = '0%'; }
        updateUI(); saveGame();
    }, actualTime);
};

// ── נדל"ן ──────────────────────────────────────────────────
// ── נדל"ן ──────────────────────────────────────────────────
window.drawEstate = function(c) {
    if (!c) return;
    var totalEstatePassive = 0;

    // חישוב הכנסה פסיבית כוללת מכל הנדל"ן
    estateList.forEach(function(e) {
        var d = window.estateData[e.id] || { count: 0, level: 0 };
        if (d.count > 0) {
            // חישוב לפי הלוגיקה שלך: הכנסה מופחתת (75%) + בונוס שדרוג (20% לכל רמה)
            totalEstatePassive += (e.passive * 0.75) * d.count * (1 + (d.level || 0) * 0.20);
        }
    });

    var html = '<h3>🏠 אימפריית נדל"ן</h3>' +
        // תיבת הסיכום החדשה - תואמת לעסקים וצוות
        '<div class="card" style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.3);padding:12px;margin-bottom:12px;text-align:center;">' +
        '<div style="font-size:12px;opacity:0.7;margin-bottom:4px;">💰 סך הכנסה משכירות (נדל"ן)</div>' +
        '<div style="font-size:22px;font-weight:bold;color:var(--green);">' + totalEstatePassive.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + ' ₪/ד\'</div>' +
        '</div>' +
        '<div class="grid-2">';

    estateList.forEach(function(e) {
        var d = window.estateData[e.id] || { count: 0, level: 0 };
        var count = d.count || 0;
        var level = d.level || 0;
        
        var currentPrice = Math.floor(e.price * Math.pow(1.20, count));
        var totalPassive = (e.passive * 0.75 * count * (1 + level * 0.20)).toLocaleString();
        var upgradePrice = count > 0 ? Math.floor(e.price * Math.pow(1.8, level + 1)) : 0;

        var borderStyle = count > 0 ? 'border-top:4px solid var(--green)' : 'border-top:4px solid var(--border)';
        
        html += '<div class="card fade-in" style="text-align:center; display:flex; flex-direction:column; justify-content:space-between; ' + borderStyle + '; padding: 10px; min-height: 260px;">' +
            '<div>' +
                '<div style="font-size:30px; margin-bottom:4px;">' + e.icon + '</div>' +
                '<div style="font-weight:bold; font-size:13px; line-height:1.2;">' + e.name + '</div>' +
                '<div style="font-size:11px; color:var(--green); font-weight:bold;">' + totalPassive + ' ₪/ד\'</div>' +
                (count > 0 
                    ? '<div style="font-size:10px; color:var(--blue); margin:4px 0;">בבעלותך: ' + count + ' | רמה: ' + level + '</div>' 
                    : '<div style="font-size:10px; opacity:0.5; margin:4px 0;">טרם נרכש</div>') +
            '</div>' +
            '<div>' +
                '<button class="sys-btn" style="width:100%; margin-bottom:4px; font-weight:bold; padding:8px 2px; background:rgba(34,197,94,0.1); border-color:var(--green); color:var(--green);" onclick="buyEstate(\'' + e.id + '\')">' +
                    '<span style="margin-left:4px;">🔑</span> ' + currentPrice.toLocaleString() + '₪' +
                '</button>' +
                (count > 0 ? '<div style="display:flex; gap:4px;">' +
                    '<button class="sys-btn" style="flex:1; font-size:9px; padding:5px 2px; background:rgba(168,85,247,0.15); color:var(--purple); border-color:var(--purple);" onclick="upgradeEstate(\'' + e.id + '\')" title="שדרג">⬆️ ' + upgradePrice.toLocaleString() + '</button>' +
                    '<button class="sys-btn" style="flex:1; font-size:9px; padding:5px 2px; background:rgba(239,68,68,0.15); color:var(--red); border-color:var(--red);" onclick="sellEstate(\'' + e.id + '\')" title="מכור הכל">💰 מכור</button>' +
                '</div>' : '') +
            '</div>' +
        '</div>';
    });
    c.innerHTML = html + '</div>';
};



window.buyEstate = function(id) {
    var e = estateList.find(function(x) { return x.id === id; });
    if (!e) return;
    var d = window.estateData[id] || { count: 0, level: 0 };
    
    // מחיר עולה ב-20% על כל נכס קיים
    var pricePerOne = Math.floor(e.price * Math.pow(1.20, d.count || 0));

    if (!canAfford(pricePerOne)) return showMsg('אין מספיק כסף (גם בבנק)!', 'var(--red)');

    spendMoney(pricePerOne);
    // הכנסה פסיבית מוקטנת (75% מהמקור)
    var reducedPassive = e.passive * 0.75;

    window.estateData[id] = {
        count: (d.count || 0) + 1,
        level: d.level || 0
    };
    window.passive += reducedPassive;

    showMsg('🏠 רכשת ' + e.name, 'var(--green)');
    saveGame(); updateUI(); drawEstate(document.getElementById('content'));
};

window.upgradeEstate = function(id) {
    var e = estateList.find(function(x) { return x.id === id; });
    var d = window.estateData[id];
    if (!e || !d || d.count === 0) return;

    // מחיר שדרוג קופץ בפי 1.8 בכל רמה
    var upgradePrice = Math.floor(e.price * Math.pow(1.8, (d.level || 0) + 1));

    if (!canAfford(upgradePrice)) return showMsg('השיפוץ יקר (גם בבנק)!', 'var(--red)');

    // בונוס פסיבי מוקטן (20% תוספת במקום 50%)
    var bonusPassive = (e.passive * 0.75) * d.count * 0.20;

    spendMoney(upgradePrice);
    window.estateData[id].level = (d.level || 0) + 1;
    window.passive += bonusPassive;

    showMsg('⬆️ ' + e.name + ' רמה ' + window.estateData[id].level, 'var(--purple)');
    saveGame(); updateUI(); drawEstate(document.getElementById('content'));
};


window.sellEstate = function(id) {
    var e = estateList.find(function(x) { return x.id === id; });
    if (!e || !window.estateData[id] || window.estateData[id].count === 0) return;
    var eData     = window.estateData[id];
    var sellValue = Math.floor(e.price * eData.count * 0.7);
    var passiveLost = e.passive * eData.count * (1 + eData.level * 0.5);
    showConfirmModal('🏠 מכירת נכס',
        'מכור את כל ' + e.name + '?<br><br>✅ תקבל: <b>' + sellValue.toLocaleString() + '₪</b><br>❌ תאבד: <b>' + passiveLost.toFixed(1) + '₪/ד\'</b>',
        function() {
            window.money += sellValue;
            window.passive = Math.max(0, window.passive - passiveLost);
            window.estateData[id] = { count: 0, level: 0 };
            showMsg('💸 מכרת ' + e.name + ' ב-' + sellValue.toLocaleString() + '₪', 'var(--blue)');
            saveGame(); updateUI(); drawEstate(document.getElementById('content'));
        });
};

// ── עסקים ──────────────────────────────────────────────────
// ── עסקים ──────────────────────────────────────────────────
window.drawBusiness = function(c) {
    if (!c) return;
    var totalBizPassive = 0;
    
    // חישוב הכנסה פסיבית כוללת מכל העסקים שבאינוונטר
    businessList.forEach(function(b) {
        var level = window.inventory.filter(function(item) { return item === b.id; }).length;
        if (level > 0) {
            totalBizPassive += b.passive * level;
        }
    });

    var html = '<h3>💼 אימפריית עסקים</h3>' +
        // תיבת הסיכום החדשה
        '<div class="card" style="background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.3);padding:12px;margin-bottom:12px;text-align:center;">' +
        '<div style="font-size:12px;opacity:0.7;margin-bottom:4px;">💰 סך הכנסה פסיבית מעסקים</div>' +
        '<div style="font-size:22px;font-weight:bold;color:var(--purple);">' + totalBizPassive.toFixed(1) + ' ₪/ד\'</div>' +
        '</div>' +
        '<div class="grid-2">';

    businessList.forEach(function(b) {
        var level = window.inventory.filter(function(item) { return item === b.id; }).length;
        var currentPrice   = b.price * (level + 1);
        var currentPassive = (b.passive * level).toFixed(1);
        var sellValue      = level > 0 ? Math.floor(b.price * level * 0.7) : 0;

        html += '<div class="card fade-in" style="text-align:center; display:flex; flex-direction:column; justify-content:space-between; border-top:4px solid ' + (level > 0 ? 'var(--purple)' : '#444') + '; padding: 10px; min-height: 200px;">' +
            '<div>' +
                '<div style="font-size:35px;margin-bottom:10px;">' + b.icon + '</div>' +
                '<div style="font-weight:bold;font-size:14px;">' + b.name + (level > 0 ? ' <small>(רמה ' + level + ')</small>' : '') + '</div>' +
                '<div style="font-size:11px;color:var(--green);margin:5px 0;">פסיבי: ' + currentPassive + '₪/ד\'</div>' +
            '</div>' +
            '<div>' +
                '<button class="sys-btn" style="width:100%;margin-top:10px;" onclick="buyBusiness(\'' + b.id + '\',' + currentPrice + ',' + b.passive + ')">' + currentPrice.toLocaleString() + '₪</button>' +
                (level > 0 ? '<button class="sys-btn" style="width:100%;margin-top:5px;font-size:10px;background:rgba(239,68,68,0.15);color:var(--red);border-color:var(--red);" onclick="sellBusiness(\'' + b.id + '\')">💸 מכור (' + sellValue.toLocaleString() + '₪)</button>' : '') +
            '</div>' +
            '</div>';
    });
    c.innerHTML = html + '</div>';
};

window.buyBusiness = function(id, price, passAdd) {
    if (!canAfford(price)) return showMsg('אין מספיק כסף (גם בבנק)!', 'var(--red)');
    spendMoney(price); window.passive += passAdd; window.inventory.push(id);
    showMsg('💼 עסק שודרג! +' + passAdd.toFixed(1) + '₪/ד\'', 'var(--purple)');
    saveGame(); updateUI(); drawBusiness(document.getElementById('content'));
};

window.sellBusiness = function(id) {
    var b = businessList.find(function(x) { return x.id === id; });
    if (!b) return;
    var level = window.inventory.filter(function(item) { return item === id; }).length;
    if (level === 0) return;
    var sellValue  = Math.floor(b.price * level * 0.7);
    var passiveLost = b.passive * level;
    showConfirmModal('💸 מכירת עסק',
        'מכור את ' + b.name + ' (רמה ' + level + ')?<br><br>✅ תקבל: <b>' + sellValue.toLocaleString() + '₪</b><br>❌ תאבד: <b>' + passiveLost.toFixed(1) + '₪/ד\'</b>',
        function() {
            window.money += sellValue;
            window.passive = Math.max(0, window.passive - passiveLost);
            window.inventory = window.inventory.filter(function(item) { return item !== id; });
            showMsg('💸 מכרת ' + b.name + ' ב-' + sellValue.toLocaleString() + '₪', 'var(--blue)');
            saveGame(); updateUI(); drawBusiness(document.getElementById('content'));
        });
};

// ── בנק ────────────────────────────────────────────────────
window.drawBank = function(c) {
    var tax = (window.bankTaxRate * 100).toFixed(1);
    var loanLimit = 250000;
    c.innerHTML = '<div class="fade-in" style="max-width:400px;margin:auto;"><h3 style="text-align:center;margin-bottom:15px;">🏦 מרכז פיננסי</h3>' +
        '<div style="display:flex;gap:10px;margin-bottom:15px;">' +
        '<div class="card" style="flex:1;text-align:center;padding:10px;border-bottom:3px solid var(--blue);"><small style="opacity:0.6;display:block;font-size:10px;">יתרה בבנק</small><b style="color:var(--blue);font-size:16px;">' + window.bank.toLocaleString() + ' ₪</b></div>' +
        '<div class="card" style="flex:1;text-align:center;padding:10px;border-bottom:3px solid var(--red);"><small style="opacity:0.6;display:block;font-size:10px;">חוב פעיל</small><b style="color:var(--red);font-size:16px;">' + window.loan.toLocaleString() + ' ₪</b></div></div>' +
        '<div class="card" style="margin-bottom:15px;">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:10px;"><span style="font-size:12px;font-weight:bold;">ניהול מזומנים</span><span style="font-size:10px;color:var(--yellow);">עמלה: ' + tax + '%</span></div>' +
        '<input type="number" id="bank-amt" placeholder="סכום פעולה" style="width:100%;padding:10px;background:#000;color:#fff;border:1px solid #333;border-radius:6px;margin-bottom:10px;text-align:center;">' +
        '<div style="display:flex;gap:8px;"><button class="sys-btn" style="flex:1;background:#3b82f6;color:white;" onclick="bankProcess(\'deposit\')">הפקדה</button><button class="sys-btn" style="flex:1;background:#64748b;color:white;" onclick="bankProcess(\'withdraw\')">משיכה</button></div></div>' +
        '<div class="card" style="border-right:3px solid var(--yellow);">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:10px;"><span style="font-size:12px;font-weight:bold;color:var(--yellow);">הלוואות</span><span style="font-size:10px;opacity:0.6;">תקרה: ' + loanLimit.toLocaleString() + ' ₪</span></div>' +
        '<input type="number" id="loan-amt" placeholder="סכום הלוואה" style="width:100%;padding:10px;background:#000;color:var(--yellow);border:1px solid #444;border-radius:6px;margin-bottom:10px;text-align:center;">' +
        '<div style="display:grid;gap:8px;"><button class="action" style="background:#f59e0b;color:#000;font-weight:bold;border:none;" onclick="takeCustomLoan()">💰 קבל הלוואה</button><button class="action" style="background:#ef4444;color:#fff;font-weight:bold;border:none;" onclick="repayLoan()">✅ החזר חוב מהיר</button></div></div></div>';
};

window.bankProcess = function(mode) {
    var val = parseInt(document.getElementById('bank-amt').value);
    if (!val || val <= 0) return showMsg('נא להזין סכום תקין', 'var(--red)');
    var fee = val * window.bankTaxRate;
    if (mode === 'deposit') {
        if (window.money >= (val + fee)) { window.money -= (val + fee); window.bank += val; showMsg('הופקד בהצלחה!', 'var(--blue)'); }
        else return showMsg('אין מספיק מזומן', 'var(--red)');
    } else {
        if (window.bank >= val) { window.bank -= val; window.money += (val - fee); showMsg('נמשך בהצלחה!', 'var(--purple)'); }
        else return showMsg('אין מספיק יתרה', 'var(--red)');
    }
    saveGame(); updateUI(); drawBank(document.getElementById('content'));
};

window.takeCustomLoan = function() {
    var amt = parseInt(document.getElementById('loan-amt').value);
    if (!amt || amt <= 0) return showMsg('נא להזין סכום תקין', 'var(--red)');
    if (window.loan + amt > 250000) return showMsg('חריגה! מקסימום: 250,000₪', 'var(--red)');
    window.bankTaxRate += (amt / 10000) * 0.005;
    window.loan += amt; window.money += amt;
    showMsg('הלוואה אושרה!', 'var(--green)');
    saveGame(); updateUI(); drawBank(document.getElementById('content'));
};

window.repayLoan = function() {
    if (window.loan <= 0) return showMsg('אין חובות', 'var(--green)');
    var toPay = Math.min(window.money, window.loan);
    if (toPay <= 0) return showMsg('אין מזומן להחזר', 'var(--red)');
    window.money -= toPay; window.loan -= toPay;
    window.bankTaxRate = Math.max(0.01, window.bankTaxRate - 0.005);
    showMsg('שילמת ' + toPay.toLocaleString() + ' ₪', 'var(--green)');
    saveGame(); updateUI(); drawBank(document.getElementById('content'));
};

// ── חנות + שדרוגים ─────────────────────────────────────────
window.drawShop = function(c) {
    if (!window.itemLevels) window.itemLevels = {};
    var html = '<h3>🛒 חנות מותגים</h3><div class="grid-2">';
    shopItems.forEach(function(item) {
        var hasItem = window.inventory.includes(item.id) || window.inventory.includes(item.name);
        var level = (window.itemLevels && window.itemLevels[item.id]) ? window.itemLevels[item.id] : 0;
        var upgradePrice = Math.floor(item.price * 0.7 * (level + 1));
        html += '<div class="card fade-in" style="text-align:center;border:1px solid ' + (hasItem ? 'var(--green)' : 'var(--border)') + ';">' +
            '<div style="font-size:35px;margin-bottom:8px;">' + item.icon + '</div>' +
            '<div style="font-weight:bold;font-size:13px;">' + item.name + (level > 0 ? ' <small style="color:var(--yellow);">(רמה ' + level + ')</small>' : '') + '</div>' +
            '<button class="sys-btn" style="width:100%;margin-top:6px;margin-bottom:4px;" onclick="buyShopItem(\'' + item.id + '\')" ' + (hasItem ? 'disabled' : '') + '>' + (hasItem ? 'בבעלותך' : item.price.toLocaleString() + ' ₪') + '</button>' +
            (hasItem ? '<button class="sys-btn" style="width:100%;font-size:10px;background:rgba(245,158,11,0.15);color:var(--yellow);border-color:var(--yellow);" onclick="upgradeShopItem(\'' + item.id + '\')">⬆️ שדרג (' + upgradePrice.toLocaleString() + '₪)</button>' : '') +
            '</div>';
    });
    c.innerHTML = html + '</div>';
};

window.buyShopItem = function(id) {
    var item = shopItems.find(function(x) { return x.id === id; });
    if (!item) return;
    if (!canAfford(item.price)) return showMsg('חסרים ' + Math.ceil(item.price - (window.money + window.bank)).toLocaleString() + '₪', 'var(--red)');
    spendMoney(item.price); window.lifeXP += item.xp; window.inventory.push(item.id);
    if (!window.itemLevels) window.itemLevels = {};
    window.itemLevels[id] = 0;
    showMsg('👜 תתחדש! +' + item.xp + ' XP', 'var(--purple)');
    saveGame(); updateUI(); drawShop(document.getElementById('content'));
};

window.upgradeShopItem = function(id) {
    var item = shopItems.find(function(x) { return x.id === id; });
    if (!item) return;
    var level = (window.itemLevels && window.itemLevels[id]) ? window.itemLevels[id] : 0;
    var upgradePrice = Math.floor(item.price * 0.7 * (level + 1));
    if (!canAfford(upgradePrice)) return showMsg('חסר כסף לשדרוג (גם בבנק)!', 'var(--red)');
    var xpBonus = Math.floor(item.xp * 0.6);
    spendMoney(upgradePrice);
    window.itemLevels[id] = level + 1;
    window.lifeXP += xpBonus;
    showMsg('✨ ' + item.name + ' שודרג לרמה ' + window.itemLevels[id] + '! +' + xpBonus + ' XP', 'var(--yellow)');
    saveGame(); updateUI(); drawShop(document.getElementById('content'));
};


// ── כישורים ─────────────────────────────────────────────────
window.drawSkills = function(c) {
    var html = '<h3>🎓 מרכז הכשרה</h3><div class="grid-2">';
    skillList.forEach(function(s) {
        var has = window.skills.includes(s.name);
        html += '<div class="card" style="text-align:center;"><div style="font-size:28px;">' + s.icon + '</div>' +
            '<div style="font-size:12px;font-weight:bold;margin:5px 0;">' + s.name + '</div>' +
            '<button class="sys-btn" onclick="buySkill(\'' + s.name + '\',' + s.price + ')" ' + (has ? 'disabled' : '') + '>' + (has ? '✅ נלמד' : s.price.toLocaleString() + '₪') + '</button></div>';
    });
    c.innerHTML = html + '</div>';
};

window.buySkill = function(n, p) {
    if (!canAfford(p)) return showMsg('חסרים ' + Math.ceil(p - (window.money + window.bank)).toLocaleString() + '₪', 'var(--red)');
    spendMoney(p); window.skills.push(n);
    showMsg('🎓 למדת: ' + n + '!', 'var(--green)');
    saveGame(); updateUI(); drawSkills(document.getElementById('content'));
};

// ── רכבים + שדרוגים ─────────────────────────────────────────
window.drawCars = function(c) {
    if (!window.carLevels) window.carLevels = {};
    var totalSpeed = window.carSpeed || 1;
    var html = '<h3>🏎️ סוכנות רכב יוקרה</h3>' +
        '<div class="card" style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.3);padding:12px;margin-bottom:12px;text-align:center;">' +
        '<div style="font-size:12px;opacity:0.7;margin-bottom:4px;">⚡ מהירות עבודה כוללת</div>' +
        '<div style="font-size:22px;font-weight:bold;color:var(--blue);">x' + totalSpeed.toFixed(2) + '</div>' +
        '<div style="font-size:10px;opacity:0.5;margin-top:2px;">כל רכב ושדרוג מוסיפים למהירות</div></div>' +
        '<div class="grid-2">';
    carList.forEach(function(car) {
        var has   = window.cars.includes(car.name);
        var level = (window.carLevels && window.carLevels[car.name]) ? window.carLevels[car.name] : 0;
        var upgradePrice    = Math.floor(car.price * 0.8 * (level + 1));
        var currentCarSpeed = car.speed * (1 + level * 0.5);
        html += '<div class="card" style="text-align:center;border-top:3px solid ' + (has ? 'var(--green)' : 'var(--border)') + ';">' +
            '<div style="font-size:28px;">' + car.icon + '</div>' +
            '<div style="font-size:12px;font-weight:bold;margin:5px 0;">' + car.name + (level > 0 ? ' <small style="color:var(--yellow);">(רמה ' + level + ')</small>' : '') + '</div>' +
            '<div style="font-size:10px;color:var(--yellow);margin-bottom:6px;">+' + currentCarSpeed.toFixed(2) + 'x מהירות</div>' +
            '<button class="sys-btn" style="width:100%;margin-bottom:5px;" onclick="buyCar(\'' + car.name + '\',' + car.price + ')" ' + (has ? 'disabled' : '') + '>' + (has ? 'בבעלותך' : car.price.toLocaleString() + '₪') + '</button>' +
            (has ? '<button class="sys-btn" style="width:100%;font-size:10px;background:rgba(59,130,246,0.15);color:var(--blue);border-color:var(--blue);" onclick="upgradeCar(\'' + car.name + '\')">⬆️ שפר מנוע (' + upgradePrice.toLocaleString() + '₪)</button>' : '') +
            '</div>';
    });
    c.innerHTML = html + '</div>';
};

window.buyCar = function(n, p) {
    if (!canAfford(p)) return showMsg('חסרים ' + Math.ceil(p - (window.money + window.bank)).toLocaleString() + '₪', 'var(--red)');
    spendMoney(p);
    window.cars.push(n);
    if (!window.carLevels) window.carLevels = {};
    window.carLevels[n] = 0;
    recalculateTotalSpeed();
    showMsg('🚗 ' + n + ' נרכש! מהירות: x' + window.carSpeed.toFixed(2), 'var(--blue)');
    saveGame(); updateUI(); drawCars(document.getElementById('content'));
};

window.upgradeCar = function(n) {
    var car = carList.find(function(x) { return x.name === n; });
    if (!car || !window.cars.includes(n)) return;
    if (!window.carLevels) window.carLevels = {};
    var level = window.carLevels[n] || 0;
    var upgradePrice = Math.floor(car.price * 0.8 * (level + 1));
    if (!canAfford(upgradePrice)) return showMsg('חסרים ' + Math.ceil(upgradePrice - (window.money + window.bank)).toLocaleString() + '₪', 'var(--red)');
    spendMoney(upgradePrice);
    window.carLevels[n] = level + 1;
    recalculateTotalSpeed();
    showMsg('⚡ ' + n + ' שופר לרמה ' + window.carLevels[n] + '! מהירות: x' + window.carSpeed.toFixed(2), 'var(--yellow)');
    saveGame(); updateUI(); drawCars(document.getElementById('content'));
};

function recalculateTotalSpeed() {
    window.carSpeed = 1 + carList
        .filter(function(car) { return window.cars.includes(car.name); })
        .reduce(function(sum, car) {
            var lvl = (window.carLevels && window.carLevels[car.name]) ? window.carLevels[car.name] : 0;
            return sum + (car.speed * (1 + lvl * 0.5));
        }, 0);
}

// ── צוות עובדים ─────────────────────────────────────────────
// ── פונקציית ניהול צוות מעודכנת - כפתור "פטר" ללא סכום מתחת ──────────────────
window.drawStaff = function(c) {
    if (!window.staffData) window.staffData = {};
    var totalStaffPassive = 0;
    
    // חישוב הכנסה פסיבית כוללת מכל הצוות
    Object.keys(window.staffData).forEach(function(sid) {
        var s = staffList.find(function(x) { return x.id === sid; });
        if (s) {
            var d = window.staffData[sid];
            totalStaffPassive += (s.passive * 0.7) * (d.count || 0) * (1 + (d.level || 0) * 0.15);
        }
    });

    var html = '<h3>👥 ניהול צוות</h3>' +
        '<div class="card" style="background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.3);padding:12px;margin-bottom:12px;text-align:center;">' +
        '<div style="font-size:12px;opacity:0.7;margin-bottom:4px;">💼 הכנסה פסיבית מהצוות</div>' +
        '<div style="font-size:22px;font-weight:bold;color:var(--purple);">' + totalStaffPassive.toFixed(1) + ' ₪/ד\'</div>' +
        '</div><div class="grid-2">';

    staffList.forEach(function(s) {
        var d = window.staffData[s.id] || { count: 0, level: 0 };
        var count = d.count || 0;
        var level = d.level || 0;
        
        // מחיר גיוס
        var currentPrice = Math.floor(s.price * Math.pow(1.15, count));
        
        // הכנסה לסוג צוות זה
        var totalTypePass = ((s.passive * 0.7) * count * (1 + level * 0.15)).toFixed(1);
      
        // השורה המעודכנת עבור הצגת המחיר בכפתור:
var upgradePrice = count > 0 ? Math.floor(s.price * Math.pow(1.35, level + 1)) : 0;


        html += '<div class="card fade-in" style="text-align:center; display:flex; flex-direction:column; justify-content:space-between; border-top:4px solid ' + (count > 0 ? 'var(--purple)' : 'var(--border)') + '; padding: 10px; min-height: 230px;">' +
            '<div>' +
                '<div style="font-size:30px; margin-bottom:4px;">' + s.icon + '</div>' +
                '<div style="font-weight:bold; font-size:13px;">' + s.name + '</div>' +
                '<div style="font-size:11px; color:var(--purple); font-weight:bold;">' + totalTypePass + ' ₪/ד\'</div>' + 
                (count > 0
                    ? '<div style="font-size:10px; color:var(--green); margin:4px 0;">צוות: ' + count + ' | רמה ' + level + '</div>'
                    : '<div style="font-size:10px; opacity:0.5; margin:4px 0;">טרם גויס</div>') +
            '</div>' +
            '<div>' +
                '<button class="sys-btn" style="width:100%; margin-bottom:4px; font-weight:bold;" onclick="hireStaff(\'' + s.id + '\')">' +
                    '🤝 ' + currentPrice.toLocaleString() + '₪' +
                '</button>' +
                (count > 0 ? '<div style="display:flex; gap:4px;">' +
                    '<button class="sys-btn" style="flex:1; font-size:9px;" onclick="upgradeStaff(\'' + s.id + '\')">⬆️ ' + upgradePrice.toLocaleString() + '</button>' +
                    '<button class="sys-btn" style="flex:1; font-size:9px; background:rgba(239,68,68,0.15); color:var(--red); border-color:var(--red);" onclick="fireStaff(\'' + s.id + '\')">🔴 פטר</button>' +
                '</div>' : '') +
            '</div>' +
        '</div>';
    });
    c.innerHTML = html + '</div>';
};




window.hireStaff = function(id) {
    var s = staffList.find(function(x) { return x.id === id; });
    if (!s) return;
    
    // 1. וודא קיום אובייקט נתונים (StaffData)
    if (!window.staffData[id]) {
        window.staffData[id] = { count: 0, level: 0 };
    }
    var d = window.staffData[id];
    
    // 2. חישוב מחיר (עולה ב-15% על כל איש צוות)
    var currentPrice = Math.floor(s.price * Math.pow(1.15, d.count));

    if (!canAfford(currentPrice)) {
        return showMsg('אין מספיק כסף (גם בבנק)!', 'var(--red)');
    }

    // 3. חישוב התוספת האמיתית (כולל בונוס הרמה הנוכחי)
    var incomeBase = s.passive * 0.7;
    var levelBonus = 1 + (d.level * 0.15);
    var addedPassive = incomeBase * levelBonus;

    // 4. עדכון הנתונים הגלובליים
    spendMoney(currentPrice);
    d.count += 1;                  // עדכון הכמות בזיכרון
    window.passive += addedPassive; // עדכון הסטטיסטיקה הכללית

    showMsg('👤 גויס ' + s.name + '! (+' + addedPassive.toFixed(1) + ' ₪/ד\')', 'var(--purple)');
    
    // 5. שמירה ועדכון הבר העליון
    saveGame(); 
    updateUI(); 
    
    // 6. הזרקה מחדש (RENDER)
    var contentDiv = document.getElementById('content');
    if (contentDiv) {
        drawStaff(contentDiv); 
    }
};



window.upgradeStaff = function(id) {
    var s = staffList.find(function(x) { return x.id === id; });
    var d = window.staffData[id];
    if (!s || !d || d.count === 0) return;

    var currentLevel = d.level || 0;
    var upgradePrice = Math.floor(s.price * Math.pow(1.35, currentLevel + 1));

    if (!canAfford(upgradePrice)) return showMsg('שדרוג יקר (גם בבנק)!', 'var(--red)');

    // בונוס פסיבי מוקטן (15% תוספת)
    var bonusPassive = (s.passive * 0.7) * d.count * 0.15;

    spendMoney(upgradePrice);
    window.staffData[id].level = currentLevel + 1;
    window.passive += bonusPassive;

    showMsg('⬆️ ' + s.name + ' רמה ' + (currentLevel + 1), 'var(--purple)');
    saveGame(); updateUI(); drawStaff(document.getElementById('content'));
};


window.fireStaff = function(id) {
    var s = staffList.find(function(x) { return x.id === id; });
    if (!s || !window.staffData[id] || window.staffData[id].count === 0) return;
    var d           = window.staffData[id];
    var fireValue   = Math.floor(s.price * d.count * 0.6);
    var passiveLost = s.passive * d.count * (1 + (d.level || 0) * 0.4);
    showConfirmModal('🔴 פיטורים',
        'לפטר את כל ' + s.name + '?<br><br>✅ תקבל: <b>' + fireValue.toLocaleString() + '₪</b><br>❌ תאבד: <b>' + passiveLost.toFixed(1) + '₪/ד\'</b>',
        function() {
            window.money += fireValue;
            window.passive = Math.max(0, window.passive - passiveLost);
            window.staffData[id] = { count: 0, level: 0 };
            showMsg('🔴 פוטרו כל ' + s.name, 'var(--red)');
            saveGame(); updateUI(); drawStaff(document.getElementById('content'));
        });
};
