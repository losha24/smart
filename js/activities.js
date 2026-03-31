/* Smart Money Pro - js/activities.js - v6.7.0 - Expanded Warehouse */

// --- 1. מאגר נתונים מורחב (Expanded Data) ---

const jobList = [
    { id: 'j1', name: 'מנקה רחובות', pay: 55, xp: 20, time: 3000, icon: '🧹' },
    { id: 'j2', name: 'שליח פיצה', pay: 95, xp: 45, time: 5000, icon: '🛵' },
    { id: 'j3', name: 'מאבטח קניון', pay: 145, xp: 65, time: 8000, icon: '🏢' },
    { id: 'j4', name: 'מנופאי', pay: 250, xp: 110, time: 9000, icon: '🏗️' },
    { id: 'j5', name: 'מאבטח חמוש', pay: 350, xp: 160, time: 10000, icon: '🔫', req: 'רישיון נשק' },
    { id: 'j6', name: 'סוהר שב"ס', pay: 480, xp: 210, time: 12000, icon: '👮', req: 'קורס פיקודי' },
    { id: 'j7', name: 'שוטר סיור', pay: 550, xp: 250, time: 13000, icon: '🚔', req: 'רישיון נהיגה' },
    { id: 'j8', name: 'מתכנת FullStack', pay: 1200, xp: 550, time: 18000, icon: '💻', req: 'תכנות' }
];

const estateList = [
    { n: "דירת סטודיו", c: 250000, p: 800, i: "🏢" }, 
    { n: "דירת 3 חדרים", c: 550000, p: 1800, i: "🏠" }, 
    { n: "דירת גן", c: 950000, p: 3800, i: "🏡" }, 
    { n: "בית פרטי", c: 1500000, p: 6500, i: "🏘️" },
    { n: "פנטהאוז", c: 2800000, p: 12000, i: "🏙️" }, 
    { n: "וילה בקיסריה", c: 6500000, p: 25000, i: "🏰" },
    { n: "בניין משרדים", c: 18000000, p: 85000, i: "🏢" },
    { n: "אי פרטי", c: 60000000, p: 300000, i: "🏝️" }
];

const businessList = [
    { n: "דוכן קפה", c: 18000, p: 35, i: "☕" }, 
    { n: "קיוסק שכונתי", c: 55000, p: 90, i: "🏪" }, 
    { n: "פיצריה משפחתית", c: 280000, p: 450, i: "🍕" }, 
    { n: "מספרה מעוצבת", c: 95000, p: 180, i: "✂️" }, 
    { n: "מוסך רכב", c: 1350000, p: 2200, i: "🔧" }, 
    { n: "אולם אירועים", c: 5500000, p: 9500, i: "🥂" }, 
    { n: "סניף סופרמרקט", c: 12000000, p: 25000, i: "🛒" }, 
    { n: "חברת הייטק", c: 45000000, p: 120000, i: "🚀" }
];

const carList = [
    { n: "משפחתית יד שניה", c: 45000, p: 1500, i: "🚗" },
    { n: "ג'יפ עירוני", c: 180000, p: 4500, i: "🚙" },
    { n: "רכב ספורט", c: 450000, p: 12000, i: "🏎️" },
    { n: "רכב שטח ממוגן", c: 850000, p: 25000, i: "🛡️" },
    { n: "מכונית על", c: 2500000, p: 60000, i: "🏎️" }
];

const marketPool = [
    { n: "אייפון 15 Pro", c: 5800, p: 300, i: "📱" }, 
    { n: "מחשב גיימינג קצה", c: 18000, p: 850, i: "💻" }, 
    { n: "טלוויזיה 85 אינץ'", c: 12000, p: 500, i: "📺" },
    { n: "שעון רולקס", c: 145000, p: 6500, i: "⌚" }, 
    { n: "יהלום נדיר", c: 350000, p: 15000, i: "💎" },
    { n: "פסל אספנות", c: 85000, p: 4000, i: "🗿" }
];

// --- 2. פונקציות תצוגה (Drawing Functions) ---

function drawWork(c) {
    if(!c) return;
    let html = `<h3>⚒️ מרכז תעסוקה</h3><div class="grid-2">`;
    jobList.forEach(j => {
        const canWork = !j.req || skills.includes(j.req);
        html += `
            <div class="card fade-in" style="text-align:center; opacity:${canWork ? 1 : 0.6}">
                <div style="font-size:26px;">${j.icon}</div>
                <div style="font-weight:bold; font-size:13px;">${j.name}</div>
                <div style="color:var(--green); font-size:12px; margin-bottom:8px;">${j.pay.toLocaleString()}₪</div>
                <button class="sys-btn" style="width:100%;" onclick="startWork('${j.id}')" ${canWork ? '' : 'disabled'}>
                    ${canWork ? 'בצע עבודה' : 'נעול'}
                </button>
            </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function drawEstate(c) {
    if(!c) return;
    let html = `<h3>🏠 השקעות נדל"ן</h3><div class="grid-2">`;
    estateList.forEach(item => {
        html += `
        <div class="card fade-in" style="text-align:center; padding:12px;">
            <div style="font-size:28px;">${item.i}</div>
            <b style="display:block; font-size:13px; min-height:30px;">${item.n}</b>
            <div style="color:var(--green); font-size:11px; margin-bottom:8px;">+${item.p.toLocaleString()}₪/ש</div>
            <button class="sys-btn" style="width:100%;" onclick="executeBuy('estate','${item.n}',${item.c},${item.p},'${item.i}')">
                ${item.c.toLocaleString()}₪
            </button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function drawBusiness(c) {
    if(!c) return;
    let html = `<h3>🏢 השקעה בעסקים</h3><div class="grid-2">`;
    businessList.forEach(item => {
        html += `
        <div class="card fade-in" style="text-align:center; padding:15px;">
            <div style="font-size:30px;">${item.i}</div>
            <b style="display:block; font-size:14px; min-height:35px;">${item.n}</b>
            <div style="color:var(--green); font-size:12px; margin-bottom:10px;">+${item.p.toLocaleString()}₪/ש</div>
            <button class="sys-btn" style="width:100%;" onclick="executeBuy('business','${item.n}',${item.c},${item.p},'${item.i}')">
                ${item.c.toLocaleString()}₪
            </button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function drawCars(c) {
    if(!c) return;
    let html = `<h3>🚗 סוכנות רכבים</h3><div class="grid-2">`;
    carList.forEach(item => {
        html += `
        <div class="card fade-in" style="text-align:center; padding:15px;">
            <div style="font-size:30px;">${item.i}</div>
            <b style="display:block; font-size:14px;">${item.n}</b>
            <div style="color:var(--blue); font-size:11px; margin-bottom:10px;">+${item.p.toLocaleString()} XP</div>
            <button class="sys-btn" style="width:100%;" onclick="executeBuy('market','${item.n}',${item.c},${item.p},'${item.i}')">
                ${item.c.toLocaleString()}₪
            </button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

function drawMarket(c) {
    if(!c) return;
    let html = `<h3>🛒 שוק מוצרי יוקרה</h3><div class="grid-2">`;
    marketPool.forEach(item => {
        html += `
        <div class="card fade-in" style="text-align:center; padding:15px;">
            <div style="font-size:30px;">${item.i}</div>
            <b style="display:block; font-size:14px;">${item.n}</b>
            <div style="color:var(--blue); font-size:11px; margin-bottom:10px;">+${item.p.toLocaleString()} XP</div>
            <button class="sys-btn" style="width:100%;" onclick="executeBuy('market','${item.n}',${item.c},${item.p},'${item.i}')">
                ${item.c.toLocaleString()}₪
            </button>
        </div>`;
    });
    c.innerHTML = html + `</div>`;
}

// --- 3. לוגיקה: מתנה כל 4 שעות ---

function getDailyGift() {
    const now = Date.now();
    const fourHours = 4 * 60 * 60 * 1000;

    if (now - lastGift > fourHours) {
        money += 2000; 
        lastGift = now;
        showMsg(`🎁 קיבלת מתנה של 2,000₪!`, "var(--yellow)");
        saveGame(); updateUI(); openTab('home');
    } else {
        const remaining = fourHours - (now - lastGift);
        const h = Math.floor(remaining / 3600000);
        const m = Math.floor((remaining % 3600000) / 60000);
        showMsg(`חזור בעוד ${h} שעות ו-${m} דקות!`, "var(--white)");
    }
}
