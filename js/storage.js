function getData(){
return JSON.parse(localStorage.getItem("money_data") || "[]");
}

function saveTransaction(type, amount){
const data = getData();
data.push({type, amount});
localStorage.setItem("money_data", JSON.stringify(data));
}