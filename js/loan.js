function calcLoan(amount,rate,years){

let r = rate/100/12

let n = years*12

let payment = amount*(r/(1-(1+r)**-n))

return Math.round(payment)

}
