// Makes the GPX and KML waypoint files in /waypoints from the data inside the three guide pages.
// Run again whenever stops change:  node build/waypoints/make_waypoints.js
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const ROOT=path.resolve(__dirname,'..','..'),OUT=path.join(ROOT,'waypoints');
const APPS=[["normandy","Normandy","Easy-Company-Normandy"],["holland-bastogne","Holland & Bastogne","Easy-Company-Holland-Bastogne"],["germany-austria","Germany & Austria","Easy-Company-Germany-Austria"]];
const ACC={HIGH:"HIGH — exact spot",MEDIUM:"MEDIUM — close to the spot",LOW:"LOW — centre of a search area",AREA:"AREA — centre of a wider area",DOC:"Documented site"};
const esc=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const near=(a,b)=>Math.abs(a.lat-b.lat)<0.0008&&Math.abs(a.lon-b.lon)<0.0012; // about 80 m
(async()=>{
 const b=await chromium.launch();const all=[];const counts={};
 for(const [file,label,base] of APPS){
  const p=await b.newPage();await p.route(/^https?:/,r=>r.abort());
  await p.goto('file://'+path.join(ROOT,file+'.html'),{waitUntil:'domcontentloaded'});
  const d=await p.evaluate(()=>({tl:TL.map(t=>[t[0],t[1],t[2],t[3],+t[4],+t[5],t[8],t[9]]),pool:POOL.map(s=>({name:s.name,lat:+s.lat,lon:+s.lon,conf:s.conf,day:s.day,text:s.text,look:s.look,priv:s.priv})),mus:MUS.map(m=>[m[0],m[1],+m[2],+m[3],m[5],m[6]])}));
  await p.close();
  const url="https://dzcharlie.com/"+file+".html",pts=[];
  const add=(o)=>{if(!isFinite(o.lat)||!isFinite(o.lon))return;if(pts.some(q=>near(q,o)))return;o.app=label;o.url=url;pts.push(o)};
  d.tl.forEach(t=>add({group:"Easy Company timeline",name:"DZC "+t[1],lat:t[4],lon:t[5],conf:t[3],when:t[2],text:t[6],look:t[7],sym:"Flag, Red"}));
  d.pool.forEach(s=>add({group:"Tour stops",name:"DZC "+s.name,lat:s.lat,lon:s.lon,conf:s.conf,when:s.day?"Tour day "+s.day:"Extra stop",text:s.text,look:s.look,priv:s.priv,sym:"Flag, Blue"}));
  d.mus.forEach(m=>add({group:"Museums",name:"DZC "+m[0],lat:m[2],lon:m[3],when:m[1],text:m[4],look:m[5]?"Allow: "+m[5]:"",sym:"Museum"}));
  counts[file]=pts.length;all.push(...pts);
  write(base,"Easy Company — "+label,pts,false);
 }
 write("Easy-Company-All-Three-Guides","Easy Company — all three guides",all,true);
 fs.writeFileSync(path.join(OUT,'counts.json'),JSON.stringify({...counts,all:all.length}));
 console.log(counts,'all',all.length);await b.close();
})();
function descText(p){const a=[];if(p.when)a.push(p.when);if(p.text)a.push(p.text);if(p.look)a.push(p.look);
 if(p.conf&&ACC[p.conf])a.push("Accuracy: "+ACC[p.conf]+".");if(p.priv)a.push("Private land — view from the road.");
 a.push("Guide: "+p.url);a.push("DZ Charlie field guides · dzcharlie.com");return a.join("\n\n")}
function write(base,title,pts,multi){
 const nm=p=>multi?p.name+" ("+p.app+")":p.name;
 let g=`<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="DZ Charlie — dzcharlie.com" xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3">\n<metadata><name>${esc(title)}</name><desc>Waypoints from the DZ Charlie field guides. Map pins marked LOW or AREA are the centre of a search area, not an exact spot.</desc><link href="https://dzcharlie.com/"><text>DZ Charlie</text></link></metadata>\n`;
 pts.forEach(p=>{g+=`<wpt lat="${p.lat.toFixed(6)}" lon="${p.lon.toFixed(6)}"><name>${esc(nm(p))}</name><desc>${esc(descText(p))}</desc><link href="${p.url}"><text>Open the guide</text></link><sym>${p.sym}</sym><type>${esc((multi?p.app+" · ":"")+p.group)}</type><extensions><gpxx:WaypointExtension><gpxx:Categories><gpxx:Category>DZ Charlie</gpxx:Category></gpxx:Categories></gpxx:WaypointExtension></extensions></wpt>\n`});
 g+=`</gpx>\n`;fs.writeFileSync(path.join(OUT,base+'.gpx'),g);
 const groups=[];pts.forEach(p=>{const k=(multi?p.app+" — ":"")+p.group;let f=groups.find(x=>x.k===k);if(!f)groups.push(f={k,p:[]});f.p.push(p)});
 const col={"Easy Company timeline":"ff2222cc","Tour stops":"ffcc7a1f","Museums":"ff2a8f2a"};
 let k=`<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document><name>${esc(title)}</name><description>Waypoints from the DZ Charlie field guides (dzcharlie.com).</description>\n`;
 Object.entries(col).forEach(([n,c],i)=>{k+=`<Style id="s${i}"><IconStyle><scale>1.1</scale><Icon><href>https://dzcharlie.com/icon-192.png</href></Icon></IconStyle></Style>\n`});
 const sid=g=>"s"+Object.keys(col).indexOf(g);
 groups.forEach(f=>{k+=`<Folder><name>${esc(f.k)}</name>\n`;f.p.forEach(p=>{k+=`<Placemark><name>${esc(nm(p))}</name><description>${esc(descText(p))}</description><styleUrl>#${sid(p.group)}</styleUrl><Point><coordinates>${p.lon.toFixed(6)},${p.lat.toFixed(6)},0</coordinates></Point></Placemark>\n`});k+=`</Folder>\n`});
 k+=`</Document>\n</kml>\n`;fs.writeFileSync(path.join(OUT,base+'.kml'),k);
}
