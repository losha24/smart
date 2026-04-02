/* Smart Money Pro - DEBUG & REPAIR TOOL v1.3.0 - Pro Sync Edition */

function runFullSystemCheck() {
    console.log("%c--- מתחיל בדיקת מערכת Smart Money Pro (v6.5.0) ---", "color: #38bdf8; font-weight: bold; font-size: 14px;");
    let errors = [];
    let warnings = [];

    // 1. בדיקת משתני ליבה (האם core.js ו-economy.js נטענו?)
    const requiredVars = [
        { name: 'money', type: 'number' },
        { name: 'bank', type: 'number' },
        { name: 'loan', type: 'number' },
        { name: 'lifeXP', type: 'number' },
        { name: 'passive', type: 'number' },
        { name: 'inventory', type: 'object' },
        { name: 'invOwned', type: 'object' },
        { name: 'skills', type: 'object' },
        { name: 'cars', type: 'object' }
    ];

    requiredVars.forEach(v => {
        if (typeof window[v.name] === 'undefined') {
            errors.push(`❌ משתנה ליבה חסר: <b>${v.name}</b> (בדוק את core.js)`);
        } else if (typeof window[v.name] !== v.type) {
            warnings.push(`⚠️ סוג משתנה לא תקין: ${v.name} הוא ${typeof window[v.name]} במקום ${v.type}`);
        }
    });

    // 2. בדיקת פונקציות תצוגה וטאבים (האם activities.js ו-ui.js מסונכרנים?)
    // הוספתי את השמות המדויקים מה-Index שלך
    const requiredFuncs = [
        'drawHome', 'drawWork', 'drawTasks', 'drawInvest', 
        'drawBusiness', 'drawEstate', 'drawSkills', 'drawBank', 
        'drawCars', 'drawMarket'
    ];
    
    requiredFuncs.forEach(f => {
        if (typeof window[f] !== 'function') {
            errors.push(`❌ פונקציית טאב חסרה: <b>${f}</b> (בדוק את activities/economy/ui)`);
        }
    });

    // 3. בדיקת אלמנטים ב-HTML (בדיקת ה-Index)
    const requiredIDs = [
        'content', 'status-bar', 'money', 'bank', 'life-level-ui',
        'btnHome', 'btnWork', 'btnTasks', 'btnInvest', 'btnBusiness', 
        'btnEstate', 'btnSkills', 'btnBank', 'btnCars', 'btnMarket'
    ];

    requiredIDs.forEach(id => {
        if (!document.getElementById(id)) {
            errors.push(`❌ אלמנט HTML חסר ב-Index: <b>#${id}</b>`);
        }
    });

    // --- הצגת התוצאות על המסך ---
    const content = document.getElementById('content');
    if (content) {
        // מנקה דיבאג קודם אם קיים
        const oldDebug = document.getElementById('debug-result-box');
        if (oldDebug) oldDebug.remove();

        const debugDiv = document.createElement('div');
        debugDiv.id = 'debug-result-box';
        debugDiv.className = 'fade-in';
        
        // עיצוב התיבה
        let baseStyle = "padding:15px; border-radius:12px; margin:10px 0; font-family:sans-serif; font-size:13px; line-height:1.6; border:1px solid ";
        
        if (errors.length > 0) {
            console.error("DEBUG: שגיאות נמצאו!", errors);
            debugDiv.style = baseStyle + "#ef4444; background:rgba(127,29,29,0.9); color:#fca5a5;";
            debugDiv.innerHTML = `<h4 style="margin:0 0 10px 0;">⚠️ באגים קריטיים (אלכסיי, דרוש תיקון):</h4>` + errors.join("<br>");
        } else {
            console.log("%cDEBUG: הכל תקין ומסונכרן!", "color: #22c55e;");
            debugDiv.style = baseStyle + "#22c55e; background:rgba(6,78,59,0.9); color:#34d399;";
            debugDiv.innerHTML = `<b>✅ מערכת מסונכרנת (v6.5.0):</b><br>כל המשתנים, הפונקציות וכפתורי הניווט נמצאו תקינים.`;
            
            // בונוס: אם יש רק אזהרות קלות
            if (warnings.length > 0) {
                debugDiv.innerHTML += `<br><small style="color:#fbbf24;">הערות: ${warnings.join(", ")}</small>`;
            }

            // סגירה אוטומטית רק אם הכל תקין
            setTimeout(() => { 
                if(debugDiv) debugDiv.style.opacity = "0";
                setTimeout(() => debugDiv.remove(), 500);
            }, 6000);
        }
        
        content.prepend(debugDiv);
    }
}

// הפעלה אוטומטית לאחר טעינת הדף (מחכה שכל ה-JS יסיים להיטען)
window.addEventListener('load', () => {
    setTimeout(runFullSystemCheck, 2000);
});
