function login(){

let pass=document.getElementById("password").value

let saved=localStorage.getItem("appPassword") || "123456"

if(pass===saved){

document.getElementById("loginBox").style.display="none"

document.getElementById("app").style.display="block"

render()

}else{

alert("סיסמה שגויה")

}

}

function changePassword(){

let newPass=prompt("הכנס סיסמה חדשה")

if(newPass){

localStorage.setItem("appPassword",newPass)

alert("סיסמה עודכנה")

}

}
