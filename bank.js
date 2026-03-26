function renderBank(){
    let c=document.getElementById("content");
    let dep=document.createElement("button");
    dep.innerText="הפקדה 100";
    dep.onclick=()=>{ if(data.money<100){msg("אין מספיק כסף"); return;} data.money-=100; data.bank+=100; save(); msg("הפקדת 100");};
    c.appendChild(dep);

    let wit=document.createElement("button");
    wit.innerText="משיכה 100";
    wit.onclick=()=>{ if(data.bank<100){msg("אין מספיק כסף בבנק"); return;} data.bank-=100; data.money+=100; save(); msg("משכת 100");};
    c.appendChild(wit);
}
