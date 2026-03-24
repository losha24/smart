function calcM(){
    mortMonthly=0; let htmlTables="";
    for(let i=1;i<=3;i++){
        const P=+document.getElementById('m_a'+i).value||0,
              r=(+document.getElementById('m_r'+i).value/100)/12,
              n=(+document.getElementById('m_y'+i).value)*12,
              extra=+document.getElementById('m_e'+i).value||0;
        if(P<=0) continue;
        mortMonthly += (pmt(P,r,n)+extra);
        htmlTables+=`<div style="margin-top:20px; font-weight:bold;">מסלול ${i}:</div>`+createAmortizationTable(P,r,n,extra,'m_info'+i);
    }
    document.getElementById('m_res_summary').innerText = mortMonthly ? `סה"כ החזר משכנתא: ${mortMonthly.toFixed(0)} ₪` : "";
    document.getElementById('m_tbl_area').innerHTML = htmlTables;
    updateDash();
    save();
}
