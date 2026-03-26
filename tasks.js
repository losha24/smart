document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");

    const tasks = [
        {name:"משימה יומית 1", reward:30},
        {name:"משימה יומית 2", reward:50},
        {name:"משימה יומית 3", reward:70}
    ];

    tasks.forEach(task=>{
        const card = document.createElement("div");
        card.classList.add("card");
        card.textContent = `${task.name}\nפרס: ${task.reward} ₪`;
        card.addEventListener("click", ()=>{
            window.dispatchEvent(new CustomEvent("addMoney",{detail:task.reward}));
            card.textContent = `${task.name}\nבוצעה!`;
        });
        content.appendChild(card);
    });
});
