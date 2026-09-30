from pathlib import Path
import re
root=Path('dist')
missing=[]
for p in root.rglob('*.html'):
    s=p.read_text(encoding='utf-8')
    for href in re.findall(r'(?:href|src)="([^"]+)"',s):
        if not href.startswith('/') or href.startswith('//'): continue
        clean=href.split('#')[0].split('?')[0]
        if not clean: continue
        target=root/clean.lstrip('/')
        if clean.endswith('/'):
            target=target/'index.html'
        if not target.exists(): missing.append((str(p.relative_to(root)),href))
print('html_files',len(list(root.rglob('*.html'))),'missing_links',len(missing))
for x in missing[:30]: print(x)
