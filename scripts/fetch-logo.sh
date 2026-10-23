#!/bin/bash
# Usage (from the repo root): scripts/fetch-logo.sh <domain or company name> [slug]
# Downloads a logo from Logo.dev into assets/logos/<slug>.png, so renders never touch the network.
# A name without a dot is looked up first with the search API (LOGO_DEV_SECRET_KEY); the image
# comes from the image CDN (LOGO_DEV_TOKEN). Keys (free at logo.dev) live in .env in the repo root, which git ignores.
set -e
cd "$(dirname "$0")/.."
[ -f .env ] && { set -a; . ./.env; set +a; }
Q="$1"
if [[ "$Q" != *.* ]]; then
  Q=$(curl -sf -H "Authorization: Bearer $LOGO_DEV_SECRET_KEY" "https://api.logo.dev/search?q=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$1")" \
      | python3 -c 'import sys,json;r=json.load(sys.stdin);print(r[0]["domain"] if r else "")')
  [ -n "$Q" ] || { echo "no logo found for $1" >&2; exit 1; }
fi
SLUG="${2:-$(echo "${Q%%.*}" | tr 'A-Z' 'a-z')}"
mkdir -p assets/logos
curl -sf -o "assets/logos/$SLUG.png" "https://img.logo.dev/$Q?token=$LOGO_DEV_TOKEN&size=256&format=png&retina=true"
python3 scripts/index-logos.py >/dev/null
echo "assets/logos/$SLUG.png ($Q)"
