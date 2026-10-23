// Motion for every infographic layout: a seamless loop that starts and ends fully lit.
// A highlight walks the items in order: the card lifts and glows, its link draws in,
// its node fills (stairs), its command types out with a caret; the others wait dimmed.
// The title sticker swaps its two brand states every 2 s.
(() => {
  const DUR = 12, T0 = 0.8;
  const root = document.documentElement;
  const css = getComputedStyle(root);
  const v = k => css.getPropertyValue(k).trim();
  const cards = [...document.querySelectorAll('.card')];
  const links = [...document.querySelectorAll('.link')];
  const hub = document.getElementById('hub');
  const n = cards.length;
  const STEP = Math.min(2.0, 9.2 / n);
  const LIFT = n <= 4 ? 1.015 : 1.03;
  const pad = i => String(i + 1).padStart(2, '0');
  const role = (el, k) => getComputedStyle(el).getPropertyValue(k).trim();
  // every card and the hub return to their OWN starting position, scale and shadow (layouts may place them with transforms)
  const home = cards.map(el => ({ y: gsap.getProperty(el, 'y'), scale: gsap.getProperty(el, 'scale'), shadow: getComputedStyle(el).boxShadow }));
  const hubRest = hub ? getComputedStyle(hub).boxShadow : 'none';
  // each node's resting colours, so the loop ends exactly where it started
  const nodeRest = [...document.querySelectorAll('.node')].map(el => { const c = getComputedStyle(el); return { bg: c.backgroundColor, color: c.color }; });
  // waiting cards: greyed on light paper; on the dark purple page grey turns murky, so they just soften
  const dark = v('--paper-ink').toLowerCase() === '#ffffff';
  const DIM = dark ? 0.45 : 0.3;
  const OFF = dark ? 'saturate(0.55)' : 'grayscale(1)', ON = dark ? 'saturate(1)' : 'grayscale(0)';
  const tl = gsap.timeline({ paused: true });

  // everything steps back so the walk can begin
  tl.to(cards, { opacity: DIM, filter: OFF, duration: 0.35, ease: 'power2.inOut' }, T0);
  if (links.length) tl.to(links, { opacity: 0.2, duration: 0.35, ease: 'power2.inOut' }, T0);

  cards.forEach((card, i) => {
    const t = T0 + 0.2 + i * STEP;
    const hue = role(card, '--h-text') || role(card, '--h');
    const glow = role(card, '--h');
    const chars = [...document.querySelectorAll('#chip-' + pad(i) + ' .ch')];
    const caret = document.getElementById('caret-' + pad(i));
    const link = document.getElementById('link-' + pad(i));
    const node = document.getElementById('node-' + pad(i));

    tl.to(card, { opacity: 1, filter: ON, y: home[i].y - 6, scale: home[i].scale * LIFT,
      boxShadow: '0 26px 50px -20px ' + glow + ', 0 0 0 3px ' + glow + '2e', duration: 0.5, ease: 'power4.out' }, t);
    if (hub) tl.to(hub, { boxShadow: '0 30px 70px -20px ' + glow + ', inset 0 0 0 2px ' + glow, duration: 0.4, ease: 'power2.inOut' }, t);
    if (node) {
      const on = role(node, '--on-h') || '#fff';
      tl.to(node, { backgroundColor: glow, color: on, scale: 1.12, duration: 0.4, ease: 'back.out(2)' }, t);
    }
    if (link) {
      tl.set(link, { opacity: 1 }, t - 0.25);
      tl.fromTo(link.querySelector('path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.45, ease: 'power2.inOut', immediateRender: false }, t - 0.25);
    }

    if (chars.length) {
      tl.set(chars, { display: 'none' }, t);
      tl.set(caret, { opacity: 1 }, t + 0.15);
      chars.forEach((ch, k) => tl.set(ch, { display: 'inline' }, t + 0.25 + k * 0.04));
      const typed = t + 0.25 + chars.length * 0.04;
      for (let b = typed + 0.2, on = false; b < t + STEP - 0.15; b += 0.25, on = !on) tl.set(caret, { opacity: on ? 1 : 0 }, b);
      tl.set(caret, { opacity: 0 }, t + STEP - 0.15);
    }

    if (i < n - 1) {
      tl.to(card, { opacity: DIM, filter: OFF, y: home[i].y, scale: home[i].scale, boxShadow: home[i].shadow, duration: 0.3, ease: 'power3.in' }, t + STEP - 0.2);
      if (link) tl.to(link, { opacity: 0.2, duration: 0.3, ease: 'power3.in' }, t + STEP - 0.2);
    }
  });

  // finale: everything lights up together, then holds for the loop point
  const tf = T0 + 0.2 + n * STEP - 0.1;
  const nodes = [...document.querySelectorAll('.node')];
  tl.to(cards, { opacity: 1, filter: ON, y: k => home[k].y, scale: k => home[k].scale, boxShadow: k => home[k].shadow, duration: 0.45, ease: 'power3.out', stagger: 0.06 }, tf);
  if (links.length) tl.to(links, { opacity: 1, duration: 0.45, ease: 'power3.out', stagger: 0.06 }, tf);
  if (nodes.length) tl.to(nodes, { backgroundColor: k => nodeRest[k].bg, color: k => nodeRest[k].color, scale: 1, duration: 0.4, ease: 'power3.out', stagger: 0.06 }, tf);
  if (hub) tl.to(hub, { boxShadow: hubRest, duration: 0.5, ease: 'power2.inOut' }, tf);

  // the title sticker: peach + orange words, then lavender + purple words, ending where it began
  const stickers = [...document.querySelectorAll('.hl')];
  const state = s => ({ backgroundColor: v('--hl-bg' + s), color: v('--hl-ink' + s),
    boxShadow: 'inset 0 0 0 2px ' + v('--hl-edge' + s) + ', 0 14px 30px -18px ' + v('--hl-glow' + s) });
  for (let k = 1; k * 2 <= DUR; k++)
    tl.to(stickers, { ...state(k % 2 ? '-2' : ''), duration: 0.35, ease: 'power2.inOut' }, Math.min(k * 2 - 0.2, DUR - 0.6));

  tl.set({}, {}, DUR);
  window.__timelines['main'] = tl;
  tl.seek(0);
})();
