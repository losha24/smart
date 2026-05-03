/* Smart Money Pro - js/ui.js - v9.0.0 - Admin Panel Modal + Firebase */

let deferredPrompt;
let currentTab = 'home';
let leaderboardPage = 1;
const playersPerPage = 5;

// ============================================================
// אבטחה - hash djb2
// ============================================================
function hashStr(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString(16);
}
const DEFAULT_HASH = hashStr('1234');
if (!localStorage.getItem('adminPassHash')) {
    localStorage.setItem('adminPassHash', DEFAULT_HASH);
}
function checkAdminPass(input) {
    return hashStr(input) === localStorage.getItem('adminPassHash');
}

// ============================================================
// Firebase
// ============================================================
const FB_URL = 'https://smart-money-faf43-default-rtdb.europe-west1.firebasedatabase.app';

async function fbSaveScore() {
    try {
        const ld = getLevelData(window.lifeXP || 0);
        const deviceId = getDeviceId();
        await fetch(FB_URL + '/leaderboard/' + deviceId + '.json', {
            method: 'PUT',
            body: JSON.stringify({
                name: localStorage.getItem('playerName') || 'שחקן',
                money: Math.floor(window.money || 0),
                level: ld.level,
                ts: Date.now()
            })
        });
    } catch(e) { console.warn('FB score save failed:', e); }
}

async function fbGetLeaderboard() {
    try {
        const res = await fetch(FB_URL + '/leaderboard.json');
        if (!res.ok) return null;
        const data = await res.json();
        if (!data) return [];
        return Object.entries(data)
            .map(([id, p]) => ({ ...p, id }))
            .sort((a, b) => b.level - a.level || b.money - a.money)
            .slice(0, 50);
    } catch(e) { return null; }
}

function getDeviceId() {
    let id = localStorage.getItem('deviceId');
    if (!id) { id = 'dev_' + Math.random().toString(36).substr(2, 12); localStorage.setItem('deviceId', id); }
    return id;
}

async function fbSaveAdminMsg(msg) {
    try {
        await fetch(FB_URL + '/config/adminMsg.json', { method: 'PUT', body: JSON.stringify({ text: msg, ts: Date.now() }) });
    } catch(e) { console.warn('FB msg save failed:', e); }
}
async function fbLoadAdminMsg() {
    try {
        const res = await fetch(FB_URL + '/config/adminMsg.json');
        const data = await res.json();
        return data ? data.text : null;
    } catch(e) { return null; }
}
async function fbSaveAdminPass(hashVal) {
    try {
        await fetch(FB_URL + '/config/adminPassHash.json', { method: 'PUT', body: JSON.stringify({ hash: hashVal, ts: Date.now() }) });
    } catch(e) { console.warn('FB pass save failed:', e); }
}
async function fbLoadAdminPass() {
    try {
        const res = await fetch(FB_URL + '/config/adminPassHash.json');
        const data = await res.json();
        return data ? data.hash : null;
    } catch(e) { return null; }
}
async function fbLoadConfig() {
    const [msg, passHash] = await Promise.all([fbLoadAdminMsg(), fbLoadAdminPass()]);
    if (msg) window.adminMsgText = msg;
    if (passHash) localStorage.setItem('adminPassHash', passHash);
}

async function fbDeletePlayer(deviceId) {
    try {
        await fetch(FB_URL + '/leaderboard/' + deviceId + '.json', { method: 'DELETE' });
        return true;
    } catch(e) { return false; }
}

async function fbResetLeaderboard() {
    try {
        await fetch(FB_URL + '/leaderboard.json', { method: 'DELETE' });
        return true;
    } catch(e) { return false; }
}

// ============================================================
// Modal אישור מכירה
// ============================================================
window.showConfirmModal = function(title, bodyHtml, onConfirm) {
    const existing = document.getElementById('confirmModal');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'confirmModal';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;justify-content:center;align-items:center;';
    overlay.innerHTML =
        '<div style="width:85%;max-width:320px;background:#1e293b;border-radius:15px;border:1px solid #ef4444;padding:25px;text-align:center;">' +
        '<div style="font-size:18px;font-weight:bold;margin-bottom:12px;color:#fff;">' + title + '</div>' +
        '<div style="font-size:13px;color:#cbd5e1;margin-bottom:20px;line-height:1.6;">' + bodyHtml + '</div>' +
        '<div style="display:flex;gap:10px;">' +
        '<button id="confirmModalCancel" style="flex:1;padding:12px;border-radius:8px;border:1px solid #64748b;background:transparent;color:#94a3b8;font-size:13px;cursor:pointer;">ביטול</button>' +
        '<button id="confirmModalYes" style="flex:1;padding:12px;border-radius:8px;border:none;background:#ef4444;color:#fff;font-size:13px;font-weight:bold;cursor:pointer;">אשר מכירה</button>' +
        '</div></div>';
    document.body.appendChild(overlay);
    document.getElementById('confirmModalCancel').onclick = function() { overlay.remove(); };
    document.getElementById('confirmModalYes').onclick = function() { overlay.remove(); onConfirm(); };
};

// ============================================================
// פאנל ניהול - modal מלא ללא prompt()
// ============================================================
window.openAdminPanel = function() {
    const existing = document.getElementById('adminModal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'adminModal';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);z-index:99999;display:flex;justify-content:center;align-items:flex-start;overflow-y:auto;padding:20px 0;';

    overlay.innerHTML =
        '<div style="width:90%;max-width:360px;background:#0f172a;border-radius:16px;border:1px solid #3b82f6;padding:20px;margin:auto;">' +

        // כותרת + סגירה
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">' +
        '<div style="font-size:17px;font-weight:bold;color:#3b82f6;">🛡️ פאנל ניהול</div>' +
        '<button id="adminClose" style="background:none;border:none;color:#64748b;font-size:20px;cursor:pointer;">✕</button>' +
        '</div>' +

        // שלב 1 - כניסה (Google או סיסמה)
        '<div id="adminLoginStep">' +
        '<button onclick="window.adminSignIn && window.adminSignIn()" style="width:100%;padding:12px;background:#4285f4;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:bold;cursor:pointer;margin-bottom:10px;">🔵 כניסה עם Google (מנהל)</button>' +
        '<div style="font-size:11px;color:#475569;text-align:center;margin-bottom:10px;">— או כניסה עם סיסמה —</div>' +
        '<input id="adminPassInput" type="password" placeholder="סיסמת מנהל" style="width:100%;padding:12px;background:#1e293b;color:#fff;border:1px solid #334155;border-radius:8px;font-size:14px;text-align:center;margin-bottom:12px;">' +
        '<button id="adminLoginBtn" style="width:100%;padding:12px;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:bold;cursor:pointer;">כניסה עם סיסמה</button>' +
        '<div id="adminLoginErr" style="color:#ef4444;font-size:12px;text-align:center;margin-top:8px;display:none;">סיסמה שגויה!</div>' +
        '</div>' +

        // שלב 2 - פאנל (מוסתר בהתחלה)
        '<div id="adminPanelStep" style="display:none;">' +

        // הודעת מערכת
        '<div style="background:#1e293b;border-radius:10px;padding:14px;margin-bottom:12px;border:1px solid #334155;">' +
        '<div style="font-size:12px;color:#94a3b8;margin-bottom:8px;">📢 הודעת מערכת (תופיע לכולם)</div>' +
        '<textarea id="adminMsgInput" rows="3" style="width:100%;padding:10px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:8px;font-size:13px;resize:none;">' + (window.adminMsgText || '') + '</textarea>' +
        '<button id="adminSaveMsg" style="width:100%;padding:10px;background:#22c55e;color:#000;border:none;border-radius:8px;font-size:13px;font-weight:bold;cursor:pointer;margin-top:8px;">💾 שמור הודעה</button>' +
        '</div>' +

        // כסף ו-XP
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">' +
        '<div style="background:#1e293b;border-radius:10px;padding:12px;border:1px solid #334155;">' +
        '<div style="font-size:11px;color:#94a3b8;margin-bottom:6px;">💰 הוסף כסף</div>' +
        '<input id="adminMoneyInput" type="number" placeholder="סכום" style="width:100%;padding:8px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:6px;font-size:13px;margin-bottom:8px;">' +
        '<button id="adminAddMoney" style="width:100%;padding:8px;background:#f59e0b;color:#000;border:none;border-radius:6px;font-size:12px;font-weight:bold;cursor:pointer;">הוסף</button>' +
        '</div>' +
        '<div style="background:#1e293b;border-radius:10px;padding:12px;border:1px solid #334155;">' +
        '<div style="font-size:11px;color:#94a3b8;margin-bottom:6px;">⭐ הוסף XP</div>' +
        '<input id="adminXpInput" type="number" placeholder="כמות" style="width:100%;padding:8px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:6px;font-size:13px;margin-bottom:8px;">' +
        '<button id="adminAddXp" style="width:100%;padding:8px;background:#a855f7;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:bold;cursor:pointer;">הוסף</button>' +
        '</div>' +
        '</div>' +

        // סטטיסטיקות
        '<div style="background:#1e293b;border-radius:10px;padding:12px;margin-bottom:12px;border:1px solid #334155;">' +
        '<div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">📊 סטטיסטיקות מערכת</div>' +
        '<div id="adminStats" style="font-size:12px;color:#cbd5e1;line-height:1.9;"></div>' +
        '</div>' +

        // שינוי סיסמה
        '<div style="background:#1e293b;border-radius:10px;padding:14px;margin-bottom:12px;border:1px solid #334155;">' +
        '<div style="font-size:12px;color:#94a3b8;margin-bottom:8px;">🔐 שינוי סיסמת מנהל</div>' +
        '<input id="adminNewPass1" type="password" placeholder="סיסמה חדשה" style="width:100%;padding:10px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:8px;font-size:13px;margin-bottom:8px;">' +
        '<input id="adminNewPass2" type="password" placeholder="אשר סיסמה" style="width:100%;padding:10px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:8px;font-size:13px;margin-bottom:8px;">' +
        '<button id="adminChangePass" style="width:100%;padding:10px;background:#ef4444;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:bold;cursor:pointer;">🔐 שנה סיסמה</button>' +
        '<div id="adminPassMsg" style="font-size:12px;text-align:center;margin-top:6px;"></div>' +
        '</div>' +

        // ניהול דירוג
        '<div style="background:#1e293b;border-radius:10px;padding:14px;margin-bottom:12px;border:1px solid #334155;">' +
        '<div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">🏆 ניהול דירוג עולמי</div>' +
        '<input id="adminDeleteId" type="text" placeholder="Device ID של שחקן למחיקה" style="width:100%;padding:10px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:8px;font-size:12px;margin-bottom:8px;">' +
        '<div id="adminLbPlayers" style="max-height:180px;overflow-y:auto;margin-bottom:8px;"></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
        '<button id="adminLoadPlayers" style="padding:10px;background:rgba(56,189,248,0.1);color:#38bdf8;border:1px solid #38bdf8;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;">📋 טען שחקנים</button>' +
        '<button id="adminDeletePlayer" style="padding:10px;background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid #ef4444;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;">🗑️ מחק שחקן</button>' +
        '</div>' +
        '<button id="adminResetLb" style="width:100%;padding:10px;background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid #ef4444;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;margin-top:8px;">⚠️ איפוס דירוג מלא</button>' +
        '</div>' +

        // עריכת שחקן
        '<div style="background:#1e293b;border-radius:10px;padding:14px;margin-bottom:12px;border:1px solid #334155;">' +
        '<div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">✏️ עריכת שחקן</div>' +
        '<div style="font-size:11px;color:#64748b;margin-bottom:8px;">לחץ על שחקן ברשימה למעלה, ואז ערוך:</div>' +
        '<input id="adminEditName" type="text" placeholder="שם חדש" style="width:100%;padding:10px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:8px;font-size:13px;margin-bottom:8px;">' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">' +
        '<input id="adminEditMoney" type="number" placeholder="כסף חדש" style="padding:10px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:8px;font-size:13px;width:100%;">' +
        '<input id="adminEditXp" type="number" placeholder="XP חדש" style="padding:10px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:8px;font-size:13px;width:100%;">' +
        '</div>' +
        '<div id="adminEditTarget" style="font-size:11px;color:#f59e0b;margin-bottom:8px;">לא נבחר שחקן</div>' +
        '<button id="adminSavePlayer" style="width:100%;padding:10px;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:bold;cursor:pointer;">💾 שמור שינויים לשחקן</button>' +
        '<div id="adminEditMsg" style="font-size:12px;text-align:center;margin-top:6px;"></div>' +
        '</div>' +

        // בדיקת מערכת + איפוס
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">' +
        '<button id="adminDebug" style="padding:12px;background:rgba(56,189,248,0.1);color:#38bdf8;border:1px solid #38bdf8;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;">🔧 בדיקת מערכת</button>' +
        '<button id="adminReset" style="padding:12px;background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid #ef4444;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;">🗑️ איפוס מלא</button>' +
        '</div>' +

        '</div>' + // adminPanelStep
        '</div>'; // card

    document.body.appendChild(overlay);

    // סגירה
    document.getElementById('adminClose').onclick = function() { overlay.remove(); };
    overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

    // כניסה עם סיסמה
    const passInput = document.getElementById('adminPassInput');
    passInput.focus();
    passInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') document.getElementById('adminLoginBtn').click(); });

    document.getElementById('adminLoginBtn').onclick = function() {
        const pass = document.getElementById('adminPassInput').value;
        if (!checkAdminPass(pass)) {
            document.getElementById('adminLoginErr').style.display = 'block';
            passInput.value = '';
            passInput.focus();
            return;
        }
        document.getElementById('adminLoginStep').style.display = 'none';
        document.getElementById('adminPanelStep').style.display = 'block';

        // טען סטטיסטיקות
        const ld = getLevelData(window.lifeXP || 0);
        const totalPlayers = window.lbAllPlayersCount || '?';
        document.getElementById('adminStats').innerHTML =
            '💰 כסף במשחק: <b>' + Math.floor(window.money || 0).toLocaleString() + '₪</b><br>' +
            '🏦 בבנק: <b>' + Math.floor(window.bank || 0).toLocaleString() + '₪</b><br>' +
            '⭐ רמה: <b>' + ld.level + '</b> (' + Math.floor(ld.xpInCurrentLevel).toLocaleString() + '/' + Math.floor(ld.xpForNext).toLocaleString() + ' XP)<br>' +
            '🚀 פסיבי: <b>' + (window.passive || 0).toFixed(1) + '₪/ד\'</b><br>' +
            '🏦 חוב: <b>' + Math.floor(window.loan || 0).toLocaleString() + '₪</b><br>' +
            '🏠 נדל"ן: <b>' + Object.values(window.estateData || {}).filter(e => e.count > 0).length + ' נכסים</b><br>' +
            '🚗 רכבים: <b>' + (window.cars || []).length + '</b>';
    };

    // שמור הודעה
    document.getElementById('adminSaveMsg').onclick = async function() {
        const msg = document.getElementById('adminMsgInput').value.trim();
        if (!msg) return;
        window.adminMsgText = msg;
        this.innerText = '⏳ שומר...';
        this.disabled = true;
        await fbSaveAdminMsg(msg);
        this.innerText = '✅ נשמר לכולם!';
        this.style.background = '#3b82f6';
        setTimeout(() => { this.innerText = '💾 שמור הודעה'; this.style.background = '#22c55e'; this.disabled = false; }, 2000);
        if (typeof window.openTab === 'function') window.openTab('home');
    };

    // הוסף כסף
    document.getElementById('adminAddMoney').onclick = function() {
        const amt = parseInt(document.getElementById('adminMoneyInput').value);
        if (!amt || amt <= 0) return;
        window.money += amt;
        if(typeof updateUI === 'function') updateUI();
        if(typeof saveGame === 'function') saveGame();
        if(typeof showMsg === 'function') showMsg
('💰 נוספו ' + amt.toLocaleString() + '₪', 'var(--yellow)');
        document.getElementById('adminMoneyInput').value = '';
    };

    // הוסף XP
    document.getElementById('adminAddXp').onclick = function() {
        const amt = parseInt(document.getElementById('adminXpInput').value);
        if (!amt || amt <= 0) return;
        window.lifeXP += amt;
        if(typeof updateUI === 'function') updateUI();
        if(typeof saveGame === 'function') saveGame();
        if(typeof showMsg === 'function') showMsg('⭐ נוספו ' + amt.toLocaleString() + ' XP', 'var(--purple)');
        document.getElementById('adminXpInput').value = '';
    };

    // שנה סיסמה
    document.getElementById('adminChangePass').onclick = async function() {
        const p1 = document.getElementById('adminNewPass1').value;
        const p2 = document.getElementById('adminNewPass2').value;
        const msgEl = document.getElementById('adminPassMsg');
        if (p1.length < 4) { msgEl.style.color = '#ef4444'; msgEl.innerText = 'סיסמה קצרה מדי (מינימום 4)'; return; }
        if (p1 !== p2) { msgEl.style.color = '#ef4444'; msgEl.innerText = 'הסיסמאות לא תואמות!'; return; }
        const newHash = hashStr(p1);
        localStorage.setItem('adminPassHash', newHash);
        this.innerText = '⏳ שומר...';
        await fbSaveAdminPass(newHash);
        msgEl.style.color = '#22c55e';
        msgEl.innerText = '✅ סיסמה שונתה ונשמרה!';
        document.getElementById('adminNewPass1').value = '';
        document.getElementById('adminNewPass2').value = '';
        this.innerText = '🔐 שנה סיסמה';
    };

    // בדיקת מערכת
    document.getElementById('adminDebug').onclick = function() {
        const script = document.createElement('script');
        script.src = 'js/debug.js?v=' + Date.now();
        document.body.appendChild(script);
        if(typeof showMsg === 'function') showMsg('🔧 בדיקת מערכת הופעלה', 'var(--blue)');
    };

    // איפוס מלא
    document.getElementById('adminReset').onclick = function() {
        showConfirmModal(
            '🗑️ איפוס מלא',
            'כל ההתקדמות תימחק לצמיתות!<br><br>האם אתה בטוח?',
            function() {
                overlay.remove();
                if (typeof resetGame === 'function') resetGame();
            }
        );
    };

    // מאגר שחקנים לעריכה
    let adminLoadedPlayers = [];

    // טען רשימת שחקנים
    document.getElementById('adminLoadPlayers').onclick = async function() {
        const listEl = document.getElementById('adminLbPlayers');
        listEl.innerHTML = '<div style="text-align:center;opacity:0.5;font-size:12px;padding:8px;">⏳ טוען...</div>';
        const players = await fbGetLeaderboard();
        if (!players || players.length === 0) {
            listEl.innerHTML = '<div style="text-align:center;opacity:0.5;font-size:12px;padding:8px;">אין שחקנים</div>';
            return;
        }
        adminLoadedPlayers = players;
        listEl.innerHTML = players.map(p =>
            '<div data-pid="' + p.id + '" class="lb-player-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:#0f172a;border-radius:6px;margin-bottom:4px;font-size:11px;cursor:pointer;border:1px solid transparent;">' +
            '<span style="color:#fff;">' + p.name + ' (רמה ' + p.level + ')</span>' +
            '<span style="color:#22c55e;">' + Math.floor(p.money).toLocaleString() + '₪</span>' +
            '</div>'
        ).join('');
        // לחיצה על שורה - בחירת שחקן לעריכה ומחיקה
        listEl.querySelectorAll('.lb-player-row').forEach(function(row) {
            row.onclick = function() {
                // הסר highlight קודם
                listEl.querySelectorAll('.lb-player-row').forEach(r => r.style.borderColor = 'transparent');
                this.style.borderColor = '#3b82f6';
                const pid = this.getAttribute('data-pid');
                document.getElementById('adminDeleteId').value = pid;
                // מלא שדות עריכה
                const player = adminLoadedPlayers.find(p => p.id === pid);
                if (player) {
                    document.getElementById('adminEditName').value = player.name || '';
                    document.getElementById('adminEditMoney').value = Math.floor(player.money) || 0;
                    document.getElementById('adminEditXp').value = '';
                    document.getElementById('adminEditTarget').innerText = 'נבחר: ' + player.name;
                    document.getElementById('adminEditMsg').innerText = '';
                }
            };
        });
    };

    // מחק שחקן ספציפי
    document.getElementById('adminDeletePlayer').onclick = function() {
        const id = document.getElementById('adminDeleteId').value.trim();
        if (!id) { if(typeof showMsg === 'function') showMsg('הכנס Device ID', 'var(--red)'); return; }
        showConfirmModal(
            '🗑️ מחיקת שחקן',
            'למחוק את השחקן עם ID:<br><b style="font-size:11px;word-break:break-all;">' + id + '</b>?',
            async function() {
                const ok = await fbDeletePlayer(id);
                if(typeof showMsg === 'function') showMsg(ok ? '✅ שחקן נמחק!' : '❌ שגיאה במחיקה', ok ? 'var(--green)' : 'var(--red)');
                document.getElementById('adminDeleteId').value = '';
                document.getElementById('adminLbPlayers').innerHTML = '';
            }
        );
    };

    // איפוס דירוג מלא
    document.getElementById('adminResetLb').onclick = function() {
        showConfirmModal(
            '⚠️ איפוס דירוג מלא',
            'כל השחקנים יימחקו מהדירוג!<br><br>האם אתה בטוח לחלוטין?',
            async function() {
                const ok = await fbResetLeaderboard();
                if(typeof showMsg === 'function') showMsg(ok ? '✅ הדירוג אופס!' : '❌ שגיאה', ok ? 'var(--green)' : 'var(--red)');
                lbAllPlayers = [];
            }
        );
    };

    // שמירת עריכת שחקן ל-Firebase
    document.getElementById('adminSavePlayer').onclick = async function() {
        const pid = document.getElementById('adminDeleteId').value.trim();
        const msgEl = document.getElementById('adminEditMsg');
        if (!pid) { msgEl.style.color = '#ef4444'; msgEl.innerText = 'בחר שחקן מהרשימה קודם'; return; }

        const player = adminLoadedPlayers.find(p => p.id === pid);
        if (!player) { msgEl.style.color = '#ef4444'; msgEl.innerText = 'שחקן לא נמצא — טען שחקנים שוב'; return; }

        const newName = document.getElementById('adminEditName').value.trim();
        const newMoney = parseInt(document.getElementById('adminEditMoney').value);
        const addXp = parseInt(document.getElementById('adminEditXp').value) || 0;

        const updated = {
            name: newName || player.name,
            money: isNaN(newMoney) ? player.money : newMoney,
            level: player.level,
            ts: Date.now()
        };
        // חישוב רמה חדשה אם הוסיף XP (לא נשמר XP בדירוג, רק רמה)
        if (addXp > 0 && typeof getLevelData === 'function') {
            const fakeXp = (player.level * 1000) + addXp;
            updated.level = getLevelData(fakeXp).level;
        }

        this.innerText = '⏳ שומר...';
        this.disabled = true;
        try {
            await fetch(FB_URL + '/leaderboard/' + pid + '.json', {
                method: 'PUT',
                body: JSON.stringify(updated)
            });
            msgEl.style.color = '#22c55e';
            msgEl.innerText = '✅ נשמר בהצלחה!';
            // עדכן מקומי
            player.name = updated.name;
            player.money = updated.money;
            player.level = updated.level;
        } catch(e) {
            msgEl.style.color = '#ef4444';
            msgEl.innerText = '❌ שגיאה בשמירה';
        }
        this.innerText = '💾 שמור שינויים לשחקן';
        this.disabled = false;
    };
};

// ============================================================
// PWA install
// ============================================================
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    renderInstallBtn();
});

// ============================================================
// עדכון UI
// ============================================================
function renderUIUpdate(ld) {
    if (!ld && typeof getLevelData === 'function') ld = getLevelData(window.lifeXP || 0);
    if (currentTab === 'home' && ld) {
        const passiveEl = document.getElementById('passive-display');
        const progressEl = document.getElementById('xp-progress-bar');
        const xpTextEl = document.getElementById('xp-text-detail');
        const levelValEl = document.getElementById('home-level-val');
        if (passiveEl) passiveEl.innerText = (window.passive || 0).toLocaleString(undefined, {minimumFractionDigits:1, maximumFractionDigits:1}) + ' ₪/ד\'';
        if (progressEl) progressEl.style.width = ld.progressPercent + '%';
        if (xpTextEl) xpTextEl.innerText = Math.floor(ld.xpInCurrentLevel).toLocaleString() + ' / ' + Math.floor(ld.xpForNext).toLocaleString() + ' XP';
        if (levelValEl) levelValEl.innerText = ld.level;
    }
}

// ============================================================
// ניווט
// ============================================================
window.openTab = function(t) {
    const isAuto = new Error().stack.includes('setInterval');
    if (t === currentTab && isAuto) return;
    
    currentTab = t;

    // --- טיפול בצבע הכפתורים (Active State) ---
    document.querySelectorAll('.topbar button').forEach(b => b.classList.remove('active'));
    
    // בונה את ה-ID לפי שם הטאב (למשל btnHome, btnBlack, btnWork)
    const btnId = 'btn' + t.charAt(0).toUpperCase() + t.slice(1);
    const btn = document.getElementById(btnId);
    if(btn) btn.classList.add('active');

    const c = document.getElementById('content');
    if(!c) return;

    // --- טיפול בתוכן ---
    c.style.opacity = '0.5';
    setTimeout(() => {
        c.innerHTML = '';

        // בדיקה אם זה שוק שחור - מפעיל את הפונקציה המיוחדת שלו
        if (t === 'black') {
            if (typeof renderBlackMarket === 'function') {
                renderBlackMarket();
            }
        } else {
            // לוגיקה רגילה לשאר הטאבים (בית, עבודות וכו')
            const drawFunc = window['draw' + t.charAt(0).toUpperCase() + t.slice(1)];
            if (typeof drawFunc === 'function') {
                drawFunc(c);
            } else {
                window.drawHome(c);
            }
        }

        c.style.opacity = '1';
        if (t !== 'invest') window.scrollTo(0,0);
        if(typeof updateUI === 'function') updateUI();
        if (t === 'home') fbSaveScore();
    }, 100);
    
    // שורה להוספה: שמירת הטאב הנוכחי בזיכרון
    localStorage.setItem('lastTab', t);
};


// --- הוספת מאגר טיפים ---
window.gameTips = [
    "השקעה בנדל\"ן היא הדרך הכי טובה לייצר הכנסה פסיבית בזמן שאתה ישן.",
    "שים לב ל-'חום משטרה' – אם הוא גבוה מדי, המשטרה תחרים לך כסף שחור!",
    "שדרוג אנשי צוות בעבודות מגדיל את הרווח שלך משמעותית בכל פעולה.",
    "אל תשאיר חובות לבנק – הריבית תאכל לך את הרווחים לאורך זמן.",
    "המתנה היומית מתאפסת כל 4 שעות – נצל אותה כדי לקבל עד 100,000₪!",
    "רכבים מהירים פותחים אפשרויות לעבודות יוקרתיות ורווחיות יותר."
];

// --- פונקציית ציור טאב המדריך ---
window.drawGuide = function(c) {
    const randomTip = window.gameTips[Math.floor(Math.random() * window.gameTips.length)];

    c.innerHTML = `
        <div class="card fade-in" style="border-top: 3px solid var(--blue);">
            <h3 style="margin-top:0;">📖 מדריך למליונר המתחיל</h3>
            
            <div style="background:rgba(59,130,246,0.1); border-right:4px solid var(--blue); padding:15px; margin-bottom:20px; border-radius:8px;">
                <small style="color:var(--blue); font-weight:bold; display:block; margin-bottom:5px;">💡 טיפ:</small>
                <div style="font-size:14px; color:#fff; font-style:italic;">"${randomTip}"</div>
            </div>

            <div style="display:grid; gap:15px;">
                <div class="card" style="margin:0; background:rgba(34,197,94,0.05); border:1px solid rgba(34,197,94,0.2);">
                    <h4 style="margin:0 0 5px 0; color:var(--green);">🔋 שלב 1: התחלה אקטיבית</h4>
                    <p style="margin:0; font-size:13px; color:#cbd5e1;">
                        כנס ל<b>עבודות</b>. כל לחיצה נותנת כסף ו-XP. השתמש ב-XP כדי לעלות רמות ולקבל בונוסים של אלפי שקלים.
                    </p>
                </div>

                <div class="card" style="margin:0; background:rgba(59,130,246,0.05); border:1px solid rgba(59,130,246,0.2);">
                    <h4 style="margin:0 0 5px 0; color:var(--blue);">🏠 שלב 2: הכנסה פסיבית</h4>
                    <p style="margin:0; font-size:13px; color:#cbd5e1;">
                        אל תבזבז הכל על רכבים! קנה <b>נדל"ן</b> ו<b>עסקים</b>. הם מייצרים לך כסף כל דקה, גם כשאתה לא לוחץ.
                    </p>
                </div>

                <div class="card" style="margin:0; background:rgba(239,68,68,0.05); border:1px solid rgba(239,68,68,0.2);">
                    <h4 style="margin:0 0 5px 0; color:#ef4444;">🕶️ שלב 3: השוק השחור</h4>
                    <p style="margin:0; font-size:13px; color:#cbd5e1;">
                        הרווח הכי גדול נמצא שם, אבל זהירות - המשטרה יכולה להחרים לך את ה<b>כסף השחור</b>. תלבין אותו בבנק כדי לשמור עליו.
                    </p>
                </div>
            </div>

            <button class="sys-btn" style="width:100%; margin-top:20px; padding:12px;" onclick="window.openTab('home')">חזרה למסך הבית</button>
        </div>
    `;
};


// ============================================================
// דף הבית
// ============================================================
let lbAllPlayersCount = 0;

window.drawHome = function(c) {
    const ld = (typeof getLevelData === 'function')
               ? getLevelData(window.lifeXP || 0)
               : { level:1, xpInCurrentLevel:0, xpForNext:1000, progressPercent:0 };
    const playerName = localStorage.getItem('playerName') || 'שחקן';

    c.innerHTML =
        '<div class="card fade-in">' +

        // הודעת מערכת + כפתור ניהול
        '<div id="admin-box" class="admin-box">' +
        '<button class="edit-admin-btn" onclick="window.openAdminPanel()" title="פאנל ניהול">⚙️</button>' +
        '📢 <b>הודעה מהמערכת:</b><br>' +
        '<span style="font-size:13px;">' + (window.adminMsgText || 'ברוכים הבאים!') + '</span>' +
        '</div>' +

        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">' +
        '<h3 style="margin:0;">🏠 מרכז שליטה</h3>' +
        '<button onclick="location.reload();" class="sys-btn" style="padding:5px 12px;font-size:12px;">🔄</button></div>' +

        // XP בר
        '<div class="card" style="background:rgba(255,255,255,0.03);margin-bottom:15px;padding:12px;">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:12px;">' +
        '<span>⭐ רמת חיים <b id="home-level-val">' + ld.level + '</b></span>' +
        '<span id="xp-text-detail" style="opacity:0.8;">' + Math.floor(ld.xpInCurrentLevel).toLocaleString() + ' / ' + Math.floor(ld.xpForNext).toLocaleString() + ' XP</span></div>' +
        '<div style="height:10px;background:rgba(0,0,0,0.3);border-radius:10px;overflow:hidden;">' +
        '<div id="xp-progress-bar" style="width:' + ld.progressPercent + '%;height:100%;background:linear-gradient(90deg,#3b82f6,#60a5fa);transition:width 0.4s ease;"></div></div></div>' +

        // בונוס יומי
        '<div class="card" style="background:rgba(245,158,11,0.05);border:1px solid rgba(245,158,11,0.3);text-align:center;padding:15px;margin-bottom:15px;">' +
        '<button id="giftBtn" onclick="claimDailyGift()" style="width:100%;background:var(--yellow);color:#000;font-weight:bold;border:none;padding:12px;border-radius:8px;font-size:14px;cursor:pointer;">🎁 קבלת בונוס</button>' +
        '<div id="giftTimer" style="font-size:12px;margin-top:8px;color:var(--yellow);font-weight:bold;">טוען...</div></div>' +

        // פסיבי + חוב
        '<div class="grid-2" style="margin-bottom:15px;">' +
        '<div class="card" style="margin:0;padding:12px;text-align:center;border:1px solid rgba(34,197,94,0.2);">' +
        '<small style="opacity:0.7;font-size:10px;display:block;margin-bottom:4px;">💰 הכנסה פסיבית</small>' +
        '<b id="passive-display" style="color:#22c55e;font-size:15px;">' + (window.passive || 0).toFixed(1) + ' ₪/ד\'</b></div>' +
        '<div class="card" style="margin:0;padding:12px;text-align:center;border:1px solid rgba(239,68,68,0.2);">' +
        '<small style="opacity:0.7;font-size:10px;display:block;margin-bottom:4px;">🏦 חוב לבנק</small>' +
        '<b style="color:#ef4444;font-size:15px;">' + (window.loan || 0).toLocaleString() + ' ₪</b></div></div>' +

        // שם שחקן
        '<div class="card" style="padding:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);margin-bottom:15px;">' +
        '<div style="display:flex;gap:8px;align-items:center;">' +
        '<input id="nameInput" type="text" value="' + playerName + '" placeholder="השם שלך בדירוג" maxlength="20" style="flex:1;padding:8px;background:#000;color:#fff;border:1px solid #333;border-radius:6px;font-size:13px;">' +
        '<button class="sys-btn" style="padding:8px 14px;" onclick="saveName()">💾</button></div></div>' +

        // לידרבורד
        '<div class="card" style="padding:12px;background:rgba(255,255,255,0.02);">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
        '<small style="opacity:0.6;font-weight:bold;">🏆 דירוג עולמי אמיתי</small>' +
        '<button class="sys-btn" style="font-size:10px;padding:4px 8px;" onclick="refreshLeaderboard()">🔄 רענן</button></div>' +
        '<div id="leaderboard-container"><div style="text-align:center;opacity:0.5;padding:20px;">⏳ טוען דירוג...</div></div>' +
        '<div style="display:flex;justify-content:center;align-items:center;gap:15px;margin-top:12px;">' +
        '<button onclick="changeLPage(-1)" id="lbPrev" class="sys-btn" style="padding:5px 15px;">◀</button>' +
        '<span id="lbPageInfo" style="font-size:13px;font-weight:bold;">1 / 1</span>' +
        '<button onclick="changeLPage(1)" id="lbNext" class="sys-btn" style="padding:5px 15px;">▶</button></div></div>' +

        '<div id="install-container" style="margin-top:20px;"></div>' +
        '<button class="sys-btn" style="border:1px solid #451a1a;color:#ef4444;margin-top:15px;font-size:11px;padding:10px;width:100%;opacity:0.7;" onclick="if(confirm(\'לאפס הכל?\')) resetGame()">🗑️ איפוס חשבון</button>' +
        '</div>';

    startGiftTimer();
    renderInstallBtn();
    loadLeaderboard();
};

// ============================================================
// לידרבורד
// ============================================================
let lbAllPlayers = [];

async function loadLeaderboard() {
    const cont = document.getElementById('leaderboard-container');
    if (!cont) return;
    const players = await fbGetLeaderboard();
    if (players === null) {
        const ld = getLevelData(window.lifeXP || 0);
        lbAllPlayers = [{ name: localStorage.getItem('playerName') || 'אתה', money: Math.floor(window.money), level: ld.level, isPlayer: true }];
        cont.innerHTML = '<div style="text-align:center;font-size:11px;opacity:0.5;padding:8px;">📡 אין חיבור - מציג מקומי</div>' + renderLbPage();
        return;
    }
    window.lbAllPlayersCount = players.length;
    const deviceId = getDeviceId();
    const ld = getLevelData(window.lifeXP || 0);
    lbAllPlayers = players.map(p => ({ ...p, isPlayer: p.id === deviceId }));
    if (!lbAllPlayers.find(p => p.isPlayer)) {
        lbAllPlayers.push({ name: localStorage.getItem('playerName') || 'אתה', money: Math.floor(window.money), level: ld.level, isPlayer: true });
        lbAllPlayers.sort((a,b) => b.level - a.level || b.money - a.money);
    }
    renderLbFull();
}

function renderLbFull() {
    const cont = document.getElementById('leaderboard-container');
    if (!cont) return;
    cont.innerHTML = renderLbPage();
    updateLbNav();
}

function renderLbPage() {
    const totalPages = Math.ceil(lbAllPlayers.length / playersPerPage) || 1;
    if (leaderboardPage > totalPages) leaderboardPage = totalPages;
    const startIdx = (leaderboardPage - 1) * playersPerPage;
    const page = lbAllPlayers.slice(startIdx, startIdx + playersPerPage);
    const medals = ['🥇','🥈','🥉'];
    return page.map((p, i) => {
        const rank = startIdx + i + 1;
        const medal = rank <= 3 ? medals[rank-1] : rank + '.';
        return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:' + (p.isPlayer ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)') + ';border-radius:6px;border:1px solid ' + (p.isPlayer ? 'var(--blue)' : 'transparent') + ';margin-bottom:5px;">' +
            '<div style="display:flex;align-items:center;gap:10px;">' +
            '<span style="font-size:15px;width:24px;">' + medal + '</span>' +
            '<div><div style="font-size:13px;font-weight:bold;color:' + (p.isPlayer ? 'var(--blue)' : '#fff') + ';">' + p.name + (p.isPlayer ? ' (אתה)' : '') + '</div>' +
'<div style="font-size:11px; color:var(--yellow); font-weight:bold;">⭐ רמה ' + p.level + '</div></div></div>'
 +
            '<div style="font-size:13px;color:var(--green);font-weight:bold;">' + Math.floor(p.money).toLocaleString() + '₪</div></div>';
    }).join('');
}

function updateLbNav() {
    const total = Math.ceil(lbAllPlayers.length / playersPerPage) || 1;
    const pi = document.getElementById('lbPageInfo');
    const prev = document.getElementById('lbPrev');
    const next = document.getElementById('lbNext');
    if (pi) pi.innerText = leaderboardPage + ' / ' + total;
    if (prev) prev.disabled = leaderboardPage === 1;
    if (next) next.disabled = leaderboardPage === total;
}

window.changeLPage = function(dir) {
    const total = Math.ceil(lbAllPlayers.length / playersPerPage) || 1;
    leaderboardPage = Math.max(1, Math.min(total, leaderboardPage + dir));
    const cont = document.getElementById('leaderboard-container');
    if (cont) cont.innerHTML = renderLbPage();
    updateLbNav();
};

window.refreshLeaderboard = function() {
    leaderboardPage = 1;
    const cont = document.getElementById('leaderboard-container');
    if (cont) cont.innerHTML = '<div style="text-align:center;opacity:0.5;padding:20px;">⏳ טוען...</div>';
    fbSaveScore().then(loadLeaderboard);
};

window.saveName = function() {
    const input = document.getElementById('nameInput');
    if (!input || !input.value.trim()) return;
    localStorage.setItem('playerName', input.value.trim());
    showMsg('✅ שם עודכן: ' + input.value.trim(), 'var(--blue)');
    fbSaveScore();
};

// ============================================================
// בונוס יומי
// ============================================================
function claimDailyGift() {
    const now = Date.now();
    const waitTime = 4 * 60 * 60 * 1000;
    if (window.lastGift && (now - window.lastGift < waitTime)) return;

    // הגדרת הסכומים המעודכנת: 10,000 עד 100,000
    const minGift = 10000;
    const maxGift = 100000;
    const bonus = Math.floor(Math.random() * (maxGift - minGift + 1)) + minGift;

    window.money += bonus;
    window.lastGift = now;

    if(typeof saveGame === 'function') saveGame();
    if(typeof updateUI === 'function') updateUI();
    
    // הודעה עם הסכום שהוגרל
    if(typeof showMsg === 'function') {
        showMsg('🎁 קיבלת ' + bonus.toLocaleString() + ' ₪!', 'var(--green)');
    }
    
    window.openTab('home');
}



function startGiftTimer() {
    const timerEl = document.getElementById('giftTimer');
    const btn = document.getElementById('giftBtn');
    const update = () => {
        if (!timerEl || !btn) return;
        const timeLeft = (4 * 60 * 60 * 1000) - (Date.now() - (window.lastGift || 0));
        if (timeLeft <= 0) {
            timerEl.innerText = '✅ המתנה מוכנה!';
            btn.disabled = false; btn.style.opacity = '1';
        } else {
            const h = Math.floor(timeLeft / 3600000), m = Math.floor((timeLeft % 3600000) / 60000), s = Math.floor((timeLeft % 60000) / 1000);
            timerEl.innerText = 'עוד ' + h + 'ש\' ' + m + 'ד\' ' + s + 'ש\'';
            btn.disabled = true; btn.style.opacity = '0.5';
        }
    };
    update();
    setInterval(update, 1000);
}

// ============================================================
// PWA
// ============================================================
function renderInstallBtn() {
    const cont = document.getElementById('install-container');
    if(!cont || window.matchMedia('(display-mode: standalone)').matches || !deferredPrompt) return;
    cont.innerHTML = '<button class="action" style="background:#3b82f6;width:100%;border-radius:8px;border:none;color:white;padding:12px;font-weight:bold;" onclick="triggerInstall()">📲 התקן כאפליקציה</button>';
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') { deferredPrompt = null; renderInstallBtn(); }
}

// =======================.=====================================
// אתחול
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    fbLoadConfig().then(() => {
        // בדיקה איזה טאב היה פתוח בפעם האחרונה
        const lastTab = localStorage.getItem('lastTab') || 'home';
        
        setTimeout(() => { 
            window.openTab(lastTab); 
        }, 150);
    });
});
