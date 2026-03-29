/* Smart Money Pro - js/economy.js - v6.0.1 - Full Passive Update */

const bzPool = [{n:"דוכן קפה", c:15000, p:20}, {n:"קיוסק", c:45000, p:60}, {n:"פיצריה", c:250000, p:350}, {n:"מספרה", c:80000, p:110}, {n:"חנות בגדים", c:550000, p:800}, {n:"מוסך", c:1200000, p:1800}, {n:"מסעדה", c:3000000, p:4500}, {n:"סופרמרקט", c:8000000, p:12000}, {n:"קניון", c:25000000, p:40000}, {n:"מפעל", c:60000000, p:100000}];
const rePool = [{n:"חניה", c:90000, p:45}, {n:"מחסן", c:250000, p:130}, {n:"דירת 2 חדרים", c:1200000, p:650}, {n:"דירת 4 חדרים", c:2400000, p:1400}, {n:"וילה", c:5500000, p:3500}, {n:"בניין", c:18000000, p:15000}, {n:"קומה במגדל", c:45000000, p:42000}, {n:"מרכז לוגיסטי", c:90000000, p:85000}, {n:"מלון", c:200000000, p:200000}, {n:"אי פרטי", c:500000000, p:550000}];
const skPool = [{n:"ניהול זמן", c:5000, s:5}, {n:"מכירות", c:15000, s:15}, {n:"רישיון נשק", c:30000, s:30}, {n:"תכנות", c:50000, s:60}, {n:"שיווק", c:85000, s:120}, {n:"ניהול השקעות", c:150000, s:250}, {n:"יזמות", c:400000, s:700}, {n:"קריפטו", c:750000, s:1500}, {n:"מנהיגות", c:2000000, s:5000}, {n:"פוליטיקה", c:10000000, s:25000}];
const carPool = [{n:"קורקינט", c:3000, v:1.2}, {n:"אופנוע", c:25000, v:1.5}, {n:"משפחתית", c:150000, v:2}, {n:"ג'יפ", c:350000, v:2.5}, {n:"חשמלית יוקרה", c:600000, v:3.2}, {n:"ספורט", c:1200000, v:4.5}, {n:"יאכטה", c:5000000, v:7}, {n:"מסוק", c:12000000, v:10}, {n:"מטוס", c:45000000, v:15}, {n:"חללית", c:250000000, v:30}];
const mkPool = [{n:"אייפון", c:5500, p:2}, {n:"מחשב גיימינג", c:15000, p:6}, {n:"טלוויזיה 8K", c:25000, p:12}, {n:"שעון יוקרה", c:120000, p:50}, {n:"ריהוט מעצבים", c:4500, p:20}, {n:"מערכת קול", c:3500, p:15}, {n:"בריכה", c:180000, p:100}, {n:"ג'קוזי", c:4000, p:18}, {n:"פסל אמנות", c:100000, p:500}, {n:"יהלום", c:250000, p:1200}];

function drawBank(c) {
    c.innerHTML = `
    <div class="card fade-in">
        <h3 style="margin-top:0;">🏦 ניהול חשבון בנק</h3>
        <div class="grid-2">
            <div class="card" style="margin:0; text-align:center;">
                <small>יתרה בבנק</small><br><b>${bank.toLocaleString()}₪</b>
            </div>
            <div class="card" style="margin:0; text-align:center;">
                <small>חוב קיים</small><br><b style="color:var(--red)">${loan.toLocaleString()}₪</b>
            </div>
        </div>
        <div style="margin:15px 0;">
            <input type="number" id="bank-amt" placeholder="סכום לפעולה..." 
                style="width:100%; padding:15px; border-radius:12px; border:1px solid var(--border); background:var(--bg); color:var(--text); text-align:center;">
        </div>
        <div class="grid-2">
            <button class="action" onclick="bankOp('dep')">הפקד</button>
            <button class="action" style="background:var(--blue)" onclick="bankOp('wd')">משוך</button>
        </div>
        <hr style="opacity:0.1; margin:20px 0;">
        <div class="grid-2">
            <button class="action" style="background:var(--yellow); color:black;" onclick="loanOp('take')">קח הלוואה 10K</button>
            <button class="action" style="background:#ec4899" onclick="loanOp('pay')">החזר חוב 10K</button>
        </div>
    </div>`;
}

function bankOp(t) {
    const a = parseInt(document.getElementById('bank-amt').value);
    if(!a || a <= 0) { showMsg("הזן סכום תקין", "var(--red)"); return; }
    
    if(t==='dep' && money>=a) { money-=a; bank+=a; showMsg(`הפקדת ${a.toLocaleString()}₪`, "var(--green)"); }
    else if(t==='wd' && bank>=a) { bank-=a; money+=a; showMsg(`משכת ${a.toLocaleString()}₪`, "var(--blue)"); }
    else { showMsg("אין מספיק יתרה לפעולה", "var(--red)"); return; }
    
    updateUI(); drawBank(document.getElementById("content"));
}

function loanOp(t) {
    if(t==='take') { 
        loan+=10000; money+=10000; 
        showMsg("קיבלת הלוואה: 10,000₪", "var(--blue)");
    } else if(money>=10500 && loan>=10000) { 
        money-=10500; loan-=10000; 
        showMsg("החזרת 10K מהחוב (כולל ריבית)", "var(--green)"); 
    } else {
        showMsg("אין מספיק כסף להחזר החוב", "var(--red)");
        return;
    }
    updateUI(); drawBank(document.getElementById("content"));
}

function drawMarket(c, t) {
    let l = (t==='business')?bzPool:(t==='realestate')?rePool:(t==='skills')?skPool:(t==='cars')?carPool:mkPool;
    let h = `<div class="grid-2 fade-in">`;
    l.forEach(i => {
        const has = (t==='skills'&&skills.includes(i.n))||(t==='cars'&&cars.includes(i.n));
        h += `
        <div class="card" style="font-size:12px; text-align:center; padding:12px;">
            <b style="display:block; margin-bottom:5px;">${i.n}</b>
            <span style="opacity:0.8;">${i.c.toLocaleString()}₪</span>
            <button class="action" style="padding:8px 0; font-size:11px; margin-top:10px; height:auto;" 
                onclick="executeBuy('${t}','${i.n}',${i.c},${i.p||i.s||i.v||0})" ${has?'disabled':''}>
                ${has?'בבעלותך':'קנה'}
            </button>
        </div>`;
    });
    c.innerHTML = h + `</div>`;
}

function executeBuy(t, n, c, v) {
    if(money >= c) {
        money -= c; 
        totalSpent += c; 
        lifeXP += (c * 0.05);

        if(t==='skills') { skills.push(n); passive += v; }
        else if(t==='cars') { cars.push(n); carSpeed = v; passive += (c * 0.001); }
        else { if(t==='market') inventory.push(n); passive += v; }
        
        showMsg(`רכשת: ${n} | הפסיבי עלה!`, "var(--green)");
        updateUI(); openTab(t);
    } else {
        showMsg("חסר לך כסף לרכישה זו", "var(--red)");
    }
}

function drawInvest(c) {
    let h = `<div class="card fade-in"><h3 style="margin-top:0;">📈 מסחר בבורסה</h3><div class="grid-2">`;
    const st = [{id:'AAPL', n:'Apple', p:150}, {id:'TSLA', n:'Tesla', p:200}, {id:'NVDA', n:'Nvidia', p:450}, {id:'BTC', n:'Bitcoin', p:65000}, {id:'GOOG', n:'Google', p:140}, {id:'AMZN', n:'Amazon', p:175}, {id:'MSFT', n:'Microsoft', p:400}, {id:'NFLX', n:'Netflix', p:600}, {id:'META', n:'Meta', p:480}, {id:'ELAL', n:'El-Al', p:5}];
    st.forEach(s => {
        h += `
        <div class="card" style="padding:10px; font-size:12px; text-align:center;">
            <b>${s.n}</b><br><small>${s.p}₪</small>
            <div class="grid-2" style="margin-top:8px; gap:5px;">
                <button class="action" style="padding:5px 0; height:auto; background:var(--green);" onclick="buyStk('${s.id}',${s.p})">קנה</button>
                <button class="action" style="padding:5px 0; height:auto; background:var(--red);" onclick="sellStk('${s.id}',${s.p})">מכור</button>
            </div>
            <div style="margin-top:5px; font-size:10px; opacity:0.7;">יש לך: ${invOwned[s.id]||0}</div>
        </div>`;
    });
    c.innerHTML = h + `</div></div>`;
}

function buyStk(i, p) { 
    if(money>=p){ money-=p; invOwned[i]++; showMsg(`קנית מניית ${i}`, "var(--green)"); updateUI(); drawInvest(document.getElementById("content")); }
    else showMsg("אין מספיק כסף", "var(--red)");
}

function sellStk(i, p) { 
    if(invOwned[i]>0){ money+=p; invOwned[i]--; showMsg(`מכרת מניית ${i}`, "var(--blue)"); updateUI(); drawInvest(document.getElementById("content")); }
    else showMsg("אין לך מניות למכור", "var(--red)");
}
