/* Smart Money Pro - DEBUG & REPAIR TOOL v8.1.0 - Firebase & Estate Edition */

/**
 * פונקציית העזר שנקראת מתוך ui.js (אופציה 5 בתפריט המנהל)
 */
window.runSystemCheck = function() {
    runFullSystemCheck();
};

async function runFullSystemCheck() {
    console.log("%c--- מתחיל בדיקת מערכת Smart Money Pro (v8.1.0) ---", "color: #38bdf8; font-weight: bold; font-size: 14px;");
    
    let errors = [];
    let warnings = [];

    // 1. בדיקת משתני ליבה (האם core.js ומשתני המערכת קיימים?)
    const requiredVars = [
        { name: 'money', type: 'number' },
        { name: 'bank', type: 'number' },
        { name: 'loan', type: 'number' },
        { name: 'lifeXP', type: 'number' },
        { name: 'passive', type: 'number' },
        { name: 'inventory', type: 'object' },
        { name: 'estateData', type: 'object' }, // משתנה קריטי לנדל"ן החדש
        { name: 'FB_URL', type: 'string' }      // מוודא שהגדרת את פיירבייס ב-ui.js
    ];

    requiredVars.forEach(v => {
        if (typeof window[v.name] === 'undefined') {
            errors.push(`❌ משתנה ליבה חסר: <b>${v.name}</b>`);
        } else if (typeof window[v.name] !== v.type) {
            warnings.push(`⚠️ סוג משתנה לא תקין ב-${v.name}: מצפה ל-${v.type}`);
        }
    });

    // 2. בדיקת פונקציות UI (מוודא שכל הקבצים נטענו - economy, activities וכו')
    const requiredFuncs = [
        'drawHome', 'drawWork', 'drawBank', 'drawCars', 
        'updateUI', 'saveGame', 'openTab', 'fbSaveScore'
    ];
    
    requiredFuncs.forEach(f => {
        if (typeof window[f] !== 'function') {
            errors.push(`❌ פונקציה חסרה: <b>${f}()</b> - ייתכן שקובץ JS לא נטען`);
        }
    });

    // 3. בדיקת אלמנטים ב-HTML
    const requiredIDs = ['content', 'money', 'level-progress'];
    requiredIDs.forEach(id => {
        if (!document.getElementById(id)) {
            errors.push(`❌ אלמנט HTML חסר ב-Index: <b>#${id}</b>`);
        }
    });

    // 4. בדיקת חיבור ל-Firebase (בדיקה אסינכרונית מהירה)
    try {
        const fbCheck = await fetch(window.FB_URL + '/.json?shallow=true');
        if (!fbCheck.ok) throw new Error();
        console.log("Firebase Connection: OK");
    } catch (e) {
        errors.push("❌ שגיאת תקשורת: אין חיבור ל-Firebase או שה-URL שגוי.");
    }

    // --- הצגת התוצאות על המסך ---
    const content = document.getElementById('content');
    if (!content) {
        alert("שגיאה קריטית: אלמנט #content לא נמצא בדף!");
        return;
    }

    // ניקוי בדיקה קודמת
    const oldDebug = document.getElementById('debug-result-box');
    if (oldDebug) oldDebug.remove();

    const debugDiv = document.createElement('div');
    debugDiv.id = 'debug-result-box';
    debugDiv.className = 'fade-in card';
    
    // עיצוב התיבה (סגנון תיבת התראה)
    let baseStyle = "padding:20px; border-radius:15px; margin:15px 0; font-family:sans-serif; font-size:14px; line-height:1.6; border:3px solid; box-shadow: 0 10px 25px rgba(0,0,0,0.3);";
    
    if (errors.length > 0) {
        // --- תיבה אדומה לשגיאות ---
        console.error("DEBUG: שגיאות נמצאו!", errors);
        debugDiv.style = baseStyle + " border-color: #ef4444; background: #451a1a; color: #fca5a5; position: relative; z-index: 9999;";
        debugDiv.innerHTML = `
            <h3 style="margin:0 0 10px 0; color:#fff; display:flex; align-items:center;">
                <span style="font-size:24px; margin-left:10px;">⚠️</span> נמצאו תקלות במערכת
            </h3>
            <ul style="padding-right:25px; margin:0; text-align:right; direction:rtl;">
                <li>${errors.join("</li><li>")}</li>
            </ul>
            <div style="margin-top:15px; border-top:1px solid rgba(255,255,255,0.1); padding-top:10px;">
                <p style="font-size:12px; color:#fff; opacity:0.8;">אלכסיי, בדוק את ה-Console (F12) לפרטים נוספים.</p>
                <button onclick="this.parentElement.parentElement.remove()" class="sys-btn" style="width:100%; background:#ef4444; color:#fff; border:none; padding:10px; border-radius:8px; cursor:pointer;">סגור בדיקה</button>
            </div>
        `;
    } else {
        // --- תיבה ירוקה להצלחה ---
        console.log("%cDEBUG: הכל תקין!", "color: #22c55e;");
        debugDiv.style = baseStyle + " border-color: #22c55e; background: #064e3b; color: #34d399; position: relative; z-index: 9999;";
        debugDiv.innerHTML = `
            <div style="text-align:center;">
                <b style="font-size:18px; color:#fff;">✅ מערכת תקינה (v8.1.0)</b><br>
                <span>כל המשתנים והפונקציות מסונכרנים מול Firebase.</span>
                ${warnings.length > 0 ? `<br><small style="color:#fbbf24;">אזהרות: ${warnings.join(", ")}</small>` : ''}
            </div>
        `;
        
        // סגירה אוטומטית רק אם הכל תקין
        setTimeout(() => { 
            if(debugDiv) {
                debugDiv.style.transition = "all 0.5s ease";
                debugDiv.style.opacity = "0";
                debugDiv.style.transform = "translateY(-20px)";
                setTimeout(() => debugDiv.remove(), 500);
            }
        }, 4000);
    }
    
    // הזרקת התיבה לראש התוכן
    content.prepend(debugDiv);
    // גלילה אוטומטית לראש הבדיקה
    debugDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// הודעת מוכנות בלוג
console.log("🛠️ Debug Tool v8.1.0 Loaded. Use Option 5 in Admin Menu.");
