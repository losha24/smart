document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");

    const stocks = [
        {name:"מניה A", price:100},
        {name:"מניה B", price:200},
        {name:"מניה C", price:50}
    ];

    stocks.forEach(stock=>{
        const card = document.createElement("div");
        card.classList.add("card");
        card.textContent = `${stock.name}\nמחיר: ${stock.price} ₪`;
        card.addEventListener("click", ()=>{
            if(window.state.money >= stock.price){
                window.state.money -= stock.price;
                stock.price = Math.floor(stock.price * (0.8 + Math.random()*0.4));
                card.textContent = `${stock.name}\nמחיר: ${stock.price} ₪`;
            } else alert("אין מספיק כסף למניה");
        });
        content.appendChild(card);
    });
});
