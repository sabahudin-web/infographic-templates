// Motion for the showcase: a seamless loop that starts and ends on the plain grid.
// One by one, each template grows out of its thumbnail into a big pop-up, holds, and shrinks back
// while the next one is already growing. The grid softens behind while pop-ups are open.
(() => {
  const root = document.getElementById('root');
  const DUR = parseFloat(root.dataset.duration);
  const pops = [...document.querySelectorAll('.pop')];
  const thumbs = pops.map(p => document.getElementById('thumb-' + p.id.slice(4)));
  const scrim = document.getElementById('sc-scrim');
  const T0 = 0.8, GROW = 0.38, SHRINK = 0.3;
  // spread the pop-ups evenly between the opening beat and a short closing beat
  const STEP = (DUR - T0 - 1.2) / pops.length;
  // the open card starts leaving just before the next one appears, so two cards never stack
  const HOLD = STEP - GROW - 0.14;
  const strip = p => getComputedStyle(p).getPropertyValue('--strip-ink').trim();
  const thumbRest = thumbs.map(t => getComputedStyle(t).boxShadow);
  const tl = gsap.timeline({ paused: true });

  tl.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.inOut', immediateRender: false }, T0 - 0.35);

  pops.forEach((p, i) => {
    const t = T0 + i * STEP;
    const home = { x: +p.dataset.fx, y: +p.dataset.fy, scale: +p.dataset.fs };
    const ink = strip(p);
    // its thumbnail marks which one is open
    tl.fromTo(thumbs[i], { boxShadow: thumbRest[i], zIndex: 0 },
      { boxShadow: `0 0 0 4px ${ink}, 0 16px 30px -12px ${ink}`, zIndex: 41, duration: 0.25, ease: 'power2.out', immediateRender: false }, t);
    // grow out of the thumbnail
    tl.fromTo(p, { ...home, zIndex: 50 + i },
      { x: 0, y: 0, scale: 1, duration: GROW, ease: 'expo.out', immediateRender: false }, t);
    tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.08, ease: 'none', immediateRender: false }, t);
    // shrink back into its spot, fading just before it lands
    tl.fromTo(p, { x: 0, y: 0, scale: 1 },
      { ...home, duration: SHRINK, ease: 'power3.in', immediateRender: false }, t + GROW + HOLD);
    tl.fromTo(p, { opacity: 1 }, { opacity: 0, duration: 0.16, ease: 'power1.in', immediateRender: false }, t + GROW + HOLD + 0.02);
    tl.fromTo(thumbs[i], { boxShadow: `0 0 0 4px ${ink}, 0 16px 30px -12px ${ink}` },
      { boxShadow: thumbRest[i], zIndex: 0, duration: 0.25, ease: 'power2.in', immediateRender: false }, t + GROW + HOLD + SHRINK - 0.15);
  });

  tl.fromTo(scrim, { opacity: 1 }, { opacity: 0, duration: 0.5, ease: 'power2.inOut', immediateRender: false },
    T0 + pops.length * STEP + 0.1);

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
