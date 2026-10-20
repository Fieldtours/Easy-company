# Puts the shared phone-friendly layer into a finished guide page (safe to run again: replaces the old copy)
import re,sys
dz=open('/home/claude/dzux/dzux.html').read()
for f in sys.argv[1:]:
    s=open(f).read();s=re.sub(r'<!-- dzux start.*?<!-- dzux end -->\n?','',s,flags=re.S)
    i=s.rfind('</body>');s=s[:i]+dz+s[i:] if i>=0 else s+dz
    open(f,'w').write(s);print('ok',f)
