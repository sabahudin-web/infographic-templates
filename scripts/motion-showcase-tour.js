// Motion for the showcase tour: a seamless loop that starts and ends on the plain grid.
// A ripple runs across all 50 thumbnails, then a few templates (D.tour) grow out of their thumbnail
// one at a time and hold while scripts/make-showcase-tour.sh plays their real animation inside the pop-up.
(() => {
  const root = document.getElementById('root');
  const DUR = parseFloat(root.dataset.duration);
  const scrim = document.getElementById('sc-scrim');
  const T = JSON.parse(scrim.dataset.tour);
  const pops = [...document.querySelectorAll('.pop')];
  const thumbs = pops.map(p => document.getElementById('thumb-' + p.id.slice(4)));
  const all = [...document.querySelectorAll('.thumb')];
  const STEP = T.grow + T.play + T.shrink + T.gap;
  const strip = p => getComputedStyle(p).getPropertyValue('--strip-ink').trim();
  const rest = el => getComputedStyle(el).boxShadow;
  const tl = gsap.timeline({ paused: true });

  // opening ripple: every thumbnail bobs in reading order, so the 50 register before the tour
  all.forEach((t, i) => {
    tl.fromTo(t, { y: 0, scale: 1 }, { y: -6, scale: 1.06, duration: 0.22, ease: 'power2.out', immediateRender: false }, 0.3 + i * 0.026);
    tl.to(t, { y: 0, scale: 1, duration: 0.3, ease: 'power2.inOut' }, 0.52 + i * 0.026);
  });

  tl.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.inOut', immediateRender: false }, T.start - 0.35);

  pops.forEach((p, i) => {
    const t = T.start + i * STEP;
    const home = { x: +p.dataset.fx, y: +p.dataset.fy, scale: +p.dataset.fs };
    const ink = strip(p), r = rest(thumbs[i]);
    const lit = `0 0 0 4px ${ink}, 0 16px 30px -12px ${ink}`;
    tl.fromTo(thumbs[i], { boxShadow: r, zIndex: 0 }, { boxShadow: lit, zIndex: 41, duration: 0.25, ease: 'power2.out', immediateRender: false }, t);
    tl.fromTo(p, { ...home, zIndex: 50 + i }, { x: 0, y: 0, scale: 1, duration: T.grow, ease: 'expo.out', immediateRender: false }, t);
    tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.08, ease: 'none', immediateRender: false }, t);
    // holds still at full size for T.play seconds: the real animation is laid over it in post
    const out = t + T.grow + T.play;
    tl.fromTo(p, { x: 0, y: 0, scale: 1 }, { ...home, duration: T.shrink, ease: 'power3.in', immediateRender: false }, out);
    tl.fromTo(p, { opacity: 1 }, { opacity: 0, duration: 0.16, ease: 'power1.in', immediateRender: false }, out + 0.12);
    tl.fromTo(thumbs[i], { boxShadow: lit }, { boxShadow: r, zIndex: 0, duration: 0.25, ease: 'power2.in', immediateRender: false }, out + T.shrink - 0.1);
  });

  tl.fromTo(scrim, { opacity: 1 }, { opacity: 0, duration: 0.5, ease: 'power2.inOut', immediateRender: false },
    T.start + pops.length * STEP - T.gap + 0.05);

  // the title sticker keeps its slow orange / purple swap, ending where it began
  const css = getComputedStyle(document.documentElement);
  const v = k => css.getPropertyValue(k).trim();
  const stickers = [...document.querySelectorAll('.hl')];
  const state = s => ({ backgroundColor: v('--hl-bg' + s), color: v('--hl-ink' + s),
    boxShadow: 'inset 0 0 0 2px ' + v('--hl-edge' + s) + ', 0 14px 30px -18px ' + v('--hl-glow' + s) });
  const swaps = Math.floor(DUR / 2) - (Math.floor(DUR / 2) % 2);
  for (let k = 1; k <= swaps; k++)
    tl.to(stickers, { ...state(k % 2 ? '-2' : ''), duration: 0.35, ease: 'power2.inOut' }, Math.min(k * 2 - 0.2, DUR - 0.6));

  tl.set({}, {}, DUR);
  window.__timelines['main'] = tl;
  tl.seek(0);
})();
