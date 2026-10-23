// Layout: growth curve, a trend over time (skill BP-growth-curve). One chart panel with the area
// curve; milestone cards below. Each milestone has a marker on the curve (link-NN) that draws in
// when its card lights up.
Layouts['growth-curve'] = {
  build(K) {
    const { D, board } = K;
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `<div class="panel-head"><span class="ic">${K.icon(D.chart.icon || 'chart-no-axes-column', 24)}</span><b>${D.chart.label}</b>${D.example ? '<span class="example-chip">Example data</span>' : ''}<span class="endlab">${D.chart.endLabel}</span></div><div class="plot" id="plot"></div>`;
    board.appendChild(panel);
    const row = document.createElement('div');
    row.className = 'miles';
    D.cards.forEach((c, i) => { const el = K.card(c, i); K.paint(el, i); el.insertAdjacentHTML('afterbegin', `<span class="when">${c.when}</span>`); row.appendChild(el); });
    board.appendChild(row);
  },
  connect(K) {
    const { D } = K;
    const plot = K.$('plot'), W = plot.clientWidth, H = plot.clientHeight;
    const L = 64, Rr = 30, T = 56, B = 46;
    const pts = D.chart.points, xMax = pts[pts.length - 1][0], yMax = D.chart.yMax || Math.max(...pts.map(p => p[1]));
    const X = x => L + (x / xMax) * (W - L - Rr), Y = y => T + (1 - y / yMax) * (H - T - B);
    // smooth curve through the points (Catmull-Rom as cubic Beziers)
    const P = pts.map(([x, y]) => [X(x), Y(y)]);
    let d = `M${P[0][0]},${P[0][1]}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
      d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
    }
    // the y of the drawn curve at a given screen x, found on the real path
    const probe = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    probe.setAttribute('d', d);
    const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); tmp.appendChild(probe); document.body.appendChild(tmp);
    const total = probe.getTotalLength();
    const yAtX = sx => { let lo = 0, hi = total; for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; probe.getPointAtLength(m).x < sx ? lo = m : hi = m; } return probe.getPointAtLength(lo).y; };
    let grid = '';
    for (let k = 0; k <= 4; k++) { const v = yMax * k / 4, y = Y(v); grid += `<line x1="${L}" y1="${y}" x2="${W - Rr}" y2="${y}" stroke="rgba(70,49,135,.09)" stroke-width="1.5" ${k ? 'stroke-dasharray="4 6"' : ''}/><text x="${L - 14}" y="${y + 6}" text-anchor="end">${Math.round(v)}</text>`; }
    const xt = D.chart.xTicks.map(([x, t]) => `<text x="${X(x)}" y="${H - 12}" text-anchor="middle">${t}</text>`).join('');
    let marks = '';
    D.cards.forEach((c, i) => {
      const x = X(c.x), y = yAtX(x), hue = K.hueOf(document.getElementById('card-' + K.pad(i)));
      marks += `<g class="link" id="link-${K.pad(i)}"><path d="M${x},${H - B} L${x},${y + 12}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" stroke="${hue}" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="${x}" cy="${y}" r="10" fill="#fff" stroke="${hue}" stroke-width="4"/><text class="mk" x="${x}" y="${y - 22}" text-anchor="middle" fill="${hue}">${i + 1}</text></g>`;
    });
    const end = pts[pts.length - 1];
    plot.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <defs><linearGradient id="gc-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CAF1CD" stop-opacity=".95"/><stop offset="1" stop-color="#CAF1CD" stop-opacity=".15"/></linearGradient></defs>
      ${grid}${xt}
      <path d="${d} L${X(end[0])},${Y(0)} L${X(pts[0][0])},${Y(0)} Z" fill="url(#gc-fill)"/>
      <path d="${d}" fill="none" stroke="#2F8F57" stroke-width="5" stroke-linecap="round"/>
      ${marks}
      <circle cx="${X(end[0])}" cy="${Y(end[1])}" r="9" fill="#2F8F57"/>
    </svg>`;
    tmp.remove();
  },
};
