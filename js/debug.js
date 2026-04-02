/* Smart Money Pro - DEBUG & REPAIR TOOL v1.4.0 - Pro Sync Edition */

// פונקציית העזר שנקראת מתוך ui.js (אופציה 5)
window.runSystemCheck = function() {
    runFullSystemCheck();
};

function runFullSystemCheck() {
    console.log("%c--- מתחיל בדיקת מערכת Smart Money Pro (v6.7.3) ---", "color: #38bdf8; font-weight: bold; font-size: 14px;");
    let errors = [];
    let warnings = [];

    // 1. בדיקת משתני ליבה (האם core.js נטענו?)
    const requiredVars = [
        { name: 'money', type: 'number' },
        { name: 'bank', type: 'number' },
        { name: 'loan', type: 'number' },
        { name: 'lifeXP', type: 'number' },
        { name: 'passive', type: 'number' },
        { name: 'inventory', type: 'object' },
        { name: 'invOwned', type: 'object' },
        { name: 'skills', type: 'object' },
        { name: 'cars', type: 'object' },
        { name: 'adminMsgText', type: 'string' }
    ];

    requiredVars.forEach(v => {
        if (typeof window[v.name] === 'undefined') {
            errors.push(`❌ משתנה ליבה חסר: <b>${v.name}</b>`);
        } else if (typeof window[v.name] !== v.type) {
            warnings.push(`⚠️ סוג משתנה לא תקין: ${v.name}`);
        }
    });

    // 2. בדיקת פונקציות UI ומנהל
    const requiredFuncs = [
        'drawHome', 'drawWork', 'drawInvest', 'drawBusiness', 
        'drawEstate', 'drawSkills', 'drawBank', 'drawCars', 
        'editAdminMsg', 'updateUI', 'saveGame', 'openTab'
    ];
    
    requiredFuncs.forEach(f => {
        if (typeof window[f] !== 'function') {
            errors.push(`❌ פונקציה חסרה: <b>${f}</b>`);
        }
    });

    // 3. בדיקת אלמנטים ב-HTML (לפי ה-Index העדכני)
    const requiredIDs = [
        'content', 'status-bar', 'btnHome', 'btnWork', 
        'btnInvest', 'btnBusiness', 'btnEstate', 'btnSkills'
    ];

    requiredIDs.forEach(id => {
        if (!document.getElementById(id)) {
            errors.push(`❌ אלמנט HTML חסר ב-Index: <b>#${id}</b>`);
        }
    });

    // 4. בדיקת LocalStorage (יכולת שמירה)
    try {
        localStorage.setItem('debug_test', '1');
        localStorage.removeItem('debug_test');
    } catch (e) {
        errors.push("❌ שגיאה: הדפדפן חוסם כתיבה ל-LocalStorage! המשחק לא יישמר.");
    }

    // --- הצגת התוצאות על המסך ---
    const content = document.getElementById('content');
    if (content) {
        const oldDebug = document.getElementById('debug-result-box');
        if (oldDebug) oldDebug.remove();

        const debugDiv = document.createElement('div');
        debugDiv.id = 'debug-result-box';
        debugDiv.className = 'fade-in card';
        
        // עיצוב התיבה
        let baseStyle = "padding:15px; border-radius:12px; margin:10px 0; font-family:sans-serif; font-size:13px; line-height:1.6; border:2px solid ";
        
        if (errors.length > 0) {
            console.error("DEBUG: שגיאות נמצאו!", errors);
            debugDiv.style = baseStyle + "#ef4444; background:rgba(69, 26, 26, 0.95); color:#fca5a5; z-index:10000; position:relative;";
            debugDiv.innerHTML = `<h4 style="margin:0 0 10px 0; color:#fff;">⚠️ באגים קריטיים (אלכסיי, דרוש תיקון):</h4>` + 
                                 `<ul style="padding-right:20px; margin:0;"><li>` + errors.join("</li><li>") + `</li></ul>` +
                                 `<button onclick="this.parentElement.remove()" class="sys-btn" style="margin-top:10px; width:100%; background:#ef4444;">סגור בדיקה</button>`;
        } else {
            console.log("%cDEBUG: הכל תקין ומסונכרן!", "color: #22c55e;");
            debugDiv.style = baseStyle + "#22c55e; background:rgba(6, 78, 59, 0.95); color:#34d399; z-index:10000; position:relative;";
            debugDiv.innerHTML = `<b>✅ מערכת תקינה (v6.7.3):</b><br>כל המשתנים והפונקציות מסונכרנים.<br>` +
                                 `<small style="color:#fbbf24;">${warnings.length > 0 ? "אזהרות: " + warnings.join(", ") : "אין אזהרות"}</small>`;
            
            // סגירה אוטומטית אם הכל תקין
            setTimeout(() => { 
                if(debugDiv) {
                    debugDiv.style.transition = "opacity 0.5s";
                    debugDiv.style.opacity = "0";
                    setTimeout(() => debugDiv.remove(), 500);
                }
            }, 5000);
        }
        
        content.prepend(debugDiv);
    }
}

// הפעלה אוטומטית רק בטעינה הראשונה ליתר ביטחון
window.addEventListener('load', () => {
    setTimeout(() => {
        console.log("Debug Tool Ready. Access via Admin Menu (Option 5)");
    }, 1000);
});
