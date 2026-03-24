
function loginAdmin(){

let pass=document.getElementById("adminPass").value

if(pass==="123456"){
document.getElementById("adminPanel").style.display="block"
}

}

function resetData(){

localStorage.removeItem("smartmoney")
location.reload()

}

function exportData(){

let data=localStorage.getItem("smartmoney")

let blob=new Blob([data],{type:"application/json"})

let a=document.createElement("a")

a.href=URL.createObjectURL(blob)
a.download="backup.json"
a.click()

}
