// Venn: three circles (top, bottom left, bottom right) with the sweet spot in the middle, cards explaining each below.
Layouts['venn'] = {
  build(K) {
    const { D, board } = K;
    const stage = document.createElement('div'); stage.className = 'vn-stage'; stage.id = 'vn-stage';
    board.appendChild(stage);
    const row = document.createElement('div'); row.className = 'vn-cards';
    D.cards.forEach((c, i) => { const el = K.card(c, i); K.paint(el, i); row.appendChild(el); });
    board.appendChild(row);
  },
  // the circles are sized from the stage once its height is final
  connect(K) {
    const { D } = K, stage = K.$('vn-stage');
    const W = stage.clientWidth, H = stage.clientHeight;
    const d = Math.min(H * 0.66, W * 0.46), r = d / 2;
    const cx = W / 2, cy = H / 2 + r * 0.02, o = r * 0.62;
    const ctr = [[cx, cy - o * 0.95], [cx - o, cy + o * 0.62], [cx + o, cy + o * 0.62]];
    const lab = [[cx, cy - o * 0.95 - r * 0.42], [cx - o - r * 0.36, cy + o * 0.62 + r * 0.18], [cx + o + r * 0.36, cy + o * 0.62 + r * 0.18]];
    D.cards.slice(0, 3).forEach((c, i) => {
      const ci = document.createElement('div'); ci.className = 'vn-circle'; K.paint(ci, i);
      Object.assign(ci.style, { left: ctr[i][0] + 'px', top: ctr[i][1] + 'px' }); ci.style.setProperty('--d', d + 'px');
      stage.appendChild(ci);
      const l = document.createElement('div'); l.className = 'vn-label'; K.paint(l, i);
      Object.assign(l.style, { left: lab[i][0] + 'px', top: lab[i][1] + 'px' });
      l.innerHTML = `<span class="ic">${K.icon(c.icon || 'circle-check', 26)}</span>${c.tag}`;
      stage.appendChild(l);
    });
    const core = document.createElement('div'); core.className = 'vn-core';
    Object.assign(core.style, { left: cx + 'px', top: (cy + o * 0.12) + 'px' });
    core.innerHTML = D.core;
    stage.appendChild(core);
  },
};
