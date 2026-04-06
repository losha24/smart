/* Smart Money Pro - js/ui.js - v8.1.0 - Firebase Sync + Admin Fix */

let deferredPrompt;
let currentTab = 'home';
let leaderboardPage = 1;
const playersPerPage = 5;

// ============================================================
// אבטחת מנהל וסנכרון Firebase
// ============================================================
function hashStr(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString(16);
}

// פונקציה חדשה: משיכת הגדרות (הודעה וסיסמה) מ-Firebase
async function fetchSystemSettings() {
    try {
        const response = await fetch(FB_URL + '/systemConfig.json');
        const config = await response.json();
        if (config) {
            if (config.adminMsg) window.adminMsgText = config.adminMsg;
            if (config.adminPass) window.serverAdminHash = config.adminPass;
        }
    } catch (err) {
        console.warn("Firebase Sync Offline");
    }
}

function checkAdminPass(input) {
    // בודק מול ההאש מהשרת, אם אין חיבור בודק מול ה-LocalStorage
    const currentHash = window.serverAdminHash || localStorage.getItem('adminPassHash') || hashStr('1234');
    return hashStr(input) === currentHash;
}

const FB_URL = 'https://smart-money-faf43-default-rtdb.europe-west1.firebasedatabase.app';

// קריאה ראשונה להגדרות בטעינה
fetchSystemSettings();

// --- שאר פונקציות ה-Firebase (fbSaveScore, fbGetLeaderboard וכו') נשארות כפי שהיו ---
async function fbSaveScore() {
    try {
        const ld = getLevelData(window.lifeXP || 0);
        const playerName = localStorage.getItem('playerName') || 'שחקן';
        const payload = {
            name: playerName,
            money: Math.floor(window.money || 0),
            level: ld.level,
            ts: Date.now()
        };
        const deviceId = getDeviceId();
        await fetch(FB_URL + '/leaderboard/' + deviceId + '.json', {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
    } catch(e) { console.warn('FB save failed:', e); }
}

async function fbGetLeaderboard() {
    try {
        const res = await fetch(FB_URL + '/leaderboard.json');
        if (!res.ok) return null;
        const data = await res.json();
        if (!data) return [];
        return Object.entries(data)
            .map(([id, p]) => ({ ...p, id }))
            .sort((a, b) => b.money - a.money)
            .slice(0, 50);
    } catch(e) { return null; }
}

function getDeviceId() {
    let id = localStorage.getItem('deviceId');
    if (!id) {
        id = 'dev_' + Math.random().toString(36).substr(2, 12);
        localStorage.setItem('deviceId', id);
    }
    return id;
}

// --- ניהול טאבים ו-UI ---
window.openTab = function(t) {
    const isAuto = new Error().stack.includes('setInterval');
    if (t === currentTab && isAuto) return;
    currentTab = t;
    document.querySelectorAll('.topbar button').forEach(b => b.classList.remove('active'));
    const btnId = 'btn' + t.charAt(0).toUpperCase() + t.slice(1);
    const btn = document.getElementById(btnId);
    if(btn) btn.classList.add('active');
    const c = document.getElementById('content');
    if(!c) return;
    c.style.opacity = '0.5';
    setTimeout(() => {
        c.innerHTML = '';
        const drawFunc = window['draw' + t.charAt(0).toUpperCase() + t.slice(1)];
        if (typeof drawFunc === 'function') drawFunc(c);
        else window.drawHome(c);
        c.style.opacity = '1';
        if(typeof updateUI === 'function') updateUI();
        if (t === 'home') fbSaveScore();
    }, 100);
};

// --- דף הבית ---
window.drawHome = function(c) {
    const ld = (typeof getLevelData === 'function') ? getLevelData(window.lifeXP || 0) : { level: 1, xpInCurrentLevel: 0, xpForNext: 1000, progressPercent: 0 };
    const playerName = localStorage.getItem('playerName') || 'שחקן';

    c.innerHTML = `
        <div class="card fade-in">
            <div id="admin-box" class="admin-box">
                <button class="edit-admin-btn" onclick="window.editAdminMsg()">✏️</button>
                📢 <b>הודעה מהמערכת:</b><br>
                <span style="font-size:13px;">${window.adminMsgText || 'טוען הודעה...'}</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                <h3 style="margin:0;">🏠 מרכז שליטה</h3>
                <button onclick="location.reload();" class="sys-btn">🔄</button>
            </div>
            <div class="card" style="background:rgba(255,255,255,0.03);margin-bottom:15px;padding:12px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:12px;">
                    <span>⭐ רמה <b id="home-level-val">${ld.level}</b></span>
                    <span id="xp-text-detail">${Math.floor(ld.xpInCurrentLevel).toLocaleString()} / ${Math.floor(ld.xpForNext).toLocaleString()} XP</span>
                </div>
                <div style="height:10px;background:rgba(0,0,0,0.3);border-radius:10px;overflow:hidden;">
                    <div id="xp-progress-bar" style="width:${ld.progressPercent}%;height:100%;background:#3b82f6;"></div>
                </div>
            </div>
            <div id="leaderboard-container"></div>
            <button class="sys-btn" style="color:#ef4444;width:100%;margin-top:20px;" onclick="resetGame()">🗑️ איפוס חשבון</button>
        </div>`;
    loadLeaderboard();
};

// ============================================================
// תפריט מנהל - תיקון אופציה 5 והעברה ל-Firebase
// ============================================================
window.editAdminMsg = function() {
    const pass = prompt('שלום! הכנס סיסמת מנהל:');
    if (pass === null) return;
    if (!checkAdminPass(pass)) return alert('סיסמה שגויה!');

    const action = prompt(
        '--- תפריט מנהל ---\n' +
        '1 - עריכת הודעת מערכת (לכולם)\n' +
        '2 - הוספת כסף (Cheat)\n' +
        '3 - הוספת XP (Boost)\n' +
        '4 - שינוי סיסמת מנהל (לכולם)\n' +
        '5 - System Check (בדיקת תקלות)', '1'
    );

    switch(action) {
        case '1': // עדכון הודעה גלובלית ב-Firebase
            const newMsg = prompt('הכנס הודעה חדשה לכל השחקנים:', window.adminMsgText || '');
            if (newMsg !== null) {
                fetch(FB_URL + '/systemConfig/adminMsg.json', {
                    method: 'PUT',
                    body: JSON.stringify(newMsg)
                }).then(() => {
                    window.adminMsgText = newMsg;
                    window.openTab('home');
                });
            }
            break;
            
        case '2':
            const m = prompt('כמה כסף להוסיף?');
            if (m) { window.money += parseInt(m); updateUI(); saveGame(); }
            break;

        case '3':
            const x = prompt('כמה XP להוסיף?');
            if (x) { window.lifeXP += parseInt(x); updateUI(); saveGame(); }
            break;

        case '4': // שינוי סיסמה גלובלית ב-Firebase
            const newPass = prompt('הכנס סיסמה חדשה לכולם:');
            if (newPass && newPass.length >= 4) {
                const newHash = hashStr(newPass);
                fetch(FB_URL + '/systemConfig/adminPass.json', {
                    method: 'PUT',
                    body: JSON.stringify(newHash)
                }).then(() => {
                    window.serverAdminHash = newHash;
                    alert('הסיסמה שונתה בהצלחה בשרת!');
                });
            }
            break;

        case '5': // הפעלת בדיקת המערכת (התיבה האדומה)
            if (typeof window.runSystemCheck === 'function') {
                window.runSystemCheck();
            } else {
                // אם הסקריפט לא נטען, ננסה לטעון אותו שוב ולהפעיל
                const script = document.createElement('script');
                script.src = 'js/debug.js?v=' + Date.now();
                script.onload = () => window.runSystemCheck();
                document.body.appendChild(script);
            }
            break;
    }
};

// אתחול דף בית
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { window.openTab('home'); }, 150);
});
