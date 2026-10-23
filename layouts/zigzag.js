// Zigzag: steps alternate left and right down the page; a numbered node sits opposite each card
// and an S-shaped line runs from node to node (static skill 08 zigzag flow).
Layouts['zigzag'] = {
  build(K) {
    const { D, board } = K;
    D.cards.forEach((c, i) => {
      const row = document.createElement('div');
      row.className = 'zz-row' + (i % 2 ? ' r' : '');
      K.paint(row, i);
      const el = K.card(c, i); K.paint(el, i);
      row.appendChild(el);
      row.insertAdjacentHTML('beforeend',
        `<div class="zz-step"><span class="node" id="node-${K.pad(i)}">${K.pad(i)}</span><small>${c.step || 'STEP ' + K.pad(i)}</small></div>`);
      board.appendChild(row);
    });
  },
  connect(K) {
    const { board } = K, B = board.getBoundingClientRect();
    const svg = K.svgEl('links');
    const steps = [...board.querySelectorAll('.zz-step')];
    const rows = [...board.querySelectorAll('.zz-row')];
    for (let i = 1; i < steps.length; i++) {
      // down from the step label, across the gap between rows, down into the next node
      const a = steps[i - 1].getBoundingClientRect(), n = steps[i].querySelector('.node').getBoundingClientRect();
      const gy = (rows[i - 1].getBoundingClientRect().bottom + rows[i].getBoundingClientRect().top) / 2 - B.top;
      const ax = a.left + a.width / 2 - B.left, ay = a.bottom - B.top + 4;
      const bx = n.left + n.width / 2 - B.left, by = n.top - B.top - 6;
      const s = Math.sign(bx - ax), k = 14;
      const d = `M${ax},${ay} L${ax},${gy - k} Q${ax},${gy} ${ax + s * k},${gy} L${bx - s * k},${gy} Q${bx},${gy} ${bx},${gy + k} L${bx},${by}`
        + ` M${bx - 7},${by - 8} L${bx},${by} L${bx + 7},${by - 8}`;
      svg.insertAdjacentHTML('beforeend', K.link(`link-${K.pad(i)}`, d, K.hueOf(rows[i])));
    }
    board.prepend(svg);
  },
};
