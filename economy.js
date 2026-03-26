document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");

    const works = [
        {name:"עבודה פשוטה", duration:5000, reward:50},
        {name:"עבודה בינונית", duration:10000, reward:120},
        {name:"עבודה קשה", duration:15000, reward:200}
    ];

    works.forEach(work=>{
        const card = document.createElement("div");
        card.classList.add("card");
        card.textContent = `${work.name}\n${work.reward} ₪`;
        card.addEventListener("click", () => {
            card.textContent = `${work.name}\nבעבודה...`;
            setTimeout(()=>{
                card.textContent = `${work.name}\n${work.reward} ₪`;
                window.dispatchEvent(new CustomEvent("addMoney",{detail:work.reward}));
            }, work.duration);
        });
        content.appendChild(card);
    });

    // הקשבה להוספת כסף
    window.addEventListener("addMoney", e=>{
        const amount = e.detail;
        if(window.state) window.state.money += amount;
    });
});
