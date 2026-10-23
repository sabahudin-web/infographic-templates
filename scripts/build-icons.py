"""Bundles assets/icons/*.svg (Lucide, ISC) into components/icons.js so templates can inline them
and colour them with currentColor. Usage: python3 scripts/build-icons.py"""
import os, re, json
d = 'assets/icons'
out = {}
for f in sorted(os.listdir(d)):
    if not f.endswith('.svg'): continue
    s = open(os.path.join(d, f)).read()
    s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    s = re.sub(r'\s*class="[^"]*"', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    out[f[:-4]] = s
js = ("// Line icons: Lucide (ISC licence, assets/icons/LICENSE.txt), 2px round strokes in currentColor.\n"
      "// Built by scripts/build-icons.py. Use UnstuckIcons.svg(name, size).\n"
      "window.UnstuckIcons = (() => {\n  const I = " + json.dumps(out) + ";\n"
      "  return { names: Object.keys(I), svg: (n, size = 26) => (I[n] || '').replace('width=\"24\"', `width=\"${size}\"`).replace('height=\"24\"', `height=\"${size}\"`) };\n})();\n")
open('components/icons.js', 'w').write(js)
print(len(out), 'icons')
