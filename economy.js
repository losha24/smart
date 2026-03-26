function renderWork(){
    let c = document.getElementById("content");
    let works = [
        {name:"שליחות", time:5, reward:40, passive:2},
        {name:"עבודה משרדית", time:15, reward:120, passive:5},
        {name:"בניית אתר", time:30, reward:300, passive:10},
        {name:"פרויקט גדול", time:60, reward:900, passive:25}
    ];
    works.forEach(w=>{
        let div = document.createElement("div");
        div.className="card";
        div.innerHTML=`${w.name} (${w.time}s) → ${w.reward}`;
        div.onclick = ()=> work(w.time,w.reward,w.passive);
        c.appendChild(div);
    });
    let barDiv = document.createElement("div");
    barDiv.className="progress";
    barDiv.innerHTML=`<div id="workBar" style="width:0%"></div>`;
    c.appendChild(barDiv);
}

function work(sec,reward,passive){
    let bar = document.getElementById("workBar");
    let p=0;
    let t = setInterval(()=>{
        p++;
        if(bar) bar.style.width=(p/sec*100)+"%";
        if(p>=sec){
            clearInterval(t);
            data.money += reward;
            data.passive += passive;
            data.xp += 20;
            checkLevel();
            save();
            msg(`סיימת עבודה! קיבלת ${reward}, הכנסה פסיבית +${passive}`);
        }
    },1000);
}

function renderInvest(){
    let c=document.getElementById("content");
    let investments=[
        {name:"קריפטו", cost:200},
        {name:"סטארטאפ", cost:600},
        {name:"מסחר", cost:1500},
        {name:"נדל״ן", cost:4000}
    ];
    investments.forEach(i=>{
        let div=document.createElement("div");
        div.className="card";
        div.innerHTML=`${i.name} → ${i.cost}`;
        div.onclick = ()=> invest(i.cost);
        c.appendChild(div);
    });
}

function invest(amount){
    if(data.money<amount){ msg("אין מספיק כסף"); return; }
    data.money -= amount;
    data.invested += amount;
    let result=Math.random();
    if(result>0.5){ data.passive += Math.floor(amount*0.05); msg("השקעה הצליחה"); }
    else{ data.lost += amount; msg("השקעה הפסידה"); }
    save();
}
