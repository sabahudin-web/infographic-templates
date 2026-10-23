"""Writes assets/logos/index.js: which logos are full-bleed squares (fill the tile) and which have
transparent corners (sit inside the tile). Run after adding logos: python3 scripts/index-logos.py"""
import os, json
from PIL import Image
d = 'assets/logos'
idx = {}
for f in sorted(os.listdir(d)):
    if not f.endswith('.png'): continue
    a = Image.open(os.path.join(d, f)).convert('RGBA').getchannel('A')
    idx[f[:-4]] = {'fill': a.getpixel((3, 3)) > 200}
open(os.path.join(d, 'index.js'), 'w').write('// built by scripts/index-logos.py\nwindow.UnstuckLogos = ' + json.dumps(idx) + ';\n')
print(len(idx), 'logos indexed')
