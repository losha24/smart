function changePassword(){

let newPass = prompt("קוד חדש")

localStorage.setItem("adminPass",newPass)

alert("הקוד עודכן")

}
