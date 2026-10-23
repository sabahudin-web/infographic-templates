// Comparison matrix: option heads across the top, then one card per attribute row.
Layouts['matrix'] = {
  build(K) {
    const { D, board } = K;
    const rec = D.options.findIndex(o => o.rec);
    const head = document.createElement('div');
    head.className = 'mx-head';
    head.innerHTML = '<span></span>' + D.options.map((o, j) =>
      `<div class="mx-opt${j === rec ? ' rec' : ''}" ${j === rec ? `data-flag="${D.recLabel || 'Best fit'}"` : ''}><b>${o.name}</b><span>${o.sub}</span></div>`).join('');
    board.appendChild(head);
    D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.innerHTML = `<div class="mx-label">${c.icon ? `<span class="ic">${K.icon(c.icon, 22)}</span>` : ''}<b>${c.tag}</b></div>` +
        c.cells.map((x, j) => `<div class="mx-cell${j === rec ? ' rec' : ''}">${x}</div>`).join('');
      board.appendChild(el);
    });
  },
};
