// Layout: column-flow (skill BP column-flow map). data: band { title, chips[] }, cards: 3 columns
// [{ tag, icon, title, price, per, sections: [{ label, text }] }], payoff.
Layouts['column-flow'] = {
  ownPayoff: true,
  build(K) {
    const { D, board } = K;
    const band = document.createElement('section');
    band.className = 'cf-band'; band.id = 'hub';
    band.innerHTML = `<h2>${D.band.title}</h2><div class="chips">${D.band.chips.map(c => `<span>${c}</span>`).join('')}</div>`;
    board.appendChild(band);
    const cols = document.createElement('div'); cols.className = 'cf-cols';
    D.cards.forEach((c, i) => {
      const el = document.createElement('section');
      el.className = 'card'; el.id = `card-${K.pad(i)}`; K.paint(el, i);
      el.innerHTML = `<div class="tag"><i>${K.pad(i)}</i>${c.tag}</div>${c.icon ? `<span class="ic">${K.icon(c.icon, 24)}</span>` : ''}
        <h3>${c.title}</h3>${c.price ? `<div class="price">${c.price}<small>${c.per || ''}</small></div>` : ''}
        ${c.sections.map(s => `<div class="sec"><span>${s.label}</span><p>${s.text}</p></div>`).join('')}`;
      cols.appendChild(el);
    });
    board.appendChild(cols);
    K.payoff();
  },
  connect(K) {
    // arrows: band down into each column, each column down into the payoff
    const svg = K.svgEl('links'), B = K.board.getBoundingClientRect();
    const top = K.$('hub').getBoundingClientRect(), pay = K.$('payoff') && K.$('payoff').getBoundingClientRect();
    const arrow = (x, y1, y2) => `M${x},${y1 + 3} L${x},${y2 - 5} M${x - 6},${y2 - 11} L${x},${y2 - 4} L${x + 6},${y2 - 11}`;
    [...K.board.querySelectorAll('.card')].forEach((el, i) => {
      const C = el.getBoundingClientRect(), x = C.left + C.width / 2 - B.left;
      let d = arrow(x, top.bottom - B.top, C.top - B.top - 16);
      if (pay) d += ' ' + arrow(x, C.bottom - B.top, pay.top - B.top);
      svg.insertAdjacentHTML('beforeend', K.link(`link-${K.pad(i)}`, d, K.hueOf(el)));
    });
    K.board.prepend(svg);
  },
};
