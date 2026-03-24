function calcLoan(){
    const P=+document.getElementById('l_amt').value||0,
          r=(+document.getElementById('l_rt').value/100)/12,
          n=(+document.getElementById('l_yrs').value)*12,
          extra=+document.getElementById('l_extra').value||0;
    
    let monthly = pmt(P,r,n)+extra;
    document.getElementById('l_res').innerText = monthly ? `החזר חודשי: ${monthly.toFixed(0)} ₪` : "";
    
    document.getElementById('l_tbl_area').innerHTML = createAmortizationTable(P,r,n,extra,'l_info');
    loanMonthly = monthly;
    updateDash();
    save();
}

function createAmortizationTable(P,r,n,extraPay=0,infoId=null){
    if(!P||n<=0) return "";
    let basePay=pmt(P,r,n), currentPay=basePay+extraPay, bal=P, actualMonths=0;
    for(let i=1;i<=n;i++){
        let interest=bal*r, principal=currentPay-interest;
        if(principal<=0 && bal>0) break;
        bal-=principal; actualMonths=i; if(bal<=0) break;
    }

    if(infoId){
        let infoEl=document.getElementById(infoId);
        let saved = n-actualMonths;
        if(extraPay>0 && saved>0){ infoEl.style.display="block"; infoEl.innerText=`🔥 חיסכון של ${saved} חודשים!`; }
        else infoEl.style.display="none";
    }

    bal=P;
    let html=`<button class="toggle-tbl-btn" onclick="this.nextElementSibling.classList.toggle('show')">📋 לוח סילוקין</button>
              <div class="table-content"><table><tr><th>חודש</th><th>תשלום</th><th>יתרה</th></tr>`;
    for(let j=1;j<=actualMonths;j++){
        let int=bal*r;
        bal-=(currentPay-int);
        let hiddenClass = j>12 ? 'class="extra-row" style="display:none"' : '';
        html+=`<tr ${hiddenClass}><td>${j}</td><td>${currentPay.toFixed(0)}</td><td>${Math.max(0,bal).toFixed(0)}</td></tr>`;
        if(j===12 && actualMonths>12) html+=`<tr class="show-more-row" onclick="showAllRows(this)"><td colspan="3">הצג עוד...</td></tr>`;
    }
    return html+"</table></div>";
}

function showAllRows(btn){ btn.closest('table').querySelectorAll('.extra-row').forEach(r=>r.style.display='table-row'); btn.style.display='none'; }
