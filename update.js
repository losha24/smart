function manualUpdate(){
    if(confirm("להוריד גרסה חדשה? הנתונים הקיימים יישמרו.")){
        fetch('version.json')
        .then(r=>r.json())
        .then(v=>{
            if(v.version!=="1.4.0"){
                alert(`גרסה חדשה זמינה: ${v.version}`);
                location.reload(true);
            } else alert("אתה כבר בגרסה העדכנית");
        });
    }
}
