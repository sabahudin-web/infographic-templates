// Two-circle venn: two sets and what sits in the overlap (static skill 17).
// Cards 1 and 2 explain the circles, card 3 is the overlap (it gets id hub-like glow via its card).
Layouts['venn2'] = {
  build(K) {
    const { D, board } = K;
    board.insertAdjacentHTML('beforeend', '<div class="v2-stage" id="v2-stage"></div>');
    const row = document.createElement('div'); row.className = 'v2-cards';
    D.cards.forEach((c, i) => { const el = K.card(c, i); K.paint(el, i); if (i === 2) el.classList.add('v2-mid'); row.appendChild(el); });
    board.appendChild(row);
  },
  connect(K) {
    const { D } = K, stage = K.$('v2-stage');
    const W = stage.clientWidth, H = stage.clientHeight;
    const d = Math.min(H * 0.94, W * 0.56), r = d / 2, cx = W / 2, cy = H / 2, o = r * 0.56;
    [[cx - o, 0], [cx + o, 1]].forEach(([x, i]) => {
      const c = D.cards[i];
      const ci = document.createElement('div'); ci.className = 'v2-circle'; K.paint(ci, i);
      Object.assign(ci.style, { left: x + 'px', top: cy + 'px' }); ci.style.setProperty('--d', d + 'px');
      stage.appendChild(ci);
      // the label sits in the part of the circle that does not overlap
      const lab = document.createElement('div'); lab.className = 'v2-label'; K.paint(lab, i);
      Object.assign(lab.style, { left: (x + (i ? 1 : -1) * r * 0.42) + 'px', top: cy + 'px', width: (r * 0.8) + 'px' });
      lab.innerHTML = `<span class="ic">${K.icon(c.icon || 'circle-check', 28)}</span><b>${c.tag}</b><small>${c.set || ''}</small>`;
      stage.appendChild(lab);
    });
    const core = document.createElement('div'); core.className = 'v2-core'; core.id = 'hub';
    Object.assign(core.style, { left: cx + 'px', top: cy + 'px' });
    core.innerHTML = `${K.icon(D.coreIcon || 'sparkles', 26)}<span>${D.core}</span>`;
    stage.appendChild(core);
  },
};
