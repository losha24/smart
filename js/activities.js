/* Smart Money Pro - js/activities.js - v9.9.9
   תיקונים מלאים + איזון מחדש:
   1. recalcPassive - מחשב מחדש מכל המקורות
   2. דף הבית מציג סך הכנסה פסיבית כוללת
   3. עבודות: passive לא גדל מעבר לcap של jobPassive
   4. נדל"ן: מכירה מורידה בדיוק מה שנוסף
   5. צוות: פיטורים מורידים בדיוק מה שנוסף
   6. עסקים: מכירה מורידה בדיוק מה שנוסף
   7. איזון מחדש - הורדת הכנסות נדל"ן וצוות ב-30-40%
*/

// ⭐⚖️ קונפיגורציית איזון המשחק - שנה כאן כדי לאזן מחדש
const BALANCE_CONFIG = {
    // נדל"ן - כמה מהערך המקורי מקבלים (0.60 = 60%)
    ESTATE_INCOME: 0.60,      // ⬇️ הורדה מ-75% ל-60%
    
    // צוות - כמה מהערך המקורי מקבלים
    STAFF_INCOME: 0.55,       // ⬇️ הורדה מ-70% ל-55%
    
    // בונוס רמה נדל"ן (0.15 = 15% לרמה)
    ESTATE_LEVEL_BONUS: 0.15, // ⬇️ הורדה מ-20% ל-15%
    
    // בונוס רמה צוות
    STAFF_LEVEL_BONUS: 0.10,  // ⬇️ הורדה מ-15% ל-10%
    
    // מקסימום יחידות נדל"ן מסוג אחד (0 = אין הגבלה)
    MAX_ESTATE_COUNT: 0,
    
    // מקסימום צוות מסוג אחד
    MAX_STAFF_COUNT: 0
};

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
    { id: 's1',  name: 'חולצת טי',    price: 150,   xp: 25,    icon: '👕' },
    { id: 's2',  name: 'ג\'ינס אופנתי',       price: 450,   xp: 70,    icon: '👖' },
    { id: 's3',  name: 'נעלי ספורט',          price: 850,   xp: 130,   icon: '👟' },
    { id: 's4',  name: 'זקט עור',             price: 2200,  xp: 350,   icon: '🧥' },
    { id: 's5',  name: 'שעון חכם',            price: 3500,  xp: 550,   icon: '⌚' },
    { id: 's6',  name: 'משקפי שמש', price: 1800,  xp: 280,   icon: '🕶️' },
    { id: 's7',  name: 'חליפת עסקים',         price: 6000,  xp: 1000,  icon: '👔' },
    { id: 's8',  name: 'תיק מעצבים',          price: 12000, xp: 2000,  icon: '👜' },
    { id: 's9',  name: 'טבעת יהלום',          price: 45000, xp: 8000,  icon: '💎' },
    { id: 's10', name: 'כתר זהב',      price: 85000, xp: 15000, icon: '👑' }
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

// ============================================================
// ⭐ recalcPassive — מחשב passive מחדש מכל המקורות
// ============================================================
window.recalcPassive = function() {
    var total = 0;

    // עבודות — jobPassive כפי שנשמר
    total += (window.jobPassive || 0);

    // נדל"ן - עם הקונפיגורציה החדשה
    estateList.forEach(function(e) {
        var d = window.estateData[e.id] || { count: 0, level: 0 };
        if (d.count > 0) {
            total += (e.passive * BALANCE_CONFIG.ESTATE_INCOME) * d.count * (1 + (d.level || 0) * BALANCE_CONFIG.ESTATE_LEVEL_BONUS);
        }
    });

    // עסקים
    businessList.forEach(function(b) {
        var level = (window.inventory || []).filter(function(item) { return item === b.id; }).length;
        if (level > 0) {
            total += b.passive * level;
        }
    });

    // צוות - עם הקונפיגורציה החדשה
    Object.keys(window.staffData || {}).forEach(function(sid) {
        var s = staffList.find(function(x) { return x.id === sid; });
        if (s) {
            var d = window.staffData[sid];
            total += (s.passive * BALANCE_CONFIG.STAFF_INCOME) * (d.count || 0) * (1 + (d.level || 0) * BALANCE_CONFIG.STAFF_LEVEL_BONUS);
        }
    });

    window.passive = Math.max(0, total);
return total;
};

// ──נמצא בקובץ ui דף הבית ────────────────────────────────────────────────

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
            var actualAdd = Math.min(passiveAdd, passiveCap - window.jobPassive);
            window.jobPassive = Math.min(passiveCap, window.jobPassive + passiveAdd);
            window.passive += actualAdd;
        }
        showMsg('💰 +' + j.pay + '₪ | ✨ +' + j.xp + ' XP | 🚀 +' + passiveAdd.toFixed(3) + '₪/ד\'', 'var(--green)');
        if (btn) btn.disabled = false;
        if (container) container.style.display = 'none';
        if (bar) { bar.style.transition = 'none'; bar.style.width = '0%'; }
        updateUI(); saveGame();
    }, actualTime);
};

// ── נדל"ן ──────────────────────────────────────────────────
window.drawEstate = function(c) {
    if (!c) return;
    var totalEstatePassive = 0;
    estateList.forEach(function(e) {
        var d = window.estateData[e.id] || { count: 0, level: 0 };
        if (d.count > 0) {
            totalEstatePassive += (e.passive * BALANCE_CONFIG.ESTATE_INCOME) * d.count * (1 + (d.level || 0) * BALANCE_CONFIG.ESTATE_LEVEL_BONUS);
        }
    });

    var html = '<h3>🏠 אימפריית נדל"ן</h3>' +
        '<div class="card" style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.3);padding:12px;margin-bottom:12px;text-align:center;">' +
        '<div style="font-size:12px;opacity:0.7;margin-bottom:4px;">💰 סך הכנסה משכירות (נדל"ן)</div>' +
        '<div style="font-size:22px;font-weight:bold;color:var(--green);">' + totalEstatePassive.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + ' ₪/ד\'</div>' +
        '</div><div class="grid-2">';

    estateList.forEach(function(e) {
        var d = window.estateData[e.id] || { count: 0, level: 0 };
        var count = d.count || 0;
        var level = d.level || 0;
        var currentPrice = Math.floor(e.price * Math.pow(1.20, count));
        var totalPassive = ((e.passive * BALANCE_CONFIG.ESTATE_INCOME) * count * (1 + level * BALANCE_CONFIG.ESTATE_LEVEL_BONUS)).toLocaleString();
        var upgradePrice = count > 0 ? Math.floor(e.price * Math.pow(1.8, level + 1)) : 0;
        var borderStyle = count > 0 ? 'border-top:4px solid var(--green)' : 'border-top:4px solid var(--border)';

        html += '<div class="card fade-in" style="text-align:center; display:flex; flex-direction:column; justify-content:space-between; ' + borderStyle + '; padding: 10px; min-height: 260px;">' +
            '<div>' +
                '<div style="font-size:30px; margin-bottom:4px;">' + e.icon + '</div>' +
                '<div style="font-weight:bold; font-size:13px; line-height:1.2;">' + e.name + '</div>' +
                '<div style="font-size:11px; color:var(--green); font-weight:bold;">' + totalPassive + ' ₪/ד\'</div>' +
                (count > 0 ? '<div style="font-size:10px; color:var(--blue); margin:4px 0;">בבעלותך: ' + count + ' | רמה: ' + level + '</div>'
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
    var pricePerOne = Math.floor(e.price * Math.pow(1.20, d.count || 0));
    if (window.money < pricePerOne) return showMsg('אין מספיק כסף!', 'var(--red)');
    window.money -= pricePerOne;
    var reducedPassive = e.passive * BALANCE_CONFIG.ESTATE_INCOME;
    window.estateData[id] = { count: (d.count || 0) + 1, level: d.level || 0 };
    window.passive += reducedPassive;
    showMsg('🏠 רכשת ' + e.name, 'var(--green)');
    saveGame(); updateUI(); drawEstate(document.getElementById('content'));
};

window.upgradeEstate = function(id) {
    var e = estateList.find(function(x) { return x.id === id; });
    var d = window.estateData[id];
    if (!e || !d || d.count === 0) return;
    var upgradePrice = Math.floor(e.price * Math.pow(1.8, (d.level || 0) + 1));
    if (window.money < upgradePrice) return showMsg('השיפוץ יקר!', 'var(--red)');
    var bonusPassive = (e.passive * BALANCE_CONFIG.ESTATE_INCOME) * d.count * BALANCE_CONFIG.ESTATE_LEVEL_BONUS;
    window.money -= upgradePrice;
    window.estateData[id].level = (d.level || 0) + 1;
    window.passive += bonusPassive;
    showMsg('⬆️ ' + e.name + ' רמה ' + window.estateData[id].level, 'var(--purple)');
    saveGame(); updateUI(); drawEstate(document.getElementById('content'));
};

window.sellEstate = function(id) {
    var e = estateList.find(function(x) { return x.id === id; });
    if (!e || !window.estateData[id] || window.estateData[id].count === 0) return;
    var eData = window.estateData[id];
    var sellValue = Math.floor(e.price * eData.count * 0.7);
    var passiveLost = (e.passive * BALANCE_CONFIG.ESTATE_INCOME) * eData.count * (1 + (eData.level || 0) * BALANCE_CONFIG.ESTATE_LEVEL_BONUS);
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
window.drawBusiness = function(c) {
    if (!c) return;
    var totalBizPassive = 0;
    businessList.forEach(function(b) {
        var level = window.inventory.filter(function(item) { return item === b.id; }).length;
        if (level > 0) { totalBizPassive += b.passive * level; }
    });

    var html = '<h3>💼 אימפריית עסקים</h3>' +
        '<div class="card" style="background:rgba(168,85,247,0.08);border:1px solid rgba(168,85,247,0.3);padding:12px;margin-bottom:12px;text-align:center;">' +
        '<div style="font-size:12px;opacity:0.7;margin-bottom:4px;">💰 סך הכנסה פסיבית מעסקים</div>' +
        '<div style="font-size:22px;font-weight:bold;color:var(--purple);">' + totalBizPassive.toFixed(1) + ' ₪/ד\'</div>' +
        '</div><div class="grid-2">';

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
            '</div></div>';
    });
    c.innerHTML = html + '</div>';
};

window.buyBusiness = function(id, price, passAdd) {
    if (window.money < price) return showMsg('אין מספיק כסף!', 'var(--red)');
    window.money -= price; window.passive += passAdd; window.inventory.push(id);
    showMsg('💼 עסק שודרג! +' + passAdd.toFixed(1) + '₪/ד\'', 'var(--purple)');
    saveGame(); updateUI(); drawBusiness(document.getElementById('content'));
};

window.sellBusiness = function(id) {
    var b = businessList.find(function(x) { return x.id === id; });
    if (!b) return;
    var level = window.inventory.filter(function(item) { return item === id; }).length;
    if (level === 0) return;
    var sellValue   = Math.floor(b.price * level * 0.7);
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
    if (!c) return;
    c.innerHTML = `
    <div class="card fade-in">
        <h3 style="margin-top:0;">🏦 ניהול חשבון בנק</h3>
        <div class="grid-2">
            <div class="card" style="margin:0; text-align:center; padding:15px; border:1px solid var(--blue);">
                <small>יתרה בבנק</small><br>
                <b style="font-size:18px; color:var(--blue);">${window.bank.toLocaleString()}₪</b>
            </div>
            <div class="card" style="margin:0; text-align:center; padding:15px; border:1px solid var(--red);">
                <small>חוב קיים (הלוואות)</small><br>
                <b style="font-size:18px; color:var(--red);">${window.loan.toLocaleString()}₪</b>
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
            <button class="action" style="background:var(--yellow); color:black; font-size:13px;" onclick="executeLoanOp('take')">קח הלוואה: 10,000₪</button>
            <button class="action" style="background:#ec4899; color:white; font-size:13px;" onclick="executeLoanOp('pay')">החזר חוב: 10,500₪</button>
        </div>
        <p style="font-size:10px; color:var(--red); text-align:center; margin-top:8px;">* החזר הלוואה כולל עמלת ריבית של 5%.</p>
    </div>`;
};

window.executeBankOp = function(mode) {
    var val = parseInt(document.getElementById('bank-amt').value);
    if (!val || val <= 0) return showMsg('נא להזין סכום תקין', 'var(--red)');
    var fee = val * window.bankTaxRate;
    if (mode === 'dep') {
        if (window.money >= (val + fee)) { window.money -= (val + fee); window.bank += val; showMsg('הופקד בהצלחה!', 'var(--blue)'); }
        else return showMsg('אין מספיק מזומן', 'var(--red)');
    } else {
        if (window.bank >= val) { window.bank -= val; window.money += (val - fee); showMsg('נמשך בהצלחה!', 'var(--purple)'); }
        else return showMsg('אין מספיק יתרה', 'var(--red)');
    }
    saveGame(); updateUI(); drawBank(document.getElementById('content'));
};

window.executeLoanOp = function(mode) {
    if (mode === 'take') {
        if (window.loan + 10000 > 250000) return showMsg('חריגה! מקסימום: 250,000₪', 'var(--red)');
        window.loan += 10000; window.money += 10000;
        showMsg('הלוואה אושרה!', 'var(--green)');
    } else {
        if (window.loan <= 0) return showMsg('אין חובות', 'var(--green)');
        var toPay = Math.min(window.money, 10500);
        if (toPay <= 0) return showMsg('אין מזומן להחזר', 'var(--red)');
        window.money -= toPay; window.loan = Math.max(0, window.loan - 10000);
        showMsg('שילמת 10,500₪ (כולל ריבית)', 'var(--green)');
    }
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
    if (window.money < item.price) return showMsg('חסרים ' + Math.ceil(item.price - window.money).toLocaleString() + '₪', 'var(--red)');
    window.money -= item.price; window.lifeXP += item.xp; window.inventory.push(item.id);
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
    if (window.money < upgradePrice) return showMsg('חסר כסף לשדרוג!', 'var(--red)');
    var xpBonus = Math.floor(item.xp * 0.6);
    window.money -= upgradePrice;
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
    if (window.money < p) return showMsg('חסרים ' + Math.ceil(p - window.money).toLocaleString() + '₪', 'var(--red)');
    window.money -= p; window.skills.push(n);
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
    if (window.money < p) return showMsg('חסרים ' + Math.ceil(p - window.money).toLocaleString() + '₪', 'var(--red)');
    window.money -= p; window.cars.push(n);
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
    if (window.money < upgradePrice) return showMsg('חסרים ' + Math.ceil(upgradePrice - window.money).toLocaleString() + '₪', 'var(--red)');
    window.money -= upgradePrice;
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
window.drawStaff = function(c) {
    if (!window.staffData) window.staffData = {};
    var totalStaffPassive = 0;
    Object.keys(window.staffData).forEach(function(sid) {
        var s = staffList.find(function(x) { return x.id === sid; });
        if (s) {
            var d = window.staffData[sid];
            totalStaffPassive += (s.passive * BALANCE_CONFIG.STAFF_INCOME) * (d.count || 0) * (1 + (d.level || 0) * BALANCE_CONFIG.STAFF_LEVEL_BONUS);
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
        var currentPrice  = Math.floor(s.price * Math.pow(1.15, count));
        var totalTypePass = ((s.passive * BALANCE_CONFIG.STAFF_INCOME) * count * (1 + level * BALANCE_CONFIG.STAFF_LEVEL_BONUS)).toFixed(1);
        var upgradePrice  = count > 0 ? Math.floor(s.price * Math.pow(1.35, level + 1)) : 0;

        html += '<div class="card fade-in" style="text-align:center; display:flex; flex-direction:column; justify-content:space-between; border-top:4px solid ' + (count > 0 ? 'var(--purple)' : 'var(--border)') + '; padding: 10px; min-height: 230px;">' +
            '<div>' +
                '<div style="font-size:30px; margin-bottom:4px;">' + s.icon + '</div>' +
                '<div style="font-weight:bold; font-size:13px;">' + s.name + '</div>' +
                '<div style="font-size:11px; color:var(--purple); font-weight:bold;">' + totalTypePass + ' ₪/ד\'</div>' +
                (count > 0 ? '<div style="font-size:10px; color:var(--green); margin:4px 0;">צוות: ' + count + ' | רמה ' + level + '</div>'
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
    if (!window.staffData[id]) { window.staffData[id] = { count: 0, level: 0 }; }
    var d = window.staffData[id];
    var currentPrice = Math.floor(s.price * Math.pow(1.15, d.count));
    if (window.money < currentPrice) { return showMsg('אין מספיק כסף!', 'var(--red)'); }
    var incomeBase   = s.passive * BALANCE_CONFIG.STAFF_INCOME;
    var levelBonus   = 1 + (d.level * BALANCE_CONFIG.STAFF_LEVEL_BONUS);
    var addedPassive = incomeBase * levelBonus;
    window.money -= currentPrice;
    d.count += 1;
    window.passive += addedPassive;
    showMsg('👤 גויס ' + s.name + '! (+' + addedPassive.toFixed(1) + ' ₪/ד\')', 'var(--purple)');
    saveGame(); updateUI();
    var contentDiv = document.getElementById('content');
    if (contentDiv) { drawStaff(contentDiv); }
};

window.upgradeStaff = function(id) {
    var s = staffList.find(function(x) { return x.id === id; });
    var d = window.staffData[id];
    if (!s || !d || d.count === 0) return;
    var currentLevel = d.level || 0;
    var upgradePrice = Math.floor(s.price * Math.pow(1.35, currentLevel + 1));
    if (window.money < upgradePrice) return showMsg('שדרוג יקר!', 'var(--red)');
    var bonusPassive = (s.passive * BALANCE_CONFIG.STAFF_INCOME) * d.count * BALANCE_CONFIG.STAFF_LEVEL_BONUS;
    window.money -= upgradePrice;
    window.staffData[id].level = currentLevel + 1;
    window.passive += bonusPassive;
    showMsg('⬆️ ' + s.name + ' רמה ' + (currentLevel + 1), 'var(--purple)');
    saveGame(); updateUI(); drawStaff(document.getElementById('content'));
};

window.fireStaff = function(id) {
    var s = staffList.find(function(x) { return x.id === id; });
    if (!s || !window.staffData[id] || window.staffData[id].count === 0) return;
    var d         = window.staffData[id];
    var fireValue = Math.floor(s.price * d.count * 0.6);
    var passiveLost = (s.passive * BALANCE_CONFIG.STAFF_INCOME) * d.count * (1 + (d.level || 0) * BALANCE_CONFIG.STAFF_LEVEL_BONUS);
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

// ⭐ אתחול ראשוני
setTimeout(function() {
    window.recalcPassive();
}, 100);
