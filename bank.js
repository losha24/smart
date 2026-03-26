document.addEventListener("DOMContentLoaded", () => {
    const moneyEl = document.getElementById("money");
    const bankEl = document.getElementById("bank");

    // פונקציות הפקדה/משיכה
    window.deposit = function(amount){
        if(window.state.money >= amount){
            window.state.money -= amount;
            window.state.bank += amount;
            moneyEl.textContent = `💰 ${window.state.money} ₪`;
            bankEl.textContent = `🏦 ${window.state.bank} ₪`;
        } else alert("אין מספיק כסף להפקדה");
    }

    window.withdraw = function(amount){
        if(window.state.bank >= amount){
            window.state.money += amount;
            window.state.bank -= amount;
            moneyEl.textContent = `💰 ${window.state.money} ₪`;
            bankEl.textContent = `🏦 ${window.state.bank} ₪`;
        } else alert("אין מספיק כסף בבנק");
    }
});
