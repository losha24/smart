/* Smart Money Pro - DEBUG & REPAIR TOOL v1.2.1 - Combined Version */

function runFullSystemCheck() {
    console.log("--- מתחיל בדיקת מערכת מקיפה (גרסה מאוחדת) ---");
    let errors = [];

    // 1. בדיקת משתני ליבה (האם core.js נטען?)
    const requiredVars = ['money', 'bank', 'loan', 'lifeXP', 'inventory', 'passive', 'energy', 'hunger'];
    requiredVars.forEach(v => {
        if (typeof window[v] === 'undefined') errors.push(`משתנה חסר: ${v}`);
    });

    // 2. בדיקת פונקציות תצוגה (האם ui.js כולל את כל הכפתורים החדשים?)
    const requiredFuncs = [
        'drawHome', 'drawWork', 'drawMarket', 'drawBank', 
        'drawShop', 'drawEstate', 'drawSkills', 'drawCars'
    ];
    requiredFuncs.forEach(f => {
        if (typeof window[f] !== 'function') errors.push(`פונקציית תצוגה חסרה: ${f}`);
    });

    // 3. בדיקת אלמנטים ב-HTML (האם ה-Index תקין?)
    if (!document.getElementById('content')) errors.push("אלמנט HTML חסר: #content");
    if (!document.getElementById('status-bar')) errors.push("אלמנט HTML חסר: #status-bar");
    
    // בדיקה ספציפית לכפתורי הניווט שביקשת
    const navButtons = ['btnHome', 'btnWork', 'btnTasks', 'btnMarket', 'btnBank'];
    navButtons.forEach(btn => {
        if (!document.getElementById(btn)) errors.push(`כפתור בתפריט חסר: ${btn}`);
    });

    // --- הצגת התוצאות ---
    const content = document.getElementById('content');
    if (content) {
        // מנקה דיבאג קודם
        const oldDebug = document.getElementById('debug-box');
        if (oldDebug) oldDebug.remove();

        const debugDiv = document.createElement('div');
        debugDiv.id = 'debug-box';
        
        if (errors.length > 0) {
            console.error("❌ נמצאו שגיאות:", errors);
            debugDiv.style = "background:#7f1d1d; color:white; padding:15px; border-radius:10px; margin:10px; font-family:monospace; font-size:12px; border:2px solid red;";
            debugDiv.innerHTML = "<b>⚠️ באגים שנמצאו (אלכסיי):</b><br>" + errors.join("<br>");
        } else {
            console.log("✅ הכל תקין!");
            debugDiv.style = "background:#064e3b; color:#34d399; padding:15px; border-radius:10px; margin:10px; font-family:monospace; font-size:12px; border:2px solid #059669;";
            debugDiv.innerHTML = "<b>✅ מערכת מסונכרנת:</b><br>כל המשתנים, הפונקציות והכפתורים תקינים.";
            
            // סגירה אוטומטית של הודעת ה-"תקין" אחרי 5 שניות
            setTimeout(() => { debugDiv.remove(); }, 5000);
        }
        content.prepend(debugDiv);
    }
}

// הפעלה אחרי 2.5 שניות
setTimeout(runFullSystemCheck, 2500);
