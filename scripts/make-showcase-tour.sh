#!/bin/bash
# Usage (from the repo root): scripts/make-showcase-tour.sh data/showcase-50-tour.json [name]
# The showcase grid with a tour: the templates listed in "tour" pop up one by one and play their real
# animation (out/<name>.mp4, sped up by tour.speed) inside the pop-up. Render each toured template with
# make-motion.sh first. Writes out/<name>.png, .mp4 (full length) and .gif (720 wide).
set -e
cd "$(dirname "$0")/.."
D="$1"; N="${2:-$(basename "$D" .json)}"
J() { python3 -c "import json,sys;d=json.load(open('$D'));print($1)"; }
ITEMS=($(J "' '.join(d['tour']['items'])"))
# 1. the first frame of each animation stands in for it while the pop-up grows and shrinks
for n in "${ITEMS[@]}"; do
  [ -s "out/$n.mp4" ] || { echo "render out/$n.mp4 first: scripts/make-motion.sh data/$n.json" >&2; exit 1; }
  ffmpeg -v error -y -i "out/$n.mp4" -frames:v 1 -vf scale=620:775:flags=lanczos -q:v 3 "assets/showcase/$n-f0.jpg"
done
# 2. the grid and the pop-up moves, through HyperFrames
scripts/make-motion.sh "$D" "$N" >/dev/null
# 3. lay each animation over its pop-up while it holds at full size
read L TOP < <(python3 -c "import re;h=open('work/$N.dom.html').read();m=re.search(r'class=\"pop[^\"]*\"[^>]*style=\"left: (\d+)px; top: (-?\d+)px',h);print(m[1],m[2])")
Y=$((TOP + 56))
python3 -c "
from PIL import Image, ImageDraw
m=Image.new('L',(620,775),0); ImageDraw.Draw(m).rounded_rectangle((0,-40,619,774),22,fill=255); m.save('work/$N-mask.png')"
read START GROW PLAY SHRINK GAP SPEED < <(J "' '.join(str(d['tour'][k]) for k in ['start','grow','play','shrink','gap','speed'])")
IN=(-i "out/$N.mp4" -loop 1 -i "work/$N-mask.png"); F=""; last="0:v"; k=0
for n in "${ITEMS[@]}"; do
  IN+=(-i "out/$n.mp4")
  S=$(python3 -c "print(round($START + $k*($GROW+$PLAY+$SHRINK+$GAP) + $GROW, 3))")
  E=$(python3 -c "print(round($S + $PLAY, 3))")
  F+="[$((k+2)):v]setpts=PTS/$SPEED+$S/TB,scale=620:775:flags=lanczos,format=rgba[c$k];[1:v]setpts=PTS+$S/TB[m$k];[c$k][m$k]alphamerge[a$k];"
  F+="[$last][a$k]overlay=$L:$Y:enable='between(t,$S,$E)':eof_action=pass[v$k];"
  last="v$k"; k=$((k+1))
done
ffmpeg -v error -y "${IN[@]}" -filter_complex "${F%;}" -map "[$last]" -t "$(J "d['seconds']")" -c:v libx264 -crf 18 -pix_fmt yuv420p -movflags +faststart "out/$N-tour.mp4"
mv "out/$N-tour.mp4" "out/$N.mp4"
ffmpeg -v error -y -i "out/$N.mp4" -vf "scale=720:-1:flags=lanczos,fps=12,split[a][b];[a]palettegen=max_colors=160:stats_mode=diff[p];[b][p]paletteuse=dither=sierra2_4a:diff_mode=rectangle" -loop 0 "out/$N.gif"
echo "out/$N.png out/$N.mp4 out/$N.gif"
