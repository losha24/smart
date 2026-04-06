/* Smart Money Pro - js/ui.js - v8.0.0 - Firebase Leaderboard + Hashed Password */

let deferredPrompt;
let currentTab = 'home';
let leaderboardPage = 1;
const playersPerPage = 5;

// ============================================================
// אבטחת מנהל - hash פשוט (djb2) ללא שרת
// ============================================================
function hashStr(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString(16);
}

// סיסמת ברירת מחדל: 1234 → שמור hash בלבד
const DEFAULT_HASH = hashStr('1234');
if (!localStorage.getItem('adminPassHash')) {
    localStorage.setItem('adminPassHash', DEFAULT_HASH);
}

function checkAdminPass(input) {
    return hashStr(input) === localStorage.getItem('adminPassHash');
}

// ============================================================
// Firebase Realtime DB - דירוג אמיתי
// ============================================================
const FB_URL = 'https://smart-money-faf43-default-rtdb.europe-west1.firebasedatabase.app';

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
        // קריאה פשוטה ללא orderBy (לא דורש index ב-rules)
        const res = await fetch(FB_URL + '/leaderboard.json');
        if (!res.ok) return null;
        const data = await res.json();
        if (!data) return [];
        return Object.entries(data)
            .map(([id, p]) => ({ ...p, id }))
            .sort((a, b) => b.money - a.money)
            .slice(0, 50);
    } catch(e) {
        console.warn('FB read failed:', e);
        return null;
    }
}

function getDeviceId() {
    let id = localStorage.getItem('deviceId');
    if (!id) {
        id = 'dev_' + Math.random().toString(36).substr(2, 12);
        localStorage.setItem('deviceId', id);
    }
    return id;
}

// ============================================================
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    renderInstallBtn();
});

function renderUIUpdate(ld) {
    if (!ld && typeof getLevelData === 'function') {
        ld = getLevelData(window.lifeXP || 0);
    }
    if (currentTab === 'home' && ld) {
        const passiveEl = document.getElementById('passive-display');
        const progressEl = document.getElementById('xp-progress-bar');
        const xpTextEl = document.getElementById('xp-text-detail');
        const levelValEl = document.getElementById('home-level-val');
        if (passiveEl) passiveEl.innerText = (window.passive || 0).toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1}) + ' ₪/ד\'';
        if (progressEl) progressEl.style.width = ld.progressPercent + '%';
        if (xpTextEl) xpTextEl.innerText = Math.floor(ld.xpInCurrentLevel).toLocaleString() + ' / ' + Math.floor(ld.xpForNext).toLocaleString() + ' XP';
        if (levelValEl) levelValEl.innerText = ld.level;
    }
}

// ============================================================
// Modal אישור במקום confirm() (נתמך בכל דפדפן/PWA)
// ============================================================
window.showConfirmModal = function(title, bodyHtml, onConfirm) {
    // הסר modal קודם אם קיים
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
    document.getElementById('confirmModalYes').onclick = function() {
        overlay.remove();
        onConfirm();
    };
};

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
        if (t !== 'invest') window.scrollTo(0,0);
        if(typeof updateUI === 'function') updateUI();
        // שמירת ניקוד ב-Firebase בכל מעבר עמוד
        if (t === 'home') fbSaveScore();
    }, 100);
};

// ============================================================
// דף הבית עם Firebase Leaderboard
// ============================================================
window.drawHome = function(c) {
    const ld = (typeof getLevelData === 'function')
               ? getLevelData(window.lifeXP || 0)
               : { level: 1, xpInCurrentLevel: 0, xpForNext: 1000, progressPercent: 0 };

    const playerName = localStorage.getItem('playerName') || 'שחקן';

    c.innerHTML =
        '<div class="card fade-in">' +
        '<div id="admin-box" class="admin-box"><button class="edit-admin-btn" onclick="window.editAdminMsg()">✏️</button>' +
        '📢 <b>הודעה מהמערכת:</b><br><span style="font-size:13px;">' + (window.adminMsgText || 'ברוכים הבאים!') + '</span></div>' +

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
        '<button id="giftBtn" onclick="claimDailyGift()" class="action-btn" style="width:100%;background:var(--yellow);color:#000;font-weight:bold;border:none;padding:12px;border-radius:8px;">🎁 קבלת בונוס</button>' +
        '<div id="giftTimer" style="font-size:12px;margin-top:8px;color:var(--yellow);font-weight:bold;">טוען...</div></div>' +

        '<div class="grid-2">' +
        '<div class="card" style="margin:0;padding:12px;text-align:center;border:1px solid rgba(34,197,94,0.2);">' +
        '<small style="opacity:0.7;font-size:10px;display:block;margin-bottom:4px;">💰 הכנסה פסיבית</small>' +
        '<b id="passive-display" style="color:#22c55e;font-size:15px;">' + (window.passive || 0).toFixed(1) + ' ₪/ד\'</b></div>' +
        '<div class="card" style="margin:0;padding:12px;text-align:center;border:1px solid rgba(239,68,68,0.2);">' +
        '<small style="opacity:0.7;font-size:10px;display:block;margin-bottom:4px;">🏦 חוב לבנק</small>' +
        '<b style="color:#ef4444;font-size:15px;">' + (window.loan || 0).toLocaleString() + ' ₪</b></div></div>' +

        // שם שחקן
        '<div class="card" style="margin-top:15px;padding:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);">' +
        '<div style="display:flex;gap:8px;align-items:center;">' +
        '<input id="nameInput" type="text" value="' + playerName + '" placeholder="השם שלך בדירוג" maxlength="20" style="flex:1;padding:8px;background:#000;color:#fff;border:1px solid #333;border-radius:6px;font-size:13px;">' +
        '<button class="sys-btn" style="padding:8px 14px;" onclick="saveName()">💾</button></div></div>' +

        // לידרבורד
        '<div class="card" style="margin-top:15px;padding:12px;background:rgba(255,255,255,0.02);">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
        '<small style="opacity:0.6;font-weight:bold;">🏆 דירוג עולמי אמיתי</small>' +
        '<button class="sys-btn" style="font-size:10px;padding:4px 8px;" onclick="refreshLeaderboard()">🔄 רענן</button></div>' +
        '<div id="leaderboard-container"><div style="text-align:center;opacity:0.5;padding:20px;">⏳ טוען דירוג...</div></div>' +
        '<div style="display:flex;justify-content:center;align-items:center;gap:15px;margin-top:12px;">' +
        '<button onclick="changeLPage(-1)" id="lbPrev" class="sys-btn" style="padding:5px 15px;">◀</button>' +
        '<span id="lbPageInfo" style="font-size:13px;font-weight:bold;">1 / 1</span>' +
        '<button onclick="changeLPage(1)" id="lbNext" class="sys-btn" style="padding:5px 15px;">▶</button></div></div>' +

        '<div id="install-container" style="margin-top:20px;"></div>' +
        '<button class="sys-btn" style="border:1px solid #451a1a;color:#ef4444;margin-top:25px;font-size:11px;padding:10px;width:100%;opacity:0.7;" onclick="if(confirm(\'לאפס הכל?\')) resetGame()">🗑️ איפוס חשבון</button>' +
        '</div>';

    startGiftTimer();
    renderInstallBtn();
    loadLeaderboard();
};

let lbAllPlayers = [];

async function loadLeaderboard() {
    const cont = document.getElementById('leaderboard-container');
    if (!cont) return;
    // בדוק אם Firebase הוגדר
    const players = await fbGetLeaderboard();
    if (players === null) {
        const ld = getLevelData(window.lifeXP || 0);
        lbAllPlayers = [{ name: localStorage.getItem('playerName') || 'אתה', money: Math.floor(window.money), level: ld.level, isPlayer: true }];
        cont.innerHTML = '<div style="text-align:center;font-size:11px;opacity:0.5;padding:8px;">📡 אין חיבור - מציג מקומי</div>' + renderLbPage();
        return;
    }
    const deviceId = getDeviceId();
    const ld = getLevelData(window.lifeXP || 0);
    // עדכן את השחקן הנוכחי
    lbAllPlayers = players.map(p => ({
        ...p,
        isPlayer: p.id === deviceId
    }));
    // אם השחקן לא ברשימה
    if (!lbAllPlayers.find(p => p.isPlayer)) {
        lbAllPlayers.push({ name: localStorage.getItem('playerName') || 'אתה', money: Math.floor(window.money), level: ld.level, isPlayer: true });
        lbAllPlayers.sort((a,b) => b.money - a.money);
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
            '<div style="font-size:10px;opacity:0.5;">רמה ' + p.level + '</div></div></div>' +
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

// מתנה יומית
function claimDailyGift() {
    const now = Date.now();
    const waitTime = 4 * 60 * 60 * 1000;
    if (window.lastGift && (now - window.lastGift < waitTime)) return;
    const currentLvl = (typeof getLevelData === 'function') ? getLevelData(window.lifeXP).level : 1;
    const bonus = 500 + (currentLvl * 250);
    window.money += bonus;
    window.lastGift = now;
    if(typeof saveGame === 'function') saveGame();
    if(typeof updateUI === 'function') updateUI();
    if(typeof showMsg === 'function') showMsg('🎁 קיבלת ' + bonus.toLocaleString() + '₪!', 'var(--green)');
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

// PWA
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

// ============================================================
// תפריט מנהל - hash מוצפן
// ============================================================
window.editAdminMsg = function() {
    const pass = prompt('שלום! הכנס סיסמת מנהל:');
    if (pass === null) return;
    if (!checkAdminPass(pass)) return alert('סיסמה שגויה!');

    const action = prompt(
        '--- תפריט מנהל ---\n' +
        '1 - עריכת הודעת מערכת\n' +
        '2 - הוספת כסף (Cheat)\n' +
        '3 - הוספת XP (Boost)\n' +
        '4 - שינוי סיסמת מנהל\n' +
        '5 - System Check', '1'
    );

    switch(action) {
        case '1':
            const newMsg = prompt('הכנס הודעה חדשה:', window.adminMsgText || '');
            if (newMsg !== null) { window.adminMsgText = newMsg; window.openTab('home'); }
            break;
        case '2':
            const m = prompt('כמה כסף להוסיף?');
            if (m) { window.money += parseInt(m); updateUI(); saveGame(); window.openTab('home'); }
            break;
        case '3':
            const x = prompt('כמה XP להוסיף?');
            if (x) { window.lifeXP += parseInt(x); updateUI(); saveGame(); window.openTab('home'); }
            break;
        case '4':
            const newPass = prompt('הכנס סיסמה חדשה (מינימום 4 תווים):');
            if (newPass && newPass.length >= 4) {
                localStorage.setItem('adminPassHash', hashStr(newPass));
                alert('הסיסמה שונתה בהצלחה!');
            } else { alert('שגיאה: סיסמה קצרה מדי.'); }
            break;
        case '5':
            const script = document.createElement('script');
            script.src = 'js/debug.js?v=' + Date.now();
            document.body.appendChild(script);
            break;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { window.openTab('home'); }, 150);
});
