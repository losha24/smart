document.getElementById("mortgage_section").innerHTML=`
<h2>מחשבון משכנתא</h2>
<input id="mortgageAmount" placeholder="סכום">
<input id="mortgageRate" placeholder="ריבית">
<input id="mortgageYears" placeholder="שנים">
<button onclick="calcMortgage()">חשב</button>
<div id="mortgageResult"></div>
`

function calcMortgage(){
let a=document.getElementById("mortgageAmount").value
let r=document.getElementById("mortgageRate").value/100/12
let y=document.getElementById("mortgageYears").value*12
let p=a*r/(1-Math.pow(1+r,-y))
document.getElementById("mortgageResult").innerHTML="החזר: ₪"+p.toFixed(2)
}
