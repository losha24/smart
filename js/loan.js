document.getElementById("loan_section").innerHTML=`
<h2>מחשבון הלוואה</h2>
<input id="loanAmount" placeholder="סכום">
<input id="loanRate" placeholder="ריבית">
<input id="loanMonths" placeholder="חודשים">
<button onclick="calcLoan()">חשב</button>
<div id="loanResult"></div>
`

function calcLoan(){
let a=document.getElementById("loanAmount").value
let r=document.getElementById("loanRate").value/100/12
let m=document.getElementById("loanMonths").value
let p=a*r/(1-Math.pow(1+r,-m))
document.getElementById("loanResult").innerHTML="החזר: ₪"+p.toFixed(2)
}
