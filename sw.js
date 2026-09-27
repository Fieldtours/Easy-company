/* EasyCo 2.0 service worker — keeps the guides working without internet */
const CORE="ec2-core", DATA="ec2-data", VERSION="v3-1";
const CORE_FILES=["./","index.html","welcome.jpg","welcome-wide.jpg","icon-maskable-512.png","normandy.html","holland-bastogne.html","germany-austria.html","site.webmanifest",
 "favicon.ico","favicon-32.png","favicon-16.png","apple-touch-icon.png","icon-192.png","icon-512.png",
 "fonts/stardos-stencil-400.woff2","fonts/stardos-stencil-700.woff2","fonts/special-elite-400.woff2","fonts/courier-prime-400.woff2","fonts/courier-prime-700.woff2"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CORE).then(c=>Promise.all(CORE_FILES.map(f=>fetch(f,{cache:"no-store"}).then(r=>r.ok&&c.put(f,r)).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CORE&&k!==DATA&&k!=="ec2-seen").map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
async function fromCache(req){const u=new URL(req.url),p=u.pathname,last=p.split("/").pop();
  return (await caches.match(req,{ignoreSearch:true}))||(last&&!last.includes(".")?await caches.match(last+".html"):null)||(p.endsWith("/")?await caches.match("index.html"):null)}
/* audio players ask for byte ranges; answer them from the saved file */
async function ranged(req,res){const range=req.headers.get("range");if(!range||res.status!==200)return res;
  const buf=await res.arrayBuffer(),n=buf.byteLength,m=/bytes=(\d*)-(\d*)/.exec(range);if(!m)return res;
  let a=m[1]===""?n-(+m[2]):+m[1],b=m[1]!==""&&m[2]!==""?+m[2]:n-1;a=Math.max(0,a);b=Math.min(n-1,b);
  return new Response(buf.slice(a,b+1),{status:206,statusText:"Partial Content",headers:{"Content-Type":res.headers.get("Content-Type")||"audio/mpeg","Content-Range":`bytes ${a}-${b}/${n}`,"Content-Length":String(b-a+1),"Accept-Ranges":"bytes"}})}
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;
  const u=new URL(req.url);if(u.origin!==location.origin)return;
  const p=u.pathname;
  /* pages: try the network first so updates arrive, fall back to the saved copy */
  if(req.mode==="navigate"||/\.html$/.test(p)){
    e.respondWith(fetch(req).then(r=>{if(r.ok){const c=r.clone();caches.open(CORE).then(x=>x.put(req.url.split("#")[0].split("?")[0],c))}return r}).catch(async()=>(await fromCache(req))||(await caches.match("index.html"))));return}
  /* recordings: saved copy if there is one, otherwise stream from the web */
  if(/\/audio\//.test(p)){e.respondWith(fromCache(req).then(r=>r?ranged(req,r):fetch(req)));return}
  /* PDFs: always from the web */
  if(/\/pdf\//.test(p))return;
  /* maps, fonts, icons: saved copy first; anything fetched is kept for next time */
  e.respondWith(fromCache(req).then(r=>r||fetch(req).then(res=>{if(res.ok){const c=res.clone();caches.open(/\/maps\//.test(p)?"ec2-seen":CORE).then(x=>x.put(req,c))}return res})));
});
