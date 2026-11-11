(function(){
/* DZ Charlie: "Looking for a relative?" — a quiet link on cemetery, memorial and camp stops (Nov 2026).
   It sits next to "Report a problem" and opens a small panel that points to the right official list of war dead. Nothing is stored. */
var KIND="__KIND__",LANG=(document.documentElement.lang||"en").slice(0,2)==="es"?"es":"en";
var WW={
 cwgc:["Britain & the Commonwealth","UK, Canada, Australia, New Zealand, India, South Africa","Commonwealth War Graves Commission","https://www.cwgc.org/find-records/find-war-dead/"],
 us:["United States","Overseas American cemeteries and memorials","American Battle Monuments Commission","https://www.abmc.gov/database-search"],
 de:["Germany","German war dead and missing","Volksbund (German war graves)","https://www.volksbund.de/en/erinnern-gedenken/graebersuche-online"],
 fr:["France","French soldiers who died 1939–1945","Mémoire des hommes","https://www.memoiredeshommes.sga.defense.gouv.fr/"],
 nl:["The Netherlands","Dutch war victims, soldiers and civilians","Oorlogsgravenstichting","https://oorlogsgravenstichting.nl/"],
 su:["Soviet Union","Red Army dead and missing","OBD Memorial","https://obd-memorial.ru/"],
 vic:["Civilians & camp victims","Victims of Nazi persecution, all nationalities","Arolsen Archives","https://collections.arolsen-archives.org/en/search"],
 pl:["Polish soldiers buried in Italy","Monte Cassino, Bologna, Loreto, Casamassima","Polish war cemeteries in Italy","https://polskiecmentarzewewloszech.eu/en/"],
 yv:["Jewish victims of the Holocaust","Names of Holocaust victims","Yad Vashem names database","https://collections.yadvashem.org/en/names"]
};
var SC={
 vic:[{en:"A Spaniard, from either side",es:"Un español, de cualquier bando"},{en:"Victims in Spain's state archives",es:"Víctimas en los archivos estatales"},{en:"Portal de Víctimas de la Guerra Civil (Ministry of Culture)",es:"Portal de Víctimas de la Guerra Civil (Ministerio de Cultura)"},"http://pares.mcu.es/victimasGCFPortal/"],
 fosa:[{en:"Someone who disappeared",es:"Una persona desaparecida"},{en:"Mass graves and exhumations across Spain",es:"Fosas y exhumaciones en toda España"},{en:"Mapa Estatal de Fosas (Spanish government)",es:"Mapa Estatal de Fosas (Gobierno de España)"},"https://mptmd.gob.es/en/portal/memoria-democratica/mapa-de-fosas/mapa-estatal-fosas",1],
 tln:[{en:"Victims in Andalucía & Extremadura",es:"Víctimas en Andalucía y Extremadura"},{en:"Todos los Nombres database",es:"Base de datos Todos los Nombres"},{en:"Todos los Nombres",es:"Todos los Nombres"},"https://www.todoslosnombres.org/",1],
 ib:[{en:"International Brigades, any country",es:"Brigadas Internacionales, cualquier país"},{en:"Volunteers from over 50 countries",es:"Voluntarios de más de 50 países"},{en:"SIDBRINT, University of Barcelona",es:"SIDBRINT, Universidad de Barcelona"},"https://sidbrint.ub.edu/en"],
 uk:[{en:"British & Irish volunteers",es:"Voluntarios británicos e irlandeses"},{en:"International Brigade Memorial Trust",es:"International Brigade Memorial Trust"},{en:"International Brigade Memorial Trust",es:"International Brigade Memorial Trust"},"https://international-brigades.org.uk/"],
 us:[{en:"American volunteers",es:"Voluntarios estadounidenses"},{en:"The Abraham Lincoln Brigade",es:"La Brigada Abraham Lincoln"},{en:"Abraham Lincoln Brigade Archives",es:"Abraham Lincoln Brigade Archives"},"https://www.alba-valb.org/volunteers"],
 ca:[{en:"Canadian volunteers",es:"Voluntarios canadienses"},{en:"The Mackenzie–Papineau Battalion",es:"El Batallón Mackenzie–Papineau"},{en:"Canadian volunteers database",es:"Base de datos de voluntarios canadienses"},"https://spanishcivilwar.ca/volunteers"],
 dep:[{en:"Spaniards deported to Nazi camps",es:"Españoles deportados a campos nazis"},{en:"Mauthausen and other camps",es:"Mauthausen y otros campos"},{en:"Arolsen Archives",es:"Arolsen Archives"},"https://collections.arolsen-archives.org/en/search"]
};
var TX={
 en:{link:"Looking for a relative?",title:"Looking for a relative?",who:"Who are you looking for?",best:"best here",sur:"Surname",fir:"First name (if you know)",
   go:"Search the official list ↗",copied:"Name copied: paste it into the search there.",close:"Close",
   priv:"Opens the official website. Nothing you type is stored by DZ Charlie.",
   intro:"Official lists of the war dead, including the missing who have no known grave.",
   dna:"Still looking for someone who disappeared? Families can give a DNA sample to Spain's State DNA Bank for victims of the war and the dictatorship, to help identify remains found in mass graves. Your regional democratic memory office can explain how."},
 es:{link:"¿Buscas a un familiar?",title:"¿Buscas a un familiar?",who:"¿A quién buscas?",best:"la mejor aquí",sur:"Apellido(s)",fir:"Nombre (si lo sabes)",
   go:"Buscar en la lista oficial ↗",copied:"Nombre copiado: pégalo en el buscador.",close:"Cerrar",
   priv:"Se abre la web oficial. DZ Charlie no guarda nada de lo que escribes.",
   intro:"Listas oficiales de víctimas, incluidos los desaparecidos sin tumba conocida.",
   dna:"¿Sigues buscando a alguien desaparecido? Las familias pueden aportar una muestra de ADN al Banco Estatal de ADN de víctimas de la Guerra y la Dictadura, para ayudar a identificar restos hallados en fosas. La oficina de memoria democrática de tu comunidad autónoma te explica cómo."}
};
var T=TX[LANG];
function e(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}

/* which stops get the link, and which list to suggest first */
var WANT=/cemetery|cimeti|friedhof|kriegsgr|war graves?|sacrario|shrine|ossuary|mausoleum|memorial|monument to|\bcamps?\b|massacre|ereveld|nécropole|necropol|execution|mass graves?/i;
var NOT=/museum|war rooms|bunker|headquarters/i;
function wwPick(t){
  if(/malmedy|baugnez/i.test(t))return"us";
  if(/wormhout|esquelbecq/i.test(t))return"cwgc";
  if(/oradour|mont-val|french|fran[cç]ais|nécropole/i.test(t))return"fr";
  if(/shoah|jewish|\bjews\b|holocaust|ghetto/i.test(t))return"yv";
  if(/polish/i.test(t)&&/ital|cassino|bologna|loreto|casamassima/i.test(t))return"pl";
  if(/american|abmc|u\.s\.|us army|82nd|101st|506th|rangers|36th division|10th mountain|easy company|winters|meehan|stick 66|patton/i.test(t))return"us";
  if(/german|volksbund|kriegsgr|la cambe|recogne|ysselsteyn|futa pass|caira|motta|maleme|costermano|pomezia/i.test(t))return"de";
  if(/auschwitz|birkenau|dachau|mauthausen|treblinka|sachsenhausen|ravensbr|terez|theresien|westerbork|be[łl]?[żz]ec|sobibor|majdanek|struthof|natzweiler|kaufering|buchenwald|belsen|\bcamps?\b|ardeatine|massacre|stazzema|marzabotto|monte sole|khatyn|anne frank/i.test(t))return"vic";
  if(/soviet|russian|mamayev|rossoshka|treptow|tiergarten|seelow|brest fortress|piskar|poklonnaya/i.test(t))return"su";
  if(/ereveld|dutch|grebbeberg/i.test(t))return"nl";
  return"cwgc";
}
var SCWBY=null;
function scwStop(name){
  if(!window.SCW||!SCW.stops)return null;
  if(!SCWBY){SCWBY={};SCW.stops.forEach(function(s){SCWBY[s.n]=s})}
  return SCWBY[name]||null;
}
var PICKS=__PICKS__;

/* the panel */
var box=null,cur=null;
function panel(){
  if(box)return box;
  box=document.createElement("div");box.id="dzrel";box.hidden=true;
  box.setAttribute("role","dialog");box.setAttribute("aria-modal","true");box.setAttribute("aria-labelledby","dzrel-h");
  document.body.appendChild(box);
  box.addEventListener("click",function(ev){if(ev.target===box||ev.target.closest(".dzrel-x"))hide()});
  document.addEventListener("keydown",function(ev){if(ev.key==="Escape"&&!box.hidden)hide()});
  return box;
}
function hide(){if(box){box.hidden=true;document.documentElement.classList.remove("dzrel-open");if(cur&&cur.focus)cur.focus()}}
function show(opener,place,best){
  cur=opener;var b=panel(),L=KIND==="scw"?SC:WW,keys=Object.keys(L);
  keys.splice(keys.indexOf(best),1);keys.unshift(best);
  var nm=function(k){return KIND==="scw"?L[k][0][LANG]:L[k][0]},sub=function(k){return KIND==="scw"?L[k][1][LANG]:L[k][1]};
  var opts=keys.map(function(k,i){return '<label class="dzrel-o"><input type="radio" name="dzrel-l" value="'+k+'"'+(i?'':' checked')+'><span><b>'+e(nm(k))+'</b>'+(i?'':' <em>· '+T.best+'</em>')+'<small>'+e(sub(k))+'</small></span></label>'}).join("");
  b.innerHTML='<div class="dzrel-in"><div class="dzrel-top"><h3 id="dzrel-h">'+T.title+'</h3><button type="button" class="dzrel-x" aria-label="'+T.close+'">×</button></div>'+
    '<p class="dzrel-p">'+T.intro+'</p><div class="dzrel-place">'+e(place)+'</div>'+
    '<fieldset><legend>'+T.who+'</legend>'+opts+'</fieldset>'+
    '<label class="dzrel-f">'+T.sur+'<input id="dzrel-s" autocomplete="off"></label>'+
    '<label class="dzrel-f">'+T.fir+'<input id="dzrel-n" autocomplete="off"></label>'+
    '<div id="dzrel-dna" class="dzrel-dna" hidden>'+T.dna+'</div>'+
    '<a id="dzrel-go" class="dzrel-go" target="_blank" rel="noopener">'+T.go+'</a><div id="dzrel-ok" class="dzrel-ok" aria-live="polite"></div>'+
    '<p class="dzrel-priv">'+T.priv+'</p></div>';
  function upd(){var k=b.querySelector('input[name=dzrel-l]:checked').value,it=L[k];
    b.querySelector("#dzrel-go").href=it[3];b.querySelector("#dzrel-dna").hidden=!(KIND==="scw"&&it[4]);b.querySelector("#dzrel-ok").textContent=""}
  b.querySelectorAll('input[name=dzrel-l]').forEach(function(r){r.addEventListener("change",upd)});upd();
  b.querySelector("#dzrel-go").addEventListener("click",function(){
    var s=b.querySelector("#dzrel-s").value.trim(),n=b.querySelector("#dzrel-n").value.trim(),full=(n?n+" ":"")+s;
    if(full){try{navigator.clipboard.writeText(full).then(function(){b.querySelector("#dzrel-ok").textContent=T.copied},function(){})}catch(x){}}
  });
  b.hidden=false;document.documentElement.classList.add("dzrel-open");
  var hd=b.querySelector("#dzrel-h");hd.setAttribute("tabindex","-1");b.querySelector(".dzrel-in").scrollTop=0;setTimeout(function(){hd.focus({preventScroll:true})},30);
}

/* add the quiet link next to "Report a problem" */
function deco(){
  var vs=document.querySelectorAll(".vz:not([data-rel])");
  for(var i=0;i<vs.length;i++){var v=vs[i];v.setAttribute("data-rel","0");
    var rep=v.querySelector(".vz-rep");if(!rep)continue;
    var place="",best=null;
    if(KIND==="scw"){
      var root=v.parentElement,h=null;while(root&&!(h=root.querySelector("h2")))root=root.parentElement;
      if(!h)continue;place=h.textContent.trim();var s=scwStop(place);if(!s)continue;
      best=PICKS[s.id];if(!best)continue;
    }else{
      var c=v.closest("article.card");if(!c)continue;
      var t=c.querySelector(".ttl b"),w=c.querySelector(".ttl .when");
      place=t?t.textContent.trim():"";var txt=place+" · "+(w?w.textContent:"");
      if(!WANT.test(txt)||(NOT.test(txt)&&!/cemetery|memorial site|camp memorial/i.test(txt)))continue;
      best=wwPick(txt);
    }
    v.setAttribute("data-rel","1");
    var a=document.createElement("a");a.href="#";a.className="vz-rep dzrel-a";a.textContent=T.link;
    a.setAttribute("data-best",best);a.setAttribute("data-place",place);
    a.addEventListener("click",function(ev){ev.preventDefault();show(this,this.getAttribute("data-place"),this.getAttribute("data-best"))});
    rep.parentNode.insertBefore(a,rep);
  }
}
var q=false;
function sched(){if(q)return;q=true;(window.requestAnimationFrame||setTimeout)(function(){q=false;try{deco()}catch(x){}})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sched);else sched();
new MutationObserver(sched).observe(document.documentElement,{childList:true,subtree:true});
})();
