function mortgageInfo(){

let amount = prompt("סכום משכנתא")

let rate = prompt("ריבית")

let years = prompt("שנים")

let pay = calcLoan(amount,rate,years)

alert("החזר חודשי: "+pay)

}
