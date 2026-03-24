let incomes=[], expenses=[], loanMonthly=0, mortMonthly=0;
let myChart = null;

function showSection(id){
    document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function toggleDark(){ document.body.classList.toggle('dark'); }

function pmt(P,r,n){ return (r===0)?(P/n):(P*r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1); }

function addItem(type){
    const pre=type==='incomes'?'inc':'exp';
    const name=document.getElementById(pre+'_name').value, val=+document.getElementById(pre+'_val').value;
    if(!name||!val) return;
    (type==='incomes'?incomes:expenses).push({name,val});
    document.getElementById(pre+'_name').value=""; document.getElementById(pre+'_val').value="";
    refresh();
}

function editItem(type, idx){
    const list = type==='incomes' ? incomes : expenses;
    const n = prompt("שם חדש:", list[idx].name), v = prompt("סכום חדש:", list[idx].val);
    if(n !== null && v !== null && !isNaN(v)){ list[idx].name = n; list[idx].val = Number(v); refresh(); }
}

function deleteItem(type,idx){ (type==='incomes'?incomes:expenses).splice(idx,1); refresh(); }

function renderItemsTable(type){
    const list=type==='incomes'?incomes:expenses;
    const container=document.getElementById(type==='incomes'?'inc_table':'exp_table');
    if(!list.length){ container.innerHTML=""; return; }
    let h=`<table><tr><th>שם</th><th>₪</th><th>פעולה</th></tr>`;
    list.forEach((item,i)=> h+=`<tr><td>${item.name}</td><td>${item.val.toLocaleString()}</td><td><button class="action-btn edit-btn" onclick="editItem('${type}',${i})">✏️</button><button class="action-btn delete-btn" onclick="deleteItem('${type}',${i})">🗑️</button></td></tr>`);
    container.innerHTML=h+"</table>";
}

function updateDash(){
    const tInc=incomes.reduce((a,b)=>a+b.val,0), tExp=expenses.reduce((a,b)=>a+b.val,0), tDebt=loanMonthly+mortMonthly, avail=tInc-tExp-tDebt;
    document.getElementById('dash_stats').innerHTML=`הכנסות: ${tInc.toLocaleString()} ₪ | הוצאות: ${tExp.toLocaleString()} ₪<br>חובות: ${tDebt.toLocaleString()} ₪<br><span style="color:${avail>=0?'#2e7d32':'#d32f2f'}">פנוי: ${avail.toLocaleString()} ₪</span>`;
    if(myChart){ myChart.data.datasets[0].data=[tInc,tExp,tDebt]; myChart.update(); }
    else {
        const ctx = document.getElementById('budgetChart').getContext('2d');
        myChart = new Chart(ctx,{type:'doughnut',data:{labels:['הכנסות','הוצאות','חובות'],datasets:[{data:[tInc,tExp,tDebt],backgroundColor:['#4caf50','#ff9800','#f44336'],borderWidth:0}]},options:{responsive:true,plugins:{legend:{display:false}}}});
    }
}

function save(){
    const data={ incomes, expenses };
    localStorage.setItem("financeData",JSON.stringify(data));
}

function refresh(){ renderItemsTable('incomes'); renderItemsTable('expenses'); updateDash(); save(); }

window.onload=()=>{
    const d=JSON.parse(localStorage.getItem("financeData"));
    if(d){ incomes=d.incomes||[]; expenses=d.expenses||[]; }
    refresh();
};

function resetAll(){ if(confirm("לאפס הכל?")){ localStorage.clear(); location.reload(); } }
