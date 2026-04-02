/* Smart Money Pro - DEBUG & REPAIR TOOL v1.0 */
function runFullSystemCheck() {
    console.log("--- מתחיל בדיקת מערכת מקיפה ---");
    let errors = [];

    // 1. בדיקת משתנים (האם core.js ו-economy.js נטענו?)
    const requiredVars = ['money', 'bank', 'loan', 'lifeXP', 'inventory', 'passive'];
    requiredVars.forEach(v => {
        if (typeof window[v] === 'undefined') errors.push(`משתנה חסר: ${v}`);
    });

    // 2. בדיקת פונקציות (האם ui.js ו-activities.js נטענו?)
    const requiredFuncs = ['drawHome', 'drawWork', 'drawMarket', 'drawBank'];
    requiredFuncs.forEach(f => {
        if (typeof window[f] !== 'function') errors.push(`פונקציית תצוגה חסרה: ${f}`);
    });

    // 3. בדיקת אלמנטים ב-HTML
    if (!document.getElementById('content')) errors.push("אלמנט HTML חסר: #content");
    if (!document.getElementById('status-bar')) errors.push("אלמנט HTML חסר: #status-bar");

    // סיכום ללוג
    if (errors.length > 0) {
        console.error("❌ נמצאו שגיאות:", errors);
        // מציג הודעה ויזואלית על המסך
        const content = document.getElementById('content');
        if (content) {
            const errDiv = document.createElement('div');
            errDiv.style = "background:#7f1d1d; color:white; padding:15px; border-radius:10px; margin:10px; font-family:monospace; font-size:12px;";
            errDiv.innerHTML = "<b>באגים שנמצאו:</b><br>" + errors.join("<br>");
            content.prepend(errDiv);
        }
    } else {
        console.log("✅ הכל תקין!");
        if (typeof showMsg === 'function') showMsg("סריקת מערכת: הכל תקין", "var(--green)");
    }
}

// הפעלה אחרי 2 שניות כדי לתת להכל להיטען
setTimeout(runFullSystemCheck, 2000);
