/* Smart Money Pro - js/auth.js - v9.1.2 */

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBtohjQmS8h2ecDkbNaJbpHTtpWXbm-M5Y",
    authDomain: "smart-money-faf43.firebaseapp.com",
    databaseURL: "https://smart-money-faf43-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "smart-money-faf43",
    storageBucket: "smart-money-faf43.appspot.com",
    messagingSenderId: "55641338232",
    appId: "1:55641338232:web:85ad1f1243fb2eefcd988d"
};

const ADMIN_EMAIL = "losha23@gmail.com";

// מצב גלובלי
window.isAdmin = false;
window.currentUID = null;
window.fbUser = null;
window.fbDB = null;

let scoreSaveTimer = null;
window._authFbSaveScore = function() {};
window.fbSaveScore = function() {};

document.addEventListener('DOMContentLoaded', function() {
    
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK לא נטען!');
        return;
    }
    
    if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
    }
    
    const fbAuth = firebase.auth();
    const fbDB = firebase.database();
    window.fbDB = fbDB;
    
    // ── שמירת ציון ──────────────────────────────────────────
    function scheduleScoreSave() {
        clearTimeout(scoreSaveTimer);
        scoreSaveTimer = setTimeout(doSaveScore, 5000);
    }
    
    async function doSaveScore() {
        if (!fbDB || !window.currentUID) return;
        try {
            const name = (localStorage.getItem('playerName') || 'שחקן').substring(0, 20);
            const ld = typeof getLevelData === 'function' ?
                getLevelData(window.lifeXP || 0) :
                { level: 1 };
            await fbDB.ref('leaderboard/' + window.currentUID).set({
                name: name,
                money: Math.min(Math.floor(window.money || 0), 1000000000),
                level: ld.level,
                ts: Date.now()
            });
        } catch (e) {
            console.warn('Score save blocked:', e.message);
        }
    }
    
    window._authFbSaveScore = scheduleScoreSave;
    window.fbSaveScore = scheduleScoreSave;
    
    // ── בדוק תוצאת Google Redirect ──────────────────────────
    fbAuth.getRedirectResult().then(function(result) {
        if (!result || !result.user) return;
        localStorage.removeItem('_adminLoginPending');
        if (result.user.email !== ADMIN_EMAIL) {
            fbAuth.signOut();
            if (typeof showMsg === 'function')
                showMsg('❌ חשבון זה אינו מורשה כמנהל', 'var(--red)');
        } else {
            if (typeof showMsg === 'function')
                showMsg('👑 ברוך הבא ' + result.user.displayName, 'var(--purple)');
        }
    }).catch(function(err) {
        if (err.code === 'auth/no-auth-event') return;
        console.error('Redirect result error:', err.code);
    });
    
    // ── מאזין מצב כניסה ─────────────────────────────────────
    fbAuth.onAuthStateChanged(function(user) {
        if (user) {
            window.fbUser = user;
            window.currentUID = user.uid;
            localStorage.setItem('deviceID', user.uid);
            
            const isGoogle = user.providerData.some(function(p) {
                return p.providerId === 'google.com';
            });
            window.isAdmin = isGoogle && user.email === ADMIN_EMAIL;
            
            if (window.isAdmin) {
                console.log('👑 מנהל מחובר:', user.email);
                var adminRow = document.getElementById('admin-nav-row');
                if (adminRow) adminRow.style.display = 'flex';
                // אם פאנל פתוח — קדם לשלב הניהול
                var loginStep = document.getElementById('adminLoginStep');
                var panelStep = document.getElementById('adminPanelStep');
                if (loginStep && panelStep) {
                    loginStep.style.display = 'none';
                    panelStep.style.display = 'block';
                    var statsEl = document.getElementById('adminStats');
                    if (statsEl && typeof getLevelData === 'function') {
                        var ld = getLevelData(window.lifeXP || 0);
                        statsEl.innerHTML =
                            '💰 כסף: <b>' + Math.floor(window.money || 0).toLocaleString() + '₪</b><br>' +
                            '🏦 בנק: <b>' + Math.floor(window.bank || 0).toLocaleString() + '₪</b><br>' +
                            '⭐ רמה: <b>' + ld.level + '</b><br>' +
                            '🚀 פסיבי: <b>' + (window.passive || 0).toFixed(1) + '₪/ד\'</b><br>' +
                            '👑 מנהל: <b>' + user.email + '</b>';
                    }
                }
            } else {
                console.log('🎮 שחקן אנונימי, UID:', user.uid.substr(0, 8) + '...');
            }
            
            scheduleScoreSave();
            
        } else {
            fbAuth.signInAnonymously().catch(function(err) {
                console.warn('Anonymous auth failed:', err.message);
            });
        }
    });
    
    // ── כניסת מנהל עם Google (Redirect) ─────────────────────
    window.adminSignIn = function() {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        localStorage.setItem('_adminLoginPending', '1');
        fbAuth.signInWithRedirect(provider);
    };
    
    // ── יציאת מנהל ──────────────────────────────────────────
    window.adminSignOut = function() {
        fbAuth.signOut().then(function() {
            window.isAdmin = false;
            var adminRow = document.getElementById('admin-nav-row');
            if (adminRow) adminRow.style.display = 'none';
            if (typeof showMsg === 'function')
                showMsg('יצאת ממצב מנהל', 'var(--blue)');
            fbAuth.signInAnonymously();
        });
    };
    
    // שמור ציון כל 60 שניות
    setInterval(function() {
        if (window.currentUID) scheduleScoreSave();
    }, 60000);
    
}); // סוף DOMContentLoaded
