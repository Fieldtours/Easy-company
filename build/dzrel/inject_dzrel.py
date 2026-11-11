# Adds the quiet "Looking for a relative?" link to a DZ Charlie guide page (safe to run again: replaces the old copy).
# usage: python3 inject_dzrel.py <page.html> [<page.html> ...]
import sys, os, re, json
D = os.path.dirname(os.path.abspath(__file__))
JS = open(os.path.join(D, 'dzrel.js'), encoding='utf-8').read()
CSS = open(os.path.join(D, 'dzrel.css'), encoding='utf-8').read()
def scw_picks(page):
    en = os.path.join(os.path.dirname(page), 'index.html')
    t = open(en, encoding='utf-8').read(); i = t.find('SCW={')
    d, _ = json.JSONDecoder().raw_decode(t[i + 4:t.find('\n', i)])
    out = {}
    for x in d['stops']:
        n, k, tx = x['n'], x.get('k', ''), (x['n'] + ' ' + (x.get('t') or '')).lower()
        if not (re.search(r'repression|memory|memorial|cemetery', k, re.I) or re.search(r'mass grave|cemetery|memorial', n, re.I)): continue
        if re.search(r'brigad|british battalion|lincoln|garibaldi|dimitrov|mackenzie|volunteers', tx) and not re.search(r'mass grave|shot|execution', tx): pk = 'ib'
        elif re.search(r'deport|mauthausen|exile|refugee|stanbrook', tx): pk = 'dep'
        elif re.search(r'mass grave|shot|execution|well|barranco|paredón|sacas', tx):
            pk = 'tln' if re.search(r'andaluc|extremad|granada|seville|málaga|malaga|córdoba|badajoz|cáceres|mérida|almendralejo|castuera|huelva|jaén|almería|cádiz', tx) else 'fosa'
        else: pk = 'vic'
        out[x['id']] = pk
    out.update(OVR)
    return out
OVR = {'castile-06': 'fosa', 'south-08': 'vic', 'south-13': 'vic', 'west-07': 'vic', 'castile-07': 'vic', 'catalonia-27': 'vic',
       'aragon-12': 'vic', 'catalonia-13': 'vic', 'madrid-26': 'vic', 'madrid-27': 'vic', 'madrid-05': 'vic', 'madrid-06': 'vic', 'levant-12': 'vic'}
for p in sys.argv[1:]:
    s = open(p, encoding='utf-8').read()
    m = re.search(r'KIND="(ec|scw)"', s)
    if not m or 'id="vz-script"' not in s: sys.exit(f'{p}: no visiting-info layer found')
    s = re.sub(r'\n?<!-- dzrel start.*?<!-- dzrel end -->\n?', '\n', s, flags=re.S)
    block = ('<!-- dzrel start: "Looking for a relative?" link on cemetery, memorial and camp stops (Nov 2026) -->\n'
             f'<style id="dzrel-css">\n{CSS}</style>\n<script id="dzrel-script">\n{JS.replace("__KIND__", m.group(1)).replace("__DEF__", 'vic' if m.group(1) == 'scw' else ('us' if re.search(r'normandy|holland|germany-austria', p) else 'cwgc')).replace("__PICKS__", json.dumps(scw_picks(p) if m.group(1) == "scw" else {}))}</script>\n<!-- dzrel end -->\n')
    i = s.index('</script>', s.index('id="vz-script"')) + len('</script>')
    s = s[:i] + '\n' + block + s[i:].lstrip('\n')
    open(p, 'w', encoding='utf-8').write(s)
    print('ok', p, m.group(1))
