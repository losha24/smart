function getData(){

return JSON.parse(localStorage.getItem("moneyData") || "[]")

}

function saveData(data){

localStorage.setItem("moneyData",JSON.stringify(data))

}
