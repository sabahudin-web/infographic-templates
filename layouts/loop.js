// Method loop: steps evenly spaced on a ring around a centre disc; arcs with arrows run between them and back to the start.
Layouts['loop'] = {
  build(K) {
    const { D, board } = K;
    const c = document.createElement('div'); c.className = 'lp-centre'; c.id = 'hub';
    c.innerHTML = `<img src="../assets/logo/mark-dark.svg" alt=""><h2>${D.centre.title}</h2><p>${D.centre.sub}</p>`;
    board.appendChild(c);
    D.cards.forEach((x, i) => { const el = K.card(x, i); K.paint(el, i); board.appendChild(el); });
  },
  connect(K) {
    const { board } = K, W = board.clientWidth, H = board.clientHeight;
    const cards = [...board.querySelectorAll('.card')], n = cards.length;
    const cx = W / 2, cy = H / 2, rx = W / 2 - 176, ry = H / 2 - 100;
    const ang = i => -Math.PI / 2 + i * 2 * Math.PI / n;
    const at = a => [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
    Object.assign(K.$('hub').style, { left: cx + 'px', top: cy + 'px' });
    cards.forEach((el, i) => { const [x, y] = at(ang(i)); Object.assign(el.style, { left: x + 'px', top: y + 'px' }); });
    // arcs run in the gap between neighbouring cards, along the same ellipse
    const svg = K.svgEl('links'), gap = Math.PI / n * 0.56;
    svg.insertAdjacentHTML('beforeend', `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="var(--purple)" stroke-opacity=".12" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>`);
    cards.forEach((el, i) => {
      const a0 = ang(i - 1) + gap, a1 = ang(i) - gap, pts = [];
      for (let k = 0; k <= 24; k++) pts.push(at(a0 + (a1 - a0) * k / 24));
      const [ex, ey] = pts[24], [px, py] = pts[22], dx = ex - px, dy = ey - py, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
      const d = 'M' + pts.map(p => p.join(',')).join(' L') + ` M${ex - 11 * ux - 7 * uy},${ey - 11 * uy + 7 * ux} L${ex},${ey} L${ex - 11 * ux + 7 * uy},${ey - 11 * uy - 7 * ux}`;
      svg.insertAdjacentHTML('beforeend', K.link(`link-${K.pad(i)}`, d, K.hueOf(el)));
    });
    board.prepend(svg);
  },
};
