// Usage: node build-motion.js <dumped-dom.html> <motion-script.js> <project-dir> [seconds]   (THEME=b-warm by default)
// Turns a rendered still (same template, same data) into a HyperFrames root composition,
// so the still PNG and the animated version can never drift apart.
const fs = require('fs');
const path = require('path');
const [dom, motion, proj, secs = '12'] = process.argv.slice(2);
const here = path.join(__dirname, '..');

let html = fs.readFileSync(dom, 'utf8');
const attr = k => (html.match(new RegExp('<body[^>]*data-' + k + '="([^"]+)"')) || [])[1];
const hl = attr('hl') || 'sticker';
const byline = attr('byline') || 'footer';
const mascotOn = attr('mascot') || '';
const layout = attr('layout') || 'hub';
const bodyOpen = html.indexOf('>', html.indexOf('<body')) + 1;
let body = html.slice(bodyOpen, html.lastIndexOf('</body>'))
  .replace(/<script[\s\S]*?<\/script>/g, '')
  .replace(/\.\.\/assets\//g, 'assets/');
// split each command chip into characters so it can type out
body = body.replace(/(<span class="chip-text" id="chip-\d+">)([^<]*)(<\/span>)/g, (m, a, txt, c) =>
  a + [...txt.replace(/&amp;/g, '&')].map(ch => `<span class="ch">${ch === ' ' ? '&nbsp;' : ch.replace('&', '&amp;')}</span>`).join('') + c);

// the theme the still was rendered with (its stylesheet link survives in the saved page)
const theme = process.env.THEME || (html.match(/themes\/([\w-]+)\.css/) || [])[1] || 'b-warm';
// inline @import "x.css" (themes build on each other), each file once
const seen = new Set();
const load = f => {
  const full = path.join(here, f);
  if (seen.has(full)) return '';
  seen.add(full);
  return fs.readFileSync(full, 'utf8').replace(/@import\s+(?:url\()?["']([^"']+)["']\)?[^;]*;/g, (m, dep) => load(path.join(path.dirname(f), dep)));
};
const css = ['tokens.css', 'fonts.css', 'components/base.css', `layouts/${layout}.css`, `themes/${theme}.css`].map(load).join('\n')
  .replace(/url\("fonts\//g, 'url("assets/fonts/');

fs.mkdirSync(path.join(proj, 'assets/fonts'), { recursive: true });
for (const f of fs.readdirSync(path.join(here, 'fonts'))) fs.copyFileSync(path.join(here, 'fonts', f), path.join(proj, 'assets/fonts', f));
for (const f of fs.readdirSync(path.join(here, 'assets'))) {
  if (f === 'icons') continue; // icons are inlined into the page already
  fs.cpSync(path.join(here, 'assets', f), path.join(proj, 'assets', f), { recursive: true });
}

const out = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1080, height=1350" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
${css}
  html, body { margin: 0; width: 1080px; height: 1350px; overflow: hidden; }
  #root { position: relative; width: 100%; height: 100%; }
  #poster { position: absolute; inset: 0; display: flex; flex-direction: column; }
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${secs}" data-width="1080" data-height="1350">
<div id="poster" data-hl="${hl}" data-layout="${layout}" data-byline="${byline}" data-mascot="${mascotOn}" class="clip" data-start="0" data-duration="${secs}" data-track-index="0" data-track-kind="graphics" data-layout-allow-overlap data-layout-allow-overflow>
${body}
</div>
</div>
<script>
${fs.readFileSync(motion, 'utf8')}
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(proj, 'index.html'), out);
console.log('wrote', path.join(proj, 'index.html'));
