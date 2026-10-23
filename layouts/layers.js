// Nested layers: concentric arches rising from the bottom, outermost first; one card sits at the top of each band.
Layouts['layers'] = {
  build(K) {
    const { D, board } = K;
    const fills = D.fills || ['#FFE8DC', '#EEE8FF', '#DCD1FA', '#CAF1CD'];
    const n = D.cards.length;
    D.cards.forEach((c, i) => {
      const a = document.createElement('div'); a.className = 'ly-arch'; a.dataset.i = i;
      a.style.setProperty('--fill', fills[i % fills.length]);
      board.appendChild(a);
    });
    D.cards.forEach((c, i) => {
      const el = K.card(c, i); K.paint(el, i); el.dataset.i = i;
      if (i === n - 1) el.classList.add('core');
      board.appendChild(el);
    });
    // the outer band can carry real tool logos, split left and right of its card
    if (D.logos) {
      const half = Math.ceil(D.logos.length / 2);
      [D.logos.slice(0, half), D.logos.slice(half)].forEach((set, k) => {
        const l = document.createElement('div'); l.className = 'ly-logos'; l.id = 'ly-logos-' + k;
        l.innerHTML = set.map(s => K.logo(s, 58)).join('');
        board.appendChild(l);
      });
    }
  },
  // bands are sized from the board's final size: the outer arch fills the width, the rest step in evenly
  connect(K) {
    const { D, board } = K, W = board.clientWidth, H = board.clientHeight, n = D.cards.length;
    // ellipse arches: wide and tall on the outside, small at the core
    const rx = i => W * (0.78 - 0.13 * i), ry = i => H * (0.98 - (0.98 - 0.27) * i / (n - 1));
    const archs = [...board.querySelectorAll('.ly-arch')], cards = [...board.querySelectorAll('.card')];
    archs.forEach((a, i) => { a.style.setProperty('--rx', rx(i) + 'px'); a.style.setProperty('--ry', ry(i) + 'px'); });
    cards.forEach((c, i) => { c.style.top = (H - ry(i) + (i === n - 1 ? ry(i) * 0.3 : 30)) + 'px'; });
    const y = H - ry(0) + 30 + cards[0].offsetHeight / 2;
    [0, 1].forEach(k => { const l = K.$('ly-logos-' + k); if (l) { l.style.top = y + 'px'; l.style[k ? 'right' : 'left'] = '148px'; } });
  },
};
