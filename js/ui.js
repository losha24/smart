/* Smart Money Pro - js/ui.js - v9.9.4 */

let deferredPrompt;
let currentTab = 'home';
let leaderboardPage = 1;
const playersPerPage = 5;

// ============================================================
// ⭐ Firebase Auth — כניסת מנהל
// ============================================================
async function checkAdminCredentials(email, password) {
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        return true;
    } catch(e) {
        console.warn('Admin login failed:', e.code);
        return false;
    }
}

// ⭐ window.updateUI גלובלית
window.updateUI = function() {
    if (window._offlineMsgLocked) {
        const mEl = document.getElementById('money');
        const bEl = document.getElementById('bank');
        if (mEl) mEl.innerText = Math.floor(window.money).toLocaleString();
        if (bEl) bEl.innerText = Math.floor(window.bank).toLocaleString();
        return;
    }
    const mEl  = document.getElementById('money');
    const bEl  = document.getElementById('bank');
    const lEl  = document.getElementById('life-level-ui');
    const gbEl = document.getElementById('gold-bricks');
    if (mEl)  mEl.innerText  = Math.floor(window.money).toLocaleString();
    if (bEl)  bEl.innerText  = Math.floor(window.bank).toLocaleString();
    if (gbEl) gbEl.innerText = window.goldBricks || 0;
    const ld = (typeof getLevelData === 'function')
        ? getLevelData(window.lifeXP || 0)
        : { level: 1, xpInCurrentLevel: 0, xpForNext: 1000, progressPercent: 0 };
    if (lEl) lEl.innerText = ld.level;
    if (typeof renderUIUpdate === 'function') renderUIUpdate(ld);
    if (typeof checkLevelUp === 'function') checkLevelUp(ld.level);
};

// ============================================================
// Firebase DB
// ============================================================
const FB_URL = 'https://smart-money-faf43-default-rtdb.europe-west1.firebasedatabase.app';

async function fbSaveScore() {
    try {
        const ld       = getLevelData(window.lifeXP || 0);
        const deviceId = getDeviceId();
        const payload  = {
            name:   localStorage.getItem('playerName') || 'שחקן',
            bricks: window.goldBricks || 0,
            level:  ld.level,
            ts:     Date.now()
        };
        let url = FB_URL + '/leaderboard/' + deviceId + '.json';
        try {
            const user = firebase.auth().currentUser;
            if (user) { const token = await user.getIdToken(); url += '?auth=' + token; }
        } catch(e) {}
        await fetch(url, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload)
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
            .sort((a, b) => (b.bricks || 0) - (a.bricks || 0) || b.level - a.level)
            .slice(0, 50);
    } catch(e) { return null; }
}

function getDeviceId() {
    let id = localStorage.getItem('deviceID');
    if (!id) { id = 'dev_' + Math.random().toString(36).substr(2, 12); localStorage.setItem('deviceID', id); }
    return id;
}

async function fbSaveAdminMsg(msg) {
    try {
        const user = firebase.auth().currentUser;
        if (!user) { console.warn('לא מחובר'); return; }
        const token = await user.getIdToken();
        await fetch(FB_URL + '/config/adminMsg.json?auth=' + token, {
            method: 'PUT',
            body: JSON.stringify({ text: msg, ts: Date.now() })
        });
    } catch(e) { console.warn('FB msg save failed:', e); }
}

async function fbLoadAdminMsg() {
    try {
        const res = await fetch(FB_URL + '/config/adminMsg.json');
        const data = await res.json();
        return data ? data.text : null;
    } catch(e) { return null; }
}

async function fbLoadConfig() {
    const msg = await fbLoadAdminMsg();
    if (msg) window.adminMsgText = msg;
}

async function fbDeletePlayer(deviceId) {
    try {
        let url = FB_URL + '/leaderboard/' + deviceId + '.json';
        try {
            const user = firebase.auth().currentUser;
            if (user) { const token = await user.getIdToken(); url += '?auth=' + token; }
        } catch(e) {}
        await fetch(url, { method: 'DELETE' });
        return true;
    } catch(e) { return false; }
}

async function fbResetLeaderboard() {
    try {
        let url = FB_URL + '/leaderboard.json';
        try {
            const user = firebase.auth().currentUser;
            if (user) { const token = await user.getIdToken(); url += '?auth=' + token; }
        } catch(e) {}
        await fetch(url, { method: 'DELETE' });
        return true;
    } catch(e) { return false; }
}

// ============================================================
// Modal אישור
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
        '<button id="confirmModalYes" style="flex:1;padding:12px;border-radius:8px;border:none;background:#ef4444;color:#fff;font-size:13px;font-weight:bold;cursor:pointer;">אשר</button>' +
        '</div></div>';
    document.body.appendChild(overlay);
    document.getElementById('confirmModalCancel').onclick = function() { overlay.remove(); };
    document.getElementById('confirmModalYes').onclick   = function() { overlay.remove(); onConfirm(); };
};

// ============================================================
// פאנל ניהול
// ============================================================
window.openAdminPanel = function() {
    const existing = document.getElementById('adminModal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'adminModal';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.92);z-index:99999;display:flex;justify-content:center;align-items:flex-start;overflow-y:auto;padding:20px 0;';

    overlay.innerHTML =
        '<div style="width:90%;max-width:360px;background:#0f172a;border-radius:16px;border:1px solid #3b82f6;padding:20px;margin:auto;">' +

        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">' +
        '<div style="font-size:17px;font-weight:bold;color:#3b82f6;">🛡️ פאנל ניהול</div>' +
        '<button id="adminClose" style="background:none;border:none;color:#64748b;font-size:20px;cursor:pointer;">✕</button>' +
        '</div>' +

        // שלב 1 — כניסה
        '<div id="adminLoginStep">' +
        '<div style="font-size:13px;color:#94a3b8;margin-bottom:10px;">כניסת מנהל (Firebase):</div>' +
        '<input id="adminUserInput" type="email" placeholder="אימייל" style="width:100%;padding:12px;background:#1e293b;color:#fff;border:1px solid #334155;border-radius:8px;font-size:14px;text-align:center;margin-bottom:8px;">' +
        '<input id="adminPassInput" type="password" placeholder="סיסמה" style="width:100%;padding:12px;background:#1e293b;color:#fff;border:1px solid #334155;border-radius:8px;font-size:14px;text-align:center;margin-bottom:12px;">' +
        '<button id="adminLoginBtn" style="width:100%;padding:12px;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:bold;cursor:pointer;">כניסה</button>' +
        '<div id="adminLoginErr" style="color:#ef4444;font-size:12px;text-align:center;margin-top:8px;display:none;">אימייל או סיסמה שגויים!</div>' +
        '</div>' +

        // שלב 2 — פאנל
        '<div id="adminPanelStep" style="display:none;">' +

        // הודעת מערכת
        '<div style="background:#1e293b;border-radius:10px;padding:14px;margin-bottom:12px;border:1px solid #334155;">' +
        '<div style="font-size:12px;color:#94a3b8;margin-bottom:8px;">📢 הודעת מערכת (תופיע לכולם)</div>' +
        '<textarea id="adminMsgInput" rows="3" style="width:100%;padding:10px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:8px;font-size:13px;resize:none;">' + (window.adminMsgText || '') + '</textarea>' +
        '<button id="adminSaveMsg" style="width:100%;padding:10px;background:#22c55e;color:#000;border:none;border-radius:8px;font-size:13px;font-weight:bold;cursor:pointer;margin-top:8px;">💾 שמור הודעה</button>' +
        '</div>' +

        // כסף, XP וזהב — גריד 3 עמודות
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">' +
        '<div style="background:#1e293b;border-radius:10px;padding:10px;border:1px solid #334155;">' +
        '<div style="font-size:11px;color:#94a3b8;margin-bottom:6px;">💰 הוסף כסף</div>' +
        '<input id="adminMoneyInput" type="number" placeholder="סכום" style="width:100%;padding:8px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:6px;font-size:13px;margin-bottom:8px;">' +
        '<button id="adminAddMoney" style="width:100%;padding:8px;background:#f59e0b;color:#000;border:none;border-radius:6px;font-size:12px;font-weight:bold;cursor:pointer;">הוסף</button>' +
        '</div>' +
        '<div style="background:#1e293b;border-radius:10px;padding:10px;border:1px solid #334155;">' +
        '<div style="font-size:11px;color:#94a3b8;margin-bottom:6px;">⭐ הוסף XP</div>' +
        '<input id="adminXpInput" type="number" placeholder="כמות" style="width:100%;padding:8px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:6px;font-size:13px;margin-bottom:8px;">' +
        '<button id="adminAddXp" style="width:100%;padding:8px;background:#a855f7;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:bold;cursor:pointer;">הוסף</button>' +
        '</div>' +
        '<div style="background:#1e293b;border-radius:10px;padding:10px;border:1px solid #334155;">' +
        '<div style="font-size:11px;color:#94a3b8;margin-bottom:6px;">🪎 הוסף זהב</div>' +
        '<input id="adminBricksInput" type="number" placeholder="כמות" style="width:100%;padding:8px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:6px;font-size:13px;margin-bottom:8px;">' +
        '<button id="adminAddBricks" style="width:100%;padding:8px;background:#f59e0b;color:#000;border:none;border-radius:6px;font-size:12px;font-weight:bold;cursor:pointer;">הוסף</button>' +
        '</div>' +
        '</div>' +

        // סטטיסטיקות
        '<div style="background:#1e293b;border-radius:10px;padding:12px;margin-bottom:12px;border:1px solid #334155;">' +
        '<div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">📊 סטטיסטיקות מערכת</div>' +
        '<div id="adminStats" style="font-size:12px;color:#cbd5e1;line-height:1.9;"></div>' +
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
        '<input id="adminEditMoney" type="number" placeholder="🪎 לבנות זהב חדש" style="padding:10px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:8px;font-size:13px;width:100%;">' +
        '<input id="adminEditXp" type="number" placeholder="XP חדש" style="padding:10px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:8px;font-size:13px;width:100%;">' +
        '</div>' +
        '<div id="adminEditTarget" style="font-size:11px;color:#f59e0b;margin-bottom:8px;">לא נבחר שחקן</div>' +
        '<button id="adminSavePlayer" style="width:100%;padding:10px;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:bold;cursor:pointer;">💾 שמור שינויים לשחקן</button>' +
        '<div id="adminEditMsg" style="font-size:12px;text-align:center;margin-top:6px;"></div>' +
        '</div>' +

        '<div style="display:block;">' +
        '<button id="adminReset" style="width:100%;padding:12px;background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid #ef4444;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;">🗑️ איפוס מלא</button>' +
        '</div>' +

        '</div></div>';

    document.body.appendChild(overlay);

    document.getElementById('adminClose').onclick = function() { overlay.remove(); };
    overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

    // ⭐ כניסה — Firebase Auth
    const userInput = document.getElementById('adminUserInput');
    const passInput = document.getElementById('adminPassInput');
    userInput.focus();
    userInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') passInput.focus(); });
    passInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') document.getElementById('adminLoginBtn').click(); });

    document.getElementById('adminLoginBtn').onclick = async function() {
        const email = document.getElementById('adminUserInput').value.trim();
        const pass  = document.getElementById('adminPassInput').value;
        if (!email || !pass) return;
        this.innerText = '⏳ מתחבר...';
        this.disabled  = true;
        const ok = await checkAdminCredentials(email, pass);
        this.innerText = 'כניסה';
        this.disabled  = false;
        if (!ok) {
            document.getElementById('adminLoginErr').style.display = 'block';
            passInput.value = '';
            userInput.focus();
            return;
        }
        document.getElementById('adminLoginStep').style.display = 'none';
        document.getElementById('adminPanelStep').style.display = 'block';

        const ld = getLevelData(window.lifeXP || 0);
        document.getElementById('adminStats').innerHTML =
            '💰 כסף: <b>' + Math.floor(window.money || 0).toLocaleString() + '₪</b><br>' +
            '🏦 בנק: <b>' + Math.floor(window.bank || 0).toLocaleString() + '₪</b><br>' +
            '🪎 זהב: <b>' + (window.goldBricks || 0) + ' לבנות</b><br>' +
            '⭐ רמה: <b>' + ld.level + '</b> (' + Math.floor(ld.xpInCurrentLevel).toLocaleString() + '/' + Math.floor(ld.xpForNext).toLocaleString() + ' XP)<br>' +
            '🚀 פסיבי: <b>' + (window.passive || 0).toFixed(1) + '₪/ד\'</b><br>' +
            '🏦 חוב: <b>' + Math.floor(window.loan || 0).toLocaleString() + '₪</b><br>' +
            '🏠 נדל"ן: <b>' + Object.values(window.estateData || {}).filter(e => e.count > 0).length + ' נכסים</b><br>' +
            '🚗 רכבים: <b>' + (window.cars || []).length + '</b>';
    };

    document.getElementById('adminSaveMsg').onclick = async function() {
        const msg = document.getElementById('adminMsgInput').value.trim();
        if (!msg) return;
        window.adminMsgText = msg;
        this.innerText = '⏳ שומר...'; this.disabled = true;
        await fbSaveAdminMsg(msg);
        this.innerText = '✅ נשמר לכולם!'; this.style.background = '#3b82f6';
        setTimeout(() => { this.innerText = '💾 שמור הודעה'; this.style.background = '#22c55e'; this.disabled = false; }, 2000);
        if (typeof window.openTab === 'function') window.openTab('home');
    };

    document.getElementById('adminAddMoney').onclick = function() {
        const amt = parseInt(document.getElementById('adminMoneyInput').value);
        if (!amt || amt <= 0) return;
        window.money += amt;
        if (typeof updateUI === 'function') updateUI();
        if (typeof saveGame === 'function') saveGame();
        if (typeof showMsg === 'function') showMsg('💰 נוספו ' + amt.toLocaleString() + '₪', 'var(--yellow)');
        document.getElementById('adminMoneyInput').value = '';
    };

    document.getElementById('adminAddXp').onclick = function() {
        const amt = parseInt(document.getElementById('adminXpInput').value);
        if (!amt || amt <= 0) return;
        window.lifeXP += amt;
        if (typeof updateUI === 'function') updateUI();
        if (typeof saveGame === 'function') saveGame();
        if (typeof showMsg === 'function') showMsg('⭐ נוספו ' + amt.toLocaleString() + ' XP', 'var(--purple)');
        document.getElementById('adminXpInput').value = '';
    };

    document.getElementById('adminAddBricks').onclick = function() {
        const amt = parseInt(document.getElementById('adminBricksInput').value);
        if (!amt || amt <= 0) return;
        window.goldBricks = (window.goldBricks || 0) + amt;
        if (typeof updateUI === 'function') updateUI();
        if (typeof saveGame === 'function') saveGame();
        if (typeof showMsg === 'function') showMsg('🪎 נוספו ' + amt + ' לבנות זהב', 'var(--yellow)');
        document.getElementById('adminBricksInput').value = '';
    };

    document.getElementById('adminReset').onclick = function() {
        showConfirmModal('🗑️ איפוס מלא', 'כל ההתקדמות תימחק לצמיתות!<br><br>האם אתה בטוח?',
            function() { overlay.remove(); if (typeof resetGame === 'function') resetGame(); });
    };

    let adminLoadedPlayers = [];

    document.getElementById('adminLoadPlayers').onclick = async function() {
        const listEl = document.getElementById('adminLbPlayers');
        listEl.innerHTML = '<div style="text-align:center;opacity:0.5;font-size:12px;padding:8px;">⏳ טוען...</div>';
        const players = await fbGetLeaderboard();
        if (!players || players.length === 0) {
            listEl.innerHTML = '<div style="text-align:center;opacity:0.5;font-size:12px;padding:8px;">אין שחקנים</div>'; return;
        }
        adminLoadedPlayers = players;
        listEl.innerHTML = players.map(p =>
            '<div data-pid="' + p.id + '" class="lb-player-row" style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:#0f172a;border-radius:6px;margin-bottom:4px;font-size:11px;cursor:pointer;border:1px solid transparent;">' +
            '<span style="color:#fff;">' + (p.name || '?') + ' (רמה ' + (p.level || 0) + ')</span>' +
            '<span style="color:#f59e0b;">🪎 ' + (p.bricks || 0) + '</span></div>'
        ).join('');
        listEl.querySelectorAll('.lb-player-row').forEach(function(row) {
            row.onclick = function() {
                listEl.querySelectorAll('.lb-player-row').forEach(r => r.style.borderColor = 'transparent');
                this.style.borderColor = '#3b82f6';
                const pid = this.getAttribute('data-pid');
                document.getElementById('adminDeleteId').value = pid;
                const player = adminLoadedPlayers.find(p => p.id === pid);
                if (player) {
                    document.getElementById('adminEditName').value  = player.name || '';
                    document.getElementById('adminEditMoney').value = player.bricks || 0;
                    document.getElementById('adminEditXp').value    = '';
                    document.getElementById('adminEditTarget').innerText = 'נבחר: ' + (player.name || '?') + ' | 🪎 ' + (player.bricks || 0) + ' זהב | רמה ' + (player.level || 0);
                    document.getElementById('adminEditMsg').innerText = '';
                }
            };
        });
    };

    document.getElementById('adminDeletePlayer').onclick = function() {
        const id = document.getElementById('adminDeleteId').value.trim();
        if (!id) { if (typeof showMsg === 'function') showMsg('הכנס Device ID', 'var(--red)'); return; }
        showConfirmModal('🗑️ מחיקת שחקן', 'למחוק את השחקן עם ID:<br><b style="font-size:11px;word-break:break-all;">' + id + '</b>?',
            async function() {
                const ok = await fbDeletePlayer(id);
                if (typeof showMsg === 'function') showMsg(ok ? '✅ שחקן נמחק!' : '❌ שגיאה', ok ? 'var(--green)' : 'var(--red)');
                document.getElementById('adminDeleteId').value = '';
                document.getElementById('adminLbPlayers').innerHTML = '';
            });
    };

    document.getElementById('adminResetLb').onclick = function() {
        showConfirmModal('⚠️ איפוס דירוג מלא', 'כל השחקנים יימחקו מהדירוג!<br><br>האם אתה בטוח לחלוטין?',
            async function() {
                const ok = await fbResetLeaderboard();
                if (typeof showMsg === 'function') showMsg(ok ? '✅ הדירוג אופס!' : '❌ שגיאה', ok ? 'var(--green)' : 'var(--red)');
                lbAllPlayers = [];
            });
    };

    document.getElementById('adminSavePlayer').onclick = async function() {
        const pid   = document.getElementById('adminDeleteId').value.trim();
        const msgEl = document.getElementById('adminEditMsg');
        if (!pid) { msgEl.style.color = '#ef4444'; msgEl.innerText = 'בחר שחקן מהרשימה קודם'; return; }
        const player = adminLoadedPlayers.find(p => p.id === pid);
        if (!player) { msgEl.style.color = '#ef4444'; msgEl.innerText = 'שחקן לא נמצא — טען שחקנים שוב'; return; }

        const newName   = document.getElementById('adminEditName').value.trim();
        const newBricks = parseInt(document.getElementById('adminEditMoney').value);
        const addXp     = parseInt(document.getElementById('adminEditXp').value) || 0;
        const updated   = {
            name:   newName || player.name,
            bricks: isNaN(newBricks) ? (player.bricks || 0) : Math.max(0, newBricks),
            level:  player.level,
            ts:     Date.now()
        };
        if (addXp > 0 && typeof getLevelData === 'function') {
            updated.level = getLevelData((player.level * 1000) + addXp).level;
        }
        this.innerText = '⏳ שומר...'; this.disabled = true;
        try {
            let saveUrl = FB_URL + '/leaderboard/' + pid + '.json';
            try {
                const user = firebase.auth().currentUser;
                if (user) { const token = await user.getIdToken(); saveUrl += '?auth=' + token; }
            } catch(e) {}
            await fetch(saveUrl, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
            msgEl.style.color = '#22c55e'; msgEl.innerText = '✅ נשמר בהצלחה!';
            player.name = updated.name; player.bricks = updated.bricks; player.level = updated.level;
            document.getElementById('adminEditTarget').innerText = 'נבחר: ' + updated.name + ' | 🪎 ' + updated.bricks + ' זהב | רמה ' + updated.level;
        } catch(e) { msgEl.style.color = '#ef4444'; msgEl.innerText = '❌ שגיאה בשמירה'; }
        this.innerText = '💾 שמור שינויים לשחקן'; this.disabled = false;
    };
};

// ============================================================
// PWA
// ============================================================
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); deferredPrompt = e; renderInstallBtn();
});

// ============================================================
// עדכון UI
// ============================================================
function renderUIUpdate(ld) {
    if (!ld && typeof getLevelData === 'function') ld = getLevelData(window.lifeXP || 0);
    if (currentTab === 'home' && ld) {
        const passiveEl  = document.getElementById('passive-display');
        const progressEl = document.getElementById('xp-progress-bar');
        const xpTextEl   = document.getElementById('xp-text-detail');
        const levelValEl = document.getElementById('home-level-val');
        const hgbEl      = document.getElementById('home-gold-bricks');
        if (passiveEl)  passiveEl.innerText = (window.passive || 0).toLocaleString(undefined, {minimumFractionDigits:1, maximumFractionDigits:1}) + ' ₪/ד\'';
        if (progressEl) progressEl.style.width = ld.progressPercent + '%';
        if (xpTextEl)   xpTextEl.innerText = Math.floor(ld.xpInCurrentLevel).toLocaleString() + ' / ' + Math.floor(ld.xpForNext).toLocaleString() + ' XP';
        if (levelValEl) levelValEl.innerText = ld.level;
        if (hgbEl)      hgbEl.innerText = window.goldBricks || 0;
    }
}

// ============================================================
// ניווט
// ============================================================
window.openTab = function(t) {
    const isAuto = new Error().stack.includes('setInterval');
    if (t === currentTab && isAuto) return;
    currentTab = t;
    document.querySelectorAll('.topbar button').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('btn' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) btn.classList.add('active');
    const c = document.getElementById('content');
    if (!c) return;
    c.style.opacity = '0.5';
    setTimeout(() => {
        c.innerHTML = '';
        if (t === 'black') {
            if (typeof renderBlackMarket === 'function') renderBlackMarket();
        } else {
            const drawFunc = window['draw' + t.charAt(0).toUpperCase() + t.slice(1)];
            if (typeof drawFunc === 'function') drawFunc(c);
            else window.drawHome(c);
        }
        c.style.opacity = '1';
        if (t !== 'invest') window.scrollTo(0, 0);
        if (typeof updateUI === 'function') updateUI();
        if (t === 'home') fbSaveScore();
    }, 100);
    localStorage.setItem('lastTab', t);
};

// ============================================================
// מדריך
// ============================================================
window.gameTips = [
    "השקעה בנדל\"ן היא הדרך הכי טובה לייצר הכנסה פסיבית בזמן שאתה ישן.",
    "שים לב ל-'חום משטרה' – אם הוא גבוה מדי, המשטרה תחרים לך כסף שחור!",
    "שדרוג אנשי צוות בעבודות מגדיל את הרווח שלך משמעותית בכל פעולה.",
    "אל תשאיר חובות לבנק – הריבית תאכל לך את הרווחים לאורך זמן.",
    "המתנה היומית מתאפסת כל 4 שעות – נצל אותה כדי לקבל עד 100,000₪!",
    "רכבים מהירים פותחים אפשרויות לעבודות יוקרתיות ורווחיות יותר."
];

window.drawGuide = function(c) {
    const tip = window.gameTips[Math.floor(Math.random() * window.gameTips.length)];
    c.innerHTML = `<div class="card fade-in" style="border-top:3px solid var(--blue);">
        <h3 style="margin-top:0;">📖 מדריך למליונר המתחיל</h3>
        <div style="background:rgba(59,130,246,0.1);border-right:4px solid var(--blue);padding:15px;margin-bottom:20px;border-radius:8px;">
            <small style="color:var(--blue);font-weight:bold;display:block;margin-bottom:5px;">💡 טיפ:</small>
            <div style="font-size:14px;color:#fff;font-style:italic;">"${tip}"</div>
        </div>
        <div style="display:grid;gap:15px;">
            <div class="card" style="margin:0;background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.2);">
                <h4 style="margin:0 0 5px 0;color:var(--green);">🔋 שלב 1: התחלה אקטיבית</h4>
                <p style="margin:0;font-size:13px;color:#cbd5e1;">כנס ל<b>עבודות</b>. כל לחיצה נותנת כסף ו-XP.</p>
            </div>
            <div class="card" style="margin:0;background:rgba(59,130,246,0.05);border:1px solid rgba(59,130,246,0.2);">
                <h4 style="margin:0 0 5px 0;color:var(--blue);">🏠 שלב 2: הכנסה פסיבית</h4>
                <p style="margin:0;font-size:13px;color:#cbd5e1;">קנה <b>נדל"ן</b> ו<b>עסקים</b> לכסף אוטומטי.</p>
            </div>
            <div class="card" style="margin:0;background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.2);">
                <h4 style="margin:0 0 5px 0;color:#ef4444;">🕶️ שלב 3: השוק השחור</h4>
                <p style="margin:0;font-size:13px;color:#cbd5e1;">הרווח הגדול — אבל תלבין את הכסף השחור!</p>
            </div>
        </div>
        <button class="sys-btn" style="width:100%;margin-top:20px;padding:12px;" onclick="window.openTab('home')">חזרה למסך הבית</button>
    </div>`;
};

// ============================================================
// דף הבית
// ============================================================
let lbAllPlayersCount = 0;

window.drawHome = function(c) {
    const ld = (typeof getLevelData === 'function')
               ? getLevelData(window.lifeXP || 0)
               : { level:1, xpInCurrentLevel:0, xpForNext:1000, progressPercent:0 };

    c.innerHTML =
        '<div class="card fade-in">' +
        '<div id="admin-box" class="admin-box">' +
        '<button class="edit-admin-btn" onclick="window.openAdminPanel()" title="פאנל ניהול">⚙️</button>' +
        '📢 <b>הודעה מהמערכת:</b><br>' +
        '<span style="font-size:13px;">' + (window.adminMsgText || 'ברוכים הבאים!') + '</span></div>' +

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

        // ⭐ כרטיס זהב
        '<div class="card" style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.4);text-align:center;padding:15px;margin-bottom:15px;">' +
        '<div style="font-size:12px;color:var(--yellow);font-weight:bold;margin-bottom:6px;">🪎 לבנות זהב</div>' +
        '<div style="font-size:28px;font-weight:bold;color:var(--yellow);" id="home-gold-bricks">' + (window.goldBricks || 0) + '</div>' +
        '<div style="font-size:11px;opacity:0.6;margin-bottom:10px;">כל לבנה = 2,000,000,000 ₪ לבנק | מצטבר גם אופליין</div>' +
        '<button onclick="window.convertGoldBrick()" style="background:var(--yellow);color:#000;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;font-size:13px;cursor:pointer;">🏦 המר לבנה לבנק</button>' +
        '</div>' +

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

        // יומן אירועים
        '<div class="card" style="padding:12px;background:rgba(255,255,255,0.02);margin-top:15px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
        '<small style="opacity:0.7;font-weight:bold;font-size:12px;">📋 יומן אירועים — 12 שעות אחרונות</small>' +
        '<div style="display:flex;gap:6px;">' +
        '<button class="sys-btn" style="font-size:10px;padding:3px 8px;" onclick="window._eventLogPage=1;window.renderEventLog();">🔄</button>' +
        '<button class="sys-btn" style="font-size:10px;padding:3px 8px;background:rgba(239,68,68,0.1);color:#ef4444;border-color:#ef4444;" onclick="window.clearEventLog()">🗑️</button>' +
        '</div></div>' +
        '<div id="event-log-container"><div style="text-align:center;opacity:0.4;padding:10px;font-size:12px;">טוען...</div></div></div>' +

        '<div id="install-container" style="margin-top:20px;"></div>' +
        '<button class="sys-btn" style="border:1px solid #451a1a;color:#ef4444;margin-top:15px;font-size:11px;padding:10px;width:100%;opacity:0.7;" onclick="if(confirm(\'לאפס הכל?\')) resetGame()">🗑️ איפוס חשבון</button>' +
        '</div>';

    startGiftTimer();
    renderInstallBtn();
    loadLeaderboard();
    startLbAutoRefresh();
    window._eventLogPage = 1;
    window.renderEventLog();
};

// ============================================================
// ⭐ רענון אוטומטי של לידרבורד כל 2 דקות
// ============================================================
let _lbRefreshInterval = null;
function startLbAutoRefresh() {
    if (_lbRefreshInterval) clearInterval(_lbRefreshInterval);
    _lbRefreshInterval = setInterval(function() {
        if (currentTab === 'home') {
            loadLeaderboard();
        } else {
            clearInterval(_lbRefreshInterval);
            _lbRefreshInterval = null;
        }
    }, 2 * 60 * 1000);
}

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
        lbAllPlayers = [{ name: localStorage.getItem('playerName') || 'אתה', bricks: window.goldBricks || 0, level: ld.level, isPlayer: true }];
        cont.innerHTML = '<div style="text-align:center;font-size:11px;opacity:0.5;padding:8px;">📡 אין חיבור - מציג מקומי</div>' + renderLbPage();
        return;
    }
    window.lbAllPlayersCount = players.length;
    const deviceId = getDeviceId();
    const ld = getLevelData(window.lifeXP || 0);
    lbAllPlayers = players.map(p => ({ ...p, isPlayer: p.id === deviceId }));
    if (!lbAllPlayers.find(p => p.isPlayer)) {
        lbAllPlayers.push({ name: localStorage.getItem('playerName') || 'אתה', bricks: window.goldBricks || 0, level: ld.level, isPlayer: true });
        lbAllPlayers.sort((a, b) => (b.bricks || 0) - (a.bricks || 0) || b.level - a.level);
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
        const rank  = startIdx + i + 1;
        const medal = rank <= 3 ? medals[rank-1] : rank + '.';
        return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:' + (p.isPlayer ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)') + ';border-radius:6px;border:1px solid ' + (p.isPlayer ? 'var(--blue)' : 'transparent') + ';margin-bottom:5px;">' +
            '<div style="display:flex;align-items:center;gap:10px;">' +
            '<span style="font-size:15px;width:24px;">' + medal + '</span>' +
            '<div><div style="font-size:13px;font-weight:bold;color:' + (p.isPlayer ? 'var(--blue)' : '#fff') + ';">' + (p.name || '?') + (p.isPlayer ? ' (אתה)' : '') + '</div>' +
            '<div style="font-size:11px;color:var(--yellow);font-weight:bold;">⭐ רמה ' + (p.level || 0) + '</div></div></div>' +
            '<div style="font-size:13px;color:#f59e0b;font-weight:bold;">🪎 ' + (p.bricks || 0) + '</div></div>';
    }).join('');
}

function updateLbNav() {
    const total = Math.ceil(lbAllPlayers.length / playersPerPage) || 1;
    const pi   = document.getElementById('lbPageInfo');
    const prev = document.getElementById('lbPrev');
    const next = document.getElementById('lbNext');
    if (pi)   pi.innerText = leaderboardPage + ' / ' + total;
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
    const bonus = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
    window.money += bonus;
    window.lastGift = now;
    if (typeof saveGame === 'function') saveGame();
    if (typeof updateUI === 'function') updateUI();
    if (typeof showMsg === 'function') showMsg('🎁 קיבלת ' + bonus.toLocaleString() + ' ₪!', 'var(--green)');
    window.openTab('home');
}

function startGiftTimer() {
    const timerEl = document.getElementById('giftTimer');
    const btn     = document.getElementById('giftBtn');
    const update  = () => {
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
// PWA install
// ============================================================
function renderInstallBtn() {
    const cont = document.getElementById('install-container');
    if (!cont || window.matchMedia('(display-mode: standalone)').matches || !deferredPrompt) return;
    cont.innerHTML = '<button class="action" style="background:#3b82f6;width:100%;border-radius:8px;border:none;color:white;padding:12px;font-weight:bold;" onclick="triggerInstall()">📲 התקן כאפליקציה</button>';
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') { deferredPrompt = null; renderInstallBtn(); }
}

// ============================================================
// ⭐ המרת לבנת זהב — הכסף נכנס לבנק
// ============================================================
window.convertGoldBrick = function() {
    if (!window.goldBricks || window.goldBricks <= 0) {
        if (typeof showMsg === 'function') showMsg('אין זהב להמרה!', 'var(--red)');
        return;
    }
    window.showConfirmModal(
        '🪎 המרת זהב',
        'להמיר לבנה אחת ל-<b>2,000,000,000 ₪</b>?<br><br>💡 הכסף יכנס ישירות ל<b>בנק</b><br><br>זהב נותרות: <b>' + (window.goldBricks - 1) + '</b>',
        function() {
            window.goldBricks--;
            window.bank += 2000000000;
            const gbEl  = document.getElementById('gold-bricks');
            const hgbEl = document.getElementById('home-gold-bricks');
            if (gbEl)  gbEl.innerText  = window.goldBricks;
            if (hgbEl) hgbEl.innerText = window.goldBricks;
            if (typeof showMsg === 'function') showMsg('🏦 +2,000,000,000 ₪ נכנסו לבנק!', 'var(--yellow)');
            if (typeof saveGame === 'function') saveGame();
            if (typeof updateUI === 'function') updateUI();
            if (typeof window.openTab === 'function') window.openTab('home');
        }
    );
};

// ============================================================
// יומן אירועים
// ============================================================
window.renderEventLog = function() {
    const cont = document.getElementById('event-log-container');
    if (!cont) return;
    const cutoff = Date.now() - 12 * 60 * 60 * 1000;
    const log = (window.eventLog || []).filter(function(e) { return e.ts >= cutoff; });

    if (log.length === 0) {
        cont.innerHTML = '<div style="text-align:center;opacity:0.4;padding:12px;font-size:12px;">אין אירועים ב-12 השעות האחרונות</div>';
        return;
    }

    const page       = window._eventLogPage || 1;
    const totalPages = Math.ceil(log.length / 5) || 1;
    const items      = log.slice((page - 1) * 5, page * 5);

    function fmtDateTime(ts) {
        if (!ts || isNaN(ts)) return '--:--';
        const d   = new Date(ts);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        if (isToday) return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
        return (d.getMonth()+1) + '/' + d.getDate() + ' ' + d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
    }

    let html = items.map(function(e) {
        const isPos  = e.type === 'positive';
        const icon   = isPos ? '📈' : '📉';
        const border = isPos ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)';
        const bg     = isPos ? 'rgba(34,197,94,0.06)'  : 'rgba(239,68,68,0.06)';
        const clr    = isPos ? '#22c55e' : '#ef4444';
        return '<div style="display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:8px;background:' + bg + ';border:1px solid ' + border + ';margin-bottom:5px;">' +
            '<span style="font-size:16px;flex-shrink:0;">' + icon + '</span>' +
            '<div style="flex:1;min-width:0;">' +
            '<div style="font-size:12px;font-weight:bold;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (e.title || '') + '</div>' +
            '<div style="font-size:11px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (e.msg || '') + '</div>' +
            '</div>' +
            '<span style="font-size:10px;color:' + clr + ';font-weight:bold;flex-shrink:0;font-family:monospace;min-width:38px;text-align:left;">' + fmtDateTime(e.ts) + '</span>' +
            '</div>';
    }).join('');

    if (totalPages > 1) {
        html += '<div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-top:8px;">' +
            '<button onclick="window.changeEventLogPage(-1)" class="sys-btn" style="padding:3px 12px;font-size:11px;" ' + (page <= 1 ? 'disabled' : '') + '>◀</button>' +
            '<span style="font-size:12px;font-weight:bold;">' + page + ' / ' + totalPages + '</span>' +
            '<button onclick="window.changeEventLogPage(1)" class="sys-btn" style="padding:3px 12px;font-size:11px;" ' + (page >= totalPages ? 'disabled' : '') + '>▶</button>' +
            '</div>';
    }
    cont.innerHTML = html;
};

window.changeEventLogPage = function(dir) {
    const cutoff = Date.now() - 12 * 60 * 60 * 1000;
    const total  = Math.ceil(((window.eventLog || []).filter(function(e) { return e.ts >= cutoff; }).length) / 5) || 1;
    window._eventLogPage = Math.max(1, Math.min(total, (window._eventLogPage || 1) + dir));
    window.renderEventLog();
};

window.clearEventLog = function() {
    window.eventLog = [];
    localStorage.setItem('eventLog', '[]');
    window.renderEventLog();
    if (typeof showMsg === 'function') showMsg('🗑️ יומן אירועים נוקה', 'var(--red)');
};

// ============================================================
// אתחול
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    fbLoadConfig().then(() => {
        const lastTab = localStorage.getItem('lastTab') || 'home';
        setTimeout(() => { window.openTab(lastTab); }, 150);
    });
});
