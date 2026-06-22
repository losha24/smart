/* Smart Money Pro - js/ui.js - v9.9.43 */

let deferredPrompt;
let currentTab = 'home';

async function checkAdminCredentials(email, password) {
    try {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
        await firebase.auth().signInWithEmailAndPassword(email, password);
        return true;
    } catch(e) {
        console.warn('Admin login failed:', e.code);
        return false;
    }
}

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


const FB_URL = 'https://smart-money-faf43-default-rtdb.europe-west1.firebasedatabase.app';

async function fbSaveAdminMsg(msg) {
    try {
        const user = firebase.auth().currentUser;
        if (!user) return;
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

async function syncPlayerData() {
    try {
        const deviceId = getDeviceId();
        const ld = getLevelData(window.lifeXP || 0);
        window.goldBricks = window.goldBricks || 0;
        const payload = {
            name:   localStorage.getItem('playerName') || 'שחקן',
            bricks: window.goldBricks,
            level:  ld.level,
            xp:     window.lifeXP || 0,
            ts:     Date.now()
        };
        let url = FB_URL + '/leaderboard/' + deviceId + '.json';
        try {
            const user = firebase.auth().currentUser;
            if (user) { const token = await user.getIdToken(); url += '?auth=' + token; }
        } catch(e) {}
        await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        return true;
    } catch(e) { console.warn('❌ שגיאה בסינכרון:', e); return false; }
}

const fbSaveScore = syncPlayerData;

async function fbGetLeaderboard() {
    try {
        const res = await fetch(FB_URL + '/leaderboard.json');
        if (!res.ok) return null;
        const data = await res.json();
        if (!data) return [];
        return Object.entries(data)
            .map(([id, p]) => ({ ...p, id }))
            .sort((a, b) => (b.bricks || 0) - (a.bricks || 0) || (b.level || 1) - (a.level || 1))
            .slice(0, 5);
    } catch(e) { return null; }
}

async function fbGetAllPlayers() {
    try {
        const res = await fetch(FB_URL + '/leaderboard.json');
        if (!res.ok) return null;
        const data = await res.json();
        if (!data) return [];
        return Object.entries(data).map(([id, p]) => ({
            id, name: p.name || 'שחקן אנונימי', bricks: p.bricks || 0, level: p.level || 1, xp: p.xp || 0
        }));
    } catch(e) { return null; }
}

async function fbUpdatePlayer(deviceId, data) {
    try {
        let token = null;
        try {
            let user = firebase.auth().currentUser;
            if (!user) {
                await new Promise(function(resolve) {
                    const unsub = firebase.auth().onAuthStateChanged(function(u) {
                        unsub(); user = u; resolve();
                    });
                    setTimeout(resolve, 3000);
                });
            }
            if (user) token = await user.getIdToken(true);
        } catch(e) { console.warn('getIdToken failed:', e); }

        if (!token) { console.error('❌ אין טוקן'); return false; }

        const url = FB_URL + '/leaderboard/' + deviceId + '.json?auth=' + token;
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errText = await response.text();
            console.error('❌ Firebase PUT נכשל:', response.status, errText);
            return false;
        }
        return true;
    } catch(e) { console.warn('❌ שגיאה בעדכון:', e); return false; }
}

async function fbDeletePlayer(deviceId) {
    try {
        let url = FB_URL + '/leaderboard/' + deviceId + '.json';
        try { const user = firebase.auth().currentUser; if (user) { const token = await user.getIdToken(); url += '?auth=' + token; } } catch(e) {}
        const response = await fetch(url, { method: 'DELETE' });
        if (!response.ok) throw new Error('מחיקה נכשלה');
        return true;
    } catch(e) { console.warn('שגיאה במחיקת שחקן:', e); return false; }
}

async function fbResetAllPlayers() {
    try {
        let url = FB_URL + '/leaderboard.json';
        try { const user = firebase.auth().currentUser; if (user) { const token = await user.getIdToken(); url += '?auth=' + token; } } catch(e) {}
        const response = await fetch(url, { method: 'DELETE' });
        if (!response.ok) throw new Error('איפוס נכשל');
        return true;
    } catch(e) { console.warn('שגיאה באיפוס שחקנים:', e); return false; }
}

function getDeviceId() {
    let id = localStorage.getItem('deviceID');
    if (!id) { id = 'dev_' + Math.random().toString(36).substr(2, 12); localStorage.setItem('deviceID', id); }
    return id;
}

function updateProfileUI() {
    const ld = getLevelData(window.lifeXP || 0);
    const levelEl    = document.getElementById('life-level-ui');
    const homeLevelEl= document.getElementById('home-level-val');
    const gbEl       = document.getElementById('gold-bricks');
    const homeGbEl   = document.getElementById('home-gold-bricks');
    const progressEl = document.getElementById('xp-progress-bar');
    const xpTextEl   = document.getElementById('xp-text-detail');
    const moneyEl    = document.getElementById('money');
    const bankEl     = document.getElementById('bank');
    if (levelEl)     levelEl.innerText     = ld.level;
    if (homeLevelEl) homeLevelEl.innerText = ld.level;
    if (gbEl)        gbEl.innerText        = window.goldBricks || 0;
    if (homeGbEl)    homeGbEl.innerText    = window.goldBricks || 0;
    if (progressEl)  progressEl.style.width = ld.progressPercent + '%';
    if (xpTextEl)    xpTextEl.innerText    = Math.floor(ld.xpInCurrentLevel).toLocaleString() + ' / ' + Math.floor(ld.xpForNext).toLocaleString() + ' XP';
    if (moneyEl)     moneyEl.innerText     = Math.floor(window.money || 0).toLocaleString();
    if (bankEl)      bankEl.innerText      = Math.floor(window.bank  || 0).toLocaleString();
}

function updateHomeStatusBar(message, icon) {
    const el = document.getElementById('homeStatusRight');
    if (el) {
        const now  = new Date();
        const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
        el.innerHTML = (icon || '📌') + ' ' + message + ' ' + time;
    }
}

let _homeEventTimer = null;

function startHomeEventTimer() {
    if (_homeEventTimer) { clearInterval(_homeEventTimer); _homeEventTimer = null; }
    const events = [
        '📊 מערכת פעילה','💰 שוק המניות פתוח','📈 עלייה במדד',
        '📉 ירידה במדד','🏦 ריבית בנק התעדכנה','🪎 מחיר הזהב השתנה',
        '⭐ XP בונוס פעיל','🚀 האצה כלכלית','📊 מסחר פעיל',
        '💎 הזדמנות השקעה','🔔 התראה חדשה','🎯 יעד חדש הושג','📈 מגמת עלייה'
    ];
    function updateHomeEvent() {
        const el = document.getElementById('homeStatusLeft');
        if (el) {
            const now  = new Date();
            const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
            el.innerHTML = events[Math.floor(Math.random() * events.length)] + ' ' + time;
        }
    }
    setTimeout(updateHomeEvent, 100);
    _homeEventTimer = setInterval(updateHomeEvent, 60000);
}

function stopHomeEventTimer() {
    if (_homeEventTimer) { clearInterval(_homeEventTimer); _homeEventTimer = null; }
}

let lbAllPlayers  = [];
let leaderboardPage = 1;
const playersPerPage = 5;
let _lbAutoRefreshInterval = null;

function startLbAutoRefresh() {
    stopLbAutoRefresh();
    _lbAutoRefreshInterval = setInterval(function() {
        if (currentTab === 'home') fbSaveScore().then(loadLeaderboard);
        else stopLbAutoRefresh();
    }, 2 * 60 * 1000);
}

function stopLbAutoRefresh() {
    if (_lbAutoRefreshInterval) { clearInterval(_lbAutoRefreshInterval); _lbAutoRefreshInterval = null; }
}

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
    const deviceId = getDeviceId();
    const ld = getLevelData(window.lifeXP || 0);
    lbAllPlayers = players.map(p => ({ ...p, isPlayer: p.id === deviceId }));
    if (!lbAllPlayers.find(p => p.isPlayer)) {
        lbAllPlayers.push({ name: localStorage.getItem('playerName') || 'אתה', bricks: window.goldBricks || 0, level: ld.level, isPlayer: true });
        lbAllPlayers.sort((a, b) => (b.bricks || 0) - (a.bricks || 0));
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
            '<div><div style="font-size:13px;font-weight:bold;color:' + (p.isPlayer ? 'var(--blue)' : '#fff') + ';">' + (p.name || 'שחקן') + (p.isPlayer ? ' (אתה)' : '') + '</div>' +
            '<div style="font-size:11px;color:var(--yellow);font-weight:bold;">⭐ רמה ' + (p.level || 1) + '</div></div></div>' +
            '<div style="font-size:13px;color:var(--yellow);font-weight:bold;">🪎 ' + (p.bricks || 0) + '</div></div>';
    }).join('');
}

function updateLbNav() {
    // כפתורי עימוד הוסרו מה-HTML — הפונקציה נשמרת למקרה שיחזרו
    const pi   = document.getElementById('lbPageInfo');
    const prev = document.getElementById('lbPrev');
    const next = document.getElementById('lbNext');
    const total = Math.ceil(lbAllPlayers.length / playersPerPage) || 1;
    if (pi)   pi.innerText   = leaderboardPage + ' / ' + total;
    if (prev) prev.disabled  = leaderboardPage === 1;
    if (next) next.disabled  = leaderboardPage === total;
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

window.showConfirmModal = function(title, bodyHtml, onConfirm) {
    const existing = document.getElementById('confirmModal');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'confirmModal';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;justify-content:center;align-items:center;';
    overlay.innerHTML =
        '<div style="width:90%;max-width:380px;background:#1e293b;border-radius:15px;border:1px solid #ef4444;padding:25px;text-align:center;max-height:90vh;overflow-y:auto;">' +
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

function claimDailyGift() {
    const now = Date.now();
    const waitTime = 4 * 60 * 60 * 1000;
    if (window.lastGift && (now - window.lastGift < waitTime)) return;
    const bonus = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
    window.money += bonus;
    window.lastGift = now;
    if (typeof saveGame  === 'function') saveGame();
    if (typeof updateUI  === 'function') updateUI();
    if (typeof showMsg   === 'function') showMsg('🎁 קיבלת ' + bonus.toLocaleString() + ' ₪!', 'var(--green)');
    window.openTab('home');
}

function startGiftTimer() {
    const timerEl = document.getElementById('giftTimer');
    const btn     = document.getElementById('giftBtn');
    const update  = function() {
        if (!timerEl || !btn) return;
        const timeLeft = (4 * 60 * 60 * 1000) - (Date.now() - (window.lastGift || 0));
        if (timeLeft <= 0) {
            timerEl.innerText = '✅ המתנה מוכנה!';
            btn.disabled = false; btn.style.opacity = '1';
        } else {
            const h = Math.floor(timeLeft / 3600000);
            const m = Math.floor((timeLeft % 3600000) / 60000);
            const s = Math.floor((timeLeft % 60000) / 1000);
            timerEl.innerText = 'עוד ' + h + 'ש\' ' + m + 'ד\' ' + s + 'ש\'';
            btn.disabled = true; btn.style.opacity = '0.5';
        }
    };
    update();
    setInterval(update, 1000);
}

// ============================================================
// ⭐ חציבת זהב
// ============================================================
function claimMining() {
    const now = Date.now();
    const waitTime = 4 * 60 * 60 * 1000;
    if (window.lastMining && (now - window.lastMining < waitTime)) return;

    window.lastMining = now;

    // סיכוי 1% לזהב
    if (Math.random() < 0.01) {
        window.goldBricks = (window.goldBricks || 0) + 1;
        const gbEl  = document.getElementById('gold-bricks');
        const hgbEl = document.getElementById('home-gold-bricks');
        if (gbEl)  gbEl.innerText  = window.goldBricks;
        if (hgbEl) hgbEl.innerText = window.goldBricks;
        if (typeof saveGame  === 'function') saveGame();
        if (typeof updateUI  === 'function') updateUI();
        if (typeof showMsg   === 'function') showMsg('🪎 מדהים! מצאת לבנת זהב!', 'var(--yellow)');
        window.openTab('home');
        return;
    }

    // כסף — משוקלל: סיכוי גבוה לסכום קטן, נמוך לגדול
    const roll = Math.random();
    let money;
    if      (roll < 0.60) money = Math.floor(Math.random() * 90000)  + 10000;   // 10K–100K  (60%)
    else if (roll < 0.85) money = Math.floor(Math.random() * 400000) + 100000;  // 100K–500K (25%)
    else                  money = Math.floor(Math.random() * 500000) + 500000;  // 500K–1M   (15%)

    window.money += money;
    if (typeof saveGame  === 'function') saveGame();
    if (typeof updateUI  === 'function') updateUI();
    if (typeof showMsg   === 'function') showMsg('⛏️ חצבת ' + money.toLocaleString() + ' ₪!', 'var(--blue)');
    window.openTab('home');
}

let _miningTimerInterval = null;

function startMiningTimer() {
    if (_miningTimerInterval) { clearInterval(_miningTimerInterval); _miningTimerInterval = null; }
    const timerEl = document.getElementById('miningTimer');
    const btn     = document.getElementById('miningBtn');
    const update  = function() {
        if (!timerEl || !btn) { clearInterval(_miningTimerInterval); _miningTimerInterval = null; return; }
        const timeLeft = (4 * 60 * 60 * 1000) - (Date.now() - (window.lastMining || 0));
        if (timeLeft <= 0) {
            timerEl.innerText = '✅ מוכן לחציבה!';
            btn.disabled = false; btn.style.opacity = '1';
        } else {
            const h = Math.floor(timeLeft / 3600000);
            const m = Math.floor((timeLeft % 3600000) / 60000);
            const s = Math.floor((timeLeft % 60000) / 1000);
            timerEl.innerText = 'עוד ' + h + 'ש\' ' + m + 'ד\' ' + s + 'ש\'';
            btn.disabled = true; btn.style.opacity = '0.5';
        }
    };
    update();
    _miningTimerInterval = setInterval(update, 1000);
}

// ============================================================
// ⭐ המרת לבנת זהב
// ============================================================
window.convertGoldBrick = function() {
    if (!window.goldBricks || window.goldBricks <= 0) {
        if (typeof showMsg === 'function') showMsg('❌ אין לבנות זהב להמרה', 'var(--red)');
        return;
    }
    showConfirmModal(
        '🪎 המרת זהב',
        'להמיר לבנה אחת ל-<b>2,000,000,000 ₪</b>?<br><br>💡 הכסף יכנס ישירות ל<b>בנק</b><br><br>זהב נותרות: <b>' + (window.goldBricks - 1) + '</b>',
        function() {
            window.goldBricks--;
            window.bank += 2000000000;
            const gbEl  = document.getElementById('gold-bricks');
            const hgbEl = document.getElementById('home-gold-bricks');
            if (gbEl)  gbEl.innerText  = window.goldBricks;
            if (hgbEl) hgbEl.innerText = window.goldBricks;
            if (typeof showMsg  === 'function') showMsg('🏦 המרה בוצעה! +2,000,000,000₪ לבנק', 'var(--yellow)');
            if (typeof saveGame === 'function') saveGame();
            if (typeof updateUI === 'function') updateUI();
            if (typeof window.openTab === 'function') window.openTab('home');
        }
    );
};

// ============================================================
// ⭐ ניהול שחקנים (Admin Panel helpers)
// ============================================================
let playersList           = [];
let currentPlayerPage     = 1;
const adminPlayersPerPage = 10;
let selectedPlayerForEdit = null;

async function refreshPlayersList() {
    const container = document.getElementById('adminPlayersContainer');
    if (!container) return;
    container.innerHTML = '<div style="text-align:center;opacity:0.6;padding:20px;font-size:13px;">⏳ טוען רשימת שחקנים...</div>';
    const players = await fbGetAllPlayers();
    if (!players || players.length === 0) {
        container.innerHTML = '<div style="text-align:center;opacity:0.5;padding:20px;font-size:13px;">📭 אין שחקנים במערכת</div>';
        return;
    }
    playersList = players.sort((a, b) => (b.bricks || 0) - (a.bricks || 0));
    currentPlayerPage = 1;
    renderAdminPlayersList(container);
}

function renderAdminPlayersList(container) {
    if (!container) { container = document.getElementById('adminPlayersContainer'); if (!container) return; }
    const totalPages  = Math.ceil(playersList.length / adminPlayersPerPage) || 1;
    if (currentPlayerPage > totalPages) currentPlayerPage = totalPages;
    const startIdx    = (currentPlayerPage - 1) * adminPlayersPerPage;
    const pagePlayers = playersList.slice(startIdx, startIdx + adminPlayersPerPage);

    let html = '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px;padding:8px;background:rgba(255,255,255,0.03);border-radius:6px;font-size:10px;color:#94a3b8;">' +
        '<div style="text-align:center;"><div style="color:#fff;font-size:14px;font-weight:bold;">' + playersList.length + '</div><div>סה"כ שחקנים</div></div>' +
        '<div style="text-align:center;"><div style="color:var(--yellow);font-size:14px;font-weight:bold;">' + playersList.reduce(function(s,p){return s+(p.bricks||0);},0) + '</div><div>סה"כ זהב</div></div>' +
        '<div style="text-align:center;"><div style="color:#a78bfa;font-size:14px;font-weight:bold;">' + playersList.reduce(function(s,p){return s+(p.level||1);},0) + '</div><div>סה"כ רמות</div></div>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#94a3b8;padding:0 4px;margin-bottom:6px;">' +
        '<span>מציג ' + (startIdx+1) + '-' + Math.min(startIdx+adminPlayersPerPage,playersList.length) + ' מתוך <b style="color:#fff;">' + playersList.length + '</b></span>' +
        '<span>עמוד ' + currentPlayerPage + ' / ' + totalPages + '</span></div>' +
        '<div style="display:flex;gap:6px;margin-bottom:10px;">' +
        '<button onclick="changeAdminPlayersPage(-1)" class="sys-btn" style="padding:5px 12px;font-size:11px;flex:1;" ' + (currentPlayerPage<=1?'disabled':'') + '>◀ הקודם</button>' +
        '<button onclick="changeAdminPlayersPage(1)"  class="sys-btn" style="padding:5px 12px;font-size:11px;flex:1;" ' + (currentPlayerPage>=totalPages?'disabled':'') + '>הבא ▶</button>' +
        '</div><div style="max-height:400px;overflow-y:auto;">';

    pagePlayers.forEach(function(p, index) {
        const globalRank = startIdx + index + 1;
        const isMe = p.id === getDeviceId();
        html += '<div class="lb-player-row" data-pid="' + p.id + '" style="display:grid;grid-template-columns:30px 1fr 55px 55px 45px;gap:4px;align-items:center;padding:8px 10px;background:' + (isMe?'rgba(59,130,246,0.15)':'rgba(255,255,255,0.03)') + ';border-radius:6px;margin-bottom:4px;border:1px solid ' + (isMe?'var(--blue)':'transparent') + ';font-size:12px;cursor:pointer;">' +
            '<span style="color:#64748b;font-weight:bold;text-align:center;font-size:13px;">#' + globalRank + '</span>' +
            '<div style="display:flex;flex-direction:column;overflow:hidden;">' +
            '<span style="color:' + (isMe?'var(--blue)':'#fff') + ';font-weight:bold;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;">' + (isMe?'👤 ':'') + (p.name||'אנונימי') + '</span>' +
            '<span style="font-size:8px;color:#64748b;direction:ltr;text-align:left;">ID: ' + (p.id||'').substring(0,10) + '...</span>' +
            '</div>' +
            '<span style="color:var(--yellow);text-align:center;font-weight:bold;font-size:13px;">🪎' + (p.bricks||0) + '</span>' +
            '<span style="color:#a78bfa;text-align:center;font-weight:bold;font-size:13px;">⭐' + (p.level||1) + '</span>' +
            '<button onclick="event.stopPropagation();deleteSinglePlayer(\'' + p.id + '\',\'' + (p.name||'').replace(/'/g,"\\'") + '\')" style="background:rgba(239,68,68,0.15);color:#ef4444;border:1px solid rgba(239,68,68,0.3);border-radius:6px;padding:6px 8px;font-size:13px;cursor:pointer;font-weight:bold;">🗑️</button>' +
            '</div>';
    });

    html += '</div><div style="margin-top:12px;"><button onclick="resetAllPlayers()" style="width:100%;padding:10px;background:rgba(239,68,68,0.2);color:#ef4444;border:1px solid #ef4444;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;">⚠️ מחק את כל השחקנים</button></div>';
    container.innerHTML = html;

    container.querySelectorAll('.lb-player-row').forEach(function(row) {
        row.onclick = function() { selectPlayerForEdit(this.getAttribute('data-pid')); };
    });
}

function selectPlayerForEdit(deviceId) {
    const player = playersList.find(function(p){return p.id===deviceId;});
    if (!player) return;
    selectedPlayerForEdit = player;
    const nameInput    = document.getElementById('adminEditName');
    const addMoneyInput= document.getElementById('adminEditAddMoney');
    const addBricksInput=document.getElementById('adminEditAddBricks');
    const addXpInput   = document.getElementById('adminEditAddXp');
    const targetDiv    = document.getElementById('adminEditTarget');
    const msgDiv       = document.getElementById('adminEditMsg');
    // מלא שם קיים, נקה שדות הוספה
    if (nameInput)     nameInput.value     = player.name || '';
    if (addMoneyInput) addMoneyInput.value  = '';
    if (addBricksInput)addBricksInput.value = '';
    if (addXpInput)    addXpInput.value     = '';
    if (targetDiv) {
        targetDiv.innerHTML = '✅ נבחר: <b>' + (player.name||'?') + '</b> | 🪎 ' + (player.bricks||0) + ' | ⭐ רמה ' + (player.level||1);
        targetDiv.style.color='#22c55e';
    }
    if (msgDiv) { msgDiv.innerHTML=''; msgDiv.style.color='#94a3b8'; }
    document.querySelectorAll('.lb-player-row').forEach(function(el){ el.style.borderColor='transparent'; el.style.background='rgba(255,255,255,0.03)'; });
    const selected = document.querySelector('.lb-player-row[data-pid="' + deviceId + '"]');
    if (selected) { selected.style.borderColor='#3b82f6'; selected.style.background='rgba(59,130,246,0.15)'; }
}

window.deleteSinglePlayer = function(deviceId, playerName) {
    if (!deviceId) return;
    showConfirmModal('🗑️ מחיקת שחקן',
        'למחוק את השחקן "<b>' + (playerName||'אנונימי') + '</b>"?<br><br><span style="font-size:12px;color:#94a3b8;">פעולה זו תמחק את כל הנתונים שלו מהמערכת</span>',
        async function() {
            const ok = await fbDeletePlayer(deviceId);
            if (ok) {
                if (typeof showMsg === 'function') showMsg('✅ ' + (playerName||'השחקן') + ' נמחק', 'var(--green)');
                if (selectedPlayerForEdit && selectedPlayerForEdit.id===deviceId) selectedPlayerForEdit=null;
                await refreshPlayersList();
            } else {
                if (typeof showMsg === 'function') showMsg('❌ שגיאה במחיקה', 'var(--red)');
            }
        });
};

window.changeAdminPlayersPage = function(dir) {
    const totalPages = Math.ceil(playersList.length / adminPlayersPerPage) || 1;
    currentPlayerPage = Math.max(1, Math.min(totalPages, currentPlayerPage + dir));
    renderAdminPlayersList(null);
};

window.resetAllPlayers = function() {
    showConfirmModal('⚠️ איפוס כל השחקנים',
        'למחוק את <b>כל השחקנים</b> מהמערכת?<br><br><span style="font-size:12px;color:#ef4444;font-weight:bold;">❗ פעולה זו בלתי הפיכה!</span>',
        async function() {
            const ok = await fbResetAllPlayers();
            if (ok) {
                if (typeof showMsg === 'function') showMsg('✅ כל השחקנים נמחקו', 'var(--green)');
                playersList = [];
                selectedPlayerForEdit = null;
                const container = document.getElementById('adminPlayersContainer');
                if (container) container.innerHTML = '<div style="text-align:center;opacity:0.5;padding:20px;font-size:13px;">📭 כל השחקנים נמחקו</div>';
            } else {
                if (typeof showMsg === 'function') showMsg('❌ שגיאה באיפוס', 'var(--red)');
            }
        });
};

// ============================================================
// ⭐ פאנל ניהול
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

        '<div id="adminLoginStep">' +
        '<div style="font-size:13px;color:#94a3b8;margin-bottom:10px;">כניסת מנהל (Firebase):</div>' +
        '<input id="adminUserInput" type="email" placeholder="אימייל" style="width:100%;padding:12px;background:#1e293b;color:#fff;border:1px solid #334155;border-radius:8px;font-size:14px;text-align:center;margin-bottom:8px;">' +
        '<input id="adminPassInput" type="password" placeholder="סיסמה" style="width:100%;padding:12px;background:#1e293b;color:#fff;border:1px solid #334155;border-radius:8px;font-size:14px;text-align:center;margin-bottom:12px;">' +
        '<button id="adminLoginBtn" style="width:100%;padding:12px;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:bold;cursor:pointer;">כניסה</button>' +
        '<div id="adminLoginErr" style="color:#ef4444;font-size:12px;text-align:center;margin-top:8px;display:none;">אימייל או סיסמה שגויים!</div>' +
        '</div>' +

        '<div id="adminPanelStep" style="display:none;">' +

        '<div style="background:#1e293b;border-radius:10px;padding:14px;margin-bottom:12px;border:1px solid #334155;">' +
        '<div style="font-size:12px;color:#94a3b8;margin-bottom:8px;">📢 הודעת מערכת</div>' +
        '<textarea id="adminMsgInput" rows="3" style="width:100%;padding:10px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:8px;font-size:13px;resize:none;">' + (window.adminMsgText || '') + '</textarea>' +
        '<button id="adminSaveMsg" style="width:100%;padding:10px;background:#22c55e;color:#000;border:none;border-radius:8px;font-size:13px;font-weight:bold;cursor:pointer;margin-top:8px;">💾 שמור הודעה</button>' +
        '</div>' +

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

        // סטטיסטיקות — רק כסף, בנק, זהב, רמה
        '<div style="background:#1e293b;border-radius:10px;padding:12px;margin-bottom:12px;border:1px solid #334155;">' +
        '<div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">📊 סטטיסטיקות מערכת</div>' +
        '<div id="adminStats" style="font-size:12px;color:#cbd5e1;line-height:1.9;"></div>' +
        '</div>' +

        '<div style="background:#1e293b;border-radius:10px;padding:14px;margin-bottom:12px;border:1px solid #334155;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
        '<div style="font-size:12px;color:#94a3b8;font-weight:bold;">👥 ניהול שחקנים</div>' +
        '<button id="refreshPlayersBtn" style="background:rgba(56,189,248,0.1);color:#38bdf8;border:1px solid #38bdf8;border-radius:6px;padding:4px 12px;font-size:11px;cursor:pointer;">🔄 רענן</button>' +
        '</div>' +
        '<div id="adminPlayersContainer" style="max-height:300px;overflow-y:auto;margin-bottom:10px;"><div style="text-align:center;opacity:0.5;padding:15px;font-size:12px;">לחץ "רענן" לטעינת שחקנים</div></div>' +

        '<div style="border-top:1px solid #334155;padding-top:12px;margin-top:4px;">' +
        '<div style="font-size:12px;color:#94a3b8;margin-bottom:6px;">✏️ עריכת שחקן נבחר</div>' +
        '<div style="font-size:10px;color:#f59e0b;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:6px;padding:6px 8px;margin-bottom:8px;">⚠️ עריכה משפיעה רק על הדירוג (Firebase). הזהב וXP של השחקן יישמרו גם לאחר רענון.</div>' +
        '<div id="adminEditTarget" style="font-size:11px;color:#64748b;margin-bottom:8px;padding:6px 8px;background:rgba(255,255,255,0.03);border-radius:6px;">לחץ על שחקן ברשימה לבחירה</div>' +
        '<input id="adminEditName" type="text" placeholder="👤 שם חדש (אופציונלי)" style="width:100%;padding:8px;background:#0f172a;color:#fff;border:1px solid #334155;border-radius:6px;font-size:13px;margin-bottom:8px;">' +
        '<div style="font-size:10px;color:#64748b;margin-bottom:6px;">➕ הוסף לשחקן בדירוג:</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;">' +
        '<div style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:6px;text-align:center;">' +
        '<div style="font-size:9px;color:#94a3b8;margin-bottom:4px;">🪎 זהב</div>' +
        '<input id="adminEditAddBricks" type="number" placeholder="0" style="width:100%;padding:5px;background:transparent;color:#f59e0b;border:none;font-size:12px;text-align:center;">' +
        '</div>' +
        '<div style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:6px;text-align:center;">' +
        '<div style="font-size:9px;color:#94a3b8;margin-bottom:4px;">⭐ XP</div>' +
        '<input id="adminEditAddXp" type="number" placeholder="0" style="width:100%;padding:5px;background:transparent;color:#a855f7;border:none;font-size:12px;text-align:center;">' +
        '</div>' +
        '</div>' +
        '<button id="adminSavePlayer" style="width:100%;padding:10px;background:#3b82f6;color:#fff;border:none;border-radius:6px;font-size:13px;font-weight:bold;cursor:pointer;">💾 עדכן שחקן</button>' +
        '<div id="adminEditMsg" style="font-size:12px;text-align:center;margin-top:6px;color:#94a3b8;"></div>' +
        '</div></div>' +

        '<div style="display:block;margin-top:8px;">' +
        '<button id="adminReset" style="width:100%;padding:12px;background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid #ef4444;border-radius:8px;font-size:12px;font-weight:bold;cursor:pointer;">🗑️ איפוס מלא</button>' +
        '</div>' +
        '</div></div>';

    document.body.appendChild(overlay);

    document.getElementById('adminClose').onclick = function() { overlay.remove(); };
    overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

    const userInput = document.getElementById('adminUserInput');
    const passInput = document.getElementById('adminPassInput');
    userInput.focus();
    userInput.addEventListener('keydown', function(e) { if (e.key==='Enter') passInput.focus(); });
    passInput.addEventListener('keydown', function(e) { if (e.key==='Enter') document.getElementById('adminLoginBtn').click(); });

    document.getElementById('adminLoginBtn').onclick = async function() {
        const email = document.getElementById('adminUserInput').value.trim();
        const pass  = document.getElementById('adminPassInput').value;
        if (!email || !pass) return;
        this.innerText = '⏳ מתחבר...'; this.disabled = true;
        const ok = await checkAdminCredentials(email, pass);
        this.innerText = 'כניסה'; this.disabled = false;
        if (!ok) {
            document.getElementById('adminLoginErr').style.display = 'block';
            passInput.value = ''; userInput.focus(); return;
        }
        document.getElementById('adminLoginStep').style.display = 'none';
        document.getElementById('adminPanelStep').style.display = 'block';

        updateAdminStats();

        document.getElementById('adminSaveMsg').onclick = async function() {
            const msg = document.getElementById('adminMsgInput').value.trim();
            if (!msg) { if (typeof showMsg==='function') showMsg('❌ הכנס הודעה','var(--red)'); return; }
            window.adminMsgText = msg;
            this.innerText = '⏳ שומר...'; this.disabled = true;
            await fbSaveAdminMsg(msg);
            this.innerText = '✅ נשמר!'; this.style.background = '#3b82f6';
            if (typeof showMsg==='function') showMsg('📢 הודעה נשמרה לכולם!', 'var(--green)');
            setTimeout(function(){ const btn=document.getElementById('adminSaveMsg'); if(btn){btn.innerText='💾 שמור הודעה';btn.style.background='#22c55e';btn.disabled=false;} }, 2000);
        };

        document.getElementById('adminAddMoney').onclick = function() {
            const amt = parseInt(document.getElementById('adminMoneyInput').value);
            if (!amt || amt<=0) return;
            window.money += amt;
            updateProfileUI(); if(typeof saveGame==='function') saveGame();
            if(typeof showMsg==='function') showMsg('💰 נוספו ' + amt.toLocaleString() + '₪', 'var(--yellow)');
            document.getElementById('adminMoneyInput').value = '';
            updateAdminStats();
        };

        document.getElementById('adminAddXp').onclick = async function() {
            const amt = parseInt(document.getElementById('adminXpInput').value);
            if (!amt || amt<=0) return;
            window.lifeXP += amt;
            updateProfileUI(); if(typeof saveGame==='function') saveGame();
            await syncPlayerData();
            if(typeof showMsg==='function') showMsg('⭐ נוספו ' + amt + ' XP', 'var(--purple)');
            document.getElementById('adminXpInput').value = '';
            updateAdminStats();
        };

        document.getElementById('adminAddBricks').onclick = async function() {
            const amt = parseInt(document.getElementById('adminBricksInput').value);
            if (!amt || amt<=0) return;
            window.goldBricks = (window.goldBricks || 0) + amt;
            updateProfileUI(); if(typeof saveGame==='function') saveGame();
            await syncPlayerData();
            if(typeof showMsg==='function') showMsg('🪎 נוספו ' + amt + ' לבנות זהב', 'var(--yellow)');
            document.getElementById('adminBricksInput').value = '';
            updateAdminStats();
        };

        document.getElementById('refreshPlayersBtn').onclick = function() { refreshPlayersList(); };

        document.getElementById('adminSavePlayer').onclick = async function() {
            const pid   = selectedPlayerForEdit ? selectedPlayerForEdit.id : null;
            const msgEl = document.getElementById('adminEditMsg');
            if (!pid) { msgEl.style.color='#ef4444'; msgEl.innerText='❌ בחר שחקן מהרשימה קודם'; return; }
            const player = playersList.find(function(p){return p.id===pid;});
            if (!player) { msgEl.style.color='#ef4444'; msgEl.innerText='❌ שחקן לא נמצא — רענן רשימה'; return; }

            const newName    = document.getElementById('adminEditName').value.trim();
            const addBricks  = parseInt(document.getElementById('adminEditAddBricks').value) || 0;
            const addXp      = parseInt(document.getElementById('adminEditAddXp').value)     || 0;

            const hasChange = newName || addBricks > 0 || addXp > 0;
            if (!hasChange) { msgEl.style.color='#f59e0b'; msgEl.innerText='⚠️ מלא לפחות שדה אחד'; return; }

            const updatedBricks = (player.bricks || 0) + addBricks;
            const updatedXp     = (player.xp     || 0) + addXp;
            const updatedLevel  = (typeof getLevelData === 'function')
                ? getLevelData(updatedXp).level
                : (player.level || 1);
            const updatedName   = newName || player.name;

            // payload ללידרבורד
            const lbPayload = {
                name:   updatedName,
                bricks: updatedBricks,
                level:  updatedLevel,
                xp:     updatedXp,
                ts:     Date.now()
            };

            // payload לplayerData — יוחל על המשחק המקומי של השחקן בטעינה הבאה
            const overridePayload = {
                goldBricks: updatedBricks,
                lifeXP:     updatedXp,
                name:       updatedName,
                ts:         Date.now()
            };

            this.innerText='⏳ שומר...'; this.disabled=true;
            msgEl.style.color='#94a3b8'; msgEl.innerText='⏳ שומר ל-Firebase...';

            try {
                // שלב 1 — עדכן לידרבורד
                const lbOk = await fbUpdatePlayer(pid, lbPayload);

                // שלב 2 — כתוב ל-playerData (עקיפת אדמין)
                let overrideOk = false;
                try {
                    let token = null;
                    let user = firebase.auth().currentUser;
                    if (!user) {
                        await new Promise(function(resolve) {
                            const unsub = firebase.auth().onAuthStateChanged(function(u) {
                                unsub(); user = u; resolve();
                            });
                            setTimeout(resolve, 3000);
                        });
                    }
                    if (user) token = await user.getIdToken(true);

                    if (token) {
                        const overrideUrl = FB_URL + '/playerData/' + pid + '.json?auth=' + token;
                        const res = await fetch(overrideUrl, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(overridePayload)
                        });
                        overrideOk = res.ok;
                        if (!res.ok) console.error('playerData PUT failed:', res.status, await res.text());
                    }
                } catch(e) { console.warn('playerData write failed:', e); }

                if (lbOk) {
                    // אם זה השחקן הנוכחי — עדכן גם locally מיד
                    if (pid === getDeviceId()) {
                        window.goldBricks = updatedBricks;
                        window.lifeXP     = updatedXp;
                        localStorage.setItem('playerName', updatedName);
                        updateProfileUI();
                        if (typeof saveGame === 'function') saveGame();
                    }

                    player.name   = updatedName;
                    player.bricks = updatedBricks;
                    player.level  = updatedLevel;
                    player.xp     = updatedXp;

                    let summary = '✅ ' + updatedName + ' עודכן!';
                    const parts = [];
                    if (addBricks > 0) parts.push('+' + addBricks + '🪎');
                    if (addXp     > 0) parts.push('+' + addXp     + ' XP');
                    if (parts.length > 0) summary += ' (' + parts.join(' | ') + ')';
                    if (overrideOk) summary += ' | 📲 יוחל בטעינה הבאה';

                    msgEl.style.color = '#22c55e';
                    msgEl.innerText   = summary;
                    if (typeof showMsg === 'function') showMsg(summary, 'var(--blue)');

                    document.getElementById('adminEditAddBricks').value = '';
                    document.getElementById('adminEditAddXp').value     = '';

                    const targetDiv = document.getElementById('adminEditTarget');
                    if (targetDiv) {
                        targetDiv.innerHTML = '✅ נבחר: <b>' + updatedName + '</b> | 🪎 ' + updatedBricks + ' | ⭐ רמה ' + updatedLevel;
                    }

                    await refreshPlayersList();
                } else {
                    msgEl.style.color = '#ef4444';
                    msgEl.innerText   = '❌ שגיאה בשמירה ל-Firebase';
                }
            } catch(e) {
                msgEl.style.color = '#ef4444';
                msgEl.innerText   = '❌ שגיאה: ' + e.message;
            }
            this.innerText = '💾 עדכן שחקן';
            this.disabled  = false;
        };

        document.getElementById('adminReset').onclick = function() {
            showConfirmModal('🗑️ איפוס מלא','כל ההתקדמות תימחק לצמיתות!<br><br>האם אתה בטוח?',
                function() { overlay.remove(); if (typeof resetGame==='function') resetGame(); });
        };

        await refreshPlayersList();
    };

    function updateAdminStats() {
        const ld = getLevelData(window.lifeXP || 0);
        const el = document.getElementById('adminStats');
        if (!el) return;
        // רק כסף, בנק, זהב, רמה
        el.innerHTML =
            '💰 כסף: <b>' + Math.floor(window.money||0).toLocaleString() + '₪</b><br>' +
            '🏦 בנק: <b>' + Math.floor(window.bank||0).toLocaleString() + '₪</b><br>' +
            '🪎 זהב: <b>' + (window.goldBricks||0) + ' לבנות</b><br>' +
            '⭐ רמה: <b>' + ld.level + '</b> (' + Math.floor(ld.xpInCurrentLevel).toLocaleString() + '/' + Math.floor(ld.xpForNext).toLocaleString() + ' XP)';
    }
};

window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault(); deferredPrompt = e; renderInstallBtn();
});

function renderUIUpdate(ld) {
    if (!ld && typeof getLevelData==='function') ld = getLevelData(window.lifeXP||0);
    if (ld) {
        const passiveEl  = document.getElementById('passive-display');
        const progressEl = document.getElementById('xp-progress-bar');
        const xpTextEl   = document.getElementById('xp-text-detail');
        const levelValEl = document.getElementById('home-level-val');
        const hgbEl      = document.getElementById('home-gold-bricks');
        if (passiveEl)  passiveEl.innerText = (window.passive||0).toLocaleString(undefined,{minimumFractionDigits:1,maximumFractionDigits:1}) + ' ₪/ד\'';
        if (progressEl) progressEl.style.width = ld.progressPercent + '%';
        if (xpTextEl)   xpTextEl.innerText = Math.floor(ld.xpInCurrentLevel).toLocaleString() + ' / ' + Math.floor(ld.xpForNext).toLocaleString() + ' XP';
        if (levelValEl) levelValEl.innerText = ld.level;
        if (hgbEl)      hgbEl.innerText = window.goldBricks || 0;
    }
}

window.openTab = function(t) {
    const isAuto = new Error().stack.includes('setInterval');
    if (t===currentTab && isAuto) return;
    currentTab = t;
    stopLbAutoRefresh();
    stopHomeEventTimer();
    document.querySelectorAll('.topbar button').forEach(function(b){b.classList.remove('active');});
    const btn = document.getElementById('btn' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) btn.classList.add('active');
    const c = document.getElementById('content');
    if (!c) return;
    c.style.opacity = '0.5';
    setTimeout(function() {
        c.innerHTML = '';
        if (t==='black') {
            if (typeof renderBlackMarket==='function') renderBlackMarket();
        } else {
            const drawFunc = window['draw' + t.charAt(0).toUpperCase() + t.slice(1)];
            if (typeof drawFunc==='function') drawFunc(c);
            else window.drawHome(c);
        }
        c.style.opacity = '1';
        if (t!=='invest') window.scrollTo(0,0);
        if (typeof updateUI==='function') updateUI();
        if (t==='home') {
            fbSaveScore();
            startLbAutoRefresh();
            setTimeout(function() {
                startHomeEventTimer();
                updateHomeStatusBar('🏠 דף הבית','🏠');
            }, 300);
        }
    }, 100);
    localStorage.setItem('lastTab', t);
};

window.gameTips = [
    'השקעה בנדל"ן היא הדרך הכי טובה לייצר הכנסה פסיבית בזמן שאתה ישן.',
    'שים לב ל-"חום משטרה" – אם הוא גבוה מדי, המשטרה תחרים לך כסף שחור!',
    'שדרוג אנשי צוות בעבודות מגדיל את הרווח שלך משמעותית בכל פעולה.',
    'אל תשאיר חובות לבנק – הריבית תאכל לך את הרווחים לאורך זמן.',
    'המתנה היומית מתאפסת כל 4 שעות – נצל אותה כדי לקבל עד 100,000₪!',
    'רכבים מהירים פותחים אפשרויות לעבודות יוקרתיות ורווחיות יותר.'
];

window.drawGuide = function(c) {
    const tip = window.gameTips[Math.floor(Math.random() * window.gameTips.length)];
    c.innerHTML = '<div class="card fade-in" style="border-top:3px solid var(--blue);">' +
        '<h3 style="margin-top:0;">📖 מדריך למליונר המתחיל</h3>' +
        '<div style="background:rgba(59,130,246,0.1);border-right:4px solid var(--blue);padding:15px;margin-bottom:20px;border-radius:8px;">' +
        '<small style="color:var(--blue);font-weight:bold;display:block;margin-bottom:5px;">💡 טיפ:</small>' +
        '<div style="font-size:14px;color:#fff;font-style:italic;">"' + tip + '"</div></div>' +
        '<div style="display:grid;gap:15px;">' +
        '<div class="card" style="margin:0;background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.2);"><h4 style="margin:0 0 5px 0;color:var(--green);">🔋 שלב 1: התחלה אקטיבית</h4><p style="margin:0;font-size:13px;color:#cbd5e1;">כנס ל<b>עבודות</b>. כל לחיצה נותנת כסף ו-XP.</p></div>' +
        '<div class="card" style="margin:0;background:rgba(59,130,246,0.05);border:1px solid rgba(59,130,246,0.2);"><h4 style="margin:0 0 5px 0;color:var(--blue);">🏠 שלב 2: הכנסה פסיבית</h4><p style="margin:0;font-size:13px;color:#cbd5e1;">קנה <b>נדל"ן</b> ו<b>עסקים</b> לכסף אוטומטי.</p></div>' +
        '<div class="card" style="margin:0;background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.2);"><h4 style="margin:0 0 5px 0;color:#ef4444;">🕶️ שלב 3: השוק השחור</h4><p style="margin:0;font-size:13px;color:#cbd5e1;">הרווח הגדול — אבל תלבין את הכסף השחור!</p></div>' +
        '</div>' +
        '<button class="sys-btn" style="width:100%;margin-top:20px;padding:12px;" onclick="window.openTab(\'home\')">חזרה למסך הבית</button>' +
        '</div>';
};

// ============================================================
// ⭐ דף הבית — ללא שינוי שם שחקן
// ============================================================
window.drawHome = function(c) {
    const ld = (typeof getLevelData==='function')
        ? getLevelData(window.lifeXP||0)
        : { level:1, xpInCurrentLevel:0, xpForNext:1000, progressPercent:0 };

    c.innerHTML =
        '<div class="card fade-in">' +
        '<div id="admin-box" class="admin-box">' +
        '<button class="edit-admin-btn" onclick="window.openAdminPanel()" title="פאנל ניהול">⚙️</button>' +
        '📢 <b>הודעה מהמערכת:</b><br>' +
        '<span style="font-size:13px;">' + (window.adminMsgText||'ברוכים הבאים!') + '</span></div>' +

        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">' +
        '<h3 style="margin:0;">🏠 מרכז שליטה</h3>' +
        '<button onclick="location.reload();" class="sys-btn" style="padding:5px 12px;font-size:12px;">🔄</button></div>' +

        '<div class="card" style="background:rgba(255,255,255,0.03);margin-bottom:15px;padding:12px;">' +
        '<div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:12px;">' +
        '<span>⭐ רמת חיים <b id="home-level-val">' + ld.level + '</b></span>' +
        '<span id="xp-text-detail" style="opacity:0.8;">' + Math.floor(ld.xpInCurrentLevel).toLocaleString() + ' / ' + Math.floor(ld.xpForNext).toLocaleString() + ' XP</span></div>' +
        '<div style="height:10px;background:rgba(0,0,0,0.3);border-radius:10px;overflow:hidden;">' +
        '<div id="xp-progress-bar" style="width:' + ld.progressPercent + '%;height:100%;background:linear-gradient(90deg,#3b82f6,#60a5fa);transition:width 0.4s ease;"></div></div></div>' +

        '<div class="card" style="background:rgba(245,158,11,0.05);border:1px solid rgba(245,158,11,0.3);text-align:center;padding:15px;margin-bottom:15px;">' +
        '<button id="giftBtn" onclick="claimDailyGift()" style="width:100%;background:var(--yellow);color:#000;font-weight:bold;border:none;padding:12px;border-radius:8px;font-size:14px;cursor:pointer;">🎁 קבלת בונוס</button>' +
        '<div id="giftTimer" style="font-size:12px;margin-top:8px;color:var(--yellow);font-weight:bold;">טוען...</div></div>' +

        '<div class="card" style="background:rgba(120,80,20,0.08);border:1px solid rgba(180,120,40,0.4);text-align:center;padding:15px;margin-bottom:15px;">' +
        '<button id="miningBtn" onclick="claimMining()" style="width:100%;background:linear-gradient(135deg,#92400e,#b45309);color:#fff;font-weight:bold;border:none;padding:12px;border-radius:8px;font-size:14px;cursor:pointer;">⛏️ חציבת זהב</button>' +
        '<div id="miningTimer" style="font-size:12px;margin-top:8px;color:#d97706;font-weight:bold;">טוען...</div>' +
        '<div style="font-size:10px;opacity:0.5;margin-top:4px;">1% סיכוי ללבנת זהב | עד 1,000,000 ₪</div>' +
        '</div>' +

        '<div class="grid-2" style="margin-bottom:15px;">' +
        '<div class="card" style="margin:0;padding:12px;text-align:center;border:1px solid rgba(34,197,94,0.2);">' +
        '<small style="opacity:0.7;font-size:10px;display:block;margin-bottom:4px;">💰 הכנסה פסיבית</small>' +
        '<b id="passive-display" style="color:#22c55e;font-size:15px;">' + (window.passive||0).toFixed(1) + ' ₪/ד\'</b></div>' +
        '<div class="card" style="margin:0;padding:12px;text-align:center;border:1px solid rgba(239,68,68,0.2);">' +
        '<small style="opacity:0.7;font-size:10px;display:block;margin-bottom:4px;">🏦 חוב לבנק</small>' +
        '<b style="color:#ef4444;font-size:15px;">' + (window.loan||0).toLocaleString() + ' ₪</b></div></div>' +

        '<div class="card" style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.4);text-align:center;padding:15px;margin-bottom:15px;">' +
        '<div style="font-size:12px;color:var(--yellow);font-weight:bold;margin-bottom:6px;">🪎 לבנות זהב</div>' +
        '<div style="font-size:28px;font-weight:bold;color:var(--yellow);" id="home-gold-bricks">' + (window.goldBricks||0) + '</div>' +
        '<div style="font-size:11px;opacity:0.6;margin-bottom:10px;">כל לבנה = 2,000,000,000 ₪ לבנק | מצטבר גם אופליין</div>' +
        '<button onclick="window.convertGoldBrick()" style="background:var(--yellow);color:#000;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;font-size:13px;cursor:pointer;">🏦 המר לבנה לבנק</button>' +
        '</div>' +

        '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;margin:0 0 15px;background:rgba(30,41,59,0.5);border-radius:10px;border:1px solid rgba(51,65,85,0.5);font-size:11px;color:#94a3b8;">' +
        '<span id="homeStatusLeft">📊 מערכת פעילה</span>' +
        '<span id="homeStatusRight">🔄 מתעדכן</span>' +
        '</div>' +

        '<div class="card" style="padding:12px;background:rgba(255,255,255,0.02);margin-bottom:15px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
        '<small style="opacity:0.6;font-weight:bold;">🏆 דירוג עולמי — ממוין לפי לבנות זהב</small>' +
        '<button class="sys-btn" style="font-size:10px;padding:4px 8px;" onclick="refreshLeaderboard()">🔄 רענן</button></div>' +
        '<div id="leaderboard-container"><div style="text-align:center;opacity:0.5;padding:20px;">⏳ טוען דירוג...</div></div>' +
        '</div>' +

        '<div class="card" style="padding:12px;background:rgba(255,255,255,0.02);">' +
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
    startMiningTimer();
    renderInstallBtn();
    leaderboardPage = 1;
    loadLeaderboard();
    window._eventLogPage = 1;
    window.renderEventLog();
    setTimeout(function() {
        startHomeEventTimer();
        updateHomeStatusBar('🏠 דף הבית','🏠');
    }, 500);
};

window.renderEventLog = function() {
    const cont = document.getElementById('event-log-container');
    if (!cont) return;
    const cutoff = Date.now() - 12 * 60 * 60 * 1000;
    const log = (window.eventLog||[]).filter(function(e){return e.ts>=cutoff;});
    if (log.length===0) {
        cont.innerHTML = '<div style="text-align:center;opacity:0.4;padding:12px;font-size:12px;">אין אירועים ב-12 השעות האחרונות</div>';
        return;
    }
    const page       = window._eventLogPage || 1;
    const totalPages = Math.ceil(log.length/5) || 1;
    const items      = log.slice((page-1)*5, page*5);
    function fmtTime(ts) {
        if (!ts||isNaN(ts)) return '--:--';
        const d=new Date(ts), now=new Date();
        if (d.toDateString()===now.toDateString())
            return d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0');
        return (d.getMonth()+1)+'/'+d.getDate()+' '+d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0');
    }
    let html = items.map(function(e) {
        const isPos  = e.type==='positive';
        const border = isPos?'rgba(34,197,94,0.35)':'rgba(239,68,68,0.35)';
        const bg     = isPos?'rgba(34,197,94,0.06)':'rgba(239,68,68,0.06)';
        const clr    = isPos?'#22c55e':'#ef4444';
        const icon   = isPos?'📈':'📉';
        return '<div style="display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:8px;background:'+bg+';border:1px solid '+border+';margin-bottom:5px;">'+
            '<span style="font-size:16px;flex-shrink:0;">'+icon+'</span>'+
            '<div style="flex:1;min-width:0;">'+
            '<div style="font-size:12px;font-weight:bold;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+(e.title||'')+'</div>'+
            '<div style="font-size:11px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+(e.msg||'')+'</div>'+
            '</div>'+
            '<span style="font-size:10px;color:'+clr+';font-weight:bold;flex-shrink:0;font-family:monospace;min-width:38px;text-align:left;">'+fmtTime(e.ts)+'</span>'+
            '</div>';
    }).join('');
    if (totalPages>1) {
        html += '<div style="display:flex;justify-content:center;align-items:center;gap:12px;margin-top:8px;">'+
            '<button onclick="window.changeEventLogPage(-1)" class="sys-btn" style="padding:3px 12px;font-size:11px;"'+(page<=1?' disabled':'')+'>◀</button>'+
            '<span style="font-size:12px;font-weight:bold;">'+page+' / '+totalPages+'</span>'+
            '<button onclick="window.changeEventLogPage(1)"  class="sys-btn" style="padding:3px 12px;font-size:11px;"'+(page>=totalPages?' disabled':'')+'>▶</button>'+
            '</div>';
    }
    cont.innerHTML = html;
};

window.changeEventLogPage = function(dir) {
    const cutoff = Date.now() - 12*60*60*1000;
    const total  = Math.ceil(((window.eventLog||[]).filter(function(e){return e.ts>=cutoff;}).length)/5)||1;
    window._eventLogPage = Math.max(1, Math.min(total, (window._eventLogPage||1)+dir));
    window.renderEventLog();
};

window.clearEventLog = function() {
    window.eventLog = [];
    localStorage.setItem('eventLog','[]');
    window.renderEventLog();
    if (typeof showMsg==='function') showMsg('🗑️ יומן אירועים נוקה', 'var(--blue)');
};

function renderInstallBtn() {
    const cont = document.getElementById('install-container');
    if (!cont || window.matchMedia('(display-mode: standalone)').matches || !deferredPrompt) return;
    cont.innerHTML = '<button class="action" style="background:#3b82f6;width:100%;border-radius:8px;border:none;color:white;padding:12px;font-weight:bold;" onclick="triggerInstall()">📲 התקן כאפליקציה</button>';
}

async function triggerInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome==='accepted') { deferredPrompt=null; renderInstallBtn(); }
}

document.addEventListener('DOMContentLoaded', function() {
    try { window.eventLog = JSON.parse(localStorage.getItem('eventLog') || '[]'); }
    catch(e) { window.eventLog = []; }
    fbLoadConfig().then(function() {
        const lastTab = localStorage.getItem('lastTab') || 'home';
        setTimeout(function() { window.openTab(lastTab); }, 150);
    });
});

console.log('✅ UI.js v9.9.43 loaded');
