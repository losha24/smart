/* Smart Money Pro - js/core.js - v9.9.10
   תיקון הודעת אופליין: modal נפרד + הצגת לבנות זהב
*/

const VERSION = "9.9.10";
const SAVE_KEY = "smartMoneySave_v8_main";

window.money = 1200;
window.blackMoney = 0;
window.bank = 0;
window.loan = 0;
window.lifeXP = 0;
window.passive = 0;
window.jobPassive = 0;
window.lastGift = 0;
window.skills = [];
window.cars = [];
window.inventory = [];
window.staffData = {};
window.carSpeed = 1;
window.itemLevels = {};
window.carLevels = {};
window.totalEarned = 0;
window.lastSaveTime = Date.now();
window.lastKnownLevel = 0;
window.estateData = {};
window.eventLosses = 0;
window.crimeLevel = 0;
window.policeHeat = 0;
window.gang = null;
window.activeShipments = [];
window.goldBricks = 0;

if (!localStorage.getItem("deviceID")) {
    localStorage.setItem("deviceID", 'dev_' + Math.random().toString(36).substr(2, 12));
}
window.deviceID = localStorage.getItem("deviceID");
window.playerName = localStorage.getItem("playerName") || "";

let msgTimer;

function createHash(data) {
    let str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

function getLevelData(xp) {
    let level = 1, xpForNext = 1000, totalXPStack = 0;
    while (xp >= totalXPStack + xpForNext) {
        totalXPStack += xpForNext;
        level++;
        xpForNext = Math.floor(xpForNext * 1.25);
    }
    return { level, xpInCurrentLevel: xp - totalXPStack, xpForNext, progressPercent: ((xp - totalXPStack) / xpForNext) * 100 };
}

function showMsg(txt, color = "var(--blue)") {
    const bar = document.getElementById('status-bar');
    const statusText = document.getElementById('status-text');
    if (!bar) return;
    clearTimeout(msgTimer);
    if (statusText) statusText.innerText = txt;
    else bar.innerText = txt;
    bar.style.opacity = "1";
    bar.style.transform = "translateY(0)";
    bar.style.color = color;
    bar.style.borderColor = color;
    msgTimer = setTimeout(() => {
        bar.style.opacity = "0.8";
        if (statusText) statusText.innerText = "";
    }, 3500);
}

function showMsgLong(txt, color = "var(--blue)") {
    const bar = document.getElementById('status-bar');
    const statusText = document.getElementById('status-text');
    if (!bar) return;
    clearTimeout(msgTimer);
    if (statusText) statusText.innerText = txt;
    else bar.innerText = txt;
    bar.style.opacity = "1";
    bar.style.color = color;
    bar.style.borderColor = color;
    msgTimer = setTimeout(() => {
        bar.style.opacity = "0.8";
        if (statusText) statusText.innerText = "";
    }, 8000);
}

// ⭐ הודעת אופליין כ-MODAL — כולל הצגת לבנות זהב
function showOfflineModal(offlineEarnings, eventLosses, eventCount, goldGained) {
    const existing = document.getElementById('offlineModal');
    if (existing) existing.remove();

    const finalGain = offlineEarnings - eventLosses;
    const hasLoss   = eventLosses > 0;
    const hasGold   = goldGained > 0;

    const overlay = document.createElement('div');
    overlay.id = 'offlineModal';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.80);z-index:99998;display:flex;justify-content:center;align-items:center;';

    let innerHtml = '<div style="width:88%;max-width:320px;background:#0f172a;border-radius:16px;border:2px solid #22c55e;padding:24px;text-align:center;">' +
        '<div style="font-size:32px;margin-bottom:8px;">📴➡️💰</div>' +
        '<div style="font-size:16px;font-weight:bold;color:#22c55e;margin-bottom:16px;">בזמן שלא היית...</div>';

    // רווח פסיבי
    innerHtml += '<div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);border-radius:10px;padding:12px;margin-bottom:10px;">' +
        '<div style="font-size:12px;color:#94a3b8;margin-bottom:4px;">💰 הרווחת מפסיבי</div>' +
        '<div style="font-size:22px;font-weight:bold;color:#22c55e;">+' + Math.floor(offlineEarnings).toLocaleString() + ' ₪</div>' +
        '</div>';

    // ⭐ כרטיס לבנות זהב (אם יש)
    if (hasGold) {
        innerHtml += '<div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:10px;padding:12px;margin-bottom:10px;">' +
            '<div style="font-size:12px;color:#f59e0b;margin-bottom:4px;">🪎 לבנות זהב חדשות</div>' +
            '<div style="font-size:22px;font-weight:bold;color:#f59e0b;">+' + goldGained + '</div>' +
            '<div style="font-size:10px;color:#94a3b8;margin-top:4px;">כל לבנה = 2,000,000,000 ₪</div>' +
            '</div>';
    }

    // הפסד מאירועים (רק אם יש)
    if (hasLoss) {
        innerHtml += '<div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:12px;margin-bottom:10px;">' +
            '<div style="font-size:12px;color:#94a3b8;margin-bottom:4px;">⚠️ הפסדת מאירועים</div>' +
            '<div style="font-size:22px;font-weight:bold;color:#ef4444;">-' + Math.floor(eventLosses).toLocaleString() + ' ₪</div>' +
            '</div>';
    }

    // סה"כ
    innerHtml += '<div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.3);border-radius:10px;padding:12px;margin-bottom:16px;">' +
        '<div style="font-size:12px;color:#94a3b8;margin-bottom:4px;">✅ סה"כ נשאר</div>' +
        '<div style="font-size:24px;font-weight:bold;color:' + (finalGain >= 0 ? '#38bdf8' : '#ef4444') + ';">' +
        (finalGain >= 0 ? '+' : '') + Math.floor(finalGain).toLocaleString() + ' ₪</div>' +
        '</div>';

    // מספר אירועים
    if (eventCount > 0) {
        innerHtml += '<div style="font-size:11px;color:#64748b;margin-bottom:14px;">📊 קרו ' + eventCount + ' אירועים בזמן היעדרותך</div>';
    }

    innerHtml += '<button id="offlineModalClose" style="width:100%;padding:12px;border-radius:8px;border:none;background:#22c55e;color:#000;font-size:14px;font-weight:bold;cursor:pointer;">המשך לשחק 🚀</button>' +
        '</div>';

    overlay.innerHTML = innerHtml;
    document.body.appendChild(overlay);

    document.getElementById('offlineModalClose').onclick = function() {
        overlay.remove();
    };
    overlay.onclick = function(e) {
        if (e.target === overlay) overlay.remove();
    };

    // סגור אוטומטית אחרי 15 שניות
    setTimeout(() => {
        if (document.getElementById('offlineModal')) {
            document.getElementById('offlineModal').remove();
        }
    }, 15000);
}

const MAX_MONEY = 2000000000; // ⭐ 2 מיליארד

function loadGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
            const saveData = JSON.parse(saved);
            const data = saveData.data || saveData;

            window.playerName      = data.playerName      || window.playerName;
            window.money           = data.money           ?? 1200;
            window.bank            = data.bank            ?? 0;
            window.loan            = data.loan            ?? 0;
            window.lifeXP          = data.lifeXP          ?? 0;
            window.passive         = data.passive         ?? 0;
            window.jobPassive      = data.jobPassive      ?? 0;
            window.lastGift        = data.lastGift        ?? 0;
            window.skills          = data.skills          ?? [];
            window.cars            = data.cars            ?? [];
            window.inventory       = data.inventory       ?? [];
            window.carSpeed        = data.carSpeed        ?? 1;
            window.totalEarned     = data.totalEarned     ?? 0;
            window.estateData      = data.estateData      || {};
            window.itemLevels      = data.itemLevels      ?? {};
            window.carLevels       = data.carLevels       ?? {};
            window.staffData       = data.staffData       ?? {};
            window.crimeLevel      = data.crimeLevel      ?? 0;
            window.policeHeat      = data.policeHeat      ?? 0;
            window.gang            = data.gang            || null;
            window.blackMoney      = data.blackMoney      ?? 0;
            window.activeShipments = data.activeShipments || [];
            window.goldBricks      = data.goldBricks      ?? 0;
            window.lastKnownLevel  = getLevelData(window.lifeXP).level;

            if (data.lastSaveTime && window.passive > 0) {
                const now      = Date.now();
                const msPassed = Math.min(now - data.lastSaveTime, 12 * 60 * 60 * 1000);
                const offlineEarnings = (msPassed / 60000) * window.passive;

                if (offlineEarnings > 1) {
                    const totalMoney = window.money + offlineEarnings;
                    const newBricks  = Math.floor(totalMoney / MAX_MONEY);
                    let goldGained = 0;
                    
                    if (newBricks > 0) {
                        goldGained = newBricks;
                        window.goldBricks = (window.goldBricks || 0) + newBricks;
                        window.money = totalMoney % MAX_MONEY;
                    } else {
                        window.money += offlineEarnings;
                    }
                    window.totalEarned += offlineEarnings;

                    const eventLast        = parseInt(data.lastEventTick || data.lastSaveTime || now);
                    const msSinceLastEvent = Math.min(now - eventLast, 12 * 60 * 60 * 1000);
                    const minutesPassed    = Math.floor(msSinceLastEvent / 60000);
                    const moneyBeforeEvents = window.money;

                    window._offlineMode       = true;
                    window._offlineEventCount = 0;

                    if (minutesPassed > 0 && typeof window.triggerRandomEvent === 'function') {
                        for (let i = 0; i < minutesPassed; i++) {
                            if (Math.random() < 0.70) {
                                const fraction = (i + 1) / minutesPassed;
                                const eventTs  = Math.floor(eventLast + (msSinceLastEvent * fraction));
                                window.triggerRandomEvent(eventTs);
                                window._offlineEventCount++;
                            }
                        }
                    }

                    window._offlineMode = false;

                    if (typeof window.recalcPassive === 'function') {
                        window.recalcPassive();
                    }

                    const eventLosses = Math.max(0, moneyBeforeEvents - window.money);

                    window.lastEventTick = now;
                    localStorage.setItem('lastEventTick', now);

                    // ⭐ הצג MODAL אחרי 1.5 שניות — כולל מידע על זהב
                    setTimeout(() => {
                        showOfflineModal(
                            offlineEarnings,
                            eventLosses,
                            window._offlineEventCount || 0,
                            goldGained
                        );
                        if (typeof updateUI === 'function') updateUI();
                    }, 1500);
                }
            }
        } else {
            window.lastKnownLevel = 1;
        }
    } catch(e) { console.error('שגיאה בטעינה:', e); }
}

function saveGame() {
    window.lastSaveTime  = Date.now();
    window.lastEventTick = window.lastEventTick || Date.now();
    const data = {
        playerName:      window.playerName,
        money:           window.money,
        bank:            window.bank,
        loan:            window.loan,
        lifeXP:          window.lifeXP,
        passive:         window.passive,
        jobPassive:      window.jobPassive,
        lastGift:        window.lastGift,
        skills:          window.skills,
        cars:            window.cars,
        inventory:       window.inventory,
        carSpeed:        window.carSpeed,
        totalEarned:     window.totalEarned,
        lastSaveTime:    window.lastSaveTime,
        lastEventTick:   window.lastEventTick,
        estateData:      window.estateData,
        itemLevels:      window.itemLevels,
        carLevels:       window.carLevels,
        staffData:       window.staffData,
        eventLosses:     window.eventLosses  || 0,
        crimeLevel:      window.crimeLevel   || 0,
        policeHeat:      window.policeHeat   || 0,
        gang:            window.gang         || null,
        blackMoney:      window.blackMoney   || 0,
        activeShipments: window.activeShipments || [],
        goldBricks:      window.goldBricks      || 0
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify({ data, hash: createHash(data) }));
    window.lastEventTick = Date.now();
    localStorage.setItem('lastEventTick', window.lastEventTick);
}

function updateUI() {
    const mEl  = document.getElementById('money');
    const bEl  = document.getElementById('bank');
    const lEl  = document.getElementById('life-level-ui');
    const gbEl = document.getElementById('gold-bricks');
    if (mEl)  mEl.innerText  = Math.floor(window.money).toLocaleString();
    if (bEl)  bEl.innerText  = Math.floor(window.bank).toLocaleString();
    if (gbEl) gbEl.innerText = window.goldBricks || 0;
    const ld = getLevelData(window.lifeXP);
    if (lEl) lEl.innerText = ld.level;
    if (typeof window.renderUIUpdate === 'function') window.renderUIUpdate(ld);
    checkLevelUp(ld.level);
}

function checkLevelUp(currentLevel) {
    if (currentLevel > window.lastKnownLevel && window.lastKnownLevel > 0) {
        const bonus = currentLevel * 1000;
        window.money += bonus;
        showMsg('🎊 מזל טוב! עלית לרמה ' + currentLevel + '! קיבלת ' + bonus.toLocaleString() + '₪!', 'var(--purple)');
        window.lastKnownLevel = currentLevel;
        updateUI();
    }
}

function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem('adminLoginLog');
    localStorage.removeItem('crimeLevel');
    localStorage.removeItem('policeHeat');
    localStorage.removeItem('blackMoney');
    localStorage.removeItem('launderFee');
    localStorage.removeItem('gangName');
    localStorage.removeItem('lastTab');
    localStorage.removeItem('nextEventTime');
    localStorage.removeItem('playerName');
    localStorage.removeItem('jailUntil');
    localStorage.removeItem('jailPassiveSaved');
    localStorage.removeItem('lastJailTime');
    localStorage.removeItem('eventLog');
    localStorage.removeItem('lastEventTick');
    location.reload();
}

function savePlayerName() {
    const input = document.getElementById("player-name-input");
    const name = input.value.trim();
    if (name.length < 2) { alert("הכנס שם שחקן"); return; }
    localStorage.setItem("playerName", name);
    window.playerName = name;
    const el = document.getElementById("player-start");
    if (el) el.style.display = "none";
    showMsg("ברוך הבא " + name + " 🚀");
    saveGame();
}

setInterval(() => {
    if (window.passive > 0) {
        const tick = window.passive / 1200;
        window.money += tick;
        window.totalEarned += tick;
        if (window.money >= MAX_MONEY) {
            window.goldBricks = (window.goldBricks || 0) + 1;
            window.money -= MAX_MONEY;
            const gbEl = document.getElementById('gold-bricks');
            if (gbEl) gbEl.innerText = window.goldBricks;
            showMsg('🏅 צברת 2B ₪! קיבלת לבנת זהב! סה"כ: ' + window.goldBricks, 'var(--yellow)');
            saveGame();
        }
        const mEl = document.getElementById('money');
        if (mEl) mEl.innerText = Math.floor(window.money).toLocaleString();
    }
}, 50);

setInterval(() => {
    if (typeof window.renderUIUpdate === 'function') {
        window.renderUIUpdate(getLevelData(window.lifeXP));
    }
}, 1000);

setInterval(saveGame, 15000);

window.nextEventTime = parseInt(localStorage.getItem('nextEventTime')) || 60;
const EVENT_INTERVAL = 60;
const EVENT_CHANCE   = 0.80;

function startEventTimer() {
    setInterval(() => {
        window.nextEventTime--;
        localStorage.setItem('nextEventTime', window.nextEventTime);
        const timerEl = document.getElementById('event-timer');
        if (timerEl) {
            const mins = Math.floor(window.nextEventTime / 60);
            const secs = window.nextEventTime % 60;
            timerEl.innerText = mins + ':' + (secs < 10 ? '0' : '') + secs;
        }
        if (window.nextEventTime <= 0) {
            if (Math.random() < EVENT_CHANCE && typeof window.triggerRandomEvent === 'function') {
                window.triggerRandomEvent();
            }
            window.nextEventTime = EVENT_INTERVAL;
            localStorage.setItem('nextEventTime', window.nextEventTime);
        }
    }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("playerName")) {
        const el = document.getElementById("player-start");
        if (el) el.style.display = "flex";
    }
    loadGame();

    setTimeout(() => {
        if (typeof window.recalcPassive === 'function') {
            window.recalcPassive();
        }
        updateUI();
        startEventTimer();
    }, 200);
});
