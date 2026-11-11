/* The Book of Nines: offline app shell.
   The book and its art come from the cache first, so it opens without a connection.
   Wireless play (/api/) always goes to the network. Bump VERSION on every release. */
const VERSION='nines-2026-11-11m';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png','favicon-32.png','fonts/6xKpdSJbL9-e9LuoeQiDRQR8WOXaOg.woff2','fonts/6xKpdSJbL9-e9LuoeQiDRQR8WOvaOrbh.woff2','fonts/9oRPNYsQpS4zjuA_hQgWDto.woff2','fonts/9oRPNYsQpS4zjuA_iwgW.woff2','fonts/B50TF6xQr2TXJBnGOFME6u5OR83oRP5qkH7gPg.woff2','fonts/B50TF6xQr2TXJBnGOFME6u5OR83oRP5qkHDgPrgZ.woff2','fonts/E21i_d3kivvAkxhLEVZpQyZwD9Ku.woff2','fonts/E21i_d3kivvAkxhLEVZpQyhwDw.woff2','fonts/EYq0maZfwr9S9-ETZc3fKXt8UrOS43o.woff2','fonts/EYq0maZfwr9S9-ETZc3fKXt8XLOS.woff2','fonts/Fh4uPib9Iyv2ucM6pGQMWimMp004La2Cfw.woff2','fonts/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7B7y03ROp8ltA.woff2','fonts/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7B7y03Sup8.woff2','fonts/Ktk1ALSLW8zDe0rthJysWrnLsAzHEKOY.woff2','fonts/Ktk3ALSLW8zDe0rthJysWrnLsAzHFZOafYs.woff2','fonts/Qw3EZQFXECDrI2q789EKQZJob0x6XHg.woff2','fonts/Qw3aZQNVED7rKGKxtqIqX5EUA3x4RHw.woff2','fonts/Qw3aZQNVED7rKGKxtqIqX5EUDXx4.woff2','fonts/RWmMoKWR9v4ksMfaWd_JN9XFiaQ.woff2','fonts/RWmMoKWR9v4ksMfaWd_JN9XLiaQ6DQ.woff2','fonts/RrQIbot8-mNYKnGNDkWlocovHeI4Eu2EBVk.woff2','fonts/RrQIbot8-mNYKnGNDkWlocovHeI4HO2E.woff2','fonts/SlGUmQSNjdsmc35JDF1K5GR1SDk.woff2','fonts/SlGUmQSNjdsmc35JDF1K5GR7SDktYw.woff2','fonts/SlGWmQSNjdsmc35JDF1K5GRweDU1ZzPJ.woff2','fonts/SlGWmQSNjdsmc35JDF1K5GRweDs1Zw.woff2','fonts/WnznHAc5bAfYB2QRah7pcpNvOx-pjRV6eIWpYQ.woff2','fonts/WnznHAc5bAfYB2QRah7pcpNvOx-pjRV6eIupYSxP.woff2','fonts/XLYkIZL7aopJVbZJHDuoNOlHnnY.woff2','fonts/XLYkIZL7aopJVbZJHDuoOulH.woff2','fonts/YA9Qr0Wd4kDdMtDqHTLCkiQ4tg.woff2','fonts/YA9Qr0Wd4kDdMtDqHTLMkiQ.woff2','fonts/a8IENpD3CDX-4zrWfr1VY879qFF05pZ7PIIP.woff2','fonts/buEzpo6gcdjy0EiZMBUG4C0f_Q.woff2','fonts/buEzpo6gcdjy0EiZMBUG4CMf_exL.woff2','fonts/daaHSScvJGqLYhG8nNt8KPPswUAPniZQa9lESTE.woff2','fonts/daaHSScvJGqLYhG8nNt8KPPswUAPniZQa9lKSTG7lQ.woff2','fonts/daaHSScvJGqLYhG8nNt8KPPswUAPniZoadlESTE.woff2','fonts/daaHSScvJGqLYhG8nNt8KPPswUAPniZoadlKSTG7lQ.woff2','fonts/ke80OhoaMkR6-hSn7kbHVoFf7ZfgMPr_nTorBcIXLrIU.woff2','fonts/ke80OhoaMkR6-hSn7kbHVoFf7ZfgMPr_nTorBcwXLg.woff2','fonts/nwpTtK2oNgBA3Or78gapdwuyxig_WMM.woff2','fonts/nwpTtK2oNgBA3Or78gapdwuyyCg_.woff2','fonts/rP2Hp2yn6lkG50LoCZOIHQ.woff2','fonts/vm8vdRfvXFLG3OLnsO15WYS5DG72wNJHMw.woff2','fonts/vm8vdRfvXFLG3OLnsO15WYS5DG74wNI.woff2','models/Awa.glb','models/Cloud.glb','models/Grump.glb','models/Pookie.glb'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request,url=new URL(req.url);
  if(req.method!=='GET'||url.pathname.includes('/api/'))return;
  // pages: try the network for a fresh book, fall back to the cached one
  if(req.mode==='navigate'){
    // a fresh book if the network answers within three seconds; otherwise the copy on the phone, refreshed in the background
    const fresh=fetch(req).then(r=>{if(r.ok){const copy=r.clone();caches.open(VERSION).then(c=>c.put('index.html',copy))}return r});
    e.respondWith(new Promise(done=>{let settled=false;const fall=()=>caches.match('index.html').then(hit=>{if(hit&&!settled){settled=true;done(hit)}});
      const t=setTimeout(fall,3000);
      fresh.then(r=>{clearTimeout(t);if(!settled){settled=true;done(r)}}).catch(()=>{clearTimeout(t);caches.match('index.html').then(hit=>{if(!settled){settled=true;done(hit||Response.error())}})})}));
    return;
  }
  // everything else (icons, the typefaces): cache first, then remember what the network returns
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{
    if(r.ok||r.type==='opaque'){const copy=r.clone();caches.open(VERSION).then(c=>c.put(req,copy))}
    return r;
  })));
});
