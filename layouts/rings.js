// Rings: a core and the rings that grow around it, one card per ring (static skill 21 concentric scale).
// Card 1 is the core; each ring's label sits at its top and a line runs to its card.
Layouts['rings'] = {
  build(K) {
    const { D, board } = K;
    board.insertAdjacentHTML('beforeend', '<div class="rg-stage" id="rg-stage"></div>');
    const col = document.createElement('div'); col.className = 'rg-cards';
    D.cards.forEach((c, i) => { const el = K.card(c, i); K.paint(el, i); col.appendChild(el); });
    board.appendChild(col);
  },
  connect(K) {
    const { D, board } = K, stage = K.$('rg-stage'), B = board.getBoundingClientRect(), S = stage.getBoundingClientRect();
    const n = D.cards.length, W = stage.clientWidth, H = stage.clientHeight;
    const R = Math.min(W, H) / 2 - 6, cx = W / 2, cy = H / 2, r0 = R * 0.3;
    const radius = k => k === 0 ? r0 : r0 + (R - r0) * k / (n - 1);
    for (let k = n - 1; k >= 0; k--) {
      const ring = document.createElement('div'); ring.className = 'rg-ring' + (k === 0 ? ' core' : ''); K.paint(ring, k);
      if (k === 0) ring.id = 'hub';
      const d = radius(k) * 2;
      Object.assign(ring.style, { width: d + 'px', height: d + 'px', left: cx + 'px', top: cy + 'px' });
      stage.appendChild(ring);
    }
    // labels: the core label in the middle, ring labels in the band at the top of each ring
    D.cards.forEach((c, k) => {
      const lab = document.createElement('div'); lab.className = 'rg-label'; K.paint(lab, k);
      const y = k === 0 ? cy : cy - (radius(k) + radius(k - 1)) / 2;
      Object.assign(lab.style, { left: cx + 'px', top: y + 'px' });
      lab.innerHTML = `<b>${c.ring}</b>`;
      stage.appendChild(lab);
    });
    // lines from each label's right side to its card
    const svg = K.svgEl('links');
    const cards = [...board.querySelectorAll('.card')];
    [...stage.querySelectorAll('.rg-label')].forEach((lab, k) => {
      const L = lab.getBoundingClientRect(), C = cards[k].getBoundingClientRect();
      const x1 = L.right - B.left + 6, y1 = L.top + L.height / 2 - B.top;
      const x2 = C.left - B.left - 6, y2 = C.top + C.height / 2 - B.top, mx = Math.max(x1 + 30, S.right - B.left + 12);
      svg.insertAdjacentHTML('beforeend', K.link(`link-${K.pad(k)}`,
        `M${x1},${y1} L${mx - 14},${y1} Q${mx},${y1} ${mx},${y1 + Math.sign(y2 - y1) * 14} L${mx},${y2 - Math.sign(y2 - y1) * 14} Q${mx},${y2} ${mx + 14},${y2} L${x2},${y2}`,
        K.hueOf(cards[k]), { x: x2, y: y2 }));
    });
    board.prepend(svg);
  },
};
