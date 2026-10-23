---
description: Make these templates yours (your colours, fonts, logo, photo)
---


You are setting up this infographic template repo for me. Read `README.md`, `themes/brand-colours.css`, `themes/b-warm.css`, `themes/purple-dark.css`, `tokens.css`, `fonts.css`, `me.json` and `components/base.css` first so you know how the look is built. Then work through these steps in order. Ask me one short question at a time and wait for my answer. Keep your words plain; I may not be technical.

## 1. Pick the path

Ask me which I want:

- **A. My own brand.** A new look from my colours, fonts, logo and photo.
- **B. Keep this look.** The same layouts, sticker, cards and pattern, with only my colours, photo, fonts and logo swapped in.

## 2. Collect what you need

Ask for each of these, one at a time. If I do not have one, say what the default is and move on.

1. **Name and title** for the footer (for example "Jane Doe", "Founder, Acme").
2. **Photo.** A square-ish photo of me, head and shoulders, not a tight face crop. I can drop the file into the repo or give you a path. If I have none, keep initials.
3. **Logo.** An SVG or a PNG with a transparent background. Ask whether I have a light version (for dark backgrounds) and a dark version (for light backgrounds). If I have only one, make the other by recolouring it to white or to my main colour.
4. **Colours.** My main colour and one accent colour at least. Optional: up to three soft pastels for card tints. Hex codes or a screenshot are both fine; if I give a website, read its colours from it.
5. **Fonts.** A title font and a body font. If I name Google Fonts, download the files into `fonts/` (include each font's licence file). If I say "keep them", keep Archivo Black, Inter and JetBrains Mono.
6. **Path A only:** light or dark as my default, rounded or sharper cards, and whether I want the background pattern.

## 3. Apply it

- `me.json`: set `name`, `role`, `initials`, and `photo` (the file name inside `assets/`).
- **Photo:** save it as `assets/avatar.jpg`, cropped square around head and shoulders, 480 x 480. Keep the background or put it on my main colour.
- **Logo:** write four files in `assets/logo/`: `mark.svg` (the icon in my main colour), `mark-dark.svg` (the icon in white), `lockup-horizontal.svg` (icon plus name, main colour) and `lockup-horizontal-dark.svg` (same in white). Keep each file's current viewBox ratio (the mark is square, the lockup is about 3.4 : 1) so the layouts place them right. If my logo is a PNG, embed it in the SVG as an image.
- **Colours:** change `themes/brand-colours.css` first (`--b-purple` is the main colour, `--b-orange` the accent, `--b-lavender`, `--b-peach` and `--b-mint` the soft tints, plus the text-safe shades `--b-orange-text`, `--b-mint-text` and `--b-ink`). Then update the sticker colours in `tokens.css` (`--hl-*`), both themes, and the hard-coded colours in `components/base.css` and `layouts/*.css` (search for the old hex values: #463187, #FF6719, #E2560F, #E04E0B, #E0D6FF, #FFE8DC, #FFE3D3, #E6DDFF, #CAF1CD, #2F8F57, #D5F4D8 and their tints). Keep contrast: never white text on a pale colour, never pale text on white. If a text colour fails WCAG AA (4.5 : 1) on its background, make it darker and tell me.
- **Fonts:** add the `@font-face` lines in `fonts.css` and set `--font-display`, `--font-body` and `--font-mono` in `tokens.css`.
- **Path A:** you may also change the radius, shadow and pattern tokens in `tokens.css`, and the pattern opacity, to fit my brand. Do not change the layout files' structure.
- **Path B:** change only colours, fonts, logo, photo, name and title. Leave shapes, spacing, the sticker and the motion as they are.

## 4. Check it

1. Render three stills: `scripts/render.sh data/ai-ops-loop.json`, `scripts/render.sh data/two-ways.json` and `THEME=purple-dark scripts/render.sh data/what-owners-ask.json`.
2. Open each PNG in `out/` and look at it yourself: title, sticker, cards, footer photo, name, logo, contrast. Fix anything that looks broken before you show me.
3. Show me the three stills. Ask if I want changes.
4. When I am happy, render one animation (`scripts/make-motion.sh data/never-miss-a-lead.json`) and show me the GIF.

## 5. Finish

- Tell me how to make my next infographic: copy a file in `data/`, change the words, run `scripts/render.sh` or `scripts/make-motion.sh`.
- Offer to re-render the `examples/` stills and the showcase in my brand (`python3 scripts/make-showcase-thumbs.py`, then `scripts/render.sh data/showcase-50.json`). Only do it if I say yes; it takes a few minutes.
- Remind me the example data files hold sample text: replace the words with my own before posting.
- Remind me of the free Unstuck Community for more templates: https://whop.com/unstuck-your-business/unstuck-community/
