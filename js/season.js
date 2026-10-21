/* Smart Money Pro - js/season.js - v1.0.0
   מערכת עונות: איפוס כל השחקנים דרך מספר עונה ב-Firebase (/config/season).
   - בכל כניסה (ובדיקה תקופתית) המכשיר משווה את seasonId המקומי לעונה בשרת.
     אם השרת גבוה יותר -> מחיקת השמירה המקומית והתחלה מאפס.
   - האדמין מפעיל עונה חדשה מפאנל הניהול (כרטיס "עונות" נוסף אוטומטית).
   חובה לטעון אחרי ui.js (עם defer). */
(function () {
    'use strict';

    const FB = 'https://smart-money-faf43-default-rtdb.europe-west1.firebasedatabase.app';
    const SAVE_KEY_LOCAL = 'smartMoneySave_v8_main';

    // מפתחות localStorage שנשארים אחרי איפוס עונה (זהות השחקן)
    // lastAdminOverrideTs חייב להישאר - אחרת override ישן של אדמין יוחל שוב על המשחק החדש
    const KEEP_KEYS = ['playerName', 'deviceID', 'deviceId', 'myRecoveryCode', 'lastAdminOverrideTs', 'seasonId'];
    const KEEP_PREFIXES = ['firebase:'];

    function localSeason() { return parseInt(localStorage.getItem('seasonId')) || 0; }

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    async function fetchSeason() {
        const res = await fetch(FB + '/config/season.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('season fetch ' + res.status);
        const s = await res.json();
        return (s && typeof s.id === 'number') ? s : { id: 0, ts: 0 };
    }

    // ------------------------------------------------------------
    // איפוס מקומי לעונה חדשה
    // ------------------------------------------------------------
    function wipeForNewSeason(newId) {
        window._resetting = true; // חוסם saveGame ו-fbBackupFullSave (ראה core.js)
        try {
            Object.keys(localStorage).forEach(function (k) {
                if (KEEP_KEYS.indexOf(k) !== -1) return;
                if (KEEP_PREFIXES.some(function (p) { return k.indexOf(p) === 0; })) return;
                localStorage.removeItem(k);
            });
            localStorage.setItem('seasonId', String(newId));
            localStorage.setItem('seasonWelcome', String(newId)); // להצגת הודעת פתיחה אחרי הרענון
        } catch (e) { console.warn('wipeForNewSeason:', e); }
        location.reload();
    }

    // ------------------------------------------------------------
    // בדיקת עונה
    // ------------------------------------------------------------
    let _checking = false;
    let _lastCheck = 0;

    async function checkSeason(force) {
        if (_checking || window._resetting) return;
        if (!force && Date.now() - _lastCheck < 30000) return;
        _checking = true;
        _lastCheck = Date.now();
        try {
            const s = await fetchSeason();
            const local = localSeason();
            if (s.id > local) {
                const hasSave = !!localStorage.getItem(SAVE_KEY_LOCAL);
                if (hasSave) { wipeForNewSeason(s.id); return; }
                // התקנה חדשה בלי התקדמות - רק מסנכרנים את המספר
            }
            localStorage.setItem('seasonId', String(s.id));
            const firstTime = (window.seasonId === undefined);
            window.seasonId = s.id;
            // הדירוג בדף הבית נטען לפני שידענו את העונה - טוענים שוב
            if (firstTime && typeof loadLeaderboard === 'function' && document.getElementById('leaderboard-container')) {
                loadLeaderboard();
            }
        } catch (e) {
            console.warn('checkSeason failed:', e);
            if (window.seasonId === undefined) window.seasonId = localSeason(); // אין רשת - ממשיכים עם המקומי
        } finally { _checking = false; }
    }
    window.checkSeason = checkSeason;

    // ------------------------------------------------------------
    // הודעת פתיחה אחרי איפוס (עם 3 המובילים של העונה הקודמת)
    // ------------------------------------------------------------
    async function showWelcome() {
        const id = parseInt(localStorage.getItem('seasonWelcome'));
        if (!id) return;
        localStorage.removeItem('seasonWelcome');

        let winnersHtml = '';
        try {
            const res = await fetch(FB + '/seasons/' + (id - 1) + '.json');
            const d = res.ok ? await res.json() : null;
            const top = d && d.top ? Object.values(d.top).slice(0, 3) : [];
            const medals = ['🥇', '🥈', '🥉'];
            if (top.length) {
                winnersHtml = '<div style="margin:12px 0 4px;font-size:12px;color:#94a3b8;">🏆 מנצחי העונה הקודמת</div>' +
                    top.map(function (p, i) {
                        return '<div style="font-size:13px;color:#fff;">' + medals[i] + ' ' + esc(p.name) +
                            ' — 🪎 ' + (p.bricks || 0) + ' | ⭐ ' + (p.level || 1) + '</div>';
                    }).join('');
            }
        } catch (e) {}

        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.88);z-index:99999;display:flex;justify-content:center;align-items:center;';
        overlay.innerHTML =
            '<div style="width:88%;max-width:340px;background:#0f172a;border-radius:16px;border:2px solid #f59e0b;padding:24px;text-align:center;">' +
            '<div style="font-size:34px;margin-bottom:6px;">🏁</div>' +
            '<div style="font-size:18px;font-weight:bold;color:#f59e0b;margin-bottom:8px;">עונה ' + id + ' התחילה!</div>' +
            '<div style="font-size:13px;color:#cbd5e1;line-height:1.6;">כולם מתחילים מאפס.<br>הדירוג נוקה והמשחק מחכה לך.</div>' +
            winnersHtml +
            '<button id="seasonWelcomeBtn" style="width:100%;margin-top:16px;padding:12px;border:none;border-radius:8px;background:#f59e0b;color:#000;font-size:14px;font-weight:bold;cursor:pointer;">בואו נתחיל 🚀</button>' +
            '</div>';
        document.body.appendChild(overlay);
        document.getElementById('seasonWelcomeBtn').onclick = function () { overlay.remove(); };
    }

    // ------------------------------------------------------------
    // אדמין: הפעלת עונה חדשה
    // סדר הפעולות חשוב: ארכוב -> ניקוי -> הפעלה אחרונה.
    // אם מפעילים קודם, המכשירים מתאפסים ומיד כותבים לדירוג, והניקוי היה מוחק אותם.
    // ------------------------------------------------------------
    async function startNewSeason() {
        const user = firebase.auth().currentUser;
        if (!user) return { ok: false, msg: '❌ לא מחובר כמנהל' };
        const token = await user.getIdToken(true);
        const q = '?auth=' + token;

        const cur = await fetchSeason();
        const oldId = cur.id;

        // 1. ארכוב 10 המובילים של העונה שנגמרת
        const lbRes = await fetch(FB + '/leaderboard.json');
        const lb = lbRes.ok ? await lbRes.json() : null;
        const top = Object.entries(lb || {})
            .map(function (e) { const p = e[1] || {}; return { id: e[0], name: p.name || 'שחקן', bricks: p.bricks || 0, level: p.level || 1, season: p.season || 0 }; })
            .filter(function (p) { return p.season === oldId; })
            .sort(function (a, b) { return b.bricks - a.bricks || b.level - a.level; })
            .slice(0, 10);
        const arch = await fetch(FB + '/seasons/' + oldId + '.json' + q, {
            method: 'PUT', body: JSON.stringify({ ts: Date.now(), top: top })
        });
        if (!arch.ok) return { ok: false, msg: '❌ ארכוב נכשל (' + arch.status + ') - בדוק Rules של /seasons' };

        // 2. ניקוי דירוג, גיבויי ענן ועקיפות אדמין (recoveryCodes נשאר - זו הזהות של השחקנים)
        const paths = ['leaderboard', 'players', 'playerData'];
        for (let i = 0; i < paths.length; i++) {
            const r = await fetch(FB + '/' + paths[i] + '.json' + q, { method: 'DELETE' });
            if (!r.ok) return { ok: false, msg: '❌ מחיקת /' + paths[i] + ' נכשלה (' + r.status + ') - בדוק Rules' };
        }

        // 3. הפעלה - מכאן כל מכשיר שיבדוק יתאפס
        const act = await fetch(FB + '/config/season.json' + q, {
            method: 'PUT', body: JSON.stringify({ id: oldId + 1, ts: Date.now() })
        });
        if (!act.ok) return { ok: false, msg: '❌ הפעלת העונה נכשלה (' + act.status + ')' };
        return { ok: true, id: oldId + 1 };
    }
    window.startNewSeason = startNewSeason;

    // מוסיף כרטיס "עונות" לראש פאנל הניהול בלי לגעת ב-ui.js
    function installAdminCard() {
        const orig = window.openAdminPanel;
        if (typeof orig !== 'function' || orig._seasonWrapped) return;
        const wrapped = function () {
            orig.apply(this, arguments);
            const step = document.getElementById('adminPanelStep');
            if (!step) return;
            step.insertAdjacentHTML('afterbegin',
                '<div style="background:#1e293b;border-radius:10px;padding:14px;margin-bottom:12px;border:1px solid #f59e0b;">' +
                '<div style="font-size:12px;color:#f59e0b;font-weight:bold;margin-bottom:6px;">🏁 עונות</div>' +
                '<div id="seasonInfo" style="font-size:12px;color:#cbd5e1;margin-bottom:8px;">עונה נוכחית: <b>' + (window.seasonId === undefined ? '?' : window.seasonId) + '</b></div>' +
                '<button id="startSeasonBtn" style="width:100%;padding:10px;background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid #f59e0b;border-radius:8px;font-size:13px;font-weight:bold;cursor:pointer;">🏁 התחל עונה חדשה</button>' +
                '<div id="seasonMsg" style="font-size:12px;text-align:center;margin-top:6px;"></div>' +
                '</div>');

            document.getElementById('startSeasonBtn').onclick = function () {
                const btn = this;
                const msgEl = document.getElementById('seasonMsg');
                showConfirmModal('🏁 עונה חדשה',
                    'כל השחקנים יאופסו <b>לגמרי</b>, כולל המכשיר שלך.<br>הדירוג והגיבויים בענן יימחקו, ו-10 המובילים יישמרו בארכיון.<br><br><span style="color:#ef4444;font-weight:bold;">❗ פעולה בלתי הפיכה</span>',
                    async function () {
                        btn.disabled = true;
                        msgEl.style.color = '#94a3b8';
                        msgEl.innerText = '⏳ מפעיל עונה חדשה...';
                        let r;
                        try { r = await startNewSeason(); } catch (e) { r = { ok: false, msg: '❌ שגיאה: ' + e.message }; }
                        if (!r.ok) {
                            msgEl.style.color = '#ef4444';
                            msgEl.innerText = r.msg;
                            btn.disabled = false;
                            return;
                        }
                        msgEl.style.color = '#22c55e';
                        msgEl.innerText = '✅ עונה ' + r.id + ' התחילה! המכשיר שלך מתאפס...';
                        setTimeout(function () { checkSeason(true); }, 1200);
                    });
            };
        };
        wrapped._seasonWrapped = true;
        window.openAdminPanel = wrapped;
    }

    // ------------------------------------------------------------
    // אתחול
    // ------------------------------------------------------------
    installAdminCard();
    checkSeason(true);
    setInterval(function () { checkSeason(false); }, 5 * 60 * 1000);
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') checkSeason(false);
    });
    document.addEventListener('DOMContentLoaded', function () { setTimeout(showWelcome, 1000); });

    console.log('✅ season.js v1.0.0 loaded');
})();
