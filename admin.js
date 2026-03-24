function openAdmin(){
    let pass=prompt("הזן סיסמה לניהול:");
    if(pass!=="123456"){ alert("סיסמה שגויה"); return; }
    const adminDiv=document.getElementById('admin_panel');
    if(!adminDiv){
        const div=document.createElement('div');
        div.id="admin_panel";
        div.className="card";
        div.innerHTML=`<h3>🛠️ ניהול מערכת</h3>
        <button onclick="resetAll()">🧹 איפוס מלא</button>
        <button onclick="manualUpdate()">🔄 עדכון גרסה</button>
        <p style="margin-top:10px;font-size:12px;color:#888">גרסה 1.4.0 | זכויות יוצרים © 2026 Alexsei Zavodisker</p>`;
        document.body.insertBefore(div,document.body.firstChild);
    } else adminDiv.remove();
}
