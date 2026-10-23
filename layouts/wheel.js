// Wheel / flywheel (static skill 28, T14): a hub in the middle, stops around a ring, arrows that
// carry the turn from one stop to the next, and a legend for the groups the stops belong to.
Layouts['wheel'] = {
  build(K) {
    const { D, board } = K;
    const groups = D.groups || [];
    const stage = document.createElement('div');
    stage.className = 'wh-stage'; stage.id = 'wh-stage';
    stage.innerHTML = `<div class="wh-ring"></div><section class="wh-hub" id="hub"><img src="../assets/logo/mark.svg" alt=""><b>${D.hub.title}</b><span>${D.hub.sub}</span></section>`;
    board.appendChild(stage);
    const n = D.cards.length;
    D.cards.forEach((c, i) => {
      const g = Math.max(0, groups.findIndex(x => x.name === c.group));
      const el = document.createElement('section');
      el.className = 'card wh-stop'; el.id = `card-${K.pad(i)}`; K.paint(el, g);
      const a = -Math.PI / 2 + i * 2 * Math.PI / n;
      el.style.setProperty('--x', (50 + 37 * Math.cos(a)).toFixed(2) + '%');
      el.style.setProperty('--y', (50 + 37 * Math.sin(a)).toFixed(2) + '%');
      const mark = c.logo ? K.logo(c.logo, 46) : `<span class="ic">${K.icon(c.icon, 24)}</span>`;
      el.innerHTML = `${mark}<b>${c.title}</b><span>${c.sub}</span>`;
      stage.appendChild(el);
    });
    if (groups.length) {
      const lg = document.createElement('div');
      lg.className = 'wh-legend';
      lg.innerHTML = groups.map((g, j) => `<span class="wh-key" id="key-${j}"><i></i><b>${g.name}</b>${g.sub}</span>`).join('');
      board.appendChild(lg);
      groups.forEach((g, j) => K.paint(lg.querySelector('#key-' + j), j));
    }
  },
  connect(K) {
    // an arc along the ring from each stop to the next, ending in an arrow, coloured like the stop it reaches
    const svg = K.svgEl('links'), S = K.$('wh-stage'), B = K.board.getBoundingClientRect(), R = S.getBoundingClientRect();
    const cx = R.left + R.width / 2 - B.left, cy = R.top + R.height / 2 - B.top, r = R.width * 0.37;
    const stops = [...S.querySelectorAll('.wh-stop')], n = stops.length;
    const gap = 0.36; // radians kept clear around each stop
    stops.forEach((el, i) => {
      const a0 = -Math.PI / 2 + (i - 1) * 2 * Math.PI / n + gap, a1 = -Math.PI / 2 + i * 2 * Math.PI / n - gap;
      const p = a => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
      const [x0, y0] = p(a0), [x1, y1] = p(a1);
      const t = a1 + Math.PI / 2, ah = 11;
      const back = (s) => [x1 - ah * Math.cos(t) + s * ah * 0.7 * Math.cos(t + Math.PI / 2), y1 - ah * Math.sin(t) + s * ah * 0.7 * Math.sin(t + Math.PI / 2)];
      const [ax, ay] = back(1), [bx, by] = back(-1);
      svg.insertAdjacentHTML('beforeend', K.link('link-' + K.pad(i),
        `M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1} M${ax},${ay} L${x1},${y1} L${bx},${by}`, K.hueOf(el)));
    });
    K.board.prepend(svg);
  },
};
