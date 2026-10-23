#!/bin/bash
# Usage (from the repo root): scripts/make-motion.sh data/<file>.json [name]
# Still PNG + loop (MP4 and GIF) from one data file, through HyperFrames. Output in out/.
set -e
cd "$(dirname "$0")/.."
N="${2:-$(basename "$1" .json)}"
rm -f "out/$N.mp4" "out/$N.gif"
scripts/render.sh "$1" "$N" >/dev/null
scripts/dump.sh "work/$N.html" "work/$N.dom.html"
rm -rf "work/motion-$N" && cp -R motion-base "work/motion-$N"
# a data file may pick its own motion script and length ("motion", "seconds"); default is the 12 s walk
MOTION=$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1])).get("motion","scripts/motion-walk.js"))' "$1")
SECS=$(python3 -c 'import json,sys;print(json.load(open(sys.argv[1])).get("seconds",12))' "$1")
node scripts/build-motion.js "work/$N.dom.html" "$MOTION" "work/motion-$N" "$SECS" >/dev/null
( cd "work/motion-$N" && npx --yes hyperframes@0.8.185 check --json 2>/dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const d=JSON.parse(s);for(const k of ["lint","runtime","layout"]) if(!d[k].ok){console.error(k+" failed: "+JSON.stringify(d[k].findings.map(f=>f.code)));process.exit(1)}})' )
( cd "work/motion-$N" && npx --yes hyperframes@0.8.185 render -o "../../out/$N.mp4" -f 30 -q delivery --quiet >/dev/null 2>&1 )
# long pieces get a lighter GIF preview (first 20 s, half size); the MP4 is the full piece
GIFCUT=""; GIFSCALE=""
if [ "$SECS" -gt 20 ]; then GIFCUT="-t 20"; GIFSCALE="scale=540:-1:flags=lanczos,"; fi
ffmpeg -v error -y $GIFCUT -i "out/$N.mp4" -vf "${GIFSCALE}fps=15,split[a][b];[a]palettegen=max_colors=192:stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a:diff_mode=rectangle" -loop 0 "out/$N.gif" 2>&1 | grep -v Fontconfig || true
[ -s "out/$N.mp4" ] && [ -s "out/$N.gif" ] || { echo "render produced no video for $N" >&2; exit 1; }
echo "out/$N.png out/$N.mp4 out/$N.gif"
