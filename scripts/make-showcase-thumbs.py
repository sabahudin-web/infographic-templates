"""Builds the showcase: small copies of every example still in assets/showcase/ and the item list in
data/showcase-50.json (in the order of the layout table in README.md). Run after adding a layout:
python3 scripts/make-showcase-thumbs.py"""
import json, os, re
from PIL import Image

os.makedirs('assets/showcase', exist_ok=True)
order = re.findall(r'^\| `([a-z0-9-]+)` \| [^|]+\| `([a-z0-9-]+)`', open('README.md').read(), re.M)
items = []
for layout, name in order:
    src = f'examples/{name}.png'
    if not os.path.exists(src):
        continue
    d = json.load(open(f'data/{name}.json'))
    title = re.sub(r'<[^>]+>', '', ' '.join(d.get('title', [])))
    im = Image.open(src).convert('RGB')
    im.resize((600, 750), Image.LANCZOS).save(f'assets/showcase/{name}.jpg', quality=80, optimize=True)
    im.resize((220, 275), Image.LANCZOS).save(f'assets/showcase/{name}-sm.jpg', quality=82, optimize=True)
    items.append({'name': name, 'layout': layout, 'title': title, 'theme': d.get('theme', 'b-warm')})

p = 'data/showcase-50.json'
data = json.load(open(p)) if os.path.exists(p) else {}
data['items'] = items
json.dump(data, open(p, 'w'), indent=2, ensure_ascii=False)
print(len(items), 'items')
