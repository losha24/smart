function renderTasks(){
    let c=document.getElementById("content");
    let tasks=[
        {desc:"סיים עבודה פעמיים", reward:100},
        {desc:"השקעה אחת לפחות", reward:200},
        {desc:"הכנסה פסיבית מעל 50", reward:300}
    ];
    tasks.forEach(t=>{
        let div=document.createElement("div");
        div.className="card";
        div.innerHTML=`${t.desc} → ${t.reward}`;
        div.onclick=()=>{ data.money+=t.reward; data.tasksDone++; save(); msg(`סיימת משימה וקיבלת ${t.reward}`); };
        c.appendChild(div);
    });
}
