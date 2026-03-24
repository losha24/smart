// app.js – קובץ מרכזי למערכת "כסף חכם"

// משתנים גלובליים
let incomes = [], expenses = [], loanMonthly = 0, mortMonthly = 0;
let currentVersion = "1.4.0";

// פונקציות עזר
function pmt(P, r, n) {
    if (P <= 0 || n <= 0) return 0;
    if (r === 0) return P / n;
    return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// עדכון דאשבורד
function updateDash() {
    const tInc = incomes.reduce((a,b)=>a+b.val,0);
    const tExp = expenses.reduce((a,b)=>a+b.val,0);
    const tDebt = loanMonthly + mortMonthly;
    const avail = tInc - tExp - tDebt;
    const el = document.getElementById('dash_stats');
    if(el) el.innerHTML = `הכנסות: ${tInc.toLocaleString()} ₪ | הוצאות: ${tExp.toLocaleString()} ₪<br>חובות: ${tDebt.toLocaleString()} ₪<br><span style="color:${avail>=0?'#2e7d32':'#d32f2f'}">פנוי: ${avail.toLocaleString()} ₪</span>`;
}

// שמירה לאחסון מקומי
function save() {
    const data = {
        incomes, expenses,
        l: {a:l_amt?.value, r:l_rt?.value, y:l_yrs?.value, e:l_extra?.value||""},
        m1:{a:m_a1?.value,r:m_r1?.value,y:m_y1?.value,e:m_e1?.value||""},
        m2:{a:m_a2?.value,r:m_r2?.value,y:m_y2?.value,e:m_e2?.value||""},
        m3:{a:m_a3?.value,r:m_r3?.value,y:m_y3?.value,e:m_e3?.value||""}
    };
    localStorage.setItem("financeData", JSON.stringify(data));
}

// טעינת נתונים מ-localStorage
function loadData(){
    const d = JSON.parse(localStorage.getItem("financeData"));
    if(!d) return;
    incomes = d.incomes||[]; expenses = d.expenses||[];
    if(d.l){ l_amt.value=d.l.a; l_rt.value=d.l.r; l_yrs.value=d.l.y; l_extra.value=d.l.e||""; }
    for(let i=1;i<=3;i++){
        if(d['m'+i]){
            document.getElementById('m_a'+i).value = d['m'+i].a;
            document.getElementById('m_r'+i).value = d['m'+i].r;
            document.getElementById('m_y'+i).value = d['m'+i].y;
            document.getElementById('m_e'+i).value = d['m'+i].e||"";
        }
    }
}

// אתחול המערכת
window.onload = ()=>{
    loadData();
    refresh();
    calcLoan();
    calcM();
};
