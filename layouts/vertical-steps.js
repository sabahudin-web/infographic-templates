// Layout: vertical steps (skill L2). data: cards [{ tag, logo|icon, title, by, body, chip }], payoff.
Layouts['vertical-steps'] = {
  ownPayoff: true,
  build(K) {
    const { D, board } = K;
    D.cards.forEach((c, i) => {
      const n = K.pad(i);
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${n}`; K.paint(el, i);
      el.innerHTML = `<div class="tag"><i>${n}</i>${c.tag}</div>
        <div class="slot">${c.logo ? K.logo(c.logo, 96) : `<span class="ic">${K.icon(c.icon, 44)}</span>`}</div>
        <div class="txt"><span class="by">${c.by}</span><h3>${c.title}</h3><p class="body">${c.body}</p></div>
        ${c.chip ? `<div class="chip"><span class="chip-text" id="chip-${n}">${c.chip}</span><span class="caret" id="caret-${n}"></span></div>` : ''}`;
      board.appendChild(el);
    });
    K.payoff();
  },
  connect(K) {
    // short arrows from each tool tile down to the next, and from the last into the payoff
    const svg = K.svgEl('links'), B = K.board.getBoundingClientRect();
    const slots = [...K.board.querySelectorAll('.slot')], cards = [...K.board.querySelectorAll('.card')];
    const pay = K.$('payoff');
    slots.forEach((s, i) => {
      const a = s.getBoundingClientRect();
      const next = slots[i + 1] ? slots[i + 1].getBoundingClientRect() : pay && pay.getBoundingClientRect();
      if (!next) return;
      const x = a.left + a.width / 2 - B.left, y1 = a.bottom - B.top + 6, y2 = next.top - B.top - 6;
      svg.insertAdjacentHTML('beforeend', K.link(`link-${K.pad(i + 1)}`,
        `M${x},${y1} L${x},${y2} M${x - 6},${y2 - 7} L${x},${y2} L${x + 6},${y2 - 7}`, K.hueOf(cards[Math.min(i + 1, cards.length - 1)])));
    });
    K.board.prepend(svg);
  },
};
