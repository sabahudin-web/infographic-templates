"""Background pattern: overlapping 'scales' made of nested rounded squares, each set shrinking
toward its bottom centre (our square take on the classic line-scale pattern). Writes a
full-canvas SVG; the page shows it at very low opacity.
Usage: python3 make-pattern.py <out.svg> [width] [height] [unit]"""
import sys
out = sys.argv[1]
W = int(sys.argv[2]) if len(sys.argv) > 2 else 1080
H = int(sys.argv[3]) if len(sys.argv) > 3 else 1350
U = int(sys.argv[4]) if len(sys.argv) > 4 else 140   # size of one scale
LINES, STEP_Y = 20, int(U * 0.8)                    # nested outlines per scale, row spacing (overlap)
INK, PAPER = "#463187", "#FFFFFF"

def scale(cx, top):
    parts = []
    for k in range(LINES):
        f = 1 - k / LINES                    # 1 .. small, every outline keeps the same bottom centre
        s = U * f
        x, y = cx - s / 2, top + (U - s)     # anchored at the bottom edge
        r = s * 0.16
        fill = PAPER if k == 0 else "none"   # the outer square hides the row above, like scales
        parts.append(f'<rect x="{x:.2f}" y="{y:.2f}" width="{s:.2f}" height="{s:.2f}" rx="{r:.2f}" fill="{fill}" stroke="{INK}" stroke-width="1.2"/>')
    return "".join(parts)

rows = []
row, top = 0, -U
while top < H + U:
    off = (U / 2) if row % 2 else 0
    cx = -U + off
    cells = []
    while cx < W + U:
        cells.append(scale(cx, top))
        cx += U
    rows.append("".join(cells))
    top += STEP_Y
    row += 1
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">' + "".join(rows) + "</svg>"
open(out, "w").write(svg)
print(out, len(svg) // 1024, "KB")
