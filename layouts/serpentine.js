// Serpentine: stops in two columns, the path runs left to right, down, right to left, down, and so on.
Layouts['serpentine'] = {
  build(K) {
    const { D, board } = K;
    D.cards.forEach((c, i) => {
      const row = Math.floor(i / 2), ltr = row % 2 === 0;
      const el = document.createElement('section');
      el.className = 'card' + (i === D.cards.length - 1 ? ' last' : ''); el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.style.gridRow = row + 1; el.style.gridColumn = ltr ? (i % 2) + 1 : 2 - (i % 2);
      el.innerHTML = `<div class="tag"><i>${K.pad(i)}</i>${c.tag}</div><span class="node" id="node-${K.pad(i)}">${i + 1}</span>
        <h3>${c.title}</h3><p class="body">${c.body}</p>${c.chip ? `<div class="chip"><span class="chip-text" id="chip-${K.pad(i)}">${c.chip}</span><span class="caret" id="caret-${K.pad(i)}"></span></div>` : ''}`;
      board.appendChild(el);
    });
  },
  connect(K) {
    const svg = K.svgEl('links'), B = K.board.getBoundingClientRect();
    const cards = [...K.board.querySelectorAll('.card')].map(el => ({ el, r: el.getBoundingClientRect() }));
    const arrow = (x, y, dx, dy) => `M${x - 7 * dx - 6 * dy},${y - 7 * dy - 6 * dx} L${x},${y} L${x - 7 * dx + 6 * dy},${y - 7 * dy + 6 * dx}`;
    for (let i = 1; i < cards.length; i++) {
      const a = cards[i - 1].r, b = cards[i].r;
      let d;
      if (Math.abs(a.top - b.top) < 5) { // same row: horizontal
        const y = a.top + a.height / 2 - B.top, right = b.left > a.left;
        const x1 = (right ? a.right : a.left) - B.left, x2 = (right ? b.left : b.right) - B.left, s = right ? 1 : -1;
        d = `M${x1 + 4 * s},${y} L${x2 - 6 * s},${y} ` + arrow(x2 - 5 * s, y, s, 0);
      } else { // down to the next row
        const x = a.left + a.width / 2 - B.left, y1 = a.bottom - B.top, y2 = b.top - B.top;
        d = `M${x},${y1 + 4} L${x},${y2 - 8} ` + arrow(x, y2 - 7, 0, 1);
      }
      svg.insertAdjacentHTML('beforeend', K.link(`link-${K.pad(i)}`, d, K.hueOf(cards[i].el)));
    }
    K.board.prepend(svg);
  },
};
