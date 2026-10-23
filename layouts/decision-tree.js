// Decision tree: a ladder of yes/no questions (static skill 11). Yes runs down the left,
// each No branches right to its own outcome; the payoff strip is the last Yes.
Layouts['decision-tree'] = {
  build(K) {
    const { D, board } = K;
    D.cards.forEach((c, i) => {
      const row = document.createElement('div'); row.className = 'dt-row'; K.paint(row, i);
      const el = K.card(c, i); K.paint(el, i);
      row.appendChild(el);
      row.insertAdjacentHTML('beforeend', `<span class="dt-no">${D.noLabel || 'No'}</span>
        <div class="dt-out"><span class="dt-x">${K.icon('x', 20)}</span><p>${c.no}</p></div>`);
      board.appendChild(row);
    });
  },
  connect(K) {
    const { board, D } = K, B = board.getBoundingClientRect();
    const svg = K.svgEl('links');
    const rows = [...board.querySelectorAll('.dt-row')];
    const next = [...rows.map(r => r.querySelector('.card')), K.$('payoff')].filter(Boolean);
    rows.forEach((row, i) => {
      const c = row.querySelector('.card').getBoundingClientRect(), o = row.querySelector('.dt-out').getBoundingClientRect();
      // No: across to the outcome
      const ny = c.top + c.height / 2 - B.top, nx1 = c.right - B.left + 4, nx2 = o.left - B.left - 6;
      let d = `M${nx1},${ny} L${nx2},${ny} M${nx2 - 8},${ny - 7} L${nx2},${ny} L${nx2 - 8},${ny + 7}`;
      // Yes: down from the previous question into this one
      if (i > 0) {
        const p = next[i - 1].getBoundingClientRect(), x = c.left + c.width / 2 - B.left;
        const y1 = p.bottom - B.top + 3, y2 = c.top - B.top - 6;
        d = `M${x},${y1} L${x},${y2} M${x - 7},${y2 - 8} L${x},${y2} L${x + 7},${y2 - 8} ` + d;
        board.insertAdjacentHTML('beforeend', `<span class="dt-yes" style="left:${x + 14}px;top:${(y1 + y2) / 2}px">${D.yesLabel || 'Yes'}</span>`);
      }
      svg.insertAdjacentHTML('beforeend', K.link(`link-${K.pad(i)}`, d, K.hueOf(row)));
    });
    const last = rows[rows.length - 1].querySelector('.card').getBoundingClientRect(), pay = K.$('payoff');
    if (pay) {
      const P = pay.getBoundingClientRect(), x = last.left + last.width / 2 - B.left, y1 = last.bottom - B.top + 3, y2 = P.top - B.top - 6;
      svg.insertAdjacentHTML('beforeend', `<path d="M${x},${y1} L${x},${y2} M${x - 7},${y2 - 8} L${x},${y2} L${x + 7},${y2 - 8}" fill="none" stroke="var(--paper-ink)" stroke-opacity=".45" stroke-width="2.5" stroke-linecap="round"/>`);
      board.insertAdjacentHTML('beforeend', `<span class="dt-yes" style="left:${x + 14}px;top:${(y1 + y2) / 2}px">${D.yesLabel || 'Yes'}</span>`);
    }
    board.prepend(svg);
  },
};
