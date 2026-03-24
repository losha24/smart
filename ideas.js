
function generateIdeas(){

let ideas=[
"מכירת קובץ אקסל",
"אפליקציית ילדים",
"מדריך PDF פיננסי",
"ערוץ יוטיוב",
"מוצר ב Gumroad",
"מכירת תבניות Notion",
"בוט טלגרם פיננסי",
"שירות אוטומציה לעסקים"
]

ideas.sort(()=>0.5-Math.random())

let ul=document.getElementById("ideasList")
ul.innerHTML=""

ideas.slice(0,4).forEach(i=>{
let li=document.createElement("li")
li.innerText=i
ul.appendChild(li)
})

}
