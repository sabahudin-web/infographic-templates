// Pyramid: tiers stack from a wide foundation to a narrow top (static skill 12, T11).
// Data lists the foundation first; the walk climbs from the bottom. Each tier links to its card.
Layouts['pyramid'] = {
  build(K) {
    const { D, board } = K, n = D.cards.length;
    const stack = document.createElement('div'); stack.className = 'py-stack'; stack.style.gridRow = `1 / span ${n}`;
    board.appendChild(stack);
    D.cards.forEach((c, i) => {
      const row = n - i; // foundation sits at the bottom
      const k = n - 1 - i; // 0 = top tier
      const top = 18 + k * (82 / n), bot = 18 + (k + 1) * (82 / n);
      const t = document.createElement('div'); t.className = 'py-tier'; K.paint(t, i);
      t.style.gridRow = row;
      t.style.clipPath = `polygon(${(100 - top) / 2}% 0, ${(100 + top) / 2}% 0, ${(100 + bot) / 2}% 100%, ${(100 - bot) / 2}% 100%)`;
      t.innerHTML = `<span>${c.tier}</span>`;
      board.appendChild(t);
      const el = K.card(c, i); K.paint(el, i); el.style.gridRow = row;
      board.appendChild(el);
    });
  },
  connect(K) {
    const { board } = K, B = board.getBoundingClientRect();
    const svg = K.svgEl('links');
    const tiers = [...board.querySelectorAll('.py-tier')], cards = [...board.querySelectorAll('.card')];
    tiers.forEach((t, i) => {
      const T = t.getBoundingClientRect(), C = cards[i].getBoundingClientRect();
      const y = T.top + T.height / 2 - B.top;
      // the slanted right edge at mid height
      const k = tiers.length - 1 - i, n = tiers.length;
      const mid = 18 + (k + 0.5) * (82 / n);
      const x1 = T.left - B.left + T.width * (100 + mid) / 200 + 8, x2 = C.left - B.left - 6;
      svg.insertAdjacentHTML('beforeend', K.link(`link-${K.pad(i)}`, `M${x1},${y} L${x2},${y}`, K.hueOf(cards[i]), { x: x1, y }));
    });
    board.prepend(svg);
  },
};
