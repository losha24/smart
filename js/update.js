async function checkVersion(){

let res = await fetch("version.json?"+Date.now())

let data = await res.json()

let current = localStorage.getItem("version")

if(current !== data.version){

alert("יש עדכון")

localStorage.setItem("version",data.version)

location.reload(true)

}else{

alert("גרסה מעודכנת")

}

}
