// ניהול תצוגות, בר, לוגו, עדכון מידע
document.addEventListener("DOMContentLoaded", () => {
    const moneyEl = document.getElementById("money");
    const bankEl = document.getElementById("bank");
    const incomeEl = document.getElementById("income");
    const levelEl = document.getElementById("level");
    const levelBar = document.getElementById("level-bar");
    const levelText = document.getElementById("level-text");

    let state = {
        money: 0,
        bank: 0,
        passiveIncome: 0,
        level: 1,
        xp: 0
    };

    function updateUI() {
        moneyEl.textContent = `💰 ${state.money} ₪`;
        bankEl.textContent = `🏦 ${state.bank} ₪`;
        incomeEl.textContent = `💵 הכנסה פסיבית: ${state.passiveIncome} ₪`;
        levelEl.textContent = `⭐ רמה: ${state.level}`;
        const xpPercent = Math.min(100, (state.xp/100)*100);
        levelBar.style.width = `${xpPercent}%`;
        levelText.textContent = `ניסיון ${state.xp}/100`;
    }

    function addMoney(amount) {
        state.money += amount;
        state.passiveIncome += Math.floor(amount/10);
        state.xp += amount;
        if(state.xp >= 100){
            state.level++;
            state.xp = state.xp - 100;
            alert(`עלית רמה! קיבלת פרס!`);
        }
        updateUI();
    }

    // כפתורי בר
    document.getElementById("reset-btn").addEventListener("click", () => {
        if(confirm("אתה בטוח שברצונך לאפס את המשחק?")){
            state = {money:0, bank:0, passiveIncome:0, level:1, xp:0};
            updateUI();
        }
    });

    document.getElementById("home-btn").addEventListener("click", () => {
        alert(`בית: כסף ${state.money} ₪, בנק ${state.bank} ₪, השקעות ${state.passiveIncome} ₪`);
    });

    updateUI();

    // הכנסה פסיבית כל 5 שניות
    setInterval(() => {
        if(state.passiveIncome>0){
            state.money += state.passiveIncome;
            updateUI();
        }
    }, 5000);
});
