// SW MESANA (pack sin conexión)
const CACHE_NAME = 'mesana-v77';
const ASSETS = ["./", "./index.html", "./manifest.json", "./privacidad.html", "./Escudo_Armas_Juan_Sebastian_Elcano.png", "./badge_1_chifle.png", "./badge_2_buques.png", "./badge_3_izado.png", "./badge_4_autoridades.png", "./badge_5_musica.png", "./badge_6_tierra.png", "./escudo_elcano_header.png", "./icon-192.png", "./icon-512.png", "./logo.jpg"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('mesana-') && k !== CACHE_NAME).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.origin !== self.location.origin || u.pathname.indexOf('/Mesana/') !== 0) return;
  e.respondWith((async () => {
    const opts = { ignoreSearch: true, ignoreVary: true };
    let hit = await caches.match(req, opts);
    if (!hit && req.mode === 'navigate') hit = await caches.match(new URL('./', self.location.href).href, opts);
    if (!hit && req.mode === 'navigate') hit = await caches.match(new URL('./index.html', self.location.href).href, opts);
    const red = fetch(req).then((r) => { if (r && r.ok) { const cp = r.clone(); caches.open(CACHE_NAME).then((c) => c.put(req, cp)); } return r; }).catch(() => null);
    if (hit) { e.waitUntil(red); return hit; }
    const r = await red;
    return r || Response.error();
  })());
});
