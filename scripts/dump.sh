#!/bin/bash
# Usage (from the repo root): scripts/dump.sh work/<name>.html out/<name>.dom.html
# Saves the finished page (after fonts, highlights and links are drawn). Retries until the page marks itself ready.
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
for budget in 10000 15000 20000 30000; do
  "$CHROME" --headless=new --disable-gpu --allow-file-access-from-files --window-size=1080,1350 \
    --virtual-time-budget=$budget --dump-dom "file://$PWD/$1" 2>/dev/null > "$2"
  grep -q 'data-ready="1"' "$2" && exit 0
done
echo "page never became ready: $1" >&2; exit 1
