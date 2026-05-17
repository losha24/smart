/* טימר */

function startEventTimer() {
  setInterval(() => {
    
    window.nextEventTime--;
    localStorage.setItem("nextEventTime", window.nextEventTime);
    
    const el = document.getElementById("event-timer");
    if (el) {
      const m = Math.floor(window.nextEventTime / 60);
      const s = window.nextEventTime % 60;
      el.innerText = m + ":" + (s < 10 ? "0" : "") + s;
    }
    
    if (window.nextEventTime <= 0) {
      
      // 🎯 מערכת סיכוי חכמה
      let chance = 0.5;
      
      if (window.money > 50000) chance += 0.1;
      if ((window.blackMoney || 0) > 10000) chance += 0.2;
      if ((window.wantedLevel || 0) > 2) chance += 0.2;
      
      // 🎲 הפעלת אירוע
      if (Math.random() < chance) {
        window.triggerRandomEvent?.();
      }
      
      // ⏱️ זמן דינמי
      window.nextEventTime = Math.max(
        20,
        60 - Math.floor((window.money || 0) / 10000) * 5
      );
      
      localStorage.setItem("nextEventTime", window.nextEventTime);
    }
    
  }, 1000);
}
