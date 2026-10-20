/* DZ Charlie phone-friendly layer, Spanish Civil War edition (English and Castilian Spanish). */
(function(){
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const ES=(document.documentElement.lang||"").startsWith("es");
const L=ES?{travel:"¿Hoy de ruta?",first:"Prepara primero tu ruta: aquí verás tu próxima parada, la distancia y un botón para ir en coche.",plan:"Planifica tu ruta",
  prog:(n,t)=>`${n} de ${t} paradas de tu ruta visitadas`,today:(d,n)=>`Hoy · Día ${d} de ${n}`,which:"¿En qué día de la ruta estás?",day:"Día",change:"Cambiar de día ▾",
  next:"Próxima parada",drive:"Ir en coche ▸",read:"Leer sobre ella",vis:"✓ Visitada — siguiente",done:"Has visitado todas las paradas de este día. ¡Bien hecho!",off:"No estoy de ruta — ocultar",
  oT:"¿Guardar la guía para zonas sin cobertura?",oP:"En muchos lugares hay poca cobertura. Guárdala ahora con wifi y funcionará sin internet.",oB:"Guardar para usar sin conexión (mejor con wifi)",oN:"Ahora no",
  size:"Tamaño del texto",sun:"Sol intenso",on:"Sí",no:"No",sunP:"Más contraste para leer al aire libre.",story:"Historia",storyL:"Historia: la guerra por orden de fechas"}
 :{travel:"Travelling today?",first:"Plan your tour first: then this shows your next stop, how far it is and one button to drive there.",plan:"Plan my tour",
  prog:(n,t)=>`${n} of ${t} stops visited on your tour`,today:(d,n)=>`Today · Day ${d} of ${n}`,which:"Which day of your tour are you on?",day:"Day",change:"Change day ▾",
  next:"Next stop",drive:"Drive ▸",read:"Read about it",vis:"✓ Visited — next stop",done:"Every stop of this day visited. Well done!",off:"I'm not on the road — hide this",
  oT:"Save this guide for no-signal areas?",oP:"Many sites have poor signal. Save it now on Wi-Fi and it works with no internet at all.",oB:"Save for offline (Wi-Fi recommended)",oN:"Not now",
  size:"Text size",sun:"Bright sun",on:"On",no:"Off",sunP:"Stronger contrast for reading outdoors.",story:"Story",storyL:"Story: the war in date order"};
const get=(k,d)=>{try{const v=localStorage.getItem("dzux-scw-"+k);return v===null?d:v}catch(e){return d}};
const put=(k,v)=>{try{localStorage.setItem("dzux-scw-"+k,v)}catch(e){}};
const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const X=()=>window.SCWX||null;
function setH(el,h){if(el.__dzh!==h){el.__dzh=h;el.innerHTML=h}}
const STOP={};((window.SCW&&SCW.stops)||[]).forEach(s=>STOP[s.id]=s);

function applyRead(){const a=get("a","0"),s=get("sun","0"),h=document.documentElement;h.classList.toggle("dz-a1",a==="1");h.classList.toggle("dz-a2",a==="2");h.classList.toggle("dz-sun",s==="1")}
applyRead();

function plan(){try{const p=X()&&X().plan();return p&&p.res&&p.res.days&&p.res.days.length?p.res:null}catch(e){return null}}
function visited(id){try{return X().vis().has(id)}catch(e){return false}}
function day(){const r=plan();const d=+get("day","0");return r&&d>=1&&d<=r.days.length?d:0}
function nextStop(){const r=plan(),d=day();if(!r||!d)return null;const id=r.days[d-1].ids.find(i=>!visited(i));return id?STOP[id]:false}
const gm=s=>`https://www.google.com/maps/dir/?api=1&destination=${s.la},${s.lo}`;

/* ---- Today on the home screen ---- */
function renderToday(){const home=$("#p-home");if(!home)return;let box=$("#dzToday");
  if(!box){box=document.createElement("div");box.id="dzToday";box.className="pg";const c=$("#cover",home);c?c.after(box):home.prepend(box)}
  const r=plan();
  if(!r||get("hide","0")==="1"&&!day()){setH(box,r?"":`<div class="dzpick"><span class="ic">🚐</span><b>${L.travel}</b><span>${L.first}</span><button type="button" data-go="tour">${L.plan}</button></div>`);return}
  const all=r.days.flatMap(d=>d.ids),n=all.filter(visited).length;
  const prog=`<div class="dzprog"><span>${L.prog(n,all.length)}</span><div class="bar"><i style="width:${Math.round(n/all.length*100)}%"></i></div></div>`;
  const d=day();const chips=`<div class="dzchips">${r.days.map((_,i)=>`<button type="button" data-dzday="${i+1}" aria-pressed="${d===i+1}">${L.day} ${i+1}</button>`).join("")}</div>`;
  {const cv=$("#cover",home);if(cv&&cv.nextElementSibling!==box)cv.after(box)}
  if(!d){setH(box,`<div class="dzpick dzt">${prog}<b>${L.travel}</b><span>${L.which}</span>${chips}</div>`);return}
  const s=nextStop();const cv=$("#cover",home);if(cv&&box.nextElementSibling!==cv)home.insertBefore(box,cv);
  setH(box,`<div class="dzpick dzt">${prog}<small class="dzh">🚐 ${L.today(d,r.days.length)}</small><div class="dzchips dzc-fold">${r.days.map((_,i)=>`<button type="button" data-dzday="${i+1}" aria-pressed="${d===i+1}">${L.day} ${i+1}</button>`).join("")}<button type="button" class="dzc-change" data-dzchange="1">${L.change}</button></div>
   ${s?`<small class="dzh">${L.next}</small><b>${esc(s.n)}</b><a class="dzgo" href="${gm(s)}" target="_blank" rel="noopener">${L.drive}</a><button type="button" class="dzv" data-dzvis="${s.id}">${L.vis}</button><button type="button" class="dzl" data-stop="${s.id}">${L.read}</button>`:`<b>${L.done}</b>`}
   <button type="button" class="dzl" data-dzday="0">${L.off}</button></div>`);
  renderNext()}

/* ---- next stop bar on the other pages ---- */
function renderNext(){let bar=$("#dzNext");if(!bar){bar=document.createElement("div");bar.id="dzNext";bar.hidden=true;document.body.appendChild(bar)}
  const home=$("#p-home"),s=nextStop();if(!s||home&&!home.hidden||$(".sheet,.mapfull,.mapfu")){bar.hidden=true;return}
  const nav=$("nav.bot");bar.style.bottom=(nav?nav.offsetHeight:0)+"px";
  setH(bar,`<div class="t"><small>${L.next} · ${L.day} ${day()}</small><b>${esc(s.n)}</b></div><a href="${gm(s)}" target="_blank" rel="noopener">${L.drive}</a><button type="button" data-dzvis="${s.id}" aria-label="${L.vis}">✓</button>`);bar.hidden=false}

document.addEventListener("click",e=>{const t=e.target;
  const dd=t.closest("[data-dzday]");if(dd){put("day",dd.dataset.dzday);if(dd.dataset.dzday==="0")put("hide","1");renderToday();renderNext();return}
  if(t.closest("[data-dzchange]")){const c=t.closest(".dzchips");c.classList.remove("dzc-fold");t.closest("[data-dzchange]").remove();return}
  const v=t.closest("[data-dzvis]");if(v&&X()){X().toggle(v.dataset.dzvis);renderToday();renderNext();return}
  const off=t.closest("[data-dzoff]");if(off){if(off.dataset.dzoff==="no"){put("offno","1");renderOff();return}
    const real=$("[data-act=offline]");if(!real)return;real.click();const lab=$("b",real),me=$("#dzOffSt");if(lab&&me){const cp=()=>{me.textContent=lab.textContent;if(/✓/.test(lab.textContent))setTimeout(renderOff,1500)};cp();new MutationObserver(cp).observe(lab,{childList:true,characterData:true,subtree:true})}return}
  const a=t.closest("[data-dza]");if(a){put("a",a.dataset.dza);applyRead();$$("[data-dza]").forEach(b=>b.setAttribute("aria-pressed",b===a))}
  const su=t.closest("[data-dzsun]");if(su){const on=get("sun","0")==="1"?"0":"1";put("sun",on);applyRead();su.setAttribute("aria-pressed",on==="1");su.textContent=on==="1"?L.on:L.no}
  setTimeout(()=>{renderNext();if(!$("#p-home").hidden){renderToday();renderOff()}},120)});

/* ---- offline made obvious ---- */
function saved(){try{return !!JSON.parse(localStorage.getItem("scw-offline")||"0")}catch(e){return false}}
function renderOff(){const home=$("#p-home");if(!home)return;let c=$("#dzOff");
  if(saved()||get("offno","0")==="1"||!$("[data-act=offline]")){if(c)c.remove();return}
  if(c)return;c=document.createElement("div");c.id="dzOff";c.className="pg";
  c.innerHTML=`<div class="dzoff"><b>${L.oT}</b><p>${L.oP}</p><div class="row"><button type="button" data-dzoff="all">${L.oB}</button><button type="button" class="no" data-dzoff="no">${L.oN}</button></div><p class="st" id="dzOffSt" aria-live="polite"></p></div>`;
  ($("#dzToday")||$("#cover",home)).after(c)}

/* ---- one menu for every guide: Home · Tour · Map · Story · More ---- */
function unifyNav(){const bar=$("nav.bot");if(!bar||bar.dataset.dz)return;bar.dataset.dz="1";
  ["home","tour","map","time","more"].map(k=>$(`[data-go="${k}"]`,bar)).filter(Boolean).forEach(b=>bar.appendChild(b));
  const t=$('[data-go="time"]',bar);if(t){const tx=[...t.childNodes].reverse().find(n=>n.nodeType===3&&n.textContent.trim());if(tx)tx.textContent=L.story;t.setAttribute("aria-label",L.storyL)}}

/* ---- reading comfort, in More ---- */
function renderSet(){const pg=$("#p-more .pg");if(!pg||$("#dzSet"))return;const a=get("a","0"),s=get("sun","0");const c=document.createElement("div");c.id="dzSet";c.className="dzset";
  c.innerHTML=`<div class="r"><span>${L.size}</span>${["A","A+","A++"].map((t,i)=>`<button type="button" data-dza="${i}" aria-pressed="${a===String(i)}" style="font-size:${15+i*3}px">${t}</button>`).join("")}</div>
  <div class="r"><span>${L.sun}</span><button type="button" data-dzsun="1" aria-pressed="${s==="1"}">${s==="1"?L.on:L.no}</button><small style="flex-basis:100%;color:var(--faint,#555)">${L.sunP}</small></div>`;pg.prepend(c)}

let q=0;new MutationObserver(()=>{if(!q)q=requestAnimationFrame(()=>{q=0;try{renderNext()}catch(e){}})}).observe(document.body,{childList:true});
function start(){try{unifyNav();renderSet();renderToday();renderOff();renderNext()}catch(e){console.error(e)}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(start,50));else setTimeout(start,50);
})();
