/* Smart Money Pro - sw.js - v9.9.2
   אסטרטגיה:
   HTML        → Network First (תמיד עדכני מגיטהוב)
   JS / CSS    → Network First + Cache Fallback  ← מה שמבטיח עדכון מגיטהוב!
   תמונות     → Cache First + Revalidate ברקע
   Firebase   → מדולג (חיצוני)
*/

const CACHE_NAME = 'smart-money-pro-v9.9.2';
const BASE = '/smart/';

const CORE_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'style.css',
  BASE + 'manifest.json',
  BASE + 'logo.png',
  BASE + 'icons/icon_192.png',
  BASE + 'icons/icon_512.png',
  BASE + 'icons/icon_1024.png',
  BASE + 'icons/favicon_32.png'
];

const JS_ASSETS = [
  BASE + 'js/events.js',
  BASE + 'js/core.js',
  BASE + 'js/activities.js',
  BASE + 'js/economy.js',
  BASE + 'js/ui.js',
  BASE + 'js/blackmarket.js'
];

const ALL_ASSETS = [...CORE_ASSETS, ...JS_ASSETS];

// ============================================================
// INSTALL — precache (כישלון בקובץ אחד לא עוצר הכל)
// ============================================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => {
      return Promise.allSettled(
        ALL_ASSETS.map(url =>
          cache.add(url).catch(err =>
            console.warn('[SW] Failed to precache:', url, err)
          )
        )
      );
    })
    .then(() => {
      console.log('[SW v9.9.2] Installed');
      return self.skipWaiting(); // פעיל מיד
    })
  );
});

// ============================================================
// ACTIVATE — מחיקת caches ישנים + השתלטות על כל הטאבים
// ============================================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
    .then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[SW] Deleting old cache:', key);
          return caches.delete(key);
        }
      })
    ))
    .then(() => {
      console.log('[SW v9.9.2] Activated — claiming all clients');
      return self.clients.claim();
    })
  );
});

// ============================================================
// MESSAGE — פקודות מהאפליקציה
// ============================================================
self.addEventListener('message', (event) => {
  if (!event.data) return;
  
  // האפליקציה מבקשת עדכון מיידי
  if (event.data.type === 'SKIP_WAITING') {
    console.log('[SW] SKIP_WAITING received');
    self.skipWaiting();
  }
  
  // ניקוי cache ידני (למשל אחרי פריסה בגיטהוב)
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        console.log('[SW] Cache cleared on request');
        // הודע לטאב ששלח את הבקשה
        if (event.source) {
          event.source.postMessage({ type: 'CACHE_CLEARED' });
        }
      })
    );
  }
});

// ============================================================
// FETCH — אסטרטגיית fetch חכמה
// ============================================================
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // ⭐ לא נוגעים בבקשות חיצוניות (Firebase, CDN, gstatic)
  if (url.origin !== location.origin) return;
  
  // ⭐ HTML — Network First תמיד
  if (event.request.mode === 'navigate') {
    event.respondWith(handleHTML(event.request));
    return;
  }
  
  // ⭐ JS / CSS — Network First + Cache Fallback
  // זה מה שמבטיח שגיטהוב Pages תמיד יחזיר גרסה חדשה
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(handleJsOrCss(event.request));
    return;
  }
  
  // ⭐ תמונות + manifest — Cache First + עדכון ברקע
  if (
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('manifest.json')
  ) {
    event.respondWith(handleImage(event.request));
    return;
  }
  
  // ברירת מחדל — Network First
  event.respondWith(handleJsOrCss(event.request));
});

// ============================================================
// handlers
// ============================================================

// HTML — Network First, fallback לcache
async function handleHTML(request) {
  try {
    const res = await fetch(request);
    if (res && res.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    console.log('[SW] HTML offline — serving from cache');
    return (await caches.match(BASE + 'index.html')) ||
      new Response('<h1>Offline</h1>', { status: 503, headers: { 'Content-Type': 'text/html' } });
  }
}

// JS / CSS — Network First, cache רק כ-fallback
// ⭐ cache: 'no-cache' מכריח בקשה לשרת ומונע שימוש בcache של הדפדפן
async function handleJsOrCss(request) {
  try {
    const res = await fetch(request, { cache: 'no-cache' });
    if (res && res.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, res.clone()); // שמור גרסה חדשה
    }
    return res;
  } catch {
    // אין רשת — שרת מcache
    console.log('[SW] JS/CSS offline — serving from cache:', request.url);
    const cached = await caches.match(request);
    if (cached) return cached;
    // אין גם בcache — החזר stub ריק כדי לא לשבור JS
    const isJs = request.url.endsWith('.js');
    return new Response(
      isJs ? '// [SW] File not available offline' : '/* [SW] File not available offline */',
      {
        status: 503,
        headers: { 'Content-Type': isJs ? 'application/javascript' : 'text/css' }
      }
    );
  }
}

// תמונות — Cache First + עדכון ברקע (stale-while-revalidate)
async function handleImage(request) {
  const cached = await caches.match(request);
  if (cached) {
    // עדכן ברקע בלי לחכות
    fetch(request)
      .then(res => {
        if (res && res.status === 200) {
          caches.open(CACHE_NAME).then(cache => cache.put(request, res));
        }
      })
      .catch(() => {});
    return cached;
  }
  // אין בcache — הורד
  try {
    const res = await fetch(request);
    if (res && res.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    return new Response('', { status: 503 });
  }
}
