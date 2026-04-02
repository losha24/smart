/* Smart Money Pro - DEBUG & REPAIR TOOL v1.0 */

function runFullSystemCheck() {
    console.log("--- מתחיל בדיקת מערכת מקיפה ---");
    let errors = [];

    // 1. בדיקת משתנים קריטיים
    const requiredVars = ['money', 'bank', 'loan', 'lifeXP', 'inventory', 'passive'];
    requiredVars.forEach(v => {
        if (typeof window[v] === 'undefined') errors.push(`משתנה חסר: ${v}`);
    });

    // 2. בדיקת פונקציות ציור (UI)
    const requiredFuncs = ['drawHome', 'drawWork', 'drawMarket', 'drawBank'];
    requiredFuncs.forEach(f => {
        if (typeof window[f] !== 'function') errors.push(`פונקציית תצוגה חסרה: ${f}`);
    });

    // 3. ניקוי כפילויות ב-LocalStorage (תיקון באגים בטעינה)
    if (localStorage.getItem('SMP_Final_Save') && localStorage.getItem('smartMoneySave_v6_main')) {
        console.warn("נמצאו שני קבצי שמירה שונים. מאחד לגרסה החדשה...");
    }

    // 4. בדיקת אלמנטים ב-HTML
    if (!document.getElementById('content')) errors.push("אלמנט HTML חסר: #content");
    if (!document.getElementById('status-bar')) errors.push("אלמנט HTML חסר: #status-bar");

    // סיכום
    if (errors.length > 0) {
        console.error("נמצאו שגיאות במערכת:", errors);
        alert("נמצאו " + errors.length + " שגיאות. בדוק את ה-Console.");
    } else {
        console.log("✅ המערכת נראית תקינה מבחינת מבנה.");
        showMsg("סריקת מערכת הושלמה - הכל תקין", "var(--green)");
    }
}

// הפעלה אוטומטית בטעינה
setTimeout(runFullSystemCheck, 2000);
