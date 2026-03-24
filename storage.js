function exportData() {
    const data = localStorage.getItem("financeData");
    if(!data) return alert("אין נתונים לגיבוי");
    const blob=new Blob([data],{type:"application/json"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="budget_backup.json";
    a.click();
}

function importData(){ document.getElementById('fileInput').click(); }

function handleFile(input){
    const file=input.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=(e)=>{
        try{
            const data=JSON.parse(e.target.result);
            if(confirm("שחזור הנתונים ימחק את המידע הקיים. להמשיך?")){
                localStorage.setItem("financeData",JSON.stringify(data));
                location.reload();
            }
        } catch(err){ alert("קובץ לא תקין"); }
    };
    reader.readAsText(file);
}
