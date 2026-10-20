# Puts the phone-friendly layer into the Spanish Civil War pages (safe to run again)
import re,sys
base=open('/home/claude/dzux/dzux.html').read()
css=re.search(r'<style id="dzux-css">(.*?)</style>',base,re.S).group(1)
css+='''
.dzpick.dzt{display:block}.dzt>b{display:block;margin:4px 0;font-size:17px}
.dzh{display:block;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#1a5fc4;margin-top:8px}
.dzchips{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.dzpick .dzchips button{min-height:44px;padding:0 14px;border-radius:22px;border:2px solid var(--line,#ccc);background:none;color:inherit;font-size:15px;margin:0;width:auto}
.dzpick .dzchips button[aria-pressed="true"]{background:var(--earth,#3d2b1f);border-color:var(--earth,#3d2b1f);color:#fff}
.dzpick .dzchips .dzc-change{width:100%;border:2px dashed currentColor;border-radius:12px}
.dzchips.dzc-fold>button:not([aria-pressed="true"]):not(.dzc-change){display:none}
.dzgo{display:grid;place-items:center;min-height:48px;border-radius:10px;background:#1a73e8;color:#fff!important;font-weight:700;text-decoration:none;margin:8px 0}
.dzpick button.dzv{width:100%;background:none;color:inherit;border:2px solid var(--line,#ccc)}
.dzpick button.dzl{width:100%;background:none;color:#1a5fc4;text-decoration:underline;min-height:40px;font-weight:600;font-size:15px}
#dzToday.pg,#dzOff.pg{padding-bottom:0}
.seg button,.tile,.btn{min-height:44px}
'''
js=open('/home/claude/dzux/scw.js').read()
block='<!-- dzux start: DZ Charlie phone-friendly layer -->\n<style id="dzux-css">'+css+'</style>\n<script id="dzux-js">\n'+js+'</script>\n<!-- dzux end -->\n'
HOOK='let VIS=new Set(LS.get("visited",[]));'
X='window.SCWX={vis:()=>VIS,toggle:id=>toggleVisited(id),plan:()=>PLAN};/*dzux*/'
for f in sys.argv[1:]:
    s=open(f).read();s=re.sub(r'<!-- dzux start.*?<!-- dzux end -->\n?','',s,flags=re.S)
    if X not in s:
        assert s.count(HOOK)==1,f;s=s.replace(HOOK,HOOK+X)
    i=s.rfind('</body>');s=s[:i]+block+s[i:]
    open(f,'w').write(s);print('ok',f)
