function saveData(key,value){

localStorage.setItem(key,JSON.stringify(value))

}


function loadData(key){

return JSON.parse(localStorage.getItem(key))

}
