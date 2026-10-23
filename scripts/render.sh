#!/bin/bash
# Usage (from the repo root): [THEME=b-warm] scripts/render.sh data/<file>.json [name]
# Fills the infographic template with a data file (its "layout" picks hub, stairs, grid, funnel, compare, tree, pipeline, ladder or spine)
# and screenshots it to out/<name>.png at 1080x1350. The built page is kept as work/<name>.html.
set -e
cd "$(dirname "$0")/.."
mkdir -p out work
D="$1"; N="${2:-$(basename "$D" .json)}"
# theme: THEME env, else the data file's "theme", else b-warm
THEME="${THEME:-$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1])).get("theme","b-warm"))' "$D")}"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
node -e '
const fs = require("fs");
const [t, d, o, theme] = process.argv.slice(1);
// the byline (name, role, photo) comes from me.json unless the data file sets its own "author"
const D = JSON.parse(fs.readFileSync(d, "utf8"));
D.author = Object.assign({}, JSON.parse(fs.readFileSync("me.json", "utf8")), D.author || {});
const data = JSON.stringify(D);
const layout = D.layout || "hub";
fs.writeFileSync(o, fs.readFileSync(t, "utf8").replace("/*DATA*/", data).replace(/LAYOUT\.(css|js)/g, (m, ext) => layout + "." + ext).replace("THEME.css", theme + ".css"));
' templates/infographic.html "$D" "work/$N.html" "$THEME"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --force-device-scale-factor=1 --window-size=1080,1350 --virtual-time-budget=12000 \
  --screenshot="out/$N.png" "file://$PWD/work/$N.html" 2>/dev/null
echo "out/$N.png"
