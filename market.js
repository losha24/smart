function renderMarket(){
    let c=document.getElementById("content");
    let stocks=[
        {name:"TECH", price:Math.floor(Math.random()*500)},
        {name:"AI", price:Math.floor(Math.random()*500)},
        {name:"ENERGY", price:Math.floor(Math.random()*500)},
        {name:"NEDLAN", price:Math.floor(Math.random()*500)}
    ];
    stocks.forEach(s=>{
        let div=document.createElement("div");
        div.className="card";
        div.innerHTML=`${s.name}: ${s.price} ₪`;
        c.appendChild(div);
    });
}
