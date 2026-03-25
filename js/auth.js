function openAdmin(){

let pass = prompt("קוד ניהול")

let adminPass = localStorage.getItem("adminPass") || "123456"

if(pass === adminPass){

alert("כניסה למערכת ניהול")

}else{

alert("קוד שגוי")

}

}
