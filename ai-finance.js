
function analyzeFinance(){

let salary=Number(document.getElementById("salary").value)
let expenses=Number(document.getElementById("expensesAI").value)
let target=Number(document.getElementById("targetAI").value)

let save=salary-expenses

let months=Math.ceil(target/save)

let result=""
if(save<=0){

result="אתה לא חוסך כרגע"

}else{

result="תחסוך "+save+" לחודש. זמן להגיע ליעד: "+months+" חודשים"

}

document.getElementById("aiResult").innerText=result

}
